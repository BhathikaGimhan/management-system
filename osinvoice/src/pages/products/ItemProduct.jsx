import React, { useState, useEffect } from "react";
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
import { TABLE_HEAD_MOBILE_ITEM } from "../../utils/tableArray";
import { EditProduct } from "./EditProduct";
import axiosClient from "../../../axios-client";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/NavigationContext";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export const ItemProduct = ({ productTableLoading, handleLoading }) => {
  const { user } = useStateContext();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const editProductHandleOpen = () => setEditOpen((cur) => !cur);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItem, setFilteredItem] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [tableLoading, setTableLoading] = useState(true);

  const [expandedProductIndex, setExpandedProductIndex] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage] = useState(5);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchProducts = () => {
      axiosClient
        .get(`/product/items/${user.branch}`)
        .then((res) => {
          setProducts(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
      setTableLoading(false);
    };
    fetchProducts();
  }, [productTableLoading]);

  const selectedType = "1";

  useEffect(() => {
    const getCategory = () => {
      axiosClient
        .get(`/product/category/${user.branch}`)
        .then((res) => {
          let data = res.data;
          const categoryOptions = data.map((category) => ({
            value: category.idItem_Category,
            label: category.Description,
            type: category.Type,
          }));
          const allOption = { value: "", label: "All" }; // Define the "All" option
          const categoriesWithAll = [
            allOption,
            ...categoryOptions.filter((cat) => cat.type === selectedType),
          ];
          setCategory(categoriesWithAll);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getCategory();
  }, [selectedType]);

  const handleCategoryChange = (selectedOption) => {
    if (selectedOption.value === "") {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(selectedOption);
    }
  };

  useEffect(() => {
    const filtered = products.filter((item) => {
      const matchesSearch = item.Description.toLowerCase().includes(
        searchQuery.toLowerCase()
      );

      const matchesCategory =
        selectedCategory &&
        item.Item_Category_idItem_Category === selectedCategory.value;

      return matchesSearch && (selectedCategory ? matchesCategory : true);
    });

    setFilteredItem(filtered);
  }, [searchQuery, products, selectedCategory]);

  // Handler for search input change
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleEditClick = (product) => {
    navigate(`/product/edit/${product.idItem}`);
  };

  //Function to handle item delete
  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient
          .delete(`/product/${item.idItem}`)
          .then((res) => {
            Swal.fire("Deleted!", res.data.message, "success");
            setProducts(products.filter((pr) => pr.idItem !== item.idItem));
          })
          .catch((error) => {
            console.error("Error deleting category:", error);
            if (
              error.response &&
              error.response.data &&
              error.response.data.message
            ) {
              toast.error(error.response.data.message);
            } else {
              toast.error("Failed to delete category. Please try again.");
            }
          });
      }
    });
  };

  const TABLE_HEAD_ITEM = [
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
      name: "Description",
      selector: (row) => row.Description,
      wrap: false,
      maxWidth: "auto",
    },
    {
      name: "Real Cost (LKR)",
      selector: (row) => (
        <span className="pr-2">
          {parseFloat(row.Real_Cost).toLocaleString("en-US", {
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
      name: "Cost (LKR)",
      selector: (row) => (
        <span className="pr-2">
          {parseFloat(row.Cost).toLocaleString("en-US", {
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
      name: "Qty Type",
      selector: (row) => row.Quantity_Type,
      wrap: false,
      maxWidth: "auto",
    },
    {
      name: "Qty",
      selector: (row) => <span className="pr-">{parseFloat(row.Qty)}</span>,
      wrap: false,
      maxWidth: "auto",
      right: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Tooltip content="Edit Product">
            <Link>
              <IconButton
                onClick={() => handleEditClick(row)}
                variant="text"
                className="mx-2 bg-white"
              >
                <EditNewIcon />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip content="Delete Item">
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
    if (expandedProductIndex === index) {
      setExpandedProductIndex(null);
    } else {
      setExpandedProductIndex(index);
    }
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

  return (
    <>
      <div className="rounded-none h-fit font-poppins ">
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row md:justify-left bg-white pt-5 px-[30px] md:pb-[40px] md:rounded-b-[15px] w-full">
            <div className="w-full md:w-[250px] md:mr-5 mb-4 md:mb-0">
              <p className="font-poppins text-[12px] md:text-[14px] font-medium leading-[18px] md:leading-[22px] text-[#64728C] pb-2">
                Search by Description
              </p>
              <input
                type="text"
                placeholder="Type here...."
                value={searchQuery}
                onChange={handleSearchInputChange}
                styles={customSelectStyles}
                className="border border-[#e6e8ed] focus:outline-[#bdbdbd] rounded-[15px] px-5 py-2 md:min-w-[250px] w-full text-[15px] font-poppins font-medium leading-[22px]"
              />
            </div>
            <div className="w-full md:w-[250px]">
              <p className="font-poppins text-[12px] md:text-[14px] font-medium leading-[18px] md:leading-[22px] text-[#64728C] pb-2">
                Search by Category
              </p>
              <Select
                className="basic-single text-[14px] h-10 rounded-lg"
                isSearchable={true}
                options={category}
                value={selectedCategory}
                onChange={handleCategoryChange}
                styles={customSelectStyles}
              />
            </div>
          </div>

          {/* Desktop Version */}
          <div className="w-full bg-white rounded-[15px] px-[30px] pt-[20px] pb-[20px] mt-10 relative hidden md:block">
            <Link
              className="w-[50px] aspect-square absolute rounded-full bg-[#769EFF] bg-opacity-30 -top-5 -right-0 flex items-center justify-center cursor-pointer"
              to="/product/add"
            >
              <PlusIcon width={"24px"} />
            </Link>
            <DataTable
              columns={TABLE_HEAD_ITEM}
              responsive
              data={filteredItem}
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

          {/* Mobile Version */}
          <div className="bg-white px-[3%] w-full rounded-b-[15px] py-3 md:hidden">
            <div className="w-full pt-5">
              <div className="w-full bg-[#769EFF] bg-opacity-30 px-2 py-2 font-poppins font-medium text-[12px] leading-[18px] text-[#10275E] flex items-center gap-2">
                <ArrowDownIcon />
                Item
              </div>
              {filteredItem
                .slice(
                  (currentPage - 1) * productPerPage,
                  currentPage * productPerPage
                )
                .map((product, index) => (
                  <>
                    <div
                      className="w-full flex items-center px-2 py-2 border-b border-[#64728C] border-opacity-10"
                      onClick={() => handleExpandClick(index)}
                    >
                      <span className="w-[14px] aspect-square border border-[#64728C] rounded-full flex justify-center items-center mr-3">
                        {expandedProductIndex === index ? (
                          <MinusIcon width={"8px"} />
                        ) : (
                          <PlusIcon width={"8px"} />
                        )}
                      </span>
                      <span className="font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                        {product.Description}
                      </span>
                    </div>
                    {expandedProductIndex === index && (
                      <div className="w-full pl-[35px] bg-[#D9D9D9] bg-opacity-20">
                        <div className="w-full py-2 font-poppins font-medium text-[12px] leading-[18px] text-[#64728C] border-b border-[#64728C] border-opacity-10">
                          {product.Description}
                        </div>
                        <div className="w-full flex items-center py-2 border-b border-[#64728C] border-opacity-10">
                          <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                            {TABLE_HEAD_MOBILE_ITEM[0]}
                          </div>
                          <div className="w-[60%] font-poppins font-normal text-[12px] leading-[18px] text-wrap text-[#64728C]">
                            {product.Item_Category}
                          </div>
                        </div>
                        <div className="w-full flex items-center py-2 border-b border-[#64728C] border-opacity-10">
                          <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                            {TABLE_HEAD_MOBILE_ITEM[2]}
                          </div>
                          <div className="w-[60%] font-poppins font-normal text-[12px] leading-[18px] overflow-wrap break-word word-break break-all text-[#64728C]">
                            {product.Real_Cost
                              ? parseFloat(product.Real_Cost).toLocaleString(
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
                            {TABLE_HEAD_MOBILE_ITEM[3]}
                          </div>
                          <div className="w-[60%] font-poppins font-normal text-[12px] leading-[18px] text-[#64728C]">
                            {product.Cost
                              ? parseFloat(product.Cost).toLocaleString(
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
                            {TABLE_HEAD_MOBILE_ITEM[4]}
                          </div>
                          <div className="w-[60%] font-poppins font-normal text-[12px] leading-[18px] text-[#64728C]">
                            {product.Rate
                              ? parseFloat(product.Rate).toLocaleString(
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
                            {TABLE_HEAD_MOBILE_ITEM[5]}
                          </div>
                          <div className="w-[60%] font-poppins font-medium text-[12px] leading-[18px]">
                            {product.Quantity_Type}
                          </div>
                        </div>
                        <div className="w-full flex items-center py-2 border-b border-[#64728C] border-opacity-10">
                          <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                            {TABLE_HEAD_MOBILE_ITEM[6]}
                          </div>
                          <div className="w-[60%] font-poppins font-medium text-[12px] leading-[18px]">
                            {product.Qty.toLocaleString("en-US")}
                          </div>
                        </div>
                        <div className="flex items-center w-full py-2">
                          <div className="w-[40%] font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                            {TABLE_HEAD_MOBILE_ITEM[6]}
                          </div>
                          <div className="w-[60%] flex items-center gap-2">
                            <button
                              onClick={() => handleEditClick(product)}
                              variant="text"
                              className="bg-transparent"
                            >
                              <EditNewIcon />
                            </button>
                            <button
                              onClick={() => handleDelete(product)}
                              variant="text"
                              className="ml-2 bg-transparent"
                            >
                              <RemoveIcon />
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
                Page {currentPage} of{" "}
                {Math.ceil(filteredItem.length / productPerPage)}
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
                  currentPage ===
                  Math.ceil(filteredItem.length / productPerPage)
                }
              >
                <PaginateRight />
              </button>
            </div>
          </div>
        </div>
      </div>
      {selectedProduct && (
        <EditProduct
          product={selectedProduct}
          handleOpen={editProductHandleOpen}
          open={editOpen}
          handleLoading={handleLoading}
        />
      )}
    </>
  );
};
