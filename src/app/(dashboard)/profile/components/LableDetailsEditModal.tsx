"use client";
import React from "react";
import { Modal } from "@/components/Modal";
import UserContext from "@/context/userContext";
import { apiFormData } from "@/helpers/axiosRequest";
import { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
<<<<<<< HEAD
=======

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
>>>>>>> 74b58952eac953cf03c38a115fd2871b3a5d1155

interface EditLabelDetailsForSmartLink {
  bio?: string;
  instagram?: string;
  facebook?: string;
  ytMusic?: string;
  spotify?: string;
  appleMusic?: string;
}

const LableDetailsEditModal = ({
  isVisible,
  onClose,
  labelDetails,
  onSuccess,
}: {
  isVisible: boolean;
  onClose: () => void;
  labelDetails?: {
    bio?: string;
    instagram?: string;
    facebook?: string;
    ytMusic?: string;
    spotify?: string;
    appleMusic?: string;
  };
  onSuccess?: () => void;
}) => {
<<<<<<< HEAD

  const context = useContext(UserContext);
=======
>>>>>>> 74b58952eac953cf03c38a115fd2871b3a5d1155

  const context = useContext(UserContext);
  const labelId = context?.user?._id ?? "";
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [details, setDetails] = useState<EditLabelDetailsForSmartLink>({
    bio: "",
    instagram: "",
    facebook: "",
    ytMusic: "",
    spotify: "",
    appleMusic: "",
  });

  // Update form when labelDetails changes
  useEffect(() => {
    if (labelDetails) {
      setDetails({
        bio: labelDetails.bio || "",
        instagram: labelDetails.instagram || "",
        facebook: labelDetails.facebook || "",
        ytMusic: labelDetails.ytMusic || "",
        spotify: labelDetails.spotify || "",
        appleMusic: labelDetails.appleMusic || "",
      });
    }
  }, [labelDetails]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (details.bio && details.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters";
    }

    // Validate social media URLs
    const urlPattern = /^https?:\/\/.+/i;
    
    if (details.instagram && !urlPattern.test(details.instagram)) {
      newErrors.instagram = "Please enter a valid URL starting with http:// or https://";
    }
    
    if (details.facebook && !urlPattern.test(details.facebook)) {
      newErrors.facebook = "Please enter a valid URL starting with http:// or https://";
    }
    
    if (details.ytMusic && !urlPattern.test(details.ytMusic)) {
      newErrors.ytMusic = "Please enter a valid URL starting with http:// or https://";
    }
    
    if (details.spotify && !urlPattern.test(details.spotify)) {
      newErrors.spotify = "Please enter a valid URL starting with http:// or https://";
    }
    
    if (details.appleMusic && !urlPattern.test(details.appleMusic)) {
      newErrors.appleMusic = "Please enter a valid URL starting with http:// or https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof EditLabelDetailsForSmartLink) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setDetails((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("labelId", labelId);
      formData.append("bio", details.bio || "");
      formData.append("instagram", details.instagram || "");
      formData.append("facebook", details.facebook || "");
      formData.append("ytMusic", details.ytMusic || "");
      formData.append("spotify", details.spotify || "");
      formData.append("appleMusic", details.appleMusic || "");

      const response = await apiFormData("/api/user/updateLabelDetails", formData);

      if (response.success) {
<<<<<<< HEAD
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
        setTimeout(()=>{
          window.location.reload()
        },1000)
=======
        toast.success("Details updated successfully");
        onSuccess?.();
        onClose();
>>>>>>> 74b58952eac953cf03c38a115fd2871b3a5d1155
      } else {
        toast.error(response.message || "Failed to update details");
      }
    } catch (error) {
      toast.error((error as Error).message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Profile Details"
      isVisible={isVisible}
      onClose={onClose}
      onSave={handleSave}
      triggerLabel={isLoading ? "Saving..." : "Save"}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            placeholder="Write a short bio about yourself or your label"
            value={details.bio}
            onChange={handleInputChange("bio")}
            className={`w-full h-32 resize-none rounded-md border px-3 py-2 text-sm ${
              errors.bio ? "border-red-500" : "border-input"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
          />
          {errors.bio && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.bio}</span>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            {details.bio?.length || 0}/500 characters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input
              id="instagram"
              placeholder="https://instagram.com/youraccount"
              value={details.instagram}
              onChange={handleInputChange("instagram")}
              className={errors.instagram ? "border-red-500" : ""}
            />
            {errors.instagram && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.instagram}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input
              id="facebook"
              placeholder="https://facebook.com/youraccount"
              value={details.facebook}
              onChange={handleInputChange("facebook")}
              className={errors.facebook ? "border-red-500" : ""}
            />
            {errors.facebook && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.facebook}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ytMusic">YouTube Music URL</Label>
            <Input
              id="ytMusic"
              placeholder="https://music.youtube.com/channel/..."
              value={details.ytMusic}
              onChange={handleInputChange("ytMusic")}
              className={errors.ytMusic ? "border-red-500" : ""}
            />
            {errors.ytMusic && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.ytMusic}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="spotify">Spotify URL</Label>
            <Input
              id="spotify"
              placeholder="https://open.spotify.com/artist/..."
              value={details.spotify}
              onChange={handleInputChange("spotify")}
              className={errors.spotify ? "border-red-500" : ""}
            />
            {errors.spotify && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.spotify}</span>
              </div>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="appleMusic">Apple Music URL</Label>
            <Input
              id="appleMusic"
              placeholder="https://music.apple.com/artist/..."
              value={details.appleMusic}
              onChange={handleInputChange("appleMusic")}
              className={errors.appleMusic ? "border-red-500" : ""}
            />
            {errors.appleMusic && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.appleMusic}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LableDetailsEditModal;
