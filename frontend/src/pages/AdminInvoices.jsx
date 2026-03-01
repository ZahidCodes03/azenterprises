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
                <td style="border:1px solid #ddd; padding:6px;">${it.name || ""}</td>
                <td style="border:1px solid #ddd; padding:6px;">${it.qty || ""}</td>
              </tr>
            `
        )
        .join("")}
          </tbody>
        </table>
        <h2 style="margin-top:20px; color:green;">
          Total: ₹${total.toLocaleString("en-IN")}
        </h2>
        <p style="font-style:italic; color:#444;">${words}</p>
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
    <div className="p-4 sm:p-6">
      {/* ✅ Header with Create Invoice Button */}
      <div
        className="flex justify-between items-center flex-wrap gap-3 mb-5"
      >
        <h1 className="text-xl sm:text-2xl font-bold">📄 All Invoices</h1>

        <button
          onClick={() => navigate("/admin/invoices/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm sm:text-base"
        >
          + Create Invoice
        </button>
      </div>

      {/* ✅ Invoice Table Responsive Container */}
      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <div className="w-full overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full min-w-[600px] border-collapse bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left text-xs sm:text-sm font-semibold text-gray-700">Invoice No</th>
                <th className="p-3 border text-left text-xs sm:text-sm font-semibold text-gray-700">Customer</th>
                <th className="p-3 border text-left text-xs sm:text-sm font-semibold text-gray-700">Date</th>
                <th className="p-3 border text-right text-xs sm:text-sm font-semibold text-gray-700">Total</th>
                <th className="p-3 border text-center text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 border text-xs sm:text-sm font-medium">{inv.invoice_no}</td>
                  <td className="p-3 border text-xs sm:text-sm">{inv.customer_name}</td>
                  <td className="p-3 border text-xs sm:text-sm">{formatDate(inv.invoice_date)}</td>
                  <td className="p-3 border text-xs sm:text-sm font-bold text-right text-green-600">
                    {formatCurrency(inv.total_amount)}
                  </td>
                  <td className="p-3 border text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => navigate(`/admin/invoices/edit/${inv.id}`)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
