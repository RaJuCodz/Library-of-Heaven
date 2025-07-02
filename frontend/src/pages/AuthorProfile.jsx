import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BookCard from "../components/BookCard";
import Button from "../components/ui/Button";
import { apiUrl } from "../api";

const AuthorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    cover_image: "",
    price: "",
    description: "",
  });
  const [imageUploading, setImageUploading] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [authorOrders, setAuthorOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/profile");
      return;
    }
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        const headers = {
          Authorization: `Bearer ${token}`,
          id,
        };
        const response = await axios.get(
          apiUrl("/get_user_info"),
          { headers }
        );
        setProfile(response.data);
      } catch {
        setError("Failed to load author profile");
      }
    };
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        const headers = {
          Authorization: `Bearer ${token}`,
          id,
        };
        const myBooksResponse = await axios.get(
          apiUrl("/get_my_books"),
          { headers }
        );
        setBooks(myBooksResponse.data.data);
      } catch {
        setBooks([]);
      }
    };
    const fetchAuthorOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        const headers = {
          Authorization: `Bearer ${token}`,
          id,
        };
        const ordersResponse = await axios.get(
          apiUrl("/get_author_orders"),
          { headers }
        );
        setAuthorOrders(ordersResponse.data.data);
      } catch {
        setAuthorOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchProfile();
    fetchBooks();
    fetchAuthorOrders();
  }, [navigate]);

  const handleAddBook = async (e) => {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      const headers = {
        Authorization: `Bearer ${token}`,
        id,
      };
      const bookData = { ...newBook, author: profile.authorName };
      const addBookResponse = await axios.post(
        apiUrl("/add_book"),
        bookData,
        { headers }
      );
      setAddSuccess("Book added successfully!");
      setShowAddForm(false);
      setNewBook({
        title: "",
        author: "",
        cover_image: "",
        price: "",
        description: "",
      });
      setBooks((prev) => [addBookResponse.data.book, ...prev]);
    } catch (err) {
      setAddError(err.response?.data?.message || "Failed to add book");
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      const headers = {
        Authorization: `Bearer ${token}`,
        id,
        book_id: bookId,
      };
      await axios.delete(
        apiUrl("/delete_book"),
        { headers: { ...headers, book_id: bookId } }
      );
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete book");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    setAddError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      const headers = {
        Authorization: `Bearer ${token}`,
        id,
      };
      const uploadResponse = await axios.post(
        apiUrl("/upload_image"),
        formData,
        { headers: { ...headers, "Content-Type": "multipart/form-data" } }
      );
      setNewBook((prev) => ({ ...prev, cover_image: uploadResponse.data.imageUrl }));
    } catch {
      setAddError("Image upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  if (error)
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!profile) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'url("/images/spidy.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-red-50">
                  <img
                    src={profile.avatar}
                    alt="avatar"
                    className="w-28 h-28 rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {profile.authorName}
                </h1>
                <div className="flex flex-col md:flex-row gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Bio:</span> {profile.bio}
                  </div>
                  {profile.email && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Email:</span>{" "}
                      {profile.email}
                    </div>
                  )}
                  {profile.address && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Address:</span>{" "}
                      {profile.address}
                    </div>
                  )}
                  {profile.createdAt && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Member since:</span>{" "}
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("id");
                  localStorage.removeItem("role");
                  navigate("/login");
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Author Actions */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">My Books</h2>
          <Button onClick={() => setShowAddForm((v) => !v)}>
            {showAddForm ? "Cancel" : "Add New Book"}
          </Button>
        </div>

        {/* Add Book Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddBook}
            className="bg-white rounded-xl shadow-md p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label
                className="block text-sm font-semibold text-gray-900"
                htmlFor="title"
              >
                Title
              </label>
              <input
                id="title"
                name="title"
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
                className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-semibold text-gray-900"
                htmlFor="image"
              >
                Book Cover Image
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg"
                required
              />
              {imageUploading && (
                <p className="text-gray-500 text-sm mt-1">Uploading image...</p>
              )}
              {newBook.cover_image && !imageUploading && (
                <img
                  src={newBook.cover_image}
                  alt="Preview"
                  className="mt-2 w-24 h-24 object-cover rounded"
                />
              )}
            </div>
            <div>
              <label
                className="block text-sm font-semibold text-gray-900"
                htmlFor="price"
              >
                Price
              </label>
              <input
                id="price"
                name="price"
                value={newBook.price}
                onChange={(e) =>
                  setNewBook({ ...newBook, price: e.target.value })
                }
                className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-semibold text-gray-900"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newBook.description}
                onChange={(e) =>
                  setNewBook({ ...newBook, description: e.target.value })
                }
                className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg"
                rows={3}
                required
              />
            </div>
            {addError && (
              <p className="text-red-500 text-sm col-span-2">{addError}</p>
            )}
            {addSuccess && (
              <p className="text-green-600 text-sm col-span-2">{addSuccess}</p>
            )}
            <div className="col-span-2 flex justify-end">
              <Button
                type="submit"
                disabled={imageUploading || !newBook.cover_image}
              >
                Add Book
              </Button>
            </div>
          </form>
        )}

        {/* Books List */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {books.length === 0 ? (
            <p className="text-gray-600 col-span-4">No books found.</p>
          ) : (
            books.map((book) => (
              <div key={book._id} className="relative group">
                <BookCard book={book} small />
                <button
                  className="absolute top-2 left-2 z-20 p-1 bg-white/80 hover:bg-red-100 rounded-full text-gray-500 hover:text-red-600 transition-all duration-300 shadow-md hover:shadow-lg text-xs"
                  onClick={() => handleDeleteBook(book._id)}
                  title="Delete Book"
                >
                  Delete
                </button>
              </div>
            ))
          }
        </div>

        {/* Author Orders Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Orders for Your Books
          </h2>
          {ordersLoading ? (
            <p>Loading orders...</p>
          ) : authorOrders.length === 0 ? (
            <p className="text-gray-600">No orders for your books yet.</p>
          ) : (
            <div className="space-y-4">
              {authorOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-lg p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="font-semibold">{order.book.title}</div>
                    <div className="text-sm text-gray-500">
                      Ordered by: {order.user.username} ({order.user.email})
                    </div>
                    <div className="text-sm text-gray-500">
                      Order Date:{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <span
                      className={`font-bold ${
                        order.status === "Order Placed"
                          ? "text-yellow-600"
                          : order.status === "Order Shipped"
                          ? "text-blue-600"
                          : order.status === "Order Delivered"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorProfile;
