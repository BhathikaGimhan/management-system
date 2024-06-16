import React, { useState } from "react";
import { Card, Typography, CardBody } from "@material-tailwind/react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

import { PLSummary } from "./PLSummary";
import { PLInvoices } from "./PLInvoices";
import { PLDamages } from "./PLDamages";
import { PLExpenses } from "./PLExpenses";

export const PLReport = () => {
  const [activeTab, setActiveTab] = useState("Summary"); // Initialize with "Summary"

  const [productTableLoading, setProductTableLoading] = useState(false);
  const handleLoading = () => setProductTableLoading((pre) => !pre);

  const data = [
    {
      label: "Summary",
      value: "Summary",
    },
    {
      label: "Invoices",
      value: "Invoices",
    },
    {
      label: "Expenses",
      value: "Expenses",
    },
    {
      label: "Damages",
      value: "Damages",
    },
  ];

  return (
    <>
      <section className="mt-8 mb-10">
        <div className="w-full bg-white rounded-[15px] px-[30px] pt-[28px] pb-[40px]">
          <div className="w-full pb-3 md:flex md:justify-between">
            <h3 className="font-medium md:text-[22px] font-poppins text-[#64728C]">
              P & L Report
            </h3>
          </div>
          <div className="w-full overflow-x-scroll items md:overflow-auto text-[#64728C] font-poppins mt-5">
            <Tabs value={activeTab}>
              <TabsHeader
                className="rounded-none bg-transparent p-0 w-[450px]"
                indicatorProps={{
                  className:
                    "bg-transparent border-b-2 border-[#7335E5] shadow-none rounded-none",
                }}
              >
                {data.map(({ label, value }) => (
                  <Tab
                    key={value}
                    value={value}
                    onClick={() => setActiveTab(value)}
                    className="font-poppins font-semibold text-[10px] md:text-[16px] leading-6 text-[#64728C] flex justify-start mr-2"
                  >
                    {label}
                  </Tab>
                ))}
              </TabsHeader>
              <TabsBody>
                {data.map(({ value }) => (
                  <TabPanel className="" key={value} value={value}>
                    {value === "Summary" && (
                      <PLSummary
                        productTableLoading={productTableLoading}
                        handleLoading={handleLoading}
                      />
                    )}
                    {value === "Invoices" && (
                      <PLInvoices
                        productTableLoading={productTableLoading}
                        handleLoading={handleLoading}
                      />
                    )}
                    {value === "Expenses" && (
                      <PLExpenses
                        productTableLoading={productTableLoading}
                        handleLoading={handleLoading}
                      />
                    )}
                    {value === "Damages" && (
                      <PLDamages
                        productTableLoading={productTableLoading}
                        handleLoading={handleLoading}
                      />
                    )}
                  </TabPanel>
                ))}
              </TabsBody>
            </Tabs>
          </div>
        </div>
      </section>
    </>
  );
};
