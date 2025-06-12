"use client";

import React, { useContext, useEffect, useState } from "react";

import Style from "../../styles/Albums.module.css";
import Link from "next/link";
import { AlbumDataTable } from "./components/AlbumDataTable";
import UserContext from "@/context/userContext";
import toast from "react-hot-toast";
import { apiGet } from "@/helpers/axiosRequest";
import AlbumsLoading from "@/components/AlbumsLoading";
import AlbumSlider from "./components/AlbumSlider";
const color = "#7808d0"; // Define the color variable

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Albums = () => {
  const context = useContext(UserContext);
  const labelId = context?.user?._id;

  const [albumList, setAlbumList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchAlbums = async (labelId: string) => {
    try {
      const response = await apiGet(
        `./api/albums/getAlbums?labelId=${labelId}`
      );

      if (response.success) {
        setAlbumList(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal server error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (labelId) {
      fetchAlbums(labelId);
    }
  }, [labelId]);

  if (isLoading) {
    return <AlbumsLoading />;
  }

  return (
    <div className=" w-100 bg-whitew-full min-h-[80dvh] p-6 bg-white rounded-sm ">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Albums</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* new releases  */}
      <div className={`mt-3 mb-3  ${Style.newReleseContainer}`}>
        <div className={` mb-3 flex-col md:flex-row gap-2 md:gap-4 self-start md:items-center ${Style.spaceBetween}`}>
          <h3 className="text-3xl font-bold text-blue-500">All Albums</h3>

          <Link href={"./albums/new-release"}>
            <button
              className={Style.button}
              style={{ "--clr": color } as React.CSSProperties}
            >
                 New Release
              <span className={Style.button__icon_wrapper}>
                <svg
                  viewBox="0 0 14 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={Style.button__icon_svg}
                  width="10"
                >
                  <path
                    d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                    fill="currentColor"
                  ></path>
                </svg>

                <svg
                  viewBox="0 0 14 15"
                  fill="none"
                  width="10"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${Style.button__icon_svg} ${Style.button__icon_svg_copy}`}
                >
                  <path
                    d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                    fill="currentColor"
                  ></path>
                </svg>
              </span>
           
            </button>
          </Link>

        </div>

        <div className={`mb-3`}>
          {labelId && <AlbumSlider labelId={labelId} />}
        </div>
      </div>

      {/* all music list  */}

      <div
        className={`bg-white p-3 border rounded mt-5 ${Style.musicListContainer}`}
      >
        <div className={` ${Style.spaceBetween}`}>
          <h3 className={Style.titleHeading}>All releases</h3>
        </div>

        <div className={Style.musicList}>
          {albumList ? (
            <AlbumDataTable data={albumList} />
          ) : (
            <h3 className="text-center mt-4">No Albums found</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default Albums;
