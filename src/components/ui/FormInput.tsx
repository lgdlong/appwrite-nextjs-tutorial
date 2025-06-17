import React from "react";

interface FormInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export default function FormInput({
  id,
  label,
  type,
  value,
  placeholder,
  onChange,
  required = false,
}: FormInputProps) {
  return (
    <div>
      {" "}
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <input
        id={id}
        className="w-full px-3 py-2 mt-1 bg-[#2d2d2d] border border-[#404040] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
      />
    </div>
  );
}
