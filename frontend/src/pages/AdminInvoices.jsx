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

        const total = parseFloat(inv.grand_total) || 0;
        const words = inv.amount_in_words || numberToWords(total);

        const html = `
      <div style="font-family: Arial, sans-serif; padding: 15px; max-width: 700px; margin: auto; font-size: 12px;">
        <div style="display: flex; justify-content: space-between; border-bottom: 3px solid #0077ff; padding-bottom: 12px;">
          <div>
            <h1 style="color: #0077ff; margin: 0 0 4px 0; font-size: 22px;">A Z ENTERPRISES</h1>
            <p style="margin: 2px 0; font-size: 11px;"><b>Address:</b> Kupwara Jammu & Kashmir</p>
            <p style="margin: 2px 0; font-size: 11px;"><b>Email:</b> azenterprises.solars@gmail.com</p>
            <p style="margin: 2px 0; font-size: 11px;"><b>GSTIN:</b> 01ACMFA6519J1ZF</p>
          </div>
          <div style="background: #0ec843; color: white; padding: 10px 14px; border-radius: 10px; text-align: right;">
            <p style="margin: 2px 0; font-size: 12px;"><b>Quote#:</b> ${inv.invoice_no}</p>
            <p style="margin: 2px 0; font-size: 12px;"><b>Date:</b> ${formatDate(inv.invoice_date)}</p>
          </div>
        </div>

        <div style="margin-top: 12px; padding: 10px; background: #f8fbff; border-left: 4px solid #0077ff; border-radius: 8px;">
          <h3 style="margin: 0 0 6px 0; font-size: 13px;">Bill To:</h3>
          <p style="margin: 3px 0; font-size: 12px;">${inv.customer_name || ""}</p>
          <p style="margin: 3px 0; font-size: 12px;">${inv.customer_address || ""}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; table-layout: fixed;">
          <thead>
            <tr>
              <th style="background: #0077ff; color: white; padding: 7px; font-size: 11px; width: 7%; text-align: center;">#</th>
              <th style="background: #0077ff; color: white; padding: 7px; font-size: 11px; text-align: left;">Item & Description</th>
              <th style="background: #0077ff; color: white; padding: 7px; font-size: 11px; width: 15%; text-align: center;">Qty</th>
            </tr>
          </thead>
          <tbody>
            ${items
                .map(
                    (it, i) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 5px; text-align: center; font-size: 11px;">${i + 1}</td>
                <td style="border: 1px solid #ddd; padding: 5px; font-size: 11px; word-wrap: break-word; overflow-wrap: break-word;">${it.name || ""}</td>
                <td style="border: 1px solid #ddd; padding: 5px; text-align: center; font-size: 11px;">${it.qty || ""}</td>
              </tr>`
                )
                .join("")}
          </tbody>
        </table>

        <div style="margin-top: 12px; background: #eaffea; border-left: 4px solid green; padding: 10px; border-radius: 8px; color: green;">
          <h2 style="margin: 0; font-size: 16px;">Total: ₹${total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</h2>
          <p style="margin: 4px 0 0 0; font-size: 11px; font-style: italic; color: #333;">${words}</p>
        </div>

        <div style="margin-top: 12px; padding: 12px; background: #f4f0ff; border-left: 5px solid purple; border-radius: 10px;">
          <h3 style="margin: 0 0 6px 0; color: #6803a7; font-size: 13px;">BANK DETAIL</h3>
          <p style="margin: 3px 0; font-size: 11px;"><b style="color: rgb(47,0,255);">Bank Name:</b> <span style="color: green;">Jammu & Kashmir Bank</span></p>
          <p style="margin: 3px 0; font-size: 11px;"><b style="color: rgb(47,0,255);">Account Number:</b> <span style="color: green;">0012010100003649</span></p>
          <p style="margin: 3px 0; font-size: 11px;"><b style="color: rgb(47,0,255);">IFSC Code:</b> <span style="color: green;">JAKA0FOREST</span></p>
          <p style="margin: 3px 0; font-size: 11px;"><b style="color: rgb(47,0,255);">Address:</b> <span style="color: green;">Kupwara Main</span></p>
        </div>

        <div style="margin-top: 30px; text-align: right; font-size: 12px;">
          <p><b>A Z Enterprises</b></p>
          <p>Authorized Signature</p>
        </div>
      </div>
    `;

        const container = pdfRef.current;
        container.innerHTML = html;

        html2pdf()
            .set({
                filename: `${inv.invoice_no}.pdf`,
                margin: [10, 10, 10, 10],
                html2canvas: {
                    scale: 2,
                    scrollY: 0,
                    useCORS: true,
                    windowWidth: 794,
                },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                pagebreak: {
                    mode: ["avoid-all", "css", "legacy"],
                },
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
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                }}
            >
                <h1 className="text-2xl font-bold">📄 All Invoices</h1>
                <button
                    onClick={() => navigate("/admin/invoices/create")}
                    style={{
                        padding: "10px 20px",
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

            {invoices.length === 0 ? (
                <p className="text-gray-500">No invoices found. Create your first invoice!</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border text-left">Invoice No</th>
                                <th className="p-2 border text-left">Customer</th>
                                <th className="p-2 border text-left">Date</th>
                                <th className="p-2 border text-right">Total Amount</th>
                                <th className="p-2 border text-center">Items</th>
                                <th className="p-2 border text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {invoices.map((inv) => {
                                let items = [];
                                try {
                                    items =
                                        typeof inv.items_json === "string"
                                            ? JSON.parse(inv.items_json)
                                            : inv.items_json || [];
                                } catch {
                                    items = [];
                                }

                                return (
                                    <tr key={inv.id} className="hover:bg-gray-50">
                                        <td className="p-2 border font-medium">{inv.invoice_no}</td>
                                        <td className="p-2 border">{inv.customer_name}</td>
                                        <td className="p-2 border">{formatDate(inv.invoice_date)}</td>
                                        <td className="p-2 border text-right font-semibold">
                                            {formatCurrency(inv.grand_total)}
                                        </td>
                                        <td className="p-2 border text-center">{items.length}</td>
                                        <td className="p-2 border text-center">
                                            <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
                                                <button
                                                    onClick={() => navigate(`/admin/invoices/edit/${inv.id}`)}
                                                    style={{
                                                        padding: "5px 12px",
                                                        background: "#0077ff",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "5px",
                                                        cursor: "pointer",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(inv)}
                                                    style={{
                                                        padding: "5px 12px",
                                                        background: "#0ec843",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "5px",
                                                        cursor: "pointer",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    Download
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(inv.id)}
                                                    style={{
                                                        padding: "5px 12px",
                                                        background: "#e53e3e",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "5px",
                                                        cursor: "pointer",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Hidden div for PDF generation */}
            <div
                ref={pdfRef}
                style={{ position: "absolute", left: "-9999px", top: 0, width: "794px" }}
            />
        </div>
    );
};

export default AdminInvoices;
