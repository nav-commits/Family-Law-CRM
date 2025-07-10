"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  error?: string;
}

const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, name, error, ...rest }, ref) => {
    const id = `field-${name}`;
    return (
      <div>
        <Label htmlFor={id}>
          {label}
          {error && <span className="ml-1 text-red-600">*</span>}
        </Label>
        <Textarea
          id={id}
          name={name}
          rows={4}
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

TextareaField.displayName = "TextareaField";
export default TextareaField;
