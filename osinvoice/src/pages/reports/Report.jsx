import { Card, CardBody } from "@material-tailwind/react";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { PrintSummary } from "./PrintSummary";

export const Report = () => {
  const currentDateTime = new Date();

  const formatDateTime = (date) => {
    const options = {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("en-US", options);
  };

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const printEstimate = () => {
    handlePrint();
  };
  return (
    <>
      <Card className="h-fit  rounded-none mx-3 md:mx-6 mr-3 font-inter">
        <CardBody className="flex flex-col items-center  py-10 ">
          <div className="md:w-[70%] flex items-center justify-center font-inter font-semibold text-3xl pb-4 border-b-2">
            Payment Summary
          </div>
          <div className=" flex items-center justify-center font-inter font-normal text-sm mt-3">
            Currency : LKR
          </div>
          <div className=" flex items-center justify-center font-inter font-normal text-sm mt-3 text-center">
            Generated {formatDateTime(currentDateTime)}
          </div>
          <div className="overflow-x-scroll w-full md:overflow-auto">
            <table className="mt-10 table-auto w-full border-t-2">
              <thead className="border-b-2 border-l-2 bg-gray-100">
                <tr>
                  <th className="text-start text-[12px] md:text-sm  p-[6px] border-r-2 font-semibold font-inter text-gray-800">
                    Customer
                  </th>
                  <th className="text-start text-[12px] md:text-sm  p-[6px] w-[200px] border-r-2 font-semibold font-inter text-gray-800 ">
                    #&nbsp;invoices
                  </th>
                  <th className="text-start text-[12px] md:text-sm  p-[6px] border-r-2 font-semibold font-inter text-gray-800">
                    0-7 days
                  </th>
                  <th className="text-start text-[12px] md:text-sm  p-[6px] border-r-2 font-semibold font-inter text-gray-800">
                    8-14 days
                  </th>
                  <th className="text-start text-[12px] md:text-sm  p-[6px] border-r-2 font-semibold font-inter text-gray-800">
                    15&nbsp;-&nbsp;30&nbsp;days
                  </th>
                  <th className="text-start text-[12px] md:text-sm  p-[6px] border-r-2 font-semibold font-inter text-gray-800">
                    31-60 days
                  </th>
                  <th className="text-start text-[12px] md:text-sm  p-[6px] border-r-2 font-semibold font-inter text-gray-800">
                    61+ days
                  </th>
                  <th className="text-start text-[12px] md:text-sm  p-[6px] border-r-2 font-semibold font-inter text-gray-800">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b-2 border-l-2">
                  <td className="text-start text-sm p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    Narada Perera
                  </td>
                  <td className="text-start text-sm p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    2
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 5000.00
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 5000.00
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800"></td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 2000.00
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 1500.00
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 13500.00
                  </td>
                </tr>
                <tr className="border-b-2 border-l-2">
                  <td className="text-start text-sm p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    Narada Perera
                  </td>
                  <td className="text-start text-sm p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    2
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 5000.00
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 5000.00
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800"></td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 2000.00
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 1500.00
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 13500.00
                  </td>
                </tr>
                <tr className="border-b-2 border-l-2">
                  <td className="text-start text-sm p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    Narada Perera
                  </td>
                  <td className="text-start text-sm p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    2
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 5000.00
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 5000.00
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800"></td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 2000.00
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 1500.00
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 13500.00
                  </td>
                </tr>
                <tr className="border-b-2 border-l-2">
                  <td className="text-start text-sm p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    Narada Perera
                  </td>
                  <td className="text-start text-sm p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    2
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 5000.00
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 5000.00
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800"></td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 2000.00
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 1500.00
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 13500.00
                  </td>
                </tr>
                <tr className="border-b-2 border-l-2">
                  <td className="text-start text-sm p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    Narada Perera
                  </td>
                  <td className="text-start text-sm p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    2
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 5000.00
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 5000.00
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800"></td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 2000.00
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 1500.00
                  </td>
                  <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                    LKR 13500.00
                  </td>
                </tr>

                {/* dont delete this tr  */}
                <tr>
                  <td className="text-start text-sm font-medium font-inter text-gray"></td>
                  <td className="text-start text-[15px] font-medium p-[6px] font-inter text-black">
                    10
                  </td>
                  <td className="text-start text-[15px] font-medium p-[6px] font-inter text-black">
                    LKR 25000.00
                  </td>
                  <td className="text-start text-[15px] font-medium p-[6px] font-inter text-black">
                    LKR 25000.00
                  </td>
                  <td className="text-start text-[15px] font-medium p-[6px] font-inter text-black"></td>
                  <td className="text-start text-[15px] font-medium p-[6px] font-inter text-black">
                    LKR 10000.00
                  </td>
                  <td className="text-start text-[15px] font-medium p-[6px] font-inter text-black">
                    LKR 7500.00
                  </td>
                  <td className="text-start text-[15px] font-medium p-[6px] font-inter text-black">
                    LKR 135000.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className=""></div>

          <div className=" flex justify-end md:flex-row flex-col w-full mt-5">
            <div className="mt-3 md:flex gap-1">
              <button
                onClick={printEstimate}
                className=" md:w-fit w-full md:mt-0 mt-6 md:p-2 flex gap-2 items-center p-3 px-3 font-inter font-medium bg-[#fc3c04] hover:bg-[#9165A0] text-white text-[14px] md:text-[16px] transition-colors duration-500"
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 2.75C5 1.784 5.784 1 6.75 1h6.5c.966 0 1.75.784 1.75 1.75v3.552c.377.046.752.097 1.126.153A2.212 2.212 0 0 1 18 8.653v4.097A2.25 2.25 0 0 1 15.75 15h-.241l.305 1.984A1.75 1.75 0 0 1 14.084 19H5.915a1.75 1.75 0 0 1-1.73-2.016L4.492 15H4.25A2.25 2.25 0 0 1 2 12.75V8.653c0-1.082.775-2.034 1.874-2.198.374-.056.75-.107 1.127-.153L5 6.25v-3.5Zm8.5 3.397a41.533 41.533 0 0 0-7 0V2.75a.25.25 0 0 1 .25-.25h6.5a.25.25 0 0 1 .25.25v3.397ZM6.608 12.5a.25.25 0 0 0-.247.212l-.693 4.5a.25.25 0 0 0 .247.288h8.17a.25.25 0 0 0 .246-.288l-.692-4.5a.25.25 0 0 0-.247-.212H6.608Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span>Print Payment Summary</span>
              </button>
              <span style={{ display: "none" }}>
                <span ref={printRef}>
                  <PrintSummary />
                </span>
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};
