import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";

const BecomeAuthor = () => {
  const [authorName, setAuthorName] = useState("");
  const [bio, setBio] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      const headers = {
        Authorization: `Bearer ${token}`,
        id,
      };
      const response = await axios.post(
        "https://library-of-heaven.onrender.com/api/v1/become_author",
        {},
        { headers }
      );
      setSuccess(response.data.message);
      localStorage.setItem("role", "admin");
      dispatch(authActions.setRole("admin"));
      setTimeout(() => navigate("/author-profile"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to become author. Try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md z-10 mx-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Become an Author
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-sm font-semibold text-gray-900"
              htmlFor="authorName"
            >
              Author Name
            </label>
            <input
              id="authorName"
              name="authorName"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-semibold text-gray-900"
              htmlFor="bio"
            >
              Tell us about yourself (bio)
            </label>
            <textarea
              id="bio"
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 mt-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={4}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green-600 text-sm text-center">{success}</p>
          )}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 shadow-sm"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeAuthor;
