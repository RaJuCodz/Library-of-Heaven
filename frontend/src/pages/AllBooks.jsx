import { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import { FaSortAmountDown, FaSortAmountUp, FaSearch, FaBook } from "react-icons/fa";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";

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
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/get_all_novels`);
        setBooks(res.data.data);
        setFilteredBooks(res.data.data);

        if (localStorage.getItem("token")) {
          try {
            const favRes = await axios.get(`${import.meta.env.VITE_API_URL}/get_library`, {
              headers: {
                id: localStorage.getItem("id"),
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            setFavorites(favRes.data.data.map((b) => b._id));
          } catch { /* ignore */ }
        }
      } catch {
        toast.error("Failed to load books. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleSort = (type) => {
    setSortBy(type);
    const sorted = [...books].sort((a, b) =>
      type === "price-low"
        ? parseFloat(a.price) - parseFloat(b.price)
        : parseFloat(b.price) - parseFloat(a.price)
    );
    setFilteredBooks(sorted);
  };

  const toggleFavorite = async (bookId) => {
    if (!localStorage.getItem("token")) { toast.info("Please login to add favourites"); return; }
    const headers = {
      id: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
      book_id: bookId,
    };
    try {
      if (favorites.includes(bookId)) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/remove_from_library`, { headers });
        setFavorites(favorites.filter((id) => id !== bookId));
        toast.success("Removed from Library");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/add_to_library`, {}, { headers });
        setFavorites([...favorites, bookId]);
        toast.success("Added to Library!");
      }
    } catch {
      toast.error("Failed to update favourites");
    }
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    setFilteredBooks(books.filter((b) => b.title.toLowerCase().includes(q.toLowerCase())));
  };

  return (
    <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 pt-24 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-12">
          <div>
            <p className="section-subheading mb-2">Our Library</p>
            <h1 className="font-serif text-5xl font-bold text-parchment-900 dark:text-parchment-100">
              Explore the Collection
            </h1>
            <p className="font-sans text-base text-toffee-700 dark:text-parchment-400 mt-3 max-w-lg">
              From timeless classics to contemporary bestsellers — every story deserves a reader.
            </p>
          </div>
          <div className="hidden lg:block">
            <img
              src="/images/luffy.png"
              alt="Collection illustration"
              className="h-40 w-auto object-contain drop-shadow-xl animate-float"
            />
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 shadow-card dark:shadow-card-dark p-5 mb-10">
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Search */}
            <div className="flex-1">
              <p className="field-label mb-2">Search Books</p>
              <div className="relative">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-toffee-500 dark:text-toffee-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search by title…"
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="sm:w-64">
              <p className="field-label mb-2">Sort by Price</p>
              <div className="flex gap-2">
                {[
                  { id: "price-low", label: "Low → High", icon: FaSortAmountUp },
                  { id: "price-high", label: "High → Low", icon: FaSortAmountDown },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleSort(id)}
                    className={[
                      "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-sans font-semibold transition-all duration-200 border",
                      sortBy === id
                        ? "bg-wine-600 text-parchment-50 border-wine-600 shadow-sm"
                        : "bg-parchment-100 dark:bg-navy-700 text-toffee-700 dark:text-parchment-300 border-parchment-300 dark:border-navy-500 hover:border-wine-400 dark:hover:border-wine-600",
                    ].join(" ")}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        {!isLoading && (
          <p className="font-sans text-xs text-toffee-600 dark:text-toffee-400 mb-6 tracking-wide">
            {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Books grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-2 border-wine-600 border-t-transparent rounded-full animate-spin" />
            <p className="font-sans text-sm text-toffee-500 dark:text-toffee-400">Loading books…</p>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-parchment-300 dark:bg-navy-700 flex items-center justify-center">
              <FaBook className="w-7 h-7 text-toffee-500 dark:text-toffee-400" />
            </div>
            <p className="font-serif text-xl text-parchment-700 dark:text-parchment-300">No books found</p>
            <p className="font-sans text-sm text-toffee-500 dark:text-toffee-400">Try adjusting your search query</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setSearchQuery(""); setFilteredBooks(books); setSortBy("price-low"); }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBooks;
