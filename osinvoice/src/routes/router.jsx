import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { MainLayout } from "../components/layouts/MainLayout";
import { Invoices } from "../pages/invoices/Invoices";
import { AddInvoice } from "../pages/invoices/AddInvoice";
import { Account } from "../pages/account/Account";
import { Login } from "../pages/Login";
import { SignUp } from "../pages/SignUp";
import { Notifications } from "../pages/notifications/Notifications";
import { Reports } from "../pages/reports/Reports";
import { Report } from "../pages/reports/Report";
import { GuestLayout } from "../components/layouts/GuestLayout";
import { GRN } from "../pages/grn/GRN";
import { AddGRN } from "../pages/grn/AddGRN";
import { Products } from "../pages/products/Products";
import { AddProduct } from "../pages/products/AddProduct";
import { EditGrn } from "../pages/grn/EditGrn";
import { ItemDetailReport } from "../pages/reports/ItemDetailReport";
import { InvoiceDetailReport } from "../pages/reports/InvoiceDetailReport";
import { PLReport } from "../pages/pl-report/PLReport";
import Salesman from "../pages/salesmen/Salesman";
import { Welcome } from "../pages/logineprocesspart/welcome/Welcome";
import { Business } from "../pages/logineprocesspart/business/Business";
import { WhatToDo } from "../pages/logineprocesspart/whattodo/WhatToDo";
import { ColorLogo } from "../pages/logineprocesspart/colorlogo/ColorLogo";
import { Preview } from "../pages/logineprocesspart/preview/Preview";
import { GetStarted } from "../pages/logineprocesspart/getstarted/GetStarted";
import { EditProduct } from "../pages/products/EditProduct";
import { AddSalesman } from "../pages/salesmen/AddSalesman";
import { EditSalesman } from "../pages/salesmen/EditSalesman";
import { Settings } from "../pages/setting/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/invoices",
        element: <Invoices />,
      },
      {
        path: "/invoices/new",
        element: <AddInvoice />,
      },
      {
        path: "/account",
        element: <Account />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
      {
        path: "/report",
        element: <Report />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/product/add",
        element: <AddProduct />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/product/edit/:id",
        element: <EditProduct />,
      },
      {
        path: "/grn/",
        element: <GRN />,
      },
      {
        path: "/grn/add",
        element: <AddGRN />,
      },
      {
        path: "/grn/edit/:id",
        element: <EditGrn />,
      },
      {
        path: "/reports/item-detail-report",
        element: <ItemDetailReport />,
      },
      {
        path: "/reports/invoice-detail-report",
        element: <InvoiceDetailReport />,
      },
      {
        path: "/pl-report",
        element: <PLReport />,
      },
      {
        path: "/salesman",
        element: <Salesman />,
      },
      {
        path: "/salesman/add",
        element: <AddSalesman />,
      },
      {
        path: "/salesman/edit/:id",
        element: <EditSalesman />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },
  {
    path: "/welcome",
    element: <Welcome />,
  },
  {
    path: "/business",
    element: <Business />,
  },
  {
    path: "/what-to-do",
    element: <WhatToDo />,
  },
  {
    path: "/colorlogo",
    element: <ColorLogo />,
  },
  {
    path: "/preview",
    element: <Preview />,
  },
  {
    path: "/getstarted",
    element: <GetStarted />,
  },
]);

export default router;
