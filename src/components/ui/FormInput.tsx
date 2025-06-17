import React from "react";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ id, label, error, ...props }, ref) => {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={`w-full px-3 py-2 mt-1 bg-[#2d2d2d] border ${
            error ? "border-red-500" : "border-[#404040]"
          } text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500`}
          {...props} // Cho phép truyền value, onChange, placeholder, type, required, name, ...v.v.
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
