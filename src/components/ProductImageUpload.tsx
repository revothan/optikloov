import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { Plus, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductImageUploadProps {
  onImageUrlChange: (url: string) => void;
  onAdditionalImagesChange?: (urls: { [key: string]: string }) => void;
  defaultImageUrl?: string | null;
  defaultAdditionalImages?: {
    photo_1?: string | null;
    photo_2?: string | null;
    photo_3?: string | null;
  };
}

export function ProductImageUpload({
  onImageUrlChange,
  onAdditionalImagesChange,
  defaultImageUrl,
  defaultAdditionalImages,
}: ProductImageUploadProps) {
  const session = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(defaultImageUrl || "");
  const [additionalImages, setAdditionalImages] = useState<{
    [key: string]: string;
  }>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<{
    key: string;
    url: string;
  } | null>(null);

  useEffect(() => {
    if (defaultImageUrl) {
      setPreviewUrl(defaultImageUrl);
    }

    if (defaultAdditionalImages) {
      const cleanedImages: { [key: string]: string } = {};
      Object.entries(defaultAdditionalImages).forEach(([key, value]) => {
        if (value) {
          cleanedImages[key] = value;
        }
      });
      setAdditionalImages(cleanedImages);
    }
  }, [defaultImageUrl, defaultAdditionalImages]);

  const extractFilePathFromUrl = (url: string) => {
    const match = url.match(/\/products\/(.+)$/);
    return match ? match[1] : null;
  };

  const deleteFromStorage = async (url: string) => {
    const filePath = extractFilePathFromUrl(url);
    if (!filePath) {
      console.error("Could not extract file path from URL:", url);
      return false;
    }

    try {
      const { error } = await supabase.storage
        .from("products")
        .remove([filePath]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!imageToDelete) return;

    const { key, url } = imageToDelete;
    const success = await deleteFromStorage(url);

    if (success) {
      const newAdditionalImages = { ...additionalImages };
      delete newAdditionalImages[key];
      setAdditionalImages(newAdditionalImages);
      onAdditionalImagesChange?.(newAdditionalImages);

      // Update form field to null or empty string
      if (onAdditionalImagesChange) {
        onAdditionalImagesChange({
          ...newAdditionalImages,
          [key]: null as any, // This will ensure the field is cleared in the form
        });
      }

      toast.success("Image deleted successfully");
    } else {
      toast.error("Failed to delete image");
    }
    setShowDeleteDialog(false);
    setImageToDelete(null);
  };

  const handleDeleteRequest = (imageKey: string, imageUrl: string) => {
    setImageToDelete({ key: imageKey, url: imageUrl });
    setShowDeleteDialog(true);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    imageKey?: string,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${session?.user?.id}/${Date.now()}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(fileName);

      if (imageKey) {
        const newAdditionalImages = {
          ...additionalImages,
          [imageKey]: publicUrl,
        };
        setAdditionalImages(newAdditionalImages);
        onAdditionalImagesChange?.(newAdditionalImages);
        toast.success(`Additional image ${imageKey} uploaded successfully`);
      } else {
        setPreviewUrl(publicUrl);
        onImageUrlChange(publicUrl);
        toast.success("Main image uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image Upload */}
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            {previewUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                {!isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
                    <p className="text-white">Click to change main image</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG (MAX. 2MB)</p>
              </div>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Additional Images */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => {
            const imageKey = `photo_${index}`;
            const imageUrl = additionalImages[imageKey];

            return (
              <div key={imageKey} className="relative">
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  {imageUrl ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imageUrl}
                        alt={`Additional ${index}`}
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteRequest(imageKey, imageUrl);
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4">
                      <Plus className="h-6 w-6 text-gray-400" />
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Add Image {index}
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, imageKey)}
                    disabled={isUploading}
                  />
                </label>
              </div>
            );
          })}
        </div>

        {isUploading && (
          <div className="text-center text-sm text-gray-500">Uploading...</div>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              image from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirmed}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

