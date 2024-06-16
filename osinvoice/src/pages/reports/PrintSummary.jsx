import { Card, CardBody } from "@material-tailwind/react";

export const PrintSummary = ({ data }) => {

  return (
    <>
      <Card className="h-fit  rounded-none mx-3 md:mx-6 mr-3 font-inter">
        <CardBody className="flex flex-col items-center  py-10 ">
          <div className="md:w-[70%] flex items-center justify-center font-inter font-semibold text-3xl pb-4 border-b-2">
            Item Detail Report
          </div>
          <div className=" flex items-center justify-center font-inter font-normal text-[10px] mt-3 text-center">
            Generated {data?.current}
          </div>

          <div className="  flex items-center w-full  font-inter font-normal text-[10px] mt-3 ">
            <span className="w-[7%]"> From </span>
            <span>
              {data?.from_date}
            </span>
          </div>
          <div className=" flex items-center w-full  font-inter font-normal text-[10px] ">
            <span className="w-[7%]">
              To
            </span>
            <span>
              {data?.to_date}
            </span>
          </div>
          <div className=" flex items-center w-full font-inter font-normal text-[10px]  ">
            <span className="w-[7%]">
              Category
            </span>
            <span>
              {data?.category}
            </span>
          </div>
          <div className=" w-full ">
            <table className="mt-10 table-auto w-full border-t-2">
              <thead className="border-b-2 border-l-2 bg-gray-100">
                <tr>
                  <th className="text-start text-[10px] md:text-[10px]  p-[6px] border-r-2 font-semibold font-inter text-gray-800">
                    Category
                  </th>
                  <th className="text-start text-[10px] md:text-[10px]  p-[6px] w-[200px] border-r-2 font-semibold font-inter text-gray-800 ">
                    Description
                  </th>
                  <th className="text-start text-[10px] md:text-[10px]  p-[6px] border-r-2 font-semibold font-inter text-gray-800">
                    Real Cost (LKR)
                  </th>
                  <th className="text-start text-[10px] md:text-[10px]  p-[6px] border-r-2 font-semibold font-inter text-gray-800">
                    Cost (LKR)
                  </th>
                  <th className="text-start text-[10px] md:text-[10px]  p-[6px] border-r-2 font-semibold font-inter text-gray-800">
                    Rate (LKR)
                  </th>
                  <th className="text-start text-[10px] md:text-[10px]  p-[6px] border-r-2 font-semibold font-inter text-gray-800">
                    Qty Type
                  </th>
                  <th className="text-start text-[10px] md:text-[10px]  p-[6px] border-r-2 font-semibold font-inter text-gray-800">
                    In Stock
                  </th>
                  <th className="text-start text-[10px] md:text-[10px]  p-[6px] border-r-2 font-semibold font-inter text-gray-800">
                    Out Stock
                  </th>
                  <th className="text-start text-[10px] md:text-[10px]  p-[6px] border-r-2 font-semibold font-inter text-gray-800">
                    SIH
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.products?.map((product, productIndex) => {
                  return (
                    <tr className="border-b-2 border-l-2">
                      <td className="text-start text-[10px] p-[6px] border-r-2 font-normal font-inter text-gray-800">
                        {product.Item_Category}
                      </td>
                      <td className="text-start text-[10px] p-[6px] border-r-2 font-normal font-inter text-gray-800">
                        {product.Description}
                      </td>
                      <td className="text-start text-[10px]  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                         {parseFloat(product.Real_Cost).toFixed(2)}
                      </td>
                      <td className="text-start text-[10px]  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                         {parseFloat(product.Cost).toFixed(2)}
                      </td>
                      <td className="text-start text-[10px]  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                         {parseFloat(product.Rate).toFixed(2)}
                      </td>
                      <td className="text-start text-[10px]  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                        {product.Quantity_Type}
                      </td>
                      <td className="text-start text-[10px]  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                        {product.Total_In_Stock}
                      </td>
                      <td className="text-start text-[10px]  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                        {product.Total_Out_Stock}
                      </td>
                      <td className="text-start text-[10px]  p-[6px] border-r-2 font-normal font-inter text-gray-800">
                        {product.Stock_In_Hand}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

        </CardBody>
      </Card>
    </>
  );
};
