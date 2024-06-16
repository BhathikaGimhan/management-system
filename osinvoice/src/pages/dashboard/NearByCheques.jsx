import DataTable from "react-data-table-component";

export const NearByCheques = ({ data }) => {
  const handleFormatData = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return formattedDate;
  };

  const columns = [
    {
      name: "Date",
      selector: (row) => handleFormatData(row.date),
      sortable: true,
    },
    {
      name: "Name of The Cheque",
      selector: (row) => row.name,
      wrap: false,
      minWidth: "auto",
    },
    {
      name: "Payment Type",
      selector: (row) => row.type,
    },
    {
      name: "Total (LKR)",
      selector: (row) => parseFloat(row.total).toFixed(2),
    },
  ];

  const tableHeaderStyles = {
    headCells: {
      style: {
        backgroundColor: "#F3F4F6",
      },
    },
  };

  return (
    <div className="h-auto rounded-[20px] w-full md:ml-2.5 md:mb-0 mb-5 pt-3 bg-white">
      <div className="flex flex-col  p-6 pl-6 ">
        <div className=" md:flex md:justify-between w-auto">
          <h3 className="font-poppins font-semibold text-[16px] leading-[24px] text-[#64728C] mb-3">
            Near by Cheques
          </h3>
        </div>

        <DataTable
          columns={columns}
          data={data.near_by_cheques}
          customStyles={tableHeaderStyles}
          className="mt-4"
          pagination
          paginationPerPage={3}
          paginationRowsPerPageOptions={[2, 4, 6]}
          paginationComponentOptions={{
            rowsPerPageText: "Entries per page:",
            rangeSeparatorText: "of",
          }}
          noDataComponent={<div className="text-center">No data available</div>}
        />
      </div>
    </div>
  );
};
