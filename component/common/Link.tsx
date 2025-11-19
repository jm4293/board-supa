import React from "react";
import NextLink from "next/link";

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "primary" | "muted";
  underline?: boolean;
  external?: boolean;
}

const Link: React.FC<LinkProps> = ({
  href,
  children,
  className = "",
  variant = "default",
  underline = false,
  external = false,
}) => {
  const variantStyles = {
    default: "text-gray-700 hover:text-blue-600",
    primary: "text-blue-600 hover:text-blue-700",
    muted: "text-gray-500 hover:text-gray-700",
  };

  const underlineStyle = underline ? "underline" : "no-underline hover:underline";
  const baseStyles = "transition-colors duration-200";

  const linkClassName = `${baseStyles} ${variantStyles[variant]} ${underlineStyle} ${className}`;

  if (external) {
    return (
      <a href={href} className={linkClassName} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={linkClassName}>
      {children}
    </NextLink>
  );
};

export default Link;
