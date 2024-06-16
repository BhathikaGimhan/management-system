import {
  Card,
  CardBody,
  Typography,
  Tooltip,
  IconButton,
  CardFooter,
} from "@material-tailwind/react";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
// import { PrintSummary } from "./PrintSummary";
import axiosClient from "../../../axios-client";
import Select from "react-select";
import { useStateContext } from "../../contexts/NavigationContext";
import { ViewIcon, BackIcon } from "../../utils/icons";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

export const PLDamages = () => {
  const currentDateTime = new Date();

  const { user } = useStateContext();

  const [plDetails, setPlDetails] = useState([]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [damages, setDamages] = useState([]);

  const [viewOpen, setViewOpen] = useState(false);
  const handleViewOpen = () => setViewOpen((cur) => !cur);

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
          setDamages(res.data.damages);
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

  const [viewItem, setVIewItem] = useState({});

  const handleViewClick = (damageNote) => {
    setVIewItem(damageNote);
    handleViewOpen();
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [damagePerPage] = useState(5);

  const indexOfLastDamage = currentPage * damagePerPage;
  const indexOfFirstDamage = indexOfLastDamage - damagePerPage;
  const currentDamage = damages.slice(indexOfFirstDamage, indexOfLastDamage);

  const TABLE_PL_DAMAGES = [
    {
      name: "Date",
      selector: (row) => row.Date,
      wrap: false,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
      sortable: true,
    },
    {
      name: "Reason",
      selector: (row) => row.Reason,
      wrap: false,
      maxWidth: "auto",
    },
    {
      name: "Items Count",
      selector: (row) => parseFloat(row.Item_Count).toLocaleString("en-US"),
      wrap: false,
      maxWidth: "auto",
    },
    {
      name: "Total Amount (LKR)",
      selector: (row) =>
        parseFloat(row.Total_Amount).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
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
      <div className="mx-3 mr-3 rounded-none h-fit md:mx-6 font-inter">
        <div className="flex flex-col items-center pt-5 ">
          <div className="md:w-[100%] flex flex-col md:items-center md:justify-center justify-between font-medium text-[20px] md:text-[22px] font-poppins text-[#64728C] pb-1 md:pb-4 relative text-center">
            <div className="text-center flex justify-center">
              Profit & Loss Damages
            </div>
          </div>
          <div className="w-full flex items-center justify-center text-[10px] md:text-[12px] font-medium text-center font-poppins text-[#b0b7c4]">
            Generated {handleFormatData(currentDateTime)}
          </div>
          <div className="w-full border-b-2 border-[#d5d8dd] my-4"></div>
          <div className="flex items-center w-full mt-4 text-[12px] md:text-[14px] font-medium font-poppins text-[#b0b7c4]">
            <span className="w-[20%] md:w-[7%]"> From </span>
            <span>{formatDateTime(fromDate)}</span>
          </div>
          <div className="flex items-center w-full mt-4 text-[12px] md:text-[14px] font-medium font-poppins text-[#b0b7c4]">
            <span className="w-[20%] md:w-[7%]">To</span>
            <span>{formatDateTime(toDate)}</span>
          </div>

          <div className="flex flex-col w-full mt-4 md:flex-row md:justify-left">
            <div className="w-full mb-4 md:w-1/5 md:mr-5 md:mb-0">
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
            <div className="w-full mb-4 md:w-1/5 md:mr-5 md:mb-0">
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
              <div className="w-full md:mt-5 overflow-x-scroll md:overflow-auto scrollbar-x-style">
                <DataTable
                  columns={TABLE_PL_DAMAGES}
                  responsive
                  data={currentDamage}
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
        <CardFooter className="flex items-center justify-between font-poppins text-[#64728C] p-4 border-t border-[#64728C33]">
          <Typography
            variant="small"
            color=" text-#64728C"
            className="font-normal"
          >
            Page {currentPage} of {Math.ceil(damages.length / damagePerPage)}
          </Typography>
          <div className="flex gap-2">
            <button
              className=" w-fit p-1 px-4 font-poppins font-semibold bg-[#769EFF4D] rounded-[20px] hover:bg-[#9165A0] text-[#10275E] hover:text-white  text-[14px] transition-colors duration-500"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className=" w-fit p-1 px-4 font-poppins font-semibold bg-[#769EFF4D] text-[#10275E] rounded-[20px] text-[14px] transition-colors duration-500"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastDamage >= damages.length}
            >
              Next
            </button>
          </div>
        </CardFooter>
      </div>
    </>
  );
};
