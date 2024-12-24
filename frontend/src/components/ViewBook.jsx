import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewBook = () => {
  const { book_id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/get_book_by_id/${book_id}`
        );
        setBook(response.data.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    if (book_id) {
      fetchBook();
    }
  }, [book_id]);

  if (!book) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <p>Loading book details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="container mx-auto px-6">
        <div className="bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image Section */}
            <div className="flex-shrink-0 md:w-1/3">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-[400px] sm:h-[500px] md:h-[600px] object-cover rounded-lg"
              />
            </div>

            {/* Details Section */}
            <div className="md:w-2/3 p-8 flex flex-col justify-between">
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-yellow-300">
                {book.title}
              </h1>

              {/* Description */}
              <p className="text-neon-yellow text-xl sm:text-2xl leading-relaxed mb-8">
                {book.description}
              </p>

              {/* Price and Buttons */}
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#ff7043] mb-6">
                  Price: {book.price}
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Buy Now Button */}
                  <a
                    href={book.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-[#ff7043] text-white text-lg font-semibold rounded hover:bg-[#ff5722] hover:scale-105 transform transition-all duration-300"
                  >
                    Buy Now
                  </a>

                  {/* View More Button */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBook;
