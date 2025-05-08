"use client";
import { apiFormData, apiGet } from "@/helpers/axiosRequest";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import Loading from "../../loading";
import { Accept } from "react-dropzone";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ArtistData {
  _id: string;
  artistName: string;
  about: string;
  contact: string;
  email: string;
  spotify: string;
  appleMusic: string;
  instagram: string;
  facebook: string;
  iprs: boolean;
  iprsNumber: string;
  isSinger: boolean;
  isLyricist: boolean;
  isComposer: boolean;
  isProducer: boolean;
}



export default function EditArtistPage({ params }: { params: { id: string } }) {

  const decodedArtistId = atob(params.id);
  const [isLoading, setIsLoading] = useState(true);
  const [artistData, setArtistData] = useState<ArtistData | null>(null);
 

  const router = useRouter();

  const [formData, setFormData] = useState({
    artistName: "",
    about: "",
    contact: "",
    email: "",
    spotifyID: "",
    appleID: "",
    instagramID: "",
    facebookID: "",
    isIPRSMember: false,
    iprsNumber: "",
    profileImage: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [artistType, setArtistType] = useState({
    singer: false,
    lyricist: false,
    composer: false,
    producer: false,
  });

  // Handle Dropzone for Image Upload
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    } as Accept,
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFormData((prev) => ({
        ...prev,
        profileImage: acceptedFiles[0] as File,
      }));
    },
  });

  const fetchArtistDetails = React.useCallback(async () => {
    try {
      const response = await apiGet(
        `/api/artist/getArtistDetails?artistId=${decodedArtistId}`
      );
  
      if (response.success) {
        const artist = response.data.artistData;
        setArtistData(artist);
  
        // Set form data
        setFormData({
          artistName: artist.artistName || "",
          about: artist.about || "",
          contact: artist.contact || "",
          email: artist.email || "",
          spotifyID: artist.spotify || "",
          appleID: artist.appleMusic || "",
          instagramID: artist.instagram || "",
          facebookID: artist.facebook || "",
          isIPRSMember: artist.iprs || false,
          iprsNumber: artist.iprsNumber || "",
          profileImage: null,
        });
  
        setArtistType({
          singer: artist.isSinger || false,
          lyricist: artist.isLyricist || false,
          composer: artist.isComposer || false,
          producer: artist.isProducer || false,
        });
      } else {
        toast.error("Failed to fetch artist details");
      }
    } catch (error) {
      toast.error("Error fetching artist details!");
    } finally {
      setIsLoading(false);
    }
  }, [decodedArtistId]); // Add dependencies here
  
  useEffect(() => {
    fetchArtistDetails();
  }, [fetchArtistDetails]); // Include fetchArtistDetails in the dependency array


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!artistData) return;

    // IPRS validation
    if (
      formData.isIPRSMember &&
      (!formData.iprsNumber || !/^\d{12}$/.test(formData.iprsNumber))
    ) {
      toast.error("IPRS Number must be a 12-digit number.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Updating artist details");

    const data = new FormData();
    data.append("artistId", artistData._id);
    data.append("artistName", formData.artistName);
    data.append("about", formData.about);
    data.append("contact", formData.contact);
    data.append("email", formData.email);
    data.append("iprs", formData.isIPRSMember.toString());
    data.append("iprsNumber", formData.iprsNumber || "");
    data.append("facebook", formData.facebookID);
    data.append("appleMusic", formData.appleID);
    data.append("spotify", formData.spotifyID);
    data.append("instagram", formData.instagramID);
    data.append("isSinger", artistType.singer.toString());
    data.append("isLyricist", artistType.lyricist.toString());
    data.append("isComposer", artistType.composer.toString());
    data.append("isProducer", artistType.producer.toString());

    if (formData.profileImage) {
      data.append("profileImage", formData.profileImage);
    }

    try {
      const response = await apiFormData(`/api/artist/updateArtist`, data);
      toast.dismiss(toastId);
      if (response.success) {
        toast.success("Artist updated successfully");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error(
        "An error occurred while updating the artist. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      router.push(`/artists/${btoa(decodedArtistId)}`);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[90vh] p-6 bg-white rounded-sm">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Artists</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mt-3">
        <h3 className="text-3xl font-bold mb-2 text-blue-500">Edit Artist</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* Left Column - Profile Image */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">
              Profile Image
            </h4>
            <div className="space-y-4">
              {formData.profileImage ? (
                <div className="relative aspect-square w-full rounded-lg overflow-hidden">
                  <Image
                    src={URL.createObjectURL(formData.profileImage)}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, profileImage: null }))
                    }
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors bg-gray-50"
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      Drag & drop an image here, or click to select one
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Form Fields */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold mb-6 text-gray-800">
              Artist Information
            </h4>
            <div className="space-y-6">
              {/* Artist Name */}
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="artistName"
                >
                  Artist Name
                </label>
                <input
                  type="text"
                  id="artistName"
                  name="artistName"
                  value={formData.artistName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter artist name"
                />
              </div>

              {/* About */}
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="about"
                >
                  About
                </label>
                <textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write about the artist"
                  rows={3}
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="contact"
                  >
                    Contact
                  </label>
                  <input
                    type="tel"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter contact number"
                  />
                </div>
              </div>

              {/* Social Media Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="spotifyID"
                  >
                    Spotify URL
                  </label>
                  <input
                    type="url"
                    id="spotifyID"
                    name="spotifyID"
                    value={formData.spotifyID}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter Spotify URL"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="appleID"
                  >
                    Apple Music URL
                  </label>
                  <input
                    type="url"
                    id="appleID"
                    name="appleID"
                    value={formData.appleID}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter Apple Music URL"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="instagramID"
                  >
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    id="instagramID"
                    name="instagramID"
                    value={formData.instagramID}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter Instagram URL"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="facebookID"
                  >
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    id="facebookID"
                    name="facebookID"
                    value={formData.facebookID}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter Facebook URL"
                  />
                </div>
              </div>

              {/* IPRS Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    IPRS Member?
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isIPRSMember"
                        checked={formData.isIPRSMember}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            isIPRSMember: true,
                          }))
                        }
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isIPRSMember"
                        checked={!formData.isIPRSMember}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            isIPRSMember: false,
                          }))
                        }
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="iprsNumber"
                  >
                    IPRS Number
                  </label>
                  <input
                    type="text"
                    id="iprsNumber"
                    name="iprsNumber"
                    value={formData.iprsNumber}
                    onChange={handleInputChange}
                    disabled={!formData.isIPRSMember}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !formData.isIPRSMember ? "bg-gray-100" : ""
                    }`}
                    placeholder="Enter IPRS Number"
                    maxLength={12}
                  />
                </div>
              </div>

              {/* Artist Types */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Artist Type
                </label>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(artistType).map(([type, checked]) => (
                    <label key={type} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setArtistType((prev) => ({
                            ...prev,
                            [type]: e.target.checked,
                          }))
                        }
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
