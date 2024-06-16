import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionHeader, AccordionBody } from '@material-tailwind/react';
import { LogoItems } from './../../../utils/dataArrays';
import { ArrDownIcon, ArrUpIcon } from './../../../utils/icons';


import prw1 from './../../../assets/images/A4 - 1.png';

const AddLogo = () => {
  const [open, setOpen] = useState(1);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <>
      <section className="px-[5%] md:px-[7%] pt-[100px] pb-20">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="flex w-full md:w-[50%] h-full justify-start">
            <img src={prw1} alt="Preview Image" />
          </div>
          <div className="w-full pl-0 md:pl-5 md:w-[50%]">
          <div
            
            className="flex-col md:flex-row justify-between items-center font-lexend-deca font-medium md:text-[30px] md:leading-[45px] text-[#64728C]"
          >
            Personalize your invoice template
            <div className="mt-4">
              <div className="md:text-[18px] md:leading-[25px] text-[#64728C] font-semibold">
                Make it as unique as you are.
              </div>
              </div>
              </div>
            {LogoItems
        .map((faq, faqIndex) => {
              let turn = faqIndex + 1;
              return (
                <FqaItem
                  key={turn}
                  open={open}
                  turn={turn}
                  handleOpen={handleOpen}
                  title={faq.title}
                  des={faq.des}
                />
              );
            })}
          </div>
        </div>
      </section>
      <div className="w-full overflow-x-hidden pt-0 pb-[8%]  px-[3%] md:px-[7%] flex flex-col md:flex-row justify-between items-center ">
        
        <div className="flex items-center justify-start gap-4 ">
          <Link to="/newpages" className="inline-flex items-center">
            <button className="hover:bg-[#461058] bg-white md:text-xl text-[#64728C] border-2 border-[#64728C]  text-sm font-bold leading-10 md:leading-16 md:px-6 md:py-2">
              Back
            </button>
          </Link>
          <Link to="/nextpages" className="inline-flex items-center">
            <button className="mr-2 bg-[#7335E5] hover:bg-[#461058] xl:text-xl rounded-[10px] text-white text-sm font-bold leading-10 md:leading-16 md:px-6 md:py-2">
              Next
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

const FqaItem = ({ open, turn, handleOpen, title, des }) => {
  return (
    <div className="w-full mt-[4%]">
      <Accordion open={open === turn} className="bg-[#ffffff] border-b-2 border-[#BABABAC7]">
        <AccordionHeader onClick={() => handleOpen(turn)} className="border-none">
          <div className="relative flex items-center justify-between w-full gap-3 bg-[#ffffff]">
            <span className="flex items-center text-base font-normal leading-6 text-[#64728C]  md:text-[24px] md:leading-[30px]">
              <span className="">{title}</span>
            </span>
            <span>{open === turn ? <ArrUpIcon /> : <ArrDownIcon />}</span>
          </div>
          <div className="border-b-2 border-[#64728C33]"></div>
        </AccordionHeader>
        <AccordionBody className="">
          <div className="relative flex items-center justify-between w-full gap-5">
            <span className="text-[#64728C]  font-normal text-base leading-6 md:text-[18px] md:leading-[25px] w-full">
              {des}
            </span>
          </div>
        </AccordionBody>
      </Accordion>
      
    </div>
  );
};

export default AddLogo;











