import React, { useRef, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { useReactToPrint } from "react-to-print";
import { TABLE_HEAD_ITEM } from "../../utils/tableArray";
import { PrintInvoice } from "./PrintInvoice";

export const ItemTable = () => {
  const [rowData, setRowData] = useState([
    // Initial row data, can be empty or pre-filled
    {
      column1: "",
      column2: "",
      column3: "",
      column4: "",
    },
  ]);

  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);

  const handleInputChange = (index, columnName, value) => {
    const updatedRowData = [...rowData];
    updatedRowData[index][columnName] = value;
    setRowData(updatedRowData);

    // If all fields in the last row are filled, add a new empty row
    const lastRow = updatedRowData[updatedRowData.length - 1];
    if (Object.values(lastRow).every((val) => val !== "")) {
      setRowData([
        ...updatedRowData,
        { column1: "", column2: "", column3: "", column4: "" },
      ]);
    }

    // Calculate amount for the current row
    const quantity = parseFloat(updatedRowData[index].column2);
    const unitPrice = parseFloat(updatedRowData[index].column3);
    const amount =
      isNaN(quantity) || isNaN(unitPrice) ? 0 : quantity * unitPrice;
    updatedRowData[index].column4 = amount.toFixed(2);

    // Calculate total amount
    const newTotalAmount = updatedRowData.reduce((acc, row) => {
      const rowAmount = parseFloat(row.column4);
      return isNaN(rowAmount) ? acc : acc + rowAmount;
    }, 0);
    setTotalAmount(newTotalAmount.toFixed(2));
  };

  const handleDiscountChange = (e) => {
    setDiscount(parseFloat(e.target.value));
  };

  const discountedAmount = totalAmount - discount;

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const printInvoice = () => {
    handlePrint();
  };

  return (
    <div className="pb-40 w-full">
      <div class="relative overflow-x-auto shadow-md">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead class="text-xs text-white uppercase bg-gray-800">
            <tr>
              {TABLE_HEAD_ITEM.map((head, index) => (
                <th scope="col" className="px-6 py-2">
                  <Typography variant="small">
                    {head} {index !== TABLE_HEAD_ITEM.length - 1}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowData.map((row, index) => (
              <tr key={index}>
                {Object.keys(row).map((column, columnIndex) => (
                  <td className="p-2" key={columnIndex}>
                    {columnIndex === 1 ? (
                      <input
                        type="number"
                        value={row[column]}
                        onChange={(e) =>
                          handleInputChange(index, column, e.target.value)
                        }
                        className="w-full border border-gray-300 p-1 focus:outline-none px-6"
                      />
                    ) : (
                      <input
                        type="text"
                        value={row[column]}
                        onChange={(e) =>
                          handleInputChange(index, column, e.target.value)
                        }
                        className="w-full border border-gray-300 p-1 focus:outline-none px-6"
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-full flex flex-col md:flex-row mt-6 justify-between gap-10">
        <div className="md:w-[45%]">
          <div className="flex flex-col gap-2">
            <span className="font-inter text-sm">Notes</span>
            <textarea className="border border-gray-300"></textarea>
          </div>
        </div>
        <div className="md:w-[35%] flex justify-between">
          <div className="flex flex-col gap-2">
            <div>Subtotal (LKR)</div>
            <div>Discount (LKR)</div>
            <div>Total (LKR)</div>
          </div>
          <div className="flex flex-col gap-2">
            <div>{totalAmount}</div>
            <div>
              <input
                type="number"
                id="discount"
                name="discount"
                value={discount.toFixed(2)}
                onChange={handleDiscountChange}
                className="border border-gray-300 p-1 focus:outline-none"
              />
            </div>
            <div>{discountedAmount.toFixed(2)}</div>
          </div>
        </div>
      </div>
      <div className=" flex justify-between md:flex-row flex-col w-full mt-5">
        <div className="md:w-[45%]">
          <div className="flex flex-col items-start gap-2">
            <span className="font-inter text-sm">Attach Files</span>
            <label
              htmlFor="fileInput"
              className="w-fit p-2 px-6 flex gap-2 items-center font-inter font-medium bg-[#10806f] hover:bg-[#9165A0] text-white text-[14px] transition-colors duration-500 cursor-pointer"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="w-5 h-5"
                >
                  <path d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z" />
                  <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                </svg>
              </span>
              <span className=" uppercase">Add</span>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                // onChange={handleFileInputChange}
              />
            </label>
          </div>
        </div>
        <div className="mt-20 flex gap-1">
          <button className=" w-fit flex gap-2 items-center p-2 px-3 mx-3 font-inter font-medium bg-[#10806f] hover:bg-[#9165A0] text-white text-[14px] md:text-[16px] transition-colors duration-500">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M2 3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2Z" />
                <path
                  fillRule="evenodd"
                  d="M2 7.5h16l-.811 7.71a2 2 0 0 1-1.99 1.79H4.802a2 2 0 0 1-1.99-1.79L2 7.5ZM7 11a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span className="">Save as Draft</span>
          </button>

          <button
            onClick={printInvoice}
            className=" w-fit flex gap-2 items-center p-2 px-3 font-inter font-medium bg-[#fc3c04] hover:bg-[#1c2c54] text-white text-[14px] md:text-[16px] transition-colors duration-500"
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
            <span>Save and Issue</span>
            <span style={{ display: "none" }}>
              <span ref={printRef}>
                <PrintInvoice />
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
