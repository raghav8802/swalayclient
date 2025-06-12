"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

import UserContext from "@/context/userContext";

import { apiGet } from "@/helpers/axiosRequest";
import CopyRightsModalForm from "./components/CopyRightsModalForm";
import { CopyRightsDataTable } from "./components/CopyRightsDataTable";

const Copyrights = () => {
  const context = useContext(UserContext);
  const labelId = context?.user?._id;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copyrights, setCopyrights] = useState();

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const fetchAllCopyrights = async (labelId: any) => {
    setIsLoading(true);
    try {
      const response = await apiGet(
        `/api/copyright/getCopyrights?labelid=${labelId}`
      );
      
      if (response.success) {
        setCopyrights(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error("failed");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (labelId) {
      fetchAllCopyrights(labelId);
    }
  }, [labelId]);

  return (
    <div
      className="w-full h-full p-6 bg-white rounded-sm"
      style={{ minHeight: "90vh" }}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Copyrights</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex md:justify-between gap-2 flex-col md:flex-row md:items-center mt-3 mb-5">
        <h3 className="text-3xl font-bold text-blue-500">
          All Copyrights
        </h3>
        <Button className="self-start" onClick={() => setIsModalVisible(true)}>New Copyrights</Button>
      </div>

      {copyrights && (
        <div className="bg-white">
          <CopyRightsDataTable data={copyrights} />
        </div>
      )}

      {isLoading && (
        <h5 className="text-2xl mt-5 pt-3 text-center">Loading...</h5>
      )}
      {!copyrights && !isLoading && (
        <h5 className="text-2xl mt-5 pt-3 text-center">No Record Found</h5>
      )}

      <CopyRightsModalForm isVisible={isModalVisible} onClose={handleClose} />
    </div>
  );
};

export default Copyrights;
