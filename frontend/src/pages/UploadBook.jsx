import React, { useState } from "react";
import axios from "axios";

const UploadBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [pdf, setPdf] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("cover_image", coverImage);
      formData.append("pdf", pdf);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/add_book`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            id,
          },
        }
      );
      setSuccess("Book uploaded successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to upload book. Try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md z-10 mx-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Upload a Book
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Cover Image URL"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
            required
          />
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files[0])}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
            required
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green-600 text-sm text-center">{success}</p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 shadow-sm"
          >
            Upload Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadBook;
