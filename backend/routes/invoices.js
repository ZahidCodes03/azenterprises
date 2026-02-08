const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { generateInvoicePDF, numberToWords } = require('../utils/pdfGenerator');
const { authenticateToken } = require('../middleware/auth');

// Invoice items with fixed GST rates
const INVOICE_ITEMS = [
    { name: 'Solar Panels', hsn: '85414011', gst: 5, unit: 'Nos' },
    { name: 'Solar Inverter', hsn: '85044030', gst: 5, unit: 'Nos' },
    { name: 'Structure', hsn: '73089090', gst: 18, unit: 'Set' },
    { name: 'DCDB', hsn: '85371000', gst: 5, unit: 'Nos' },
    { name: 'ACDB', hsn: '85371000', gst: 5, unit: 'Nos' },
    { name: 'Cables', hsn: '85446090', gst: 18, unit: 'Mtr' },
    { name: 'Earthing', hsn: '85471000', gst: 18, unit: 'Set' },
    { name: 'Installation', hsn: '998719', gst: 18, unit: 'Job' },
    { name: 'Lightning Arrester', hsn: '85351000', gst: 18, unit: 'Nos' },
    { name: 'Battery', hsn: '85076000', gst: 18, unit: 'Nos' },
    { name: 'Transport', hsn: '996511', gst: 0, unit: 'Trip' },
    { name: 'Hardware', hsn: '73181500', gst: 18, unit: 'Set' }
];

// GET /api/invoices/items - Get fixed invoice items
router.get('/items', (req, res) => {
    res.json(INVOICE_ITEMS);
});

// POST /api/invoices - Create and save invoice
router.post('/', authenticateToken, async (req, res) => {
    try {
        const {
            invoiceNo,
            invoiceDate,
            customerName,
            customerAddress,
            customerPhone,
            customerGstin,
            items
        } = req.body;

        // Validate required fields
        if (!invoiceNo || !invoiceDate || !customerName || !items || items.length === 0) {
            return res.status(400).json({ error: 'Invoice number, date, customer name, and items are required' });
        }

        // Calculate totals
        let subtotal = 0;
        let cgstTotal = 0;
        let sgstTotal = 0;

        const processedItems = items.filter(item => item.qty && item.qty > 0).map(item => {
            const amount = item.qty * item.rate;
            const gstAmount = amount * (item.gst / 100);
            const cgst = gstAmount / 2;
            const sgst = gstAmount / 2;

            subtotal += amount;
            cgstTotal += cgst;
            sgstTotal += sgst;

            return {
                ...item,
                amount,
                gstAmount,
                cgst,
                sgst,
                totalWithGst: amount + gstAmount
            };
        });

        const grandTotal = subtotal + cgstTotal + sgstTotal;
        const amountInWords = numberToWords(grandTotal);

        // Check for duplicate invoice number
        const existing = await pool.query('SELECT id FROM invoices WHERE invoice_no = $1', [invoiceNo]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Invoice number already exists' });
        }

        // Save to database
        const result = await pool.query(
            `INSERT INTO invoices (invoice_no, customer_name, customer_address, customer_phone, customer_gstin, invoice_date, items_json, subtotal, cgst_total, sgst_total, grand_total, amount_in_words)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
            [invoiceNo, customerName, customerAddress, customerPhone, customerGstin, invoiceDate, JSON.stringify(processedItems), subtotal, cgstTotal, sgstTotal, grandTotal, amountInWords]
        );

        res.status(201).json({
            message: 'Invoice created successfully',
            invoice: result.rows[0]
        });
    } catch (error) {
        console.error('Create invoice error:', error);
        res.status(500).json({ error: 'Failed to create invoice' });
    }
});

// GET /api/invoices - Get all invoices
router.get('/', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM invoices ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Get invoices error:', error);
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
});

// GET /api/invoices/:id - Get single invoice
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM invoices WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get invoice error:', error);
        res.status(500).json({ error: 'Failed to fetch invoice' });
    }
});

// GET /api/invoices/:id/pdf - Generate PDF for invoice
router.get('/:id/pdf', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM invoices WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        const invoice = result.rows[0];
        const invoiceData = {
            invoice_no: invoice.invoice_no,
            invoice_date: invoice.invoice_date,
            customer_name: invoice.customer_name,
            customer_address: invoice.customer_address,
            customer_phone: invoice.customer_phone,
            customer_gstin: invoice.customer_gstin,
            items: typeof invoice.items_json === 'string' ? JSON.parse(invoice.items_json) : invoice.items_json,
            subtotal: parseFloat(invoice.subtotal),
            cgst_total: parseFloat(invoice.cgst_total),
            sgst_total: parseFloat(invoice.sgst_total),
            grand_total: parseFloat(invoice.grand_total)
        };

        const pdfBuffer = await generateInvoicePDF(invoiceData);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Invoice-${invoice.invoice_no}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Generate PDF error:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

// POST /api/invoices/generate-pdf - Generate PDF without saving (preview)
router.post('/generate-pdf', authenticateToken, async (req, res) => {
    try {
        const { invoiceNo, invoiceDate, customerName, customerAddress, customerPhone, customerGstin, items } = req.body;

        // Calculate totals
        let subtotal = 0;
        let cgstTotal = 0;
        let sgstTotal = 0;

        const processedItems = items.filter(item => item.qty && item.qty > 0).map(item => {
            const amount = item.qty * item.rate;
            const gstAmount = amount * (item.gst / 100);
            subtotal += amount;
            cgstTotal += gstAmount / 2;
            sgstTotal += gstAmount / 2;
            return { ...item, amount };
        });

        const grandTotal = subtotal + cgstTotal + sgstTotal;

        const invoiceData = {
            invoice_no: invoiceNo,
            invoice_date: invoiceDate,
            customer_name: customerName,
            customer_address: customerAddress,
            customer_phone: customerPhone,
            customer_gstin: customerGstin,
            items: processedItems,
            subtotal,
            cgst_total: cgstTotal,
            sgst_total: sgstTotal,
            grand_total: grandTotal
        };

        const pdfBuffer = await generateInvoicePDF(invoiceData);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Invoice-${invoiceNo}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Generate PDF error:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

// GET /api/invoices/next-number - Get next invoice number
router.get('/next/number', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT invoice_no FROM invoices ORDER BY created_at DESC LIMIT 1"
        );

        let nextNumber = 'AZ-001';
        if (result.rows.length > 0) {
            const lastNo = result.rows[0].invoice_no;
            const match = lastNo.match(/AZ-(\d+)/);
            if (match) {
                const num = parseInt(match[1]) + 1;
                nextNumber = `AZ-${num.toString().padStart(3, '0')}`;
            }
        }

        res.json({ nextInvoiceNo: nextNumber });
    } catch (error) {
        console.error('Get next number error:', error);
        res.status(500).json({ error: 'Failed to get next invoice number' });
    }
});

module.exports = router;
