import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, Navigate, useLocation } from "react-router-dom";
import {
  Burger,
  SearchIcon,
  BellIcon,
  HelpCircleIcon,
  ArrowBack,
  AiChat,
} from "../../utils/icons";
import { SideBar } from "./SideBar";
import { Tooltip } from "@material-tailwind/react";
import { UserIcon } from "@heroicons/react/24/solid";
import { useStateContext } from "../../contexts/NavigationContext";
import { subPathLinks } from "../../utils/dataArrays";

export const MainLayout = ({ selectedItem }) => {
  const [signOutVisible, setSignOutVisible] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const dropdownRef = useRef(null);
  const sideBardownRef = useRef(null);
  const sideBarButtondownRef = useRef(null);
  const { token, setUser, setToken, showSalesman } = useStateContext();

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const toggleSidebarExpand = () => {
    setSidebarExpanded((cur) => !cur);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSignOutVisible(false);
      }

      if (
        sideBardownRef.current &&
        !sideBardownRef.current.contains(event.target)
      ) {
        if (
          sideBarButtondownRef.current &&
          sideBarButtondownRef.current.contains(event.target)
        ) {
          setSidebar(true);
        } else {
          setSidebar(false);
        }
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const location = useLocation();
  const { user } = useStateContext();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userString = queryParams.get("user");
    const token = queryParams.get("token");
    if (userString) {
      const user = JSON.parse(userString);
      setUser(user);
      setToken(token);
    }
  }, [location.search]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  const handleSidebar = () => {
    setSidebar((pre) => !pre);
  };

  let mainPath = "";
  let subPaths = "";
  const pathParts = location.pathname.split("/");
  const id = pathParts[3];

  switch (location.pathname) {
    case "/":
      mainPath = "Dashboard";
      subPaths = [];
      break;
    case "/customers":
    case "/customer-credit-logs":
    case "/customer-returns":
      mainPath = "Customers";
      subPaths = [
        "Manage Customers",
        "Customer Credit Log",
        "Customer Returns",
      ];
      break;
    case "/customer/add":
      mainPath = "Customers / Manage Customer";
      subPaths = ["Back", "New Customer"];
      break;
    case `/customer/edit/${id}`:
      mainPath = "Customers / Manage Customer";
      subPaths = ["Back", "Edit Customer"];
      break;
    case "/customer-returns/add":
      mainPath = "Customers / Customer Returns";
      subPaths = ["Back", "New Customer Return"];
      break;
    case `/customer-returns/edit/${id}`:
      mainPath = "Customers / Customer Returns";
      subPaths = ["Back", "Edit Customer Return"];
      break;
    case "/quotation":
      mainPath = "Quotation";
      subPaths = [];
      break;
    case "/quotation/new":
      mainPath = "Quotations";
      subPaths = ["Back", "New Quotation"];
      break;
    case "/invoices":
      mainPath = "Invoices";
      subPaths = [];
      break;
    case "/invoices/new":
      mainPath = "Invoices";
      subPaths = ["Back", "New Invoice"];
      break;
    case "/duepayment":
      mainPath = "Due Payments";
      subPaths = [];
      break;
    case "/products":
    case "/grn":
      mainPath = "Stocks";
      subPaths = ["Manage Products", "GRN"];
      break;
    case "/product/add":
      mainPath = "Stocks / Manage Products";
      subPaths = ["Back", "New Product"];
      break;
    case `/product/edit/${id}`:
      mainPath = "Stocks / Manage Products";
      subPaths = ["Back", "Edit Product"];
      break;
    case "/grn/add":
      mainPath = "Stocks / GRN";
      subPaths = ["Back", "New GRN"];
      break;
    case `/grn/edit/${id}`:
      mainPath = "Stocks / GRN";
      subPaths = ["Back", "Edit GRN"];
      break;
    case "/suppliers":
    case "/supplier-credit-logs":
    case "/purchase-returns":
      mainPath = "Suppliers";
      subPaths = [
        "Manage Suppliers",
        "Supplier Credit Logs",
        "Purchase Returns",
      ];
      break;
    case "/supplier/add":
      mainPath = "Suppliers / Manage Suppliers";
      subPaths = ["Back", "New Supplier"];
      break;
    case `/supplier/edit/${id}`:
      mainPath = "MSuppliers / Manage Suppliers";
      subPaths = ["Back", "Edit Supplier"];
      break;
    case "/purchase-returns/add":
      mainPath = "Suppliers / Purchase Returns";
      subPaths = ["Back", "New Purchase Return"];
      break;
    case `/purchase-returns/edit/${id}`:
      mainPath = "Suppliers / Purchase Returns";
      subPaths = ["Back", "Edit Purchase Return"];
      break;
    case "/salesman":
      mainPath = "Salesman";
      subPaths = [];
      break;
    case `/salesman/add`:
      mainPath = "Salesman";
      subPaths = ["Back", "New Salesman"];
      break;
    case `/salesman/edit/${id}`:
      mainPath = "Salesman";
      subPaths = ["Back", "Edit Salesman"];
      break;
    case "/wallet":
      mainPath = "Wallet";
      subPaths = [];
      break;
    case "/reports":
      mainPath = "Reports";
      subPaths = [];
      break;
    case "/reports/item-detail-report":
      mainPath = "Reports";
      subPaths = ["Back", "Item Detail Report"];
      break;
    case "/reports/customer-credit-report":
      mainPath = "Reports";
      subPaths = ["Back", "Customer Credit Report"];
      break;
    case "/reports/invoice-detail-report":
      mainPath = "Reports";
      subPaths = ["Back", "Invoice Detail Report"];
      break;
    case "/stock-card":
      mainPath = "Reports";
      subPaths = ["Back", "Stock Card"];
      break;
    case "/pl-report":
      mainPath = "Reports";
      subPaths = ["Back", "Profit & Lost Report"];
      break;
    case "/account":
      mainPath = "My Account";
      subPaths = [];
      break;
    case "/notifications":
      mainPath = "Notifications";
      subPaths = [];
      break;
    case "/ai-chat":
      mainPath = "AiChat";
      subPaths = [];
      break;
    case "/settings":
      mainPath = "Settings";
      subPaths = [];
      break;
    default:
      break;
  }

  return (
    <section className="bg-[#f0eff5] w-full min-h-screen flex">
      <div ref={sideBardownRef} className="">
        <SideBar
          handleSidebar={handleSidebar}
          sidebar={sidebar}
          handleLogout={handleLogout}
          sidebarExpanded={sidebarExpanded}
          toggleSidebarExpand={toggleSidebarExpand}
          showSalesman={showSalesman}
        />
      </div>

      <section
        className={`w-full flex flex-col transition-all duration-300 ease-in-out ${
          sidebarExpanded
            ? "md:ml-[15%] md:w-[85%]"
            : "md:ml-[80px] md:w-w-full"
        }`}
        style={{
          transition: "margin-left 0.5s ease-in-out",
        }}
      >
        <div className="relative rounded-none bg-[#7335E5] w-full py-3 md:pl-[2%] pl-[3%] md:pr-[2%] pr-[3%] flex flex-row justify-between items-center md:before:w-[35px] md:before:h-[35px] md:before:content-[''] md:before:bg-[#7335E5] md:before:absolute md:before:left-[-35px] md:before:top-0">
          <div>
            <div ref={sideBarButtondownRef} className="flex md:hidden">
              <Tooltip content="Sidebar">
                <div onClick={handleSidebar}>
                  <Burger className="w-4 h-4 text-white" />
                </div>
              </Tooltip>
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="block md:hidden"></div>
            <div className="font-poppins text-white font-medium text-[24px] leading-9 hidden md:block">
              {mainPath}
            </div>
            <div className="flex items-center justify-between">
              <div className="relative hidden md:block w-[250px]">
                <i className="absolute text-white transform -translate-y-1/2 left-3 top-1/2">
                  <SearchIcon />
                </i>
                <input
                  type="text"
                  className="w-full bg-[#9567E8] placeholder:text-white placeholder:text-[12px] placeholder:font-poppins placeholder:font-semibold placeholder:leading-[18px] pl-10 pr-3 py-2 rounded-[15px] focus:outline-none focus:border-transparent"
                  placeholder="Search here..."
                />
              </div>
              <Link to="/ai-chat">
                <div className="relative hidden md:block ml-5 mr-5">
                  <i className="absolute text-white transform -translate-y-1/2 left-0 -ml-2 top-1/2">
                    <AiChat />
                  </i>
                </div>
              </Link>

              <Tooltip content="View Notifications">
                <div className="bg-[#9567E8] md:px-4 md:py-3 px-3 py-3 rounded-[20px] ml-8">
                  <Link to="/notifications">
                    <BellIcon className="w-4 h-4 text-white" />
                  </Link>
                </div>
              </Tooltip>
              <div className="relative" ref={dropdownRef}>
                <Link to="/account" className="flex items-center gap-2 ml-2">
                  <div className="ml-2 bg-gray-500 rounded-full w-fit">
                    <UserIcon className="w-12 h-12 text-white md:h-12 md:w-12" />
                  </div>
                  <div className="hidden md:block">
                    <span className="font-poppins font-semibold text-[14px] leading-[16px] text-white">
                      {user.First_Name != ""
                        ? `${user.First_Name} ${user.Last_Name}`
                        : user.userName}
                    </span>
                    <br />
                  </div>
                </Link>

                {signOutVisible && (
                  <div className="absolute top-12 right-5 bg-white w-[150px] flex flex-col items-start p-3 z-10 shadow-md border-[1px] border-grey-800">
                    <Link
                      to="/account"
                      className="w-full"
                      onClick={() => setSignOutVisible(!signOutVisible)}
                    >
                      <div className="w-full py-2 border-b-2 cursor-pointer font-inter">
                        My Account
                      </div>
                    </Link>
                    <div className="w-full" onClick={handleLogout}>
                      <div className="py-2 cursor-pointer font-inter">
                        Sign Out
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white flex items-center justify-between py-2 md:px-[2%] px-[3%]">
          <div className="flex items-center justify-between gap-2 md:gap-5">
            {subPaths.map((path, index) =>
              path === "Back" ? (
                <div key={index} className="border-r border-[#DDDDDD] pr-5">
                  <a href="#" onClick={() => window.history.back()}>
                    <button className="bg-[#F6FBFF] text-[#64728C] font-poppins font-normal text-[12px] md:text-[14px] leading-[21px] text-center py-1.5 px-1 md:px-3 rounded-[15px] transition-all duration-300">
                      <ArrowBack className="w-4 h-4 mr-1" />
                    </button>
                  </a>
                </div>
              ) : (
                <Link key={index} to={subPathLinks[path]}>
                  <button
                    className={`bg-[#F6FBFF] text-[#64728C] font-poppins font-normal text-[12px] md:text-[14px] leading-[21px] text-center py-1.5 px-1 md:px-3 rounded-[15px] transition-all duration-300 ${
                      location.pathname.includes(subPathLinks[path])
                        ? "bg-[#FFF2E9] text-[#F35E17]"
                        : ""
                    }`}
                  >
                    {path}
                  </button>
                </Link>
              )
            )}
          </div>
          <div className="border-l border-[#DDDDDD] hidden md:flex">
            <div className="bg-[#f5f5f5] md:px-4 md:py-3 px-2 py-2 rounded-[20px] md:ml-8 ml-4 w-fit">
              <Link to="#">
                <HelpCircleIcon className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex gap-5 flex-col md:px-[2%] px-[3%]">
          <Outlet />
        </div>
      </section>
    </section>
  );
};
