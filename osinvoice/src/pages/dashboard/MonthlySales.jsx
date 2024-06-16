import Chart from "react-apexcharts";

export const MonthlySales = ({ data }) => {
  let dates = [];
  let currentDate = new Date();

  for (let i = 0; i < 9; i++) {
    let monthName = currentDate.toLocaleString("default", { month: "short" });
    dates.push(monthName);

    currentDate.setMonth(currentDate.getMonth() - 1);
  }

  dates.reverse();

  const chartConfig = {
    type: "line",
    height: 240,
    series: [
      {
        name: "Sales",
        data: data.monthly_sales?.reverse(),
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
      colors: ["#2DC436"],
      stroke: {
        lineCap: "round",
        curve: "smooth",
      },
      markers: {
        size: 0,
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
        borderColor: "#dddddd",
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
        colors: ["#2DC436"],
      },
      tooltip: {
        theme: "dark",
      },
    },
  };

  return (
    <div className="h-auto rounded-[20px] md:ml-2.5 md:mb-0 w-full pt-3 bg-white">
      <div className="flex flex-col  p-6 pl-6 ">
        <div className=" md:flex md:justify-between w-auto">
          <h3 className="font-poppins font-semibold text-[16px] leading-[24px] text-[#64728C]">
            Monthly Sales
          </h3>
        </div>
        <Chart {...chartConfig} />
      </div>
    </div>
  );
};
