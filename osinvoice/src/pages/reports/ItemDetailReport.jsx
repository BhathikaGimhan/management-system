import { Card, CardBody, Typography, Input } from "@material-tailwind/react";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { PrintSummary } from "./PrintSummary";
import axiosClient from "../../../axios-client";
import Select from "react-select";
import { useStateContext } from "../../contexts/NavigationContext";
import DataTable from "react-data-table-component";
import { ProcessingIcon } from "../../utils/icons";

export const ItemDetailReport = () => {
  const currentDateTime = new Date();

  const { user } = useStateContext();

  const [submitting, setSubmitting] = useState(false);

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
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

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
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = () => {
      let selected_category =
        selectedCategory === null ? "all" : selectedCategory.value;
      axiosClient
        .get(
          `/stock-card/report/${fromDate}/${toDate}/${user.branch}/${selected_category}`
        )
        .then((res) => {
          setProducts(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getProducts();
  }, [toDate, fromDate, selectedCategory]);
  // Handler for Qty Type selection
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

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

  useEffect(() => {
    const getCategories = () => {
      axiosClient
        .get(`/product/category/${user.branch}`)
        .then((res) => {
          let data = res.data;
          const filteredCategories = data.filter(
            (category) => category.Type === "1"
          );
          const categoryOptions = filteredCategories.map((category) => ({
            value: category.idItem_Category,
            label: category.Description,
            type: category.Type,
          }));
          setCategories(categoryOptions);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getCategories();
  }, []);

  const [shouldPrint, setShouldPrint] = useState(false);
  const [printReport, setPrintReport] = useState({});
  const printRef = useRef();

  const printEstimate = () => {
    setSubmitting(true);
    let printData = {
      products,
      current: handleFormatData(currentDateTime),
      from_date: formatDateTime(fromDate),
      to_date: formatDateTime(toDate),
      category: selectedCategory === null ? "all" : selectedCategory.label,
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

  const TABLE_ITEM_DETAIL_REPORT = [
    {
      name: "Category",
      selector: (row) => row.Item_Category,
      wrap: false,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
      sortable: true,
    },
    {
      name: "Product Name",
      selector: (row) => row.Description,
      wrap: false,
      maxWidth: "auto",
    },
    {
      name: "Real_Cost (LKR)",
      selector: (row) =>
        parseFloat(row.Real_Cost).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      wrap: false,
      maxWidth: "auto",
    },
    {
      name: "Cost (LKR)",
      selector: (row) =>
        parseFloat(row.Cost).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      wrap: false,
      maxWidth: "auto",
      right: true,
    },
    {
      name: "Rate (LKR)",
      selector: (row) => (
        <span className="pr-2">
          {parseFloat(row.Rate).toLocaleString("en-US", {
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
      name: "Quantity Type",
      selector: (row) => row.Quantity_Type,
      wrap: false,
      maxWidth: "auto",
      center: true,
    },
    {
      name: "In Stock",
      selector: (row) => row.Total_In_Stock,

      wrap: false,
      maxWidth: "auto",
      center: true,
    },
    {
      name: "Quantity Type",
      selector: (row) => row.Total_Out_Stock,
      wrap: false,
      maxWidth: "auto",
      center: true,
    },
    {
      name: "Quantity Type",
      selector: (row) => row.Stock_In_Hand,
      wrap: false,
      maxWidth: "auto",
      center: true,
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
          <div className="md:w-[100%] flex flex-col md:items-center md:justify-center justify-between font-medium text-[20px] md:text-[22px] font-poppins text-[#64728C] pb-1 md:pb-4 relative text-center">
            <div className="flex justify-center text-center">
              Item Detail Report
            </div>
          </div>
          <div className="w-full flex items-center justify-center text-[10px] md:text-[12px] font-medium text-center font-poppins text-[#b0b7c4]">
            Generated {handleFormatData(currentDateTime)}
          </div>
          <div className="w-full border-b-2 border-[#d5d8dd] mt-4 mb-8"></div>

          <div className="flex items-center w-full mt-4 text-[12px] md:text-[14px] font-medium font-poppins text-[#b0b7c4]">
            <span className="w-[20%] md:w-[10%]"> From </span>
            <span>{formatDateTime(fromDate)}</span>
          </div>
          <div className="flex items-center w-full mt-4 text-[12px] md:text-[14px] font-medium font-poppins text-[#b0b7c4]">
            <span className="w-[20%] md:w-[10%]">To</span>
            <span>{formatDateTime(toDate)}</span>
          </div>
          <div className="flex items-center w-full my-4 text-[12px] md:text-[14px] font-medium font-poppins text-[#b0b7c4]">
            <span className="w-[20%] md:w-[10%]">Category</span>
            <span>
              {selectedCategory === null ? "All" : selectedCategory.label}
            </span>
          </div>
          <div className="flex flex-col w-full mt-8 md:flex-row md:justify-left">
            <div className="w-full md:w-[250px] md:mr-5">
              <p className="font-poppins text-[14px] font-medium leading-[22px] text-[#64728C] pb-2">
                Search by Category
              </p>
              <Select
                className="basic-single text-[14px] h-10"
                classNamePrefix="select"
                isSearchable={true}
                isClearable
                name="color"
                options={categories}
                value={selectedCategory}
                styles={customSelectStyles}
                onChange={handleCategoryChange}
              />
            </div>
            <div className="w-full mb-4 md:w-[250px] md:mr-5 md:mb-0 mt-3 md:mt-0">
              <p className="font-poppins text-[14px] font-medium leading-[22px] text-[#64728C] pb-2">
                From
              </p>
              <div class="date-input-container">
                <input
                  type="date"
                  value={fromDate}
                  class="custom-date-input"
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full mb-4 md:w-[250px] md:mr-5 md:mb-0">
              <p className="font-poppins text-[14px] font-medium leading-[22px] text-[#64728C] pb-2">
                to
              </p>
              <div class="date-input-container">
                <input
                  type="date"
                  value={toDate}
                  class="custom-date-input"
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="w-full mt-5 overflow-x-scroll md:overflow-auto">
            <DataTable
              columns={TABLE_ITEM_DETAIL_REPORT}
              responsive
              data={products}
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

          <div className="flex flex-col justify-end w-full mt-5 md:flex-row">
            <div className="gap-1 mt-3 md:flex">
              <button
                className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] flex items-center justify-center gap-2 text-[#10275E] hover:opacity-80"
                onClick={printEstimate}
              >
                {submitting && <ProcessingIcon />}
                Print Payment Summary
              </button>
              <span style={{ display: "none" }}>
                <span ref={printRef}>
                  <PrintSummary data={printReport} />
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
