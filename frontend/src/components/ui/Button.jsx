import React from "react";
import { Link } from "react-router-dom";

/**
 * Reusable Button component with multiple variants
 * @param {Object} props - Component props
 * @param {string} props.variant - Button style variant: 'primary', 'secondary', 'outline', 'text'
 * @param {string} props.size - Button size: 'sm', 'md', 'lg'
 * @param {string} props.to - If provided, renders as Link component
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {boolean} props.isLoading - Whether button is in loading state
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
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
  // Base classes for all button variants
  const baseClasses = "font-medium rounded-lg transition-all duration-300 flex items-center justify-center";
  
  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
  };
  
  // Variant classes
  const variantClasses = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50",
    secondary: "bg-bookYellow-500 text-black hover:bg-bookYellow-600 shadow-md hover:shadow-lg focus:ring-2 focus:ring-bookYellow-400 focus:ring-opacity-50",
    outline: "bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50",
    text: "bg-transparent text-primary-500 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-darkBg-800",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg focus:ring-2 focus:ring-red-500 focus:ring-opacity-50",
  };
  
  // Loading and disabled states
  const stateClasses = (disabled || isLoading) 
    ? "opacity-70 cursor-not-allowed" 
    : "hover:scale-[1.02] active:scale-[0.98]";
  
  // Full width class
  const widthClass = fullWidth ? "w-full" : "";
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${stateClasses} ${widthClass} ${className}`;
  
  // Render as Link if 'to' prop is provided
  if (to) {
    return (
      <Link to={to} className={buttonClasses} {...props}>
        {isLoading ? (
          <span className="mr-2 inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
        ) : null}
        {children}
      </Link>
    );
  }
  
  // Otherwise render as button
  return (
    <button className={buttonClasses} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <span className="mr-2 inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
