import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Dialog, Card, Typography, Radio } from "@material-tailwind/react";
import { CloseIcon } from "../../utils/icons";
import Swal from "sweetalert2";

export const AddGRNItem = ({
  handleOpen,
  open,
  isSearchable,
  handleItem,
  items,
  itemData,
  setItemData,
}) => {
  const [errors, setErrors] = useState({});
  const [discountChangedToAmount, setDiscountChangedToAmount] = useState(false);

  // Event handler for item selection
  const handleItemSelect = (selectedOption) => {
    const selectedItem = selectedOption.value;
    setItemData({
      ...itemData,
      Item_idItem: selectedItem.idItem,
      Item_Description: selectedItem.Description,
      Cost: selectedItem.Cost,
      Item_Has_Serial: selectedItem.Item_Has_Serial,
      Discount_Type: "percentage",
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      Item_idItem: "",
    }));
  };

  useEffect(() => {
    const handleAmount = () => {
      let sub_total = itemData.Qty * itemData.Cost;
      let total;
      if (itemData.Discount_Type === "amount") {
        total = sub_total - itemData.Discount;
      } else {
        total = sub_total - (sub_total * itemData.Discount) / 100;
      }
      if (!isNaN(total)) {
        setItemData({
          ...itemData,
          Sub_Total: sub_total,
          Total: total,
        });
      } else {
        setItemData({
          ...itemData,
          Sub_Total: 0,
          Total: 0,
        });
      }
    };
    handleAmount();
  }, [itemData.Qty, itemData.Cost, itemData.Discount, itemData.Discount_Type]);

  const validate = (data) => {
    const errors = {};
    if (data.Item_idItem === 0) {
      errors.Item_idItem = "Select an Item.";
    }
    if (data.Qty == 0) {
      errors.Qty = "Enter a Quantity.";
    }
    if (data.Cost == 0) {
      errors.Cost = "Enter a Cost.";
    }
    return errors;
  };

  // Event handler for adding an item
  const handleAddItem = () => {
    const validateErrors = validate(itemData);
    setErrors(validateErrors);
    if (Object.keys(validateErrors).length === 0) {
      // Add item and close the dialog

      let data = {
        Item_idItem: itemData.Item_idItem,
        Item_Description: itemData.Item_Description,
        Cost: parseFloat(itemData.Cost),
        Qty: parseFloat(itemData.Qty),
        Total: itemData.Total,
        Discount_Type: itemData.Discount_Type,
        Discount: itemData.Discount,
        Sub_Total: itemData.Sub_Total,
        Item_Has_Serial: itemData.Item_Has_Serial,
      };
      setItemData({});
      handleItem(data);
      handleClose();
    } else {
      let errorMessage = "";
      Object.values(validateErrors).forEach((error) => {
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

  // Event handler for closing the dialog
  const handleClose = () => {
    setErrors({});
    setItemData({
      Item_idItem: 0,
      Item_Description: "",
      Cost: 0,
      Qty: 1,
      Total: 0,
      Discount: 0,
      Sub_Total: 0,
    });
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
      <Dialog
        size="xs"
        open={open}
        className="bg-white shadow-none overflow-scroll scrollbar-hide font-poppins rounded-[10px]"
      >
        <Card className="mx-auto w-full p-5 rounded-sm max-w-[100%] ">
          <div className="flex justify-between align-center">
            <div className="font-poppins text-[16px] leading-6 font-medium pb-3 text-[#64728C]">
              Add Product
            </div>
            <div
              className="font-bold text-[20px] cursor-pointer"
              onClick={handleClose}
            >
              <CloseIcon />
            </div>
          </div>

          <div className="flex flex-col w-full gap-3 mt-5">
            <div className="w-fill">
              <Typography
                variant="small"
                color="black"
                className="font-poppins mb-2 font-medium text-[14px] leading-[18px] text-[#64728C]"
              >
                Product
              </Typography>
              <Select
                className="basic-single w-full text-[14px]"
                classNamePrefix="select"
                defaultValue="Select Items"
                isSearchable={isSearchable}
                name="item"
                options={items}
                onChange={handleItemSelect}
                styles={customSelectStyles}
              />
              {errors.Item_idItem && (
                <Typography className="pt-1 text-xs font-medium text-red-500 font-inter">
                  {errors.Item_idItem}
                </Typography>
              )}
            </div>
            <div className="flex flex-col w-fill">
              <Typography
                variant="small"
                color="black"
                className="font-poppins mb-2 font-medium text-[14px] leading-[18px] text-[#64728C]"
              >
                Quantity
              </Typography>
              <input
                name="qty"
                type="text"
                value={itemData.Qty}
                className="block rounded-[15px] focus:outline-[#bdbdbd] border-0 py-2 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (/^\d*\.?\d*$/.test(inputValue) || inputValue === "") {
                    setItemData({
                      ...itemData,
                      Qty: inputValue,
                    });
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      Qty: "",
                    }));
                  } else {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      Qty: "Please enter only numeric values.",
                    }));
                  }
                }}
              />

              {errors.Qty && (
                <Typography className="pt-1 text-xs font-medium text-red-500 font-inter">
                  {errors.Qty}
                </Typography>
              )}
            </div>
            <div className="w-fill">
              <Typography
                variant="small"
                color="black"
                className="font-poppins mb-2 font-medium text-[14px] leading-[18px] text-[#64728C]"
              >
                Cost
              </Typography>
              <input
                name="Cost"
                type="text"
                pattern="\d*\.?\d{0,2}"
                className="block rounded-[15px] focus:outline-[#bdbdbd] border-0 py-2 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                value={itemData.Cost}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (/^\d*\.?\d{0,2}$/.test(inputValue) || inputValue === "") {
                    let cost = 0;
                    if (!isNaN(inputValue)) {
                      cost = inputValue;
                    }
                    setItemData({
                      ...itemData,
                      Cost: cost,
                    });
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      Cost: "",
                    }));
                  } else {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      Cost: "Please enter only numeric values with up to two decimal places.",
                    }));
                  }
                }}
              />
              {errors.Cost && (
                <Typography className="pt-1 text-xs font-medium text-red-500 font-inter">
                  {errors.Cost}
                </Typography>
              )}
            </div>
            <div className="mb-5 w-fill">
              <Typography
                variant="small"
                color="black"
                className="font-poppins mb-2 font-medium text-[14px] leading-[18px] text-[#64728C]"
              >
                Discount (%)
              </Typography>
              <div className="flex gap-3">
                <Radio
                  name="Discount_Type"
                  value="percentage"
                  defaultChecked
                  onChange={() => {
                    setDiscountChangedToAmount(false);
                    setItemData({
                      ...itemData,
                      Discount_Type: "percentage",
                      Discount: 0,
                    });
                  }}
                  label={
                    <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
                      Percentage (%)
                    </h3>
                  }
                />
                <Radio
                  name="Discount_Type"
                  value="amount"
                  onChange={() => {
                    setDiscountChangedToAmount(true);
                    setItemData({
                      ...itemData,
                      Discount_Type: "amount",
                      Discount: 0,
                    });
                  }}
                  label={
                    <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
                      Amount (LKR)
                    </h3>
                  }
                />
              </div>
              {!discountChangedToAmount ? (
                <input
                  name="discount"
                  type="text"
                  pattern="\d*\.?\d*"
                  className="block rounded-[15px] border-0 py-2 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                  value={itemData.Discount}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (
                      (/^\d*\.?\d{0,2}$/.test(inputValue) &&
                        parseInt(inputValue) <= 100) ||
                      inputValue === ""
                    ) {
                      setItemData({
                        ...itemData,
                        Discount: inputValue,
                      });
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        Discount: "",
                      }));
                    } else {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        Discount:
                          "Please enter a valid discount value between 0 and 100",
                      }));
                    }
                  }}
                />
              ) : (
                <input
                  name="discount"
                  type="text"
                  pattern="\d*\.?\d*"
                  className="block rounded-[15px] border-0 py-2 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                  value={itemData.Discount}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (/^\d*\.?\d*$/.test(inputValue) || inputValue === "") {
                      setItemData({
                        ...itemData,
                        Discount: inputValue,
                      });
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        Discount: "",
                      }));
                    } else {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        Discount: "Please enter a valid numeric value",
                      }));
                    }
                  }}
                />
              )}
              {errors.Discount && (
                <p className="pt-1 text-xs font-medium text-red-500 font-inter">
                  {errors.Discount}
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <div className="flex gap-2">
                <Typography
                  variant="small"
                  color="black"
                  className="font-poppins mb-2 mt-2 font-medium text-[14px] leading-[18px] text-[#64728C]"
                >
                  LKR{" "}
                  {parseFloat(itemData.Total).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] hover:opacity-80 text-[#10275E]"
              >
                Add Item
              </button>
            </div>
          </div>
        </Card>
      </Dialog>
    </>
  );
};
