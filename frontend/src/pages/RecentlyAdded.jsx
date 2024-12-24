// RecentlyAdded.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";

const RecentlyAdded = () => {
  const [Data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/get_recent_books"
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="py-8 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-[#ff7043]">
          Recently Added Books
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Data.map((book) => (
            <BookCard key={book._id} book={book} /> // Pass the book as a prop
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyAdded;
