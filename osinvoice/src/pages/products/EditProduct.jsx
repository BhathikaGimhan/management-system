import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProcessingIcon, AddCustomerIcon } from "../../utils/icons";
import Select from "react-select";
import Swal from "sweetalert2";
import { useStateContext } from "../../contexts/NavigationContext";

export const EditProduct = () => {
  const { user } = useStateContext();

  const [editedProduct, setEditedProduct] = useState({});
  const [errors, setErrors] = useState({});

  const [category, setCategory] = useState([]);
  const [itemService, setItemService] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const [qtyTypes, setQtyTypes] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  const productId = parseInt(id, 10);

  //Fetching the product details from the database
  useEffect(() => {
    console.log(id);
    const fetchProduct = () => {
      axiosClient
        .get(`/product/single/${productId}`)
        .then((res) => {
          setEditedProduct(res.data);
          setSelectedType(res.data.Type);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchProduct();
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axiosClient.get(
          `product/category/${user.branch}`
        );
        setCategory(
          response.data.map((category) => ({
            value: category.idItem_Category,
            label: category.Description,
            type: category.Type,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategory();
  }, [selectedType]);

  const filteredCategories = category.filter(
    (cat) => cat.type === selectedType
  );

  useEffect(() => {
    setItemService(selectedType === "2");
  }, [selectedType]);

  useEffect(() => {
    const getQtyTypes = () => {
      axiosClient
        .get(`/quantity-types`)
        .then((res) => {
          let data = res.data;
          const qtyOptions = data.map((type) => ({
            value: type.idQuantity_Type,
            label: type.Description,
          }));
          setQtyTypes(qtyOptions);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getQtyTypes();
  }, []);

  const validate = (data) => {
    setSubmitting(true);
    const errors = {};
    if (!data.Item_Category_idItem_Category) {
      errors.Item_Category_idItem_Category = "Category is required.";
    }
    if (!data.Description) {
      errors.Description = "Product name is required.";
    }
    if (!data.Cost) {
      errors.Cost = "Cost is required.";
    } else if (!/^\d+(.\d+)?$/.test(data.Cost)) {
      errors.Cost = "Cost must be a number.";
    }
    if (!data.Rate) {
      errors.Rate = "Rate is required.";
    } else if (!/^\d+(.\d+)?$/.test(data.Rate)) {
      errors.Rate = "Rate must be a number.";
    }
    return errors;
  };

  const handleEdit = (e) => {
    e.preventDefault();
    const validationErrors = validate(editedProduct);
    if (Object.keys(validationErrors).length === 0) {
      setSubmitting(true);
      const extendedProductArray = {
        ...editedProduct,
        User_idUser: user.userId,
        Branch_idBranch: user.branch,
      };
      axiosClient
        .put(`product/${editedProduct.idItem}`, extendedProductArray)
        .then(() => {
          navigate("/products");
          toast.success("Product edited successfully !");
        })
        .catch((error) => {
          setSubmitting(false);
          console.error(error);
          toast.error("Failed to edit Product. Please try again.");
        });
      setSubmitting(false);
    } else {
      setSubmitting(false);
      setErrors(validationErrors);
      let errorMessage = "";
      Object.values(validationErrors).forEach((error) => {
        errorMessage += `${error}\n`;
      });
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: errorMessage,
        allowOutsideClick: false,
      });
    }
  };

  const handleChange = (name, value) => {
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  const handleSelectChange = (name, value) => {
    setEditedProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCategoryChange = (selectedOption) => {
    handleSelectChange("Item_Category_idItem_Category", selectedOption.value);
  };

  const handleQtyTypeChange = (selectedOption) => {
    handleSelectChange("Qty_Type", selectedOption.value);
  };

  const handleItemHasSerialChange = (selectedOption) => {
    setEditedProduct({
      ...editedProduct,
      Item_Has_Serial: selectedOption.value,
    });
    setErrors({
      ...errors,
      Item_Has_Serial: "",
    });
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

  const itemHasSerialOptions = [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" },
  ];

  return (
    <>
      <section className="pb-12 mt-8">
        <div className="w-full bg-white rounded-[15px] md:px-[30px] px-[4%] pt-[20px] pb-[40px]">
          <div className="flex items-center gap-4">
            <AddCustomerIcon />
            <span className="font-poppins font-medium text-[16px] md:text-[22px] leading-8 md:leading-[30px] text-[#64728C] mt-1">
              Edit Product
            </span>
          </div>
          <form onSubmit={handleEdit}>
            <div className="flex flex-col items-start w-full gap-3 mt-6 md:flex-row md:gap-20 md:mt-10">
              <div className="md:w-[30%] w-full">
                <p className="font-poppins text-[14px] md:text-[16px] leading-[24px] font-medium text-[#64728C]">
                  Product Name*
                </p>
                <input
                  name="Description"
                  type="text"
                  className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-medium font-poppins"
                  value={editedProduct.Description}
                  onChange={(e) => handleChange("Description", e.target.value)}
                  placeholder="Type here...."
                />
                {errors.Description && (
                  <p className="pt-1 text-xs font-medium text-red-500 font-inter">
                    {errors.Description}
                  </p>
                )}
              </div>
              <div className="md:w-[30%] w-full mb-3">
                <div className="w-full">
                  <p className="font-poppins text-[14px] md:text-[16px] leading-[24px] font-medium text-[#64728C]">
                    Item Category*
                  </p>
                  <Select
                    className="basic-single text-[14px] mt-2"
                    classNamePrefix="select"
                    isSearchable={true}
                    name="Item_Category_idItem_Category"
                    options={filteredCategories}
                    styles={customSelectStyles}
                    value={filteredCategories.filter(
                      (cat) =>
                        cat.value ===
                        editedProduct.Item_Category_idItem_Category
                    )}
                    onChange={handleCategoryChange}
                  />
                  {errors.Item_Category_idItem_Category && (
                    <p className="pt-1 text-xs font-medium text-red-500 font-inter">
                      {errors.Item_Category_idItem_Category}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {itemService && (
              <div className="flex flex-col items-start w-full gap-3 mt-5 md:flex-row md:gap-20 md:mt-8">
                <div className="w-[30%]">
                  <p className="font-poppins text-[14px] md:text-[16px] leading-[24px] font-medium text-[#64728C]">
                    Long Description
                  </p>
                  <input
                    name="Long_Description"
                    type="text"
                    className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-medium font-poppins"
                    value={editedProduct.Long_Description}
                    onChange={(e) =>
                      handleChange("Long_Description", e.target.value)
                    }
                    placeholder="Type here...."
                  />
                  {errors.Long_Description && (
                    <p className="pt-1 text-xs font-medium text-red-500 font-inter">
                      {errors.Long_Description}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-col items-start w-full gap-3 mt-6 md:flex-row md:gap-20 md:mt-8">
              <div className="md:w-[30%] w-full">
                <p className="font-poppins text-[14px] md:text-[16px] leading-[24px] font-medium text-[#64728C]">
                  Cost*
                </p>
                <input
                  name="Cost"
                  type="text"
                  className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-medium font-poppins"
                  value={editedProduct.Cost}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const isNumericInput = /^[0-9.]*$/.test(inputValue);
                    const decimalIndex = inputValue.indexOf(".");
                    const hasDecimal = decimalIndex !== -1;

                    if (isNumericInput || inputValue === "") {
                      if (hasDecimal && inputValue.length - decimalIndex > 3) {
                        return;
                      }
                      handleChange(e.target.name, inputValue);
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        Cost: "",
                      }));
                    } else {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        Cost: "Please enter only numeric values.",
                      }));
                    }
                  }}
                />
                {errors.Cost && (
                  <p className="pt-1 text-xs font-medium text-red-500 font-inter">
                    {errors.Cost}
                  </p>
                )}
              </div>
              <div className="md:w-[30%] w-full">
                <p className="font-poppins text-[14px] md:text-[16px] leading-[24px] font-medium text-[#64728C]">
                  Rate*
                </p>
                <input
                  name="Rate"
                  type="text"
                  className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-medium font-poppins"
                  value={editedProduct.Rate}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const isNumericInput = /^[0-9.]*$/.test(inputValue);
                    const decimalIndex = inputValue.indexOf(".");
                    const hasDecimal = decimalIndex !== -1;

                    if (isNumericInput || inputValue === "") {
                      if (hasDecimal && inputValue.length - decimalIndex > 3) {
                        return;
                      }
                      handleChange(e.target.name, inputValue);
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        Rate: "",
                      }));
                    } else {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        Rate: "Please enter only numeric values.",
                      }));
                    }
                  }}
                />
                {errors.Rate && (
                  <p className="pt-1 text-xs font-medium text-red-500 font-inter">
                    {errors.Rate}
                  </p>
                )}
              </div>
            </div>
            {selectedType !== "2" && (
              <div className="flex flex-col items-start w-full gap-3 mt-6 md:flex-row md:gap-20 md:mt-8">
                <div className="md:w-[30%] w-full">
                  <p className="font-poppins text-[14px] md:text-[16px] leading-[24px] font-medium text-[#64728C]">
                    Quantity Type*
                  </p>
                  <Select
                    name="Qty_Type"
                    options={qtyTypes}
                    value={qtyTypes.find(
                      (option) => option.value === editedProduct.Qty_Type
                    )}
                    onChange={handleQtyTypeChange}
                    classNamePrefix="react-select"
                  />
                  {errors.Qty_Type && (
                    <p className="pt-1 text-xs font-medium text-red-500 font-inter">
                      {errors.Qty_Type}
                    </p>
                  )}
                </div>
                <div className="md:w-[30%] w-full mt-5 md:mt-0">
                  <p className="font-poppins text-[14px] md:text-[16px] leading-[24px] font-medium text-[#64728C]">
                    Item has Serial Number
                  </p>
                  <Select
                    className="basic-single text-[14px]"
                    classNamePrefix="select"
                    name="Item_Has_Serial"
                    options={itemHasSerialOptions}
                    styles={customSelectStyles}
                    value={itemHasSerialOptions.filter(
                      (serial) => serial.value === editedProduct.Item_Has_Serial
                    )}
                    onChange={handleItemHasSerialChange}
                  />
                  {errors.Item_Has_Serial && (
                    <p className="pt-1 text-xs font-medium text-red-500 font-inter">
                      {errors.Item_Has_Serial}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="font-poppins font-normal text-[12px] leading-[18px] text-[#64728C] text-opacity-70 md:mt-8 mt-5">
              *Required Filed
            </div>
            <div className="flex justify-end gap-5 md:mt-0 mt-7">
              <button
                className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] flex items-center justify-center gap-2 text-[#10275E] hover:opacity-80"
                type="submit"
                disabled={submitting}
              >
                {submitting && <ProcessingIcon />}
                Save
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
