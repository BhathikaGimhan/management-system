import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { CloseIcon } from "../../utils/icons";

export const ViewSerialNumbers = ({ handleOpen, open, serialItem }) => {
  const handleClose = () => {
    handleOpen();
  };
  return (
    <>
      <Dialog
        size="xs"
        open={open}
        handler={handleClose}
        className="bg-white shadow-none rounded-[10px] overflow-y-scroll scrollbar-hide overflow-x-hidden font-poppins w-full p-5 max-w-[100%]"
      >
        <DialogHeader className="flex justify-between border-b border-[#64728C] border-opacity-15 pb-3 items-center">
          <div className="font-poppins text-[16px] md:text-[20px] font-medium text-[#64728C] flex justify-center items-center">
            Serial Numbers
          </div>
          <div
            className="font-bold text-[16px] md:text-[20px] cursor-pointer"
            onClick={handleClose}
          >
            <CloseIcon />
          </div>
        </DialogHeader>
        <DialogBody className="p-0 overflow-y-scroll max-h-[500px]">
          <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] text-[#64728C] mt-4">
            Product: {serialItem.Item_Description}
          </h3>
          <div className="w-full flex gap-5 pr-3">
            <div className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C] mt-4 w-full">
              {serialItem.Serial_No === 1 ? (
                serialItem.SelectedSerials.map((serial, index) => (
                  <div key={index}>
                    <div className="w-full border-b border-[#e7e9ec] py-1 pl-2">
                      {serial.Serial_No}
                    </div>
                  </div>
                ))
              ) : (
                <div>No Serial Numbers</div>
              )}
            </div>
          </div>
        </DialogBody>
        <DialogFooter></DialogFooter>
      </Dialog>
    </>
  );
};
