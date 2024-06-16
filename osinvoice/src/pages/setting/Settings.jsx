import React, { useState, useEffect } from "react";
import Select from "react-select";
import axiosClient from "../../../axios-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStateContext } from "../../contexts/NavigationContext";
import { NewSettingIcon } from "../../utils/icons";

export const Settings = () => {
  const { user, setShowSalesman } = useStateContext(); // Destructure setShowSalesman

  const [rules, setRules] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [expandedInvoice, setExpandedInvoice] = useState(false);
  const [expandedAccount, setExpandedAccount] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [settings, setSettings] = useState({});
  const [errors, setErrors] = useState({});
  const [customSettingsExpanded, setCustomSettingsExpanded] = useState(false);

  const toggleCustomSettingsSection = () => {
    setCustomSettingsExpanded((prev) => !prev);
  };

  const handleSalesmanChange = () => {
    setIsChecked(!isChecked);
    // setShowSalesman(!isChecked);
  };

  const handleToggleInvoice = () => {
    setExpandedInvoice(!expandedInvoice);
  };

  const handleToggleAccount = () => {
    setExpandedAccount(!expandedAccount);
  };

  const handleClick = () => {
    setShowColors(!showColors);
  };

  useEffect(() => {
    const getRules = () => {
      axiosClient
        .get(`/rules/${user.branch}`)
        .then((res) => {
          setRules(res.data);
          const matchingOption = statusOptions.find(
            (option) => option.value === res.data[0].Invoice_PrintType
          );
          setSelectedOption(matchingOption);
          setIsChecked(res.data[0].Salesman === 1);
          setShowSalesman(res.data[0].Salesman === 1); // Update context state
          setSettings(res.data[0]);
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getRules();
  }, [user.branch, setShowSalesman]);

  const statusOptions = [
    { value: 1, label: "Standard Print" },
    { value: 2, label: "Thermal Print" },
  ];

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

  const handleSelectChange = (option) => {
    setSelectedOption(option);
  };

  const handleUpdate = async () => {
    const errors = {};
    if (!settings.Invoice_No_Start_With) {
      errors.Invoice_No_Start_With = "Invoice No Start With is required";
    }
    if (!settings.Invoice_No_Strat_From) {
      errors.Invoice_No_Strat_From = "Invoice No Start From is required";
    }
    if (!settings.Invoice_No_Start_With) {
      errors.Invoice_No_Start_With = "Invoice No Start With is required";
    }
    if (!settings.Order_No_Start_With) {
      errors.Order_No_Start_With = "Order No Start With is required";
    }
    if (!settings.Order_No_Strat_From) {
      errors.Order_No_Strat_From = "Order No Start From is required";
    }
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axiosClient.put(`/rules/${rules[0].idRules}`, {
          Invoice_PrintType: selectedOption.value,
          Salesman: isChecked ? 1 : 0,
          Invoice_No_Start_With: settings.Invoice_No_Start_With,
          Invoice_No_Strat_From: settings.Invoice_No_Strat_From,
          Order_No_Start_With: settings.Order_No_Start_With,
          Order_No_Strat_From: settings.Order_No_Strat_From,
        });
        setShowSalesman(isChecked);
        toast.success("Settings updated successfully");
      } catch (err) {
        toast.error(`Error updating settings: ${err.message}`);
      }
    } else {
      setErrors(errors);
    }
  };

  return (
    <>
      <section className="mt-8">
        <div className="w-full bg-white rounded-[15px] px-[30px] pt-[20px] pb-[40px]">
          <div className="flex items-center gap-4">
            <NewSettingIcon />
            <span className="font-poppins font-medium items-center text-[16px] md:text-[22px] leading-8 md:leading-[30px] text-[#64728C]">
              Account Settings
            </span>
          </div>

          <div className="flex flex-col mt-6 md:flex-row md:justify-left border-b border-[#e0e3e8] pb-4">
            <div className="w-full flex justify-between items-center">
              <div className="font-poppins text-[14px] font-medium leading-[22px] text-[#64728C] pb-2 mt-5">
                Print Type
              </div>
              <div className="md:w-[250px]">
                <Select
                  className="basic-single font-poppins text-[14px] h-10"
                  classNamePrefix="select"
                  isSearchable={true}
                  value={selectedOption}
                  name="printType"
                  styles={customSelectStyles}
                  options={statusOptions}
                  onChange={handleSelectChange}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 md:mt-10 pb-4 border-b border-[#e0e3e8]">
            <div className="w-full md:w-1/5">
              <p className="font-poppins text-[14px] font-medium leading-[22px] text-[#64728C] pb-2">
                Salesmen
              </p>
            </div>
            <div className="flex items-center">
              <label
                htmlFor="toggleB"
                className="flex items-center cursor-pointer"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    id="toggleB"
                    className="sr-only"
                    checked={isChecked}
                    onChange={handleSalesmanChange}
                  />
                  <div
                    className={`block w-12 h-6 rounded-full border ${
                      isChecked
                        ? "bg-[#7335E5] border-[#7335E5]"
                        : "bg-[#FFF2E9] border-[#7335E5]"
                    }`}
                  ></div>
                  <div
                    className={`dot absolute top-1 w-4 h-4 rounded-full transition transform ${
                      isChecked
                        ? "translate-x-7 bg-[#FFF2E9]"
                        : "translate-x-1 bg-[#7335E5]"
                    }`}
                  ></div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-start flex-col mt-6 md:mt-10 pb-4">
            <div
              className="w-full md:w-1/5 cursor-pointer"
              onClick={toggleCustomSettingsSection}
            >
              <p className="font-poppins text-[14px] font-medium leading-[22px] text-[#64728C] pb-2">
                Custom Invoice and Quotation Options
              </p>
            </div>

            {customSettingsExpanded && (
              <>
                <div className="w-full flex flex-col md:flex-row items-start md:gap-20 gap-1 md:mt-5 mt-3">
                  <div className="md:w-[30%] w-full mb-3">
                    <p className="font-poppins text-[12px] md:text-[14px] leading-[24px] font-normal text-[#64728C]">
                      Invoice number starts with
                    </p>
                    <input
                      name="Contact Number"
                      type="text"
                      className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          Invoice_No_Start_With: e.target.value,
                        });
                        setRuleErrors({
                          ...errors,
                          Invoice_No_Start_With: "",
                        });
                      }}
                      value={settings.Invoice_No_Start_With}
                      placeholder="Type here...."
                    />
                    {errors.Invoice_No_Start_With && (
                      <span className=" text-[#ff0000a1] px-1 font-inter font-bold text-xs">
                        {" "}
                        {errors.Invoice_No_Start_With}{" "}
                      </span>
                    )}
                  </div>
                  <div className="md:w-[30%] w-full mb-3">
                    <p className="font-poppins text-[12px] md:text-[14px] leading-[24px] font-normal text-[#64728C]">
                      Invoice number starts from
                    </p>
                    <input
                      name="Contact Number"
                      type="text"
                      className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          Invoice_No_Strat_From: e.target.value,
                        });
                        setRuleErrors({
                          ...errors,
                          Invoice_No_Strat_From: "",
                        });
                      }}
                      value={settings.Invoice_No_Strat_From}
                      placeholder="Type here...."
                    />
                    {errors.Invoice_No_Strat_From && (
                      <span className=" text-[#ff0000a1] px-1 font-inter font-bold text-xs">
                        {" "}
                        {errors.Invoice_No_Strat_From}{" "}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full flex flex-col md:flex-row items-start md:gap-20 gap-3 md:mt-5 mt-3">
                  <div className="md:w-[30%] w-full mb-3">
                    <p className="font-poppins text-[12px] md:text-[14px] leading-[24px] font-normal text-[#64728C]">
                      Quotation number starts with
                    </p>
                    <input
                      name="Contact Number"
                      type="text"
                      className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          Order_No_Start_With: e.target.value,
                        });
                        setRuleErrors({
                          ...errors,
                          Order_No_Start_With: "",
                        });
                      }}
                      value={settings.Order_No_Start_With}
                      placeholder="Type here...."
                    />
                    {errors.Order_No_Start_With && (
                      <span className=" text-[#ff0000a1] px-1 font-inter font-bold text-xs">
                        {" "}
                        {errors.Order_No_Start_With}{" "}
                      </span>
                    )}
                  </div>
                  <div className="md:w-[30%] w-full mb-3">
                    <p className="font-poppins text-[12px] md:text-[14px] leading-[24px] font-normal text-[#64728C]">
                      Quotation number starts from
                    </p>
                    <input
                      name="Contact Number"
                      type="text"
                      className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          Order_No_Strat_From: e.target.value,
                        });
                        setErrors({
                          ...errors,
                          Order_No_Strat_From: "",
                        });
                      }}
                      value={settings.Order_No_Strat_From}
                      placeholder="Type here...."
                    />
                    {errors.Order_No_Strat_From && (
                      <span className=" text-[#ff0000a1] px-1 font-inter font-bold text-xs">
                        {" "}
                        {errors.Order_No_Strat_From}{" "}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end mt-10">
            <button
              className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] flex items-center justify-center gap-2 text-[#10275E] hover:opacity-80"
              onClick={handleUpdate}
            >
              Update Settings
            </button>
          </div>
        </div>
        <ToastContainer />
      </section>
    </>
  );
};
