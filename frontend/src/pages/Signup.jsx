import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaBook, FaEye, FaEyeSlash } from "react-icons/fa";
import ParticleCanvas from "../components/ParticleCanvas";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Bloom filter state
  const [usernameStatus, setUsernameStatus] = useState(null); // 'available' | 'taken' | null
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "username") {
      setUsernameStatus(null);
    }
  };

  // Debounced username check using the Bloom Filter API
  useEffect(() => {
    const checkUsername = async () => {
      if (!formData.username || formData.username.length < 4) {
        setUsernameStatus(null);
        return;
      }
      setIsCheckingUsername(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/check-username?username=${formData.username}`,
        );
        setUsernameStatus(response.data.available ? "available" : "taken");
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameStatus(null);
      } finally {
        setIsCheckingUsername(false);
      }
    };

    const timeoutId = setTimeout(checkUsername, 1000);
    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  const validate = () => {
    const errs = {};
    if (!formData.username) errs.username = "Username is required";
    if (formData.username && formData.username.length < 4)
      errs.username = "Username must be at least 4 characters";
    if (usernameStatus === "taken") errs.username = "Username is already taken";
    if (!formData.email) errs.email = "Email is required";
    if (!formData.password) errs.password = "Password is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      errs.email = "Enter a valid email address";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/signup`, formData);
      navigate("/login");
    } catch (error) {
      setErrors({
        server: error.response?.data?.message || "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    {
      id: "username",
      label: "Username",
      type: "text",
      placeholder: "Choose a username",
      autoComplete: "username",
    },
    {
      id: "email",
      label: "Email Address",
      type: "email",
      placeholder: "your@email.com",
      autoComplete: "email",
    },
    {
      id: "address",
      label: "Address (Optional)",
      type: "text",
      placeholder: "Your delivery address",
      autoComplete: "street-address",
    },
  ];

  return (
    <div className="min-h-screen flex justify-center items-center relative overflow-hidden bg-navy-900 py-10">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/library.jpg"
          alt="Library"
          className="w-full h-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900/92 via-navy-900/78 to-wine-900/60" />
      </div>

      {/* Three.js icy-blue particle layer */}
      <ParticleCanvas preset="auth" style={{ zIndex: 1 }} />

      {/* Decorative rings */}
      <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full border border-wine-600/10 z-0" />
      <div className="absolute bottom-1/3 -left-40 w-80 h-80 rounded-full border border-toffee-600/10 z-0" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-parchment-50/95 dark:bg-navy-800/95 backdrop-blur-md rounded-2xl shadow-glass border border-parchment-300/30 dark:border-navy-600/50 p-8 md:p-10">
          {/* Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-wine-600/10 dark:bg-wine-500/20 flex items-center justify-center mb-4 shadow-inner">
              <FaBook className="w-6 h-6 text-wine-600 dark:text-wine-400" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-parchment-900 dark:text-parchment-100">
              Join Us
            </h1>
            <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400 mt-2 text-center">
              Create your account and start exploring
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Username + Email + Address */}
            {fields.map(({ id, label, type, placeholder, autoComplete }) => (
              <div key={id}>
                <label className="field-label" htmlFor={id}>
                  {label}
                </label>
                <input
                  type={type}
                  id={id}
                  name={id}
                  value={formData[id]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className={`input-field ${
                    id === "username" &&
                    formData.username.length >= 4 &&
                    !isCheckingUsername
                      ? usernameStatus === "taken"
                        ? "border-wine-500 focus:border-wine-500 focus:ring-1 focus:ring-wine-500"
                        : usernameStatus === "available"
                          ? "border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                          : ""
                      : ""
                  }`}
                  autoComplete={autoComplete}
                />

                {/* Dynamically show Username Bloom Filter Check Result */}
                {id === "username" && formData.username.length >= 4 && (
                  <div className="mt-1.5 flex items-center justify-between text-xs font-sans">
                    {isCheckingUsername ? (
                      <span className="text-toffee-500 dark:text-toffee-400">
                        Checking availability...
                      </span>
                    ) : usernameStatus === "available" ? (
                      <span className="text-green-600 dark:text-green-500 font-medium">
                        ✨ Username is available
                      </span>
                    ) : usernameStatus === "taken" ? (
                      <span className="text-wine-600 dark:text-wine-500 font-medium">
                        ⚠️ Username is already taken
                      </span>
                    ) : null}
                  </div>
                )}

                {errors[id] && id !== "username" && (
                  <p className="mt-1.5 text-xs text-wine-600 dark:text-wine-400 font-sans">
                    {errors[id]}
                  </p>
                )}
                {errors[id] &&
                  id === "username" &&
                  usernameStatus !== "taken" && (
                    <p className="mt-1.5 text-xs text-wine-600 dark:text-wine-400 font-sans">
                      {errors[id]}
                    </p>
                  )}
              </div>
            ))}

            {/* Password */}
            <div>
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="input-field pr-11"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-toffee-500 dark:text-toffee-400 hover:text-wine-600 dark:hover:text-wine-400 transition-colors"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? (
                    <FaEyeSlash className="w-4 h-4" />
                  ) : (
                    <FaEye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-wine-600 dark:text-wine-400 font-sans">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Server error */}
            {errors.server && (
              <div className="p-3 rounded-lg bg-wine-50 dark:bg-wine-900/20 border border-wine-200 dark:border-wine-800">
                <p className="text-xs text-wine-700 dark:text-wine-400 font-sans">
                  {errors.server}
                </p>
              </div>
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
              {isLoading ? "Creating Account…" : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-parchment-300 dark:bg-navy-600" />
            <span className="font-sans text-xs text-toffee-500 dark:text-toffee-500">
              Already have an account?
            </span>
            <div className="h-px flex-1 bg-parchment-300 dark:bg-navy-600" />
          </div>

          <Link
            to="/login"
            className="w-full flex items-center justify-center py-3 rounded-xl border-2 border-parchment-400 dark:border-navy-500 font-sans font-semibold text-sm text-toffee-700 dark:text-parchment-300 hover:border-wine-600 dark:hover:border-wine-500 hover:text-wine-600 dark:hover:text-wine-400 transition-all duration-250"
          >
            Sign In Instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
