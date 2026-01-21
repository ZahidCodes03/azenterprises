"use client";

import React, { useState } from "react";
import { Plus, Trash2, Save, Download, Calculator } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface BillItem {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

const BillForm = () => {
    const [loading, setLoading] = useState(false);
    const [invoiceData, setInvoiceData] = useState({
        customerName: "",
        customerAddress: "",
        customerPhone: "",
        customerEmail: "",
        date: new Date().toISOString().split("T")[0],
        discount: 0,
    });

    const [items, setItems] = useState<BillItem[]>([
        { description: "", quantity: 1, rate: 0, amount: 0 },
    ]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInvoiceData({ ...invoiceData, [name]: value });
    };

    const handleItemChange = (index: number, field: keyof BillItem, value: string | number) => {
        const newItems = [...items];
        const item = newItems[index];

        if (field === "quantity" || field === "rate") {
            const val = parseFloat(value.toString()) || 0;
            (item as any)[field] = val;
            item.amount = item.quantity * item.rate;
        } else {
            (item as any)[field] = value;
        }

        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }]);
    };

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const calculateTotals = () => {
        const subTotal = items.reduce((sum, item) => sum + item.amount, 0);
        const discount = parseFloat(invoiceData.discount.toString()) || 0;
        const taxableAmount = subTotal - discount;
        const taxRate = 0.18; // Default 18% GST (9% CGST + 9% SGST or 18% IGST)
        const taxAmount = taxableAmount * taxRate;
        const grandTotal = taxableAmount + taxAmount;

        return { subTotal, discount, taxableAmount, taxAmount, grandTotal };
    };

    const { subTotal, taxAmount, grandTotal } = calculateTotals();

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/bills", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Add Authorization header if needed or relying on cookies
                },
                body: JSON.stringify({
                    ...invoiceData,
                    items,
                }),
            });

            if (!response.ok) {
                alert("Failed to create bill");
                return;
            }

            const savedBill = await response.json();
            alert("Bill created successfully! Invoice No: " + savedBill.invoiceNo);
            // Generate PDF automatically or let user click download
        } catch (error) {
            console.error(error);
            alert("Error creating bill");
        } finally {
            setLoading(false);
        }
    };


    const loadImage = (url: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL("image/png"));
                } else {
                    reject(new Error("Canvas context is null"));
                }
            };
            img.onerror = (error) => reject(error);
        });
    };

    const generatePDF = async () => {
        const doc = new jsPDF();

        try {
            // Load Images (Optional)
            let logoData = null;
            let sealData = null;

            try {
                logoData = await loadImage("/assets/logo.png");
            } catch (e) {
                console.warn("Logo not found");
            }

            try {
                sealData = await loadImage("/assets/seal.png");
            } catch (e) {
                console.warn("Seal not found");
            }

            // Add Logo if available
            if (logoData) {
                doc.addImage(logoData, "PNG", 14, 10, 40, 20);
            }

            // Header Text (aligned right or next to logo)
            doc.setFontSize(22);
            doc.setTextColor(41, 128, 185);
            doc.text("A Z Enterprises", 160, 20, { align: "right" });

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text("Mobile: +91 7006031785, +91 6006780785", 160, 26, { align: "right" });
            doc.text("Email: azenterprises.solars@gmail.com", 160, 30, { align: "right" });
            doc.text("Kupwara, Jammu & Kashmir", 160, 34, { align: "right" });

            // Divider
            doc.setDrawColor(200);
            doc.line(14, 45, 196, 45);

            // Invoice Info
            doc.setFontSize(12);
            doc.setTextColor(0);
            doc.text("INVOICE", 14, 55);
            doc.setFontSize(10);
            doc.text(`Date: ${new Date(invoiceData.date).toLocaleDateString()}`, 14, 61);

            // Customer Details
            doc.text("Bill To:", 100, 55);
            doc.setFont("helvetica", "bold");
            doc.text(invoiceData.customerName, 100, 61);
            doc.setFont("helvetica", "normal");
            doc.text(invoiceData.customerPhone, 100, 65);
            doc.text(invoiceData.customerAddress, 100, 69);
            if (invoiceData.customerEmail) doc.text(invoiceData.customerEmail, 100, 73);

            const tableBody = items.map(item => [
                item.description,
                item.quantity,
                item.rate.toFixed(2),
                item.amount.toFixed(2)
            ]);

            autoTable(doc, {
                startY: 80,
                head: [['Item Description', 'Qty', 'Rate', 'Amount']],
                body: tableBody,
                theme: 'striped',
                headStyles: { fillColor: [41, 128, 185] },
                styles: { fontSize: 10 },
            });

            // Totals
            const finalY = (doc as any).lastAutoTable.finalY + 10;
            const rightMargin = 196;

            doc.text(`Subtotal:`, 140, finalY);
            doc.text(`${subTotal.toFixed(2)}`, rightMargin, finalY, { align: "right" });

            doc.text(`Discount:`, 140, finalY + 6);
            doc.text(`${invoiceData.discount}`, rightMargin, finalY + 6, { align: "right" });

            doc.text(`Tax (18%):`, 140, finalY + 12);
            doc.text(`${taxAmount.toFixed(2)}`, rightMargin, finalY + 12, { align: "right" });

            doc.setFont("helvetica", "bold");
            doc.text(`Grand Total:`, 140, finalY + 20);
            doc.text(`${grandTotal.toFixed(2)}`, rightMargin, finalY + 20, { align: "right" });

            // Footer / Signatures
            const footerY = Math.max(finalY + 40, 250);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);

            // Seal
            if (sealData) {
                doc.addImage(sealData, "PNG", 150, footerY - 25, 30, 30);
            }

            doc.text("Authorized Signature", 165, footerY + 10, { align: "center" });
            doc.text("A Z Enterprises", 165, footerY + 15, { align: "center" });

            doc.save(`bill-${invoiceData.customerName.replace(/\s+/g, '-')}.pdf`);

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Ensure images are available.");
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">New Bill</h1>
                    <p className="text-sm text-gray-500">Create a new invoice for customer</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={generatePDF}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                        <Download size={18} /> Preview PDF
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save size={18} /> {loading ? "Saving..." : "Save Bill"}
                    </button>
                </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700">Customer Details</h3>
                    <input
                        type="text"
                        name="customerName"
                        placeholder="Customer Name"
                        value={invoiceData.customerName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                        type="text"
                        name="customerPhone"
                        placeholder="Phone Number"
                        value={invoiceData.customerPhone}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                        type="email"
                        name="customerEmail"
                        placeholder="Email ID"
                        value={invoiceData.customerEmail}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                        type="text"
                        name="customerAddress"
                        placeholder="Address"
                        value={invoiceData.customerAddress}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700">Bill Details</h3>
                    <div>
                        <label className="text-sm text-gray-500">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={invoiceData.date}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="mb-8 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-3 font-semibold text-gray-600">Item Description</th>
                            <th className="p-3 font-semibold text-gray-600 w-24">Qty</th>
                            <th className="p-3 font-semibold text-gray-600 w-32">Rate</th>
                            <th className="p-3 font-semibold text-gray-600 w-32">Amount</th>
                            <th className="p-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index} className="border-b group hover:bg-gray-50">
                                <td className="p-2">
                                    <input
                                        type="text"
                                        value={item.description}
                                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                        placeholder="Item name / description"
                                        className="w-full p-1 bg-transparent border-none outline-none focus:ring-1 focus:rounded"
                                    />
                                </td>
                                <td className="p-2">
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                        className="w-full p-1 bg-transparent border-none outline-none focus:ring-1 focus:rounded"
                                    />
                                </td>
                                <td className="p-2">
                                    <input
                                        type="number"
                                        value={item.rate}
                                        onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                                        className="w-full p-1 bg-transparent border-none outline-none focus:ring-1 focus:rounded"
                                    />
                                </td>
                                <td className="p-2 font-medium">₹{item.amount.toFixed(2)}</td>
                                <td className="p-2">
                                    <button
                                        onClick={() => removeItem(index)}
                                        className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button
                    onClick={addItem}
                    className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                    <Plus size={18} /> Add Item
                </button>
            </div>

            {/* Totals */}
            <div className="flex justify-end mt-8">
                <div className="w-80 bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-gray-600">
                            <span className="font-medium">Subtotal</span>
                            <span>₹{subTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-600">
                            <span className="font-medium">Discount</span>
                            <div className="flex items-center gap-1 w-24">
                                <span className="text-gray-400">₹</span>
                                <input
                                    type="number"
                                    name="discount"
                                    value={invoiceData.discount}
                                    onChange={handleInputChange}
                                    className="w-full bg-transparent border-b border-gray-300 text-right outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-gray-600">
                            <span className="font-medium">Tax (18% GST)</span>
                            <span>₹{taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="pt-4 mt-4 border-t border-gray-200 flex justify-between items-center">
                            <span className="font-bold text-lg text-gray-800">Grand Total</span>
                            <span className="font-bold text-xl text-blue-600">₹{grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillForm;
