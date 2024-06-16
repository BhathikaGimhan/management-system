import Chart from "react-apexcharts";

export const Collection = ({ data }) => {
  const handleFormatData = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return formattedDate;
  };

  let dates = [];

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() - 7);

  // Loop through the dates from endDate to startDate
  while (endDate <= startDate) {
    // Push the current date into the dates array
    let pushDate = handleFormatData(endDate);
    dates.push(pushDate);

    // Move to the next day
    endDate.setDate(endDate.getDate() + 1);
  }
  const chartConfig = {
    type: "bar",
    height: 240,
    series: [
      {
        name: "Invoice Count",
        data: data.daliy_sales,
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: "",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#027FA5"],
      plotOptions: {
        bar: {
          columnWidth: "40%",
          borderRadius: 2,
        },
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: dates,
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#E0EDF1",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  };

  return (
    <div className="h-auto rounded-[20px] w-full md:w-[98.5%] md:mb-0 mb-5 pt-3 bg-white">
      <div className="flex flex-col  p-3 pl-6 ">
        <div className=" md:flex md:justify-between w-auto">
          <h3 className="font-poppins font-semibold text-[16px] leading-[24px] text-[#64728C]">
            Daily Sales
          </h3>
        </div>
        <Chart {...chartConfig} />
      </div>
    </div>
  );
};
