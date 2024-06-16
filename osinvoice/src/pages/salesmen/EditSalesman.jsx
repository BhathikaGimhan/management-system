import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, Card } from "@material-tailwind/react";
import axiosClient from "../../../axios-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CloseIcon, ProcessingIcon, AddCustomerIcon } from "../../utils/icons";
import { InputItem } from "../../components/global/InputItem";
import { FormInput } from "../../components/global/FormInput";
import { useStateContext } from "../../contexts/NavigationContext";
import Swal from "sweetalert2";

export const EditSalesman = ({}) => {
  const { user } = useStateContext();

  const { id } = useParams();
  const navigate = useNavigate();

  const employeeId = parseInt(id, 10);
  
  
  const [submitting, setSubmitting] = useState(false);
  const [editedSalesman, setEditedSalesman] = useState({});


  const [errors, setErrors] = useState({});



  //Fetching the customer details from the database
  useEffect(() => {
    const fetchEmployee = () => {
      axiosClient
        .get(`/employee/single/${employeeId}`)
        .then((res) => {
          setEditedSalesman(res.data);
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchEmployee();
  }, []);

    //Validating the data
  const validate = (data) => {
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
    const validateErrors = validate(editedSalesman);
    setErrors(validateErrors);
    if (Object.keys(validateErrors).length === 0) {
      setSubmitting(true);
      try {
        const extendedSalesmanArray = {
          ...editedSalesman,
          User_idUser: user.userId,
          Branch_idBranch: user.branch,
        };
        axiosClient
          .put(`/employee/${editedSalesman.idEmployee}`, extendedSalesmanArray)
          .then((res) => {
            toast.success("Supplier edited successfully !");
            setEditedSalesman({});
          })
          .catch((error) => {
            setSubmitting(false);
            console.log(error);
            toast.error("Failed to add Supplier. Please try again.");
          });
        setSubmitting(false);
        navigate("/salesman");
      } catch (error) {
        toast.error("Failed to add Supplier. Please try again.");
      }
    } else {
      setErrors(validateErrors);
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
  //Updating the input values
  const handleChange = (name, value) => {
    setEditedSalesman((prevSalesman) => ({
      ...prevSalesman,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

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
              Edit Salesman
            </span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center w-full gap-3 mt-6 md:flex-row md:gap-20 md:mt-10">
              {inputItems.slice(0, 2).map((item, itemIndex) => {
                return (
                  <div className="md:w-[30%] w-full mb-3" key={itemIndex}>
                    <FormInput
                      data={editedSalesman}
                      type={item.type}
                      errors={errors}
                      handleChange={handleChange}
                      name={item.name}
                      inputName={item.inputName}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col items-center w-full gap-3 mt-3 md:flex-row md:gap-20 md:mt-5">
              {inputItems.slice(2, 3).map((item, itemIndex) => {
                return (
                  <div className="md:w-[30%] w-full mb-3" key={itemIndex}>
                    <FormInput
                      data={editedSalesman}
                      type={item.type}
                      errors={errors}
                      handleChange={handleChange}
                      name={item.name}
                      inputName={item.inputName}
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
                    className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-medium font-poppins"
                    value={editedSalesman.Contact_No}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const isNumericInput = /^\d+$/.test(inputValue);

                      if (isNumericInput || inputValue === "") {
                        setEditedSalesman({
                          ...editedSalesman,
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
                  {errors.Tp && (
                    <p className="pt-1 text-xs font-medium text-red-500 font-inter">
                      {errors.Contact_No}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center w-full gap-20 mt-3 md:flex-row md:mt-5">
              {inputItems.slice(3, 4).map((item, itemIndex) => {
                return (
                  <div className="md:w-[30%] w-full mb-3" key={itemIndex}>
                    <FormInput
                      data={editedSalesman}
                      type={item.type}
                      errors={errors}
                      handleChange={handleChange}
                      name={item.name}
                      inputName={item.inputName}
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
                className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] flex items-center justify-center gap-2 text-[#10275E]"
                type="submit"
                disabled={submitting}
              >
                {submitting && <ProcessingIcon />}
                Update
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
