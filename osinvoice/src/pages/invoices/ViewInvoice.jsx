import { useState, useEffect } from "react";
import { CloseIcon } from "../../utils/icons";
import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogBody,
} from "@material-tailwind/react";
import abslogo from "../../assets/images/abc-logo.png";
import { useStateContext } from "../../contexts/NavigationContext";
import axiosClient from "../../../axios-client";
import DataTable from "react-data-table-component";
import logo from "../../assets/images/logo-sidebar.png";

export const ViewInvoice = ({ handleOpen, open, invoice }) => {
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

  const TABLE_VIEW_QUOTATION = [
    {
      name: "ITEM",
      selector: (item) => item.Item_Name,
      wrap: false,
      maxWidth: "fit",
      cellStyle: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
      sortable: true,
    },
    {
      name: "RATE (LKR)",
      selector: (item) =>
        parseFloat(item.Rate).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      wrap: false,
      maxWidth: "auto",
    },
    ...(invoice.Invoice_Type === 1
      ? [
          {
            name: "Description",
            selector: (item) => (item.Serial_Number ? item.Serial_Number : "-"),
            wrap: false,
            maxWidth: "auto",
          },
        ]
      : []),
    {
      name: "QUANTITY",
      selector: (item) => parseInt(item.Qty).toLocaleString("en-US"),
      wrap: false,
      maxWidth: "auto",
    },
    {
      name: "DISCOUNT",
      selector: (item) =>
        item.Discount_Type === "amount" ? (
          <span className="pr-2">
            LKR{" "}
            {parseFloat(item.Discount).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        ) : (
          <span className="pr-2">{item.Discount}%</span>
        ),
      wrap: false,
      maxWidth: "auto",
      right: true,
    },
    {
      name: "Total (LKR)",
      selector: (item) => {
        const discountedPrice =
          item.Discount_Type === "amount"
            ? parseFloat(item.Rate) * parseInt(item.Qty) -
              parseFloat(item.Discount)
            : parseFloat(item.Rate) *
              parseInt(item.Qty) *
              (1 - parseFloat(item.Discount) / 100);
        return (
          <span>
            {discountedPrice.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        );
      },
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
        className="bg-white shadow-none scrollbar-hide font-poppins"
      >
        <DialogHeader className="bg-white rounded-t-[10px] border-b border-[#64728C] border-opacity-20">
          <div className="flex items-center justify-between w-full px-5">
            <div>
              <img src={logo} />
            </div>
            <div className="flex flex-col justify-end">
              <span className="font-poppins font-medium text-[24px] leading-9 text-[#64728C]">
                INVOICE
              </span>
              <span className="font-poppins font-medium text-[22px] leading-8 text-[#64728C] text-opacity-50">
                #{invoice?.Invoice_Number}
              </span>
            </div>
          </div>
        </DialogHeader>
        <DialogBody className="rounded-none px-8 font-poppins overflow-y-scroll max-h-[500px]">
          <div className="flex items-start justify-between w-full">
            <div>
              <span className="font-poppins font-medium text-[14px] leading-[22px] text-[#64728C]">
                From:
              </span>
              <div className="font-poppins font-normal text-[14px] leading-[22px] text-[#64728C]">
                {address?.Name} <br />
                {address?.Address1}, {address?.Address2},
                <br />
                {address?.Address3}, {address?.Contact_No}
              </div>
            </div>
            <div>
              <span className="font-poppins font-medium text-[14px] leading-[22px] text-[#64728C]">
                To:
              </span>
              <div className="font-poppins font-normal text-[14px] leading-[22px] text-[#64728C]">
                {invoice?.Name} <br />
                {invoice?.Tp} <br />
              </div>
            </div>
          </div>
          <div className="flex w-full gap-5 mt-5">
            <div className="flex flex-col">
              <div className="font poppins font-medium text-[14px] text-[#64728C]">
                Date
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font poppins font-medium text-[14px] text-[#64728C]">
                {invoice?.Date}
              </div>
            </div>
          </div>
          <div>
            <DataTable
              columns={TABLE_VIEW_QUOTATION}
              responsive
              data={invoice?.items}
              customStyles={tableHeaderStyles}
              className="mt-4"
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
          <div className="flex flex-row justify-between w-full mt-6">
            <div className="w-[45%]">
              <div className="flex text-[12px] flex-col gap-2">
                <span>{invoice?.invoice?.invoice?.notes}</span>
              </div>
            </div>
            <div className="w-[100%] md:w-[40%] flex justify-between text-sm font-poppins font-semibold text-[12px] leading-[18px] text-[#64728C]">
              <div className="flex flex-col gap-2">
                <div>Subtotal (LKR)</div>
                <div>
                  Discount {invoice?.Discount_Type === "amount" ? "LKR" : "%"}
                </div>
                <div>Total (LKR)</div>
                {invoice?.Payment_Type === 2 && <div>Down Payment (LKR)</div>}
              </div>
              <div className="flex flex-col items-end gap-2 ">
                <div className="text-end">
                  {parseFloat(invoice?.Total).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-end">
                  {invoice?.Discount_Type === "amount"
                    ? parseFloat(invoice?.Discount_Amount).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )
                    : invoice?.Discount_Presentage}
                </div>
                <div className="text-end">
                  {parseFloat(invoice?.Net_Amount).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                {invoice?.Payment_Type === 2 && (
                  <div className="text-end">
                    {parseFloat(invoice?.Paid_Amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          {invoice.Payment_Type === 2 && (
            <>
              <div className="font-poppins text-[14px] font-medium mt-5 mb-3">
                Installment Plan
              </div>
              <table className="font-poppins text-[12px] mt-2 transition-all duration-300 w-full leading-6">
                <thead>
                  <tr className="border-[0.5px] border-gray-300">
                    <th className="border-[0.5px] border-gray-300 px-5 text-left">
                      Installment #
                    </th>
                    <th className="border-[0.5px] border-gray-300 px-5 text-left">
                      Date
                    </th>
                    <th className="border-[0.5px] border-gray-300 px-5 text-left">
                      Amount
                    </th>
                    <th className="border-[0.5px] border-gray-300 px-5 text-left">
                      Penalty
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.installments.map((installment) => (
                    <tr
                      key={installment.idInstallment_Payment}
                      className="border-[0.5px] border-gray-300"
                    >
                      <td className="px-5 border-r border-gray-300">
                        {installment.Term}
                      </td>
                      <td className="px-5 border-r border-gray-300">
                        {new Date(installment.Date).toLocaleDateString(
                          "en-US",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-5 border-r border-gray-300">
                        {parseFloat(installment.Balance_Amount).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </td>
                      <td className="px-5 border-r border-gray-300">
                        {parseFloat(installment.Penalty_Amount).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </DialogBody>
        <DialogFooter className="pb-5"></DialogFooter>
      </Dialog>
    </>
  );
};
