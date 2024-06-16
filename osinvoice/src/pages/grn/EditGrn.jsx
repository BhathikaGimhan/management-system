import React, { useState, useEffect } from "react";
import { Card, Typography, CardBody, Radio } from "@material-tailwind/react";

import axiosClient from "../../../axios-client";
import {
  EditNewIcon,
  RemoveIcon,
  ProcessingIcon,
  ViewSerialIcon,
  PlusIcon,
} from "../../utils/icons";
import { AddGRNItem } from "./AddGRNItem";
import { EditGRNItem } from "./EditGRNItem";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ViewSerialNumbers } from "./ViewSerialNumbers";
import { useStateContext } from "../../contexts/NavigationContext";
import Swal from "sweetalert2";

// Main component for adding GRNs
export const EditGrn = () => {
  const { id } = useParams();

  const { user } = useStateContext();
  // State for managing opening/closing of add item modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  // State for managing opening/closing of edit item modal
  const [editOpen, setEditOpen] = useState(false);
  const handleEditOpen = () => setEditOpen((cur) => !cur);

  const isSearchable = true;

  const [submitting, setSubmitting] = useState(false);

  const [viewSerialOpen, setViewSerialOpen] = useState(false);
  const handleViewSerialOpen = () => setViewSerialOpen((cur) => !cur);

  const [selectedSerialViewItem, setSelectedSerialViewItem] = useState(null);

  const [discountTypeChangedToAmount, setDiscountTypeChangedToAmount] =
    useState(false);

  // State for managing item selection and related data
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [grnItems, setGRNItems] = useState([]);
  const [qtyTypes, setQtyTypes] = useState([]);

  const navigate = useNavigate();

  const handleFormatData = (date) => {
    const dateObject = new Date(date);
    const yea = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObject.getDate().toString().padStart(2, "0");
    const formattedDate = `${yea}-${month}-${day}`;
    return formattedDate;
  };

  const [grn, setGrn] = useState({});
  useEffect(() => {
    const getGrnDetails = () => {
      axiosClient
        .get(`/grn/single/${id}`)
        .then((res) => {
          setGrn(res.data);
          const grnData = res.data;
          const updatedItems = grnData.items.map((item) => ({
            ...item,
            Serial_No: item.Serial_No.map((serialObj) => serialObj.Serial_No),
          }));
          setData({
            ...data,
            Date: handleFormatData(grnData.Date),
            Supplier_idSupplier: grnData.Supplier_idSupplier,
            Bill_no: grnData.Bill_no,
            Bill_Discount: grnData.Bill_Discount,
            Discount_Amount: grnData.Discount_Amount,
            Total_Amount: grnData.Total_Amount,
            Net_Total: grnData.Net_Total,
            Company_Name: grnData.Company_Name,
            Contact_No: grnData.Contact_No,
            Branch_idBranch: user.branch,
            User_idUser: user.userId,
            Discount_Type: grnData.Discount_Type,
          });
          setGRNItems(updatedItems);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getGrnDetails();
  }, []);

  // State for managing form data and validation errors
  const [data, setData] = useState({
    Date: handleFormatData(grn.Date),
    Supplier_idSupplier: grn.Supplier_idSupplier,
    Bill_no: grn.Bill_no,
    Bill_Discount: 0,
    Discount_Amount: 0,
    Total_Amount: 0,
    Net_Total: 0,
    Branch_idBranch: user.branch,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data.Discount_Type === "percentage") {
      setDiscountTypeChangedToAmount(false);
    } else if (data.Discount_Type === "amount") {
      setDiscountTypeChangedToAmount(true);
    }
  }, [data.Discount_Type]);

  // Function to fetch items from API
  const getItems = () => {
    axiosClient
      .get(`/product/items/${user.branch}`)
      .then((res) => {
        setItems(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to fetch qty types from API
  const getQtyTypes = () => {
    axiosClient
      .get(`/quantity-types`)
      .then((res) => {
        let data = res.data;
        const qtyOptions = data.map((type) => ({
          value: type,
          label: type.Description,
        }));
        setQtyTypes(qtyOptions);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // useEffect hook to fetch customers and items on component mount
  useEffect(() => {
    getItems();
    getQtyTypes();
  }, []);

  // Mapping item data for Select component
  const itemsOptions = items.map((item) => ({
    value: item,
    label: item.Description,
  }));

  // Header items for GRN table
  const headerItem = [
    "Item",
    "Cost (LKR)",
    "Quantity",
    "Discount (%)",
    "Total (LKR)",
    "Action",
  ];

  // Function to handle discount change
  const handleDiscountChange = (e) => {
    const inputValue = e.target.value;
    setData({
      ...data,
      Bill_Discount: inputValue,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      Bill_Discount: "",
    }));
  };

  // Function to add item to GRN
  const handleItem = (item) => {
    const itemIndex = grnItems.findIndex(
      (i) => i.Item_idItem === item.Item_idItem && i.Discount === item.Discount
    );

    if (itemIndex !== -1) {
      toast.error("You have already added the item. Please try again.");
      return;
    }
    let amount = 0;
    amount = parseFloat(data.Total_Amount) + parseFloat(item.Total);
    let dicount_amount = (amount * data.Bill_Discount) / 100;
    let net_amount = amount - dicount_amount;
    setData({
      ...data,
      Total_Amount: amount,
      Net_Total: net_amount,
    });
    setGRNItems([...grnItems, item]);
    setErrors({
      ...errors,
      items: "",
    });
  };
  const handleOpenEditItem = (item) => {
    setSelectedItem(item);
    setSelectedItem({
      Item_idItem: item.Item_idItem,
      Item_Description: item.Item_Description,
      Cost: item.Cost,
      Qty_Type: item.Qty_Type,
      Qty: item.Qty,
      Total: item.Total,
      Discount: item.Discount,
      Old_discount: item.Discount,
      Sub_Total: item.Sub_Total,
      Serial_No: item.Serial_No,
    });
    handleEditOpen();
  };

  const handleEditItem = (newItem) => {
    // Find the index of the item to be edited
    const itemIndex = grnItems.findIndex(
      (item) =>
        item.Item_idItem === newItem.Item_idItem &&
        item.Discount === newItem.Old_discount
    );
    const updatedGRNItems = [...grnItems];
    updatedGRNItems[itemIndex] = newItem;
    let updatedTotalAmount = parseFloat(0.0);
    updatedGRNItems.forEach((item) => {
      updatedTotalAmount += parseFloat(item.Total);
    });
    let dicount_amount = (updatedTotalAmount * data.Bill_Discount) / 100;
    let net_amount = updatedTotalAmount - dicount_amount;
    setData({
      ...data,
      Total_Amount: updatedTotalAmount,
      Net_Total: net_amount,
    });
    setGRNItems(updatedGRNItems);
    setSelectedItem(null);
  };

  // Function to remove item from GRN
  const handleRemoveItem = (itemToRemove) => {
    const newGRNItems = grnItems.filter((item) => item !== itemToRemove);
    const itemToRemoveAmount = itemToRemove.Total;
    const newTotalAmount = data.Total_Amount - itemToRemoveAmount;

    let dicount_amount = (newTotalAmount * data.Bill_Discount) / 100;
    let net_amount = newTotalAmount - dicount_amount;
    setData({
      ...data,
      Total_Amount: newTotalAmount,
      Net_Total: net_amount,
      Bill_Discount: data.Bill_Discount,
    });
    setGRNItems(newGRNItems);
  };

  useEffect(() => {
    const changeTotal = () => {
      let discount_amount = 0;
      data.Discount_Type === "percentage"
        ? (discount_amount = (data.Total_Amount * data.Bill_Discount) / 100)
        : (discount_amount = data.Bill_Discount);
      let net_amount = data.Total_Amount - discount_amount;
      setData({
        ...data,
        Net_Total: net_amount,
        Discount_Amount: discount_amount,
      });
    };
    changeTotal();
  }, [data.Total_Amount, data.Bill_Discount]);

  useEffect(() => {
    const putGrnItems = () => {
      setData({
        ...data,
        items: grnItems,
      });
    };
    putGrnItems();
  }, [grnItems]);

  // Validation function for form data
  const validate = (valData) => {
    const errors = {};
    if (!valData.Supplier_idSupplier) {
      errors.Supplier_idSupplier = "Select Supplier";
    }
    if (!valData.Date) {
      errors.Date = "Select Date";
    }
    if (grnItems.length <= 0) {
      errors.items = "Add Items";
    }
    return errors;
  };

  // Function to handle save action
  const handleSave = async () => {
    const validationErrors = validate(data);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      Swal.fire({
        text: "Are you sure you want to save this GRN?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          // User clicked "OK", proceed with saving
          setSubmitting(true);
          try {
            axiosClient
              .put(`/grn/${id}`, data)
              .then((res) => {
                navigate("/grn");
                toast.success("GRN edited successfully!");
              })
              .catch((error) => {
                console.log(error);
                toast.error("Failed to edit GRN. Please try again.");
              });
            setSubmitting(false);
          } catch (error) {
            setSubmitting(false);
            toast.error("Failed to edit GRN. Please try again.");
          }
        }
      });
    } else {
      let errorMessage = "";
      Object.values(validationErrors).forEach((error) => {
        errorMessage += `${error}\n`;
      });
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: errorMessage,
        allowOutsideClick: false,
      });
    }
  };

  const viewSerialNumbers = (item) => {
    setSelectedSerialViewItem(item);
    setSelectedSerialViewItem({
      Item_Description: item.Item_Description,
      Serial_No: item.Serial_No,
    });
    handleViewSerialOpen();
  };

  // State variables
  const [itemData, setItemData] = useState({
    Item_idItem: 0,
    Item_Description: "",
    Cost: 0.0,
    Qty_Type: 0,
    Qty: 1,
    Total: 0,
    Discount: 0,
    Sub_Total: 0,
  });

  return (
    <>
      <section className="mt-8 pb-[40px]">
        <Card className="rounded-[20px] pb-[3%] pt-3">
          <CardBody className="flex flex-col gap-5 p-3 px-6 ">
            <div className=" flex justify-between w-full">
              <span className="font-poppins font-medium text-[16px] md:text-[22px] leading-[32px] text-[#64728C]">
                Edit GRN #{id}
              </span>
            </div>

            <div className=" w-full md:flex gap-2 items-center">
              <div className="flex  md:w-1/3 items-center">
                <span className="font-poppins text-[12px] md:text-[14px] font-medium leading-[18px] md:leading-[22px] text-[#64728C]">
                  Invoice No
                </span>
                <input
                  value={data.Bill_no}
                  className="md:w-[250px] p-1 px-6 py-2 border border-[#64728C29] rounded-[15px] focus:outline-none md:ml-3"
                  type="text"
                  onChange={(e) => {
                    setData({
                      ...data,
                      Bill_no: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="flex md:mb-0 w-ful md:w-[250px] md:items-center flex-col md:flex-row gap-2 md:gap-0">
                <span className="font-poppins text-[12px] md:text-[14px] font-medium leading-[18px] md:leading-[22px] text-[#64728C]">
                  Date
                </span>
                <div className="md:w-[250px] w-full">
                  <div class="date-input-container w-full md:ml-3">
                    <input
                      type="date"
                      class="custom-date-input"
                      value={data.Date}
                      onChange={(e) => {
                        setData({
                          ...data,
                          Date: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className=" w-full flex flex-col md:flex-row gap-10 md:gap-5 items-start justify-between">
              <div className="w-full md:w-[40%] my-10">
                <div className="flex flex-col gap-5 text-sm">
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-5 font-medium text-[#64728C]">
                      <div className="pr-3 text-[#64728C] font-poppins font-normal text-[12px] md:text-[14px] leading-[18px] md:leading-[22px]">
                        Supplier ID
                      </div>
                      <div className="pr-3 text-[#64728C] font-poppins font-normal text-[12px] md:text-[14px] leading-[18px] md:leading-[22px]">
                        Supplier Name
                      </div>
                      <div className="pr-3 text-[#64728C] font-poppins font-normal text-[12px] md:text-[14px] leading-[18px] md:leading-[22px]">
                        Contact Numbers
                      </div>
                    </div>
                    <div className="flex flex-col gap-5 text-[#64728C]">
                      <div className="text-[#64728C] font-poppins font-normal text-[12px] md:text-[14px] leading-[18px] md:leading-[22px]">
                        {data.Supplier_idSupplier}
                      </div>
                      <div className="text-[#64728C] font-poppins font-normal text-[12px] md:text-[14px] leading-[18px] md:leading-[22px]">
                        {data.Company_Name}
                      </div>
                      <div className="text-[#64728C] font-poppins font-normal text-[12px] md:text-[14px] leading-[18px] md:leading-[22px]">
                        {data.Contact_No}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full ">
              <div class={`relative bg-white`}>
                <Link
                  className="w-[50px] hidden aspect-square absolute rounded-full bg-[#769EFF] bg-opacity-30 -top-3 -right-5 md:flex items-center justify-center cursor-pointer"
                  onClick={handleOpen}
                >
                  <PlusIcon width={"24px"} />
                </Link>
                <div className="overflow-x-scroll overflow-y-hidden md:overflow-auto">
                  <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead class="text-left bg-[#D9D9D9] bg-opacity-35">
                      <tr>
                        {headerItem.map((head, index) => (
                          <th scope="col" className="px-2 py-2">
                            <p className="font-poppins font-semibold text-[12px] leading-[18px] text-[#64728C]">
                              {head} {index !== headerItem.length - 1}
                            </p>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {grnItems.length <= 0 ? (
                        <tr className=" border-t-[1px]">
                          <td className="p-2 font-poppins font-normal text-[12px] leading-[18px]">
                            Product
                          </td>
                          <td className="p-2 font-poppins font-normal text-[12px] leading-[18px]">
                            0.00
                          </td>
                          <td className="p-2 font-poppins font-normal text-[12px] leading-[18px]">
                            0
                          </td>
                          <td className="p-2 font-poppins font-normal text-[12px] leading-[18px]">
                            0.00
                          </td>
                        </tr>
                      ) : (
                        grnItems.map((item, itemIndex) => {
                          return (
                            <tr
                              className=" border-t-[1px] border-[#0000001e]"
                              key={itemIndex}
                            >
                              <td className="p-2 font-poppins font-normal text-[14px] leading-[10px] text-[#64728C]">
                                {item.Item_Description}
                              </td>
                              <td className="p-2 font-poppins font-normal text-[14px] leading-[10px] text-right pr-[10%] text-[#64728C]">
                                {parseFloat(item.Cost).toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                              <td className="p-2 font-poppins font-normal text-[14px] leading-[10px] text-right pr-[10%] text-[#64728C]">
                                {parseInt(item.Qty).toLocaleString("en-US")}
                              </td>
                              <td className="p-2 font-poppins font-normal text-[14px] leading-[10px] text-right pr-[10%] text-[#64728C]">
                                {item.Discount_Type === "percentage"
                                  ? item.Discount + " %"
                                  : "LKR " +
                                    parseFloat(item.Discount).toLocaleString(
                                      "en-US",
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )}
                              </td>
                              <td className="p-2 font-poppins font-normal text-[14px] leading-[10px] text-right pr-[10%] text-[#64728C]">
                                {parseFloat(item.Total).toLocaleString(
                                  "en-US",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </td>
                              <td className="flex gap-2 p-2 font-medium text-black font-inter">
                                <button
                                  onClick={() => viewSerialNumbers(item)}
                                  className="hover:opacity-70 text-white text-[10px] p-2 rounded"
                                >
                                  <ViewSerialIcon />
                                </button>
                                <button
                                  onClick={() => handleOpenEditItem(item)}
                                  className=" text-white text-[10px] p-2 rounded"
                                >
                                  <EditNewIcon />
                                </button>
                                <button
                                  onClick={() => handleRemoveItem(item, data)}
                                  className=" text-white text-[10px] p-2 rounded"
                                >
                                  <RemoveIcon />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                      <tr className=" border-t-[1px]">
                        <td className="p-2"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {errors.items && (
                  <span className=" text-[#ff0000a1] px-1 font-inter font-bold text-xs">
                    {" "}
                    {errors.items}{" "}
                  </span>
                )}
              </div>

              <div className="flex  flex-col md:flex-row md:justify-end gap-10 md:mt-8 mt-10 ">
                <div className="text-sm md:w-[30%]">
                  <div className="flex  items-center mb-2">
                    <span className="w-[35%] font-medium text-[#64728C] ">
                      Subtotal (LKR)
                    </span>
                    <span className=" ml-5 pl-3 w-[65%] text-[#64728C]">
                      {" "}
                      {isNaN(parseFloat(data.Total_Amount))
                        ? "0.00"
                        : parseFloat(data.Total_Amount).toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                    </span>
                  </div>

                  <div className="flex mb-2   px-2 py-2">
                    <span className="w-[35%] mt-1 text-[#7335E5] -ml-2 text-left font-medium">
                      Discount
                    </span>
                    <div className="w-[65%] ml-5">
                      <input
                        type="text"
                        id="Bill_Discount"
                        name="Bill_Discount"
                        value={data.Bill_Discount}
                        onChange={handleDiscountChange}
                        className="w-[100%] p-1 px-3 py-2 border border-[#64728C29] rounded-[15px] focus:outline-none"
                      />
                      {errors.Bill_Discount && (
                        <Typography className="text-red-500 font-inter font-medium text-xs pt-1">
                          {errors.Bill_Discount}
                        </Typography>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center w-full px-2 py-2 mb-2 bg-[#FFF2E9]">
                    <span className="md:w-[35%] font-poppins font-semibold text-[12px] md:text-[14px] leading-[18px] text-[#7335E5]">
                      Discount
                    </span>
                    <div className="w-[62%]">
                      <div className="flex gap-3">
                        <Radio
                          name="Discount_Type"
                          value="percentage"
                          checked={data.Discount_Type === "percentage"}
                          onChange={() => {
                            setDiscountTypeChangedToAmount(false);
                            setData({
                              ...data,
                              Discount_Type: "percentage",
                              Bill_Discount: 0,
                            });
                          }}
                          label={
                            <p className="mb-1 font-semibold font-poppins text-[#64728C] text-[8px] md:text-[12px]">
                              Percentage (%)
                            </p>
                          }
                        />
                        <Radio
                          name="Discount_Type"
                          value="amount"
                          checked={data.Discount_Type === "amount"}
                          onChange={() => {
                            setDiscountTypeChangedToAmount(true);
                            setData({
                              ...data,
                              Discount_Type: "amount",
                              Bill_Discount: 0,
                            });
                          }}
                          label={
                            <p className="mb-1 font-semibold font-poppins text-[#64728C] text-[8px] md:text-[12px]">
                              Amount (LKR)
                            </p>
                          }
                        />
                      </div>
                      {discountTypeChangedToAmount ? (
                        <input
                          type="text"
                          pattern="\d*\.?\d{0,2}"
                          id="discount"
                          name="discount"
                          value={data.Bill_Discount}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            if (
                              /^\d*\.?\d{0,2}$/.test(inputValue) ||
                              inputValue === ""
                            ) {
                              handleDiscountChange(e);
                            } else {
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                Bill_Discount:
                                  "Please enter a valid discount value",
                              }));
                            }
                          }}
                          className="w-full p-1 px-2 ml-3 border border-gray-300 focus:outline-none "
                        />
                      ) : (
                        <input
                          type="text"
                          pattern="\d*\.?\d{0,2}"
                          id="discount"
                          name="discount"
                          value={data.Bill_Discount}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            if (
                              (/^\d*\.?\d{0,2}$/.test(inputValue) &&
                                parseInt(inputValue) <= 100) ||
                              inputValue === ""
                            ) {
                              handleDiscountChange(e);
                            } else {
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                Discount:
                                  "Please enter a valid discount value between 0 and 100",
                              }));
                            }
                          }}
                          className="w-full p-1 px-2 ml-3 border border-[gray-300] focus:outline-none "
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex  items-center mb-2 px-2">
                    <span className="w-[35%] font-medium -ml-2  text-[#64728C]">
                      Total (LKR)
                    </span>

                    <span className=" ml-5 pl-3 w-[65%] text-[#64728C]">
                      {" "}
                      {isNaN(parseFloat(data.Net_Total))
                        ? "0.00"
                        : parseFloat(data.Net_Total).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="justify-end gap-1 pr-3 mt-6 md:flex">
                <button
                  onClick={handleSave}
                  className="md:w-fit  md:mt-0 mt-6 flex gap-2 items-center justify-end p-2 px-6 rounded-[20px] bg-[#769EFF4D] hover:bg-white text-[#10275E] hover:text-black border-[1px] hover:border-black text-[14px] md:text-[14px] md:leading-[21px] font-semibold transition-colors duration-500"
                  disabled={submitting}
                >
                  {submitting && <ProcessingIcon />}
                  <span>Save GRN</span>
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
        <AddGRNItem
          handleOpen={handleOpen}
          open={open}
          qtyTypes={qtyTypes}
          setItemData={setItemData}
          itemData={itemData}
          items={itemsOptions}
          isSearchable={isSearchable}
          handleItem={handleItem}
        />
        {selectedItem && (
          <EditGRNItem
            handleOpen={handleEditOpen}
            open={editOpen}
            editItem={selectedItem}
            setSelectedItem={setSelectedItem}
            items={itemsOptions}
            isSearchable={isSearchable}
            handleEditItem={handleEditItem}
            qtyTypes={qtyTypes}
          />
        )}
        {selectedSerialViewItem && (
          <ViewSerialNumbers
            handleOpen={handleViewSerialOpen}
            open={viewSerialOpen}
            serialItem={selectedSerialViewItem}
          />
        )}

        <ToastContainer />
      </section>
    </>
  );
};
