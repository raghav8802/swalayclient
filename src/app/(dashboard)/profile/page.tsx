"use client";

import React, { useContext, useEffect, useState } from "react";
// import Image from "next/image";
import Style from "../../styles/Profile.module.css";
import toast from "react-hot-toast";
import BankModal from "./components/BankModal";
import { apiGet } from "@/helpers/axiosRequest";
import UserContext from "@/context/userContext";

interface BankData {
  _id: string;
  labelId: string;
  accountHolderName: string;
  bankName: string;
  branchName: string;
  gstNo: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  pan: string;
}

const page = () => {
  const context = useContext(UserContext);
  // console.log(context?.user);

  const labelId = context?.user?._id;
  const username = context?.user?.username;
  const email = context?.user?.email;
  const contact = context?.user?.contact;
  const joinedat = context?.user?.joinedAt; // Update 'joinedAT' to 'joinedAt'

  const lableName = context?.user?.lable;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bankData, setBankData] = useState<BankData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleFields, setVisibleFields] = useState({
    accountHolderName: false,
    bankName: false,
    branchName: false,
    accountNumber: false,
    ifscCode: false,
    upiId: false,
    pan: false,
    gstNo: false,
  });

  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState(lableName || "SwaLay Digital");

  const toggleVisibility = (field: keyof typeof visibleFields) => {
    setVisibleFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const fetchBankDetails = async () => {
    console.log("labelId : ", labelId);

    try {
      const response = await apiGet(
        `/api/bank/getbankdetails?labelid=${labelId}`
      );
      console.log("fetch bank details");
      console.log(response);

      if (response.success) {
        setBankData(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Internal server down");
      console.log(error);
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setIsLoading(true);
    fetchBankDetails();
  };

  const handleLabelUpdate = async () => {
    if (!labelId || labelId !== "6784b1d257ce42ea2334c86a") return;
    
    try {
      const response = await fetch("/api/user/lablenameupdate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ labelId, newLabelName }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("Label name updated successfully");
        // Update context if needed
        if (context?.user) {
          context.user.lable = newLabelName;
        }
        setIsEditingLabel(false);
      } else {
        toast.error(data.message || "Failed to update label name");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  useEffect(() => {
    if (labelId) {
      fetchBankDetails();
    }
  }, [labelId]);

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className={`col-span-12 h-screen relative`}>
        <div className={Style.profileContainer}>
          <div className="flex items-center justify-between">
            <h3 className={Style.labelHeader}>Label Information</h3>
          </div>

          <div className="grid grid-cols-12 gap-4 mt-3 mb-3">
            <div className={`mb-3 col-span-4 `}>
              <p className={Style.labelSubHeader}>Label Name</p>
              {labelId === "6784b1d257ce42ea2334c86a" ? (
                <div className="flex items-center gap-2">
                  {isEditingLabel ? (
                    <>
                      <input
                        type="text"
                        value={newLabelName}
                        onChange={(e) => setNewLabelName(e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                      <button
                        onClick={handleLabelUpdate}
                        className="text-green-600"
                      >
                        <i className="bi bi-check-lg"></i>
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingLabel(false);
                          setNewLabelName(lableName || "SwaLay Digital");
                        }}
                        className="text-red-600"
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </>
                  ) : (
                    <>
                      <p>{lableName ? lableName : "SwaLay Digital"}</p>
                      <button
                        onClick={() => setIsEditingLabel(true)}
                        className="text-blue-600"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <p>{lableName ? lableName : "SwaLay Digital"}</p>
              )}
            </div>
            <div className={`mb-3 col-span-4 `}>
              <p className={Style.labelSubHeader}>Label Owner Name</p>
              <p>{username} </p>
            </div>
            <div className={`mb-3 col-span-4 `}>
              <p className={Style.labelSubHeader}>Joining Date </p>
              <p>
                {joinedat
                  ? new Date(joinedat).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
            <div className={`mb-3 col-span-4 `}>
              <p className={Style.labelSubHeader}>Email</p>
              <p>{email}</p>
            </div>
            <div className={`mb-3 col-span-4 `}>
              <p className={Style.labelSubHeader}>Contact</p>
              <p>{contact}</p>
            </div>
          </div>
        </div>

        <div className={`mt-5 ${Style.profileContainer}`}>
          <div className="flex items-center justify-between">
            <h3 className={Style.labelHeader}>Bank Details</h3>
            <i
              onClick={() => setIsModalVisible(true)}
              className={`bi bi-pencil-square ${Style.editIcon}`}
            ></i>
          </div>

   
            {bankData && (
              <div className="grid grid-cols-12 gap-4 mt-3 mb-3">
                <div className={`mb-3 col-span-3`}>
                  <p className={Style.labelSubHeader}>Account Holder Name</p>
                  <div className="flex items-center">
                    {visibleFields.accountHolderName ? (
                      <p>{bankData.accountHolderName}</p>
                    ) : (
                      <p>*******</p>
                    )}
                    <i
                      onClick={() => toggleVisibility("accountHolderName")}
                      className={`ml-2 cursor-pointer ${
                        visibleFields.accountHolderName
                          ? "bi bi-eye-slash"
                          : "bi bi-eye-fill"
                      }`}
                    ></i>
                  </div>
                </div>

                <div className={`col-span-3`}>
                  <p className={Style.labelSubHeader}>Bank Name</p>
                  <div className="flex items-center">
                    {visibleFields.bankName ? (
                      <p>{bankData.bankName}</p>
                    ) : (
                      <p>*******</p>
                    )}
                    <i
                      onClick={() => toggleVisibility("bankName")}
                      className={`ml-2 cursor-pointer ${
                        visibleFields.bankName
                          ? "bi bi-eye-slash"
                          : "bi bi-eye-fill"
                      }`}
                    ></i>
                  </div>
                </div>

                <div className={`mb-3 col-span-3`}>
                  <p className={Style.labelSubHeader}>Branch Name</p>
                  <div className="flex items-center">
                    {visibleFields.branchName ? (
                      <p>{bankData.branchName}</p>
                    ) : (
                      <p>*******</p>
                    )}
                    <i
                      onClick={() => toggleVisibility("branchName")}
                      className={`ml-2 cursor-pointer ${
                        visibleFields.branchName
                          ? "bi bi-eye-slash"
                          : "bi bi-eye-fill"
                      }`}
                    ></i>
                  </div>
                </div>

                <div className={`mb-3 col-span-3`}>
                  <p className={Style.labelSubHeader}>Account Number</p>
                  <div className="flex items-center">
                    {visibleFields.accountNumber ? (
                      <p>{bankData.accountNumber}</p>
                    ) : (
                      <p>*******</p>
                    )}
                    <i
                      onClick={() => toggleVisibility("accountNumber")}
                      className={`ml-2 cursor-pointer ${
                        visibleFields.accountNumber
                          ? "bi bi-eye-slash"
                          : "bi bi-eye-fill"
                      }`}
                    ></i>
                  </div>
                </div>

                <div className={`mb-3 col-span-3`}>
                  <p className={Style.labelSubHeader}>IFSC Code</p>
                  <div className="flex items-center">
                    {visibleFields.ifscCode ? (
                      <p>{bankData.ifscCode}</p>
                    ) : (
                      <p>*******</p>
                    )}
                    <i
                      onClick={() => toggleVisibility("ifscCode")}
                      className={`ml-2 cursor-pointer ${
                        visibleFields.ifscCode
                          ? "bi bi-eye-slash"
                          : "bi bi-eye-fill"
                      }`}
                    ></i>
                  </div>
                </div>

                <div className={`mb-3 col-span-3`}>
                  <p className={Style.labelSubHeader}>UPI Id</p>
                  <div className="flex items-center">
                    {visibleFields.upiId ? (
                      <p>{bankData.upiId}</p>
                    ) : (
                      <p>*******</p>
                    )}
                    <i
                      onClick={() => toggleVisibility("upiId")}
                      className={`ml-2 cursor-pointer ${
                        visibleFields.upiId
                          ? "bi bi-eye-slash"
                          : "bi bi-eye-fill"
                      }`}
                    ></i>
                  </div>
                </div>

                <div className={`mb-3 col-span-3`}>
                  <p className={Style.labelSubHeader}>PAN</p>
                  <div className="flex items-center">
                    {visibleFields.pan ? <p>{bankData.pan}</p> : <p>*******</p>}
                    <i
                      onClick={() => toggleVisibility("pan")}
                      className={`ml-2 cursor-pointer ${
                        visibleFields.pan ? "bi bi-eye-slash" : "bi bi-eye-fill"
                      }`}
                    ></i>
                  </div>
                </div>

                <div className={`mb-3 col-span-3`}>
                  <p className={Style.labelSubHeader}>GST NO</p>
                  <div className="flex items-center">
                    {visibleFields.gstNo ? (
                      <p>{bankData.gstNo}</p>
                    ) : (
                      <p>*******</p>
                    )}
                    <i
                      onClick={() => toggleVisibility("gstNo")}
                      className={`ml-2 cursor-pointer ${
                        visibleFields.gstNo
                          ? "bi bi-eye-slash"
                          : "bi bi-eye-fill"
                      }`}
                    ></i>
                  </div>
                </div>
              </div>
            )}
          

          {isLoading && <h4 className="text-xl text-center">Loading</h4>}

          {!bankData && !isLoading && (
            <div className="flex mx-auto my-3 align-center justify-center items-center flex-col">
              <h4 className="text-xl text-center">No Record Found</h4>
              <button
                onClick={() => setIsModalVisible(true)}
                className="bg-black py-3 px-3 mt-4 text-white rounded"
              >
                Add Bank Details
              </button>
            </div>
          )}

        </div>

        <BankModal isVisible={isModalVisible} onClose={handleClose} />

       
      </div>
    </div>
  );
};

export default page;
