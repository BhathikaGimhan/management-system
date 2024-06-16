import React, { useState, useRef, useEffect } from "react";
import { Radio } from "@material-tailwind/react";
import Select from "react-select";
import axiosClient from "../../../axios-client";
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";
import {
  RemoveIcon,
  ViewSerialIcon,
  PlusIcon,
  StockIcon,
  CategoryIcon,
} from "../../utils/icons";
import { AddInvoiceItem } from "./AddInvoiceItem";
import { ViewSerialNumbers } from "./ViewSerialNumbers";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/NavigationContext";
import { ItemCategoryModal } from "../products/ItemCategoryModal";
import { AddProductModel } from "../../pages/products/AddProductModel";

// Main component for adding invoices
export const AddInvoice = () => {
  const { user } = useStateContext();
  const branch = user.branch;

  // State for managing opening/closing of add item modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  const [newCustomerOpen, setNewCustomerOpen] = useState(false);
  const newCustomerHandleOpen = () => setNewCustomerOpen((cur) => !cur);

  const [newProductOpen, setNewProductOpen] = useState(false);
  const newProductHandleOpen = () => setNewProductOpen((cur) => !cur);

  const [newProductCategoryOpen, setNewProductCategoryOpen] = useState(false);
  const newProductCategoryHandleOpen = () =>
    setNewProductCategoryOpen((cur) => !cur);

  const [customerTableLoading, setCustomerTableLoading] = useState(false);
  const handleLoading = () => setCustomerTableLoading((pre) => !pre);

  const [viewSerialOpen, setViewSerialOpen] = useState(false);
  const handleViewSerialOpen = () => setViewSerialOpen((cur) => !cur);

  const [productTableLoading, setProductTableLoading] = useState(false);
  const handleProductLoading = () => setProductTableLoading((pre) => !pre);

  const [productCategoryTableLoading, setProductCategoryTableLoading] =
    useState(false);
  const handleProductCategoryLoading = () =>
    setProductCategoryTableLoading((pre) => !pre);

  // State for managing opening/closing of edit item modal
  const [editOpen, setEditOpen] = useState(false);
  const handleEditOpen = () => setEditOpen((cur) => !cur);

  const [isSearchable, setIsSearchable] = useState(true);
  // State for managing customer selection
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);

  const [salesmen, setSalesmen] = useState([]);
  const [selectedSalesman, setSelectedSalesman] = useState(null);

  // State for managing item selection and related data
  const [items, setItems] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);

  const [discountTypeChangedToAmount, setDiscountTypeChangedToAmount] =
    useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [selectedSerialViewItem, setSelectedSerialViewItem] = useState(null);

  const [quotationAdded, setQuotationAdded] = useState(false);

  const [customerName, setCustomerName] = useState(null);
  const [paymentTypeChangedToInstallment, setPaymentTypeChangedToInstallment] =
    useState(false);

  const [salesmanEnabled, setSalesmanEnabled] = useState(0);

  const [installments, setInstallments] = useState([]);

  const [customerReturnLoaded, setCustomerReturnLoaded] = useState(false);
  const [customerReturnTotal, setCustomerReturnTotal] = useState(false);

  // State for managing form data and validation errors
  const [data, setData] = useState({
    Date: new Date().toISOString().split("T")[0], // Set default date as today's date
    Invoice_Number: "",
    Customer_idCustomer: "",
    Total: parseFloat(0),
    Discount_Presentage: parseFloat(0),
    Discount_Type: "percentage",
    Discount_Amount: parseFloat(0),
    Quotation_idQuotation: 0,
    Net_Amount: 0,
    Note: "",
    Paid_Amount: 0,
    Balance_Amount: 0,
    Credit_Balance: 0,
    Branch_idBranch: user.branch,
    User_idUser: user.userId,
    Payment_Type: 1,
    Payment_Option: 1,
    Installment_Count: 0,
  });
  const [errors, setErrors] = useState({});

  // State for managing total amount and discount
  const [totalAmount, setTotalAmount] = useState(0);
  const [Discount, setDiscount] = useState(0);

  const [paidAmount, setPaidAmount] = useState(0);
  const [balance, setBalance] = useState(0);

  // State for managing quotation ID
  const [invoiceId, setInvoiceId] = useState("");

  const [installmentCount, setInstallmentCount] = useState(0);
  const [paymentData, setPaymentData] = useState([]);

  // Function to fetch customers from API
  const getCustomers = () => {
    axiosClient
      .get(`/customer/${user.branch}`)
      .then((res) => {
        setCustomers(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRules = () => {
    axiosClient
      .get(`/rules/${user.branch}`)
      .then((res) => {
        setSalesmanEnabled(res.data[0].Salesman);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPaymentDetails = () => {
    axiosClient
      .get(`/branch/get-payment-details/${user.branch}`)
      .then((res) => {
        let data = res.data;
        setPaymentData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSalesmen = () => {
    axiosClient
      .get(`/employee/${user.branch}`)
      .then((res) => {
        let salesmenArray = res.data.map((salesman) => ({
          value: salesman.idEmployee,
          label: `${salesman.Employee_Name}`,
        }));
        setSalesmen(salesmenArray);
        setSelectedSalesman(salesmenArray[0]);
        setData((prevData) => ({
          ...prevData,
          Salesman: salesmenArray[0]?.value,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFormatData = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return formattedDate;
  };

  const [quotations, setQuotations] = useState([]);
  const [customerReturns, setCustomerReturns] = useState([]);

  // Function to fetch customers from API
  const getQuotations = (cus_id) => {
    axiosClient
      .get(`/quotation/customer/${cus_id}`)
      .then((res) => {
        const quotationOptions = res.data.map((quotation) => ({
          value: quotation.idQuotation,
          label:
            quotation.Quotation_Number + " " + handleFormatData(quotation.Date),
        }));
        setQuotations(quotationOptions);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to format the total amount as LKR currency
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Function to fetch customer returns from API
  const getCustomerReturns = () => {
    axiosClient
      .get(`/customer-return/${branch}`)
      .then((res) => {
        const filteredCustomerReturns = res.data.filter(
          (customerReturn) => customerReturn.Name === customerName
        );
        const customerReturnOptions = filteredCustomerReturns.map(
          (customerReturn) => ({
            value: customerReturn.idCustomer_Return,
            label: `${handleFormatData(customerReturn.Date)} | ${formatAmount(
              customerReturn.Total_Amount
            )}`,
          })
        );
        setCustomerReturns(customerReturnOptions);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleQuotationSelect = (selectedOption) => {
    axiosClient
      .get(`/quotation/single/${selectedOption.value}`)
      .then((res) => {
        const newData = res.data;
        setData({
          ...data,
          Quotation_idQuotation: selectedOption.value,
          cus_id: newData.quotation.Customer_idCustomer,
          customer_name: newData.quotation.Name,
          customer_email: newData.quotation.Email,
          customer_phone: newData.quotation.Tp,
          date: newData.quotation.Date,
          expire_date: newData.quotation.Expire_Date,
          Note: newData.quotation.Note,
          Total: newData.quotation.SubTotal,
          Discount_Presentage: newData.quotation.Discount,
          Discount_Type: newData.quotation.Discount_Type,
          Net_Amount: newData.quotation.Total,
          Discount_Amount: newData.quotation.SubTotal - newData.quotation.Total,
        });
        setInvoiceItems(newData.items);
        setQuotationAdded(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCustomerReturnSelect = (selectedOption) => {
    setCustomerReturnLoaded(true);
    axiosClient
      .get(`/customer-return/single/${selectedOption.value}`)
      .then((res) => {
        const newData = res.data;
        setData({
          ...data,
          Customer_Return_idCustomer_Return: selectedOption.value,
          cus_id: newData.Customer_idCustomer,
          customer_name: newData.Name,
          customer_phone: newData.Tp,
          date: newData.Date,
          Note: newData.Reason,
          Total: newData.Total_Amount * -1,
          Net_Amount: newData.Total_Amount * -1,
          Discount_Amount: newData.Total_Amount,
        });
        setCustomerReturnTotal(parseFloat(newData.Total_Amount) * -1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePaymentTypeSelect = (selectedOption) => {
    setData((prevData) => {
      const updatedData = {
        ...prevData,
        Payment_Type: selectedOption.value,
      };
      if (selectedOption.value === 1) {
        updatedData.Paid_Amount = prevData.Net_Amount;
      }
      if (selectedOption.value === 4) {
        updatedData.Paid_Amount = 0;
      }
      if (selectedOption.value === 2) {
        updatedData.Paid_Amount = 0;
      }
      if (selectedOption.value === 3) {
        updatedData.Paid_Amount = 0;
      }
      return updatedData;
    });
    setPaymentTypeChangedToInstallment(selectedOption.value === 2);
    setErrors((prevErrors) => ({
      ...prevErrors,
      payment_type: "",
    }));
  };

  const handlePaymentOptionSelect = (selectedOption) => {
    setData((prevData) => {
      const updatedData = {
        ...prevData,
        Payment_Option: selectedOption.value,
      };
      return updatedData;
    });
  };

  const viewSerialNumbers = (item) => {
    setSelectedSerialViewItem(item);
    setSelectedSerialViewItem({
      Item_Description: item.Item_Name,
      Serial_No: item.Serial_No,
      SelectedSerials: item.SelectedSerials,
    });
    handleViewSerialOpen();
  };

  // Function to fetch items from API
  const getItems = () => {
    axiosClient
      .get(`product/${user.branch}`)
      .then((res) => {
        setItems(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // useEffect hook to fetch customers and items on component mount
  useEffect(() => {
    getCustomers();
    getItems();
    getPaymentDetails();
  }, [productTableLoading]);
  useEffect(() => {
    getCustomers();
  }, [customerTableLoading]);
  useEffect(() => {
    getSalesmen();
    getRules();
  }, []);

  // Mapping customer data for Select component
  const customerOptions = customers.map((customer) => ({
    value: customer,
    label: `${customer.Name} - ${customer.Tp}`,
  }));

  // Mapping salesman data for Select component
  const salesmanOptions = salesmen.map((salesman) => ({
    value: salesman.value,
    label: salesman.label,
  }));

  // Mapping item data for Select component
  const itemsOptions = items.map((item) => ({
    value: item,
    label: item.Description,
  }));

  const paymentTypeOptions = [
    { value: 1, label: "Full Payment" },
    { value: 2, label: "Installment" },
    { value: 3, label: "Half Payment" },
    { value: 4, label: "Credit" },
  ];

  const paymentOptionOptions = [
    { value: 1, label: "Cash" },
    { value: 2, label: "Card" },
  ];

  // Function to handle customer selection
  const handleCustomerSelect = (selectedOption) => {
    setSelectedCustomer(selectedOption.value);
    setCustomerName(selectedOption.value.Name);
    setData({
      ...data,
      Customer_idCustomer: selectedOption.value.idCustomer,
    });
    setErrors({
      ...errors,
      customer: "",
    });
    getQuotations(selectedOption.value.idCustomer);
  };

  const handleSalesmanSelect = (selectedOption) => {
    setSelectedSalesman(selectedOption);
    setData((prevData) => ({
      ...prevData,
      Salesman: selectedOption.value,
    }));
    setErrors({
      ...errors,
      salesman: "",
    });
  };

  useEffect(() => {
    if (customerName) {
      getCustomerReturns(selectedCustomer);
    }
  }, [customerName]);

  const fetchInvoiceId = () => {
    axiosClient
      .get(`/invoice/get-invoice-id/${user.branch}`)
      .then((response) => {
        setInvoiceId(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quotation ID:", error);
      });
  };

  // useEffect hook to fetch quotation ID on component mount
  useEffect(() => {
    fetchInvoiceId();
  }, []);

  // Header items for Invoice table
  const headerItem = [
    "Item",
    "Rate (LKR)",
    "Quantity",
    "Discount",
    "Total (LKR)",
    "Action",
  ];

  // Calculating discounted amount
  let discountedAmount = 0;
  {
    !discountTypeChangedToAmount
      ? (discountedAmount = totalAmount - (totalAmount - Discount) / 100)
      : (discountedAmount = totalAmount - Discount);
  }

  const handleInstallmentCountChange = (count) => {
    setInstallmentCount(count);
  };

  useEffect(() => {
    const changeTotal = () => {
      let dicount_amount = 0;
      {
        !discountTypeChangedToAmount
          ? (dicount_amount = (data.Total * data.Discount_Presentage) / 100)
          : (dicount_amount = data.Discount_Amount);
      }
      let net_amount = data.Total - dicount_amount;
      console.log(net_amount);
      setData({
        ...data,
        Discount_Amount: dicount_amount,
        Net_Amount: net_amount,
      });
    };
    changeTotal();
  }, [data.Total, data.Discount_Presentage]);

  useEffect(() => {
    const changeTotalWithAmount = () => {
      if (discountTypeChangedToAmount) {
        let net_amount = data.Total - data.Discount_Amount;
        setData({
          ...data,
          Net_Amount: net_amount,
        });
      }
    };
    changeTotalWithAmount();
  }, [data.Total, data.Discount_Amount]);

  useEffect(() => {
    if (data.Installment_Count > 0) {
      const installmentAmount =
        (parseFloat(data.Net_Amount) - parseFloat(data.Paid_Amount)) /
        data.Installment_Count;
      const updatedInstallments = Array.from(
        { length: data.Installment_Count },
        (_, index) => ({
          id: index + 1,
          amount: installmentAmount.toFixed(2),
        })
      );
      setInstallments(updatedInstallments);
    } else {
      setInstallments([]);
    }
  }, [data.Installment_Count, data.Net_Amount, data.Paid_Amount]);

  useEffect(() => {
    if (data.Payment_Type === 2) {
      const totalWithInterest =
        parseFloat(data.Total) +
        (parseFloat(data.Total) * paymentData.Interest_Rate) / 100;
      setData((prevData) => ({
        ...prevData,
        Total: totalWithInterest,
      }));
    } else {
      const originalTotal =
        parseFloat(data.Total) / (1 + paymentData.Interest_Rate / 100);
      setData((prevData) => ({
        ...prevData,
        Total: originalTotal,
      }));
    }
  }, [paymentTypeChangedToInstallment]);

  useEffect(() => {
    setData((prevData) => {
      const balance = prevData.Paid_Amount - prevData.Net_Amount;
      return {
        ...prevData,
        Balance_Amount: balance,
      };
    });
  }, [data.Paid_Amount]);

  useEffect(() => {
    data.Payment_Type === 1 &&
      setData({ ...data, Paid_Amount: data.Net_Amount });
  }, [data.Net_Amount]);

  // Validation function for form data
  const validate = (valData) => {
    console.log(valData);
    const errors = {};
    if (!valData.Customer_idCustomer) {
      errors.customer = "Select Customer";
    }
    if (!valData.Date) {
      errors.Date = "Select Date";
    }
    if (invoiceId === "" || !invoiceId) {
      errors.Invoice_Number = "Enter Invoice Number";
    }
    if (invoiceItems.length <= 0) {
      errors.items = "Add Items";
    }
    if (valData.Net_Amount < 0) {
      errors.Net_Amount = "Net Amount cannot be less that 0";
    }
    if (
      valData.Payment_Type == 2 &&
      (valData.Installment_Count == 0 || !valData.Installment_Count)
    ) {
      errors.Installment_Count = "Installment Count cannot be 0";
    }
    return errors;
  };
  // Function to add item to invoice
  const handleItem = (item) => {
    const itemIndex = invoiceItems.findIndex(
      (i) =>
        i.Item_idItem === item.Item_idItem &&
        i.Discount === item.Discount &&
        i.Discount_Type === item.Discount_Type
    );
    if (itemIndex !== -1) {
      toast.error("You have already added the item. Please try again.");
      return;
    }

    let amount = parseFloat(data.Total) + parseFloat(item.Total_Amount);
    let dicount_amount = 0;
    {
      !discountTypeChangedToAmount
        ? (dicount_amount = (amount * data.Discount_Presentage) / 100)
        : (dicount_amount = data.Discount_Presentage);
    }
    let net_amount = amount - dicount_amount;
    setData({
      ...data,
      Net_Amount: net_amount,
      Discount_Amount: dicount_amount,
      Total: amount,
    });

    setInvoiceItems([...invoiceItems, item]);
    setErrors({
      ...errors,
      items: "",
    });
  };

  const handleRemoveItem = (itemToRemove, data) => {
    Swal.fire({
      title: "Are you sure you want to remove this item?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        const newInvoiceItems = invoiceItems.filter(
          (item) => item !== itemToRemove
        );
        const itemToRemoveAmount = parseFloat(itemToRemove.Total_Amount);
        const newTotalAmount = parseFloat(data.Total) - itemToRemoveAmount;

        setData({
          ...data,
          Total: newTotalAmount,
        });
        setInvoiceItems(newInvoiceItems);

        Swal.fire("Deleted!", "The item has been removed.", "success");
      }
    });
  };

  const [shouldPrint, setShouldPrint] = useState(false);

  // Function to handle save action
  const handleSave = async () => {
    const validationErrors = validate(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      let errorMessage = "";
      Object.values(validationErrors).forEach((error) => {
        errorMessage += `${error}\n`;
      });
      Swal.fire({
        icon: "error",
        text: "Please fill out all required fields.",
        allowOutsideClick: false,
      });
      return;
    }

    // Display confirmation dialog
    const result = await Swal.fire({
      text: "Are you sure you want to save and issue the invoice?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Save and Issue",
      cancelButtonText: "Cancel",
    });

    // Check if user clicked the "Save and Issue" button
    if (result.isConfirmed) {
      setSubmitting(true);

      let invoiceType = 1;
      for (let item of invoiceItems) {
        if (item.Item_Type == 2) {
          invoiceType = 2;
          break;
        }
      }

      let Credit_Balance = 0;
      let Balance_Amount = data.Balance_Amount;
      if (data.Balance_Amount < 0) {
        Credit_Balance = -1 * data.Balance_Amount;
        Balance_Amount = 0;
      }
      let submitData = {
        Quotation_idQuotation: data.Quotation_idQuotation,
        Customer_idCustomer: data.Customer_idCustomer,
        Invoice_Date: data.Date,
        Discount_Presentage: data.Discount_Presentage,
        Discount_Type: data.Discount_Type,
        Net_Amount: data.Net_Amount,
        Paid_Amount: data.Paid_Amount,
        Balance_Amount: Balance_Amount,
        Credit_Balance: Credit_Balance,
        Discount_Amount: data.Discount_Amount,
        Total: data.Total,
        Note: data.Note,
        Branch_idBranch: user.branch,
        User_idUser: user.userId,
        Invoice_Number: invoiceId,
        Payment_Type: data.Payment_Type,
        Payment_Option: data.Payment_Type === 4 ? 0 : data.Payment_Option,
        Employee_idEmployee: salesmanEnabled === 1 ? data.Salesman : null,
        Installment_Count: data.Installment_Count,
        items: invoiceItems,
        Invoice_Type: invoiceType,
        Status: invoiceType === 1 ? 1 : 0,
      };
      try {
        const response = await axiosClient.post("invoice", {
          ...submitData,
        });
        navigate("/invoices");
        Swal.fire({
          title: "Success",
          text: "Invoice added successfully !",
        });
        setData({});
        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
        Swal.fire({
          title: "Error",
          text: "Failed to add Invoice. Please try again.",
        });
      }
    }
  };

  const navigate = useNavigate();
  const handlePyamentComplete = () => {
    setShouldPrint(false);
    navigate("/invoices");
    toast.success("Invoice added successfully !");
  };

  // Ref for printing
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => handlePyamentComplete(),
  });

  useEffect(() => {
    if (shouldPrint) {
      handlePrint();
    }
  }, [shouldPrint, handlePrint]);

  // useEffect to update balance when paidAmount or discountedAmount changes
  useEffect(() => {
    const newBalance = discountedAmount - paidAmount;
    setBalance(newBalance);
  }, [discountedAmount, paidAmount]);

  const [address, setAddress] = useState({});
  useEffect(() => {
    const getAddress = () => {
      axiosClient
        .get(`/branch/${branch}`)
        .then((res) => {
          let data = res.data;
          setAddress(data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getAddress();
  }, [user.branch]);

  const TABLE_INVOICE = [
    {
      name: "Action",
      cell: (row) => (
        <>
          <Tooltip content="Edit Customer">
            <IconButton
              onClick={() => handleEditClick(row)}
              variant="text"
              className="mx-2 bg-white"
            >
              <EditNewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip content="Delete Customer">
            <IconButton
              onClick={() => handleDelete(row)}
              variant="text"
              className="mr-2 bg-white"
            >
              <RemoveIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  //React select styles
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      fontSize: "14px",
      fontWeight: "600",
      color: "#64728C",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "#64728C",
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "#64728C" : "#64728C",
      backgroundColor: state.isSelected ? "#e7e7e7" : "white",
      ":hover": {
        backgroundColor: state.isSelected ? "#ccc" : "#f3f3f3",
      },
      fontSize: "14px",
      fontWeight: "600",
    }),
  };

  return (
    <>
      <section className="mt-8 pb-[40px]">
        <div className="w-full bg-white rounded-[15px] md:px-[30px] p-3 pt-[20px] pb-[40px]">
          <div className="flex justify-between w-full ">
            <span className="font-poppins font-medium text-[16px] md:text-[22px] leading-[32px] text-[#64728C]">
              + New Invoice
            </span>
          </div>
          <div className="mt-[10px] hidden md:block">
            {errors.customer && (
              <span className=" text-[#ff0000a1] px-1 font-poppins font-bold text-xs">
                {errors.customer}
              </span>
            )}
          </div>

          <div className="md:px-[2%] mt-10">
            <div className="border border-[#e7e9ec ] bg-[#979797] bg-opacity-5 rounded-[10px] p-6 w-ful">
              <div className="flex flex-col-reverse justify-between gap-4 md:gap-10 md:flex-row md:border-b border-[#dbdee3] pb-5">
                <div className="flex flex-col md:w-[30%] items-center gap-2">
                  <div className="flex items-center w-full gap-5">
                    <span className="font-poppins text-[12px] md:text-[14px] w-[20%] font-medium leading-[18px] md:leading-[22px] text-[#64728C]">
                      Date
                    </span>
                    <div class="date-input-container  md:w-[300px]">
                      <input
                        type="date"
                        class="custom-date-input"
                        value={data.Date}
                        onChange={(e) => {
                          setData({
                            ...data,
                            Date: e.target.value,
                          });
                          setErrors({
                            ...errors,
                            Date: "",
                          });
                        }}
                      />
                    </div>
                    {errors.Date && (
                      <span className=" text-[#ff0000a1] px-1 font-poppins font-bold text-xs">
                        {errors.Date}
                      </span>
                    )}
                  </div>

                  {salesmanEnabled === 1 && (
                    <div className="flex items-center w-full gap-5">
                      <div className="font-poppins text-[12px] md:text-[14px] w-[20%] font-medium leading-[18px] md:leading-[22px] text-[#64728C]">
                        Salesman
                      </div>
                      <Select
                        className="md:w-[300px] w-[210px]"
                        classNamePrefix="select"
                        defaultValue={salesmanOptions[0]}
                        value={selectedSalesman}
                        isSearchable={isSearchable}
                        name="salesman"
                        options={salesmanOptions}
                        onChange={handleSalesmanSelect}
                        styles={customSelectStyles}
                      />
                      {errors.salesman && (
                        <span className=" text-[#ff0000a1] px-1 font-poppins font-bold text-xs">
                          {errors.salesman}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-end">
                  <div className="font-poppins font-medium text-[24px] leading-9 text-[#64728C]">
                    Invoice
                  </div>
                  <input
                    name="Invoice Number"
                    type="text"
                    className="rounded-[15px] focus:outline-[#bdbdbd]  border-0 py-2 pl-3 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 placeholder:text-[#64728C]-400 w-[100px] flex justify-center placeholder:text-[14px] md:placeholder:text-[14px] placeholder:poppins focus:ring-1 focus:ring-inset sm:leading-6 text-[14px] md:text-[15px] font-normal font-poppins items-center"
                    value={invoiceId}
                    onChange={(e) => {
                      setInvoiceId(e.target.value);
                      setErrors({
                        ...errors,
                        Invoice_Number: "",
                      });
                    }}
                  />
                  {errors.Invoice_Number && (
                    <span className=" text-[#ff0000a1] px-1 font-poppins font-bold text-xs">
                      {errors.Invoice_Number}
                    </span>
                  )}
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
                  <div className="w-full overflow-x-scroll overflow-y-hidden bg-white pb-18 md:overflow-auto">
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
                        {invoiceItems.length <= 0 ? (
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
                          invoiceItems.map((item, itemIndex) => {
                            return (
                              <tr
                                className=" border-t-[1px] border-[#0000001e]"
                                key={itemIndex}
                              >
                                <td className="p-2 font-poppins font-normal text-[14px] leading-[10px]">
                                  {item.Item_Name}
                                </td>
                                <td className="p-2 font-poppins font-normal text-[14px] leading-[10px] text-right pr-[10%]">
                                  {item.Rate % 1 !== 0
                                    ? `${parseFloat(
                                        item.Total_Amount
                                      ).toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}`
                                    : `${item.Rate}.00`}
                                </td>
                                <td className="p-2 font-poppins font-normal text-[14px] leading-[10px] text-right pr-[10%]">
                                  {parseInt(item.Qty).toLocaleString("en-US")}
                                </td>
                                <td className="p-2 font-poppins font-normal text-[14px] leading-[10px] text-right pr-[10%]">
                                  {item.Discount_Type === "amount"
                                    ? "LKR"
                                    : null}
                                  {item.Discount ? `${item.Discount}` : 0}
                                  {item.Discount_Type === "percentage"
                                    ? "%"
                                    : null}
                                </td>
                                <td className="p-2 font-poppins font-normal text-[14px] leading-[10px] text-right pr-[10%]">
                                  {parseFloat(item.Total_Amount).toLocaleString(
                                    "en-US",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </td>
                                <td className="flex gap-2 p-2 font-medium text-black font-poppins">
                                  <button
                                    onClick={() => viewSerialNumbers(item)}
                                    className="hover:opacity-70 text-white text-[10px] p-2 rounded"
                                  >
                                    <ViewSerialIcon />
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
                  <button
                    className="bg-[#769EFF] bg-opacity-30 font-poppins text-[10px] font-normal leading-[15px] px-2 py-1 rounded-[10px] flex items-center justify-center gap-2 text-[#10275E] hover:opacity-75 mt-2 md:hidden"
                    onClick={handleOpen}
                  >
                    + Add Item
                  </button>
                  {errors.items && (
                    <span className=" text-[#ff0000a1] px-1 font-poppins font-bold text-xs">
                      {errors.items}
                    </span>
                  )}
                  <div className="flex gap-3 pb-5 pl-3 mt-3">
                    <button
                      className="bg-[#769EFF] bg-opacity-30 font-poppins font-normal p-2 leading-[15px] rounded-[10px] flex items-center justify-center gap-2 text-[#10275E] hover:opacity-75"
                      onClick={newProductHandleOpen}
                    >
                      <StockIcon color="black" width="12px" />
                    </button>
                    <button
                      className="bg-[#769EFF] bg-opacity-30 font-poppins text-[10px] md:text-[12px] font-normal leading-[15px] px-2 py-1 rounded-[10px] flex items-center justify-center gap-2 text-[#10275E] hover:opacity-75"
                      onClick={newProductCategoryHandleOpen}
                    >
                      <CategoryIcon width={"12px"} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-10 mt-10 mb-2 md:justify-between md:flex-row md:mt-6">
                  <div className="font-poppins text-sm md:w-[35%] w-[100%]">
                    <div className="hidden md:block">
                      <div className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] text-[#64728C] mb-2">
                        Note
                      </div>
                      <textarea
                        value={data.Note}
                        onChange={(e) => {
                          setData({
                            ...data,
                            Note: e.target.value,
                          });
                        }}
                        placeholder="Type here...."
                        className="md:min-h-[120px] min-h-[80px] focus:outline-[#bdbdbd] w-full border border-[#64728C] border-opacity-15 rounded-[15px] p-3 font-poppins text-[14px] font-medium leading-[18px] text-[#64728C]"
                      ></textarea>
                    </div>
                    {paymentTypeChangedToInstallment &&
                      installments.length > 0 && (
                        <div className="mt-5">
                          <div className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] text-[#64728C] mb-2">
                            Installment Plan
                          </div>
                          <table className="font-poppins text-[14px] mt-2 transition-all duration-300 w-full mb-5 bg-white">
                            <thead>
                              <tr className="bg-white h-[10px]"></tr>
                              <tr className="border-t border-b border-[#7335E5]">
                                <th className=" px-5 text-left font-poppins font-semibold text-[12px] leading-[18px] text-[#7335E5] py-1">
                                  Installment #
                                </th>
                                <th className=" px-5 text-left font-poppins font-semibold text-[12px] leading-[18px] text-[#7335E5] py-1">
                                  Date
                                </th>
                                <th className=" px-5 text-left font-poppins font-semibold text-[12px] leading-[18px] text-[#7335E5] py-1">
                                  Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {installments.map((installment, index) => (
                                <tr
                                  key={installment.id}
                                  className="border-b border-[#e0e3e8]"
                                >
                                  <td className="font-poppins text-[12px] px-5 leading-[18px] text-[#64728C] py-1">
                                    {installment.id}
                                  </td>
                                  <td className="font-poppins text-[12px] px-5 leading-[18px] text-[#64728C] py-1">
                                    {handleFormatData(
                                      new Date(
                                        Date.now() +
                                          (index + 1) * 30 * 24 * 60 * 60 * 1000
                                      )
                                    )}
                                  </td>

                                  <td className="font-poppins text-[12px] px-5 leading-[18px] text-[#64728C] py-1">
                                    {installment.amount}
                                  </td>
                                </tr>
                              ))}
                              <tr className="bg-white h-[10px]"></tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                  </div>
                  <div className="text-sm md:w-[43%] w-full">
                    <div className="flex items-center justify-between px-2 mb-2">
                      <span className="md:w-[35%] w-[50%] font-poppins font-semibold text-[12px] md:text-[14px] leading-[18px] text-[#64728C]">
                        Subtotal (LKR ):
                      </span>
                      <span className=" ml-5 w-[65%] font-poppins font-semibold text-[12px] md:text-[14px] leading-[18px] text-[#64728C] text-right">
                        {isNaN(parseFloat(data.Total))
                          ? "0.00"
                          : parseFloat(data.Total).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                      </span>
                    </div>
                    <div className="flex items-center w-full px-2 py-2 mb-2 bg-[#FFF2E9]">
                      <span className="md:w-[35%] font-poppins font-semibold text-[12px] md:text-[14px] leading-[18px] text-[#7335E5]">
                        Discount (%)
                      </span>
                      <div className="w-[62%]">
                        <div className="flex gap-3">
                          <Radio
                            name="Discount_Type"
                            color="blue-gray"
                            value="percentage"
                            defaultChecked={!discountTypeChangedToAmount}
                            onChange={() => {
                              setDiscountTypeChangedToAmount(false);
                              setData({
                                ...data,
                                Discount_Type: "percentage",
                                Discount_Presentage: 0,
                                Discount_Amount: 0,
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
                            color="blue-gray"
                            value="amount"
                            onChange={() => {
                              setDiscountTypeChangedToAmount(true);
                              setData({
                                ...data,
                                Discount_Type: "amount",
                                Discount_Amount: 0,
                                Discount_Presentage: 0,
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
                            disabled={quotationAdded}
                            value={data.Discount_Amount}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              if (
                                /^\d*\.?\d{0,2}$/.test(inputValue) ||
                                inputValue === ""
                              ) {
                                setData({
                                  ...data,
                                  Discount_Amount: inputValue,
                                });
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  Discount: "",
                                }));
                              } else {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  Discount:
                                    "Please enter a valid discount value between 0 and 100",
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
                            disabled={quotationAdded}
                            value={data.Discount_Presentage}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              if (
                                (/^\d*\.?\d{0,2}$/.test(inputValue) &&
                                  parseInt(inputValue) <= 100) ||
                                inputValue === ""
                              ) {
                                setData({
                                  ...data,
                                  Discount_Presentage: inputValue,
                                });
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  Discount: "",
                                }));
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
                        Total (LKR) :
                      </span>

                      <span className=" ml-5 w-[65%] font-poppins font-semibold text-[12px] md:text-[14px] leading-[18px] text-[#64728C] text-right">
                        {isNaN(parseFloat(data.Net_Amount))
                          ? "0.00"
                          : parseFloat(data.Net_Amount).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                      </span>
                    </div>
                    {errors.Net_Amount && (
                      <span className=" text-[#ff0000a1] px-1 font-poppins font-bold text-xs">
                        {errors.Net_Amount}
                      </span>
                    )}
                  </div>
                  <div className="md:hidden">
                    <div className="font-poppins font-medium text-[12px] md:text-[14px] leading-[18px] md:leading-[22px] text-[#64728C] mb-2">
                      Notes
                    </div>
                    <textarea
                      value={data.Note}
                      v9
                      onChange={(e) => {
                        setData({
                          ...data,
                          Note: e.target.value,
                        });
                      }}
                      placeholder="Type here...."
                      className="md:min-h-[120px] min-h-[80px] w-full border border-[#64728C] border-opacity-15 rounded-[15px] p-3 font-poppins text-[12px] font-medium leading-[18px] text-[#64728C]"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-1 pr-3 mt-6">
            <button className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] flex items-center justify-center gap-2 text-[#10275E] hover:opacity-75">
              <span className="">Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="bg-[#769EFF] bg-opacity-30 font-poppins text-[14px] font-semibold leading-[22px] px-4 py-2 rounded-[20px] min-w-[80px] flex items-center justify-center gap-2 text-[#10275E] hover:opacity-75"
              disabled={submitting}
            >
              <span>Save and Issue</span>
            </button>
          </div>
        </div>
        <div>
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
          <AddInvoiceItem
            handleOpen={handleOpen}
            open={open}
            invoicePackages={itemsOptions}
            isSearchable={isSearchable}
            handleItem={handleItem}
          />
          {selectedSerialViewItem && (
            <ViewSerialNumbers
              handleOpen={handleViewSerialOpen}
              open={viewSerialOpen}
              serialItem={selectedSerialViewItem}
            />
          )}
        </div>
      </section>
    </>
  );
};
