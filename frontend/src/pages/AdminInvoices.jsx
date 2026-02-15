import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import html2pdf from "html2pdf.js";
import { getInvoices, deleteInvoice } from "../services/api";
import { numberToWords } from "../utils/numberToWords";

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const pdfRef = useRef(null);

  const fetchInvoices = async () => {
    try {
      const res = await getInvoices();
      setInvoices(res.data || []);
    } catch (error) {
      console.error("❌ Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return "₹0.00";
    return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await deleteInvoice(id);
      toast.success("Invoice Deleted ✅");
      fetchInvoices();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete invoice ❌");
    }
  };

  /* =====================================
     ✅ Download Single Invoice PDF
  ====================================== */
  const handleDownload = (inv) => {
    let items = [];
    try {
      items =
        typeof inv.items_json === "string"
          ? JSON.parse(inv.items_json)
          : inv.items_json || [];
    } catch {
      items = [];
    }

    // ✅ FIXED TOTAL COLUMN
    const total = parseFloat(inv.total_amount) || 0;

    const words = numberToWords(total);

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 15px; max-width: 700px; margin: auto; font-size: 12px;">
        <h2 style="text-align:center;">Invoice: ${inv.invoice_no}</h2>

        <p><b>Customer:</b> ${inv.customer_name}</p>
        <p><b>Date:</b> ${formatDate(inv.invoice_date)}</p>

        <table style="width:100%; border-collapse: collapse; margin-top:10px;">
          <thead>
            <tr>
              <th style="border:1px solid #ddd; padding:6px;">#</th>
              <th style="border:1px solid #ddd; padding:6px;">Item</th>
              <th style="border:1px solid #ddd; padding:6px;">Qty</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (it, i) => `
              <tr>
                <td style="border:1px solid #ddd; padding:6px;">${i + 1}</td>
                <td style="border:1px solid #ddd; padding:6px;">${it.name}</td>
                <td style="border:1px solid #ddd; padding:6px;">${it.qty}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <h2 style="margin-top:15px; color:green;">
          Total: ₹${total.toLocaleString("en-IN")}
        </h2>
        <p style="font-style:italic;">${words}</p>
      </div>
    `;

    const container = pdfRef.current;
    container.innerHTML = html;

    html2pdf()
      .set({
        filename: `${inv.invoice_no}.pdf`,
        margin: 10,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(container)
      .save()
      .then(() => {
        container.innerHTML = "";
      });

    toast.success("PDF Downloaded!");
  };

  if (loading) {
    return <h2 className="text-center mt-10">Loading invoices...</h2>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📄 All Invoices</h1>

      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="p-2 border">Invoice No</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="p-2 border">{inv.invoice_no}</td>
                <td className="p-2 border">{inv.customer_name}</td>
                <td className="p-2 border">{formatDate(inv.invoice_date)}</td>

                {/* ✅ FIXED */}
                <td className="p-2 border font-bold text-right">
                  {formatCurrency(inv.total_amount)}
                </td>

                <td className="p-2 border text-center">
                  <button
                    onClick={() => navigate(`/admin/invoices/edit/${inv.id}`)}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDownload(inv)}>Download</button>
                  <button onClick={() => handleDelete(inv.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div
        ref={pdfRef}
        style={{ position: "absolute", left: "-9999px", width: "794px" }}
      />
    </div>
  );
};

export default AdminInvoices;
