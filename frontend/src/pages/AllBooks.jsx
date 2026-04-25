import { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import { toast } from "react-toastify";
import { FaSearch, FaBook, FaSortAmountUp, FaSortAmountDown, FaFilter } from "react-icons/fa";

const GENRES = ["All", "Fantasy", "Romance", "Thriller", "Sci-Fi", "Historical", "Action", "Horror", "Mystery", "Drama"];

const AllBooks = () => {
  const [books, setBooks]               = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [sortBy, setSortBy]             = useState("price-low");
  const [favorites, setFavorites]       = useState([]);
  const [searchQuery, setSearchQuery]   = useState("");
  const [activeGenre, setActiveGenre]   = useState("All");

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
    applyFilters(searchQuery, activeGenre, type);
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
    } catch { toast.error("Failed to update favourites"); }
  };

  const applyFilters = (query, genre, sort, source = books) => {
    let filtered = source.filter((b) => {
      const matchesSearch = b.title.toLowerCase().includes(query.toLowerCase());
      const matchesGenre  = genre === "All" || (b.genres || []).some(g => g.toLowerCase() === genre.toLowerCase());
      return matchesSearch && matchesGenre;
    });
    filtered = [...filtered].sort((a, b) =>
      sort === "price-low"
        ? parseFloat(a.price) - parseFloat(b.price)
        : parseFloat(b.price) - parseFloat(a.price)
    );
    setFilteredBooks(filtered);
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    applyFilters(q, activeGenre, sortBy);
  };

  const handleGenre = (genre) => {
    setActiveGenre(genre);
    applyFilters(searchQuery, genre, sortBy);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSortBy("price-low");
    setActiveGenre("All");
    setFilteredBooks(books);
  };

  return (
    <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 pt-24 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page header ─────────────────────────────── */}
        <div className="mb-12">
          <p className="section-subheading mb-3">Our Collection</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-parchment-900 dark:text-parchment-50 leading-tight">
              Explore the{" "}
              <span className="italic font-light"
                style={{
                  background: 'linear-gradient(135deg, #C9A84C 0%, #F0DE9A 50%, #9A7A1F 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Library
              </span>
            </h1>
            {!isLoading && (
              <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400 shrink-0">
                {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <div className="divider-gilt mt-5" />
        </div>

        {/* ── Filter bar ──────────────────────────────── */}
        <div className="bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 shadow-card dark:shadow-card-dark p-5 mb-10">
          <div className="flex flex-col sm:flex-row gap-5 items-end">

            {/* Search */}
            <div className="flex-1">
              <label className="field-label" htmlFor="search">Search Novels</label>
              <div className="relative">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-toffee-500 pointer-events-none" />
                <input
                  id="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search by title…"
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="field-label">Sort by Price</label>
              <div className="flex gap-2">
                {[
                  { id: "price-low",  label: "Low → High", icon: FaSortAmountUp   },
                  { id: "price-high", label: "High → Low", icon: FaSortAmountDown },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleSort(id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans font-semibold
                      transition-all duration-200 border whitespace-nowrap
                      ${sortBy === id
                        ? 'text-navy-950 border-gilt-500 shadow-sm'
                        : 'bg-parchment-100 dark:bg-navy-700 text-toffee-700 dark:text-parchment-300 border-parchment-300 dark:border-navy-500 hover:border-gilt-500/50 dark:hover:border-gilt-500/40'
                      }`}
                    style={sortBy === id ? { background: 'linear-gradient(135deg, #F0DE9A, #C9A84C)' } : {}}
                  >
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset */}
            {(searchQuery || sortBy !== "price-low") && (
              <button onClick={resetFilters}
                className="px-4 py-2.5 rounded-xl border border-parchment-300 dark:border-navy-500
                  text-toffee-600 dark:text-toffee-400 hover:border-wine-400 dark:hover:border-wine-600
                  font-sans text-xs font-medium transition-all duration-200 whitespace-nowrap"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* ── Genre chips ─────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenre(genre)}
              className="font-sans text-xs font-medium px-4 py-2 rounded-full border transition-all duration-200"
              style={activeGenre === genre ? {
                color: '#F9F6F2',
                background: '#801818',
                borderColor: '#801818',
                fontWeight: 600,
              } : {
                color: '#6B5C42',
                background: '#FDFCFB',
                borderColor: '#DDD3C5',
              }}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* ── Books grid ──────────────────────────────── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-2 border-gilt-500 border-t-transparent rounded-full animate-spin" />
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
          <div className="flex flex-col items-center justify-center py-32 gap-5">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.10), rgba(201,168,76,0.04))' }}
            >
              <FaBook className="w-8 h-8 text-gilt-500 dark:text-gilt-400" />
            </div>
            <div className="text-center">
              <p className="font-serif text-2xl font-bold text-parchment-700 dark:text-parchment-300 mb-1">
                No books found
              </p>
              <p className="font-sans text-sm text-toffee-500 dark:text-toffee-400">
                Try adjusting your search or filters
              </p>
            </div>
            <button onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl font-sans font-semibold text-sm text-navy-950
                shadow-sm hover:shadow-glow-gilt transition-all duration-250"
              style={{ background: 'linear-gradient(135deg, #F0DE9A, #C9A84C, #B8922A)' }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBooks;
