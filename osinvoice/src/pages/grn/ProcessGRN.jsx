import React, { useState, useEffect } from "react";
import {
  Dialog,
  Typography,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import axiosClient from "../../../axios-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CloseIcon, ProcessingIcon } from "../../utils/icons";
import Select from "react-select";
import { useStateContext } from "../../contexts/NavigationContext";

export const ProcessGRN = ({ handleOpen, open, GRN, handleLoading }) => {
  const handleClose = () => {
    handleOpen();
  };

  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentType, setPaymentType] = useState("full");
  const [chequeType, setChequeType] = useState("");
  const editedGRN = GRN || {};
  const creditBalanceAmount = editedGRN.Credit_Balance_Amount || "";

  const { user } = useStateContext();
  const branchId = user.branch;

  const paymentMethods = [
    { value: "cash", label: "Cash" },
    { value: "cheque", label: "Cheque" },
  ];
  const paymentTypes = [
    { value: "full", label: "Full" },
    { value: "half", label: "Half" },
    { value: "credit", label: "Credit" },
  ];

  const chequeTypes = [
    { value: "cash", label: "Cash" },
    { value: "dated", label: "Dated" },
  ];

  const [initialFormData, setInitialFormData] = useState({
    Branch_idBranch: branchId,
    Credit_Balance_Amount: creditBalanceAmount,
    Payment_Type: "",
    Payment_Method: paymentMethods[0]?.value,
    Paid_Amount: "",
    Cheque_Type: "",
    Cheque_No: "",
    Cheque_Name: "",
    Cheque_Date: "",
    Credit_Amount: "",
    User_idUser: user.userId,
  });
  useEffect(() => {
    setFormData({ ...formData, idGRN: editedGRN.idGRN });
  }, [editedGRN.idGRN]);

  useEffect(() => {
    setInitialFormData((prevFormData) => ({
      ...prevFormData,
      Credit_Balance_Amount: creditBalanceAmount,
    }));
  }, [creditBalanceAmount]);

  const isSearchable = true;

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const handleChange = (description, value) => {
    setFormData({ ...formData, [description]: value });
  };

  const handlePaymentMethodSelect = (selectedOption) => {
    setPaymentMethod(selectedOption.value);
    setFormData({ ...formData, Payment_Method: selectedOption.value });
    setErrors({ ...errors, Payment_Method: "" });
  };

  const handlePaymentTypeSelect = (selectedOption) => {
    let type = selectedOption.value;
    setPaymentType(selectedOption.value);
    if (type === "full") {
      let amount = GRN.Credit_Balance_Amount;
      setFormData({
        ...formData,
        Payment_Type: selectedOption.value,
        Paid_Amount: amount,
        Credit_Balance_Amount: 0,
      });
    } else {
      setFormData({ ...formData, Payment_Type: selectedOption.value });
    }
    if (type === "credit") {
      setFormData({
        ...formData,
        Credit_Balance_Amount: creditBalanceAmount,
        Payment_Type: selectedOption.value,
        Payment_Method: "",
      });
    }
  };

  const handleChequeTypeSelect = (selectedOption) => {
    setChequeType(selectedOption.value);
    setFormData({ ...formData, Cheque_Type: selectedOption.value });
    setErrors({ ...errors, Cheque_Type: "" });
  };

  const calculateRemainingBalance = () => {
    if (formData.Payment_Type === "half") {
      const paidAmount = parseFloat(formData.Paid_Amount);
      const remainingBalance =
        parseFloat(editedGRN.Credit_Balance_Amount) - paidAmount;
      return remainingBalance;
    }
    return formData.Credit_Balance_Amount;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {};

    // Validation
    if (!formData.Payment_Method && formData.Payment_Type !== "credit") {
      errors.Payment_Method = "Payment Method is required.";
    }

    if (
      formData.Payment_Method === "cash" ||
      formData.Payment_Method === "credit"
    ) {
      if (!formData.Paid_Amount) {
        errors.Paid_Amount = "Amount is required.";
      }
    }

    if (formData.Payment_Method === "cheque") {
      if (!formData.Cheque_Type) {
        errors.Cheque_Type = "Cheque Type is required.";
      }
      if (!formData.Cheque_No) {
        errors.Cheque_No = "Cheque No is required.";
      }
      if (!formData.Cheque_Name) {
        errors.Cheque_Name = "Cheque Name is required.";
      }
      if (!formData.Cheque_Date) {
        errors.Cheque_Date = "Cheque Date is required.";
      }
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    // Calculate remaining balance
    const remainingBalance = calculateRemainingBalance();

    // Form submission
    try {
      setSubmitting(true);
      const response = await axiosClient.post("grn/process", {
        ...formData,
        Credit_Balance_Amount: remainingBalance,
      });
      toast.success("GRN Processed successfully !");
      setFormData(initialFormData);
      handleClose();
      handleLoading();
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      toast.error("Failed to process GRN. Please try again.");
    }
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      fontSize: "14px",
      fontWeight: "600",
      color: "#bdbdbd",
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "#64728C" : "#64728C",
      backgroundColor: state.isSelected ? "#e7e7e7" : "white",
      ":hover": {
        backgroundColor: state.isSelected ? "#ccc" : "#f3f3f3",
      },
      fontSize: "14px",
      fontWeight: "600",
    }),
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
              Process GRN
            </div>
            <div
              className="font-bold text-[20px] cursor-pointer"
              onClick={handleClose}
            >
              <CloseIcon />
            </div>
          </DialogHeader>
          <DialogBody className="mb-1 flex flex-col gap-3 relative p-0 overflow-y-scroll px-7 pb-20 max-h-[500px]">
            <div className=" flex flex-col w-full md:gap-[2%] flex-wrap ">
              <div className="mt-3 ">
                <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
                  Payment Type
                </h3>
                <Select
                  styles={customSelectStyles}
                  className="basic-single text-sm"
                  classNamePrefix="select"
                  isSearchable={isSearchable}
                  name="Payment_Type"
                  options={paymentTypes}
                  onChange={handlePaymentTypeSelect}
                />
                {errors.Payment_Type && (
                  <p className="pt-1 text-xs font-medium text-red-500 font-poppins">
                    {errors.Payment_Type}
                  </p>
                )}
              </div>
              {paymentType != "full" && paymentType != "credit" && (
                <div className=" mt-3">
                  <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
                    Amount
                  </h3>
                  <input
                    name="Rate"
                    type="text"
                    pattern="\d*\.?\d*"
                    className="block rounded-[15px] border-0 py-2 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                    value={formData.Paid_Amount}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const isNumericInput = /^\d*\.?\d*$/.test(inputValue);
                      if (isNumericInput || inputValue === "") {
                        let Credit_Balance_Amount =
                          formData.Credit_Balance_Amount;
                        setFormData({
                          ...formData,
                          Paid_Amount: inputValue,
                          Credit_Balance_Amount:
                            parseFloat(Credit_Balance_Amount) -
                            parseFloat(inputValue),
                        });
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          Paid_Amount: "",
                        }));
                      } else {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          Paid_Amount: "Please enter amount.",
                        }));
                      }
                    }}
                  />
                  {errors.Paid_Amount && (
                    <Typography className="text-red-500 font-inter font-medium text-xs pt-1">
                      {errors.Paid_Amount}
                    </Typography>
                  )}
                </div>
              )}
              {paymentType !== "credit" && (
                <div className=" mt-3">
                  <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
                    Payment Method
                  </h3>
                  <Select
                    styles={customSelectStyles}
                    className="basic-single text-sm"
                    classNamePrefix="select"
                    defaultValue={paymentMethods.find(
                      (method) => method.value === "cash"
                    )}
                    isSearchable={isSearchable}
                    name="Payment_Method"
                    options={paymentMethods}
                    onChange={handlePaymentMethodSelect}
                  />
                  {errors.Payment_Method && (
                    <span className=" text-[#ff0000a1] px-1 font-inter font-bold text-xs">
                      {" "}
                      {errors.Payment_Method}{" "}
                    </span>
                  )}
                </div>
              )}
              {paymentMethod === "cheque" && paymentType != "credit" && (
                <>
                  <div className="w-full mt-3">
                    <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
                      Cheque Type
                    </h3>
                    <Select
                      styles={customSelectStyles}
                      className="basic-single text-sm"
                      classNamePrefix="select"
                      isSearchable={isSearchable}
                      name="Cheque_Type"
                      options={chequeTypes}
                      onChange={handleChequeTypeSelect}
                    />
                    {errors.Cheque_Type && (
                      <span className=" text-[#ff0000a1] px-1 font-inter text-xs">
                        {" "}
                        {errors.Cheque_Type}{" "}
                      </span>
                    )}
                  </div>
                  <div className="w-full mt-3">
                    <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
                      Cheque Number
                    </h3>
                    <input
                      name="Cheque_No"
                      type="text"
                      className="block rounded-[15px] border-0 py-2 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                      value={formData.Cheque_No}
                      onChange={(e) =>
                        handleChange(e.target.name, e.target.value)
                      }
                    />
                    {errors.Cheque_No && (
                      <Typography className="text-red-500 font-inter font-medium text-xs pt-1">
                        {errors.Cheque_No}
                      </Typography>
                    )}
                  </div>
                  <div className="w-ful mt-3">
                    <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
                      Name on Cheque
                    </h3>
                    <input
                      name="Cheque_Name"
                      type="text"
                      className="block rounded-[15px] border-0 py-2 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                      value={formData.Cheque_Name}
                      onChange={(e) =>
                        handleChange(e.target.name, e.target.value)
                      }
                    />
                    {errors.Cheque_Name && (
                      <Typography className="text-red-500 font-inter font-medium text-xs pt-1">
                        {errors.Cheque_Name}
                      </Typography>
                    )}
                  </div>
                  <div className="w-full mt-3">
                    <h3 className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] mb-2 text-[#64728C]">
                      Cheque Date
                    </h3>
                    <input
                      name="Cheque_Date"
                      type="text"
                      className="block rounded-[15px] border-0 py-2 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                      value={formData.Cheque_Date}
                      onChange={(e) =>
                        handleChange(e.target.name, e.target.value)
                      }
                    />
                    {errors.Cheque_Date && (
                      <Typography className="text-red-500 font-inter font-medium text-xs pt-1">
                        {errors.Cheque_Date}
                      </Typography>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] hover:opacity-80 text-[#10275E] flex items-center gap-2"
              >
                {submitting && <ProcessingIcon />}
                Process
              </button>
            </div>
          </DialogBody>
          <DialogFooter></DialogFooter>
        </div>
      </Dialog>
      <ToastContainer autoClose={1500} />
    </>
  );
};
