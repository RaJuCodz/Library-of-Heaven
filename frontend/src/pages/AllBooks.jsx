import { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import { FaSort, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";
import { apiUrl } from "../api";

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("price-low");
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(apiUrl("/get_all_books"));
        setBooks(response.data.data);
        setFilteredBooks(response.data.data);

        if (localStorage.getItem("token")) {
          try {
            const favResponse = await axios.get(apiUrl("/get_fav_books"), {
              headers: {
                id: localStorage.getItem("id"),
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            setFavorites(favResponse.data.data.map((book) => book._id));
          } catch (err) {
            console.error("Error fetching favorites:", err);
          }
        }
      } catch (error) {
        console.error("Error fetching all books:", error);
        toast.error("Failed to load books. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Handle sorting
  const handleSort = (sortType) => {
    setSortBy(sortType);
    let sorted = [...books];

    if (sortType === "price-low") {
      sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortType === "price-high") {
      sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    setFilteredBooks(sorted);
  };

  // Handle adding/removing from favorites
  const toggleFavorite = async (bookId) => {
    if (!localStorage.getItem("token")) {
      toast.info("Please login to add favorites");
      return;
    }

    const headers = {
      id: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
      book_id: bookId,
    };

    try {
      if (favorites.includes(bookId)) {
        await axios.delete(apiUrl("/remove_from_fav"), {
          headers,
        });
        setFavorites(favorites.filter((id) => id !== bookId));
        toast.success("Removed from favorites");
      } else {
        await axios.post(apiUrl("/add_to_fav"), {}, { headers });
        setFavorites([...favorites, bookId]);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites");
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4">
        {/* Top Section with Title and Image */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Our Collection
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Discover our vast collection of books, from timeless classics to
              contemporary bestsellers.
            </p>
          </div>
          <div className="hidden lg:block w-1/3">
            <img
              src="/images/luffy.png"
              alt="Luffy"
              className="w-full h-auto transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-12 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <FaSearch className="text-red-500 w-5 h-5" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Search Comics
                  </h3>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by title..."
                    className="w-full px-4 py-2.5 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <FaSort className="text-red-500 w-5 h-5" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sort By Price
                  </h3>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSort("price-low")}
                    className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300 text-base ${
                      sortBy === "price-low"
                        ? "bg-red-500 text-white shadow-sm"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <FaSort className="w-4 h-4" />
                    Low to High
                  </button>
                  <button
                    onClick={() => handleSort("price-high")}
                    className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300 text-base ${
                      sortBy === "price-high"
                        ? "bg-red-500 text-white shadow-sm"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <FaSort className="w-4 h-4" />
                    High to Low
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Books Section */}
        <div className="relative">
          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  onFavoriteClick={toggleFavorite}
                  isFavorite={favorites.includes(book._id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 mb-4">
                No books available at the moment.
              </p>
              <Button
                onClick={() => {
                  setSortBy("price-low");
                  setFilteredBooks(books);
                }}
                variant="outline"
              >
                Reset Sort
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBooks;
