import React, { useEffect, useState } from "react";
import "../../assets/css/css.css";
import { useStateContext } from "../../contexts/NavigationContext";
import axiosClient from "../../../axios-client";

export const Activity = () => {
  const { user } = useStateContext();
  const [userLog, setUserLog] = useState([]); //user log state
  const [ToDate, setToDate] = useState("");
  const [FromDate, setFromDate] = useState("");

  // Function to format date to "YYYY-MM-DD"
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    // Get today's date and the date from a week ago
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

    // Only update state if FromDate and ToDate are not already set
    if (!FromDate && !ToDate) {
      setToDate(formatDate(today));
      setFromDate(formatDate(weekAgo));
    }

    const fetchUserLogs = () => {
      axiosClient
        .get(`/user-logs/${user.branch}/${FromDate}/${ToDate}`)
        .then((res) => {
          setUserLog(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchUserLogs();
  }, [FromDate, ToDate]);

  return (
    <div className="h-auto rounded-[20px] w-full md:w-[98.5%] md:mb-0 mb-5 pt-3 bg-white">
      <div className="flex flex-col  p- pl-6 ">
        <div className=" md:flex md:justify-between w-auto">
          <h3 className="font-poppins font-semibold text-[16px] leading-[24px] text-[#64728C] mb-3">
            Recent Activity
          </h3>
        </div>

        <div
          style={{ maxHeight: "300px", overflowY: "auto" }}
          className="text-sm w-full scrollbar-x-style scrollbar-y-style"
        >
          {userLog.map((log, index) => (
            <div class="timeline">
              <div class="container right">
                <div className="content w-full text-sm">
                  <div class="w-[80%]">
                    {log.Task_Type === "Customer" && (
                      <div>
                        <span>{log.User} </span>
                        {log.Task_Category === "create" ? (
                          <span>
                            <span className="text-[#0BB612]">added</span>{" "}
                            {log.customer} as new customer.
                          </span>
                        ) : log.Task_Category === "edit" ? (
                          <span>
                            <span className="text-[#FFAB04]">updated</span>{" "}
                            {log.customer}'s customer details.
                          </span>
                        ) : (
                          log.Task_Category === "change status" && (
                            <span>
                              <span className="text-[#FFAB04]">changed</span>{" "}
                              customer status of {log.customer}.
                            </span>
                          )
                        )}
                        <br />
                        <span className="text-[#6d6d6d]">{log.Date_Time}</span>
                      </div>
                    )}

                    {log.Task_Type === "GRN" && (
                      <div>
                        <span>{log.User} </span>
                        {log.Task_Category === "create" ? (
                          <span>
                            <span className="text-[#0BB612]">added</span> new
                            GRN.{" "}
                            <span className="text-[#FF3030]">
                              (Bill No:{log.Bill_no})
                            </span>
                          </span>
                        ) : log.Task_Category === "edit" ? (
                          <span>
                            <span className="text-[#FFAB04]">updated</span>GRN.
                            <span className="text-[#FF3030]">
                              (Bill No:{log.Bill_no})
                            </span>{" "}
                          </span>
                        ) : (
                          log.Task_Category === "process" && (
                            <span>
                              <span className="text-[#FFAB04]">process</span> a
                              GRN.
                              <span className="text-[#FF3030]">
                                (Bill No:{log.Bill_no})
                              </span>
                            </span>
                          )
                        )}
                        <br />
                        <span className="text-[#6d6d6d]">{log.Date_Time}</span>
                      </div>
                    )}

                    {log.Task_Type === "Invoice" && (
                      <div>
                        <span>{log.User}</span>
                        {log.Task_Category === "create" && (
                          <span>
                            <span>
                              <span className="text-[#0BB612]"> added</span> new
                              invoice.{" "}
                              <span className="text-[#FF3030]">
                                (Invoice No:{log.Invoice_Number})
                              </span>
                            </span>
                          </span>
                        )}
                        <br />
                        <span className="text-[#6d6d6d]">{log.Date_Time}</span>
                      </div>
                    )}

                    {log.Task_Type === "Quotation" && (
                      <div>
                        <span>{log.User}</span>
                        {log.Task_Category === "create" && (
                          <span>
                            <span>
                              <span className="text-[#0BB612]"> added</span> new
                              quotation.{" "}
                              <span className="text-[#FF3030]">
                                (Quotation No:{log.Quotation_Number})
                              </span>
                            </span>
                          </span>
                        )}
                        <br />
                        <span className="text-[#6d6d6d]">{log.Date_Time}</span>
                      </div>
                    )}

                    {log.Task_Type === "Item" && (
                      <div>
                        <span>{log.User}</span>
                        {log.Task_Category === "create" ? (
                          <span>
                            <span className="text-[#0BB612]">added</span> new
                            item.
                          </span>
                        ) : (
                          log.Task_Category === "edit" && (
                            <span>
                              <span className="text-[#FFAB04]">updated</span>{" "}
                              item details.,
                            </span>
                          )
                        )}
                        <br />
                        <span className="text-[#6d6d6d]">{log.Date_Time}</span>
                      </div>
                    )}

                    {log.Task_Type === "Purchase Return" && (
                      <div>
                        <span>{log.User} </span>
                        {log.Task_Category === "create" ? (
                          <span>
                            <span className="text-[#0BB612]">added</span> new
                            purchase return.{" "}
                          </span>
                        ) : log.Task_Category === "edit" ? (
                          <span>
                            <span className="text-[#FFAB04]">updated</span>
                            purchase return.{" "}
                          </span>
                        ) : (
                          log.Task_Category === "process" && (
                            <span>
                              <span className="text-[#FFAB04]">
                                process a purchase return.
                              </span>{" "}
                            </span>
                          )
                        )}
                        <br />
                        <span className="text-[#6d6d6d]">{log.Date_Time}</span>
                      </div>
                    )}

                    {log.Task_Type === "Supplier" && (
                      <div>
                        <span>{log.User} </span>
                        {log.Task_Category === "create" ? (
                          <span>
                            <span className="text-[#0BB612]">added</span>{" "}
                            {log.supplier} as new supplier.
                          </span>
                        ) : log.Task_Category === "edit" ? (
                          <span>
                            <span className="text-[#FFAB04]">updated</span>{" "}
                            {log.supplier}'s supplier details.
                          </span>
                        ) : (
                          log.Task_Category === "change status" && (
                            <span>
                              <span className="text-[#FFAB04]">changed </span>
                              supplier status of {log.supplier}.
                            </span>
                          )
                        )}
                        <br />
                        <span className="text-[#6d6d6d]">{log.Date_Time}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
