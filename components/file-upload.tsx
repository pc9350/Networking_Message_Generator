"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { DocumentTextIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        setFile(selectedFile);
        onFileUpload(selectedFile);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
      ],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragActive
              ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20"
              : "border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <DocumentTextIcon className="h-10 w-10 text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isDragActive
                ? "Drop your resume here..."
                : "Drag & drop your resume here, or click to select"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Supports PDF, DOCX (Max 5MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <DocumentTextIcon className="h-8 w-8 text-primary-500" />
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <XMarkIcon className="h-5 w-5" />
            <span className="sr-only">Remove file</span>
          </button>
        </div>
      )}
    </div>
  );
} 