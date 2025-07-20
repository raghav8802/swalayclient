"use client";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import UserContext from "@/context/userContext";
import { apiFormData } from "@/helpers/axiosRequest";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import Image from "next/image";

const UpdateProfilePictureModal = ({
  isVisible,
  onClose,
  onSuccess,
}: {
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) => {
  const router = useRouter();
  const context = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const labelId = context?.user?._id ?? "";
  const [profilePicture, setProfilePicture] = useState<File | null>();

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.size > 10 * 1024 * 1024) {
      // Check if file size exceeds 10 MB
      toast.error("File size is too large. Maximum allowed size is 10 MB.");
      return;
    }
    setProfilePicture(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    multiple: false,
  });

  const handleUpdateProfilePicture = async () => {
    try {
      if (!profilePicture) {
        toast.error("Image file is required");
        return;
      }

      // File type check
      if (!["image/jpeg", "image/png"].includes(profilePicture.type)) {
        toast.error("Invalid file type. Only JPEG and PNG are allowed.");
        return;
      }

      setIsLoading(true);
      const loadingToastId = toast.loading("Uploading...");

      // Create a new HTMLImageElement for dimension validation
      const image = document.createElement('img');
      const imageLoaded = new Promise<void>((resolve, reject) => {
        image.onload = () => {
          if (image.width > 3000 || image.height > 3000) {
            reject(
              new Error(
                "Invalid image dimensions. Image width and height must be less than 3000 pixels"
              )
            );
          } else {
            resolve();
          }
        };
        image.onerror = () => {
          reject(new Error("Failed to load image"));
        };
      });

      image.src = URL.createObjectURL(profilePicture);

      try {
        await imageLoaded; // Wait for the image to load and validate dimensions
      } catch (error: any) {
        toast.dismiss(loadingToastId);
        toast.error(error.message);
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("profilePicture", profilePicture);
      formData.append("labelId", labelId);

      const response = await apiFormData(
        "/api/user/updateLabelProfilePicture",
        formData
      );
      
      if (response.success) {
        toast.success("Profile Picture updated successfully");
        setProfilePicture(null);
        onSuccess?.(); // Call the success callback if provided
        onClose(); // Close the modal
        router.refresh(); // Refresh the page data
      } else {
        toast.error(response.message || "Failed to update profile picture");
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "An error occurred while updating details"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Update Profile Picture"
      isVisible={isVisible}
      onClose={onClose}
      onSave={handleUpdateProfilePicture}
      triggerLabel={isLoading ? "Uploading..." : "Update"}
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture (File Type: png, jpg | <span className="text-red-500">Recommended File Size: 3000 x 3000</span>){" "}
          </label>
          <div className="flex gap-2 items-center md:flex-row flex-col mt-2">
            {profilePicture && (
              <div className="flex gap-1 flex-col">
                <div className="relative h-32 w-32 rounded-full overflow-hidden">
                  <Image
                    src={URL.createObjectURL(profilePicture)}
                    alt="Profile Picture"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="128px"
                  />
                </div>
                <Button className="h-10" onClick={() => setProfilePicture(null)}>
                  Remove Image
                </Button>
              </div>
            )}
            <div
              {...getRootProps()}
              className={`mt-1 flex flex-1 items-center justify-center border-2 border-dashed rounded-md h-44 cursor-pointer ${
                isDragActive ? "border-blue-500" : "border-gray-300"
              }`}
            >
              <input {...getInputProps()} />
              {profilePicture ? (
                <p className="text-sm text-green-500">
                  File: {profilePicture.name}
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Drag & drop an image here, or click to select one
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateProfilePictureModal;
