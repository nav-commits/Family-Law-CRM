"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, name, error, ...rest }, ref) => {
    const id = `field-${name}`;
    return (
      <div>
        <Label htmlFor={id}>
          {label}
          {error && <span className="ml-1 text-red-600">*</span>}
        </Label>
        <Input
          id={id}
          name={name}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          ref={ref}
          {...rest}
        />
        {error && (
          <p id={`${id}-error`} className="text-red-600 text-sm mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";
export default TextField;
