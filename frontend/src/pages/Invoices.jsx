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
  ]);

  /* =====================================
     ✅ Amount in Words (Always Numeric)
  ====================================== */
  const amountInWords = numberToWords(Number(totalAmount) || 0);

  /* =====================================
     ✅ Load Invoice Data for Edit
  ====================================== */
  useEffect(() => {
    if (isEditMode) {
      const loadInvoice = async () => {
        setLoading(true);

        try {
          const res = await getInvoice(editId);
          const inv = res.data;

          console.log("Loaded Invoice:", inv);

          // ✅ Correct DB Mapping
          setInvoiceNo(inv.invoice_no || "");

          setInvoiceDate(
            inv.invoice_date
              ? new Date(inv.invoice_date).toLocaleDateString("en-GB")
              : ""
          );

          setCustomerName(inv.customer_name || "");

          // ✅ FIXED: Correct Total Column
          setTotalAmount(String(parseFloat(inv.total_amount) || 0));

          // ✅ Address split
          const addr = inv.customer_address || "";
          const lastComma = addr.lastIndexOf(",");

          if (lastComma > -1) {
            setCustomerAddress(addr.substring(0, lastComma).trim());
            setCustomerCity(addr.substring(lastComma + 1).trim());
          } else {
            setCustomerAddress(addr);
            setCustomerCity("");
          }

          // ✅ Items Parse
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
      // ✅ New Invoice Mode
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

    const noprint = document.querySelectorAll(".no-print");
    noprint.forEach((el) => (el.style.display = "none"));

    element.classList.add("pdf-mode");

    html2pdf()
      .set({
        filename: `${invoiceNo || "Invoice"}.pdf`,
        margin: 10,
        html2canvas: { scale: 2, scrollY: 0 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
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
      totalAmount: totalAmount.trim(), // ✅ clean
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
     ✅ Loading Screen
  ====================================== */
  if (loading) {
    return (
      <div className="invoice-container">
        <h2 style={{ textAlign: "center", padding: "40px" }}>
          Loading invoice...
        </h2>
      </div>
    );
  }

  /* =====================================
     ✅ UI Render
  ====================================== */
  return (
    <div className="invoice-container">
      <div id="invoice-print">
        {/* HEADER */}
        <div className="header">
          <div>
            <h1>A Z ENTERPRISES</h1>
            <p>
              <b>Address:</b> Kupwara Jammu & Kashmir
            </p>
            <p>
              <b>Email:</b> azenterprises.solars@gmail.com
            </p>
          </div>

          <div className="quote-box">
            <p>
              <b>Quote#:</b>{" "}
              <span className="invoice-no-display">{invoiceNo}</span>
            </p>
            <p>
              <b>Date:</b> {invoiceDate}
            </p>
          </div>
        </div>

        {/* BILL TO */}
        <div className="billto">
          <h3>Bill To:</h3>

          <div
            className="editable-field"
            contentEditable
            suppressContentEditableWarning={true}
            onBlur={(e) => setCustomerName(e.target.innerText.trim())}
          >
            {customerName}
          </div>

          <div
            className="editable-field"
            contentEditable
            suppressContentEditableWarning={true}
            onBlur={(e) => setCustomerAddress(e.target.innerText.trim())}
          >
            {customerAddress}
          </div>

          <div
            className="editable-field"
            contentEditable
            suppressContentEditableWarning={true}
            onBlur={(e) => setCustomerCity(e.target.innerText.trim())}
          >
            {customerCity}
          </div>
        </div>

        {/* ITEMS */}
        <table className="items-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Qty</th>
              <th className="no-print">×</th>
            </tr>
          </thead>

          <tbody>
            {items.map((it, index) => (
              <tr key={index}>
                <td>{index + 1}</td>

                <td
                  contentEditable
                  suppressContentEditableWarning={true}
                  onBlur={(e) =>
                    handleItemChange(index, "name", e.target.innerText.trim())
                  }
                >
                  {it.name}
                </td>

                <td
                  contentEditable
                  suppressContentEditableWarning={true}
                  onBlur={(e) =>
                    handleItemChange(index, "qty", e.target.innerText.trim())
                  }
                >
                  {it.qty}
                </td>

                <td className="no-print">
                  <button onClick={() => removeItem(index)}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="no-print">
          <button onClick={addItem}>+ Add Item</button>
        </div>

        {/* TOTAL */}
        <div className="total">
          <h2>
            Total ₹{" "}
            <span
              contentEditable
              suppressContentEditableWarning={true}
              onBlur={(e) => setTotalAmount(e.target.innerText.trim())}
            >
              {totalAmount}
            </span>
          </h2>

          <p>{amountInWords}</p>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="btn-group no-print">
        <button onClick={saveInvoice}>
          {isEditMode ? "Update Invoice" : "Save Invoice"}
        </button>
        <button onClick={downloadPDF}>Download PDF</button>
      </div>
    </div>
  );
};

export default Invoices;
