import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = true, leftIcon, rightIcon, className = "", disabled, ...props }, ref) => {
    const baseStyles =
      "w-full px-4 py-2 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-gray-100 disabled:cursor-not-allowed";

    const normalStyles = "border-gray-300 focus:border-blue-500 focus:ring-blue-500";
    const errorStyles = "border-red-500 focus:border-red-500 focus:ring-red-500";

    const widthStyle = fullWidth ? "w-full" : "";
    const paddingWithIcon = leftIcon ? "pl-10" : rightIcon ? "pr-10" : "";

    return (
      <div className={widthStyle}>
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{leftIcon}</div>
          )}

          <input
            ref={ref}
            className={`${baseStyles} ${error ? errorStyles : normalStyles} ${paddingWithIcon} ${className}`}
            disabled={disabled}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">{rightIcon}</div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
