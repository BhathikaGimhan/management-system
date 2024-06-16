import prw1 from "./../../../assets/images/A4 - 1.png"; 
import { Link } from "react-router-dom";

export const PreviewPage = () => {
  return (
    <>
    <section className="px-[5%] md:px-[7%] pt-[100px]  pb-20">
      <div className="flex flex-col justify-between gap-10 md:flex-row">
        <div className="flex w-full md:w-[50%] h-full justify-start">
          
            <img src={prw1} />
          
        </div>
        <div className="w-full pl-0 md:pl-5 md:w-[50%]">
          <div>
          <div
            
            className="flex-col md:flex-row justify-between items-center font-lexend-deca font-medium md:text-[30px] md:leading-[45px] text-[#64728C]"
          >
            Now, preview what your customer will see
            <div className="mt-6">
              <div className="md:text-[18px] md:leading-[25px] text-[#64728C] font-semibold">
                Send yourself a sample invoice and see how it’ll look in your customer’s inbox.
              </div>
              <div className="mt-6">
                <div className="border-b-2 border-[#64728C33]"></div>
              </div>
            </div>
          </div>
          
          <div
           
            className=" flex-col md:flex-row justify-between items-center mt-[2%] font-lexend-deca font-normal text-[16px] leading-[30px] md:text-[20px] md:leading-[30px] text-[#64728C]"
          >
            Email yourself a sample invoice

            <div className="mt-6">
              <div className="md:text-[16px] md:leading-[22px] text-[#64728C] font-semibold">Subject</div>
              <div>
                <div className="mt-6 font-medium text-[18px] leading-[27px]">Invoice 0001 from Optimize Solutions</div>
              </div>

              <div className="mt-6 md:text-[16px] md:leading-[22px] text-[#64728C] font-semibold">From</div>
              <div className="mt-6 font-medium text-[18px] leading-[27px]">optimizesolutions@gmail.com</div>
              <div className="mt-6 md:text-[16px] md:leading-[22px] text-[#64728C] font-semibold">Send to your Email</div>
            </div>
            <div className="flex flex-row items-center justify-between w-[80%] md:pt-8">
              <input
                type="text"
                className="w-[70%] bg-[#ffffff] cursor-pointer rounded-[10px] py-[8px] text-[#64728C] p-1 border font-normal border-[#64728C80] border-opacity-50"
                placeholder="optimizesolutions@gmail.com"
              />
              <button className="hover:bg-[#461058] bg-white md:text-[18px] text-[#64728C] border border-[#64728C] rounded-[20px] text-sm font-bold leading-10 md:leading-[24px] md:px-6 md:py-2">
                Send
              </button>
            </div>
          </div>
          </div>
          
          
        </div>
      </div>
      <div className="w-full  overflow-x-hidden pt-0 pb-[4%] md:py-[4%] flex flex-col md:flex-row justify-start items-start font-lexend-deca">
        
        <div className="flex items-center justify-start gap-4 ">
          <Link to="/colorlogo" className="inline-flex items-center">
            <button className="hover:bg-[#461058] bg-white xl:text-xl text-[#64728C] border-2 border-[#64728C] rounded-[10px] text-sm font-bold leading-10 xl:leading-16 xl:px-6 xl:py-2">
              Back
            </button>
          </Link>
          <Link to="/getstarted" className="inline-flex items-center">
            <button className="mr-2 bg-[#7335E5] hover:bg-[#461058] xl:text-xl rounded-[10px] text-white text-sm font-bold leading-10 xl:leading-16 xl:px-6 xl:py-2">
              Next
            </button>
          </Link>
        </div>
        
      </div>
    </section>
    
    </>
  );
};
