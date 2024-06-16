import { Card, CardBody, Typography, Input } from "@material-tailwind/react";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { PrintSummary } from "./PrintSummary";
import axiosClient from "../../../axios-client";
import Select from "react-select";
import { useStateContext } from "../../contexts/NavigationContext";
import { ProcessingIcon, BackIcon } from "../../utils/icons";
import { Link } from "react-router-dom";

export const PLSummary = () => {
  const currentDateTime = new Date();

  const { user } = useStateContext();

  const [plDetails, setPlDetails] = useState([]);

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

  const [submitting, setSubmitting] = useState(false);

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
      hour12: false,
    });
    return formattedDate;
  };

  const [shouldPrint, setShouldPrint] = useState(false);
  const [printReport, setPrintReport] = useState({});
  const printRef = useRef();

  const printEstimate = () => {
    setSubmitting(true);
    let printData = {
      damageTotal: plDetails.summary.damageTotal,
      invoiceTotal: plDetails.summary.invoiceTotal,
      expensesTotal: plDetails.summary.expensesTotal,
      current: handleFormatData(currentDateTime),
      from_date: formatDateTime(fromDate),
      to_date: formatDateTime(toDate),
    };
    setPrintReport(printData);
    setShouldPrint(true);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => {
      setShouldPrint(false);
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (shouldPrint) {
      handlePrint();
    }
  }, [shouldPrint, handlePrint]);

  return (
    <>
      <div className="mx-3 mr-3 rounded-none h-fit md:mx-6 font-inter">
        <div className="flex flex-col items-center pt-5 ">
          <div className="md:w-[100%] flex flex-col md:items-center md:justify-center justify-between font-medium text-[20px] md:text-[22px] font-poppins text-[#64728C] pb-1 md:pb-4 relative text-center">
            <div className="text-center flex justify-center">
              Profit & Loss Summary
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
            <div className="flex flex-col rounded-md overflow-hidden mb-3 w-full border-l border-t border-r border-[#64728C33] bg-[#fffff] mt-10">
              <div className="flex w-full border-b-[0.5px] items-center border-[#d5d8dd]">
                <div className="h-full w-[40%] p-4 uppercase border-r border-[#d5d8dd] font-poppins font-medium text-[14px] text-[#64728C] text-center">
                  Damage Total
                </div>
                <div className="w-[60%] p-1 font-poppins font-normal text-[14px] text-[#64728C] text-end pr-[30%]">
                  {plDetails.summary.damageTotal
                    ? parseFloat(plDetails.summary.damageTotal).toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )
                    : "0"}
                </div>
              </div>
              <div className="flex w-full border-b items-center border-[#d5d8dd]">
                <div className="h-full w-[40%] p-4 uppercase border-r border-[#d5d8dd]  font-poppins font-medium text-[14px] text-[#64728C] text-center">
                  Expenses Total
                </div>
                <div className="w-[60%] p-1 font-poppins font-normal text-[14px] text-[#64728C] text-end pr-[30%]">
                  {plDetails.summary.expensesTotal
                    ? parseFloat(
                        plDetails.summary.expensesTotal
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0.00"}
                </div>
              </div>
              <div className="flex w-full border-b items-center border-[#d5d8dd]">
                <div className="h-full w-[40%] p-4 uppercase border-r border-[#d5d8dd]  font-poppins font-medium text-[14px] text-[#64728C] text-center">
                  Invoice Total
                </div>
                <div className="w-[60%] p-1 font-poppins font-normal text-[14px] text-[#64728C] text-end pr-[30%]">
                  {plDetails.summary.invoiceTotal
                    ? parseFloat(plDetails.summary.invoiceTotal).toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )
                    : "0"}
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col justify-end w-full mt-5 md:flex-row">
            <div className="gap-1 mt-3 md:flex">
              <button
                className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] flex items-center justify-center gap-2 text-[#10275E] hover:opacity-80"
                onClick={printEstimate}
              >
                Print P & L Summary
              </button>
              <span style={{ display: "none" }}>
                <span ref={printRef}>
                  <PrintSummary data={printReport} />
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
