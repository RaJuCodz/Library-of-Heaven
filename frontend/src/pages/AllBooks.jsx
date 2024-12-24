// AllBooks.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../components/BookCard"; // Import the reusable BookCard component

const AllBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/get_all_books" // Replace with your actual endpoint
        );
        setBooks(response.data.data);
      } catch (error) {
        console.error("Error fetching all books:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="py-8 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-[#ff7043]">
          All Books
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllBooks;
