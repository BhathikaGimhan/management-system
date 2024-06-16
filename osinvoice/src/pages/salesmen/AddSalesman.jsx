import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProcessingIcon, AddCustomerIcon } from "../../utils/icons";
import { useStateContext } from "../../contexts/NavigationContext";
import { FormInput } from "../../components/global/FormInput";
import Swal from "sweetalert2";

export const AddSalesman = () => {
  const { user } = useStateContext();

  const navigate = useNavigate();

  // Initial form data
  const initialFormData = {
    Employee_Number: "",
    Employee_Name: "",
    Employee_NIC: "",
    ETF_No: "",
    Contact_No: "",
    Branch_idBranch: user.branch,
    User_idUser: user.userId,
  };

  const [submitting, setSubmitting] = useState(false);

  // State variables for form data and errors
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // Function to handle form input changes
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = (data) => {
    setSubmitting(true);
    const errors = {};
    if (!data.Employee_Number) {
      errors.Employee_Number = "Salesman Number is required.";
    }
    if (!data.Employee_Name) {
      errors.Employee_Name = "Salesman Name is required.";
    }
    if (!data.Contact_No) {
      errors.Contact_No = "Contact Number is required.";
    }
    return errors;
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validateErrors = validate(formData);
    setErrors(validateErrors);
    if (Object.keys(validateErrors).length === 0) {
      setSubmitting(true);
      try {
        axiosClient
          .post(`/employee`, formData)
          .then((res) => {
            toast.success("Salesman added successfully !");
            setFormData(initialFormData);
            navigate("/salesman");
          })
          .catch((error) => {
            setSubmitting(false);
            console.log(error);
            toast.error("Failed to add Salesman. Please try again.");
          });
        setSubmitting(false);
      } catch (error) {
        toast.error("Failed to add Salesman. Please try again.");
      }
    } else {
      setSubmitting(false);
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

  // Array of input items for rendering the form
  const inputItems = [
    {
      name: "Salesman No*",
      inputName: "Employee_Number",
      type: "text",
    },
    {
      name: "Salesman Name*",
      inputName: "Employee_Name",
      type: "text",
    },
    {
      name: "NIC",
      inputName: "Employee_NIC",
      type: "text",
    },
    {
      name: "ETF No",
      inputName: "ETF_No",
      type: "text",
    },
  ];
  return (
    <>
      <section className="mt-8 pb-12">
        <div className="w-full bg-white rounded-[15px] md:px-[30px] px-[4%] pt-[20px] pb-[40px]">
          <div className="flex items-center gap-4">
            <AddCustomerIcon />
            <span className="font-poppins font-medium text-[16px] md:text-[22px] leading-8 md:leading-[30px] text-[#64728C] mt-1">
              New Salesman
            </span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="w-full flex flex-col md:flex-row items-start md:gap-20 gap-3 md:mt-10 mt-6">
              {inputItems.slice(0, 2).map((item, itemIndex) => {
                return (
                  <div className="md:w-[30%] w-full mb-3" key={itemIndex}>
                    <FormInput
                      data={formData}
                      type={item.type}
                      errors={errors}
                      handleChange={handleChange}
                      name={item.name}
                      inputName={item.inputName}
                      placeholder={item.placeholder}
                    />
                  </div>
                );
              })}
            </div>
            <div className="w-full flex flex-col md:flex-row items-start md:gap-20 gap-3 md:mt-5 mt-3">
              {inputItems.slice(2, 3).map((item, itemIndex) => {
                return (
                  <div className="md:w-[30%] w-full mb-3" key={itemIndex}>
                    <FormInput
                      data={formData}
                      type={item.type}
                      errors={errors}
                      handleChange={handleChange}
                      name={item.name}
                      inputName={item.inputName}
                      placeholder={item.placeholder}
                    />
                  </div>
                );
              })}
              <div className="md:w-[30%] w-full mb-3">
                <div className="w-full">
                  <p className="font-poppins text-[14px] md:text-[16px] leading-[24px] font-medium text-[#64728C]">
                    Contact Number*
                  </p>
                  <input
                    name="Contact Number"
                    type="text"
                    className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                    value={formData.Contact_No}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const isNumericInput = /^\d+$/.test(inputValue);

                      if (isNumericInput || inputValue === "") {
                        setFormData({
                          ...formData,
                          Contact_No: inputValue,
                        });
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          Contact_No: "",
                        }));
                      } else {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          Contact_No: "Please enter only phone number.",
                        }));
                      }
                    }}
                    placeholder="Type here...."
                  />
                  {errors.Contact_No && (
                    <p className="text-red-500 font-poppins font-medium text-xs pt-1">
                      {errors.Contact_No}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col md:flex-row items-start gap-20 md:mt-5 mt-3">
              {inputItems.slice(3, 4).map((item, itemIndex) => {
                return (
                  <div className="md:w-[30%] w-full mb-3" key={itemIndex}>
                    <FormInput
                      data={formData}
                      type={item.type}
                      errors={errors}
                      handleChange={handleChange}
                      name={item.name}
                      inputName={item.inputName}
                      placeholder={item.placeholder}
                    />
                  </div>
                );
              })}
            </div>

            <div className="font-poppins font-normal text-[12px] leading-[18px] text-[#64728C] text-opacity-70 md:mt-5 mt-3">
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
      <ToastContainer />
    </>
  );
};
