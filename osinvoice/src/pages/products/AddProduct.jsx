import React, { useState, useEffect } from "react";
import axiosClient from "../../../axios-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProcessingIcon, AddCustomerIcon } from "../../utils/icons";
import Select from "react-select";
import { product_type } from "../../utils/dataArrays";
import { useStateContext } from "../../contexts/NavigationContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const AddProduct = () => {
  const { user } = useStateContext();
  const navigate = useNavigate();

  const Type = product_type.map((item) => ({
    value: item.id,
    label: item.key,
  }));

  const [selectedType, setSelectedType] = useState(null);
  const [category, setCategory] = useState([]);
  const [showLongDescription, setShowLongDescription] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  useEffect(() => {
    const getQtyTypes = () => {
      axiosClient
        .get(`/quantity-types`)
        .then((res) => {
          let data = res.data;
          const qtyOptions = data.map((type) => ({
            value: type,
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

  const filteredCategories = category.filter(
    (cat) => cat.type === selectedType
  );

  useEffect(() => {
    setShowLongDescription(selectedType === "2");
  }, [selectedType]);

  const initialFormData = {
    Type: "",
    Item_Category_idItem_Category: "",
    Description: "",
    Long_Description: "",
    Cost: "",
    Rate: "",
    Qty_Type: "",
    Item_Has_Serial: "",
    Branch_idBranch: user.branch,
    User_idUser: user.userId,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [qtyTypes, setQtyTypes] = useState([]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (name === "Description") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        Description: "",
      }));
    }
  };

  const handleTypeChange = (selectedOption) => {
    let Qty_Type = "";
    if (selectedOption.value === "2") {
      Qty_Type = 0;
    } else {
      Qty_Type = formData.Qty_Type;
    }
    setFormData({
      ...formData,
      Type: selectedOption.value,
      Qty_Type: Qty_Type,
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      Type: "",
    }));
  };

  const handleItemCategoryChange = (selectedOption) => {
    setFormData({
      ...formData,
      Item_Category_idItem_Category: selectedOption.value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      Item_Category_idItem_Category: "",
    }));
  };

  const handleQtyTypeChange = (selectedOption) => {
    setFormData({
      ...formData,
      Qty_Type: selectedOption.value.idQuantity_Type,
    });
    setErrors({
      ...errors,
      Qty_Type: "",
    });
  };

  const handleItemHasSerialChange = (selectedOption) => {
    setFormData({
      ...formData,
      Item_Has_Serial: selectedOption.value,
    });
    setErrors({
      ...errors,
      Item_Has_Serial: "",
    });
  };

  const handleSubmit = async (event) => {
    console.log(formData);
    event.preventDefault();
    const errors = {};

    if (!formData.Type) {
      errors.Type = "Type is required.";
    }
    if (!formData.Item_Category_idItem_Category) {
      errors.Item_Category_idItem_Category = "Category is required.";
    }
    if (!formData.Description) {
      errors.Description = "Product name is required.";
    }

    if (!formData.Cost) {
      errors.Cost = "Cost is required.";
    } else if (!/^\d+(.\d+)?$/.test(formData.Cost)) {
      errors.Cost = "Cost must be a number.";
    }
    if (!formData.Rate) {
      errors.Rate = "Rate is required.";
    } else if (!/^\d+(.\d+)?$/.test(formData.Rate)) {
      errors.Rate = "Rate must be a number.";
    }
    if (formData.Qty_Type === "") {
      errors.Qty_Type = "Qty Type is required.";
    }
    if (formData.Type == 1 && formData.Item_Has_Serial === "") {
      errors.Item_Has_Serial = "Item has Serial Number is required.";
    }

    if (Object.keys(errors).length > 0) {
      let errorMessage = "";
      Object.values(errors).forEach((error) => {
        errorMessage += `${error}\n`;
      });
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: errorMessage,
        allowOutsideClick: false,
      });
      setErrors(errors);
      return;
    }
    try {
      setSubmitting(true);
      const Branch_idBranch = user.branch;
      const response = await axiosClient.post("/product", {
        ...formData,
        Branch_idBranch: Branch_idBranch,
      });
      setSubmitting(false);
      navigate("/products");
      toast.success("Product added successfully !");
      setFormData(initialFormData);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      toast.error("Failed to add Product. Please try again.");
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
              New Product
            </span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-start w-full gap-3 mt-6 md:flex-row md:gap-20 md:mt-10">
              <div className="md:w-[30%] w-full mb-3">
                <div className="w-full">
                  <p className="font-poppins text-[14px] md:text-[16px] leading-[24px] font-medium text-[#64728C]">
                    Product Type*
                  </p>
                  <Select
                    className="basic-single text-[14px] mt-2"
                    classNamePrefix="select"
                    isSearchable={true}
                    name="color"
                    options={Type}
                    styles={customSelectStyles}
                    value={Type.find(
                      (option) => option.value === formData.Type
                    )}
                    onChange={(selectedOption) => {
                      handleTypeChange(selectedOption);
                      setSelectedType(selectedOption.value);
                    }}
                  />
                  {errors.Type && (
                    <p className="pt-1 text-xs font-medium text-red-500 font-inter">
                      {errors.Type}
                    </p>
                  )}
                </div>
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
                    value={filteredCategories.find(
                      (option) =>
                        option.value === formData.Item_Category_idItem_Category
                    )}
                    onChange={handleItemCategoryChange}
                  />
                  {errors.Item_Category_idItem_Category && (
                    <p className="pt-1 text-xs font-medium text-red-500 font-inter">
                      {errors.Item_Category_idItem_Category}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start w-full gap-3 mt-5 md:flex-row md:gap-20 md:mt-8">
              <div className="md:w-[30%] w-full">
                <p className="font-poppins text-[14px] md:text-[16px] leading-[24px] font-medium text-[#64728C]">
                  Product Name*
                </p>
                <input
                  name="Description"
                  type="text"
                  className="block rounded-[15px] focus:outline-[#bdbdbd] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-medium font-poppins"
                  value={formData.Description}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  placeholder="Type here...."
                />
                {errors.Description && (
                  <p className="pt-1 text-xs font-medium text-red-500 font-inter">
                    {errors.Description}
                  </p>
                )}
              </div>
              {showLongDescription && (
                <div className="w-[30%]">
                  <p className="font-poppins text-[14px] md:text-[16px] leading-[24px] font-medium text-[#64728C]">
                    Long Description
                  </p>
                  <input
                    name="Long_Description"
                    type="text"
                    className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-medium font-poppins"
                    value={formData.Long_Description}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                    placeholder="Type here...."
                  />
                  {errors.Long_Description && (
                    <p className="pt-1 text-xs font-medium text-red-500 font-inter">
                      {errors.Long_Description}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col items-start w-full gap-3 mt-6 md:flex-row md:gap-20 md:mt-8">
              <div className="md:w-[30%] w-full">
                <p className="font-poppins text-[14px] md:text-[16px] leading-[24px] font-medium text-[#64728C]">
                  Cost*
                </p>
                <input
                  name="Cost"
                  type="text"
                  className="block rounded-[15px] focus:outline-[#bdbdbd] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-medium font-poppins"
                  value={formData.Cost}
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
                  className="block rounded-[15px] focus:outline-[#bdbdbd] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-medium font-poppins"
                  value={formData.Rate}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const isNumericInput = /^[0-9.]*$/.test(inputValue);
                    const decimalIndex = inputValue.indexOf(".");
                    const hasDecimal = decimalIndex !== -1;

                    if (isNumericInput || inputValue === "") {
                      if (hasDecimal && inputValue.length - decimalIndex > 3) {
                        // Allow only two digits after the decimal point
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
                    onChange={handleQtyTypeChange}
                    classNamePrefix="react-select"
                    styles={customSelectStyles}
                    className="mt-2"
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
                    className="basic-single text-[14px] mt-2"
                    classNamePrefix="select"
                    name="Item_Has_Serial"
                    options={itemHasSerialOptions}
                    styles={customSelectStyles}
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
                className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] text-[#10275E] hover:opacity-80"
                type="button"
                onClick={() => {
                  setFormData(initialFormData);
                }}
              >
                Cancel
              </button>
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
      <ToastContainer autoClose={1500} />
    </>
  );
};
