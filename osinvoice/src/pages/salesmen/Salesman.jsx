import { useState, useEffect } from "react";
import { IconButton, Tooltip } from "@material-tailwind/react";
import {
  EditNewIcon,
  PlusIcon,
  ArrowDownIcon,
  PaginateLeft,
  PaginateRight,
  MinusIcon,
  RemoveIcon,
} from "../../utils/icons";
import { TABLE_HEAD_SALESMEN } from "../../utils/tableArray";
import axiosClient from "../../../axios-client";
import { useNavigate, Link } from "react-router-dom";
import { useStateContext } from "../../contexts/NavigationContext";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";

export default function Salesman() {
  const { user } = useStateContext();

  const [expandedSalesmanIndex, setExpandedSalesmanIndex] = useState(null);

  // State for storing list of suppliers
  const [salesmen, setSalesmen] = useState([]);
  // State for controlling loading state of supplier table
  const [salesmanTableLoading, setSalesmanTableLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSalesman, setFilteredSalesman] = useState([]);
  // const [statusFilter, setStatusFilter] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [salesmanPerPage] = useState(6);

  const navigate = useNavigate();

  // Calculate indexes for pagination
  const indexOfLastSalesman = currentPage * salesmanPerPage;

  // Pagination function
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Effect to fetch suppliers when supplierTableLoading changes

  useEffect(() => {
    const fetchSalesmen = () => {
      axiosClient
        .get(`/employee/${user.branch}`)
        .then((res) => {
          setSalesmen(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchSalesmen();
  }, [salesmanTableLoading]);

  // Filter supplier based on search query and status
  useEffect(() => {
    const filtered = salesmen.filter((salesman) => {
      const matchesSearch =
        salesman.Employee_Name.toLowerCase().includes(
          searchQuery.toLowerCase()
        ) ||
        salesman.Employee_NIC.toLowerCase().includes(
          searchQuery.toLowerCase()
        ) ||
        salesman.ETF_No.includes(searchQuery) ||
        salesman.Contact_No.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });

    setFilteredSalesman(filtered);
  }, [searchQuery, salesmen]);

  // Handler for search input change
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to handle edit button click
  const handleEditClick = (salesman) => {
    navigate(`/salesman/edit/${salesman.idEmployee}`);
  };

  //Function to handle salesman delete
  const handleDelete = (salesman) => {
    Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient
          .delete(`/employee/${salesman.idEmployee}`)
          .then((res) => {
            Swal.fire("Deleted!", res.data.message, "success");
            setSalesmen(
              salesmen.filter(
                (saleMan) => saleMan.idEmployee !== salesman.idEmployee
              )
            );
          })
          .catch((error) => {
            console.log(error);
            console.log(error.response.status);
            if (error.response.status === 409) {
              toast.error("Salesman has Invoice(s)!");
            } else {
              toast.error("Failed to delete Supplier. Please try again.");
            }
          });
      }
    });
  };

  // Function to handle view button click
  const handleViewClick = (salesman) => {
    navigate(`/supplier/single/${salesman.idEmployee}`);
  };

  const TABLE_SUPPLIER = [
    {
      name: "Salesman No",
      selector: (row) => (
        <span
          onClick={() => handleViewClick(row)}
          className="cursor-pointer customer-name hover:underline"
        >
          {row.Employee_Number}
        </span>
      ),
      wrap: false,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
      sortable: true,
    },
    {
      name: "Salesman Name",
      selector: (row) => row.Employee_Name,
      wrap: false,
      maxWidth: "auto",
    },
    {
      name: "NIC",
      selector: (row) => row.Employee_NIC,
      wrap: false,
      maxWidth: "auto",
    },
    {
      name: "ETF No",
      selector: (row) => row.ETF_No,
      wrap: false,
      maxWidth: "auto",
    },
    {
      name: "Contact No",
      selector: (row) => row.Contact_No,
      wrap: false,
      maxWidth: "auto",
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Tooltip content="Edit Salesman">
            <IconButton
              onClick={() => handleEditClick(row)}
              variant="text"
              className="mr-2 bg-white"
            >
              <EditNewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip content="Delete Salesman">
            <IconButton
              onClick={() => handleDelete(row)}
              variant="text"
              className="mr-2 bg-white"
            >
              <RemoveIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

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

  //Mobile version row expand
  const handleExpandClick = (index) => {
    if (expandedSalesmanIndex === index) {
      setExpandedSalesmanIndex(null);
    } else {
      setExpandedSalesmanIndex(index);
    }
  };

  return (
    <>
      {/* Desktop version */}
      <section className="mt-8 hidden md:block">
        <div className="w-full bg-white rounded-[15px] px-[30px] pt-[20px] pb-[40px]">
          <div className="flex flex-col mt-4 md:flex-row md:justify-left">
            <div className="w-full md:w-[250px] md:mr-5 mb-4 md:mb-0">
              <p className="font-poppins text-[14px] font-medium leading-[22px] text-[#64728C] pb-2">
                Search Salesman
              </p>
              <input
                type="text"
                placeholder="Type here...."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="border border-[#e6e8ed] rounded-[15px] px-5 py-2 w-full text-[15px] font-poppins font-medium leading-[22px]"
              />
            </div>
          </div>
        </div>
        <div className="w-full bg-white rounded-[15px] px-[30px] pt-[20px] pb-[20px] mt-10 relative">
          <Link
            className="w-[50px] aspect-square absolute rounded-full bg-[#769EFF] bg-opacity-30 -top-5 -right-3 flex items-center justify-center cursor-pointer"
            to="/salesman/add"
          >
            <PlusIcon width={"24px"} />
          </Link>
          <DataTable
            columns={TABLE_SUPPLIER}
            responsive
            data={filteredSalesman}
            customStyles={tableHeaderStyles}
            className="mt-4"
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 15]}
            paginationComponentOptions={{
              rowsPerPageText: "Entries per page:",
              rangeSeparatorText: "of",
            }} // Set options for pagination component
            noDataComponent={
              <div className="text-center">No data available</div>
            } // Optional: Custom message when there is no data
          />
        </div>
      </section>

      {/* mobile version */}
      <section className="mt-5 bg-white px-[3%] w-full rounded-[10px] py-3 md:hidden">
        <div className="flex justify-end">
          <Link
            className="w-[30px] aspect-square rounded-full bg-[#769EFF] bg-opacity-30 -top-5 -right-3 flex items-center justify-center cursor-pointer"
            to="/supplier/add"
          >
            <PlusIcon width={"14px"} />
          </Link>
        </div>
        <div className="flex flex-col mt-3">
          <div className="w-full mb-4 md:w-1/5 md:mr-5 md:mb-0">
            <p className="font-poppins text-[12px] font-medium leading-[18px] text-[#64728C] pb-2">
              Search Salesman
            </p>
            <input
              type="text"
              placeholder="Search Salesman Name ,NIC, ETF No, Phone"
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="block rounded-[15px] border-0 py-2 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
            />
          </div>
        </div>
        <div className="w-full pt-5">
          <div className="w-full bg-[#769EFF] bg-opacity-30 px-2 py-2 font-poppins font-medium text-[12px] leading-[18px] text-[#10275E] flex items-center gap-2">
            <ArrowDownIcon />
            Salesman No
          </div>
          {filteredSalesman
            .slice(
              (currentPage - 1) * salesmanPerPage,
              currentPage * salesmanPerPage
            )
            .map((salesman, index) => (
              <>
                <div
                  className="w-full flex items-center px-2 py-2 border-b border-[#64728C] border-opacity-10"
                  onClick={() => handleExpandClick(index)}
                >
                  <span className="w-[14px] aspect-square border border-[#64728C] rounded-full flex justify-center items-center mr-3">
                    {expandedSalesmanIndex === index ? (
                      <MinusIcon width={"8px"} />
                    ) : (
                      <PlusIcon width={"8px"} />
                    )}
                  </span>
                  <span className="font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                    {salesman.Employee_Number}
                  </span>
                </div>
                {expandedSalesmanIndex === index && (
                  <div className="w-full pl-[35px] bg-[#D9D9D9] bg-opacity-20">
                    <div className="w-full py-2 font-poppins font-medium text-[12px] leading-[18px] text-[#64728C] border-b border-[#64728C] border-opacity-10">
                      {salesman.Employee_Number}
                    </div>
                    <div className="w-full flex items-center py-2 border-b border-[#64728C] border-opacity-10">
                      <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                        {TABLE_HEAD_SALESMEN[1]}
                      </div>
                      <div className="w-[60%] font-poppins font-normal text-[12px] leading-[18px] text-wrap text-[#64728C]">
                        {salesman.Employee_Name}
                      </div>
                    </div>

                    <div className="w-full flex items-center py-2 border-b border-[#64728C] border-opacity-10">
                      <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                        {TABLE_HEAD_SALESMEN[2]}
                      </div>
                      <div className="w-[60%] font-poppins font-normal text-[12px] leading-[18px] overflow-wrap break-word word-break break-all text-[#64728C]">
                        {salesman.Employee_NIC}
                      </div>
                    </div>

                    <div className="w-full flex items-center py-2 border-b border-[#64728C] border-opacity-10">
                      <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                        {TABLE_HEAD_SALESMEN[3]}
                      </div>
                      <div className="w-[60%] font-poppins font-normal text-[12px] leading-[18px] text-[#64728C]">
                        {salesman.ETF_No}
                      </div>
                    </div>

                    <div className="w-full flex items-center py-2 border-b border-[#64728C] border-opacity-10">
                      <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                        {TABLE_HEAD_SALESMEN[4]}
                      </div>
                      <div className="w-[60%] font-poppins font-normal text-[12px] leading-[18px] text-[#64728C]">
                        {salesman.Contact_No}
                      </div>
                    </div>

                    <div className="flex items-center w-full py-2">
                      <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                        {TABLE_HEAD_SALESMEN[5]}
                      </div>
                      <div className="w-[60%] flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(salesman)}
                          variant="text"
                          className="bg-white"
                        >
                          <EditNewIcon />
                        </button>
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
            Page {currentPage} of {Math.ceil(salesmen.length / salesmanPerPage)}
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
              currentPage === Math.ceil(salesmen.length / indexOfLastSalesman)
            }
          >
            <PaginateRight />
          </button>
        </div>
      </section>
      <ToastContainer />
    </>
  );
}
