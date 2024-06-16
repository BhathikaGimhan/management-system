import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useStateContext } from "../contexts/NavigationContext";
import signUpImage from "../assets/images/sign-up-image.png";

export const Login = () => {
  const { setUser, setToken } = useStateContext();
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const validate = (loginData) => {
    const errors = {};
    if (!loginData.email) {
      errors.email = "Email is required";
    } else if (!loginData.email.includes("@")) {
      errors.email = "Enter a valid email address";
    }
    if (!loginData.password) {
      errors.password = "Password is required";
    }
    setFormErrors(errors);
    return errors;
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const loginData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    const validationErrors = validate(loginData);

    if (Object.keys(validationErrors).length === 0) {
      axiosClient
        .post("/user/login", loginData)
        .then(({ data }) => {
          setUser(data.user);
          setToken(data.token);
        })
        .catch(({ response }) => {
          if (response && response.status === 401) {
            setAlertMessage(
              response?.data.error || "Invalid email or password"
            );
            setShowAlert(true);
          } else {
            setAlertMessage(response?.data.error || "An error occurred");
            setShowAlert(true);
          }
        });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <div className="w-[47%] hidden md:flex items-center justify-center -mt-20">
          <img src={signUpImage} alt="Sign up" />
        </div>
        <div className="w-full md:w-[47%] flex items-center">
          <form
            className="flex items-center flex-col w-full border border-1 border-[#B9B9B9] py-10 md:py-12 md:p-12 p-5 rounded-[15px] mb-20"
            onSubmit={handleLogin}
          >
            <h3 className="font-poppins text-[#64728C] font-bold md:leading-[20px] leading-9 text-[24px] md:text-[32px]">
              Welcome back
            </h3>
            <h4 className="font-poppins font-semibold text-[#64728C] leading-[24px] text-[16px] md:text-[18px] md:mt-3">
              Sign In
            </h4>
            <div className="flex flex-col justify-between w-full gap-8 mt-8 md:mt-10">
              <div className="w-full">
                <p className="font-poppins text-[14px] md:text-[18px] leading-[24px] font-semibold text-[#64728C]">
                  Email address
                </p>
                <input
                  name="Email address"
                  type="email"
                  ref={emailRef}
                  className="block rounded-md border-0 py-3 pl-3 text-gray-900 ring-1 ring-inset mt-3 ring-gray-300 placeholder:text-[#A6A6A6]-600 placeholder:text-[14px] md:placeholder:text-[18px] placeholder:nunito focus:ring-1 focus:ring-inset sm:leading-6 w-full bg-[#F1F4F9] text-[16px] md:text-[20px] font-semibold font-nunito"
                  placeholder="esteban_schiller@gmail.com"
                />
                {formErrors.email && (
                  <span className="text-xs font-medium text-red-500 font-poppins">
                    {formErrors.email}
                  </span>
                )}
              </div>
              <div className="w-full">
                <p className="font-poppins text-[14px] md:text-[18px] leading-[24px] font-semibold text-[#64728C]">
                  Password
                </p>
                <input
                  name="Password"
                  type="password"
                  ref={passwordRef}
                  className="block rounded-md border-0 py-3 pl-3 text-gray-900 ring-1 ring-inset mt-3 ring-gray-300 placeholder:text-[#A6A6A6]-600 placeholder:text-[14px] md:placeholder:text-[18px] placeholder:nunito focus:ring-1 focus:ring-inset sm:leading-6 w-full bg-[#F1F4F9] text-[16px] md:text-[20px] font-semibold font-nunito"
                  placeholder="********"
                />
                {formErrors.password && (
                  <span className="text-xs font-medium text-red-500 font-poppins">
                    {formErrors.password}
                  </span>
                )}
              </div>
            </div>
            {/* <div className="flex items-center justify-between w-full mt-8">
              <div className="flex justify-left text-start">
                <input type="checkbox" className="w-[18px]" />
                <p className="font-poppins font-semibold text-[16px] md:text-[18px] leading-6 text-[#64728C] pl-3">
                  Remember me
                </p>
              </div>
            </div> */}
            <button
              className="w-[80%] bg-[#FF8828] flex justify-center p-3 text-[15px] md:text-[20px] text-white font-bold font-poppins leading-[28px] rounded-[10px] mt-8 cursor-pointer"
              type="submit"
            >
              Sign In
            </button>
            {showAlert && (
              <div className="mt-4 font-semibold text-red-500">
                {alertMessage}
              </div>
            )}
            <div className="mt-8 text-[14px] md:text-[18px] leading-[24px] font-poppins font-semibold text-[#202224]">
              New to Optimize?{" "}
              <a className="text-[#FF8828] underline" href="/signup">
                Create Account
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
