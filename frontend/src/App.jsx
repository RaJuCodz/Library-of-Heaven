import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AllBooks from "./pages/AllBooks";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Carts from "./pages/Carts";
import Profile from "./pages/Profile";
import ViewBook from "./components/ViewBook";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store/auth";
import Favourites from "./pages/Favourites";
import OrderHistory from "./pages/OrderHistory";
import Settings from "./pages/Settings";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);

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
    <div>
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
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
