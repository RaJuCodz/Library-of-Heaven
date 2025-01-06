import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../components/BookCard"; // Import the reusable BookCard component

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/get_all_books" // Replace with your actual endpoint
        );
        setBooks(response.data.data);
        setFilteredBooks(response.data.data); // Initialize filtered books with all books
      } catch (error) {
        console.error("Error fetching all books:", error);
      }
    };

    fetchBooks();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
    setFilteredBooks(filtered);
  };

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <h2 className="text-4xl font-extrabold mb-8 text-center text-yellow-400">
          Explore Our Collection
        </h2>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search for books by title or author..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-6 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* Book Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No books found.</p>
        )}

        {/* Pagination (Optional) */}
        {/* <div className="flex justify-center mt-8">
          <button className="px-6 py-2 bg-gray-800 text-white rounded-lg mx-2 hover:bg-gray-700">
            Previous
          </button>
          <button className="px-6 py-2 bg-gray-800 text-white rounded-lg mx-2 hover:bg-gray-700">
            Next
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default AllBooks;
