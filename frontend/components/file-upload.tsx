"use client"

import { cn } from "@/lib/utils";
import { useId } from "react";

interface FileUploadProps {
  children: React.ReactNode;
  className?: string;
  allowedTypes?: string[];
  maxSize?: number;
  dimensions?: string;
  onFileSelect: (file: File) => void;
  onValidationError?: (error: string) => void;
  disabled?: boolean;
}
export default function FileUpload({ children, className, maxSize, allowedTypes, dimensions, disabled, onValidationError, onFileSelect }: FileUploadProps) {
  const id = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (maxSize) {
      if (file.size > maxSize) {
        if (onValidationError) onValidationError("File is too large");
        return;
      }
    }

    if (allowedTypes && allowedTypes.length > 0) {
      if (!allowedTypes.includes(file.type)) {
        if (onValidationError) onValidationError("Invalid file type, allowed types are: " + allowedTypes.join(", ") + ". Got: " + file.type);
        return;
      }
    }

    if (dimensions) {
      const width = parseInt(dimensions.split("x")[0]);
      const height = parseInt(dimensions.split("x")[1]);

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width !== width || img.height !== height) {
          if (onValidationError) onValidationError("Invalid image dimensions, expected: " + width + "x" + height + ". Got: " + img.width + "x" + img.height);
          return;
        }
      }
    }

    onFileSelect(file);
  }

  return (
    <div>
      <label htmlFor={id} className={cn(
        'cursor-pointer ',
        className
      )}>
        {children}
      </label>
      <input type="file" id={id} className="hidden" disabled={disabled} onChange={handleChange} multiple={false}/>
    </div>
  )
}