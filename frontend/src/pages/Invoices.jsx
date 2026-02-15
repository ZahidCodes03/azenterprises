import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./invoice.css";
import toast from "react-hot-toast";
import html2pdf from "html2pdf.js";
import { numberToWords } from "../utils/numberToWords";
import { createInvoice, getInvoice, updateInvoice } from "../services/api";

const Invoices = () => {
  const { id: editId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(editId);

  /* =====================================
     ✅ Quote Number Auto Generator
  ====================================== */
  const generateQuoteNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    const key = `quoteSerial-${year}-${month}`;
    let lastSerial = localStorage.getItem(key);
    if (!lastSerial) lastSerial = 0;

    const newSerial = parseInt(lastSerial) + 1;
    localStorage.setItem(key, newSerial);

    const serial = String(newSerial).padStart(2, "0");
    return `AZES${year}${month}${serial}`;
  };

  /* =====================================
     ✅ States
  ====================================== */
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [totalAmount, setTotalAmount] = useState("0");
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState([
    { name: "SOLAR PANEL BIFACIAL 500 WATT (DCR)", qty: "6 pcs" },
    { name: "SOLAR ON-GRID INVERTER 5 KW", qty: "1 pcs" },
    { name: "ACDB SINGLE PHASE WITH MCB & SPD", qty: "1 pcs" },
    { name: "DCDB 1 IN 1 OUT 600V SPD", qty: "1 pcs" },
    { name: "NYLON TIE CLIP", qty: "1 pcs" },
    { name: "PLUG IN MC4 CONNECTOR (LAPP)", qty: "2 pcs" },
    { name: "LIGHTNING ARRESTOR 1 METER", qty: "1 pcs" },
    { name: "EARTHING CHEMICAL BAG (25KG)", qty: "2 pcs" },
    { name: "THIMBLE 16MM COPPER (RING TYPE)", qty: "6 pcs" },
    { name: "EARTHING ROD COPPER BONDED 2 METER", qty: "3 pcs" },
    { name: "TAPE ROLL", qty: "2 pcs" },
    { name: "ALUMINIUM SHORT RAIL 65MM WITH ACCESSORIES", qty: "16 pcs" },
    { name: "DC WIRE 4 SQ MM", qty: "30 MTR" },
    { name: "EARTHING WIRE 4MM", qty: "90 meter" },
    { name: "AC WIRE 2 CORE 6MM Aluminium", qty: "30 meter" },
    { name: "EARTHING PIT COVER", qty: "3 pcs" },
    { name: "UV FLEXIBLE CONDUIT (16MM)", qty: "50 m" },
    { name: "PVC SADDLE 20MM", qty: "100 pcs" },
  ]);

  /* =====================================
     ✅ Dynamic Amount in Words
  ====================================== */
  const amountInWords = numberToWords(totalAmount);

  /* =====================================
     ✅ Load Invoice Data
  ====================================== */
  useEffect(() => {
    if (isEditMode) {
      const loadInvoice = async () => {
        setLoading(true);
        try {
          const res = await getInvoice(editId);
          const inv = res.data;

          setInvoiceNo(inv.invoice_no || "");
          setInvoiceDate(
            inv.invoice_date
              ? new Date(inv.invoice_date).toLocaleDateString("en-GB")
              : ""
          );
          setCustomerName(inv.customer_name || "");
          setTotalAmount(String(parseFloat(inv.grand_total) || 0));

          // Split address back into address + city
          const addr = inv.customer_address || "";
          const lastComma = addr.lastIndexOf(",");
          if (lastComma > -1) {
            setCustomerAddress(addr.substring(0, lastComma).trim());
            setCustomerCity(addr.substring(lastComma + 1).trim());
          } else {
            setCustomerAddress(addr);
            setCustomerCity("");
          }

          // Parse items
          let parsedItems = [];
          try {
            parsedItems =
              typeof inv.items_json === "string"
                ? JSON.parse(inv.items_json)
                : inv.items_json || [];
          } catch {
            parsedItems = [];
          }

          setItems(
            parsedItems.map((it) => ({
              name: it.name || "",
              qty: it.qty || "",
            }))
          );
        } catch (error) {
          console.error("Failed to load invoice:", error);
          toast.error("Failed to load invoice ❌");
        } finally {
          setLoading(false);
        }
      };
      loadInvoice();
    } else {
      const now = new Date();
      setInvoiceDate(now.toLocaleDateString("en-GB"));
      setInvoiceNo(generateQuoteNumber());
    }
  }, [editId]);

  /* =====================================
     ✅ Item Change Handler
  ====================================== */
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  /* =====================================
     ✅ Add / Remove Item Row
  ====================================== */
  const addItem = () => {
    setItems([...items, { name: "", qty: "" }]);
  };

  const removeItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  /* =====================================
     ✅ Download PDF
  ====================================== */
  const downloadPDF = () => {
    const element = document.getElementById("invoice-print");

    // Hide no-print elements
    const noprint = document.querySelectorAll(".no-print");
    noprint.forEach((el) => (el.style.display = "none"));

    // Add PDF mode class
    element.classList.add("pdf-mode");

    html2pdf()
      .set({
        filename: `${invoiceNo || "Invoice"}.pdf`,
        margin: [10, 10, 10, 10],
        html2canvas: {
          scale: 2,
          scrollY: 0,
          useCORS: true,
          windowWidth: 794, // A4 width in px at 96dpi
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
          avoid: [".billto", ".bank", ".signature", ".total", "tr"],
        },
      })
      .from(element)
      .save()
      .then(() => {
        noprint.forEach((el) => (el.style.display = ""));
        element.classList.remove("pdf-mode");
      });

    toast.success("PDF Downloaded Successfully!");
  };

  /* =====================================
     ✅ Save / Update Invoice
  ====================================== */
  const saveInvoice = async () => {
    if (!invoiceNo || !customerName) {
      toast.error("Invoice Number and Customer Name are required");
      return;
    }

    const payload = {
      invoiceNo,
      invoiceDate,
      customerName,
      customerAddress,
      customerCity,
      items,
      totalAmount,
      amountInWords,
    };

    try {
      if (isEditMode) {
        await updateInvoice(editId, payload);
        toast.success("Invoice Updated Successfully ✅");
      } else {
        await createInvoice(payload);
        toast.success("Invoice Saved in Database ✅");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to Save Invoice ❌");
    }
  };

  /* =====================================
     ✅ UI Render
  ====================================== */
  if (loading) {
    return (
      <div className="invoice-container">
        <h2 style={{ textAlign: "center", padding: "40px" }}>Loading invoice...</h2>
      </div>
    );
  }

  return (
    <div className="invoice-container">
      {/* ✅ Printable Area */}
      <div id="invoice-print">
        {/* HEADER */}
        <div className="header">
          <div>
            <h1>A Z ENTERPRISES</h1>
            <p><b>Address:</b> Kupwara Jammu &amp; Kashmir</p>
            <p><b>Email:</b> azenterprises.solars@gmail.com</p>
            <p><b>GSTIN:</b> 01ACMFA6519J1ZF</p>
          </div>

          <div className="quote-box">
            <p><b>Quote#:</b> <span className="invoice-no-display">{invoiceNo}</span></p>
            <p><b>Date:</b> {invoiceDate}</p>
          </div>
        </div>

        {/* BILL TO */}
        <div className="billto">
          <h3>Bill To:</h3>
          <div
            className="editable-field"
            contentEditable
            suppressContentEditableWarning={true}
            onBlur={(e) => setCustomerName(e.target.innerText)}
            placeholder="Customer Name"
          >
            {customerName}
          </div>
          <div
            className="editable-field"
            contentEditable
            suppressContentEditableWarning={true}
            onBlur={(e) => setCustomerAddress(e.target.innerText)}
            placeholder="Customer Address"
          >
            {customerAddress}
          </div>
          <div
            className="editable-field"
            contentEditable
            suppressContentEditableWarning={true}
            onBlur={(e) => setCustomerCity(e.target.innerText)}
            placeholder="City, State, Pin"
          >
            {customerCity}
          </div>
        </div>

        {/* ITEMS TABLE */}
        <table className="items-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item &amp; Description</th>
              <th className="qty-col">Qty</th>
              <th className="action-col no-print">×</th>
            </tr>
          </thead>

          <tbody>
            {items.map((it, index) => (
              <tr key={index}>
                <td style={{ textAlign: "center" }}>{index + 1}</td>

                <td
                  contentEditable
                  suppressContentEditableWarning={true}
                  onBlur={(e) =>
                    handleItemChange(index, "name", e.target.innerText)
                  }
                  className="desc-col"
                >
                  {it.name}
                </td>

                <td
                  contentEditable
                  suppressContentEditableWarning={true}
                  onBlur={(e) =>
                    handleItemChange(index, "qty", e.target.innerText)
                  }
                  className="qty-col"
                >
                  {it.qty}
                </td>

                <td className="no-print" style={{ textAlign: "center" }}>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(index)}
                    title="Remove item"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Item Button */}
        <div className="add-item-row no-print">
          <button onClick={addItem}>+ Add Item</button>
        </div>

        {/* TOTAL */}
        <div className="total">
          <h2>
            Total ₹{" "}
            <span
              className="total-editable"
              contentEditable
              suppressContentEditableWarning={true}
              onBlur={(e) => setTotalAmount(e.target.innerText)}
            >
              {totalAmount}
            </span>
          </h2>
          {totalAmount && parseFloat(totalAmount) > 0 && (
            <p className="amount-words">{amountInWords}</p>
          )}
        </div>

        {/* BANK */}
        <div className="bank">
          <h3>BANK DETAIL</h3>
          <p><b>Bank Name:</b> Jammu &amp; Kashmir Bank</p>
          <p><b>Account Number:</b> 0012010100003649</p>
          <p><b>IFSC Code:</b> JAKA0FOREST</p>
          <p><b>Address:</b> Kupwara Main</p>
        </div>

        {/* SIGNATURE */}
        <div className="signature">
          <p><b>A Z Enterprises</b></p>
          <p>Authorized Signature</p>
        </div>
      </div>

      {/* ✅ Buttons Outside Printable Area */}
      <div className="btn-group no-print">
        <button onClick={saveInvoice}>
          {isEditMode ? "Update Invoice" : "Save Invoice"}
        </button>
        <button onClick={downloadPDF}>Download PDF</button>
        {isEditMode && (
          <button
            onClick={() => navigate("/admin/invoices")}
            style={{ background: "#666" }}
          >
            Back to Invoices
          </button>
        )}
      </div>
    </div>
  );
};

export default Invoices;
