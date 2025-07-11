"use client";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import UserContext from "@/context/userContext";
import { apiFormData } from "@/helpers/axiosRequest";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

const UpdateProfilePictureModal = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const context = useContext(UserContext);

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

      const loadingToastId = toast.loading("Uploading...");

      const image = new Image();
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
        toast.error(error.message);
        return;
      }

      const formData = new FormData();
      formData.append("profilePicture", profilePicture);
      formData.append("labelId", labelId);

      const response = await apiFormData(
        "/api/label/updateLabelProfilePicture",
        formData
      );

      console.log(response);
      
      if (response.success) {
        toast.success("Profile Picture updated successfully");
        toast.dismiss(loadingToastId);
        setProfilePicture(null);
        router.refresh();
      } else {
        toast.error(response.message || "Failed to update profile picture");
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "An error occurred while updating details"
      );
    }
  };

  return (
    <Modal
      title="Update Profile Picture"
      isVisible={isVisible}
      onClose={onClose}
      onSave={handleUpdateProfilePicture}
      triggerLabel="Update"
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture (File Type: png, jpg | <span className="text-red-500">Recomended File Size: 3000 x 3000</span>){" "}
          </label>
          <div className="flex gap-2 items-center md:flex-row flex-col mt-2">
            {profilePicture && (
              <div className="flex gap-1 flex-col">
                <img
                src={URL.createObjectURL(profilePicture)}
                alt="Pic"
                className="h-32 w-32 rounded-full"
              />
              <Button className="h-10" onClick={()=>setProfilePicture(null)}>
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
