import React, { useState, useEffect } from "react";
import { Card, CardBody, Radio } from "@material-tailwind/react";
import Select from "react-select";
import axiosClient from "../../../axios-client";
import {
  EditNewIcon,
  RemoveIcon,
  ViewSerialIcon,
  PlusIcon,
  StockIcon,
  CategoryIcon,
} from "../../utils/icons";
import { AddGRNItem } from "./AddGRNItem";
import { EditGRNItem } from "./EditGRNItem";
import { AddSerialNumbers } from "./AddSerialNumbers";
import { ViewSerialNumbers } from "./ViewSerialNumbers";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/NavigationContext";
import Swal from "sweetalert2";
import { AddProductModel } from "../products/AddProductModel";
import { ItemCategoryModal } from "../products/ItemCategoryModal";

export const AddGRN = () => {
  const { user } = useStateContext();
  // State for managing opening/closing of add item modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  const [supplierTableLoading, setSupllierTableLoading] = useState(false);
  const handleLoading = () => setSupllierTableLoading((pre) => !pre);

  const [newOpen, setNewOpen] = useState(false);
  const newSupplierHandleOpen = () => setNewOpen((cur) => !cur);

  const [newProductOpen, setNewProductOpen] = useState(false);
  const newProductHandleOpen = () => setNewProductOpen((cur) => !cur);

  const [newProductCategoryOpen, setNewProductCategoryOpen] = useState(false);
  const newProductCategoryHandleOpen = () =>
    setNewProductCategoryOpen((cur) => !cur);

  // State for managing opening/closing of edit item modal
  const [editOpen, setEditOpen] = useState(false);
  const handleEditOpen = () => setEditOpen((cur) => !cur);

  const [serialOpen, setSerialOpen] = useState(false);
  const handleSerialOpen = () => setSerialOpen((cur) => !cur);

  const [viewSerialOpen, setViewSerialOpen] = useState(false);
  const handleViewSerialOpen = () => setViewSerialOpen((cur) => !cur);

  const [discountTypeChangedToAmount, setDiscountTypeChangedToAmount] =
    useState(false);

  const [productTableLoading, setProductTableLoading] = useState(false);
  const handleProductLoading = () => setProductTableLoading((pre) => !pre);

  const [productCategoryTableLoading, setProductCategoryTableLoading] =
    useState(false);
  const handleProductCategoryLoading = () =>
    setProductCategoryTableLoading((pre) => !pre);

  const isSearchable = true;
  // State for managing customer selection
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // State for managing item selection and related data
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSerialViewItem, setSelectedSerialViewItem] = useState(null);
  const [grnItems, setGRNItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [serialItem, setSerialItem] = useState(null);

  const handleFormatData = (date) => {
    const dateObject = new Date(date);
    const yea = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObject.getDate().toString().padStart(2, "0");
    const formattedDate = `${yea}-${month}-${day}`;
    return formattedDate;
  };

  // State for managing form data and validation errors
  const [data, setData] = useState({
    Date: handleFormatData(new Date()),
    Supplier_idSupplier: 0,
    Bill_no: "",
    Bill_Discount: "",
    Discount_Amount: 0,
    Total_Amount: 0,
    Net_Total: 0,
    Branch_idBranch: user.branch,
    User_idUser: user.userId,
    Discount_Type: "percentage",
  });
  const [errors, setErrors] = useState({});

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

  const [suppliers, setSuppliers] = useState([]);
  // Function to fetch suppliers from API
  const getSuppliers = () => {
    axiosClient
      .get(`/supplier/${user.branch}`)
      .then((res) => {
        setSuppliers(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [qtyTypes, setQtyTypes] = useState([]);
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
    getSuppliers();
    getItems();
    getQtyTypes();
  }, [supplierTableLoading, productTableLoading]);

  // Mapping customer data for Select component
  const supplierOptions = suppliers.map((supplier) => ({
    value: supplier,
    label: supplier.Company_Name,
  }));

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
    "Discount",
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
    amount = data.Total_Amount + item.Total;
    let dicount_amount = (amount * data.Bill_Discount) / 100;
    let net_amount = amount - dicount_amount;
    setData({
      ...data,
      Total_Amount: amount,
      Net_Total: net_amount,
    });
    setSerialItem({
      Item_idItem: item.Item_idItem,
      Item_Description: item.Item_Description,
      Cost: item.Cost,
      Qty_Type: item.Qty_Type,
      Qty: item.Qty,
      Total: item.Total,
      Discount: item.Discount,
      Old_discount: item.Discount,
      Item_Has_Serial: item.Item_Has_Serial,
    });
    setGRNItems([...grnItems, item]);
    setErrors({
      ...errors,
      items: "",
    });
    if (item.Item_Has_Serial === 1) {
      handleSerialOpen();
    }
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
      Discount_Type: item.Discount_Type,
      Old_discount: item.Discount,
      Item_Has_Serial: item.Item_Has_Serial,
      Serial_No: item.Serial_No,
    });
    handleEditOpen();
  };

  const handleEditItem = (newItem) => {
    const itemIndex = grnItems.findIndex(
      (item) =>
        item.Item_idItem === newItem.Item_idItem &&
        item.Discount === newItem.Old_discount
    );
    const updatedGRNItems = [...grnItems];
    updatedGRNItems[itemIndex] = newItem;
    let updatedTotalAmount = 0;
    updatedGRNItems.forEach((item) => {
      updatedTotalAmount += item.Total;
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

  const handleSerialNumbers = (item) => {
    for (let i = 0; i < grnItems.length; i++) {
      if (grnItems[i].Item_idItem === item.Item_idItem) {
        grnItems[i].Serial_No = item.Serial_No;
        break;
      }
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

  // Function to remove item from GRN
  const handleRemoveItem = (itemToRemove) => {
    const newGRNItems = grnItems.filter(
      (item) => item.Item_idItem !== itemToRemove.Item_idItem
    );
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
      let dicount_amount = 0;
      discountTypeChangedToAmount
        ? (dicount_amount = data.Bill_Discount)
        : (dicount_amount = (data.Total_Amount * data.Bill_Discount) / 100);
      let net_amount = data.Total_Amount - dicount_amount;
      setData({
        ...data,
        Net_Total: net_amount,
        Discount_Amount: dicount_amount,
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

  const navigate = useNavigate();

  const handleSave = async () => {
    const validationErrors = validate(data);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      const result = await Swal.fire({
        text: "Are you sure you want to save the GRN?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Save and Issue",
        cancelButtonText: "Cancel",
      });
      if (result.isConfirmed) {
        setSubmitting(true);
        try {
          axiosClient
            .post(`/grn`, data)
            .then((res) => {
              navigate("/grn");
              toast.success("Grn added successfully !");
            })
            .catch((error) => {
              console.log(error);
              toast.error("Failed to add Grn. Please try again.");
            });
          setSubmitting(false);
        } catch (error) {
          setSubmitting(false);
          toast.error("Failed to add Grn. Please try again.");
        }
      }
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

  //React select styles
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      fontSize: "14px",
      fontWeight: "600",
      color: state.isFocused ? "#64728C" : "#64728C82", // Change text color based on focus state
      borderColor: state.isFocused ? "#64728C" : provided.borderColor, // Change border color on focus
      boxShadow: state.isFocused ? "0 0 0 1px #64728C" : provided.boxShadow, // Change box shadow on focus
      "&:hover": {
        borderColor: state.isFocused ? "#64728C" : provided.borderColor,
      },
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "#64728C" : "#64728C", // Keep the text color consistent
      backgroundColor: state.isSelected ? "#e7e7e7" : "white",
      ":hover": {
        backgroundColor: state.isSelected ? "#ccc" : "#f3f3f3",
      },
      fontSize: "14px",
      fontWeight: "600",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#64728C", // Change text color for selected value
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: "#bdbdbd", // Set the placeholder color
    }),
  };

  return (
    <>
      <section className="mt-8 pb-[40px]">
        <Card className="rounded-[20px] pb-[3%] pt-3">
          <CardBody className="flex flex-col gap-5 p-3 px-6 ">
            <div className="flex justify-between w-full ">
              <span className="font-poppins font-medium text-[16px] md:text-[22px] leading-[32px] text-[#64728C]">
                + New GRN
              </span>
            </div>

            <div className="justify-between w-full gap-2 md:flex">
              <div className="md:w-[350px] md:flex flex-col md:flex-row mb-3 md:mb-0">
                <div className="flex md:mb-0 w-ful md:w-[250px] md:items-center flex-col md:flex-row gap-2 md:gap-0">
                  <span className="font-poppins text-[12px] md:text-[14px] font-medium leading-[18px] md:leading-[22px] text-[#64728C]">
                    Supplier
                  </span>
                  <div>
                    <Select
                      className="md:w-[250px] w-full md:ml-3"
                      classNamePrefix="select"
                      defaultValue={supplierOptions[0]}
                      isSearchable={isSearchable}
                      options={supplierOptions}
                      styles={customSelectStyles}
                      onChange={(selectedOption) => {
                        setSelectedSupplier(selectedOption);
                        setData({
                          ...data,
                          Supplier_idSupplier: selectedOption.value.idSupplier,
                        });
                        setErrors({ ...errors, Supplier_idSupplier: "" });
                      }}
                    />
                    {errors.Supplier_idSupplier && (
                      <span className=" text-[#ff0000a1] font-inter font-bold text-xs md:hidden">
                        {" "}
                        {errors.Supplier_idSupplier}{" "}
                      </span>
                    )}
                  </div>
                  <div className="md:ml-5">
                    <button
                      className="w-[30px] h-[30px] rounded-full bg-[#769EFF] bg-opacity-30 pl-2 md:pl-0 md:flex items-center justify-center cursor-pointer"
                      onClick={newSupplierHandleOpen}
                    >
                      <PlusIcon width={"15px"} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex md:mb-0 w-full md:w-[300px] md:items-center flex-col md:flex-row gap-2 md:gap-0">
                <span className="font-poppins text-[12px] md:text-[14px] font-medium leading-[18px] md:leading-[22px] text-[#64728C] whitespace-nowrap">
                  Invoice No
                </span>
                <input
                  className="md:w-[250px] focus:outline-[#bdbdbd] p-1 px-5 py-2 border border-[#e6e8ed] rounded-[15px] md:ml-3"
                  type="text"
                  onChange={(e) => {
                    setData({
                      ...data,
                      Bill_no: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="flex md:mb-0 w-ful md:w-[350px] md:items-center flex-col md:flex-row gap-2 md:gap-0">
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
            {errors.Supplier_idSupplier && (
              <span className=" text-[#ff0000a1] font-inter font-bold text-xs hidden md:block">
                {" "}
                {errors.Supplier_idSupplier}{" "}
              </span>
            )}

            <div className="flex flex-col items-start justify-between w-full gap-10 md:flex-row md:gap-5">
              {selectedSupplier && (
                <div className="w-full md:w-[40%] my-10">
                  <div className="flex flex-col gap-5 text-sm">
                    <div className="flex gap-4">
                      <div className="flex flex-col gap-3 font-medium text-[#64728C]">
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
                      <div className="flex flex-col gap-3 text-[#64728C]">
                        <div className="text-[#64728C] font-poppins font-normal text-[12px] md:text-[14px] leading-[18px] md:leading-[22px]">
                          {selectedSupplier.value.idSupplier}
                        </div>
                        <div className="text-[#64728C] font-poppins font-normal text-[12px] md:text-[14px] leading-[18px] md:leading-[22px]">
                          {selectedSupplier.value.Company_Name}
                        </div>
                        <div className="text-[#64728C] font-poppins font-normal text-[12px] md:text-[14px] leading-[18px] md:leading-[22px]">
                          {selectedSupplier.value.Contact_No}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                              <td className="p-2 font-poppins font-normal text-[14px] leading-[10px] text-right pr-[10%] text-[#64728C] whitespace-nowrap">
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
                <div className="flex items-center gap-3 mt-5">
                  <button
                    className="bg-[#769EFF] bg-opacity-30 font-poppins text-[10px] font-normal leading-[15px] px-2 py-1 rounded-[10px] flex items-center justify-center gap-2 text-[#10275E] hover:opacity-75 mt-2 md:hidden"
                    onClick={handleOpen}
                  >
                    + Add Item
                  </button>
                  <button
                    className="bg-[#769EFF] bg-opacity-30 font-poppins font-normal p-2 leading-[15px] rounded-[10px] flex items-center justify-center gap-2 text-[#10275E] hover:opacity-75"
                    onClick={newProductHandleOpen}
                  >
                    <StockIcon color="black" width="12px" />
                  </button>
                  <button
                    className="bg-[#769EFF] bg-opacity-30 font-poppins font-normal p-2 leading-[15px] rounded-[10px] flex items-center justify-center gap-2 text-[#10275E] hover:opacity-75"
                    onClick={newProductCategoryHandleOpen}
                  >
                    <CategoryIcon color="black" width="12px" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-10 mt-10 md:flex-row md:justify-end md:mt-8 ">
                <div className="text-sm md:w-[30%]">
                  <div className="flex items-center mb-2">
                    <span className="md:w-[35%] w-[50%] font-poppins font-semibold text-[12px] md:text-[14px] leading-[18px] text-[#64728C]">
                      Subtotal (LKR)
                    </span>
                    <span className="ml-5 w-[65%] font-poppins font-semibold text-[12px] md:text-[14px] leading-[18px] text-[#64728C]">
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

                  <div className="flex items-center w-full px-2 py-2 mb-2 bg-[#FFF2E9]">
                    <span className="md:w-[35%] font-poppins font-semibold text-[12px] md:text-[14px] leading-[18px] text-[#FF8828]">
                      Discount
                    </span>
                    <div className="w-[62%]">
                      <div className="flex gap-3">
                        <Radio
                          color="blue-gray"
                          name="Discount_Type"
                          value="percentage"
                          defaultChecked={!discountTypeChangedToAmount}
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
                          color="blue-gray"
                          name="Discount_Type"
                          value="amount"
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
                      {!discountTypeChangedToAmount}
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

                  <div className="flex items-center px-2 mb-2">
                    <span className="md:w-[35%] w-[50%] font-poppins font-semibold text-[12px] md:text-[14px] leading-[18px] text-[#64728C]">
                      Total (LKR)
                    </span>

                    <span className="ml-5 w-[65%] font-poppins font-semibold text-[12px] md:text-[14px] leading-[18px] text-[#64728C]">
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

              <div className="flex justify-end gap-5 mt-10 md:mt-6">
                <button
                  onClick={handleSave}
                  className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] flex items-center justify-center gap-2 text-[#10275E] hover:opacity-75"
                  disabled={submitting}
                >
                  <span>Save</span>
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
        <AddProductModel
          handleOpen={newProductHandleOpen}
          open={newProductOpen}
          handleLoading={handleProductLoading}
        />
        <ItemCategoryModal
          handleOpen={newProductCategoryHandleOpen}
          open={newProductCategoryOpen}
          handleLoading={handleProductCategoryLoading}
        />
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
        <AddSerialNumbers
          handleOpen={handleSerialOpen}
          open={serialOpen}
          serialItem={serialItem}
          setSerialItem={setSerialItem}
          handleSerialNumbers={handleSerialNumbers}
          handleRemoveItem={handleRemoveItem}
        />
        {selectedSerialViewItem && (
          <ViewSerialNumbers
            handleOpen={handleViewSerialOpen}
            open={viewSerialOpen}
            serialItem={selectedSerialViewItem}
          />
        )}
      </section>
    </>
  );
};
