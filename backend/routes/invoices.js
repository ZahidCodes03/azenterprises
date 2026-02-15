const express = require("express");
const router = express.Router();
const pool = require("../config/database");

/* ==========================================
   ✅ GET Items List (Optional)
========================================== */
router.get("/items", (req, res) => {
  res.json([]);
});

/* ==========================================
   ✅ SAVE Invoice
========================================== */
router.post("/", async (req, res) => {
  try {
    const {
      invoiceNo,
      invoiceDate,
      customerName,
      customerAddress,
      customerCity,
      items,
      totalAmount,
    } = req.body;

    if (!invoiceNo || !customerName) {
      return res.status(400).json({
        error: "Invoice Number and Customer Name are required",
      });
    }

    const fullAddress = [customerAddress, customerCity]
      .filter(Boolean)
      .join(", ");

    const total = parseFloat(totalAmount) || 0;

    const result = await pool.query(
      `INSERT INTO invoices (
        invoice_no,
        invoice_date,
        customer_name,
        customer_address,
        items_json,
        total_amount
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        invoiceNo,
        invoiceDate
          ? new Date(invoiceDate.split("/").reverse().join("-"))
          : new Date(),
        customerName,
        fullAddress,
        JSON.stringify(items),
        total,
      ]
    );

    res.status(201).json({
      message: "Invoice Saved Successfully ✅",
      invoice: result.rows[0],
    });
  } catch (error) {
    console.error("Save Invoice Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/* ==========================================
   ✅ GET All Invoices
========================================== */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM invoices ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Fetch Invoice Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/* ==========================================
   ✅ GET Single Invoice by ID
========================================== */
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM invoices WHERE id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Fetch Single Invoice Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/* ==========================================
   ✅ UPDATE Invoice
========================================== */
router.put("/:id", async (req, res) => {
  try {
    const {
      invoiceNo,
      invoiceDate,
      customerName,
      customerAddress,
      customerCity,
      items,
      totalAmount,
    } = req.body;

    const fullAddress = [customerAddress, customerCity]
      .filter(Boolean)
      .join(", ");

    const total = parseFloat(totalAmount) || 0;

    const result = await pool.query(
      `UPDATE invoices SET
        invoice_no = $1,
        invoice_date = $2,
        customer_name = $3,
        customer_address = $4,
        items_json = $5,
        total_amount = $6
      WHERE id = $7
      RETURNING *`,
      [
        invoiceNo,
        invoiceDate
          ? new Date(invoiceDate.split("/").reverse().join("-"))
          : new Date(),
        customerName,
        fullAddress,
        JSON.stringify(items),
        total,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.json({
      message: "Invoice Updated Successfully ✅",
      invoice: result.rows[0],
    });
  } catch (error) {
    console.error("Update Invoice Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/* ==========================================
   ✅ DELETE Invoice
========================================== */
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM invoices WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.json({ message: "Invoice Deleted Successfully ✅" });
  } catch (error) {
    console.error("Delete Invoice Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
