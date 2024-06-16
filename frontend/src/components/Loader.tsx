// src/components/Loader.tsx
import React from "react";

interface LoaderProps {
  size?: number; // Size of the loader (default: 32)
  color?: string; // Border color (default: red-700)
  message?: string; // Optional loading message
}

const Loader: React.FC<LoaderProps> = ({
  size = 32,
  color = "border-red-700",
  message,
}) => {
  return (
    <div className="flex justify-center items-center py-3">
      <div
        className={`animate-spin rounded-full border-b-2 ${color}`}
        style={{ height: size, width: size }}
      />
      {message && <p className="text-white ml-2">{message}</p>}
    </div>
  );
};

export default Loader;
