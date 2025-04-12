import { Modal } from "@/components/Modal";
import UserContext from "@/context/userContext";
import { apiPost } from "@/helpers/axiosRequest";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import Loading from "./ui/Loading";

const ArtistModalForm = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const context = useContext(UserContext);
  const labelId = context?.user?._id;
  const [formData, setFormData] = useState({
    artistName: "",
    spotifyID: "",
    appleID: "",
    instagramID: "",
    facebookID: "",
    isIPRSMember: false,
    iprsNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [artistType, setArtistType] = useState({
    singer: false,
    lyricist: false,
    composer: false,
    producer: false,
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    const data = {
      labelId: labelId,
      artistName: formData.artistName,
      iprs: formData.isIPRSMember,
      iprsNumber: formData.iprsNumber,
      facebook: formData.facebookID,
      appleMusic: formData.appleID,
      spotify: formData.spotifyID,
      instagram: formData.instagramID,
      isSinger: artistType.singer,
      isLyricist: artistType.lyricist,
      isComposer: artistType.composer,
      isProducer: artistType.producer,
    };
    const response = await apiPost("/api/artist/addArtist", data);
    if (response.success) {
      setFormData({
        artistName: "",
        spotifyID: "",
        appleID: "",
        instagramID: "",
        facebookID: "",
        isIPRSMember: false,
        iprsNumber: "",
      });
      setArtistType({
        singer: false,
        lyricist: false,
        composer: false,
        producer: false,
      });

      onClose();
      toast.success("New artist added successfully");
    }
    setIsSubmitting(false);
  };

  if (isSubmitting) {
    return (
      <div className="w-full">
        <Loading />
      </div>
    );
  }

  return (
    <Modal
      isVisible={isVisible}
      triggerLabel="Submit"
      title="New Artist"
      onSave={handleSave}
      onClose={onClose}
      description="Note: You can add multiple artist types to a single artist"
    >
      {/* Artist Name */}
      <div>
        <label className="form-label" htmlFor="name">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="artistName"
          value={formData.artistName}
          onChange={(e) =>
            setFormData({ ...formData, artistName: e.target.value })
          }
          className="form-control"
          placeholder="Write artist name"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Spotify */}
        <div>
          <label className="form-label" htmlFor="spotify">
            Spotify ID
          </label>
          <input
            type="url"
            id="spotify"
            name="spotifyID"
            value={formData.spotifyID}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Spotify url of artist"
          />
        </div>

        {/* Apple Music */}
        <div>
          <label className="form-label" htmlFor="apple">
            Apple Music
          </label>
          <input
            type="url"
            id="apple"
            name="appleID"
            value={formData.appleID}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Apple url of artist"
          />
        </div>

        {/* Instagram */}
        <div>
          <label className="form-label" htmlFor="instagram">
            Instagram URL
          </label>
          <input
            type="url"
            id="instagram"
            name="instagramID"
            value={formData.instagramID}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Instagram url of artist"
          />
        </div>

        {/* Facebook */}
        <div>
          <label className="form-label" htmlFor="facebook">
            Facebook URL
          </label>
          <input
            type="url"
            id="facebook"
            name="facebookID"
            value={formData.facebookID}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Facebook url of artist"
          />
        </div>
      </div>

      {/* IPRS Member */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div > 
        <label className="form-label" htmlFor="isIPRSMember">
          IPRS Member?
        </label>

        <ul className="flex items-center">
          <li className="w-1/2">
            <div className="flex items-center ps-3">
              <input
                id="horizontal-list-radio-license"
                type="radio"
                value="true"
                name="isIPRSMember"
                className="w-4 h-4 text-blue-600 bg-gray-100 cursor-pointer"
                checked={formData.isIPRSMember === true}
                onChange={() =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    isIPRSMember: true,
                  }))
                }
              />
              <label
                htmlFor="horizontal-list-radio-license"
                className="cursor-pointer w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Yes
              </label>
            </div>
          </li>

          <li className="w-1/2">
            <div className="flex items-center ps-3">
              <input
                id="horizontal-list-radio-id"
                type="radio"
                value="false"
                name="isIPRSMember"
                className="w-4 h-4 text-blue-600 bg-gray-100 cursor-pointer"
                checked={formData.isIPRSMember === false}
                onChange={() =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    isIPRSMember: false,
                  }))
                }
              />
              <label
                htmlFor="horizontal-list-radio-id"
                className="cursor-pointer w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                No
              </label>
            </div>
          </li>
        </ul>
      </div>

      {/* IPRS Number */}
      <div>
        <label className="form-label" htmlFor="iprsNumber">
          IPRS Number
        </label>
        <input
          type="text"
          id="iprsNumber"
          name="iprsNumber"
          disabled={!formData.isIPRSMember}
          value={formData.iprsNumber}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,12}$/.test(value)) {
              setFormData({ ...formData, iprsNumber: value });
            }
          }}
          className={`form-control ${
            formData.isIPRSMember ? "" : "form-disabled"
          } `}
          placeholder="Enter 12-digit IPRS Number"
          maxLength={12}
        />
      </div>

      </div>




      {/* Artist Types */}
      <label className="mb-0" htmlFor="artistType">
        Artist Type
      </label>
      <div className="flex">
        {["singer", "lyricist", "composer", "producer"].map((type) => (
          <div key={type} className="flex items-center me-5">
            <input
              id={`inline-checkbox-${type}`}
              type="checkbox"
              name={type}
              checked={artistType[type as keyof typeof artistType]}
              onChange={(e) =>
                setArtistType((prev) => ({
                  ...prev,
                  [type]: e.target.checked,
                }))
              }
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor={`inline-checkbox-${type}`}
              className="cursor-pointer ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          </div>
        ))}
      </div>

    </Modal>
  );
};

export default ArtistModalForm;


