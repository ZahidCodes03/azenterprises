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

  /* =====================================
     ✅ Fetch All Invoices
  ====================================== */
  const fetchInvoices = async () => {
    try {
      const res = await getInvoices();
      setInvoices(res.data || []);
    } catch (error) {
      console.error("❌ Error fetching invoices:", error);
      toast.error("Failed to load invoices ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  /* =====================================
     ✅ Helpers
  ====================================== */
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
    return `₹${num.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
    })}`;
  };

  /* =====================================
     ✅ Delete Invoice
  ====================================== */
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
     ✅ Download Invoice PDF
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
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 700px; margin: auto; font-size: 12px;">
        
        <h2 style="text-align:center; margin-bottom: 10px;">
          Invoice: ${inv.invoice_no}
        </h2>

        <p><b>Customer:</b> ${inv.customer_name}</p>
        <p><b>Date:</b> ${formatDate(inv.invoice_date)}</p>

        <table style="width:100%; border-collapse: collapse; margin-top:15px;">
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
                <td style="border:1px solid #ddd; padding:6px;">${
                  it.name || ""
                }</td>
                <td style="border:1px solid #ddd; padding:6px;">${
                  it.qty || ""
                }</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <h2 style="margin-top:20px; color:green;">
          Total: ₹${total.toLocaleString("en-IN")}
        </h2>

        <p style="font-style:italic; color:#444;">
          ${words}
        </p>
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

    toast.success("PDF Downloaded ✅");
  };

  /* =====================================
     ✅ Loading Screen
  ====================================== */
  if (loading) {
    return <h2 className="text-center mt-10">Loading invoices...</h2>;
  }

  /* =====================================
     ✅ UI Render
  ====================================== */
  return (
    <div className="p-6">
      {/* ✅ Header with Create Invoice Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <h1 className="text-2xl font-bold">📄 All Invoices</h1>

        <button
          onClick={() => navigate("/admin/invoices/create")}
          style={{
            padding: "10px 18px",
            background: "#0077ff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          + Create Invoice
        </button>
      </div>

      {/* ✅ Invoice Table */}
      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border text-left">Invoice No</th>
              <th className="p-2 border text-left">Customer</th>
              <th className="p-2 border text-left">Date</th>
              <th className="p-2 border text-right">Total</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="p-2 border font-medium">{inv.invoice_no}</td>
                <td className="p-2 border">{inv.customer_name}</td>
                <td className="p-2 border">{formatDate(inv.invoice_date)}</td>

                {/* ✅ Correct Total */}
                <td className="p-2 border font-bold text-right">
                  {formatCurrency(inv.total_amount)}
                </td>

                {/* ✅ Actions */}
                <td className="p-2 border text-center">
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() =>
                        navigate(`/admin/invoices/edit/${inv.id}`)
                      }
                      style={{
                        padding: "6px 12px",
                        background: "#0077ff",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDownload(inv)}
                      style={{
                        padding: "6px 12px",
                        background: "#0ec843",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Download
                    </button>

                    <button
                      onClick={() => handleDelete(inv.id)}
                      style={{
                        padding: "6px 12px",
                        background: "#e53e3e",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Hidden div for PDF generation */}
      <div
        ref={pdfRef}
        style={{ position: "absolute", left: "-9999px", width: "794px" }}
      />
    </div>
  );
};

export default AdminInvoices;
