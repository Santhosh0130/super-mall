// src/components/ui/card.jsx
import React from "react";

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white shadow rounded-md ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors cursor-pointer";
const defaultStyles = "bg-blue-600 hover:text-black hover:bg-blue-100";
const outlineStyles = "border border-blue-600 text-blue-600 hover:bg-blue-50";

export const Button = ({ children, variant = "default", className = "", ...props }) => {
  const styles =
    variant === "outline"
      ? `${baseStyles} ${outlineStyles}`
      : `${baseStyles} ${defaultStyles}`;

  return (
    <button className={`${styles} ${className}`} {...props} >
      {children}
    </button>
  );
};

// components/Modal.jsx
export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-600"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export const Input = ({ label, ...props }) => {
  return (
    <div className={props.className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input {...props} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
    </div>

  )
}
