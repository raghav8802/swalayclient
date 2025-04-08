"use client";
import React, { useState } from "react";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import Styles from "@/app/(auth)/Styles/Signup.module.css";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { apiPost } from "@/helpers/axiosRequest";


const SignupPage = () => {
  const [userType, setUserType] = useState<"artist" | "label" | null>(null);

  const [isAccountCreated, setIsAccountCreated] = useState(false)

  const images = [
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Angel.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Haaniye.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Irada.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Mann-Parindey.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Phir-Rahi-raat.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Qasoor.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Rajsthani-Folk.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Sach-Wala-Pyar.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Sukoon.webp",

    // "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
    // "https://assets.aceternity.com/animated-modal.png",
    // "https://assets.aceternity.com/animated-testimonials.webp",
    // "https://assets.aceternity.com/cloudinary_bkp/Tooltip_luwy44.png",
    // "https://assets.aceternity.com/github-globe.png",
    // "https://assets.aceternity.com/glare-card.png",
    // "https://assets.aceternity.com/layout-grid.png",
    // "https://assets.aceternity.com/flip-text.png",
    // "https://assets.aceternity.com/hero-highlight.png",

    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Angel.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Haaniye.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Irada.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Mann-Parindey.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Phir-Rahi-raat.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Qasoor.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Rajsthani-Folk.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Sach-Wala-Pyar.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Sukoon.webp",



    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Phir-Rahi-raat.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Qasoor.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Rajsthani-Folk.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Sach-Wala-Pyar.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Sukoon.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Angel.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Haaniye.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Irada.webp",
    "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/albums/Mann-Parindey.webp",
  



    // "https://assets.aceternity.com/carousel.webp",
    // "https://assets.aceternity.com/placeholders-and-vanish-input.png",
    // "https://assets.aceternity.com/shooting-stars-and-stars-background.png",
    // "https://assets.aceternity.com/signup-form.png",
    // "https://assets.aceternity.com/cloudinary_bkp/stars_sxle3d.png",
    // "https://assets.aceternity.com/spotlight-new.webp",
    // "https://assets.aceternity.com/cloudinary_bkp/Spotlight_ar5jpr.png",
    // "https://assets.aceternity.com/cloudinary_bkp/Parallax_Scroll_pzlatw_anfkh7.png",
    // "https://assets.aceternity.com/tabs.png",
    // "https://assets.aceternity.com/cloudinary_bkp/Tracing_Beam_npujte.png",
    // "https://assets.aceternity.com/cloudinary_bkp/typewriter-effect.png",
    // "https://assets.aceternity.com/glowing-effect.webp",
    "https://assets.aceternity.com/hover-border-gradient.png",
    "https://assets.aceternity.com/cloudinary_bkp/Infinite_Moving_Cards_evhzur.png",
    "https://assets.aceternity.com/cloudinary_bkp/Lamp_hlq3ln.png",
    "https://assets.aceternity.com/macbook-scroll.png",
    "https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png",
    "https://assets.aceternity.com/cloudinary_bkp/Moving_Border_yn78lv.png",
    "https://assets.aceternity.com/multi-step-loader.png",
    "https://assets.aceternity.com/vortex.png",
    "https://assets.aceternity.com/wobble-card.png",
    "https://assets.aceternity.com/world-map.webp",
  ];

  return (
    <div className={Styles.container}>
      <div className={`${Styles.containerLeft}`}>
        <div className={Styles.headingContainer}>
          <Image
            src={
              "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/SwaLay+-2.png"
            }
            width={120}
            height={70}
            className={Styles.logo}
            alt="logo"
            loading="lazy"
          />
        </div>

        <div className={Styles.containerLeftInner}>
            {!userType ? (
            <div className="flex flex-col gap-4 mt-8">
              <h3 className={Styles.roleTitle}>Pick Your Music Journey!</h3>

              <p className={Styles.roleDescription}>
              Are you an independent artist or a music label? Choose your path
              to get started.
              </p>

              <div
              onClick={() => setUserType("artist")}
              className={Styles.roleButton}
              >
              Independent Artist
              </div>

              <div
              onClick={() => setUserType("label")}
              className={Styles.roleButtonLabel}
              >
              Music Label
              </div>
            </div>
            ) : (
            <div className="w-full">

              {
                !isAccountCreated && (
                  <SignupForm 
                  userType={userType} 
                  goBack={() => setUserType(null)} 
                  setIsAccountCreated={setIsAccountCreated}
                  />
                )
              }
           
              {isAccountCreated && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-8 mb-8">
                <div className="bg-gradient-to-r from-green-400 to-green-500 p-6 flex justify-center">
                  <div className="bg-white rounded-full p-3 shadow-md">
                    <svg className="h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Account Created Successfully</h3>
                  <p className="text-gray-600 mb-4 font-semibold">
                    We've sent a verification link to your email address. Please check your inbox and verify your account.
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    If you didn't receive the email, please check your spam folder or contact our support team.
                  </p>

                </div>
              </div>
              )}


            </div>
            )}

          <p className="mt-5 text-center fw-bold text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/signin" className={Styles.termservice}>
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <div className={`${Styles.containerRight}`}>
        <div
          className={`absolute inset-0 z-0 h-full w-full ${Styles.backgroundOverlaw}`}
        >
          <ThreeDMarquee
            className="pointer-events-none h-full w-full inset-0"
            images={images}
          />
        </div>

        <div
          className={`absolute inset-0 z-10 flex flex-col 
        items-center justify-center p-8 text-white ${Styles.containerRightTextContainer}`}
        >
          <h2 className="text-4xl font-bold mb-4">
            1,00,000+ Tracks streaming
          </h2>
          <p className="text-lg max-w-md text-center">
            Join our growing community of creators and streamers who are
            revolutionizing the industry.
          </p>
        </div>
      </div>
    </div>
  );
};

// Unified Signup Form Component
const SignupForm = ({ 
  userType,
  goBack ,
  setIsAccountCreated, 
}: { 
  userType: "artist" | "label",
  goBack: () => void ;
  setIsAccountCreated: React.Dispatch<React.SetStateAction<boolean>>; // Type for the setter function
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isArtist = userType === "artist";
  const formTitle = isArtist ? "Artist Name" : "Label Name";
  const placeholderText = isArtist ? "Your stage name" : "Your label name";
  const buttonClass = isArtist ? "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400" : "bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400";
  const buttonText = isArtist ? "Create Artist Account" : "Create Label Account";
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setIsAgreementChecked(checked);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = `${formTitle} is required`;
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.contact.trim()) {
      newErrors.contact = "Contact is required";
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "Contact must be 10 digits";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    if (!isAgreementChecked) {
      newErrors.agreement = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);
    try {
      
      const response = await apiPost('/api/user/signup', {
        username: formData.name,
        email: formData.email,
        contact: formData.contact,
        password: formData.password,
        userType: userType
      });

      if(response.success) {
        setIsAccountCreated(true);
      }else{
        toast.error(response.message || "Failed to create account");
        return;
      }
      
      toast.success(`Account created successfully!`);
      // Redirect to login or dashboard
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className={Styles.heading}>Create Your Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{formTitle}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.name ? 'border-red-500' : ''}`}
            placeholder={placeholderText}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
       

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-500' : ''}`}
            placeholder="your@email.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.contact ? 'border-red-500' : ''}`}
            placeholder="9876543210"
          />
          {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${errors.password ? 'border-red-500' : ''}`}
              placeholder="••••••••"
            />
            <span
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </span>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="••••••••"
            />
            <span
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </span>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>

        <div className={Styles.formGroup}>
          <input
            type="checkbox"
            name="agree-term"
            id="agree-term"
            className={Styles.agreeTerm}
            checked={isAgreementChecked}
            onChange={handleChange}
          />
          <label
            className={`${Styles.inputLable} ${Styles.labelagreeterm}`}
            htmlFor="agree-term"
          >
            <span>
              <span> </span>
            </span>
            I agree all statements in{" "}
            <Link href="#" className={Styles.termservice}>
              Terms of service
            </Link>
          </label>
          {errors.agreement && <p className="text-red-500 text-xs mt-1">{errors.agreement}</p>}
        </div>

        <button
          type="submit"
          className={`w-full py-3 text-white rounded-sm ${buttonClass}`}
          disabled={isLoading || !isAgreementChecked}
        >
          {isLoading ? "Creating Account..." : buttonText}
        </button>

        <button
          type="button"
          onClick={goBack}
          className="text-sm text-gray-600 hover:text-gray-800 mb-4 flex items-center"
        >
          ← Back to selection
        </button>
      </form>
    </div>
  );
};

export default SignupPage;

