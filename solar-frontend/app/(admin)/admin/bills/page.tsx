"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Download, Trash2, FileText, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Bill {
    id: string;
    invoiceNo: string;
    customerName: string;
    date: string;
    grandTotal: number;
    items: any[];
    customerAddress: string;
    customerPhone: string;
    customerEmail: string;
    taxAmount: number;
    discount: number;
    subTotal: number;
}

const BillsPage = () => {
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/bills");
            if (res.ok) {
                const data = await res.json();
                setBills(data);
            }
        } catch (error) {
            console.error("Error fetching bills:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteBill = async (id: string) => {
        if (!confirm("Are you sure you want to delete this bill?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/bills/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setBills(bills.filter((b) => b.id !== id));
            } else {
                alert("Failed to delete bill");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const generatePDF = (bill: Bill) => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(41, 128, 185);
        doc.text("A Z Enterprises", 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Mobile: +91 7006031785 +91 6006780785", 14, 26);
        doc.text("Email: azenterprises.solars@gmail.com", 14, 30);
        doc.text("Kupwara, Jammu & Kashmir", 14, 34);

        // Invoice Details
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text("INVOICE", 160, 20);
        doc.setFontSize(10);
        doc.text(`Invoice No: ${bill.invoiceNo}`, 160, 26);
        doc.text(`Date: ${new Date(bill.date).toLocaleDateString()}`, 160, 30);

        // Customer Details
        doc.line(14, 40, 196, 40);
        doc.text("Global To:", 14, 46);
        doc.setFont("helvetica", "bold");
        doc.text(bill.customerName, 14, 52);
        doc.setFont("helvetica", "normal");
        doc.text(bill.customerPhone, 14, 56);
        doc.text(bill.customerAddress, 14, 60);

        const tableBody = bill.items.map((item: any) => [
            item.description,
            item.quantity,
            item.rate.toFixed(2),
            item.amount.toFixed(2)
        ]);

        autoTable(doc, {
            startY: 65,
            head: [['Item Description', 'Qty', 'Rate', 'Amount']],
            body: tableBody,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] },
            styles: { fontSize: 10 },
        });

        // Totals
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.text(`Subtotal:`, 140, finalY);
        doc.text(`${bill.subTotal.toFixed(2)}`, 170, finalY, { align: "right" });

        doc.text(`Discount:`, 140, finalY + 5);
        doc.text(`${bill.discount}`, 170, finalY + 5, { align: "right" });

        doc.text(`Tax (18%):`, 140, finalY + 10);
        doc.text(`${bill.taxAmount.toFixed(2)}`, 170, finalY + 10, { align: "right" });

        doc.setFont("helvetica", "bold");
        doc.text(`Grand Total:`, 140, finalY + 16);
        doc.text(`${bill.grandTotal.toFixed(2)}`, 170, finalY + 16, { align: "right" });

        doc.save(`bill-${bill.invoiceNo}.pdf`);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
                <Link
                    href="/admin/bills/create"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} /> New Bill
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center p-12 text-gray-500">
                    <Loader2 className="animate-spin mr-2" /> Loading invoices...
                </div>
            ) : bills.length === 0 ? (
                <div className="text-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No invoices found</h3>
                    <p className="text-gray-500 mt-1">Get started by creating a new bill.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-700 font-medium">
                            <tr>
                                <th className="p-4">Invoice No</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4 text-right">Amount</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {bills.map((bill) => (
                                <tr key={bill.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-900">{bill.invoiceNo}</td>
                                    <td className="p-4 text-gray-600">
                                        {new Date(bill.date).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        <div>{bill.customerName}</div>
                                        <div className="text-xs text-gray-400">{bill.customerPhone}</div>
                                    </td>
                                    <td className="p-4 text-right font-medium">₹{bill.grandTotal.toFixed(2)}</td>
                                    <td className="p-4 flexjustify-center gap-2">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => generatePDF(bill)}
                                                title="Download PDF"
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                            >
                                                <Download size={18} />
                                            </button>
                                            <button
                                                onClick={() => deleteBill(bill.id)}
                                                title="Delete"
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BillsPage;
