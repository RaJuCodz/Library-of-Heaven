import React from "react";
import { Link } from "react-router-dom";

/**
 * Premium Button component — Library of Heaven design system
 * @param {string}  props.variant  - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * @param {string}  props.size     - 'sm' | 'md' | 'lg'
 * @param {string}  props.to       - renders as <Link> if provided
 * @param {boolean} props.fullWidth
 * @param {boolean} props.isLoading
 * @param {boolean} props.disabled
 */
const Button = ({
  variant = "primary",
  size = "md",
  to,
  fullWidth = false,
  isLoading = false,
  disabled = false,
  children,
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-sans font-semibold rounded-lg transition-all duration-300 tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none";

  const sizes = {
    sm: "px-4 py-2 text-sm gap-1.5",
    md: "px-6 py-2.5 text-sm gap-2",
    lg: "px-8 py-3.5 text-base gap-2.5",
  };

  const variants = {
    primary:
      "bg-wine-600 text-parchment-50 hover:bg-wine-700 active:bg-wine-800 shadow-md hover:shadow-glow-wine focus-visible:ring-wine-500 dark:bg-wine-500 dark:hover:bg-wine-600",
    secondary:
      "bg-toffee-500 text-parchment-50 hover:bg-toffee-600 active:bg-toffee-700 shadow-md hover:shadow-glow-toffee focus-visible:ring-toffee-400",
    outline:
      "border-2 border-wine-600 text-wine-600 bg-transparent hover:bg-wine-600 hover:text-white active:bg-wine-700 focus-visible:ring-wine-500 dark:border-wine-400 dark:text-wine-400 dark:hover:bg-wine-400 dark:hover:text-navy-900",
    ghost:
      "text-wine-600 bg-transparent hover:bg-wine-50 active:bg-wine-100 focus-visible:ring-wine-400 dark:text-wine-400 dark:hover:bg-wine-900/30",
    danger:
      "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-md focus-visible:ring-red-500",
  };

  const stateClasses =
    disabled || isLoading
      ? "opacity-60 cursor-not-allowed pointer-events-none"
      : "hover:scale-[1.02] active:scale-[0.98]";

  const cls = [
    base,
    sizes[size] || sizes.md,
    variants[variant] || variants.primary,
    stateClasses,
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const spinner = (
    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
  );

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {isLoading && spinner}
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} disabled={disabled || isLoading} {...props}>
      {isLoading && spinner}
      {children}
    </button>
  );
};

export default Button;
