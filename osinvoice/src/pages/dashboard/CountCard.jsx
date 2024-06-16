import React from "react";
import {
  InvoiceCountIcon,
  CustomerCountIcon,
  SupplierCountIcon,
  PendingCountIcon,
  GoingUpArrow,
  GoingDownIcon,
} from "../../utils/icons";

export const CountCard = ({ data }) => {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:justify-between mt-8 gap-5">
        <div className="md:w-[24%] w-full bg-white rounded-[15px] p-5">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-3">
              <div className="font-nunito text-[16px] text-[#202224] font-semibold leading-[22px]">
                Invoice Count
              </div>
              <div className="font-nunito font-bold text-[28px] leading-[38px]">
                {data.invoice_count}
              </div>
            </div>
            <div className="p-3 rounded-[20px] bg-[#e5e4ff]">
              <InvoiceCountIcon />
            </div>
          </div>
          <div className="flex items-center mt-5 gap-2">
            <GoingUpArrow />
            <div className="font-nunito text-[16px] leading-[22px]">
              <span className="text-[#00B69B]">8.5%</span> Up from yesterday
            </div>
          </div>
        </div>
        <div className="md:w-[24%] w-full bg-white rounded-[15px] p-5">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-3">
              <div className="font-nunito text-[16px] text-[#202224] font-semibold leading-[22px]">
                Customer Count
              </div>
              <div className="font-nunito font-bold text-[28px] leading-[38px]">
                {data.customer_count}
              </div>
            </div>
            <div className="p-3 rounded-[20px] bg-[#fff3d6]">
              <CustomerCountIcon />
            </div>
          </div>
          <div className="flex items-center mt-5 gap-2">
            <GoingUpArrow />
            <div className="font-nunito text-[16px] leading-[22px]">
              <span className="text-[#00B69B]">1.3%</span> Up from past week
            </div>
          </div>
        </div>
        <div className="md:w-[24%] w-full bg-white rounded-[15px] p-5">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-3">
              <div className="font-nunito text-[16px] text-[#202224] font-semibold leading-[22px]">
                Supplier Count
              </div>
              <div className="font-nunito font-bold text-[28px] leading-[38px]">
                {data.supplier_count}
              </div>
            </div>
            <div className="p-3 rounded-[20px] bg-[#d9f7e8]">
              <SupplierCountIcon />
            </div>
          </div>
          <div className="flex items-center mt-5 gap-2">
            <GoingDownIcon />
            <div className="font-nunito text-[16px] leading-[22px]">
              <span className="text-[#F93C65]">1.3%</span> Down from past week
            </div>
          </div>
        </div>
        <div className="md:w-[24%] w-full bg-white rounded-[15px] p-5">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-3">
              <div className="font-nunito text-[16px] text-[#202224] font-semibold leading-[22px]">
                Today Invoice Count
              </div>
              <div className="font-nunito font-bold text-[28px] leading-[38px]">
                {data.invoice_count}
              </div>
            </div>
            <div className="p-3 rounded-[20px] bg-[#ffded1]">
              <PendingCountIcon />
            </div>
          </div>
          <div className="flex items-center mt-5 gap-2">
            <GoingUpArrow />
            <div className="font-nunito text-[16px] leading-[22px]">
              <span className="text-[#00B69B]">1.3%</span> Up from past
              yesterday
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
