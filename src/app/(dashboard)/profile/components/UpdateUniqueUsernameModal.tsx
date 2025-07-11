"use client";

import { Modal } from "@/components/Modal";
import UserContext from "@/context/userContext";
import { apiPost } from "@/helpers/axiosRequest";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";

const UpdateUniqueUsernameModal = ({
  onClose,
  isVisible,
}: {
  onClose: () => void;
  isVisible: boolean;
}) => {
  const router = useRouter()
  const context = useContext(UserContext);

  const labelId = context?.user?._id ?? "";
  const [uniqueUsername, setUniqueUsername] = useState("");

  const handleSave = async () => {
    if (!uniqueUsername || uniqueUsername.length === 0) {
      toast.error("Enter a valid username");
      return;
    }
    const toastId = toast("Updating");
    try {
      const response = await apiPost("/api/smartlink/updateUniqueUsername", {
        uniqueUsername,
        labelId,
      });
      if (response.success) {
        toast.success("Username Updated Successfully");
        router.refresh()
        return;
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log((error as Error).message);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Modal
      title="Update Username"
      onClose={onClose}
      onSave={handleSave}
      isVisible={isVisible}
      triggerLabel="Update Username"
    >
      <label className="flex flex-col gap-1">
        New Username
        <input
          placeholder="Enter a username ..."
          className="border p-2 rounded"
          onChange={(e) => setUniqueUsername(e.target.value)}
        />
      </label>
    </Modal>
  );
};

export default UpdateUniqueUsernameModal;
