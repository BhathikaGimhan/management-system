import { useState } from "react";
import { Dialog, Card, Typography } from "@material-tailwind/react";
import { CloseIcon } from "../../utils/icons";

export const EditSerialNumbers = ({
  handleOpen,
  open,
  handleSerialNumbers,
  editItem,
}) => {
  const [errors, setErrors] = useState({});
  const [inputValues, setInputValues] = useState(editItem.Serial_No || [""]);

  const handleAddInputField = () => {
    setInputValues([...inputValues, ""]);
  };

  const handleChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const handleClose = () => {
    setErrors({});
    setInputValues([""]);
    handleOpen();
  };

  const handleAddSerialNumbers = () => {
    const validSerialNumbers = inputValues.filter(
      (serial) => serial.trim() !== ""
    );
    setErrors({});
    handleSerialNumbers(validSerialNumbers);
    s;
    handleClose();
  };

  return (
    <>
      <Dialog
        size="xs"
        open={open}
        handler={handleClose}
        className="bg-transparent shadow-none rounded-sm overflow-y-scroll h-[80%] scrollbar-y-style overflow-x-hidden font-inter"
      >
        <Card className="mx-auto w-full p-5 rounded-sm max-w-[100%] ">
          <div className="flex justify-between align-center border-b-2 border-grey">
            <div className="font-inter text-lg font-bold pb-5">
              Edit Serial Numbers
            </div>
            <div
              className="font-bold text-[20px] cursor-pointer"
              onClick={handleClose}
            >
              <CloseIcon />
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full mt-5">
            <div className="w-fill flex gap-5">
              <Typography
                variant="small"
                color="black"
                className="mb-1 font-inter font-normal"
              >
                Product :-
              </Typography>
              <Typography
                variant="small"
                color="black"
                className="mb-1 font-inter font-normal"
              >
                {editItem?.Item_Description}
              </Typography>
            </div>
            <div className="w-fill flex flex-col">
              <Typography
                variant="small"
                color="black"
                className="mb-1 font-inter font-normal"
              >
                Serial Numbers
              </Typography>
              {inputValues.map((value, index) => (
                <div key={index} className="relative mt-2">
                  <input
                    name={`serial-${index}`}
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(index, e.target.value)}
                    className="block rounded-md border-0 py-1 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6  w-full"
                  />
                  {index > 0 && (
                    <span
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      onClick={() => handleRemoveInputField(index)}
                    >
                      <CloseIcon />
                    </span>
                  )}
                </div>
              ))}
              {errors.Serial_No && (
                <Typography className="text-red-500 font-inter font-medium text-xs pt-1">
                  {errors.Serial_No}
                </Typography>
              )}
              <button
                className="text-blue-600 mt-2 font-inter"
                onClick={handleAddInputField}
              >
                Add Serial Number
              </button>
            </div>
            <div className="flex justify-between">
              <Typography
                variant="small"
                color="black"
                className="mb-1 font-inter font-normal"
              ></Typography>
              <button
                type="button"
                onClick={handleAddSerialNumbers}
                className="w-fit flex gap-1 items-center p-1 px-3 font-inter font-medium bg-[#9165A0] border-[#9165A0] hover:bg-white text-white hover:text-black border-[1px] hover:border-black text-[14px] transition-colors duration-500"
              >
                Save Serial Numbers
              </button>
            </div>
          </div>
        </Card>
      </Dialog>
    </>
  );
};
