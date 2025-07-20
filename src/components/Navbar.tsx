"use client";
import React, { useContext, useState, useRef, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Link from "next/link";
import { apiGet, apiPost } from "@/helpers/axiosRequest";
import { useRouter } from "next/navigation";
import UserContext from "@/context/userContext";
import Image from "next/image";
import { Wallet } from "lucide-react";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]); // Stores search results from API
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false); // To show loading state
  const [isMobileView, setIsMobileView] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const sideBarRef = useRef<HTMLDivElement>(null)

  const router = useRouter();
  const context = useContext(UserContext);
  const labelId = context?.user?._id;

  const [showMenu, setShowMenu] = useState(false);
  const [showLogo,setShowLogo] = useState(false)

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLinkClick = () => {
    setShowMenu(false);
  };

  const handleMouseOverOnSideBar = ()=>{
    setShowLogo(true)
  }

  const handleMouseOutFromSidebar = ()=>{
    setShowLogo(false)
  }

  // Search functionality
  const handleSearch = React.useCallback(
    async (query: string) => {
      console.log("query : ", query);

      if (!query) {
        setSearchResults([]);
        setShowSuggestions(false);
        return;
      }

      if (query === "") {
        setSearchResults([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      try {
        const response = await apiGet(
          `/api/search?query=${query}&labelid=${labelId}`
        );

        console.log("response : ");
        console.log(response);

        if (response.success) {
          setSearchResults(response.data); // Store search results
          setShowSuggestions(true); // Show suggestions dropdown
        } else {
          setSearchResults([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error during search:", error);
        setSearchResults([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    },
    [labelId] // Add dependencies here
  );

  useEffect(() => {
    // Trigger search API if search term is not empty
    if (searchTerm.trim().length > 0) {
      handleSearch(searchTerm);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm, handleSearch]); // Include handleSearch in the dependency array

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    const sideBarElement = sideBarRef.current;

    document.addEventListener("mousedown", handleClickOutside);
    sideBarElement?.addEventListener("mouseover", handleMouseOverOnSideBar);
    sideBarElement?.addEventListener("mouseout", handleMouseOutFromSidebar);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      sideBarElement?.removeEventListener("mouseover", handleMouseOverOnSideBar);
      sideBarElement?.removeEventListener("mouseout", handleMouseOutFromSidebar);
    };
  }, []);

  const onLogout = async () => {
    console.log("click logout");
    try {
      const res = await apiPost("/api/user/logout", {});
      console.log(res);
      context?.setUser(undefined);
      router.refresh();
    } catch (error) {
      console.log("Error during logout:", error);
    }
  }

  useEffect(() => {
  if (typeof window !== "undefined") {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 673);
    };

    handleResize(); // Set initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }
}, []);

  return (
    <div>
      <header className="header">
        <div className="header__container">
          
          <Link href="/" className="header__logo">
            <Image
              src={
                "https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/SwaLay-logo.png"
              }
              alt="logo"
              width={100}
              height={70}
            />
          </Link>

          <div className="flex gap-2 justify-between flex-1 md:flex-none pr-4 md:pr-0 items-center">
            <Image src={"https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/SwaLay-logo.png"} width={100} height={100} className="w-10 md:hidden" alt="Logo"/>
            <div className="header__search">
            <div className="max-w-lg w-full lg:max-w-xs relative">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <input
                  id="search"
                  name="search"
                  className="header__input"
                  placeholder="Search album or track"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                />
              </div>

              {loading && <p>Loading...</p>}

              {/* Display search results dynamically */}
              {showSuggestions && searchResults.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-12 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                >
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                      onClick={() => {
                        setSearchTerm(result.albumName || result.trackName);
                        setShowSuggestions(false);
                        // Redirect to the appropriate page
                        if (result.type === "album") {
                          router.push(
                            `/albums/viewalbum/${btoa(result.albumId)}`
                          );
                        } else if (result.type === "track") {
                          router.push(
                            `/albums/viewalbum/${btoa(result.albumId)}`
                          );
                        }
                      }}
                    >
                      <Link href="#">
                        {result.type === "album"
                          ? `Album: ${result.albumName}`
                          : `Track: ${result.trackName} (Album: ${result.albumName})`}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </div>
             
          </div>

          

          <div className="header__toggle">
            <i
              className={`bi ${showMenu ? "bi-x" : "bi-list"}`}
              id="header-toggle"
              onClick={toggleMenu}
            ></i>
          </div>
        </div>
      </header>

      <div className={`nav ${showMenu ? "show-menu" : ""}`} id="navbar" ref={sideBarRef}>
        <nav className="nav__container">
          <div>
            <div className="overflow-hidden">
              <Link href="/" className="nav__link nav__logo">
                <Image src={"https://swalay-music-files.s3.ap-south-1.amazonaws.com/assets/SwaLay-logo.png"} width={100} height={100} className={`max-w-[100px] m-auto ${isMobileView  ? "opacity-100" : showLogo ? "" : "opacity-0 ease-in-out duration-500"}`}  alt="Logo"/>
              </Link>
            </div>
            

            <div className="nav__list">
              <div className="nav__items">
                <Link
                  href="/"
                  className="nav__link active"
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-house-door nav__icon"></i>
                  <span className="nav__name">Home</span>
                </Link>

                <div className="nav__dropdown">
                  <Link href="/albums" className="nav__link ">
                    <i className="bi bi-vinyl nav__icon"></i>
                    <span className="nav__name">Albums</span>
                    <i className="bi bi-chevron-down nav__icon nav__dropdown-icon"></i>
                  </Link>

                  <div className="nav__dropdown-collapse ">
                    <div className="nav__dropdown-content">
                      <Link
                        href="/albums/new-release"
                        className="nav__dropdown-item"
                        onClick={handleLinkClick}
                      >
                        New release
                      </Link>
                      <Link href="/albums" className="nav__dropdown-item" onClick={handleLinkClick}>
                        Albums
                      </Link>
                      <Link href="/albums/draft" className="nav__dropdown-item" onClick={handleLinkClick}>
                        Draft Albums
                      </Link>
                      <Link href="/albums/live" className="nav__dropdown-item" onClick={handleLinkClick}>
                        Live albums
                      </Link>
                      <Link
                        href="/albums/rejected"
                        className="nav__dropdown-item"
                        onClick={handleLinkClick}
                      >
                        Rejected albums
                      </Link>
                    </div>
                  </div>
                </div>

                <Link
                  href="/marketing"
                  className="nav__link "
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-megaphone nav__icon"></i>
                  <span className="nav__name">Marketing</span>
                </Link>

                <Link
                  href="/earnings"
                  className="nav__link "
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-cash nav__icon"></i>
                  <span className="nav__name">Earnings</span>
                </Link>

                <Link
                  href="/copyrights"
                  className="nav__link "
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-youtube nav__icon"></i>
                  <span className="nav__name ">Copyrights</span>
                </Link>

                <Link
                  href="/artists"
                  className="nav__link "
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-mic nav__icon"></i>
                  <span className="nav__name">Artists</span>
                </Link>

                <Link
                  href="/subscriptions"
                  className="nav__link "
                  onClick={handleLinkClick}
                >
                  <Wallet size={20} strokeWidth={1.75} className="nav__icon" />
                  <span className="nav__name">Subscriptions</span>
                </Link>

                {/* <Link
                  href="/profile"
                  className="nav__link "
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-person nav__icon"></i>
                  <span className="nav__name">Profile</span>
                </Link> */}

                <Link href="/my-tickets" className="nav__link" onClick={handleLinkClick}>
                  <i className="bi bi-chat-left nav__icon"></i>
                  <span className="nav__name">My Tickets</span>
                </Link>

                 <Link
                  href="/profile"
                  className="nav__link "
                  onClick={handleLinkClick}
                >
                  <i className="bi bi-person nav__icon"></i>
                  <span className="nav__name">Profile</span>
                </Link>
                {/* <Link href="/smartlink" className="nav__link">
                  <i className="bi bi-link nav__icon"></i>
                  <span className="nav__name">SmartLink</span>
                </Link> */}
              </div>
            </div>
          </div>

          <div className="nav__link nav__logout" onClick={onLogout}>
            <i className="bi bi-box-arrow-left nav__icon"></i>
            <span className="nav__name">Log Out</span>
          </div>

        </nav>
      </div>
    </div>
  );
};

export default Navbar;
