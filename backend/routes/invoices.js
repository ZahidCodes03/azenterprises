const express = require("express");
const router = express.Router();
const pool = require("../config/database");

/* ==========================================
   ✅ GET Items List
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
      amountInWords,
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
        customer_name,
        customer_address,
        invoice_date,
        items_json,
        subtotal,
        cgst_total,
        sgst_total,
        grand_total,
        amount_in_words
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        invoiceNo,
        customerName,
        fullAddress,
        invoiceDate
          ? new Date(invoiceDate.split("/").reverse().join("-"))
          : new Date(),
        JSON.stringify(items),
        total,
        0,
        0,
        total,
        amountInWords || "",
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
    res.status(500).json({ error: error.message });
  }
});

/* ==========================================
   ✅ GET Single Invoice by ID
========================================== */
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM invoices WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
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
      amountInWords,
    } = req.body;

    const fullAddress = [customerAddress, customerCity]
      .filter(Boolean)
      .join(", ");

    const total = parseFloat(totalAmount) || 0;

    const result = await pool.query(
      `UPDATE invoices SET
        invoice_no = $1,
        customer_name = $2,
        customer_address = $3,
        invoice_date = $4,
        items_json = $5,
        subtotal = $6,
        cgst_total = $7,
        sgst_total = $8,
        grand_total = $9,
        amount_in_words = $10
      WHERE id = $11
      RETURNING *`,
      [
        invoiceNo,
        customerName,
        fullAddress,
        invoiceDate
          ? new Date(invoiceDate.split("/").reverse().join("-"))
          : new Date(),
        JSON.stringify(items),
        total,
        0,
        0,
        total,
        amountInWords || "",
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
