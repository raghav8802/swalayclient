"use client";
import React from "react";
import { Modal } from "@/components/Modal";
import UserContext from "@/context/userContext";
import { apiFormData } from "@/helpers/axiosRequest";
import { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";


interface EditLabelDetailsForSmartLink {
  bio?: string;
  profilePicture?: File | null; // Optional field
  instagram?: string; // Optional field
  facebook?: string; // Optional field
  ytMusic?: string; // Optional field
  spotify?: string; // Optional field
  appleMusic?: string; // Optional field
}

const LableDetailsEditModal = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {

  const context = useContext(UserContext);

  const labelId = context?.user?._id ?? "";

  const [details, setDetails] = useState<EditLabelDetailsForSmartLink>({
    profilePicture: null as File | null, 
    bio: "",
    instagram: "",
    facebook: "",
    ytMusic: "",
    spotify: "",
    appleMusic: "",
  });

  const handleSave = async () => {
    const loadingToastId = toast.loading("Uploading...");
    // setIsUploading(true);
    try {
      const profilePicture = details.profilePicture;

      if (!profilePicture) {
        toast.error("Album cover image is required");
        // setIsUploading(false);
        return;
      }

      // File type check
      if (!["image/jpeg", "image/png"].includes(profilePicture.type)) {
        toast.error("Invalid file type. Only JPEG and PNG are allowed.");
        // setIsUploading(false);
        return;
      }

      //! Dimension check need to be done if dimension preferred **
      const image = new Image();
      const imageLoaded = new Promise<void>((resolve, reject) => {
        image.onload = () => {
          if (image.width !== 3000 || image.height !== 3000) {
            reject(
              new Error(
                "Invalid image dimensions. Image must be 3000x3000 pixels."
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
        // setIsUploading(false);
        return; // Exit the function if dimensions are invalid
      }

      // Create FormData object
      const formData = new FormData();
      formData.append("labelId",labelId);
      formData.append("profilePicture", profilePicture);
      formData.append("bio", details.bio!);
      formData.append("instagram", details.instagram!);
      formData.append("facebook", details.facebook!);
      formData.append("ytMusic", details.ytMusic!);
      formData.append("spotify", details.spotify!);
      formData.append("appleMusic", details.appleMusic!);

      const response = await apiFormData("/api/label/updateLabelDetails", formData);

      toast.dismiss(loadingToastId);
      if (response.success) {
        setDetails({
          profilePicture: null,
          bio: "",
          instagram: "",
          facebook: "",
          ytMusic: "",
          spotify: "",
          appleMusic: "",
        });
        // setSelectedTags([]);
        toast.success("Details updated successfully")
        // setIsUploading(false);
        // router.push(`/albums/viewalbum/${btoa(response.data._id)}`);
      } else {
        toast.error(response.message || "Failed to update details");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while updating details");
      }
    }


  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.size > 10 * 1024 * 1024) {
      // Check if file size exceeds 10 MB
      toast.error("File size is too large. Maximum allowed size is 10 MB.");
      return;
    }
    setDetails({...details, profilePicture: file });
  };

  // useDropzone hook for handling file uploads
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    multiple: false,
  });

  return (
    <div className="overflow-y-auto">
      <Modal
        title="Edit Details"
        isVisible={isVisible}
        onClose={onClose}
        onSave={handleSave}
        triggerLabel="Submit"
      >
        <div className="flex flex-col gap-4">
          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture (File Type: png, jpg | File Size: 3000 x 3000){" "}
              </label>
              <div
                {...getRootProps()}
                className={`mt-1 flex items-center justify-center border-2 border-dashed rounded-md h-32 cursor-pointer ${
                  isDragActive ? "border-blue-500" : "border-gray-300"
                }`}
              >
                {/* <input accept="image/png,image/jpeg" {...getInputProps()} /> */}
                <input {...getInputProps()} />
                {details.profilePicture ? (
                  <p className="text-sm text-green-500">
                    File: {details.profilePicture.name}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    {/* <FontAwesomeIcon icon={faUpload} size="3x" /> */}
                    Drag & drop an image here, or click to select one
                  </p>
                )}
              </div>
              {/* {errors.artwork && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.artwork[0]}
                    </p>
                  )} */}
            </div>
            <label className="flex flex-col">
              Edit Bio
              <textarea
                placeholder="Write a short bio"
                className="border p-2 rounded"
                value={details.bio}
                onChange={(e) =>
                  setDetails({ ...details, bio: e.target.value })
                }
              />
            </label>

            <div className="flex items-center justify-between gap-2">
              <label className="flex flex-col flex-1">
                Instagram
                <input
                  type="text"
                  placeholder="Enter Instagram handle"
                  className="border p-2 rounded"
                  value={details.instagram}
                  onChange={(e) =>
                    setDetails({ ...details, instagram: e.target.value })
                  }
                />
              </label>
              <label className="flex flex-col flex-1">
                Facebook
                <input
                  type="text"
                  placeholder="Enter Facebook handle"
                  className="border p-2 rounded"
                  value={details.facebook}
                  onChange={(e) =>
                    setDetails({ ...details, facebook: e.target.value })
                  }
                />
              </label>
            </div>

            <div className="flex items-center justify-between gap-2">
              <label className="flex flex-col flex-1">
                YouTube Music
                <input
                  type="text"
                  placeholder="Enter YouTube Music handle"
                  className="border p-2 rounded"
                  value={details.ytMusic}
                  onChange={(e) =>
                    setDetails({ ...details, ytMusic: e.target.value })
                  }
                />
              </label>
              <label className="flex flex-col flex-1">
                Spotify
                <input
                  type="text"
                  placeholder="Enter Spotify handle"
                  className="border p-2 rounded"
                  value={details.spotify}
                  onChange={(e) =>
                    setDetails({ ...details, spotify: e.target.value })
                  }
                />
              </label>
            </div>

            <label className="flex flex-col">
              Apple Music
              <input
                type="text"
                placeholder="Enter Apple Music handle"
                className="border p-2 rounded"
                value={details.appleMusic}
                onChange={(e) =>
                  setDetails({ ...details, appleMusic: e.target.value })
                }
              />
            </label>

            {/* Add more fields as necessary */}
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default LableDetailsEditModal;
