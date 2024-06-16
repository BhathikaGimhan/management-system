import { useEffect, useState } from "react";
import { useStateContext } from "../../../src/contexts/NavigationContext";
import axiosClient from "../../../axios-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Account = () => {
  const { user } = useStateContext();

  const [userDetails, setUserDetails] = useState({});

  const [contactErrors, setContactErrors] = useState({});

  const [passwordData, setPasswordData] = useState({
    idUser: user.userId,
    oldPassword: "",
    newPassword: "",
    rePassword: "",
  });

  const [contactData, setContactData] = useState({
    Contact_No: "",
    Address1: "",
    Address2: "",
    Address3: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({});
  const handlePasswordSubmit = () => {
    const errors = {};
    if (!passwordData.oldPassword) {
      errors.oldPassword = "Current Password is required";
    }
    if (!passwordData.newPassword) {
      errors.newPassword = "New Password is required";
    }
    if (!passwordData.rePassword) {
      errors.rePassword = "Confirm New Password is required";
    }
    if (passwordData.newPassword !== passwordData.rePassword) {
      errors.matchPassword =
        "New Password and Confirm Password are not matched";
    }
    if (Object.keys(errors).length === 0) {
      axiosClient
        .post(`/user/reset-password`, passwordData)
        .then((res) => {
          setPasswordData({ idUser: user.userId });
          toast.success("Password has been changed successfully !");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Failed to change password. Please try again.");
        });
    } else {
      setPasswordErrors(errors);
    }
  };

  const handleContactSubmit = () => {
    const errors = {};

    if (userDetails.First_Name === "") {
      errors.First_Name = "First Name is required";
    }
    if (userDetails.Last_Name === "") {
      errors.Last_Name = "Last Name is required";
    }
    if (contactData.Contact_No === "") {
      errors.Contact_No = "Contact Number is required";
    }
    if (contactData.Address1 === "") {
      errors.Address1 = "Address Line 1 is required";
    }
    if (contactData.Address2 === "") {
      errors.Address2 = "Address Line 2 is required";
    }
    if (contactData.Address3 === "") {
      errors.Address3 = "Address Line 3 is required";
    }

    if (Object.keys(errors).length === 0) {
      const updatedContactData = {
        ...contactData,
        First_Name: userDetails.First_Name,
        Last_Name: userDetails.Last_Name,
        Email: userDetails.Email,
        user: user.userId,
      };

      axiosClient
        .put(`/branch/${user.branch}`, updatedContactData)
        .then((res) => {
          handleAccountDetailsLoading();
          toast.success("Account Details have been changed successfully!");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Failed to change account details. Please try again.");
        });

      // Update the state after the API call (optional)
      setContactData(updatedContactData);
    } else {
      setContactErrors(errors);
    }
  };

  const [accountDetails, setAccountDetails] = useState({});
  const [accountDetailsLoading, setAccountDetailsLoading] = useState(false);
  const handleAccountDetailsLoading = () => {
    setAccountDetailsLoading((pre) => !pre);
  };

  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);

  const [imgError, setImgError] = useState({});
  const handleLogoChange = () => {
    const errors = {};
    if (img === null) {
      errors.img = "Select an Image";
    }
    if (Object.keys(errors).length === 0) {
      let data = {
        img: img,
        Branch_idBranch: user.branch,
      };
      axiosClient
        .post(`/branch/change-logo`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          toast.success("Logo has been changed successfully !");
          handleAccountDetailsLoading();
          setImg(null);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Failed to change Logo. Please try again.");
        });
    } else {
      setImgError(errors);
    }
  };

  const [placeholder, setPlaceholder] = useState("");
  const handleFileChange = (e) => {
    const selectedImg = e.target.files[0];
    setImg(selectedImg);

    if (selectedImg) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedImg);

      if (selectedImg !== "") {
        setImgError({ ...imgError, img: "" });
      }
    } else {
      setPreview(null);
    }
  };

  const getAccountDetails = () => {
    axiosClient
      .get(`/branch/get-account-details/${user.branch}`)
      .then((res) => {
        setAccountDetails(res.data);
        let data = res.data;
        setPlaceholder(data.Logo);
        setContactData({
          ...contactData,
          Contact_No: data.Contact_No,
          Address1: data.Address1,
          Address2: data.Address2,
          Address3: data.Address3,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUserDetails = () => {
    axiosClient
      .get(`/user/${user.userId}`)
      .then((res) => {
        setUserDetails(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getAccountDetails();
    getUserDetails();
  }, [accountDetailsLoading]);

  return (
    <>
      <section className="mt-8 pb-12">
        <div className="w-full bg-white rounded-[15px] md:px-[30px] px-[4%] pt-[20px] pb-[40px]">
          <div className="flex md:gap-8 gap-4 items-center flex-col md:flex-row">
            <div className="w-[150px] aspect-square rounded-full">
              <label htmlFor="myfile" className="rounded-full cursor-pointer">
                {preview ? (
                  <div className="w-[150px] aspect-square border rounded-full flex justify-center items-center overflow-hidden">
                    <img
                      src={preview}
                      alt="Preview"
                      className="rounded-full object-cover"
                      style={{ maxWidth: "150px", maxHeight: "150px" }}
                    />
                  </div>
                ) : (
                  <div className="w-[150px] aspect-square border rounded-full flex justify-center items-center overflow-hidden">
                    <img
                      src={placeholder}
                      alt="Placeholder"
                      className="rounded-full"
                    />
                  </div>
                )}
              </label>
              <input
                type="file"
                id="myfile"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
            <button
              className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] h-fit flex items-center justify-center gap-2 text-[#10275E] hover:opacity-80"
              type="button"
              onClick={() => handleLogoChange()}
            >
              Change Logo
            </button>
          </div>

          <form className="mt-8">
            <div className="poppins font-semibold text-[16px] leading-8 text-[#64728C] mt-3">
              Account Details
            </div>
            <div className="w-full flex flex-col md:flex-row items-start md:gap-20 gap-1 md:mt-5 mt-3">
              <div className="md:w-[30%] w-full mb-3">
                <p className="font-poppins text-[14px] md:text-[16px] leading-[24px] font-medium text-[#b0b7c4]">
                  First Name
                </p>
                <input
                  name="First Name"
                  type="text"
                  className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                  value={userDetails.First_Name}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setUserDetails({
                      ...userDetails,
                      First_Name: inputValue,
                    });
                    setContactErrors((prevErrors) => ({
                      ...prevErrors,
                      Tp: "",
                    }));
                  }}
                  placeholder="Type here...."
                />
                {contactErrors.First_Name && (
                  <p className="text-red-500 font-inter font-medium text-xs pt-1">
                    {contactErrors.First_Name}
                  </p>
                )}
              </div>
              <div className="md:w-[30%] w-full mb-3">
                <p className="font-poppins text-[14px] md:text-[16px] leading-[24px] font-medium text-[#b0b7c4]">
                  Second Name
                </p>
                <input
                  name="Second Name"
                  type="text"
                  className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                  value={userDetails.Last_Name}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setUserDetails({
                      ...userDetails,
                      Last_Name: inputValue,
                    });
                    setContactErrors((prevErrors) => ({
                      ...prevErrors,
                      Last_Name: "",
                    }));
                  }}
                  placeholder="Type here...."
                />
                {contactErrors.Last_Name && (
                  <p className="text-red-500 font-inter font-medium text-xs pt-1">
                    {contactErrors.Last_Name}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full flex flex-col md:flex-row items-start md:gap-20 gap-1 md:mt-5 mt-1">
              <div className="md:w-[30%] w-full mb-3">
                <p className="font-poppins text-[14px] md:text-[16px] leading-[24px] font-medium text-[#b0b7c4]">
                  Email
                </p>
                <input
                  name="Email"
                  type="email"
                  className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                  value={userDetails.Email}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setUserDetails({
                      ...userDetails,
                      Email: inputValue,
                    });
                    setContactErrors((prevErrors) => ({
                      ...prevErrors,
                      Email: "",
                    }));
                  }}
                  disabled
                  placeholder="Type here...."
                />
                {contactErrors.Email && (
                  <p className="text-red-500 font-inter font-medium text-xs pt-1">
                    {contactErrors.Email}
                  </p>
                )}
              </div>
              <div className="md:w-[30%] w-full mb-3">
                <p className="font-poppins text-[14px] md:text-[16px] leading-[24px] font-medium text-[#b0b7c4]">
                  Contact Number
                </p>
                <input
                  name="Contact Number"
                  type="text"
                  className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                  onChange={(e) => {
                    setContactData({
                      ...contactData,
                      Contact_No: e.target.value,
                    });
                    setContactErrors({
                      ...contactErrors,
                      Contact_No: "",
                    });
                  }}
                  value={contactData.Contact_No}
                  placeholder="Type here...."
                />
                {contactErrors.Contact_No && (
                  <span className=" text-[#ff0000a1] px-1 font-inter font-bold text-xs">
                    {" "}
                    {contactErrors.Contact_No}{" "}
                  </span>
                )}
              </div>
            </div>
            <div className="poppins font-semibold text-[16px] leading-8 text-[#b0b7c4] mt-5">
              Address
            </div>
            <div className="w-full flex flex-col md:flex-row items-start md:gap-20 gap-1 md:mt-5 mt-3">
              <div className="w-full">
                <p className="font-poppins text-[12px] md:text-[14px] leading-[24px] font-medium text-[#b0b7c4]">
                  Line 1
                </p>
                <input
                  name="Contact Number"
                  type="text"
                  className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                  onChange={(e) => {
                    setContactData({
                      ...contactData,
                      Address1: e.target.value,
                    });
                    setContactErrors({
                      ...contactErrors,
                      Address1: "",
                    });
                  }}
                  value={contactData.Address1}
                  placeholder="Type here...."
                />
                {contactErrors.Address1 && (
                  <span className=" text-[#ff0000a1] px-1 font-inter font-bold text-xs">
                    {" "}
                    {contactErrors.Address1}{" "}
                  </span>
                )}
              </div>
              <div className="w-full">
                <p className="font-poppins text-[12px] md:text-[14px] leading-[24px] font-medium text-[#b0b7c4]">
                  Line 2
                </p>
                <input
                  name="Contact Number"
                  type="text"
                  className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                  onChange={(e) => {
                    setContactData({
                      ...contactData,
                      Address2: e.target.value,
                    });
                    setContactErrors({
                      ...contactErrors,
                      Address2: "",
                    });
                  }}
                  value={contactData.Address2}
                  placeholder="Type here...."
                />
                {contactErrors.Address2 && (
                  <span className=" text-[#ff0000a1] px-1 font-inter font-bold text-xs">
                    {" "}
                    {contactErrors.Address2}{" "}
                  </span>
                )}
              </div>
              <div className="w-full">
                <p className="font-poppins text-[12px] md:text-[14px] leading-[24px] font-medium text-[#b0b7c4]">
                  Line 3
                </p>
                <input
                  name="Contact Number"
                  type="text"
                  className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                  onChange={(e) => {
                    setContactData({
                      ...contactData,
                      Address3: e.target.value,
                    });
                    setContactErrors({
                      ...contactErrors,
                      Address3: "",
                    });
                  }}
                  value={contactData.Address3}
                  placeholder="Type here...."
                />
                {contactErrors.Address3 && (
                  <span className=" text-[#ff0000a1] px-1 font-inter font-bold text-xs">
                    {" "}
                    {contactErrors.Address3}{" "}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-5 md:mt-6 mt-7">
              <button
                className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] flex items-center justify-center gap-2 text-[#10275E] hover:opacity-80"
                type="button"
                onClick={() => handleContactSubmit()}
              >
                Save Account Details
              </button>
            </div>
          </form>
          <div className="mt-6">
            <div className="poppins font-semibold text-[16px] leading-8 text-[#64728C] mt-3">
              Password
            </div>
            <div className="w-full flex flex-col md:flex-row items-start md:gap-20 gap-1 md:mt-5 mt-3">
              <div className="w-full">
                <p className="font-poppins text-[12px] md:text-[14px] leading-[24px] font-medium text-[#b0b7c4]">
                  Current Password
                </p>
                <input
                  name="current-password"
                  type="password"
                  className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                  onChange={(e) => {
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    });
                    setPasswordErrors({
                      ...passwordErrors,
                      oldPassword: "",
                    });
                  }}
                  value={passwordData.oldPassword}
                  placeholder="● ● ● ● ● ●"
                />
                {passwordErrors.oldPassword && (
                  <span className=" text-[#ff0000a1] px-1 font-inter font-bold text-xs">
                    {" "}
                    {passwordErrors.oldPassword}{" "}
                  </span>
                )}
              </div>
              <div className="w-full">
                <p className="font-poppins text-[12px] md:text-[14px] leading-[24px] font-medium text-[#b0b7c4]">
                  New Password
                </p>
                <input
                  name="new-password"
                  type="password"
                  className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                  onChange={(e) => {
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    });
                    setPasswordErrors({
                      ...passwordErrors,
                      newPassword: "",
                    });
                  }}
                  value={passwordData.newPassword}
                />
                {passwordErrors.newPassword && (
                  <span className=" text-[#ff0000a1] px-1 font-inter font-bold text-xs">
                    {" "}
                    {passwordErrors.newPassword}{" "}
                  </span>
                )}
              </div>
              <div className="w-full">
                <p className="font-poppins text-[12px] md:text-[14px] leading-[24px] font-medium text-[#b0b7c4]">
                  Confirm New Password
                </p>
                <input
                  name="confirm-password"
                  type="password"
                  className="block rounded-[15px] border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 w-full text-[14px] md:text-[15px] font-normal font-poppins"
                  onChange={(e) => {
                    setPasswordData({
                      ...passwordData,
                      rePassword: e.target.value,
                    });
                    setPasswordErrors({
                      ...passwordErrors,
                      rePassword: "",
                    });
                  }}
                  value={passwordData.rePassword}
                />
                {passwordErrors.newPassword && (
                  <span className=" text-[#ff0000a1] px-1 font-inter font-bold text-xs">
                    {" "}
                    {passwordErrors.newPassword}{" "}
                  </span>
                )}
                {passwordErrors.matchPassword && (
                  <span className=" text-[#ff0000a1] px-1 font-inter font-bold text-xs">
                    {" "}
                    {passwordErrors.matchPassword}{" "}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-5 md:mt-6 mt-7">
              <button
                className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] flex items-center justify-center gap-2 text-[#10275E] hover:opacity-80"
                type="button"
                onClick={() => handlePasswordSubmit()}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer autoClose={1500} />
    </>
  );
};
