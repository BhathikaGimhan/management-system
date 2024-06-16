import React from "react";
import { CloseIcon } from "../../utils/icons";
import { Card, Dialog, Typography } from "@material-tailwind/react";

export const ViewInvoice = ({ handleOpen, open, invoice }) => {
  const headerItem = ["Item", "Rate", "Quantity", "Discount (%)", "Total"];

  // Event handler for closing the dialog
  const handleClose = () => {
    handleOpen();
  };

  return (
    <>
      <Dialog
        size="md"
        open={open}
        handler={handleClose}
        className="bg-transparent shadow-none rounded-sm overflow-scroll  scrollbar-hide font-inter"
      >
        <Card className="mx-auto w-full p-5 rounded-sm max-w-[100%] ">
          <div className="flex justify-between align-center border-b-2 border-grey">
            <div className="font-inter text-lg font-bold   pb-5"></div>
            <div
              className="font-bold text-[20px] cursor-pointer"
              onClick={handleClose}
            >
              <CloseIcon />
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full mt-5">
            <div className="flex flex-col ">
              <div className="flex gap-5 items-center w-[40%]">
                <span className="font-inter text-black font-medium text-[16px] w-[30%]">
                  Date{" "}
                </span>
                <span className="font-inter text-black font-medium text-[16px]">
                  {invoice.Date}
                </span>
              </div>
              <div className="flex gap-5 items-center w-[40%]">
                <span className="font-inter text-black font-medium text-[16px] w-[30%]">
                  Customer{" "}
                </span>
                <span className="font-inter text-black font-medium text-[16px]">
                  {invoice.Title} {invoice.First_Name}
                </span>
              </div>
              <div className="flex gap-5 items-center w-[40%]">
                <span className="font-inter text-black font-medium text-[16px] w-[30%]">
                  Total{" "}
                </span>
                <span className="font-inter text-black font-medium text-[16px]">
                  LKR {parseFloat(invoice.Total).toFixed(2)}
                </span>
              </div>
            </div>
            <div>
              <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead class="text-xs text-white uppercase bg-[#1c2850]">
                  <tr className=" border-2 border-[#1c2850]">
                    {headerItem.map((head, index) => (
                      <th scope="col" className="px-2 py-2">
                        <Typography variant="small">
                          {head} {index !== headerItem.length - 1}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className=" border-gray-300 border-b-2 border-l-2 border-r-2">
                  {invoice?.items?.map((item, itemIndex) => {
                    return (
                      <tr
                        className=" border-t-[1px] border-[#0000001e]"
                        key={itemIndex}
                      >
                        <td className="p-2 text-black font-inter font-medium">
                          {item.Item_Name}
                        </td>
                        <td className="p-2 text-black font-inter font-medium">
                          LKR {parseFloat(item.Rate).toFixed(2)}
                        </td>
                        <td className="p-2 text-black font-inter font-medium">
                          {item.Qty}
                        </td>
                        <td className="p-2 text-black font-inter font-medium">
                          {item.Discount}
                        </td>
                        <td className="p-2 text-black font-inter font-medium">
                          LKR {parseFloat(item.Total_Amount).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </Dialog>
    </>
  );
};
