const dbService = require("../services/pLReportDBService");

const getPLReport = async (req, res) => {
  try {
    const { from, to, Branch_idBranch } = req.params;

    const summary = {};

    const invoiceTotal = await dbService.fetchInvoiceTotal(
      from,
      to,
      Branch_idBranch
    );
    const invoiceCost = await dbService.fetchInvoiceCost(
      from,
      to,
      Branch_idBranch
    );
    const expensesTotal = await dbService.fetchExpensesTotal(
      from,
      to,
      Branch_idBranch
    );
    const damageTotal = await dbService.fetchDamageTotal(
      from,
      to,
      Branch_idBranch
    );

    summary.invoiceTotal = invoiceTotal[0].Total;
    summary.invoiceCost = invoiceCost[0].Cost;
    summary.expensesTotal = expensesTotal[0].Total;
    summary.damageTotal = damageTotal[0].Total;

    const invoices = await dbService.fetchInvoices(from, to, Branch_idBranch);
    await Promise.all(
      invoices.map(async (invoice) => {
        const items = await dbService.fetchInvoiceItems(invoice.idInvoice);
        invoice.items = items;
      })
    );

    const damages = await dbService.fetchDamages(from, to, Branch_idBranch);
    await Promise.all(
      damages.map(async (damage) => {
        const items = await dbService.fetchDamageItems(damage.idDamage_Note);
        damage.items = items;
      })
    );

    const expenses = await dbService.fetchExpenses(from, to, Branch_idBranch);

    res.json({
      summary: summary,
      invoices: invoices,
      damages: damages,
      expenses: expenses,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating expense", error: err.message });
  }
};

module.exports = {
  getPLReport,
};
