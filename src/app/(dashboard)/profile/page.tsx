"use client";

import React from "react";
import { useCallback, useContext, useEffect, useState } from "react";
// import Image from "next/image";
import UserContext from "@/context/userContext";
import { apiGet } from "@/helpers/axiosRequest";
import { iLabel } from "@/models/Label";
import toast from "react-hot-toast";
import Style from "../../styles/Profile.module.css";
import BankModal from "./components/BankModal";
import LableDetailsEditModal from "./components/LableDetailsEditModal";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Apple, Facebook, Instagram, Music, Upload,Link as LinkIcon, Copy} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UpdateProfilePictureModal from "./components/UpdateProfilePictureModal";
import UpdateUniqueUsernameModal from "./components/UpdateUniqueUsernameModal";

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

const Page = () => {
  const context = useContext(UserContext);

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
  const [newLabelName, setNewLabelName] = useState(
    lableName || "SwaLay Digital"
  );

  const [labelDetails, setLabelDetails] = useState<iLabel>();
  const [isLabelDetailsEditOpen, setIsLabelDetailsEditOpen] = useState<boolean>(false)
  const [isProfilePictureModalUpdateOpen,setIsProfilePictureUpdateOpen] = useState<boolean>(false)
  const [isUniqueUsernameUpdateModalOpen,setIsUniqueUsernameUpdateModalOpen] = useState<boolean>(false)

  const toggleVisibility = (field: keyof typeof visibleFields) => {
    setVisibleFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const fetchBankDetails = useCallback(async () => {


    try {
      const response = await apiGet(
        `/api/bank/getbankdetails?labelid=${labelId}`
      );


      if (response.success) {
        setBankData(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Internal server down");
      console.log(error);
    }
  }, [labelId]);

  const handleClose = () => {
    setIsModalVisible(false);
    setIsLoading(true);
    fetchBankDetails();
  };

  const handleCloseEditDetails = () =>{
    setIsLabelDetailsEditOpen(false);
  }

  const handleCloseProfilePictureUpdate = ()=>{
    setIsProfilePictureUpdateOpen(false)
  }

  const handleCloseUniqueUsernameModal =()=>{
    setIsUniqueUsernameUpdateModalOpen(false)
  }

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

  const fetchLabelDetails = useCallback(async () => {
    if (!labelId) return;

    try {
      const response = await apiGet(
        `/api/label/getLabelDetails?lableId=${labelId}`
      );
      console.log("fetch lable details");
      console.log(response);

      if (response.success) {
        // Update context with label name if needed
        setLabelDetails(response.data);
        console.log(labelDetails)
      } else {
        toast.error(response.message || "Failed to fetch label details");
      }
    } catch (error) {
      toast.error("Internal server down");
      console.error(error);
    }
  }, [labelId]);

  useEffect(() => {
    fetchLabelDetails();
  }, [fetchLabelDetails, labelId]);

  useEffect(() => {
    if (labelId) {
      fetchBankDetails();
    }
  }, [labelId, fetchBankDetails]);

  const smartLink = `http://localhost:5173/${labelDetails?.uniqueUsername}`

  const handleCopyToClipboardSmartLink = async()=>{

    if(!labelDetails?.uniqueUsername){
      toast.error("username is not found")
      return
    }
    const toastId = toast("Copying SmartLink")
    try {
      await navigator.clipboard.writeText(smartLink)
      
      toast.success("SmartLink is copied to clipboard")
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      toast.dismiss(toastId)
    }
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className={`col-span-12 h-screen relative`}>
        <div className={Style.profileContainer}>
          <div className="flex items-center justify-between">
            <h3 className={Style.labelHeader}>Label Information</h3>
          </div>

          <div className="grid grid-cols-12 gap-4 mt-3 mb-3">
            <div className={`mb-3 col-span-12 md:col-span-6 lg:col-span-4`}>
              <p className={Style.labelSubHeader}>Label Name</p>
              {labelId === "6784b1d257ce42ea2334c86a" ? (
                <div className="flex items-center gap-2">
                  {isEditingLabel ? (
                    <>
                      <input
                        type="text"
                        value={newLabelName}
                        onChange={(e) => setNewLabelName(e.target.value)}
                        className="border rounded px-2 py-1 w-full md:w-auto"
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
            <div className={`mb-3 col-span-12 md:col-span-6 lg:col-span-4`}>
              <p className={Style.labelSubHeader}>Label Owner Name</p>
              <p>{username} </p>
            </div>
            <div className={`mb-3 col-span-12 md:col-span-6 lg:col-span-4`}>
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
            <div className={`mb-3 col-span-12 md:col-span-6 lg:col-span-4`}>
              <p className={Style.labelSubHeader}>Email</p>
              <p>{email}</p>
            </div>
            <div className={`mb-3 col-span-12 md:col-span-6 lg:col-span-4`}>
              <p className={Style.labelSubHeader}>Contact</p>
              <p>{contact}</p>
            </div>
          </div>
        </div>

        {/* {SmartLink Section} */}
        <div className="px-2 sm:px-4 py-3 bg-white border-2 rounded mt-5 relative">
          <div className="absolute flex gap-1 items-center top-2 right-2">
            <span className="">Edit</span>
            <i
              onClick={() => setIsLabelDetailsEditOpen(true)}
              className={`bi bi-pencil-square ${Style.editIcon}`}
            ></i>
          </div>
          <div className="flex items-center  mb-8">
              <h3 className={Style.labelHeader}>SmartLink</h3>
          </div>
          <Card className="w-full mx-auto px-2 sm:px-4 py-3 border-0 shadow-sm">

            {/* Header */}
            

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Profile Picture Section */}

              <div className="lg:col-span-3 flex flex-col items-center space-y-4">
                <div
                  className="relative group"
                >
                  <Avatar className="w-40 h-40 border-4 border-white shadow-lg">
                    <AvatarImage src={"https://swalay-music-files.s3.ap-south-1.amazonaws.com/user/" + labelDetails?.profilePicture} alt="Profile" />
                    <AvatarFallback className="bg-gray-800 text-white text-2xl">SL</AvatarFallback>
                  </Avatar>
                </div>


                    {/* Update Profile Picture Button */}
                <Button variant="outline" size="sm" className="w-full max-w-[140px] bg-transparent" onClick={()=>setIsProfilePictureUpdateOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
              </div>

              {/* Bio Section */}
              <div className="lg:col-span-9 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Bio</h2>
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <p className="text-gray-700 leading-relaxed">
                      {labelDetails?.bio}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Platforms Section */}
              <div className="lg:col-span-12 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Social Platforms</h2>
                <div className=" flex flex-col md:flex-row gap-2 flex-wrap">
                  {
                    labelDetails?.instagram && (
                      <Link href={labelDetails?.instagram} className="flex flex-1 items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">Instagram</span>
                  </Link>
                    )
                  }

                  {
                    labelDetails?.facebook && (
                      <Link href={labelDetails.facebook} className="flex flex-1 items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Facebook className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">Facebook</span>
                      </Link>
                    )
                  }

                  {
                    labelDetails?.ytMusic && (
                      <Link href={labelDetails.ytMusic} className="flex flex-1 items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                      <Music className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">Yt Music</span>
                  </Link>
                    )
                  }

                  {
                    labelDetails?.appleMusic && (
                      <Link href={labelDetails.appleMusic} className="flex flex-1 items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                      <Apple className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">Apple Music</span>
                  </Link>
                    )
                  }

                  {
                    labelDetails?.spotify && (
                      <Link href={labelDetails.spotify} className="flex flex-1 items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <Music className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">Spotify</span>
                  </Link>
                    )
                  }
                </div>
              </div>

                <div className="lg:col-span-12 flex space-y-4">
                    {
                      labelDetails?.uniqueUsername ? (
                        <>  
                            <div className="flex  overflow-x-auto items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                                <LinkIcon className="w-8 h-8 p-1 text-white" />
                              </div>
                              <span className="text-gray-700 font-medium">{smartLink} </span>
                              <span className="h-[32px] w-[32px]">
                                <Copy className="hover:bg-black/10 p-1 block h-[32px] w-[32px] rounded duration-100 cursor-pointer" onClick={handleCopyToClipboardSmartLink}/>
                              </span>
                            </div>
                        </>
                      ) : (
                        <Button variant={"outline"} onClick={()=>setIsUniqueUsernameUpdateModalOpen(true)}>
                          Update Username
                        </Button>
                      )
                    }
                </div>
            </div>
          </Card>
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
              <div
                className={`mb-3 col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3`}
              >
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

              <div
                className={`mb-3 col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3`}
              >
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

              <div
                className={`mb-3 col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3`}
              >
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

              <div
                className={`mb-3 col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3`}
              >
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

              <div
                className={`mb-3 col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3`}
              >
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

              <div
                className={`mb-3 col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3`}
              >
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
                      visibleFields.upiId ? "bi bi-eye-slash" : "bi bi-eye-fill"
                    }`}
                  ></i>
                </div>
              </div>

              <div
                className={`mb-3 col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3`}
              >
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

              <div
                className={`mb-3 col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3`}
              >
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
                      visibleFields.gstNo ? "bi bi-eye-slash" : "bi bi-eye-fill"
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
        <LableDetailsEditModal isVisible={isLabelDetailsEditOpen} onClose={handleCloseEditDetails}/>
        <UpdateProfilePictureModal isVisible={isProfilePictureModalUpdateOpen} setIsVisible={setIsProfilePictureUpdateOpen} onClose={handleCloseProfilePictureUpdate}/>
        <UpdateUniqueUsernameModal setIsVisible={setIsProfilePictureUpdateOpen} isVisible={isUniqueUsernameUpdateModalOpen} onClose={handleCloseUniqueUsernameModal}/>
      </div>
    </div>
  );
};

export default Page;
