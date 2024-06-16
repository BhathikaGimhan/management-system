import { BookOpenIcon, UsersIcon } from "@heroicons/react/24/outline";
import {
  DashboardIcon,
  InvoiceIcon,
  ReportIcon,
  StockIcon,
  SalesmanIcon,
} from "./icons";

import Group1 from "./../assets/images/G1.png";
import Group2 from "./../assets/images/G2.png";
import Group3 from "./../assets/images/G3.png";
import Group4 from "./../assets/images/G4.png";
import Group5 from "./../assets/images/G5.png";
import Group6 from "./../assets/images/G6.png";

const Salesmen = [
  {
    title: "Manage Salesmen",
    link: "salesman",
    icon: UsersIcon,
  },
  {
    title: "Salesman Credit Logs",
    link: "Salesman-credit-logs",
    icon: BookOpenIcon,
  },
];
export const newNavigationItems = [
  {
    title: "Dashboard",
    link: "",
    icon: DashboardIcon,
    children: 0,
  },
  {
    title: "Invoices",
    link: "invoices",
    icon: InvoiceIcon,
    children: 0,
  },
  {
    title: "Stocks",
    link: "products",
    icon: StockIcon,
    children: 0,
  },
  {
    title: "Salesmen",
    link: "salesman",
    icon: SalesmanIcon,
    children: 0,
  },
  {
    title: "Reports",
    link: "reports",
    icon: ReportIcon,
    children: 0,
  },
];

export const gender = [
  {
    id: "Mr",
    key: "Mr",
  },
  {
    id: "Mrs",
    key: "Mrs",
  },
  {
    id: "Ms",
    key: "Ms",
  },
];

export const product_type = [
  {
    id: "1",
    key: "Item",
  },
  {
    id: "2",
    key: "Service",
  },
];

export const branches = [
  {
    id: 1,
    key: "Klautara",
  },
  {
    id: 2,
    key: "Colombo",
  },
];

export const apps = [
  {
    icon: 1,
    key: "Klautara",
  },
  {
    id: 2,
    key: "Colombo",
  },
];

export const LogoItems = [
  {
    title: "Pick a Colour Theme",
    des: "",
  },
  {
    title: "Upload Your logo(optional)",
    des: "",
  },
];

export const WhatWeDoItems = [
  {
    icon: Group1,
    title: "Send & Track Invoices",
  },
  {
    icon: Group2,
    title: "Track Receipts & Expenses",
  },
  {
    icon: Group3,
    title: "Track Your VAT",
  },
  {
    icon: Group4,
    title: "Manage Inventory",
  },
  {
    icon: Group5,
    title: "Track Your Bills ",
  },
  {
    icon: Group6,
    title: "Track Sales ",
  },
];

export const subPathLinks = {
  "Manage Customers": "/customers",
  "Customer Credit Log": "/customer-credit-logs",
  "Customer Returns": "/customer-returns",
  "New Customer Return": "/customer-returns/add",
  "Edit Customer Return": "/customer-returns/edit",
  "New Customer": "/customer/add",
  "Edit Customer": "/customer/edit",
  "New Quotation": "/quotation/new",
  "New Invoice": "/invoices/new",
  "Manage Products": "/products",
  "New Product": "/product/add",
  "Edit Product": "/product/edit",
  GRN: "/grn",
  "New GRN": "/grn/add",
  "Edit GRN": "/grn/edit",
  "Damage Note": "/damage-note",
  "New Damage Note": "/damage-note/add",
  "Manage Suppliers": "/suppliers",
  "New Supplier": "/supplier/add",
  "Edit Supplier": "/supplier/edit",
  "Supplier Credit Logs": "/supplier-credit-logs",
  "Purchase Returns": "/purchase-returns",
  "New Purchase Return": "/purchase-returns/add",
  "Edit Purchase Return": "/purchase-returns/edit",
  "New Salesman": "/salesman/add",
  "Edit Salesman": "/salesman/edit",
  "Item Detail Report": "/item-detail-report",
  "Customer Credit Report": "/customer-credit-report",
  "Invoice Detail Report": "/invoice-detail-report",
  "Stock Card": "/stock-card",
  "Profit & Lost Report": "/pl-report",
  "My Account": "/account",
};
