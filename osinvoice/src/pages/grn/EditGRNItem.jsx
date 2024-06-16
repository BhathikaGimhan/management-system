import React, { useState, useEffect } from "react";
import {
  Dialog,
  Radio,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { CloseIcon } from "../../utils/icons";

export const EditGRNItem = ({
  handleOpen,
  open,
  handleEditItem,
  editItem,
  setSelectedItem,
}) => {
  const [errors, setErrors] = useState({});
  const [viewUpdateSerialNumbers, setViewUpdateSerialNumbers] = useState(false);
  const [inputValues, setInputValues] = useState(editItem.Serial_No || [""]);
  const [discountTypeChangedToAmount, setDiscountTypeChangedToAmount] =
    useState(false);

  useEffect(() => {
    if (editItem.Item_Has_Serial === 1) {
      setInputValues(
        editItem.Serial_No.map((serial, index) => ({
          value: serial,
          isEditing: false,
          originalValue: serial,
          id: index,
        }))
      );
    }
  }, [editItem.Serial_No]);

  useEffect(() => {
    if (editItem.Discount_Type === "percentage") {
      setDiscountTypeChangedToAmount(false);
    } else if (editItem.Discount_Type === "amount") {
      setDiscountTypeChangedToAmount(true);
    }
  }, [editItem.Discount_Type]);

  useEffect(() => {
    const handleAmount = () => {
      let sub_total = editItem.Qty * editItem.Cost;
      let total = 0;
      discountTypeChangedToAmount
        ? (total = sub_total - editItem.Discount)
        : (total = sub_total - (sub_total * editItem.Discount) / 100);
      setSelectedItem({
        ...editItem,
        Sub_Total: sub_total,
        Total: total,
      });
    };
    handleAmount();
  }, [
    editItem.Qty,
    editItem.Cost,
    editItem.Discount,
    discountTypeChangedToAmount,
  ]);

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
    const validateErrors = validate(editItem);
    setErrors(validateErrors);

    // Initialize inputValues with an empty array if editItem.Item_Has_Serial is 0
    const serialNumbers =
      editItem.Item_Has_Serial === 1 ? editItem.Serial_No : [];
    const hasEmptySerialNumbers = serialNumbers.some(
      (serialObj) => serialObj.trim() === ""
    );

    if (Object.keys(validateErrors).length === 0) {
      if (hasEmptySerialNumbers) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          Serial_No: "Please enter all serial numbers.",
        }));
      } else {
        let data = {
          Item_idItem: editItem.Item_idItem,
          Item_Description: editItem.Item_Description,
          Cost: parseFloat(editItem.Cost),
          Qty: parseFloat(editItem.Qty),
          Total: editItem.Total,
          Discount: editItem.Discount,
          Old_discount: editItem.Old_discount,
          Sub_Total: editItem.Sub_Total,
          Serial_No: serialNumbers,
          Item_Has_Serial: editItem.Item_Has_Serial,
        };
        handleEditItem(data);
        handleClose();
      }
    }
  };

  // Event handler for closing the dialog
  const handleClose = () => {
    setViewUpdateSerialNumbers(false);
    setErrors({});
    handleOpen();
  };

  // Event handler for updating serial numbers
  const handleUpdateSerialNumbers = (updatedSerialNumbers) => {
    setSelectedItem({
      ...editItem,
      Serial_No: updatedSerialNumbers.map((serialObj) => serialObj.value),
    });
  };

  // Event handler for changing serial number input
  const handleSerialNumberChange = (index, newValue) => {
    const updatedSerialNumbers = [...inputValues];
    if (newValue !== "") {
      updatedSerialNumbers[index].value = newValue;
    }
    handleUpdateSerialNumbers(updatedSerialNumbers);
  };

  return (
    <>
      <Dialog
        size="xs"
        open={open}
        handler={handleClose}
        className="bg-white shadow-none rounded-[10px] overflow-y-scroll scrollbar-hide overflow-x-hidden font-poppins p-5"
      >
        <DialogHeader className="flex justify-between align-center border-b border-[#64728C] border-opacity-15 p-0 items-center pb-4">
          <div className="font-poppins text-[16px] md:text-[20px] font-medium leading-8 md:leading-[30px] text-[#64728C]">
            Edit Product
          </div>
          <div
            className="font-bold text-[20px] cursor-pointer"
            onClick={handleClose}
          >
            <CloseIcon />
          </div>
        </DialogHeader>
        <DialogBody className="mb-1 flex flex-col gap-3 relative max-h-[500px] overflow-y-scroll pl-3 pr-4 py-0">
          <div className="w-fill flex gap-5 mt-5">
            <h3 className="font-poppins font-medium text-[12px] md:text-[16px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
              Product:
            </h3>
            <h3 className="font-poppins font-medium text-[12px] md:text-[16px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
              {editItem.Item_Description}
            </h3>
          </div>
          <div className="w-full">
            <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
              Quantity
            </h3>
            <input
              name="qty"
              type="text"
              className="block rounded-[15px] border-0 py-2 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
              value={editItem.Qty}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^\d*\.?\d*$/.test(inputValue) || inputValue === "") {
                  setSelectedItem({
                    ...editItem,
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
              <p className="text-red-500 font-poppins font-medium text-xs pt-1">
                {errors.Qty}
              </p>
            )}
          </div>
          <div className="w-full mt-3">
            <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
              Cost
            </h3>
            <input
              name="Cost"
              type="text"
              pattern="\d*\.?\d{0,2}"
              className="block rounded-[15px] border-0 py-2 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
              value={editItem.Cost ? parseFloat(editItem.Cost) : ""}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^\d*\.?\d*$/.test(inputValue) || inputValue === "") {
                  let cost = 0;
                  if (!isNaN(inputValue)) {
                    cost = inputValue;
                  }
                  setSelectedItem({
                    ...editItem,
                    Cost: cost,
                  });
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    Cost: "",
                  }));
                } else {
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    Cost: "Please enter only numeric values with decimal places.",
                  }));
                }
              }}
            />
            {errors.Cost && (
              <p className="text-red-500 font-poppins font-medium text-xs pt-1">
                {errors.Cost}
              </p>
            )}
          </div>
          <div className="w-full mb-5 mt-3">
            <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-1 text-[#64728C]">
              Discount
            </h3>
            <div className="flex gap-3">
              <Radio
                name="Discount_Type"
                value="percentage"
                checked={!discountTypeChangedToAmount}
                onChange={() => {
                  setDiscountTypeChangedToAmount(false);
                  setSelectedItem({
                    ...editItem,
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
                checked={discountTypeChangedToAmount}
                onChange={() => {
                  setDiscountTypeChangedToAmount(true);
                  setSelectedItem({
                    ...editItem,
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
            {!discountTypeChangedToAmount ? (
              <input
                name="discount"
                type="text"
                pattern="\d*\.?\d*"
                className="block rounded-[15px] border-0 py-2 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                value={editItem.Discount}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (
                    (/^\d*\.?\d{0,2}$/.test(inputValue) &&
                      parseInt(inputValue) <= 100) ||
                    inputValue === ""
                  ) {
                    setSelectedItem({
                      ...editItem,
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
                value={editItem.Discount}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (/^\d*\.?\d*$/.test(inputValue) || inputValue === "") {
                    setSelectedItem({
                      ...editItem,
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
              <p className="pt-1 text-xs font-medium text-red-500 font-poppins">
                {errors.Discount}
              </p>
            )}
          </div>

          {editItem.Item_Has_Serial === 1 && (
            <>
              {" "}
              <div>
                <h3 className="font-poppins font-medium text-[12px] md:text-[16px] leading-[18px] md:leading-[22px] mb-2 text-blue-500 mt-4">
                  Update Serial Numbers
                </h3>
              </div>
              {viewUpdateSerialNumbers && (
                <div className="w-fill flex flex-col">
                  <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
                    Serial Numbers
                  </h3>
                  {inputValues.map((serialObj, index) => (
                    <div key={serialObj.id} className="relative mt-2">
                      <input
                        name="Cost"
                        type="text"
                        className="block rounded-[15px] border-0 py-2 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                        value={serialObj.value}
                        onChange={(e) =>
                          handleSerialNumberChange(index, e.target.value)
                        }
                      />
                    </div>
                  ))}
                  {errors.Serial_No && (
                    <p className="text-red-500 font-poppins font-medium text-xs pt-1">
                      {errors.Serial_No}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
          <div className="font-poppins font-medium text-[14px] leading-[2px] pt-4">
            LKR{" "}
            {parseFloat(editItem.Total).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              onClick={handleAddItem}
              className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] hover:opacity-80 text-[#10275E]"
            >
              Save
            </button>
          </div>
        </DialogBody>
        <DialogFooter />
      </Dialog>
    </>
  );
};
