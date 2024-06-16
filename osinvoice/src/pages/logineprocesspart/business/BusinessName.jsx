import React from "react";
import { Link } from "react-router-dom";

export const BusinessName = () => {
  return (
    <>
      <div className="px-32 py-3 xl:text-[18px] font-semibold"></div>
      <section className="flex flex-col items-center w-full p-[5%] py-[10%]">
        <div className="md:w-[60%] rounded-[30px] flex flex-col  gap-10 ">
          <div className="items-start justify-start ">
            <div className=" justify-start text-[#64728C] text-[20px] font-semibold leading-[30px] md:text-[30px] md:leading-[45px] pb-2">
              What's Your Business Name?
            </div>

            <div className=" text-[16px] font-semibold text-left text-[#64728C] leading-[22px] md:text-[18px] md:leading-[25px] ">
              Legal Business Name
            </div>
          </div>
          <div className="flex flex-col w-full gap-12 xl:pt-8">
            <input
              type="text"
              className="w-full bg-[#ffffff] cursor-pointer rounded-[20px] py-[12px] text-[#64728C] p-4 flex flex-col items-center justify-center border font-normal border-[#64728C80] border-opacity-50"
              placeholder="Business Name"
            />

            <div className="border-b-2 border-[#64728C33]"></div>

            <div className="inline-flex justify-start gap-4 items-left "
            >
              <Link to="/welcome" className="  hover:bg-[#461058] bg-white xl:text-xl text-[#64728C]  border-2 border-[#64728C] rounded-[10px] text-sm font-bold leading-10 xl:leading-16 xl:px-6 xl:py-2">
                Back
              </Link>
              <Link to="/business" className="mr-2 bg-[#7335E5] hover:bg-[#461058] xl:text-xl rounded-[10px]  text-white text-sm font-bold leading-10 xl:leading-16 xl:px-6 xl:py-2">
                Next
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
