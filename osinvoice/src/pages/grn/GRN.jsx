import React, { useState, useEffect } from "react";
import { IconButton, Tooltip } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import {
  EditNewIcon,
  ProcessIcon,
  ProcessedIcon,
  PlusIcon,
  ArrowDownIcon,
} from "../../utils/icons";
import {
  ViewIcon,
  MinusIcon,
  PaginateLeft,
  PaginateRight,
} from "../../utils/icons";
import { TABLE_HEAD_GRN } from "../../utils/tableArray";
import { ProcessGRN } from "./ProcessGRN";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../contexts/NavigationContext";
import { ViewItems } from "./ViewItems";
import Select from "react-select";
import DataTable from "react-data-table-component";

export const GRN = () => {
  const [selectedGRN, setSelectedGRN] = useState(null);
  // State for managing opening/closing of add item modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  const [processOpen, setProcessOpen] = useState(false);
  const processGRNHandleOpen = () => setProcessOpen((cur) => !cur);

  const [grns, setGrns] = useState([]);
  const [GRNTableLoading, setGRNTableLoading] = useState(false);
  const handleLoading = () => setGRNTableLoading((pre) => !pre);

  const [tableLoading, setTableLoading] = useState(true);

  // State for filtering by date and supplier
  const [filterDate, setFilterDate] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);

  const [filterFromDate, setFilterFromDate] = useState(""); // State for "from" date
  const [filterToDate, setFilterToDate] = useState(""); // State for "to" date

  const [currentPage, setCurrentPage] = useState(1);
  const [grnsPerPage] = useState(5);

  const [expandedGRNIndex, setExpandedGRNIndex] = useState(null);

  const indexOfLastGRN = currentPage * grnsPerPage;
  const indexOfFirstGRN = indexOfLastGRN - grnsPerPage;

  const currentGRN = grns.slice(indexOfFirstGRN, indexOfLastGRN);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filtering invoices based on selected customer and date
  const filteredGRN = grns.filter((grn) => {
    if (
      selectedSupplier &&
      grn.Supplier_idSupplier !== selectedSupplier.value
    ) {
      return false;
    }
    if (filterFromDate && new Date(grn.Date) < new Date(filterFromDate)) {
      return false;
    }
    if (filterToDate && new Date(grn.Date) > new Date(filterToDate)) {
      return false;
    }
    return true;
  });

  //Getting the branch of the user
  const { user } = useStateContext();

  //fecth suppliers
  useEffect(() => {
    const getSuppliers = () => {
      axiosClient
        .get(`/customer/${user.branch}`)
        .then((res) => {
          setSuppliers(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getSuppliers();
  }, []);

  const handleSupplierChange = (selectedOption) => {
    setSelectedSupplier(selectedOption);
  };

  //Get the grns
  const fetchGrns = () => {
    axiosClient
      .get(`/grn/${user.branch}`)
      .then((res) => {
        setGrns(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setTableLoading(false);
  };

  useEffect(() => {
    fetchGrns();
  }, []);

  //Get the suppliers' Names
  const fetchSuppliers = () => {
    axiosClient
      .get(`/supplier/${user.branch}`)
      .then((res) => {
        setSuppliers(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchGrns();
    fetchSuppliers();
  }, [GRNTableLoading]);

  const handleProcessClick = (GRN) => {
    setSelectedGRN(GRN);
    processGRNHandleOpen();
  };

  const handleFormatData = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return formattedDate;
  };

  const [viewItem, setVIewItem] = useState({});

  const handleViewClick = (grn) => {
    setVIewItem(grn);
    handleOpen();
  };

  //React select styles
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      fontSize: "14px",
      fontWeight: "600",
      color: state.isFocused ? "#64728C" : "#64728C82", // Change text color based on focus state
      borderColor: state.isFocused ? "#64728C" : provided.borderColor, // Change border color on focus
      boxShadow: state.isFocused ? "0 0 0 1px #64728C" : provided.boxShadow, // Change box shadow on focus
      "&:hover": {
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

  const TABLE_GRN = [
    {
      name: "Date",
      selector: (row) => handleFormatData(row.Date),
      wrap: false,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
      sortable: true,
    },
    {
      name: "Supplier",
      selector: (row) => row.Company_Name,
      wrap: false,
      maxWidth: "auto",
    },
    {
      name: "Total Amount (LKR)",
      selector: (row) =>
        row.Total_Amount ? (
          <span className="pr-2">
            {parseFloat(row.Total_Amount).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        ) : (
          "-"
        ),

      wrap: false,
      maxWidth: "auto",
      right: true,
    },
    {
      name: "Credit Balance Amount (LKR)",
      selector: (row) => (
        <span className="pr-2">
          {row.Paid_Amount
            ? (
                parseFloat(row.Total_Amount) - parseFloat(row.Paid_Amount)
              ).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : row.Total_Amount}
        </span>
      ),
      wrap: false,
      maxWidth: "auto",
      right: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <span
          className={`font-poppins font-semibold text-center text-[11px] px-2 py-[2px] min-w-[80px] rounded-full ${
            row.Status == 0
              ? `bg-[#f6f3d9] text-[#d8ca52]`
              : `bg-[#d9f3ea] text-[#00B074]`
          }`}
        >
          {row.Status == 0 ? "Pending" : "Completed"}
        </span>
      ),
      wrap: false,
      maxWidth: "auto",
      center: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Tooltip content="View GRN">
            <IconButton
              onClick={() => handleViewClick(row)}
              variant="text"
              className="mx-2 bg-white"
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          {row.Status == 0 && (
            <>
              <Tooltip content="Edit GRN">
                <Link to={`/grn/edit/${row.idGRN}`}>
                  <IconButton variant="text" className="mx-2 bg-white">
                    <EditNewIcon />
                  </IconButton>
                </Link>
              </Tooltip>
              <Tooltip content="Process GRN">
                <IconButton
                  onClick={() => handleProcessClick(row)}
                  variant="text"
                  className="mx-2 bg-white"
                >
                  <ProcessIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          {row.Status == 1 && (
            <Tooltip content="GRN is Processed">
              <IconButton variant="text" className="mx-2 bg-white">
                <ProcessedIcon />
              </IconButton>
            </Tooltip>
          )}
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

  //Mobile version row expand
  const handleExpandClick = (index) => {
    if (expandedGRNIndex === index) {
      setExpandedGRNIndex(null);
    } else {
      setExpandedGRNIndex(index);
    }
  };

  return (
    <>
      {/* Desktop version */}
      <section className="hidden mt-8 md:block">
        <div className="w-full bg-white rounded-[15px] px-[30px] pt-[20px] pb-[40px]">
          <div className="flex flex-col mt-4 md:flex-row md:justify-left">
            <div className="w-full md:w-[250px] md:mr-5 mb-4 md:mb-0">
              <p className="font-poppins text-[14px] font-medium leading-[22px] text-[#64728C] pb-2">
                Search by Supplier
              </p>
              <Select
                className="basic-single text-[14px] h-10"
                classNamePrefix="select"
                isClearable
                isSearchable={true}
                name="color"
                options={suppliers.map((supplier) => ({
                  value: supplier.idSupplier,
                  label: `${supplier.Company_Name}`,
                }))}
                onChange={handleSupplierChange}
                styles={customSelectStyles}
              />
            </div>
            <div className="w-full md:w-[250px] md:mr-5 mb-4 md:mb-0">
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
            <div className="w-full md:w-[250px]">
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
          </div>
        </div>
        <div className="w-full bg-white rounded-[15px] px-[30px] pt-[20px] pb-[20px] mt-10 relative">
          <Link
            className="w-[50px] aspect-square absolute rounded-full bg-[#769EFF] bg-opacity-30 -top-5 -right-3 flex items-center justify-center cursor-pointer"
            to="/grn/add"
          >
            <PlusIcon width={"24px"} />
          </Link>
          <DataTable
            columns={TABLE_GRN}
            responsive
            data={filteredGRN}
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
            progressPending={tableLoading}
          />
        </div>
      </section>

      {/* Mobile version */}
      <section className="mt-5 bg-white px-[3%] w-full rounded-[10px] py-3 md:hidden">
        <div className="flex justify-end">
          <Link
            className="w-[30px] aspect-square rounded-full bg-[#769EFF] bg-opacity-30 -top-5 -right-3 flex items-center justify-center cursor-pointer"
            to="/grn/add"
          >
            <PlusIcon width={"14px"} />
          </Link>
        </div>
        <div className="flex flex-col mt-3">
          <div className="w-full pb-3 md:w-1/5">
            <p className="font-poppins text-[12px] font-medium leading-[18px] text-[#64728C] pb-2">
              Search by Supplier
            </p>
            <Select
              className="basic-single text-[14px] h-10"
              classNamePrefix="select"
              isClearable
              isSearchable={true}
              name="color"
              options={suppliers.map((supplier) => ({
                value: supplier.idSupplier,
                label: `${supplier.Company_Name}`,
              }))}
              onChange={handleSupplierChange}
              styles={customSelectStyles}
            />
          </div>
          <div className="w-full pb-3 md:w-1/5">
            <p className="font-poppins text-[12px] font-medium leading-[18px] text-[#64728C] pb-2">
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
          <div className="w-full pb-3 md:w-1/5">
            <p className="font-poppins text-[12px] font-medium leading-[18px] text-[#64728C] pb-2">
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
        </div>
        <div className="w-full pt-5">
          <div className="w-full bg-[#769EFF] bg-opacity-30 px-2 py-2 font-poppins font-medium text-[12px] leading-[18px] text-[#10275E] flex items-center gap-2">
            <ArrowDownIcon />
            Date
          </div>
          {filteredGRN
            .slice((currentPage - 1) * grnsPerPage, currentPage * grnsPerPage)
            .map((grn, index) => (
              <>
                <div
                  className="w-full flex items-center px-2 py-2 border-b border-[#64728C] border-opacity-10"
                  onClick={() => handleExpandClick(index)}
                >
                  <span className="w-[14px] aspect-square border border-[#64728C] rounded-full flex justify-center items-center mr-3">
                    {expandedGRNIndex === index ? (
                      <MinusIcon width={"8px"} />
                    ) : (
                      <PlusIcon width={"8px"} />
                    )}
                  </span>
                  <span className="font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                    {handleFormatData(grn.Date)}
                  </span>
                </div>
                {expandedGRNIndex === index && (
                  <div className="w-full pl-[35px] bg-[#D9D9D9] bg-opacity-20">
                    <div className="w-full py-2 font-poppins font-medium text-[12px] leading-[18px] text-[#64728C] border-b border-[#64728C] border-opacity-10">
                      {handleFormatData(grn.Date)}
                    </div>
                    <div className="w-full flex items-center py-2 border-b border-[#64728C] border-opacity-10">
                      <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                        {TABLE_HEAD_GRN[1]}
                      </div>
                      <div className="w-[60%] font-poppins font-normal text-[12px] leading-[18px] text-wrap text-[#64728C]">
                        {grn.Company_Name}
                      </div>
                    </div>
                    <div className="w-full flex items-center py-2 border-b border-[#64728C] border-opacity-10">
                      <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                        {TABLE_HEAD_GRN[2]}
                      </div>
                      <div className="w-[60%] font-poppins font-normal text-[12px] leading-[18px] overflow-wrap break-word word-break break-all text-[#64728C]">
                        {parseFloat(grn.Total_Amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                    <div className="w-full flex items-center py-2 border-b border-[#64728C] border-opacity-10">
                      <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                        {TABLE_HEAD_GRN[3]}
                      </div>
                      <div className="w-[60%] font-poppins font-normal text-[12px] leading-[18px] text-[#64728C]">
                        {grn.Credit_Balance_Amount === null ? (
                          "-"
                        ) : (
                          <>
                            {" "}
                            {parseFloat(
                              grn.Credit_Balance_Amount
                            ).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="w-full flex items-center py-2 border-b border-[#64728C] border-opacity-10">
                      <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                        {TABLE_HEAD_GRN[4]}
                      </div>
                      <div className="w-[60%] font-poppins font-medium text-[12px] leading-[18px]">
                        <div
                          className={`font-poppins text-center px-2 py-[2px] w-fit min-w-[60px] rounded-full ${
                            grn.Status == 0
                              ? `bg-[#f6f3d9] text-[#d8ca52]`
                              : `bg-[#d9f3ea] text-[#00B074]`
                          }`}
                        >
                          {grn.Status == 0 ? "Pending" : "Completed"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center w-full py-2">
                      <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                        {TABLE_HEAD_GRN[5]}
                      </div>

                      <div className="w-[60%] flex items-center gap-3">
                        <button
                          onClick={() => handleViewClick(grn)}
                          variant="text"
                          className="bg-transparent"
                        >
                          <ViewIcon />
                        </button>

                        {grn.Status == 0 && (
                          <>
                            <Link to={`/grn/edit/${grn.idGRN}`}>
                              <button variant="text" className="bg-transparent">
                                <EditNewIcon />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleProcessClick(grn)}
                              variant="text"
                              className="bg-transparent"
                            >
                              <ProcessIcon />
                            </button>
                          </>
                        )}
                        {grn.Status == 1 && (
                          <button variant="text" className="bg-transparent">
                            <ProcessedIcon />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ))}
        </div>

        {/* Pagination for Mobile version */}
        <div className="flex justify-end gap-4 mt-10">
          <span className="font-poppins font-medium text-[10px] text-[#64728C]">
            Page {currentPage} of {Math.ceil(filteredGRN.length / grnsPerPage)}
          </span>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <PaginateLeft />
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(filteredGRN.length / grnsPerPage)
            }
          >
            <PaginateRight />
          </button>
        </div>
      </section>

      <ViewItems grn={viewItem} handleOpen={handleOpen} open={open} />

      <ProcessGRN
        GRN={selectedGRN}
        handleOpen={processGRNHandleOpen}
        open={processOpen}
        handleLoading={handleLoading}
      />
    </>
  );
};

const GrnMobileTable = ({
  grn,
  TABLE_HEAD_GRN,
  handleViewClick,
  handleProcessClick,
  handleFormatData,
}) => {
  return (
    <div className="flex flex-col rounded-md overflow-hidden mb-3 shadow-md w-full border-l-[0.5px] border-t-[0.5px] border-r-[0.5px] border-blue-gray-300 bg-blue-gray-50/50">
      <div className="flex w-full border-b-[0.5px] bg-blue-gray-100 items-center border-blue-gray-300">
        <div className="h-full w-[40%] p-1 uppercase border-r-[0.5px] border-blue-gray-300  font-inter font-semibold text-[14px] text-blue-gray-600">
          {TABLE_HEAD_GRN[0]}
        </div>
        <div className="w-[60%] p-1 font-inter font-semiboldtext-[14px] text-blue-gray-600">
          {handleFormatData(grn.Date)}
        </div>
      </div>
      <div className="flex w-full border-b-[0.5px]  items-center border-blue-gray-300">
        <div className="h-full w-[40%] p-1 uppercase border-r-[0.5px] border-blue-gray-300  font-inter font-semibold text-[14px] text-blue-gray-600">
          {TABLE_HEAD_GRN[1]}
        </div>
        <div className="w-[60%] p-1 font-inter font-semiboldtext-[14px] text-blue-gray-600">
          {grn.Company_Name}
        </div>
      </div>
      <div className="flex w-full border-b-[0.5px] bg-blue-gray-100 items-center border-blue-gray-300">
        <div className="h-full w-[40%] p-1 uppercase border-r-[0.5px] border-blue-gray-300  font-inter font-semibold text-[14px] text-blue-gray-600">
          {TABLE_HEAD_GRN[2]}
        </div>
        <div className="w-[60%] p-1 font-inter font-semiboldtext-[14px] text-blue-gray-600">
          {parseFloat(grn.Total_Amount).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>
      <div className="flex w-full border-b-[0.5px] items-center border-blue-gray-300">
        <div className="h-full w-[40%] p-1 uppercase border-r-[0.5px] border-blue-gray-300  font-inter font-semibold text-[14px] text-blue-gray-600">
          {TABLE_HEAD_GRN[3]}
        </div>
        <div className="w-[60%] p-1 font-inter font-semiboldtext-[14px] text-blue-gray-600">
          {grn.Credit_Balance_Amount === null ? (
            "-"
          ) : (
            <>
              {" "}
              {parseFloat(grn.Credit_Balance_Amount).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </>
          )}
        </div>
      </div>
      <div className="flex w-full border-b-[0.5px] items-center border-blue-gray-300">
        <div className="h-full w-[40%] p-1 uppercase border-r-[0.5px] border-blue-gray-300  font-inter font-semibold text-[14px] text-blue-gray-600">
          {TABLE_HEAD_GRN[4]}
        </div>
        <div
          className={`w-fit p-1 m-1 font-inter font-semiboldtext-[14px] text-blue-gray-600 py-[2px] px-[2px] rounded-full ${
            grn.Status == 0 ? `bg-yellow-400` : `bg-green-400`
          }`}
        >
          {grn.Status == 0 ? "Pending" : "Completed"}
        </div>
      </div>
      <div className="flex w-full border-b-[0.5px] bg-blue-gray-100 border-blue-gray-300">
        <div className="h-full w-[40%] p-1 uppercase border-r-[0.5px] border-blue-gray-300  font-inter font-semibold text-[14px] text-blue-gray-600">
          {TABLE_HEAD_GRN[5]}
        </div>
        <div className="w-[60%] p-1 font-inter font-semiboldtext-[14px] text-blue-gray-600">
          <Tooltip content="View GRN">
            <IconButton
              onClick={() => handleViewClick(grn)}
              variant="text"
              className="mx-2 bg-gray-100"
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          {grn.Status == 0 && (
            <>
              <Tooltip content="Edit GRN">
                <Link to={`/grn/edit/${grn.idGRN}`}>
                  <IconButton variant="text" className="mx-2 bg-gray-100">
                    <EditNewIcon />
                  </IconButton>
                </Link>
              </Tooltip>
              <Tooltip content="Process GRN">
                <IconButton
                  onClick={() => handleProcessClick(grn)}
                  variant="text"
                  className="mx-2 bg-gray-100"
                >
                  <ProcessIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          {grn.Status == 1 && (
            <Tooltip content="GRN is Processed">
              <IconButton variant="text" className="mx-2 bg-gray-100">
                <ProcessedIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};
