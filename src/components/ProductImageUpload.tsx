import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { Plus, X, Loader2 } from "lucide-react";
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

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

interface ProductImageUploadProps {
  onImageUrlChange: (url: string) => void;
  onAdditionalImagesChange?: (urls: { [key: string]: string | null }) => void;
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

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 2MB");
      return false;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("File must be JPEG, JPG, PNG, or WEBP");
      return false;
    }

    return true;
  };

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

      if (onAdditionalImagesChange) {
        // Create an object with all photo keys set to null or their current value
        const updatedImages = {
          photo_1: newAdditionalImages.photo_1 || null,
          photo_2: newAdditionalImages.photo_2 || null,
          photo_3: newAdditionalImages.photo_3 || null,
          ...newAdditionalImages,
        };
        onAdditionalImagesChange(updatedImages);
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
    console.log("File upload started");
    const file = event.target.files?.[0];
    if (!file || !session?.user?.id) {
      console.log("No file or session:", {
        file: !!file,
        sessionId: !!session?.user?.id,
      });
      return;
    }

    console.log("File type:", file.type);
    console.log("File size:", file.size);

    if (!validateFile(file)) return;

    try {
      setIsUploading(true);

      console.log("File details:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      // Create a unique filename
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const fileName = `${session.user.id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      // Upload the file
      // Convert file to ArrayBuffer to preserve binary data
      const arrayBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);

      const { error: uploadError, data } = await supabase.storage
        .from("products")
        .upload(fileName, fileData, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      console.log("Upload successful:", data);

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(fileName);

      if (imageKey) {
        // Handle additional image
        const newAdditionalImages = {
          ...additionalImages,
          [imageKey]: publicUrl,
        };
        setAdditionalImages(newAdditionalImages);
        if (onAdditionalImagesChange) {
          onAdditionalImagesChange({
            photo_1: newAdditionalImages.photo_1 || null,
            photo_2: newAdditionalImages.photo_2 || null,
            photo_3: newAdditionalImages.photo_3 || null,
            ...newAdditionalImages,
          });
        }
        toast.success(`Additional image uploaded successfully`);
      } else {
        // Handle main image
        setPreviewUrl(publicUrl);
        onImageUrlChange(publicUrl);
        toast.success("Main image uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = "";
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image Upload */}
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 relative">
            {isUploading && (
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
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
                <Plus className="w-8 h-8 mb-4 text-gray-500" />
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
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
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
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 relative">
                  {isUploading && imageToDelete?.key === imageKey && (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  )}
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
                          e.stopPropagation();
                          handleDeleteRequest(imageKey, imageUrl);
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
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
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    onChange={(e) => handleFileUpload(e, imageKey)}
                    disabled={isUploading}
                  />
                </label>
              </div>
            );
          })}
        </div>
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
