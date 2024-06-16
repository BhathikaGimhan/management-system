import React, { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody } from "@material-tailwind/react";
import axiosClient from "../../../axios-client";
import Swal from "sweetalert2";

export const AddSerialNumbers = ({
  handleOpen,
  open,
  handleSerialNumbers,
  serialItem,
  handleRemoveItem,
}) => {
  const [errors, setErrors] = useState({});
  const [inputValues, setInputValues] = useState([]);

  useEffect(() => {
    if (serialItem && serialItem.Qty) {
      setInputValues(Array.from({ length: serialItem.Qty }, () => ""));
    }
  }, [serialItem]);

  const handleChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const handleCancel = () => {
    handleRemoveItem(serialItem);
    handleClose();
  };

  const handleClose = () => {
    setErrors({});
    setInputValues([]);
    handleOpen();
  };

  const handleAddSerialNumbers = async () => {
    const validSerialNumbers = inputValues.filter(
      (serial) => serial.trim() !== ""
    );

    // Check if any serial number is empty
    if (validSerialNumbers.length !== inputValues.length) {
      setErrors({ Serial_No: "Serial numbers cannot be empty" });
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Serial numbers cannot be empty",
      });
      return;
    }

    // Check if any two serial numbers are the same
    const uniqueSerialNumbers = new Set(validSerialNumbers);
    if (uniqueSerialNumbers.size !== validSerialNumbers.length) {
      const repeatingSerialNumbers = validSerialNumbers.filter(
        (serial) =>
          validSerialNumbers.indexOf(serial) !==
          validSerialNumbers.lastIndexOf(serial)
      );
      setErrors({
        Serial_No: `Serial numbers must be unique. Repeating serial numbers: ${repeatingSerialNumbers.join(
          ", "
        )}`,
      });
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Serial numbers must be unique. Repeating serial numbers: ${repeatingSerialNumbers.join(
          ", "
        )}`,
      });
      return;
    }

    setErrors({});

    try {
      const response = await axiosClient.post("/grn/check-serials", {
        serial_numbers: validSerialNumbers,
      });

      if (response.data.existing_serial_numbers) {
        setErrors({
          Serial_No: `Serial numbers already exist`,
        });
        return;
      }

      const data = {
        Item_idItem: serialItem?.Item_idItem,
        Serial_No: validSerialNumbers,
      };

      handleSerialNumbers(data);
      handleClose();
    } catch (error) {
      console.error("Error checking serial numbers:", error);
    }
  };

  return (
    <>
      <Dialog
        size="xs"
        open={open}
        className="bg-white shadow-none rounded-[10px] overflow-y-scroll scrollbar-hide overflow-x-hidden font-poppins  p-5"
      >
        <DialogHeader className="flex justify-between align-center border-b border-[#64728C] border-opacity-15 p-0 items-center pb-3">
          <div className="font-poppins text-[16px] md:text-[20px] font-medium leading-8 md:leading-[30px] text-[#64728C]">
            Add Serial Numbers
          </div>
        </DialogHeader>
        <DialogBody className="mb-1 flex flex-col gap-3 relative pl-3 pr-4 max-h-[500px] overflow-y-scroll">
          <div className="w-fill flex gap-5 mt-5">
            <h3 className="font-poppins font-medium text-[12px] md:text-[16px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
              Product or Service:
            </h3>
            <h3 className="font-poppins font-medium text-[12px] md:text-[16px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
              {serialItem?.Item_Description}
            </h3>
          </div>
          <div className="w-full">
            <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
              Serial Numbers
            </h3>
            {inputValues.map((value, index) => (
              <div key={index} className="relative mt-2">
                <input
                  name="qty"
                  type="text"
                  className="block rounded-[15px] border-0 py-2 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              </div>
            ))}
            {errors.Serial_No && (
              <p className="text-red-500 font-poppins font-medium text-xs pt-1">
                {errors.Serial_No}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="submit"
              onClick={handleCancel}
              className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] hover:opacity-80 text-[#10275E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleAddSerialNumbers}
              className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] hover:opacity-80 text-[#10275E]"
            >
              Add Serial Numbers
            </button>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
};
