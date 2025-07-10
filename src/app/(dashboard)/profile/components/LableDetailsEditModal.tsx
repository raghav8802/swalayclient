"use client";
import React from "react";
import { Modal } from "@/components/Modal";
import UserContext from "@/context/userContext";
import { apiFormData } from "@/helpers/axiosRequest";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation"

interface EditLabelDetailsForSmartLink {
  uniqueUsername? : string
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
  const router = useRouter()
  const context = useContext(UserContext);

  const labelId = context?.user?._id ?? "";

  const [details, setDetails] = useState<EditLabelDetailsForSmartLink>({
    uniqueUsername : "",
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

      // Create FormData object
      const formData = new FormData();
      formData.append("labelId", labelId);
      formData.append("bio", details.bio!);
      formData.append("instagram", details.instagram!);
      formData.append("facebook", details.facebook!);
      formData.append("ytMusic", details.ytMusic!);
      formData.append("spotify", details.spotify!);
      formData.append("appleMusic", details.appleMusic!);

      const response = await apiFormData(
        "/api/label/updateLabelDetails",
        formData
      );

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
        toast.success("Details updated successfully");
        router.refresh()
      } else {
        toast.error(response.message || "Failed to update details");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while updating details");
    }
  };  

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
