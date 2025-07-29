"use client";

import { Modal } from "@/components/Modal";
import UserContext from "@/context/userContext";
import { apiPost } from "@/helpers/axiosRequest";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const UpdateUniqueUsernameModal = ({
  onClose,
  isVisible,
}: {
  onClose: () => void;
  isVisible: boolean;
}) => {
  const router = useRouter();
  const context = useContext(UserContext);

  const labelId = context?.user?._id ?? "";
  const [uniqueUsername, setUniqueUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateUsername = (username: string) => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 30) return "Username must be less than 30 characters";
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) return "Username can only contain letters, numbers, underscores and hyphens";
    return "";
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setUniqueUsername(value);
    setError(validateUsername(value));
  };

  const handleSave = async () => {
    const validationError = validateUsername(uniqueUsername);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiPost("/api/smartlink/updateUniqueUsername", {
        uniqueUsername,
        labelId,
      });
      
      if (response.success) {
        toast.success("Username updated successfully");
        router.refresh();
        onClose();
      } else {
        setError(response.message || "Failed to update username");
        toast.error(response.message);
      }
    } catch (error) {
      const message = (error as Error).message;
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Update Username"
      onClose={onClose}
      onSave={handleSave}
      isVisible={isVisible}
      triggerLabel="Update Username"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Enter a username"
            value={uniqueUsername}
            onChange={handleUsernameChange}
            className={error ? "border-red-500" : ""}
          />
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Username guidelines:</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Must be between 3-30 characters</li>
            <li>Can contain letters, numbers, underscores and hyphens</li>
            <li>Will be used in your smart link URL</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateUniqueUsernameModal;
