const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const app = express();
const port = 8000;
dotenv.config();
const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/user", require("./routes/authRoutes"));
app.use("/api/customer", require("./routes/customerRoute"));
app.use("/api/expense", require("./routes/expenseRoutes"));
app.use("/api/product", require("./routes/productRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/quotation", require("./routes/quotationRoutes"));
app.use("/api/invoice", require("./routes/invoiceRoutes"));
app.use("/api/branch", require("./routes/branchRoutes"));
app.use("/api/supplier", require("./routes/supplierRoute"));
app.use("/api/quantity-types", require("./routes/quantityTypeRoutes"));
app.use("/api/grn", require("./routes/grnRoutes"));
app.use("/api/purchase-return", require("./routes/purchaseReturnRoutes"));
app.use("/api/customer-return", require("./routes/customerReturnRoutes"));
app.use("/api/service-dates", require("./routes/serviceDateRoutes"));
app.use(
  "/api/customer-credit-log",
  require("./routes/customerCreditLogRoutes")
);
app.use(
  "/api/supplier-credit-log",
  require("./routes/supplierCreditLogRoutes")
);
app.use("/api/stock-card", require("./routes/stockCardRoutes"));
app.use("/api/user-logs", require("./routes/userLogRoutes"));
app.use("/api/damage-note", require("./routes/damageNoteRoutes"));
app.use("/api/pl-report", require("./routes/pLReportRoutes"));
app.use("/api/employee", require("./routes/employeeRoutes"));
app.use("/api/installments", require("./routes/installmentRoutes"));
app.use("/api/rules", require("./routes/ruleRoute"));
app.use("/uploads", express.static("uploads"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
