// src/components/Input.tsx
import React from "react";

interface InputProps {
  placeholder: string;
  name: string;
  type: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  name,
  type,
  value,
  handleChange,
}) => (
  <input
    placeholder={placeholder}
    name={name}
    type={type}
    value={value}
    onChange={handleChange}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

export default Input;
