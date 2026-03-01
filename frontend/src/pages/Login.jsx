import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { authActions } from "../store/auth";
import { useDispatch } from "react-redux";
import { FaBook, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData]   = useState({ username: "", password: "" });
  const [errors, setErrors]       = useState({});
  const [showPwd, setShowPwd]     = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.username) errs.username = "Username is required";
    if (!formData.password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/signin`, formData)
      .then((res) => {
        if (res.data.token) {
          dispatch(authActions.setRole(res.data.role));
          dispatch(authActions.login());
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("id",    res.data.id);
          localStorage.setItem("role",  res.data.role);
          navigate("/profile");
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message;
        setErrors(
          msg === "Invalid or expired token"
            ? { server: msg, expiredToken: true }
            : { server: "Invalid username or password" }
        );
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative overflow-hidden bg-navy-900">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/library.jpg"
          alt="Library"
          className="w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900/90 via-navy-900/75 to-wine-900/60" />
      </div>

      {/* Decorative rings */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full border border-wine-600/10 z-0" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full border border-toffee-600/10 z-0" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-parchment-50/95 dark:bg-navy-800/95 backdrop-blur-md rounded-2xl shadow-glass border border-parchment-300/30 dark:border-navy-600/50 p-8 md:p-10">

          {/* Brand mark */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-wine-600/10 dark:bg-wine-500/20 flex items-center justify-center mb-4 shadow-inner">
              <FaBook className="w-6 h-6 text-wine-600 dark:text-wine-400" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-parchment-900 dark:text-parchment-100">
              Welcome Back
            </h1>
            <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400 mt-2">
              Sign in to continue your reading journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Username */}
            <div>
              <label className="field-label" htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="input-field"
                autoComplete="username"
              />
              {errors.username && (
                <p className="mt-1.5 text-xs text-wine-600 dark:text-wine-400 font-sans">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="field-label" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input-field pr-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-toffee-500 dark:text-toffee-400 hover:text-wine-600 dark:hover:text-wine-400 transition-colors"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-wine-600 dark:text-wine-400 font-sans">{errors.password}</p>
              )}
            </div>

            {/* Server error */}
            {errors.server && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-wine-50 dark:bg-wine-900/20 border border-wine-200 dark:border-wine-800">
                <p className="text-xs text-wine-700 dark:text-wine-400 font-sans">{errors.server}</p>
              </div>
            )}

            {errors.expiredToken && (
              <p className="text-center text-xs font-sans text-toffee-600 dark:text-toffee-400">
                Please{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-wine-600 dark:text-wine-400 font-semibold underline hover:no-underline"
                >
                  create an account
                </button>
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={[
                "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-sans font-semibold text-sm text-parchment-50 tracking-wide shadow-md transition-all duration-300",
                isLoading
                  ? "bg-wine-400 cursor-not-allowed"
                  : "bg-wine-600 hover:bg-wine-700 active:bg-wine-800 hover:shadow-glow-wine hover:scale-[1.01]",
              ].join(" ")}
            >
              {isLoading && (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
              {isLoading ? "Signing In…" : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-parchment-300 dark:bg-navy-600" />
            <span className="font-sans text-xs text-toffee-500 dark:text-toffee-500">New here?</span>
            <div className="h-px flex-1 bg-parchment-300 dark:bg-navy-600" />
          </div>

          <Link
            to="/signup"
            className="w-full flex items-center justify-center py-3 rounded-xl border-2 border-parchment-400 dark:border-navy-500 font-sans font-semibold text-sm text-toffee-700 dark:text-parchment-300 hover:border-wine-600 dark:hover:border-wine-500 hover:text-wine-600 dark:hover:text-wine-400 transition-all duration-250"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
