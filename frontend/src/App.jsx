import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AllBooks from "./pages/AllBooks";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ViewBook from "./components/ViewBook";
import { useDispatch } from "react-redux";
import { authActions } from "./store/auth";
import Favourites from "./pages/Favourites";
import Wallet from "./pages/Wallet";
import NovelReader from "./pages/NovelReader";
import Settings from "./pages/Settings";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactUs from "./pages/ContactUs";
import FloatingContact from "./components/FloatingContact";
import BecomeAuthor from "./pages/BecomeAuthor";
import AuthorProfile from "./pages/AuthorProfile";
import TransactionHistory from "./pages/TransactionHistory";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      localStorage.getItem("token") &&
      localStorage.getItem("id") &&
      localStorage.getItem("role")
    ) {
      dispatch(authActions.login());
      dispatch(authActions.setRole(localStorage.getItem("role")));
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 dark:text-parchment-100 transition-colors duration-300">
      <ScrollToTop />
      {/* ToastContainer for displaying notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/books" element={<AllBooks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/read/:novel_id/:chapter_id" element={<NovelReader />} />

        {/* Profile route with nested routes */}
        <Route path="/profile" element={<Profile />}>
          <Route index element={<Favourites />} /> {/* Default route */}
          <Route path="library" element={<Favourites />} />
          <Route path="orderhistory" element={<TransactionHistory />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/view_detail/:book_id" element={<ViewBook />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/become-author" element={<BecomeAuthor />} />
        <Route path="/author-profile" element={<AuthorProfile />} />
      </Routes>
      <FloatingContact />
      <Footer />
    </div>
  );
};

export default App;
