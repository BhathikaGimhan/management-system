import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { InvoiceDetailPrint } from "./InvoiceDetailPrint";
import axiosClient from "../../../axios-client";
import Select from "react-select";
import { useStateContext } from "../../contexts/NavigationContext";
import { ProcessingIcon } from "../../utils/icons";
import DataTable from "react-data-table-component";

export const InvoiceDetailReport = () => {
  const currentDateTime = new Date();

  const { user } = useStateContext();

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  const [filterFromDate, setFilterFromDate] = useState(""); // State for "from" date
  const [filterToDate, setFilterToDate] = useState(""); // State for "to" date

  // Function to set default "from" and "to" dates
  useEffect(() => {
    const getDates = () => {
      const monthAgoDate = new Date(
        currentDateTime.getFullYear(),
        currentDateTime.getMonth() - 1,
        currentDateTime.getDate()
      )
        .toISOString()
        .split("T")[0];
      setFilterFromDate(monthAgoDate);
      setFilterToDate(new Date().toISOString().split("T")[0]);
    };

    getDates();
  }, []);

  // Function to format date and time
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

  // State for storing invoice data
  const [invoices, setInvoices] = useState([]);

  // Function to fetch invoices
  useEffect(() => {
    const fetchInvoices = () => {
      axiosClient
        .get(`/invoice/${user.branch}`)
        .then((res) => {
          setInvoices(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchInvoices();
  }, [selectedCustomer]);

  //Filtering invoices based on selected customer and date
  const filteredInvoice = invoices.filter((invoice) => {
    if (
      selectedCustomer &&
      invoice.Customer_idCustomer !== selectedCustomer.value
    ) {
      return false;
    }
    if (filterFromDate && new Date(invoice.Date) < new Date(filterFromDate)) {
      return false;
    }
    if (filterToDate && new Date(invoice.Date) > new Date(filterToDate)) {
      return false;
    }
    return true;
  });

  // Handler for customer selection
  const handleCustomerChange = (selectedOption) => {
    setSelectedCustomer(selectedOption);
  };

  // Function to format date
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

  // Function to fetch customers based on user's branch
  useEffect(() => {
    const getCustomer = () => {
      axiosClient
        .get(`/customer/${user.branch}`)
        .then((res) => {
          let data = res.data;
          const customerOptions = data.map((customer) => ({
            value: customer.idCustomer,
            label: `${customer.First_Name} ${customer.Name} - ${customer.Tp}`,
          }));
          setCustomers(customerOptions);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getCustomer();
  }, [user.branch]);

  // State for controlling printing
  const [shouldPrint, setShouldPrint] = useState(false);
  const [printReport, setPrintReport] = useState({}); // State for data to be printed
  const printRef = useRef(); // Ref for printing component

  const printEstimate = () => {
    setSubmitting(true);
    let printData = {
      filteredInvoice,
      current: handleFormatData(currentDateTime),
      from_date: filterFromDate,
      to_date: filterToDate,
      customer:
        selectedCustomer === null ? "All Customers" : selectedCustomer.label,
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

  // Calculate total amount
  const totalAmount = filteredInvoice?.reduce((total, invoice) => {
    return total + parseFloat(invoice.Net_Amount);
  }, 0);

  //React select styles
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      fontSize: "14px",
      fontWeight: "600",
      color: state.isFocused ? "#64728C" : "#64728C82", // Change text color based on focus state
      borderColor: state.isFocused ? "#64728C" : provided.borderColor, // Change border color on focus
      boxShadow: state.isFocused ? "0 0 0 1px #64728C" : provided.boxShadow, // Change box shadow on focus
      '&:hover': {
        borderColor: state.isFocused ? "#64728C" : provided.borderColor,
      },
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "#64728C" : "#64728C", // Keep the text color consistent
      backgroundColor: state.isSelected ? "#e7e7e7" : "white",
      ":hover": {
        backgroundColor: state.isSelected ? "#ccc" : "#f3f3f3",
      },
      fontSize: "14px",
      fontWeight: "600",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#64728C", // Change text color for selected value
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: "#bdbdbd", // Set the placeholder color
    }),
  };

  const INVOICE_DETAIL_REPORT = [
    {
      name: "Invoice",
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
      name: "Total (LKR)",
      selector: (row) =>
        parseFloat(row.Net_Amount).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      wrap: false,
      maxWidth: "auto",
      right: true,
    },
    {
      name: "Paid Amount (LKR)",
      selector: (row) => (
        <span className="pr-2">
          {parseFloat(row.Paid_Amount).toLocaleString("en-US", {
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
      name: "Balance (LKR)",
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
      <section className="mt-8 mb-10">
        <div className="w-full bg-white rounded-[15px] px-[30px] pt-[28px] pb-[40px]">
          <div className="md:w-[100%] flex md:items-center md:justify-center justify-between font-medium md:text-[22px] font-poppins text-[#64728C] pb-4 relative">
            <div className="hidden md:block">Invoice Detail Report</div>
            <div className="block md:hidden">
              Invoice Detail <br /> Report
            </div>
          </div>
          <div className="w-full flex items-center justify-center  md:text-[12px] font-normal text-center   font-poppins text-[#64728C]">
            Generated {handleFormatData(currentDateTime)}
          </div>
          <div className="w-full border-b-2 border-[#d5d8dd] mt-4 mb-8"></div>

          <div className="flex items-center w-full mt-3 text-sm font-normal font-poppins text-[#64728C]">
            <span className="w-[20%] md:w-[7%]"> From </span>
            <span>{filterFromDate}</span>
          </div>
          <div className="flex items-center w-full text-sm font-normal font-poppins text-[#64728C]">
            <span className="w-[20%] md:w-[7%]">To</span>
            <span>{filterToDate}</span>
          </div>
          <div className="flex flex-col w-full mt-8 md:flex-row md:justify-left">
            <div className="w-full md:w-[250px] md:mr-5">
              <p className="font-poppins text-[14px] font-medium leading-[22px] text-[#64728C] pb-2">
                Search by Customer
              </p>
              <Select
                className="basic-single text-[14px] h-10"
                classNamePrefix="select"
                isSearchable={true}
                isClearable
                name="color"
                options={customers}
                value={selectedCustomer}
                styles={customSelectStyles}
                onChange={handleCustomerChange}
              />
            </div>
            <div className="w-full mb-4 md:w-[250px] md:mr-5 md:mb-0">
              <p className="font-poppins text-[14px] font-medium leading-[22px] text-[#64728C] pb-2">
                From
              </p>
              <div class="date-input-container">
                <input
                  type="date"
                  value={filterFromDate}
                  class="custom-date-input"
                  onChange={(e) => setFilterFromDate(e.target.value)}
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
                  value={filterToDate}
                  class="custom-date-input"
                  onChange={(e) => setFilterToDate(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-1/2  mb-4 md:mt-3 text-right text-[15px] font-poppins text-[#64728C]">
              <div className="mt-5">
                Total : LKR{" "}
                {parseFloat(totalAmount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>

          <div className="w-full mt-5 overflow-x-scroll md:overflow-auto">
            <DataTable
              columns={INVOICE_DETAIL_REPORT}
              responsive
              data={filteredInvoice}
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

          <div className=""></div>

          <div className="flex flex-col justify-end w-full mt-5 md:flex-row">
            <div className="gap-1 mt-3 md:flex">
              <button
                className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] flex items-center justify-center gap-2 text-[#10275E] hover:opacity-80"
                onClick={printEstimate}
              >
                Print Invoice Detail Report
              </button>
              <span style={{ display: "none" }}>
                <span ref={printRef}>
                  <InvoiceDetailPrint data={printReport} />
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
