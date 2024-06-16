import { Card, CardBody } from "@material-tailwind/react";

export const PrintSummary = ({ data }) => {
  return (
    <>
      <Card className="h-fit  rounded-none mx-3 md:mx-6 mr-3 font-inter">
        <CardBody className="flex flex-col items-center  py-10 ">
          <div className="md:w-[70%] flex items-center justify-center font-inter font-semibold text-3xl pb-4 border-b-2">
            P & L Report
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
          <div className="flex flex-col rounded-md overflow-hidden mb-3 shadow-md w-full border-l-[0.5px] border-t-[0.5px] border-r-[0.5px] border-blue-gray-300 bg-blue-gray-50/50 mt-10">
            <div className="flex w-full border-b-[0.5px] items-center border-blue-gray-300">
              <div className="h-full w-[40%] p-1 uppercase border-r-[0.5px] border-blue-gray-300  font-inter font-semibold text-[14px] text-blue-gray-600 pl-[5%]">
                Damage Total
              </div>
              <div className="w-[60%] p-1 font-inter font-semiboldtext-[14px] text-blue-gray-600 text-right pr-[20%]">
                {data.damageTotal ? data.damageTotal.toFixed(2) : "0"}
              </div>
            </div>
            <div className="flex w-full border-b-[0.5px] items-center border-blue-gray-300">
              <div className="h-full w-[40%] p-1 uppercase border-r-[0.5px] border-blue-gray-300  font-inter font-semibold text-[14px] text-blue-gray-600 pl-[5%]">
                Expenses Total
              </div>
              <div className="w-[60%] p-1 font-inter font-semiboldtext-[14px] text-blue-gray-600 text-right pr-[20%]">
                {data.expensesTotal ? data.expensesTotal.toFixed(2) : "0"}
              </div>
            </div>
            <div className="flex w-full border-b-[0.5px] items-center border-blue-gray-300">
              <div className="h-full w-[40%] p-1 uppercase border-r-[0.5px] border-blue-gray-300  font-inter font-semibold text-[14px] text-blue-gray-600 pl-[5%]">
                Invoice Total
              </div>
              <div className="w-[60%] p-1 font-inter font-semiboldtext-[14px] text-blue-gray-600 text-right pr-[20%]">
                {data.invoiceTotal ? data.invoiceTotal.toFixed(2) : "0"}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};
