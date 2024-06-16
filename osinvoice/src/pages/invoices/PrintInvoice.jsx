import { Card, CardBody } from "@material-tailwind/react";

export const PrintInvoice = ({ data }) => {
  return (
    <>
      <Card className="mx-3 my-10 rounded-none print-page h-fit font-inter">
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
                INVOICE
              </span>
              <span className="font-poppins font-medium text-[20px] leading-8 text-[#7335E5]">
                #{data?.data?.invoice?.Invoice_Number}
              </span>
            </div>
          </div>
          <div className="flex items-start justify-between w-full">
            <div>
              <span className="font-poppins font-semibold text-[12px] leading-[22px] text-[#64728C]">
                From:
              </span>
              <div className="font-poppins font-normal text-[12px] leading-[22px] text-[#64728C]">
                {data?.address?.Address1},<br />
                {data?.address?.Address2}, <br />
                {data?.address?.Address3},<br />
                {data?.address?.Contact_No}
              </div>
            </div>
            <div>
              <span className="font-poppins font-semibold text-[12px] leading-[22px] text-[#64728C]">
                To:
              </span>
              <div className="font-poppins font-normal text-[12px] leading-[22px] text-[#64728C]">
                {data?.data?.invoice?.Name} <br />
                {data?.data?.invoice?.Address1}, <br />
                {data?.data?.invoice?.Address2},
                <br />
                {data?.data?.invoice?.Address3}
              </div>
            </div>
          </div>
          <div className="flex w-full gap-5 mt-5">
            <div className="flex flex-col">
              <div className="font poppins font-medium text-[12px] text-[#64728C]">
                Date
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font poppins font-medium text-[12px] text-[#64728C]">
                {data?.data?.invoice?.Date}
              </div>
            </div>
          </div>

          <div className="w-full pb-30">
            <div class="relative overflow-x-auto">
              <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead class="text-xs text-white uppercase border-t border-b border-[#7335E5] ">
                  <tr className="">
                    <th
                      scope="col"
                      className="px-1 w-[20%] py-2 font-poppins font-semibold text-[12px] leading-[18px] text-[#7335E5]"
                    >
                      ITEM
                    </th>
                    {data?.data?.invoice?.Invoice_Type === 1 && (
                      <th
                        scope="col"
                        className="px-1 w-[30%] py-2 font-poppins font-semibold text-[12px] leading-[18px] text-[#7335E5]"
                      >
                        Description
                      </th>
                    )}
                    <th
                      scope="col"
                      className="px-1 py-2 w-[10%] font-poppins font-semibold text-[12px] leading-[18px] text-[#7335E5]"
                    >
                      RATE (LKR)
                    </th>
                    <th
                      scope="col"
                      className="px-1 w-[10%] py-2 font-poppins font-semibold text-[12px] leading-[18px] text-[#7335E5]"
                    >
                      QTY
                    </th>
                    <th
                      scope="col"
                      className="px-1 py-2 w-[10%] font-poppins font-semibold text-[12px] leading-[18px] text-[#7335E5]"
                    >
                      DISCOUNT
                    </th>
                    <th
                      scope="col"
                      className="px-1 py-2 w-[20%] font-poppins font-semibold text-[12px] leading-[18px] text-[#7335E5]"
                    >
                      TOTAL (LKR)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.items?.map((item, index) => (
                    <tr key={index} className="border-b border-[#e0e3e8] py-3">
                      <td className="px-1 py-2 font-poppins text-[12px] leading-[18px] text-[#64728C]">
                        {item.Item_Name}{" "}
                      </td>
                      {data?.data?.invoice?.Invoice_Type === 1 && (
                        <td className="px-1 py-2 font-poppins text-[12px] leading-[18px] text-[#64728C]">
                          {item.Item_Has_Serial == 1 ? (
                            <span>{item.Serial_Number}</span>
                          ) : (
                            "-"
                          )}
                        </td>
                      )}
                      <td className=" px-1 py-2 font-poppins text-[12px] leading-[18px] text-[#64728C]">
                        <span style={{ textAlign: "right" }}>
                          {parseFloat(item.Rate).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </td>
                      <td className=" px-1 py-2 font-poppins text-[12px] leading-[18px] text-[#64728C]">
                        {item.Qty}
                      </td>
                      <td className=" px-1 py-2 font-poppins text-[12px] leading-[18px] text-[#64728C]">
                        {item.Discount_Type === "amount"
                          ? "LKR " + parseFloat(item.Discount).toFixed(2)
                          : item.Discount + "%"}
                      </td>
                      <td className="px-1 py-2 font-poppins text-[12px] leading-[18px] text-[#64728C]">
                        <span style={{ textAlign: "right" }}>
                          {item.Discount_Type === "amount"
                            ? (
                                parseFloat(item.Rate) * parseInt(item.Qty) -
                                parseFloat(item.Discount)
                              ).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : (
                                parseFloat(item.Rate) *
                                parseInt(item.Qty) *
                                (1 - parseFloat(item.Discount) / 100)
                              ).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-row justify-between w-full mt-6">
              <div className="w-[45%]">
                <div className="font-poppins font-semibold text-[10px] leading-[16px]">
                  Note:
                </div>
                <div className="flex text-[10px] font-normal font-poppins flex-col gap-2">
                  <span>{data?.data?.invoice?.Note}</span>
                </div>
              </div>
              <div className="w-[40%] flex justify-between">
                <div>
                  <div className="font-poppins font-semibold text-[12px] leading-[18px] text-[#64728C]">
                    Subtotal (LKR)
                  </div>
                  <div className="font-poppins font-semibold text-[12px] leading-[18px] text-[#64728C]">
                    Discount{" "}
                    {data?.data?.invoice?.Discount_Type === "amount"
                      ? "LKR"
                      : "%"}
                  </div>
                  <div className="font-poppins font-semibold text-[12px] leading-[18px] text-[#64728C]">
                    Total (LKR)
                  </div>
                  {data?.data?.invoice?.Payment_Type === 2 && (
                    <div className="font-poppins font-semibold text-[12px] leading-[18px] text-[#64728C]">
                      Down Payment (LKR)
                    </div>
                  )}
                  <div className="font-poppins font-semibold text-[12px] leading-[18px] text-[#64728C]">
                    Paid Amount (LKR)
                  </div>
                  <div className="font-poppins font-semibold text-[12px] leading-[18px] text-[#64728C]">
                    Credit Balance (LKR)
                  </div>
                </div>
                <div className="items-end ">
                  <div className="text-end font-poppins font-semibold text-[12px] leading-[18px] text-[#64728C]">
                    {parseFloat(data?.data?.invoice?.Total).toLocaleString(
                      "en-US",
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}
                  </div>
                  <div className="text-end font-poppins font-semibold text-[12px] leading-[18px] text-[#64728C]">
                    {data?.data?.invoice?.Discount_Type === "amount"
                      ? parseFloat(
                          data?.data?.invoice?.Discount_Amount
                        ).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : data?.data?.invoice?.Discount_Presentage}
                  </div>
                  <div className="text-end font-poppins font-semibold text-[12px] leading-[18px] text-[#64728C]">
                    {parseFloat(data?.data?.invoice?.Net_Amount).toLocaleString(
                      "en-US",
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}
                  </div>
                  {data?.data?.invoice?.Payment_Type === 2 && (
                    <div className="text-end font-poppins font-semibold text-[12px] leading-[18px] text-[#64728C]">
                      {parseFloat(
                        data?.data?.invoice?.Paid_Amount
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  )}
                  <div className="text-end font-poppins font-semibold text-[12px] leading-[18px] text-[#64728C]">
                    {parseFloat(
                      data?.data?.invoice?.Paid_Amount
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-end font-poppins font-semibold text-[12px] leading-[18px] text-[#64728C]">
                    {parseFloat(
                      data?.data?.invoice?.Credit_Balance
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>
            </div>
            {data?.data?.invoice?.Payment_Type === 2 && (
              <>
                <div className="font-poppins text-[12px] font-semibold mb-3">
                  Installment Plan
                </div>
                <table className="font-poppins text-[14px] mt-2 transition-all duration-300 w-full mb-5">
                  <thead>
                    <tr className="border-t border-b border-[#7335E5]">
                      <th className=" px-5 text-left font-poppins font-semibold text-[12px] leading-[18px] text-[#7335E5] py-1">
                        Installment #
                      </th>
                      <th className="px-5 text-left font-poppins font-semibold text-[12px] leading-[18px] text-[#7335E5] py-1">
                        Date
                      </th>
                      <th className=" px-5 text-left font-poppins font-semibold text-[12px] leading-[18px] text-[#7335E5] py-1">
                        Amount
                      </th>
                      <th className=" px-5 text-left font-poppins font-semibold text-[12px] leading-[18px] text-[#7335E5] py-1">
                        Penalty
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data?.installments?.map((installment) => (
                      <tr
                        key={installment?.idInstallment_Payment}
                        className="border-b border-[#e0e3e8]"
                      >
                        <td className="font-poppins text-[12px] px-5 leading-[18px] text-[#64728C] py-1">
                          {installment?.Term}
                        </td>
                        <td className="font-poppins text-[12px] px-5 leading-[18px] text-[#64728C] py-1">
                          {new Date(installment?.Date).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="font-poppins text-[12px] px-5 leading-[18px] text-[#64728C] py-1">
                          {parseFloat(
                            installment?.Balance_Amount
                          ).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="font-poppins text-[12px] px-5 leading-[18px] text-[#64728C] py-1">
                          {parseFloat(
                            installment?.Penalty_Amount
                          ).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            <div className="flex flex-wrap justify-between mt-5">
              <div className="flex flex-col justify-center">
                <div className="font-poppins font-semibold text-[12px] leading-[18px]">
                  Thank you for your Business.
                </div>
              </div>
              <div className="flex flex-col items-center justify-center mt-3">
                <div className="flex justify-center text-lg">
                  ............................
                </div>
                <div className="text-sm font-normal">Account Manager</div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};
