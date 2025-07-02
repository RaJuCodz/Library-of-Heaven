import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store/auth";
import { useDispatch } from "react-redux";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.username) formErrors.username = "Username is required";
    if (!formData.password) formErrors.password = "Password is required";
    return formErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      console.log("Form submitted successfully", formData);
      axios
        .post("https://library-of-heaven.onrender.com/api/v1/signin", formData)
        .then((response) => {
          console.log(response);
          if (response.data.token) {
            dispatch(authActions.setRole(response.data.role));
            dispatch(authActions.login());
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("id", response.data.id);
            localStorage.setItem("role", response.data.role);
            navigate("/profile");
          }
        })
        .catch((error) => {
          const errorMsg = error.response?.data.message || error.message;
          console.error("Login error:", errorMsg);
          if (errorMsg === "Invalid or expired token") {
            setErrors({ server: errorMsg, expiredToken: true });
          } else {
            setErrors({ server: "Invalid username or password" });
          }
        });
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/library.jpg"
          alt="Library Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Login Form */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg z-10 mx-4">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">
          Welcome Back
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Sign in to access your account
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label
              className="block text-sm font-semibold text-gray-900"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-sm font-semibold text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Server Error */}
          {errors.server && (
            <p className="text-red-500 text-sm text-center">{errors.server}</p>
          )}
          {/* Show Sign Up option if token expired */}
          {errors.expiredToken && (
            <div className="flex justify-center mt-2">
              <button
                type="button"
                className="text-blue-600 underline hover:text-blue-800"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 shadow-sm"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
