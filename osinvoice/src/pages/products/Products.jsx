import { useState } from "react";
import { ItemCategoryModal } from "./ItemCategoryModal";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { PlusIcon } from "../../utils/icons";
import { ItemProduct } from "./ItemProduct";
import { Link } from "react-router-dom";

export const Products = () => {
  const [categories, setCategories] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const handlecategoryOpen = () => setCategoryOpen((cur) => !cur);
  const [categoryTableLoading, setCategoryTableLoading] = useState(false);
  const handleCategoryLoading = () => setCategoryTableLoading((pre) => !pre);

  const [productTableLoading, setProductTableLoading] = useState(false);
  const handleLoading = () => setProductTableLoading((pre) => !pre);

  const data = [
    {
      label: "Item",
      value: "Item",
    }
  ];

  return (
    <>
      <section className="mt-8">
        <div className="w-ful">
          <Tabs value="Item">
            <div className="flex justify-between bg-white rounded-t-[15px] px-[30px] pt-[20px]">
              <TabsHeader
                className="rounded-none bg-transparent p-0 w-[200px]"
                indicatorProps={{
                  className:
                    "bg-transparent border-b-2 border-[#7335E5] shadow-none rounded-none",
                }}
              >
                {data.map(({ label, value }) => (
                  <Tab
                    key={value}
                    value={value}
                    className="font-poppins font-semibold text-[16px] leading-6 text-[#64728C] flex justify-start mr-2"
                  >
                    {label}
                  </Tab>
                ))}
              </TabsHeader>
              <button
                className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] items-center justify-center gap-2 text-[#10275E] hidden md:flex hover:opacity-70"
                onClick={handlecategoryOpen}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 13.75C9.985 13.75 12.5 12.8912 12.5 11.25V3.75C12.5 2.10875 9.985 1.25 7.5 1.25C5.015 1.25 2.5 2.10875 2.5 3.75V11.25C2.5 12.8912 5.015 13.75 7.5 13.75ZM7.5 12.5C5.17375 12.5 3.75 11.6906 3.75 11.25V10.4575C4.71312 10.9812 6.11062 11.25 7.5 11.25C8.88937 11.25 10.2869 10.9812 11.25 10.4575V11.25C11.25 11.6906 9.82625 12.5 7.5 12.5ZM7.5 2.5C9.82625 2.5 11.25 3.30937 11.25 3.75C11.25 4.19062 9.82625 5 7.5 5C5.17375 5 3.75 4.19062 3.75 3.75C3.75 3.30937 5.17375 2.5 7.5 2.5ZM3.75 5.4575C4.71312 5.98125 6.11062 6.25 7.5 6.25C8.88937 6.25 10.2869 5.98125 11.25 5.4575V6.25C11.25 6.69062 9.82625 7.5 7.5 7.5C5.17375 7.5 3.75 6.69062 3.75 6.25V5.4575ZM3.75 7.9575C4.71312 8.48125 6.11062 8.75 7.5 8.75C8.88937 8.75 10.2869 8.48125 11.25 7.9575V8.75C11.25 9.19062 9.82625 10 7.5 10C5.17375 10 3.75 9.19062 3.75 8.75V7.9575Z"
                    fill="#10275E"
                  />
                </svg>
                <span>Product Category Manager</span>
              </button>
              <div className="flex gap-2 md:hidden">
                <button
                  className="bg-[#769EFF] bg-opacity-30 rounded-full w-fit p-2 aspect-square"
                  onClick={handlecategoryOpen}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 13.75C9.985 13.75 12.5 12.8912 12.5 11.25V3.75C12.5 2.10875 9.985 1.25 7.5 1.25C5.015 1.25 2.5 2.10875 2.5 3.75V11.25C2.5 12.8912 5.015 13.75 7.5 13.75ZM7.5 12.5C5.17375 12.5 3.75 11.6906 3.75 11.25V10.4575C4.71312 10.9812 6.11062 11.25 7.5 11.25C8.88937 11.25 10.2869 10.9812 11.25 10.4575V11.25C11.25 11.6906 9.82625 12.5 7.5 12.5ZM7.5 2.5C9.82625 2.5 11.25 3.30937 11.25 3.75C11.25 4.19062 9.82625 5 7.5 5C5.17375 5 3.75 4.19062 3.75 3.75C3.75 3.30937 5.17375 2.5 7.5 2.5ZM3.75 5.4575C4.71312 5.98125 6.11062 6.25 7.5 6.25C8.88937 6.25 10.2869 5.98125 11.25 5.4575V6.25C11.25 6.69062 9.82625 7.5 7.5 7.5C5.17375 7.5 3.75 6.69062 3.75 6.25V5.4575ZM3.75 7.9575C4.71312 8.48125 6.11062 8.75 7.5 8.75C8.88937 8.75 10.2869 8.48125 11.25 7.9575V8.75C11.25 9.19062 9.82625 10 7.5 10C5.17375 10 3.75 9.19062 3.75 8.75V7.9575Z"
                      fill="#10275E"
                    />
                  </svg>
                </button>
                <Link
                  className="w-[30px] aspect-square rounded-full bg-[#769EFF] bg-opacity-30 -top-5 -right-3 flex items-center justify-center cursor-pointer"
                  to="/product/add"
                >
                  <PlusIcon width={"14px"} />
                </Link>
              </div>
            </div>
            <TabsBody>
              {data.map(({ value, desc }) => (
                <TabPanel className="p-0" key={value} value={value}>
                  {value === "Item" && (
                    <ItemProduct
                      productTableLoading={productTableLoading}
                      handleLoading={handleLoading}
                    />
                  )}
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
        </div>
      </section>
      <ItemCategoryModal
        handleOpen={handlecategoryOpen}
        categories={categories}
        open={categoryOpen}
        handleLoading={handleCategoryLoading}
      />
    </>
  );
};
