import { Card, CardBody, ListItem, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { FolderIcon } from "../../utils/icons";

export const Reports = () => {
  return (
    <>
      <section className="mt-5 bg-white px-[3%] w-full rounded-[10px] py-5 md:hidden">
        <div className="flex justify-start w-full pt-2 pb-10 md:hidden md:ml-6">
          {reports.map((report, reportIndex) => {
            return (
              <div
                className="flex flex-col items-center w-full gap-5 md:items-start md:flex-wrap"
                key={reportIndex}
              >
                {report.items.map((item, itemIndex) => {
                  return <ReportTableItem item={item} />;
                })}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8 hidden md:block">
        <div className="w-full bg-white rounded-[15px] px-[30px] pt-10 pb-[40px]">
          <div className="justify-start hidden w-full pt-2 pb-10 md:flex md:ml-6">
            {reports.map((report, reportIndex) => {
              return (
                <div
                  className="flex items-center w-full gap-20 md:items-start md:flex-wrap"
                  key={reportIndex}
                >
                  {report.items.map((item, itemIndex) => {
                    return <ReportTableItem item={item} />;
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

const ReportTableTitle = ({ title }) => {
  return (
    <ListItem className="w-[30%] aspect-square flex justify-center text-2xl text-center bg-gray-400 text-black">
      {title}
    </ListItem>
  );
};

const ReportTableItem = ({ item }) => {
  return (
    <Link to={item.link} className="flex justify-between">
      <div className="min-w-[300px] md:w-[100%%] h-[100px] md:h-[130px] aspect-square flex md:justify-left justify-between items-center md:items-start p-5 rounded-[10px] relative overflow-hidden border border-[#d5d9df] text-[#64728C82] bg-white">
        <div>
          <Link to={item.link}>
            <div className="w-[100px]  right-[-1.5rem] top-[-1.5rem] opacity-80">
              <span></span>
            </div>
            <div>
              <div className="text-6xl md:text-3xl"></div>
              <div className="font-poppins font-medium text-[16px] leading-8 text-[#64728C] text-left w-[80%]">
                {" "}
                {item.key}
              </div>
            </div>
          </Link>
        </div>
        <div className="md:absolute md:bottom-5 md:right-5 flex">
          <FolderIcon />
        </div>
      </div>
    </Link>
  );
};

const reports = [
  {
    title: "General",
    items: [
      {
        key: "Item Detail Report",
        value: "tax-summary",
        link: "/reports/item-detail-report",
      },
      {
        key: "Invoice Detail Report",
        value: "tax-summary",
        link: "/reports/invoice-detail-report",
      },
      {
        key: "Profit & Lost Report",
        value: "p-&-l-report",
        link: "/pl-report",
      }
    ],
  },
];
