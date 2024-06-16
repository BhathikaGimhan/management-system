import { useState, useEffect } from "react";
import { CloseIcon } from "../../utils/icons";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useStateContext } from "../../contexts/NavigationContext";
import axiosClient from "../../../axios-client";
import DataTable from "react-data-table-component";

export const ViewItems = ({ handleOpen, open, grn }) => {
  const [address, setAddress] = useState("");
  const { user } = useStateContext();
  useEffect(() => {
    const getAddress = () => {
      axiosClient
        .get(`/branch/${user.branch}/`)
        .then((res) => {
          let data = res.data;
          setAddress(data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getAddress();
  }, [user]);

  // Event handler for closing the dialog
  const handleClose = () => {
    handleOpen();
  };

  const TABLE_VIEW_GRN = [
    {
      name: "ITEM",
      selector: (item) => item.Item_Description,
      wrap: false,
      maxWidth: "fit",
      cellStyle: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
      sortable: true,
    },
    {
      name: "COST (LKR)",
      selector: (item) =>
        parseFloat(item.Cost).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      wrap: false,
      maxWidth: "auto",
    },
    {
      name: "QUANTITY",
      selector: (item) => parseInt(item.Qty).toLocaleString("en-US"),
      wrap: false,
      maxWidth: "auto",
    },
    {
      name: "DISCOUNT",
      selector: (item) => (
        <span className="text-end">
          {item.Discount_Type === "percentage"
            ? item.Discount + " %"
            : "LKR " +
              parseFloat(item.Discount).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
        </span>
      ),
      wrap: false,
      maxWidth: "auto",
      right: true,
    },
    {
      name: "SUB TOTAL (LKR)",
      selector: (item) => (
        <span className="pr-2">
          {parseFloat(item.Sub_Total).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
      wrap: false,
      maxWidth: "auto",
      right: true,
    },
    {
      name: "Total (LKR)",
      selector: (item) => (
        <span className="pr-2">
          {parseFloat(item.Total).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
      wrap: false,
      maxWidth: "auto",
      right: true,
    },
  ];

  const tableHeaderStyles = {
    headCells: {
      style: {
        borderTop: "1px solid #7335E5",
        borderBottom: "1px solid #7335E5",
        fontFamily: "Poppins",
        fontSize: "12px",
        color: "#7335E5",
      },
    },
    cells: {
      style: {
        whiteSpace: "normal",
        borderTop: "none",
        wordBreak: "break-word",
        borderBottom: "1px solid #e0e3e8",
        fontFamily: "Poppins",
        fontSize: "12px",
        color: "",
      },
    },
  };

  return (
    <>
      <Dialog
        size="md"
        open={open}
        handler={handleClose}
        className="bg-white shadow-none rounded-[10px] overflow-scroll scrollbar-hide font-inter p-5"
      >
        <DialogHeader className="flex justify-between align-center border-b border-[#64728C] border-opacity-20 p-0 items-center pb-3">
          <div className="font-poppins text-[24px] font-medium leading-9 text-[#64728C]">
            GRN
          </div>
          <div
            className="font-bold text-[20px] cursor-pointer"
            onClick={handleClose}
          >
            <CloseIcon />
          </div>
        </DialogHeader>

        <DialogBody className="flex flex-col gap-3 w-full mt-5 overflow-y-scroll pl-0 max-h-[500px]">
          <div className="flex flex-col">
            <div className="flex gap-5 items-center md:w-[40%]">
              <span className="font-poppins text-[#64728C] font-medium text-[12px] md:text-[14px] leading-[22px] w-[30%]">
                Date
              </span>
              <span className="font-poppins text-[#64728C] font-normal text-[12px] md:text-[14px] leading-[22px]">
                {grn.Date}
              </span>
            </div>
            <div className="flex gap-5 items-center md:w-[40%]">
              <span className="font-poppins text-[#64728C] font-medium text-[12px] md:text-[14px] leading-[22px] w-[30%]">
                Invoice No
              </span>
              <span className="font-poppins text-[#64728C] font-normal text-[12px] md:text-[14px] leading-[22px]">
                {grn.Bill_no ? grn.Bill_no : "#"}
              </span>
            </div>
            <div className="flex gap-5 items-center md:w-[40%]">
              <span className="font-poppins text-[#64728C] font-medium text-[12px] md:text-[14px] leading-[22px] w-[30%]">
                Supplier
              </span>
              <span className="font-poppins text-[#64728C] font-normal text-[12px] md:text-[14px] leading-[22px]">
                {grn.Company_Name}
              </span>
            </div>
            <div className="flex gap-5 items-center md:w-[40%]">
              <span className="font-poppins text-[#64728C] font-medium text-[12px] md:text-[14px] leading-[22px] w-[30%]">
                Note
              </span>
              <span className="font-poppins text-[#64728C] font-normal text-[12px] md:text-[14px] leading-[22px]">
                {grn?.notes === "" ? `${grn?.notes}` : "[No Note]"}
              </span>
            </div>
          </div>
          <div>
            <DataTable
              columns={TABLE_VIEW_GRN}
              responsive
              data={grn?.items}
              customStyles={tableHeaderStyles}
              className="mt-4 w-full"
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 15]}
              paginationComponentOptions={{
                rowsPerPageText: "Entries per page:",
                rangeSeparatorText: "of",
              }}
              noDataComponent={
                <div className="text-center">No data available</div>
              }
            />
          </div>
          <div className="w-full flex flex-row mt-6 justify-end">
            <div className="w-[100%] md:w-[40%] flex justify-between text-sm font-poppins font-semibold text-[12px] leading-[18px] text-[#64728C]">
              <div className="flex flex-col gap-2">
                <div>Subtotal (LKR)</div>
                <div>
                  Discount {grn.Discount_Type === "percentage" ? "%" : "(LKR)"}
                </div>
                <div>Total (LKR)</div>
                <div>Paid Amount (LKR)</div>
                <div>Credit Balance (LKR)</div>
              </div>
              <div className=" items-end flex flex-col gap-2">
                <div className="text-end">
                  {parseFloat(grn?.Total_Amount).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-end">
                  {grn.Bill_Discount
                    ? grn.Discount_Type === "percentage"
                      ? grn.Bill_Discount
                      : parseFloat(grn.Bill_Discount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                    : "0"}
                </div>
                <div className="text-end">
                  {parseFloat(grn?.Net_Total).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-end">
                  {parseFloat(grn?.Paid_Amount).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-end">
                  {parseFloat(grn?.Credit_Balance_Amount).toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter />
      </Dialog>
    </>
  );
};
