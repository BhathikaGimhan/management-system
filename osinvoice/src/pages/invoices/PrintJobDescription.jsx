import { Card, CardBody } from "@material-tailwind/react";

export const PrintJobDescription = ({ data }) => {
  return (
    <>
      <Card className="print-page h-fit  rounded-none mx-3 font-inter my-10">
        <CardBody className="flex flex-col gap-5 p-5 border border-gray-300 ">
          <div className="flex items-start justify-between">
            <div>
              <img
                src={data?.address?.Logo}
                alt="logo"
                className="md:w-[13%] w-[35%] h-auto"
              />
            </div>
            <div className="flex flex-col justify-end">
              <span className="font-poppins font-medium text-[24px] leading-9 text-[#64728C]">
                SERVICE DESCRIPTION
              </span>
              <span className="font-poppins font-medium text-[20px] leading-8 text-[#7335E5]">
                #{data?.data?.invoice?.Invoice_Number}
              </span>
            </div>
          </div>
          <div className="w-full flex justify-between items-start">
            <div>
              <div className="font-poppins font-normal text-[16px] leading-[22px] text-[#64728C]">
                {data?.address?.Address1},<br />
                {data?.address?.Address2}, <br />
                {data?.address?.Address3},<br />
                {data?.address?.Contact_No}
              </div>
            </div>
          </div>
          <div className="flex w-full gap-5 mt-5">
            <div className="flex flex-col">
              <div className="font poppins font-medium text-[16px] text-[#64728C]">
                Date
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font poppins font-medium text-[16px] text-[#64728C]">
                {data?.data?.invoice?.Date}
              </div>
            </div>
          </div>
          <table className="bg-[#D9D9D9] bg-opacity-20">
            <tr className="border-b border-[#64728C] border-opacity-10">
              <td className="font poppins font-semibold text-[16px] text-[#64728C] whitespace-nowrap py-2 px-3">
                Customer Name
              </td>
              <td className="font poppins font-medium text-[16px] text-[#64728C] py-2 px-3">
                {data?.data?.invoice?.Name}
              </td>
            </tr>
            <tr className="border-b border-[#64728C] border-opacity-10">
              <td className="font poppins font-semibold text-[16px] text-[#64728C] whitespace-nowrap py-2 px-3">
                Contact No
              </td>
              <td className="font poppins font-medium text-[16px] text-[#64728C] py-2 px-3">
                {data?.data?.invoice?.Tp}
              </td>
            </tr>
            <tr className="border-b border-[#64728C] border-opacity-10">
              <td className="font poppins font-semibold text-[16px] text-[#64728C] whitespace-nowrap py-2 px-3">
                Note
              </td>
              <td className="font poppins font-medium text-[16px] text-[#64728C] py-2 px-3">
                {data?.data?.invoice?.Note}
              </td>
            </tr>
            <tr className="border-b border-[#64728C] border-opacity-10">
              <td className="font poppins font-semibold text-[16px] text-[#64728C] whitespace-nowrap py-2 px-3">
                Total (LKR)
              </td>
              <td className="font poppins font-medium text-[16px] text-[#64728C] py-2 px-3">
                {parseFloat(data?.data?.invoice?.Net_Amount).toLocaleString(
                  "en-US",
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                )}
              </td>
            </tr>
            <tr className="border-b border-[#64728C] border-opacity-10">
              <td className="font poppins font-semibold text-[16px] text-[#64728C] whitespace-nowrap py-2 px-3">
                Paid Amount (LKR)
              </td>
              <td className="font poppins font-medium text-[16px] text-[#64728C] py-2 px-3">
                {parseFloat(data?.data?.invoice?.Paid_Amount).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </td>
            </tr>
            <tr>
              <td className="font poppins font-semibold text-[16px] text-[#64728C] whitespace-nowrap py-2 px-3">
                Credit Balance
              </td>
              <td className="font poppins font-medium text-[16px] text-[#64728C] py-2 px-3">
                {parseFloat(data?.data?.invoice?.Credit_Balance).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </td>
            </tr>
          </table>
          <div className="flex mt-5 flex-wrap justify-end">
            <div className="flex justify-center items-center flex-col mt-3">
              <div className="text-[16px] flex justify-center">
                ............................
              </div>
              <div className="text-[16px] font-normal font-poppins">
                Signature
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};
