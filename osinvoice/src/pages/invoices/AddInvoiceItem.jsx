import { useEffect, useState } from "react";
import Select from "react-select";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Card,
  Typography,
  Radio,
} from "@material-tailwind/react";
import { CloseIcon, DeleteIcon, RemoveIcon } from "../../utils/icons";
import { ItemCategoryModal } from "../products/ItemCategoryModal";
import Swal from "sweetalert2";
import axiosClient from "../../../axios-client";

export const AddInvoiceItem = ({
  handleOpen,
  open,
  isSearchable,
  handleItem,
  invoicePackages,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [errors, setErrors] = useState({});

  const [discountChangedToAmount, setDiscountChangedToAmount] = useState(false);

  const [itemData, setItemData] = useState({
    Item_idItem: 0,
    Item_Description: 0,
    Qty: 1,
    Discount: 0,
    Amount: 0,
    Rate: 0,
    Total_Amount: 0,
    Discount_Type: "percentage",
    Item_Has_Serial: 0,
  });

  const [itemSerials, setItemSerials] = useState([]);
  const [selectedSerials, setSelectedSerials] = useState([]);
  const [newSerialInputs, setNewSerialInputs] = useState([]);
  const [newSerialOptions, setNewSerialOptions] = useState([]);
  const [itemSerialOptions, setItemSerialOptions] = useState([]);
  const [newSerialInputValue, setNewSerialInputValue] = useState("");
  const [isNewSerialInputVisible, setIsNewSerialInputVisible] = useState(false);

  useEffect(() => {
    let totalAmount = 1 * invoicePackages[0]?.value.Rate;
    setItemData({
      ...itemData,
      Item_idItem: invoicePackages[0]?.value.idItem,
      Item_Name: invoicePackages[0]?.value.Description,
      Rate: invoicePackages[0]?.value.Rate,
      Type: invoicePackages[0]?.value.Type,
      Amount: totalAmount,
      Discount_Type: "percentage",
      Total_Amount: totalAmount,
    });
  }, [invoicePackages]);

  const fetchSerialNumbers = async (itemId) => {
    try {
      const res = await axiosClient.get(
        `invoice/get-invoice-item-serials/${itemId}`
      );
      setItemSerials(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setItemSerialOptions(
      itemSerials.map((itemSerial) => ({
        value: itemSerial.ID,
        label: `${itemSerial.Serial_No}`,
        exists: 1,
      }))
    );
  }, [itemSerials]);

  const handleItemSelect = (selectedOption) => {
    setItemSerials([]);
    setSelectedItem(selectedOption.value);
    let totalAmount = itemData.Qty * selectedOption.value.Rate;
    setItemData({
      ...itemData,
      Item_idItem: selectedOption.value.idItem,
      Item_Name: selectedOption.value.Description,
      Rate: selectedOption.value.Rate,
      Amount: totalAmount,
      Type: selectedOption.value.Type,
      Serial_No: selectedOption.value.Item_Has_Serial,
      Qty: selectedOption.value.Item_Has_Serial === 1 ? 0 : 1,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      Item_idItem: "",
    }));
    if (selectedOption.value.Item_Has_Serial === 1) {
      fetchSerialNumbers(selectedOption.value.idItem);
    }
  };

  const handleQtyChange = (Qty) => {
    setItemData({
      ...itemData,
      Qty: Qty,
    });
  };

  const handleRateChange = (Rate) => {
    setItemData({
      ...itemData,
      Rate: Rate,
    });
  };

  useEffect(() => {
    const handleAmount = () => {
      let sub_total = itemData.Qty * itemData.Rate;
      let total = 0;
      {
        !discountChangedToAmount
          ? (total = sub_total - (sub_total * itemData.Discount) / 100)
          : (total = sub_total - itemData.Discount);
      }
      if (!isNaN(total)) {
        setItemData({
          ...itemData,
          Total_Amount: total,
          Amount: sub_total,
        });
      } else {
        setItemData({
          ...itemData,
          Total_Amount: 0,
          Amount: 0,
        });
      }
    };
    handleAmount();
  }, [itemData.Qty, itemData.Rate, , itemData.Discount]);

  const handleAddItem = () => {
    let finalSelectedSerials = [];
    let newNewSerials = [];
    if (itemData.Serial_No === 1 && selectedSerials.length > 0) {
      finalSelectedSerials = selectedSerials.map((serial) => {
        return {
          ...serial,
          Serial_No: serial.label,
        };
      });
    }
    if (itemData.Serial_No === 1 && newSerialOptions.length > 0) {
      newNewSerials = newSerialOptions.map((serial) => {
        return {
          ...serial,
          Serial_No: serial.label,
        };
      });
    }
    const finalSerials = finalSelectedSerials.concat(newNewSerials);

    const errors = {};
    if (!itemData.Item_idItem) {
      errors.Item_idItem = "Items is required.";
    }

    if (itemData.Serial_No == 0) {
      if (!itemData.Qty || itemData.Qty <= 0) {
        errors.Qty = "Quantity is required.";
      } else if (!/^\d+(.\d+)?$/.test(itemData.Qty)) {
        errors.Qty = "Quantity must be a number.";
      }
    }

    if (itemData.Serial_No == 1) {
      if (finalSerials.length <= 0) {
        errors.Qty = "Items cannot be empty.";
      }
    }

    if (!itemData.Rate) {
      errors.Rate = "Rate is required.";
    } else if (!/^\d+(.\d+)?$/.test(itemData.Rate)) {
      errors.Rate = "Rate must be a number.";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
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
      return;
    }

    let data = {
      Item_idItem: itemData.Item_idItem,
      Qty: itemData.Serial_No === 1 ? finalSerials.length : itemData.Qty,
      Amount: parseFloat(itemData.Amount),
      Discount: parseFloat(itemData.Discount),
      Discount_Type: itemData.Discount_Type,
      Total_Amount:
        itemData.Serial_No === 1
          ? itemData.Discount_Type === "amount"
            ? finalSerials.length * itemData.Rate -
              parseFloat(itemData.Discount)
            : finalSerials.length *
              itemData.Rate *
              (1 - parseFloat(itemData.Discount) / 100)
          : itemData.Total_Amount,
      Rate: itemData.Rate,
      Item_Name: itemData.Item_Name,
      Serial_No: itemData.Serial_No,
      Item_Type: itemData.Type,
      SelectedSerials: finalSerials,
    };
    handleItem(data);
    handleClose();
  };

  const handleClose = () => {
    setErrors({});
    setItemData({
      Item_idItem: 0,
      Qty: 1,
      Amount: 0,
      Discount: 0,
      Rate: 0,
      Total_Amount: 0,
      Discount_Type: "percentage",
    });
    setDiscountChangedToAmount(false);
    setSelectedSerials([]);
    setNewSerialInputs([]);
    setItemSerialOptions([]);
    setNewSerialOptions([]);
    setNewSerialInputValue("");
    setIsNewSerialInputVisible(false);
    -handleOpen();
  };

  const handleAddNewSerialInput = () => {
    if (!isNewSerialInputVisible) {
      setIsNewSerialInputVisible(true);
      setNewSerialInputs([""]);
    }
  };

  const handleSerialItemSelect = (selectedOption) => {
    setSelectedSerials([...selectedSerials, selectedOption]);
    setItemSerialOptions(
      itemSerialOptions.filter(
        (option) => option.value !== selectedOption.value
      )
    );
  };

  const handleRemoveSerialItem = (removeItem) => {
    if (removeItem.exists === 1) {
      setSelectedSerials(
        selectedSerials.filter((item) => item.value !== removeItem.value)
      );
      setItemSerialOptions([...itemSerialOptions, removeItem]);
    } else {
      setNewSerialOptions(
        newSerialOptions.filter((item) => item.value !== removeItem.value)
      );
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

  const handleNewSerialInputChange = (value) => {
    if (value.trim() === "") {
      errors.newSerial = "Input value cannot be empty";
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: errors.newSerial,
        allowOutsideClick: false,
      });
      return;
    }
    const uniqueID = `A${newSerialOptions.length + 1}`;
    setNewSerialOptions([
      ...newSerialOptions,
      { value: uniqueID, label: value, exists: 0 },
    ]);
  };

  return (
    <>
      <Dialog
        size="xs"
        open={open}
        handler={handleClose}
        className="bg-transparent shadow-none rounded-[10px] overflow-y-scroll scrollbar-hide overflow-x-hidden font-poppins"
      >
        <div className="mx-auto w-full rounded-sm max-w-[100%] h-[4/5] bg-white">
          <DialogHeader className="w-full flex justify-between align-center border-b border-[#64728C] border-opacity-15 p-0 items-center pb-4 px-5 pt-5">
            <div className="font-poppins text-[16px] md:text-[20px] font-medium leading-8 md:leading-[30px] text-[#64728C]">
              Add Product or Service
            </div>
            <div
              className="font-bold text-[20px] cursor-pointer"
              onClick={handleClose}
            >
              <CloseIcon />
            </div>
          </DialogHeader>
          <DialogBody className="mb-1 flex flex-col gap-3 relative p-0 overflow-y-scroll px-7 pb-5 max-h-[500px]">
            <div className=" flex flex-col w-full md:gap-[2%] flex-wrap ">
              <div className="mt-3 ">
                <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
                  Product or Service
                </h3>
                <Select
                  className="basic-single w-full text-[14px]"
                  classNamePrefix="select"
                  defaultValue="Select Items"
                  isSearchable={isSearchable}
                  name="Item_idItem"
                  options={invoicePackages}
                  onChange={handleItemSelect}
                  styles={customSelectStyles}
                />
                {errors.Item_idItem && (
                  <p className="pt-1 text-xs font-medium text-red-500 font-poppins">
                    {errors.Item_idItem}
                  </p>
                )}
              </div>
              {itemData.Serial_No === 1 ? (
                <div className="mb-1 font-normal font-inter">
                  <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C] mt-3">
                    Available Serial Numbers
                  </h3>
                  <Select
                    className="basic-single w-full text-[14px]"
                    classNamePrefix="select"
                    defaultValue={itemSerialOptions[0]}
                    isSearchable={isSearchable}
                    name="Item_idItem"
                    options={itemSerialOptions}
                    onChange={handleSerialItemSelect}
                    styles={customSelectStyles}
                  />
                  {isNewSerialInputVisible ? (
                    <div className="mt-2">
                      <button className="text-grey-400 text-[15px] mt-2">
                        Add new Serial Number
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <button
                        className="text-blue-500 hover:underline cursor-pointer mt-2 font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2"
                        onClick={handleAddNewSerialInput}
                      >
                        Add new Serial Number
                      </button>
                    </div>
                  )}
                  {newSerialInputs.map((serial, index) => (
                    <div key={index} className="flex items-center">
                      <div key={index} className="relative flex items-center">
                        <div className="mb-2 input-container">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Enter serial number"
                              className="block rounded-[15px] border-0 py-2 pl-3 pr-16 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                              value={newSerialInputValue}
                              onChange={(e) =>
                                setNewSerialInputValue(e.target.value)
                              }
                            />
                            <button
                              className="absolute top-0 right-0 h-[100%] px-3 flex items-center bg-gray-200 rounded-r-[15px] border-l border-gray-300 focus:outline-none font-poppins"
                              onClick={() => {
                                handleNewSerialInputChange(newSerialInputValue);
                                setNewSerialInputValue("");
                              }}
                            >
                              Add
                            </button>
                          </div>
                          {errors.newSerial && (
                            <Typography className="text-xs font-medium text-red-500 font-inter">
                              {errors.newSerial}
                            </Typography>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div>
                    <h3 className="font-poppins font-medium text-[10px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C] mt-3">
                      All serial numbers added
                    </h3>
                    <table className="font-inter text-[14px] mt-2">
                      {selectedSerials.length > 0 ||
                      newSerialOptions.length > 0 ? (
                        <thead>
                          <tr className="border-[0.5px] border-gray-300">
                            <th className="border-r px-5 border-gray-300 text-left font-poppins font-medium text-[10px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C] mt-3">
                              Serial Number
                            </th>
                            <th className="border-[0.5px] border-gray-300 px-5 text-left font-poppins font-medium text-[10px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C] mt-3">
                              Action
                            </th>
                          </tr>
                        </thead>
                      ) : (
                        <h3 className="font-poppins font-medium text-[10px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C] mt-3">
                          No serial numbers were added
                        </h3>
                      )}
                      <tbody>
                        {selectedSerials.map((serial, index) => {
                          return (
                            <tr className="border-[0.5px] border-gray-300 py-2 px-5">
                              <td
                                key={serial.value}
                                className="border-r px-5 border-gray-300 font-poppins font-medium text-[10px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C] mt-3"
                              >
                                {serial.label}
                              </td>
                              <td className="px-5 border-r border-gray-300">
                                <button
                                  onClick={() => handleRemoveSerialItem(serial)}
                                >
                                  <DeleteIcon />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {newSerialOptions.map((serial, index) => {
                          return (
                            <tr className="border-[0.5px] border-gray-300 py-2 px-5 font-poppins font-medium text-[10px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C] mt-3">
                              <td
                                key={serial.value}
                                className="border-r px-5 border-gray-300 font-poppins font-medium text-[10px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C] mt-3"
                              >
                                {serial.label}
                              </td>
                              <td className="flex items-center justify-center px-5 border-r border-gray-300">
                                <button
                                  onClick={() => handleRemoveSerialItem(serial)}
                                >
                                  <RemoveIcon />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="w-full mt-3">
                  <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
                    Quantity
                  </h3>
                  <input
                    name="Qty"
                    type="text"
                    className="block rounded-[15px] focus:outline-[#bdbdbd]  border-0 py-2 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                    value={itemData.Qty}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const isNumericInput = /^\d*\.?\d*$/.test(inputValue);

                      if (isNumericInput || inputValue === "") {
                        handleQtyChange(inputValue); // Assuming handleRateChange is a function that handles rate changes
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          Qty: "",
                        }));
                      } else {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          Qty: "Please enter only numeric values with decimal places.",
                        }));
                      }
                    }}
                  />
                  {errors.Qty && (
                    <p className="pt-1 text-xs font-medium text-red-500 font-poppins">
                      {errors.Qty}
                    </p>
                  )}
                </div>
              )}
              <div className="w-full mt-3">
                <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
                  Rate
                </h3>
                <input
                  name="Rate"
                  type="text"
                  pattern="\d*\.?\d*"
                  className="block rounded-[15px] focus:outline-[#bdbdbd]  border-0 py-2 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                  disabled={itemData.Type == 1}
                  value={itemData.Rate}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const isNumericInput = /^\d*\.?\d*$/.test(inputValue);
                    const decimalIndex = inputValue.indexOf(".");
                    const hasDecimal = decimalIndex !== -1;

                    if (isNumericInput || inputValue === "") {
                      if (hasDecimal && inputValue.length - decimalIndex > 3) {
                        // Allow only two digits after the decimal point
                        return;
                      }

                      handleRateChange(inputValue); // Assuming handleRateChange is a function that handles rate changes
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        Rate: "",
                      }));
                    } else {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        Rate: "Please enter only numeric values with decimal places.",
                      }));
                    }
                  }}
                />
                {errors.Rate && (
                  <p className="pt-1 text-xs font-medium text-red-500 font-poppins">
                    {errors.Rate}
                  </p>
                )}
              </div>
              <div className="w-full mt-3">
                <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
                  Discount
                </h3>
                <div className="flex gap-3">
                  <Radio
                    color= "blue-gray" 
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
                    color= "blue-gray" 
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
                    className="block rounded-[15px] focus:outline-[#bdbdbd] border-0 py-2 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                    value={itemData.Discount}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (
                        (/^\d*\.?\d{0,2}$/.test(inputValue) &&
                          parseInt(inputValue) <= 100) ||
                        inputValue === ""
                      ) {
                        handleDiscountChange(inputValue);
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
                        handleDiscountChange(inputValue);
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
                  <p className="pt-1 text-xs font-medium text-red-500 font-poppins">
                    {errors.Discount}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddItem}
                className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] hover:opacity-80 text-[#10275E]"
              >
                Add Item
              </button>
            </div>
          </DialogBody>
          <DialogFooter></DialogFooter>
        </div>
      </Dialog>
    </>
  );
};
