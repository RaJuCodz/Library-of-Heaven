import React from "react";
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
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/books" element={<AllBooks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Carts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/view_detail/:book_id" element={<ViewBook />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
