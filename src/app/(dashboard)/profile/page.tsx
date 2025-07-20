"use client";

import React from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import UserContext from "@/context/userContext";
import { apiGet } from "@/helpers/axiosRequest";
import { iLabel } from "@/models/Label";
import toast from "react-hot-toast";
import BankModal from "./components/BankModal";
import LableDetailsEditModal from "./components/LableDetailsEditModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Link as LinkIcon, Globe, Building2, Mail, Phone, Calendar, Wallet2, Eye, EyeOff } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UpdateProfilePictureModal from "./components/UpdateProfilePictureModal";
import UpdateUniqueUsernameModal from "./components/UpdateUniqueUsernameModal";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";

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
  const joinedAt = context?.user?.joinedAt;
  const lableName = context?.user?.lable;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bankData, setBankData] = useState<BankData | null>(null);
  const [labelDetails, setLabelDetails] = useState<iLabel>();
  const [isLabelDetailsEditOpen, setIsLabelDetailsEditOpen] = useState<boolean>(false);
  const [isProfilePictureModalUpdateOpen, setIsProfilePictureUpdateOpen] = useState<boolean>(false);
  const [isUniqueUsernameUpdateModalOpen, setIsUniqueUsernameUpdateModalOpen] = useState<boolean>(false);
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

  const toggleVisibility = (field: keyof typeof visibleFields) => {
    setVisibleFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const fetchBankDetails = useCallback(async () => {
    try {
      const response = await apiGet(`/api/bank/getbankdetails?labelid=${labelId}`);
      if (response.success) {
        setBankData(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch bank details");
      console.error(error);
    }
  }, [labelId]);

  const fetchLabelDetails = useCallback(async () => {
    if (!labelId) return;
    try {
      const response = await apiGet(`/api/user/getLabelDetails?lableId=${labelId}`);
      if (response.success) {
        setLabelDetails(response.data);
      } else {
        toast.error(response.message || "Failed to fetch label details");
      }
    } catch (error) {
      toast.error("Failed to fetch label details");
      console.error(error);
    }
  }, [labelId]);

  useEffect(() => {
    fetchLabelDetails();
  }, [fetchLabelDetails]);

  useEffect(() => {
    if (labelId) {
      fetchBankDetails();
    }
  }, [labelId, fetchBankDetails]);

  const smartLink = `${process.env.NEXT_PUBLIC_BASE_URL}/${labelDetails?.uniqueUsername}`;

  const handleCopyToClipboardSmartLink = async () => {
    if (!labelDetails?.uniqueUsername) {
      toast.error("Username not found");
      return;
    }
    try {
      await navigator.clipboard.writeText(smartLink);
      toast.success("SmartLink copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative group">
              <div className="cursor-pointer" onClick={() => setIsProfilePictureUpdateOpen(true)}>
                <Avatar className="h-24 w-24">
                  <AvatarImage src={`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}user/${labelDetails?.profilePicture}` || ""} />
                  <AvatarFallback className="bg-primary/10">
                    {username?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

            
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold">{lableName || "SwaLay Digital"}</div>
                <Badge variant="outline" className="text-xs">
                  {context?.user?.usertype === "super" ? "Label" : "Artist"}
                </Badge>
              </div>
              <p className="text-muted-foreground">{labelDetails?.bio || "No bio added yet"}</p>
              <div className="flex gap-2 flex-wrap">
                {labelDetails?.uniqueUsername ? (
                  <Button variant="outline" size="sm" onClick={handleCopyToClipboardSmartLink}>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Copy Smart Link
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsUniqueUsernameUpdateModalOpen(true)}>
                    <Globe className="h-4 w-4 mr-2" />
                    Create Smart Link
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setIsLabelDetailsEditOpen(true)}>
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Username</p>
                <p>{username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
              <p>{email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
              <p>{contact}</p>
            </div>
          </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Joined</p>
                <p>{joinedAt ? format(new Date(joinedAt), 'PPP') : 'N/A'}</p>
        </div>
          </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {labelDetails?.instagram && (
              <div className="flex items-center gap-3">
                <Image src="/images/instagram.png" alt="Instagram" width={16} height={16} className="text-muted-foreground" />
                <a href={labelDetails.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Instagram
                </a>
              </div>
            )}
            {labelDetails?.facebook && (
              <div className="flex items-center gap-3">
                <Image src="/images/facebook.png" alt="Facebook" width={16} height={16} className="text-muted-foreground" />
                <a href={labelDetails.facebook} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Facebook
                </a>
              </div>
            )}
            {labelDetails?.ytMusic && (
              <div className="flex items-center gap-3">
                <Image src="/images/youtube-music.png" alt="YouTube Music" width={16} height={16} className="text-muted-foreground" />
                <a href={labelDetails.ytMusic} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  YouTube Music
                </a>
              </div>
            )}
            {labelDetails?.spotify && (
              <div className="flex items-center gap-3">
                <Image src="/images/spotify.png" alt="Spotify" width={16} height={16} className="text-muted-foreground" />
                <a href={labelDetails.spotify} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Spotify
                </a>
              </div>
            )}
            {labelDetails?.appleMusic && (
              <div className="flex items-center gap-3">
                <Image src="/images/apple-music.png" alt="Apple Music" width={20} height={20} className="text-muted-foreground" />
                <a href={labelDetails.appleMusic} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Apple Music
                </a>
              </div>
            )}
            {!labelDetails?.instagram && !labelDetails?.facebook && !labelDetails?.ytMusic && 
             !labelDetails?.spotify && !labelDetails?.appleMusic && (
              <p className="text-muted-foreground text-sm">No social links added yet</p>
            )}
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card className="border-none shadow-sm md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Bank Details</CardTitle>
              <CardDescription>Manage your payment information</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsModalVisible(true)}>
              <Wallet2 className="h-4 w-4 mr-2" />
              {bankData ? "Update" : "Add"} Bank Details
            </Button>
          </CardHeader>
          <CardContent>
            {bankData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Account Holder</p>
                  <div className="flex items-center gap-2">
                    <p>{visibleFields.accountHolderName ? bankData.accountHolderName : "••••••••"}</p>
                    <button 
                      onClick={() => toggleVisibility("accountHolderName")}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {visibleFields.accountHolderName ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
          </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bank Name</p>
                  <div className="flex items-center gap-2">
                    <p>{visibleFields.bankName ? bankData.bankName : "••••••••"}</p>
                    <button 
                      onClick={() => toggleVisibility("bankName")}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {visibleFields.bankName ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
              </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Branch</p>
                  <div className="flex items-center gap-2">
                    <p>{visibleFields.branchName ? bankData.branchName : "••••••••"}</p>
                    <button 
                      onClick={() => toggleVisibility("branchName")}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {visibleFields.branchName ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
              </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Number</p>
                  <div className="flex items-center gap-2">
                    <p>{visibleFields.accountNumber ? bankData.accountNumber : "••••••••"}</p>
                    <button 
                      onClick={() => toggleVisibility("accountNumber")}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {visibleFields.accountNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
              </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IFSC Code</p>
                  <div className="flex items-center gap-2">
                    <p>{visibleFields.ifscCode ? bankData.ifscCode : "••••••••"}</p>
                    <button 
                      onClick={() => toggleVisibility("ifscCode")}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {visibleFields.ifscCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
              </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">UPI ID</p>
                  <div className="flex items-center gap-2">
                    <p>{visibleFields.upiId ? (bankData.upiId || "Not provided") : (bankData.upiId ? "••••••••" : "Not provided")}</p>
                    {bankData.upiId && (
                      <button 
                        onClick={() => toggleVisibility("upiId")}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {visibleFields.upiId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">PAN</p>
                  <div className="flex items-center gap-2">
                    <p>{visibleFields.pan ? bankData.pan : "••••••••"}</p>
                    <button 
                      onClick={() => toggleVisibility("pan")}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {visibleFields.pan ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
              </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">GST Number</p>
                  <div className="flex items-center gap-2">
                    <p>{visibleFields.gstNo ? (bankData.gstNo || "Not provided") : (bankData.gstNo ? "••••••••" : "Not provided")}</p>
                    {bankData.gstNo && (
                      <button 
                        onClick={() => toggleVisibility("gstNo")}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {visibleFields.gstNo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No bank details added yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <BankModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        bankData={bankData}
        onSuccess={fetchBankDetails}
      />
      <LableDetailsEditModal
        isVisible={isLabelDetailsEditOpen}
        onClose={() => setIsLabelDetailsEditOpen(false)}
        labelDetails={labelDetails}
        onSuccess={fetchLabelDetails}
      />
      <UpdateProfilePictureModal
        isVisible={isProfilePictureModalUpdateOpen}
        onClose={() => setIsProfilePictureUpdateOpen(false)}
        onSuccess={fetchLabelDetails}
      />
      <UpdateUniqueUsernameModal
        isVisible={isUniqueUsernameUpdateModalOpen}
        onClose={() => setIsUniqueUsernameUpdateModalOpen(false)}
      />
    </div>
  );
};

export default Page;
