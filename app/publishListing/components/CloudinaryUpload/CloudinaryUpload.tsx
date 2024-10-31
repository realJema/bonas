"use client";

import { useState, useCallback } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Loader2 } from "lucide-react";

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: any) => void;
  maxFiles?: number;
  currentFiles: string[];
  className?: string;
  multiple: boolean;
}

export default function CloudinaryUpload({
  onUploadSuccess,
  onUploadError,
  maxFiles = 1,
  multiple = false,
  currentFiles = [],
  className = "",
}: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSuccess = useCallback(
    (result: any) => {
      setIsUploading(true);
      setUploadError(null);

      try {
        const imageUrl = result.info.secure_url;

        if (!imageUrl) {
          throw new Error("No image URL received");
        }

        onUploadSuccess(imageUrl);
      } catch (error) {
        console.error("Upload error:", error);
        setUploadError(
          error instanceof Error ? error.message : "Upload failed"
        );
        onUploadError?.(error);
      } finally {
        setIsUploading(false);
      }
    },
    [onUploadSuccess, onUploadError]
  );

  return (
    <div className={className}>
      {currentFiles.length < maxFiles && (
        <CldUploadWidget
          uploadPreset="lymdepzy"
          options={{
            maxFiles: maxFiles - currentFiles.length,
            sources: ["local", "url", "camera"],
            resourceType: "image",
            clientAllowedFormats: ["png", "jpeg", "jpg"],
            maxFileSize: 10000000, // 10MB
            multiple: multiple,
            styles: {
              palette: {
                window: "#FFFFFF",
                windowBorder: "#90A0B3",
                tabIcon: "#0078FF",
                menuIcons: "#5A616A",
                textDark: "#000000",
                textLight: "#FFFFFF",
                link: "#0078FF",
                action: "#FF620C",
                inactiveTabIcon: "#0E2F5A",
                error: "#F44235",
                inProgress: "#0078FF",
                complete: "#20B832",
                sourceBg: "#E4EBF1",
              },
            },
            language: "en",
            text: {
              en: {
                local: {
                  browse: "Browse Images",
                  dd_title_single: "Drag and drop an image here",
                  dd_title_multi: "Drag and drop images here",
                },
              },
            },
            showPoweredBy: false,
          }}
          onSuccess={handleSuccess}
          onClose={() => {
            setIsUploading(false);
            setUploadError(null);
          }}
        >
          {({ open }) => (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                open();
              }}
              disabled={isUploading}
              className="cursor-pointer inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {isUploading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Uploading...
                </span>
              ) : (
                `Choose Image ${currentFiles.length}/${maxFiles}`
              )}
            </button>
          )}
        </CldUploadWidget>
      )}

      {uploadError && (
        <p className="text-red-500 text-sm mt-2">
          Upload failed: {uploadError}
        </p>
      )}
    </div>
  );
}
