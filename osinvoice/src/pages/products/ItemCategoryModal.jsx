import { Card, Dialog, Tooltip } from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { CloseIcon, ProcessingIcon, RemoveIcon } from "../../utils/icons";
import Select from "react-select";
import { product_type } from "../../utils/dataArrays";
import axiosClient from "../../../axios-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStateContext } from "../../contexts/NavigationContext";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

export const ItemCategoryModal = ({ handleOpen, open }) => {
  // const handleClose = () => {
  //   handleOpen();
  // };

  const { user } = useStateContext();

  const Type = product_type.map((item) => ({
    value: item.id,
    label: item.key,
  }));

  const [submitting, setSubmitting] = useState(false);

  const [category, setCategory] = useState([]);
  const [categoryTableLoading, setCategoryTableLoading] = useState(false);
  const handleLoading = () => setCategoryTableLoading((pre) => !pre);

  const [editedCategoryType, setEditedCategoryType] = useState(null);

  const [errors, setErrors] = useState({});
  const [addcategory, setAddCategory] = useState({
    Description: "",
    Type: "1",
    Branch_idBranch: user.branch,
  });
  const [editcategory, setEditCategory] = useState({
    idItem_Category: 0,
    Description: "",
    Type: 0,
    Branch_idBranch: user.branch,
  });

  const handleTypeChange = (selectedOption) => {
    setAddCategory({ ...addcategory, Type: selectedOption.value });
  };

  const handleEditTypeChange = (selectedOption) => {
    setEditCategory({ ...editcategory, Type: selectedOption.value });
  };

  const handleEditCategory = (category) => {
    setEditCategory({
      idItem_Category: category.idItem_Category,
      Type: category.Type,
      Description: category.Description,
      Branch_idBranch: category.Branch_idBranch,
    });
    setEditedCategoryType(category.Type);
  };

  const handleCancelEditCategory = () => {
    setEditCategory({
      idItem_Category: 0,
      Description: "",
      Type: "",
    });
  };

  // Validation function for form data
  const validate = (valData) => {
    const errors = {};
    if (!valData.Description) {
      errors.Description = "Add Description";
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: errors.Description,
        allowOutsideClick: false,
      });
    }
    let errorMessage = "";
    Object.values(errors).forEach((error) => {
      errorMessage += `${error}\n`;
    });
    return errors;
  };

  const resetForm = (Type) => {
    setAddCategory({
      Description: "",
      Type: Type,
      Branch_idBranch: user.branch,
    });
    setErrors({});
  };
  const handleClose = () => {
    resetForm("1");
    handleOpen();
  };
  const handleSave = () => {
    const validationErrors = validate(addcategory);

    if (Object.keys(validationErrors).length > 0) {
      const errorMessages = Object.values(validationErrors).join("\n");
      toast.error(errorMessages);
      return;
    }

    setSubmitting(true);

    axiosClient
      .post("product/category", addcategory)
      .then((response) => {
        resetForm(addcategory.Type);
        handleLoading();
        toast.success("Category added successfully !");
        setSubmitting(false);
      })
      .catch((error) => {
        console.error("Error saving item:", error);
        toast.error("Failed to add Customer. Please try again.");
        setSubmitting(false);
      });
  };

  useEffect(() => {
    const fetchCategory = () => {
      axiosClient
        .get(`product/category/${user.branch}`)
        .then((res) => {
          setCategory(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchCategory();
  }, [categoryTableLoading]);

  const resetEditForm = () => {
    setEditCategory({
      idItem_Category: 0,
      Description: "",
      Type: "",
      Branch_idBranch: user.branch,
    });
    setErrors({});
  };

  const handleEdit = () => {
    const validationErrors = validate(editcategory);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const errorMessage = Object.values(validationErrors).join(", ");
      toast.error(errorMessage);
      return;
    }

    setSubmitting(true);

    axiosClient
      .put(`product/category/${editcategory.idItem_Category}`, editcategory)
      .then((response) => {
        handleLoading();
        toast.success("Category updated successfully !");
        resetEditForm();
        setSubmitting(false);
      })
      .catch((error) => {
        console.error("Error updating category:", error);
        toast.error("Failed to update category. Please try again.");
        setSubmitting(false);
      });
  };

  const handleDeleteCategory = (categoryId) => {
    Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient
          .delete(`product/category/${categoryId}`)
          .then((response) => {
            handleLoading();
            toast.success("Category deleted successfully !");
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

  const TABLE_HEAD_ITEM_CATEGORY = [
    {
      name: "Type",
      selector: (row) => (row.Type === "1" ? "Item":""),
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
      name: "Action",
      cell: (row) => (
        <>
          <Tooltip content="Edit Product">
            <span
              className="cursor-pointer "
              onClick={() => handleEditCategory(row)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </span>
          </Tooltip>
          <Tooltip content="Delete Product">
            <span
              className="ml-3 cursor-pointer"
              onClick={() => handleDeleteCategory(row.idItem_Category)}
            >
              <RemoveIcon />
            </span>
          </Tooltip>
        </>
      ),
    },
  ];

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

  return (
    <>
      <Dialog
        size="xs"
        open={open}
        className="bg-white shadow-none overflow-scroll scrollbar-hide font-poppins rounded-[10px]"
      >
        <div className="w-full p-5 mx-auto">
          <div className="flex justify-between mb-4 align-center">
            <div className="font-poppins text-[16px] leading-6 font-medium pb-3 text-[#64728C]">
              Product Category Manager
            </div>
            <div
              className="font-bold text-[20px] cursor-pointer"
              onClick={handleClose}
            >
              <CloseIcon />
            </div>
          </div>
          <div className="flex flex-col gap-3 mb-5 ">
            <div className="flex items-center justify-between">
              <div className="w-[30%]">
                <h3 className="font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                  Description
                </h3>
              </div>
              <div className="w-[60%]">
                {editcategory.idItem_Category !== 0 ? (
                  <input
                    name="Description"
                    type="text"
                    className="block rounded-[15px] py-2 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                    value={editcategory.Description}
                    onChange={(e) =>
                      setEditCategory({
                        ...editcategory,
                        Description: e.target.value,
                      })
                    }
                  />
                ) : (
                  <input
                    name="Description"
                    type="text"
                    className="block rounded-[15px] focus:outline-[#bdbdbd] border-0 py-2 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                    value={addcategory.Description}
                    onChange={(e) =>
                      setAddCategory({
                        ...addcategory,
                        Description: e.target.value,
                      })
                    }
                  />
                )}
                {errors.Description && (
                  <span className=" text-[#ff0000a1] px-1 font-inter font-bold text-xs">
                    {" "}
                    {errors.Description}{" "}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="w-[30%]">
                <h3 className="font-poppins font-medium text-[12px] leading-[18px] text-[#64728C]">
                  Type
                </h3>
              </div>
              <div className="w-[60%]">
                {editcategory.idItem_Category !== 0 ? (
                  <Select
                    className="basic-single text-[14px]"
                    classNamePrefix="select"
                    value={Type.find(
                      (option) => option.value === editedCategoryType
                    )}
                    isSearchable={true}
                    name="color"
                    options={Type}
                    styles={customSelectStyles}
                    onChange={handleEditTypeChange}
                  />
                ) : (
                  <Select
                    className="basic-single text-[14px]"
                    classNamePrefix="select"
                    defaultValue={Type[0]}
                    isSearchable={true}
                    name="color"
                    options={Type}
                    styles={customSelectStyles}
                    onChange={handleTypeChange}
                  />
                )}
              </div>
            </div>
            <div className="flex items-center justify-end">
              {editcategory.idItem_Category !== 0 ? (
                <div className="flex justify-end w-[60%] gap-3">
                  <button
                    onClick={() => handleEdit()}
                    className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] hover:opacity-80 text-[#10275E]"
                    disabled={submitting}
                  >
                    {submitting && <ProcessingIcon />}
                    Update
                  </button>
                  <button
                    onClick={() => handleCancelEditCategory()}
                    className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] hover:opacity-80 text-[#10275E]"
                  >
                    {submitting && <ProcessingIcon />}
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleSave()}
                  className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] hover:opacity-80 text-[#10275E]"
                  disabled={submitting}
                >
                  {" "}
                  Add Item
                </button>
              )}
            </div>
          </div>
          <div className="overflow-x-scroll scrollbar-x-style">
            <DataTable
              columns={TABLE_HEAD_ITEM_CATEGORY}
              responsive
              data={category}
              customStyles={tableHeaderStyles}
              className="mt-4"
              pagination
              paginationPerPage={3}
              paginationRowsPerPageOptions={[2, 4, 6]}
              paginationComponentOptions={{
                rowsPerPageText: "Entries per page:",
                rangeSeparatorText: "of",
              }}
              noDataComponent={
                <div className="text-center">No data available</div>
              }
            />
          </div>
        </div>
      </Dialog>
      <ToastContainer />
    </>
  );
};
