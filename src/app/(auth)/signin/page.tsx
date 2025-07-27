"use client";
import Link from "next/link";
import Styles from "../Styles/Signin.module.css";
import { useState } from "react";
import toast from "react-hot-toast";
import { apiPost } from "@/helpers/axiosRequest";
import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import { Mail, Eye, EyeOff } from "lucide-react";

const SignIn = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [isSending, setIsSending] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.length > 0 && emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length > 0;
  };

  const onSignIn = async () => {
    setIsSending(true);

    if (!validateEmail(user.email)) {
      console.log("Invalid email format");
      toast.error("Enter a valid email");
      return;
    }

    if (!validatePassword(user.password)) {
      console.log("Password must be at least 8 characters long");
      toast.error("Enter a valid Password");
      return;
    }

    try {
      const response = await apiPost("/api/user/signin", user);

      if (response.success) {
        toast.success("Login Successful");
        setUser({ email: "", password: "" });
        if (response.data.signature) {
          router.push("/");
        } else {
          router.push(`agreement/${btoa(response.data._id)}`);
        }
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center w-full h-screen ${Styles.mainContainer}`}
    >
      <div className={` ${Styles.containerLeft}`}>
        <div className={`mb-5 ${Styles.mobileResponsiveLogo}`}>
          <Image
            src={
              "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/SwaLay+-2.png"
            }
            alt="logo"
            width={150}
            height={150}
          />
          <p>Get Your Music On Global Platforms</p>
        </div>

        <div className={Styles.containerLeftInner}>
          <h2 className={Styles.heading}>Sign In</h2>

          <div>
            <div className={`mt-3 ${Styles.registerform}`}>
              <div className={Styles.formGroup}>
                <label className={Styles.inputLable} htmlFor="email">
                  <Mail size={20} />
                </label>
                <input
                  className={Styles.inputField}
                  type="email"
                  required={true}
                  name="email"
                  id="email"
                  placeholder="Your Email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              <div className={Styles.formGroup}>
                <label className={Styles.inputLable} htmlFor="pass">
                  {isPasswordVisible ? (
                    <Eye size={20} onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="cursor-pointer" />
                  ) : (
                    <EyeOff size={20} onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="cursor-pointer" />
                  )}
                </label>
                <input
                  className={Styles.inputField}
                  type={isPasswordVisible ? "text" : "password"}
                  name="pass"
                  id="pass"
                  required={true}
                  placeholder="Password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
              </div>

              <div className={`${Styles.formGroup} ${Styles.formbutton} `}>
                <button
                  className={Styles.submitButton}
                  onClick={onSignIn}
                  style={{
                    cursor: isSending ? "not-allowed" : "pointer",
                  }}
                >
                  {isSending ? "Sign In ..." : "Sign In"}
                </button>
              </div>

              <div className={Styles.otherLinks}>
                <p className={Styles.dontHaveAccount}>
                  Forgot Password?{" "}
                  <Link href="/forgotpassword"> Reset here</Link>
                </p>

                <p className={Styles.dontHaveAccount}>
                  Don&apos;t have an account? <Link href="/signup"> Sign Up</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex h-screen ${Styles.containerRight}`}>
        <Image
          src="https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/SwaLay++(1).png"
          alt="logo"
          width={250}
          height={200}
        />
        <p className={Styles.subHeading}>Get Your Music On Global Platforms</p>
      </div>
    </div>
  );
};

export default SignIn;
