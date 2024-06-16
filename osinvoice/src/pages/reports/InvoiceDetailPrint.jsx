import { Card, CardBody } from "@material-tailwind/react";

export const InvoiceDetailPrint = ({ data }) => {
  const handleFormatData = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Use 24-hour format
    });
    return formattedDate;
  };

  // Calculate total amount
  const totalAmount = data?.filteredInvoice?.reduce((total, invoice) => {
    return total + parseFloat(invoice.Net_Amount);
  }, 0);

  return (
    <>
      <Card className="h-fit  rounded-none mx-3 md:mx-6 mr-3 font-inter">
        <CardBody className="flex flex-col items-center  py-10 ">
          <div className="md:w-[70%] flex items-center justify-center font-inter font-semibold text-[22px] pb-4 border-b-2 text-[#64728C]">
            Invoice Detail Report
          </div>
          <div className=" flex items-center justify-center font-inter font-normal text-[10px] mt-3 text-center">
            Generated {data?.current}
          </div>

          <div className="  flex items-center w-full  font-inter font-normal text-[10px] mt-3 ">
            <span className="w-[7%]"> From </span>
            <span>{data?.from_date}</span>
          </div>
          <div className=" flex items-center w-full  font-inter font-normal text-[10px] ">
            <span className="w-[7%]">To</span>
            <span>{data?.to_date}</span>
          </div>
          <div className=" flex items-center w-full font-inter font-normal text-[10px]  ">
            <span className="w-[7%]">Customer</span>
            <span>{data?.customer}</span>
          </div>
          <div className=" w-full">
            <table className="mt-10 table-auto w-full border-t-2">
              <thead className="border-b-2 border-l-2 bg-gray-100">
                <tr>
                  <th className="text-start text-[12px] md:text-sm  p-[6px] border-r-2 font-semibold font-inter text-gray-800">
                    Invoice
                  </th>
                  <th className="text-start text-[12px] md:text-sm  p-[6px] w-[200px] border-r-2 font-semibold font-inter text-gray-800 ">
                    Customer
                  </th>
                  <th className="text-start text-[12px] md:text-sm  p-[6px] border-r-2 font-semibold font-inter text-gray-800">
                    Date
                  </th>
                  <th className="text-start text-[12px] md:text-sm  p-[6px] border-r-2 font-semibold font-inter text-gray-800">
                    Total (LKR)
                  </th>
                  <th className="text-start text-[12px] md:text-sm  p-[6px] border-r-2 font-semibold font-inter text-gray-800">
                    Paid Amount (LKR)
                  </th>
                  <th className="text-start text-[12px] md:text-sm  p-[6px] border-r-2 font-semibold font-inter text-gray-800">
                    Balance (LKR)
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.filteredInvoice?.map((row, index) => {
                  return (
                    <tr className="border-b-2 border-l-2">
                      <td className="text-start text-sm p-[6px] border-r-2 font-normal font-inter text-gray-800">
                        {row.Invoice_Number}
                      </td>
                      <td className="text-start text-sm p-[6px] border-r-2 font-normal font-inter text-gray-800">
                        {row.Title} {row.Name}
                      </td>
                      <td className="text-start text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                        {handleFormatData(row.Date)}
                      </td>
                      <td className="text-right text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                        {parseFloat(row.Net_Amount).toFixed(2)}
                      </td>
                      <td className="text-right text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                        {parseFloat(row.Paid_Amount).toFixed(2)}
                      </td>
                      <td className="text-right text-sm  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                        {parseFloat(row.Balance_Amount).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mt-5">
              Total : LKR {parseFloat(totalAmount).toFixed(2)}
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};
