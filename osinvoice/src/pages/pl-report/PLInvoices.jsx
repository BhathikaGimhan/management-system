import {
  CardFooter,
  Typography,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";
import React, { useEffect, useRef, useState } from "react";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../contexts/NavigationContext";
import { TABLE_HEAD_INVOICE } from "../../utils/tableArray";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { ViewIcon } from "../../utils/icons";
import { ViewInvoice } from "../invoices/ViewInvoice";
import DataTable from "react-data-table-component";

export const PLInvoices = () => {
  const currentDateTime = new Date();

  const { user } = useStateContext();
  const [invoices, setInvoices] = useState([]);

  const [plDetails, setPlDetails] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [fromDate, setFromDate] = useState(
    new Date(
      currentDateTime.getFullYear(),
      currentDateTime.getMonth() - 1,
      currentDateTime.getDate()
    )
      .toISOString()
      .split("T")[0]
  );

  const [tableLoading, setTableLoading] = useState(false);

  const formatDateTime = (date) => {
    const inputDate = date;

    // Ensure the input is in the correct format (YYYY-MM-DD)
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(inputDate);

    if (isValidDate) {
      // Add a default time to the date string (00:00:00)
      const formattedDateTime = new Date(`${inputDate}T00:00:00`);

      // Format the date and time as a string (YYYY-MM-DD HH:mm:ss)
      const formattedString = formattedDateTime.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
      });

      return formattedString;
    } else {
      return "Invalid date format";
    }
  };

  useEffect(() => {
    const getPLDetails = () => {
      axiosClient
        .get(`/pl-report/${fromDate}/${toDate}/${user.branch}`)
        .then((res) => {
          setPlDetails(res.data);
          setInvoices(res.data.invoices);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getPLDetails();
  }, [toDate, fromDate]);

  const handleFormatData = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Use 24-hour format
    });
    return formattedDate;
  };

  const [viewInvoice, setInvoice] = useState({});

  const handleViewClick = (invoice) => {
    setInvoice(invoice);
    handleOpen();
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [invoicePerPage] = useState(5);

  const indexOfLastInvoice = currentPage * invoicePerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicePerPage;
  const currentInvoice = invoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );

  const TABLE_INVOICE = [
    {
      name: "Invoice Number",
      selector: (row) => row.Invoice_Number,
      wrap: false,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
      sortable: true,
    },
    {
      name: "Customer",
      selector: (row) => row.Name,
      wrap: false,
      maxWidth: "auto",
    },
    {
      name: "Date",
      selector: (row) => row.Date,
      wrap: false,
      maxWidth: "auto",
    },
    {
      name: "Net Amount (LKR)",
      selector: (row) =>
        parseFloat(row.Net_Amount).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      wrap: false,
      maxWidth: "auto",
    },
    {
      name: "Paid Amount (LKR)",
      selector: (row) =>
        parseFloat(row.Paid_Amount).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      wrap: false,
      maxWidth: "auto",
      right: true,
    },
    {
      name: "Balance Amount (LKR)",
      selector: (row) => (
        <span className="pr-2">
          {parseFloat(row.Balance_Amount).toLocaleString("en-US", {
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
      name: "Action",
      cell: (row) => (
        <>
          <Tooltip content="View Invoice">
            <IconButton
              onClick={() => handleViewClick(row)}
              variant="text"
              className="bg-white"
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  //Custom styles for the table
  const tableHeaderStyles = {
    headCells: {
      style: {
        font: "Poppins",
        fontWeight: "600",
        color: "#64728C",
        fontSize: "14px",
      },
    },
    cells: {
      style: {
        font: "Poppins",
        fontWeight: "normal",
        color: "#64728C",
        fontSize: "12px",
      },
    },
  };

  return (
    <>
      <div className="mx-3 mr-3 rounded-none h-fit md:mx-6">
        <div className="flex flex-col items-center pt-5">
          <div className="md:w-[100%] flex flex-col md:items-center md:justify-center justify-between font-medium text-[20px] md:text-[22px] font-poppins text-[#64728C] pb-1 md:pb-4 relative text-center">
            <div className="text-center flex justify-center">
              Profit & Loss Invoices
            </div>
          </div>
          <div className="w-full flex items-center justify-center text-[10px] md:text-[12px] font-medium text-center font-poppins text-[#b0b7c4]">
            Generated {handleFormatData(currentDateTime)}
          </div>
          <div className="w-full border-b-2 border-[#d5d8dd] mt-4 mb-8"></div>
          <div className="flex items-center w-full mt-4 text-[12px] md:text-[14px] font-medium font-poppins text-[#b0b7c4]">
            <span className="w-[20%] md:w-[7%]"> From </span>
            <span>{formatDateTime(fromDate)}</span>
          </div>
          <div className="flex items-center w-full mt-4 text-[12px] md:text-[14px] font-medium font-poppins text-[#b0b7c4]">
            <span className="w-[20%] md:w-[7%]">To</span>
            <span>{formatDateTime(toDate)}</span>
          </div>

          <div className="flex flex-col w-full mt-8 md:flex-row md:justify-left">
            <div className="w-full mb-4 md:w-[250px] md:mr-5 md:mb-0">
              <p className="font-poppins text-[14px] font-medium leading-[22px] text-[#64728C] pb-2">
                From
              </p>
              <div class="date-input-container">
                <input
                  type="date"
                  value={fromDate}
                  class="custom-date-input"
                  onChange={(e) => {
                    setFromDate(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="w-full mb-4 md:w-[250px] md:mr-5 md:mb-0">
              <p className="font-poppins text-[14px] font-medium leading-[22px] text-[#64728C] pb-2">
                To
              </p>
              <div class="date-input-container">
                <input
                  type="date"
                  value={toDate}
                  class="custom-date-input"
                  onChange={(e) => {
                    setToDate(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          {plDetails.summary && (
            <>
              <div className="w-full md:mt-5 overflow-x-scroll md:block md:overflow-auto">
                <DataTable
                  columns={TABLE_INVOICE}
                  responsive
                  data={currentInvoice}
                  customStyles={tableHeaderStyles}
                  className="mt-4"
                  pagination
                  paginationPerPage={20}
                  paginationRowsPerPageOptions={[20, 30, 40]}
                  paginationComponentOptions={{
                    rowsPerPageText: "Entries per page:",
                    rangeSeparatorText: "of",
                  }}
                  noDataComponent={
                    <div className="text-center">No data available</div>
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>

      <ViewInvoice invoice={viewInvoice} handleOpen={handleOpen} open={open} />
    </>
  );
};
