import React, { useEffect, useRef, useState } from "react";
import { IconButton, Tooltip } from "@material-tailwind/react";
import { TABLE_HEAD_INVOICE } from "../../utils/tableArray";
import {
  DownloadIcon,
  ViewIcon,
  PlusIcon,
  MinusIcon,
  ArrowDownIcon,
  PaginateLeft,
  PaginateRight,
  JobDescriptionIcon,
  ProcessIcon,
  ThermalPrintIcon,
} from "../../utils/icons";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import axiosClient from "../../../axios-client";
import Select from "react-select";
import { useStateContext } from "../../contexts/NavigationContext";
import DataTable from "react-data-table-component";
import { ViewInvoice } from "./ViewInvoice";
import ThermalPrint from "./ThermalPrint";
import { PrintInvoice } from "./PrintInvoice";
import { PrintJobDescription } from "./PrintJobDescription";
import { ProcessInvoiceService } from "./ProcessInvoiceService";

export const Invoices = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  const [invoices, setInvoices] = useState([]);
  const [rules, setRules] = useState([]); //state for rules
  const [invoiceTableLoading, setInvoiceTableLoading] = useState(false);
  const handleLoading = () => setInvoiceTableLoading((pre) => !pre);

  const [statusFilter, setStatusFilter] = useState(null);

  const [viewItem, setVIewItem] = useState({});

  const [printingInvoiceId, setPrintingInvoiceId] = useState(null);
  const [printingJobDescId, setPrintingJobDescId] = useState(null);

  const [tableLoading, setTableLoading] = useState(true);

  // State for filtering by date and customer
  const [filterDate, setFilterDate] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSalesman, setSelectedSalesman] = useState(null);

  const [customers, setCustomers] = useState([]);
  const [salesmen, setSalesmen] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [invoicePerPage] = useState(5);

  const [expandedInvoiceIndex, setExpandedInvoiceIndex] = useState(null);

  const [printInvoice, setPrintInvoice] = useState({});
  const [printJobDesc, setPrintJobDesc] = useState({});

  const [salesmanEnabled, setSalesmanEnabled] = useState(1);

  const [processOpen, setProcessOpen] = useState(false);
  const processServiceHandleOpen = () => setProcessOpen((cur) => !cur);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { user } = useStateContext();

  // Filtering invoices based on selected customer and date
  const filteredInvoice = invoices.filter((invoice) => {
    if (
      selectedCustomer &&
      invoice.Customer_idCustomer !== selectedCustomer.value
    ) {
      return false;
    }
    if (
      selectedSalesman &&
      invoice.Employee_idEmployee !== selectedSalesman.value.idEmployee
    ) {
      return false;
    }
    if (filterDate && invoice.Date !== filterDate) {
      return false;
    }
    if (
      statusFilter &&
      statusFilter &&
      statusFilter.value !== "" &&
      invoice.Status !== statusFilter.value
    ) {
      return false;
    }
    return true;
  });

  // Define status options
  const statusOptions = [
    { value: "", label: "All" },
    { value: 1, label: "Completed" },
    { value: 0, label: "Pending" },
  ];

  // Fetching customers on component mount
  useEffect(() => {
    const getCustomers = () => {
      axiosClient
        .get(`/customer/${user.branch}`)
        .then((res) => {
          setCustomers(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    const getRules = () => {
      axiosClient
        .get(`/rules/${user.branch}`)
        .then((res) => {
          setRules(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    const getSalesmen = () => {
      axiosClient
        .get(`/employee/${user.branch}`)
        .then((res) => {
          setSalesmen(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getCustomers();
    getSalesmen();
    getRules();
  }, []);

  const handleCustomerChange = (selectedOption) => {
    setSelectedCustomer(selectedOption);
  };

  const handleSalesmanChange = (selectedOption) => {
    setSelectedSalesman(selectedOption);
  };

  // Handler for changing status filter
  const handleStatusFilterChange = (selectedOption) => {
    setStatusFilter(selectedOption);
  };

  const [address, setAddress] = useState({});
  useEffect(() => {
    const getAddress = () => {
      axiosClient
        .get(`/branch/get-account-details/${user.branch}`)
        .then((res) => {
          let data = res.data;
          setAddress(data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getAddress();
  }, []);

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
      setTableLoading(false);
    };
    fetchInvoices();
  }, [invoiceTableLoading]);

  const getInvoice = (invoice_id) => {
    setPrintingInvoiceId(invoice_id);
    axiosClient
      .get(`/invoice/single/${invoice_id}`)
      .then((res) => {
        let data = res.data;
        let printValue = {
          data,
          address,
        };
        setPrintInvoice(printValue);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getJobDescription = (invoice_id) => {
    setPrintingJobDescId(invoice_id);
    axiosClient
      .get(`/invoice/single/${invoice_id}`)
      .then((res) => {
        let data = res.data;
        let printValue = {
          data,
          address,
        };
        setPrintJobDesc(printValue);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (Object.keys(printInvoice).length !== 0) {
      handlePrintInvoice();
    }
  }, [printInvoice]);

  useEffect(() => {
    if (Object.keys(printJobDesc).length !== 0) {
      handlePrintJobDescription();
    }
  }, [printJobDesc]);

  const handleViewClick = (invoice) => {
    axiosClient
      .get(`/invoice/single/${invoice.idInvoice}`)
      .then((res) => {
        const newData = res.data;
        setVIewItem({
          ...newData.invoice,
          items: newData.items,
          installments: newData.installments,
        });
        handleOpen();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const printInvoiceRef = useRef();
  const printJobDescRef = useRef();

  const handlePrintInvoice = useReactToPrint({
    content: () => printInvoiceRef.current,
    onAfterPrint: () => {
      setPrintingInvoiceId(null);
      setPrintInvoice({});
    },
  });

  const handlePrintJobDescription = useReactToPrint({
    content: () => printJobDescRef.current,
    onAfterPrint: () => {
      setPrintingJobDescId(null);
      setPrintJobDesc({});
    },
  });

  const handleFormatData = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return formattedDate;
  };

  const handleInvoiceStatus = (invoice) => {
    setSelectedInvoice(invoice.idInvoice);
    processServiceHandleOpen();
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

  //Custom styles fro the table
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

  const TABLE_INVOICE = [
    {
      name: "Invoice Number",
      selector: (row) => row.Invoice_Number,
      wrap: true,
      compact: true,
      maxWidth: "auto",
      sortable: true,
    },
    {
      name: "Customer",
      selector: (row) => row.Name,
      wrap: true,
      compact: true,
      maxWidth: "auto",
    },
    {
      name: "Date",
      selector: (row) => handleFormatData(row.Date),
      wrap: true,
      compact: true,
      maxWidth: "auto",
    },
    {
      name: "Total (LKR)",
      selector: (row) => (
        <span className="pr-2">
          {parseFloat(row.Total).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
      wrap: true,
      compact: true,
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
      wrap: true,
      compact: true,
      maxWidth: "auto",
      right: true,
    },
    {
      name: "Balance (LKR)",
      selector: (row) => (
        <span className="pr-2">
          {parseFloat(row.Credit_Balance).toLocaleString("en-US", {
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
      name: "Payment Type",
      selector: (row) => {
        return row.Payment_Type === 1
          ? "Full Payment"
          : row.Payment_Type === 2
          ? "Installment"
          : row.Payment_Type === 3
          ? "Half Payment"
          : row.Payment_Type === 4
          ? "Credit"
          : null;
      },
      wrap: false,
      maxWidth: "auto",
    },
    {
      name: "Payment Option",
      selector: (row) => {
        return row.Payment_Option === 1
          ? "Cash"
          : row.Payment_Option === 2
          ? "Card"
          : "Credit";
      },
      wrap: false,
      maxWidth: "auto",
    },
    ...(salesmanEnabled === 1
      ? [
          {
            name: "Salesman",
            selector: (row) => row.Employee_Name,
            wrap: false,
            maxWidth: "auto",
            right: true,
          },
        ]
      : []),
    {
      name: "Note",
      selector: (row) => (row.Note ? row.Note : "[No Note]"),
      wrap: false,
      maxWidth: "auto",
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
          {row.Status === 1 ? (
            <>
              {rules[0]?.Invoice_PrintType === 1 ? (
                <Tooltip content="Print Invoice">
                  <IconButton
                    className="bg-white"
                    variant="text"
                    onClick={() => getInvoice(row.idInvoice)}
                    disabled={printingInvoiceId === row.idInvoice}
                  >
                    <DownloadIcon className="w-4 h-4" />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip content="Print Receipt">
                  <IconButton variant="text" className="bg-white">
                    <span onClick={() => handlePassData(row)}>
                      <span>
                        <ThermalPrintIcon />
                      </span>
                    </span>
                  </IconButton>
                </Tooltip>
              )}
            </>
          ) : (
            <>
              <Tooltip content="Print Service Description">
                <IconButton
                  className="bg-white"
                  variant="text"
                  onClick={() => getJobDescription(row.idInvoice)}
                  disabled={printingJobDescId === row.idInvoice}
                >
                  <JobDescriptionIcon className="w-4 h-4" />
                </IconButton>
              </Tooltip>
              <Tooltip content="Complete Service">
                <IconButton
                  className="bg-white"
                  variant="text"
                  onClick={() => handleInvoiceStatus(row)}
                >
                  <ProcessIcon className="w-4 h-4" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </>
      ),
    },
  ];

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handlePassData = async (invoice, data) => {
    setSelectedInvoice(invoice);
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      const writer = port.writable.getWriter();
      await writer.write(data);
      await writer.close();
      await port.close();
      console.log("Receipt printed successfully.");
    } catch (error) {
      console.error("Error printing receipt:", error);
    }
  };

  //Mobile version row expand
  const handleExpandClick = (index) => {
    if (expandedInvoiceIndex === index) {
      setExpandedInvoiceIndex(null);
    } else {
      setExpandedInvoiceIndex(index);
    }
  };

  return (
    <>
      {/* Desktop version */}
      <section className="hidden mt-8 md:block">
        <div className="w-full bg-white rounded-[15px] px-[30px] pt-[20px] pb-[40px]">
          <div className="flex flex-col mt-4 md:flex-row md:justify-left">
            {salesmanEnabled === 1 && (
              <div className="w-full md:w-[250px] md:mr-5">
                <p className="font-poppins text-[14px] font-medium leading-[22px] text-[#64728C] pb-2">
                  Search by Salesman
                </p>
                <Select
                  className="basic-single text-[14px] h-10"
                  classNamePrefix="select"
                  isSearchable={true}
                  isClearable
                  name="color"
                  options={salesmen.map((salesman) => ({
                    value: salesman,
                    label: `${salesman.Employee_Name}`,
                  }))}
                  onChange={handleSalesmanChange}
                  styles={customSelectStyles}
                />
              </div>
            )}
            <div className="w-full md:w-[250px] md:mr-5 mb-4 md:mb-0">
              <p className="font-poppins text-[14px] font-medium leading-[22px] text-[#64728C] pb-2">
                Search by Date
              </p>
              <div class="date-input-container">
                <input
                  type="date"
                  class="custom-date-input"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-[250px] md:mr-5 mb-4 md:mb-0">
              <p className="font-poppins text-[14px] font-medium leading-[22px] text-[#64728C] pb-2">
                Search by Status
              </p>
              <Select
                className="basic-single font-poppins text-[12px] h-10"
                classNamePrefix="select"
                isSearchable={true}
                name="color"
                options={statusOptions}
                value={statusFilter}
                onChange={handleStatusFilterChange}
                styles={customSelectStyles}
              />
            </div>
          </div>
          <ThermalPrint />
        </div>
        <div className="w-full bg-white rounded-[15px] px-[30px] pt-[20px] pb-[20px] mt-10 relative">
          <Link
            className="w-[50px] aspect-square absolute rounded-full bg-[#769EFF] bg-opacity-30 -top-5 -right-3 flex items-center justify-center cursor-pointer"
            to="/invoices/new"
          >
            <PlusIcon width={"24px"} />
          </Link>
          <DataTable
            columns={TABLE_INVOICE}
            responsive
            data={filteredInvoice}
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
            to="/invoices/new"
          >
            <PlusIcon width={"14px"} />
          </Link>
        </div>
        <div className="flex flex-col mt-3">
          <div className="w-full md:w-1/5">
            <p className="font-poppins text-[12px] font-medium leading-[18px] text-[#64728C] pb-2">
              Search by Customer
            </p>
            <Select
              className="basic-single text-[14px] h-10"
              classNamePrefix="select"
              isSearchable={true}
              isClearable
              name="color"
              options={customers.map((customer) => ({
                value: customer.idCustomer,
                label: ` ${customer.Name} - ${customer.Tp}`,
              }))}
              onChange={handleCustomerChange}
              styles={customSelectStyles}
            />
          </div>
          {salesmanEnabled === 1 && (
            <div className="w-full mt-5 md:w-1/5">
              <p className="font-poppins text-[12px] font-medium leading-[18px] text-[#64728C] pb-2">
                Search by Salesman
              </p>
              <Select
                className="basic-single text-[14px] h-10"
                classNamePrefix="select"
                isSearchable={true}
                isClearable
                name="color"
                options={salesmen.map((salesman) => ({
                  value: salesman,
                  label: `${salesman.Employee_Name}`,
                }))}
                onChange={handleSalesmanChange}
                styles={customSelectStyles}
              />
            </div>
          )}
          <div className="w-full mt-5 md:w-1/5">
            <p className="font-poppins text-[12px] font-medium leading-[18px] text-[#64728C] pb-2">
              Search by Date
            </p>
            <div class="date-input-container">
              <input
                type="date"
                class="custom-date-input"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full pb-3 mt-5 md:w-1/5">
            <p className="font-poppins text-[12px] font-medium leading-[18px] text-[#64728C] pb-2">
              Search by Status
            </p>
            <div class="date-input-container">
              <Select
                className="basic-single font-poppins text-[12px] h-10"
                classNamePrefix="select"
                isSearchable={true}
                name="color"
                options={statusOptions}
                value={statusFilter}
                onChange={handleStatusFilterChange}
                styles={customSelectStyles}
              />
            </div>
          </div>
        </div>
        <div className="w-full pt-5">
          <div className="w-full bg-[#769EFF] bg-opacity-30 px-2 py-2 font-poppins font-medium text-[12px] leading-[18px] text-[#10275E] flex items-center gap-2">
            <ArrowDownIcon />
            Customer
          </div>
          {filteredInvoice
            .slice(
              (currentPage - 1) * invoicePerPage,
              currentPage * invoicePerPage
            )
            .map((invoice, index) => (
              <>
                <div
                  className="w-full flex items-center px-2 py-2 border-b border-[#64728C] border-opacity-10"
                  onClick={() => handleExpandClick(index)}
                >
                  <span className="w-[14px] aspect-square border border-[#64728C] rounded-full flex justify-center items-center mr-3">
                    {expandedInvoiceIndex === index ? (
                      <MinusIcon width={"8px"} />
                    ) : (
                      <PlusIcon width={"8px"} />
                    )}
                  </span>
                  <span className="font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                    {invoice.Name}
                  </span>
                </div>
                {expandedInvoiceIndex === index && (
                  <div className="w-full pl-[35px] bg-[#D9D9D9] bg-opacity-20">
                    <div className="w-full py-2 font-poppins font-medium text-[12px] leading-[18px] text-[#64728C] border-b border-[#64728C] border-opacity-10">
                      {invoice.Name}
                    </div>
                    <div className="w-full flex items-center py-2 border-b border-[#64728C] border-opacity-10">
                      <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                        {TABLE_HEAD_INVOICE[0]}
                      </div>
                      <div className="w-[60%] font-poppins font-normal text-[12px] leading-[18px] text-wrap text-[#64728C]">
                        {invoice.Invoice_Number}
                      </div>
                    </div>
                    <div className="w-full flex items-center py-2 border-b border-[#64728C] border-opacity-10">
                      <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                        {TABLE_HEAD_INVOICE[2]}
                      </div>
                      <div className="w-[60%] font-poppins font-normal text-[12px] leading-[18px] overflow-wrap break-word word-break break-all text-[#64728C]">
                        {invoice.Date}
                      </div>
                    </div>
                    <div className="w-full flex items-center py-2 border-b border-[#64728C] border-opacity-10">
                      <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                        {TABLE_HEAD_INVOICE[3]}
                      </div>
                      <div className="w-[60%] font-poppins font-normal text-[12px] leading-[18px] text-[#64728C]">
                        {invoice.Total
                          ? parseFloat(invoice.Total).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : "0.00"}
                      </div>
                    </div>
                    <div className="w-full flex items-center py-2 border-b border-[#64728C] border-opacity-10">
                      <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                        {TABLE_HEAD_INVOICE[4]}
                      </div>
                      <div className="w-[60%] font-poppins font-normal text-[12px] leading-[18px] text-[#64728C]">
                        {invoice.Paid_Amount
                          ? parseFloat(invoice.Paid_Amount).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )
                          : "0.00"}
                      </div>
                    </div>
                    <div className="w-full flex items-center py-2 border-b border-[#64728C] border-opacity-10">
                      <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                        {TABLE_HEAD_INVOICE[5]}
                      </div>
                      <div className="w-[60%] font-poppins font-medium text-[12px] leading-[18px]">
                        {invoice.Credit_Balance
                          ? parseFloat(invoice.Credit_Balance).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )
                          : "0.00"}
                      </div>
                    </div>
                    <div className="w-full flex items-center py-2 border-b border-[#64728C] border-opacity-10">
                      <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                        {TABLE_HEAD_INVOICE[6]}
                      </div>
                      <div className="w-[60%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                        {invoice.Payment_Type == 1
                          ? "Full Payment"
                          : "Installment"}
                      </div>
                    </div>
                    {salesmanEnabled === 1 && (
                      <div className="w-full flex items-center py-2 border-b border-[#64728C] border-opacity-10">
                        <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                          {TABLE_HEAD_INVOICE[7]}
                        </div>
                        <div className="w-[60%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                          {invoice.Employee_Name}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center w-full py-2">
                      <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                        {TABLE_HEAD_INVOICE[8]}
                      </div>
                      <div className="w-[60%] flex items-center gap-2">
                        <Tooltip content="View Invoice">
                          <IconButton
                            onClick={() => handleViewClick(invoice)}
                            variant="text"
                            className="bg-transparent"
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>

                        {invoice.Status === 0 ? (
                          <>
                            <Tooltip content="Print Service Description">
                              <IconButton
                                className="bg-transparent"
                                variant="text"
                                onClick={() =>
                                  getJobDescription(invoice.idInvoice)
                                }
                                disabled={
                                  printingJobDescId === invoice.idInvoice
                                }
                              >
                                <JobDescriptionIcon className="w-4 h-4" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip content="Complete Service">
                              <IconButton
                                className="bg-transparent"
                                variant="text"
                                onClick={() => handleInvoiceStatus(invoice)}
                              >
                                <ProcessIcon className="w-4 h-4" />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <Tooltip content="Print Invoice">
                            <IconButton
                              variant="text"
                              className="bg-transparent "
                            >
                              <span
                                onClick={() => getInvoice(invoice.idInvoice)}
                              >
                                <DownloadIcon />
                              </span>
                              <span style={{ display: "none" }}>
                                <span ref={printInvoiceRef}>
                                  {Object.keys(printInvoice).length !== 0 && (
                                    <PrintInvoice data={printInvoice} />
                                  )}
                                </span>
                              </span>
                            </IconButton>
                          </Tooltip>
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
            Page {currentPage} of{" "}
            {Math.ceil(filteredInvoice.length / invoicePerPage)}
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
              currentPage === Math.ceil(filteredInvoice.length / invoicePerPage)
            }
          >
            <PaginateRight />
          </button>
        </div>
      </section>

      <ViewInvoice invoice={viewItem} handleOpen={handleOpen} open={open} />
      <span style={{ display: "none" }}>
        <span ref={printInvoiceRef}>
          <PrintInvoice data={printInvoice} />
        </span>
      </span>
      {selectedInvoice && <ThermalPrint selectedInvoice={selectedInvoice} />}
      <span style={{ display: "none" }}>
        <span ref={printJobDescRef}>
          <PrintJobDescription data={printJobDesc} />
        </span>
      </span>
      <ProcessInvoiceService
        invoice={selectedInvoice}
        handleOpen={processServiceHandleOpen}
        open={processOpen}
        handleLoading={handleLoading}
      />
    </>
  );
};
