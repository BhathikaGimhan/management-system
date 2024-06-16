import React, { useState } from "react";
import { Dialog } from "@material-tailwind/react";
import axiosClient from "../../../axios-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CloseIcon, ProcessingIcon } from "../../utils/icons";
import { useStateContext } from "../../contexts/NavigationContext";

export const ProcessInvoiceService = ({
  handleOpen,
  open,
  invoice,
  handleLoading,
}) => {
  const handleClose = () => {
    handleOpen();
  };
  const [submitting, setSubmitting] = useState(false);
  const { user } = useStateContext();
  const branchId = user.branch;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      let statusData = {
        Branch_idBranch: branchId,
        User_idUser: user.userId,
        idInvoice: invoice,
      };
      const response = await axiosClient.post(
        `/invoice/status/${invoice}`,
        statusData
      );
      handleLoading();
      handleClose();
      setSubmitting(false);
      toast.success(response.data.message || "Service completed successfully");
    } catch (error) {
      setSubmitting(false);
      console.error("Error completing service:", error);
      toast.error("Failed to complete service. Please try again.");
    }
  };

  return (
    <>
      <Dialog
        size="xs"
        open={open}
        handler={handleClose}
        className="bg-white shadow-none rounded-[10px] overflow-y-scroll scrollbar-hide overflow-x-hidden font-poppins"
      >
        <div className="mx-auto w-full p-5 rounded-sm max-w-[100%] h-[4/5]">
          <div className="flex justify-between align-center border-b border-[#64728C] border-opacity-15">
            <div className="font-poppins text-[16px] md:text-[20px] font-medium pb-4 leading-8 md:leading-[30px] text-[#64728C]">
              Complete Service
            </div>
            <div
              className="font-bold text-[20px] cursor-pointer"
              onClick={handleClose}
            >
              <CloseIcon />
            </div>
          </div>
          <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C] mt-6">
            Do you want to complete the service?
          </h3>
          <div className="mb-1 flex flex-col gap-3 relative">
            <div className="flex justify-end pt-3">
              <button
                onClick={handleSubmit}
                className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] hover:opacity-80 text-[#10275E] flex items-center gap-2"
                disabled={submitting}
              >
                {submitting && <ProcessingIcon />}
                Complete
              </button>
            </div>
          </div>
        </div>
      </Dialog>
      <ToastContainer autoClose={1500} />
    </>
  );
};
