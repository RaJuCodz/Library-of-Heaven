import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AllBooks from "./pages/AllBooks";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Carts from "./pages/Carts";
import Profile from "./pages/Profile";
import ViewBook from "./components/ViewBook";
import { useDispatch } from "react-redux";
import { authActions } from "./store/auth";
import Favourites from "./pages/Favourites";
import OrderHistory from "./pages/OrderHistory";
import Settings from "./pages/Settings";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactUs from "./pages/ContactUs";
import FloatingContact from "./components/FloatingContact";
import BecomeAuthor from "./pages/BecomeAuthor";
import AuthorProfile from "./pages/AuthorProfile";

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
    <div className="min-h-screen bg-gray-50">
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
        <Route path="/cart" element={<Carts />} />

        {/* Profile route with nested routes */}
        <Route path="/profile" element={<Profile />}>
          <Route index element={<Favourites />} /> {/* Default route */}
          <Route path="favourites" element={<Favourites />} />
          <Route path="orderhistory" element={<OrderHistory />} />
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
