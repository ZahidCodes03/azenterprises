import { useState, useEffect, useRef } from 'react';
import { FiPlus, FiMinus, FiPrinter, FiDownload, FiSave, FiList } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getInvoiceItems, createInvoice, generateInvoicePDF, getNextInvoiceNumber, getInvoices } from '../services/api';

const Invoices = () => {
    const [activeTab, setActiveTab] = useState('create'); // 'create' or 'list'
    const [invoiceItems, setInvoiceItems] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const printRef = useRef();

    const [invoiceData, setInvoiceData] = useState({
        invoiceNo: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        customerName: '',
        customerAddress: '',
        customerPhone: '',
        customerGstin: '',
    });

    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [itemsRes, nextNoRes, invoicesRes] = await Promise.all([
                    getInvoiceItems(),
                    getNextInvoiceNumber(),
                    getInvoices()
                ]);
                setInvoiceItems(itemsRes.data);
                setInvoiceData(prev => ({ ...prev, invoiceNo: nextNoRes.data.nextInvoiceNo }));
                setInvoices(invoicesRes.data);

                // Initialize items with qty and rate = 0
                setItems(itemsRes.data.map(item => ({
                    name: item.name,
                    hsn: item.hsn,
                    gst: item.gst,
                    unit: item.unit,
                    qty: 0,
                    rate: 0
                })));
            } catch (error) {
                toast.error('Failed to load invoice data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInvoiceData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = parseFloat(value) || 0;
        setItems(newItems);
    };

    // Calculations
    const calculateItemAmount = (item) => item.qty * item.rate;
    const calculateItemGst = (item) => calculateItemAmount(item) * (item.gst / 100);
    const calculateItemCgst = (item) => calculateItemGst(item) / 2;
    const calculateItemSgst = (item) => calculateItemGst(item) / 2;
    const calculateItemTotal = (item) => calculateItemAmount(item) + calculateItemGst(item);

    const activeItems = items.filter(item => item.qty > 0 && item.rate > 0);
    const subtotal = activeItems.reduce((sum, item) => sum + calculateItemAmount(item), 0);
    const cgstTotal = activeItems.reduce((sum, item) => sum + calculateItemCgst(item), 0);
    const sgstTotal = activeItems.reduce((sum, item) => sum + calculateItemSgst(item), 0);
    const grandTotal = subtotal + cgstTotal + sgstTotal;

    // Number to words conversion
    const numberToWords = (num) => {
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
            'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        if (num === 0) return 'Zero Rupees Only';
        const n = Math.floor(num);

        const convertLessThanThousand = (n) => {
            if (n < 20) return ones[n];
            if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
            return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convertLessThanThousand(n % 100) : '');
        };

        let result = '';
        if (n >= 10000000) { // Crore
            result += convertLessThanThousand(Math.floor(n / 10000000)) + ' Crore ';
            num = n % 10000000;
        }
        if (n >= 100000) { // Lakh
            result += convertLessThanThousand(Math.floor((n % 10000000) / 100000)) + ' Lakh ';
        }
        if (n >= 1000) { // Thousand
            result += convertLessThanThousand(Math.floor((n % 100000) / 1000)) + ' Thousand ';
        }
        if (n % 1000) {
            result += convertLessThanThousand(n % 1000);
        }
        return (result.trim() || 'Zero') + ' Rupees Only';
    };

    const handleSaveInvoice = async () => {
        if (!invoiceData.customerName || activeItems.length === 0) {
            toast.error('Please fill customer name and add at least one item');
            return;
        }

        setIsSaving(true);
        try {
            await createInvoice({
                ...invoiceData,
                items: activeItems
            });
            toast.success('Invoice saved successfully!');

            // Refresh invoice list and get next number
            const [invoicesRes, nextNoRes] = await Promise.all([
                getInvoices(),
                getNextInvoiceNumber()
            ]);
            setInvoices(invoicesRes.data);
            setInvoiceData(prev => ({ ...prev, invoiceNo: nextNoRes.data.nextInvoiceNo }));

            // Reset form
            setItems(items.map(item => ({ ...item, qty: 0, rate: 0 })));
            setInvoiceData(prev => ({
                ...prev,
                customerName: '',
                customerAddress: '',
                customerPhone: '',
                customerGstin: ''
            }));
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save invoice');
        } finally {
            setIsSaving(false);
        }
    };

    const handleGeneratePDF = async () => {
        if (!invoiceData.customerName || activeItems.length === 0) {
            toast.error('Please fill customer name and add at least one item');
            return;
        }

        try {
            const response = await generateInvoicePDF({
                ...invoiceData,
                items: activeItems
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice-${invoiceData.invoiceNo}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('PDF generated successfully!');
        } catch (error) {
            toast.error('Failed to generate PDF');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-48"></div>
                    <div className="h-96 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header with Tabs */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
                    <p className="text-gray-600">Create and manage GST invoices</p>
                </div>
                <div className="flex mt-4 md:mt-0 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'create' ? 'bg-white shadow text-primary-700' : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <FiPlus className="inline w-4 h-4 mr-2" />
                        Create Invoice
                    </button>
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'list' ? 'bg-white shadow text-primary-700' : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <FiList className="inline w-4 h-4 mr-2" />
                        Invoice List
                    </button>
                </div>
            </div>

            {activeTab === 'create' ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Invoice Content */}
                    <div ref={printRef} className="p-6 md:p-8" id="invoice-print">
                        {/* Company Header */}
                        <div className="text-center border-b-2 border-primary-600 pb-6 mb-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-primary-600">A Z ENTERPRISES</h1>
                            <p className="text-gray-600 text-sm">Authorized Solar Distributors / Installation</p>
                            <p className="text-gray-500 text-xs mt-1">GSTIN: 01ACMFA6519J1ZF</p>
                            <p className="text-gray-500 text-xs">BY-PASS ROAD HANDWARA – 193221</p>
                            <p className="text-gray-500 text-xs">Contact: 7006031785, 6006780785</p>
                        </div>

                        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">TAX INVOICE</h2>

                        {/* Invoice Details */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500">Invoice No.</label>
                                        <input
                                            type="text"
                                            name="invoiceNo"
                                            value={invoiceData.invoiceNo}
                                            onChange={handleInputChange}
                                            className="w-full text-sm font-medium border-b border-gray-300 focus:border-primary-500 outline-none py-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Date</label>
                                        <input
                                            type="date"
                                            name="invoiceDate"
                                            value={invoiceData.invoiceDate}
                                            onChange={handleInputChange}
                                            className="w-full text-sm font-medium border-b border-gray-300 focus:border-primary-500 outline-none py-1"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <p className="text-xs font-semibold text-gray-600">BILL TO:</p>
                                <input
                                    type="text"
                                    name="customerName"
                                    value={invoiceData.customerName}
                                    onChange={handleInputChange}
                                    placeholder="Customer Name *"
                                    className="w-full text-sm font-medium border-b border-gray-300 focus:border-primary-500 outline-none py-1"
                                />
                                <input
                                    type="text"
                                    name="customerAddress"
                                    value={invoiceData.customerAddress}
                                    onChange={handleInputChange}
                                    placeholder="Address"
                                    className="w-full text-sm border-b border-gray-300 focus:border-primary-500 outline-none py-1"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="tel"
                                        name="customerPhone"
                                        value={invoiceData.customerPhone}
                                        onChange={handleInputChange}
                                        placeholder="Phone"
                                        className="w-full text-sm border-b border-gray-300 focus:border-primary-500 outline-none py-1"
                                    />
                                    <input
                                        type="text"
                                        name="customerGstin"
                                        value={invoiceData.customerGstin}
                                        onChange={handleInputChange}
                                        placeholder="GSTIN (optional)"
                                        className="w-full text-sm border-b border-gray-300 focus:border-primary-500 outline-none py-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="overflow-x-auto mb-6">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-primary-600 text-white">
                                        <th className="px-2 py-2 text-left text-xs">S.No</th>
                                        <th className="px-2 py-2 text-left text-xs">Particulars</th>
                                        <th className="px-2 py-2 text-center text-xs">HSN</th>
                                        <th className="px-2 py-2 text-center text-xs">Qty</th>
                                        <th className="px-2 py-2 text-center text-xs">Unit</th>
                                        <th className="px-2 py-2 text-center text-xs">Rate</th>
                                        <th className="px-2 py-2 text-center text-xs">GST%</th>
                                        <th className="px-2 py-2 text-center text-xs">CGST</th>
                                        <th className="px-2 py-2 text-center text-xs">SGST</th>
                                        <th className="px-2 py-2 text-right text-xs">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {items.map((item, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="px-2 py-2 text-center text-xs">{index + 1}</td>
                                            <td className="px-2 py-2 text-xs font-medium">{item.name}</td>
                                            <td className="px-2 py-2 text-center text-xs text-gray-500">{item.hsn}</td>
                                            <td className="px-2 py-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={item.qty || ''}
                                                    onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                                                    className="w-16 text-center text-xs border border-gray-300 rounded px-1 py-1 focus:border-primary-500 outline-none"
                                                    placeholder="0"
                                                />
                                            </td>
                                            <td className="px-2 py-2 text-center text-xs text-gray-500">{item.unit}</td>
                                            <td className="px-2 py-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={item.rate || ''}
                                                    onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                                    className="w-20 text-center text-xs border border-gray-300 rounded px-1 py-1 focus:border-primary-500 outline-none"
                                                    placeholder="0"
                                                />
                                            </td>
                                            <td className="px-2 py-2 text-center text-xs text-gray-600">{item.gst}%</td>
                                            <td className="px-2 py-2 text-center text-xs">₹{calculateItemCgst(item).toFixed(2)}</td>
                                            <td className="px-2 py-2 text-center text-xs">₹{calculateItemSgst(item).toFixed(2)}</td>
                                            <td className="px-2 py-2 text-right text-xs font-medium">₹{calculateItemTotal(item).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="flex justify-end mb-6">
                            <div className="w-64 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Sub Total:</span>
                                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">CGST Total:</span>
                                    <span className="font-medium">₹{cgstTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">SGST Total:</span>
                                    <span className="font-medium">₹{sgstTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 text-primary-600">
                                    <span>Grand Total:</span>
                                    <span>₹{grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Amount in Words */}
                        <div className="p-3 bg-gray-50 rounded-lg mb-6 text-sm">
                            <span className="text-gray-500">Amount in Words: </span>
                            <span className="font-medium">{numberToWords(grandTotal)}</span>
                        </div>

                        {/* Bank Details & Terms */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-800 text-sm mb-2">Bank Details:</h4>
                                <div className="text-xs text-gray-600 space-y-1">
                                    <p>Account Name: A Z ENTERPRISES</p>
                                    <p>Account Number: 0012010100003649</p>
                                    <p>IFSC: JAKA0FOREST</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 text-sm mb-2">Terms & Conditions:</h4>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    <li>• Cable price up to 40 meters only</li>
                                    <li>• Extra material beyond scope chargeable</li>
                                    <li>• Installation after advance payment</li>
                                    <li>• Price validity: 15 days</li>
                                    <li>• Warranty as per manufacturer</li>
                                    <li>• No hidden charges</li>
                                </ul>
                            </div>
                        </div>

                        {/* Signature */}
                        <div className="flex justify-end mt-8">
                            <div className="text-center">
                                <div className="w-40 border-b border-gray-400 mb-2"></div>
                                <p className="text-xs text-gray-500">Authorized Signatory</p>
                                <p className="text-xs font-semibold text-gray-700">A Z ENTERPRISES</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-3 no-print">
                        <button
                            onClick={handleSaveInvoice}
                            disabled={isSaving}
                            className="btn-primary flex items-center disabled:opacity-70"
                        >
                            <FiSave className="w-5 h-5 mr-2" />
                            {isSaving ? 'Saving...' : 'Save Invoice'}
                        </button>
                        <button
                            onClick={handleGeneratePDF}
                            className="btn-secondary flex items-center"
                        >
                            <FiDownload className="w-5 h-5 mr-2" />
                            Download PDF
                        </button>
                        <button
                            onClick={handlePrint}
                            className="btn-secondary flex items-center"
                        >
                            <FiPrinter className="w-5 h-5 mr-2" />
                            Print
                        </button>
                    </div>
                </div>
            ) : (
                /* Invoice List */
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr className="text-left text-sm text-gray-500">
                                    <th className="px-6 py-4 font-medium">Invoice No.</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Customer</th>
                                    <th className="px-6 py-4 font-medium text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {invoices.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            No invoices found
                                        </td>
                                    </tr>
                                ) : (
                                    invoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-primary-600">{invoice.invoice_no}</td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {new Date(invoice.invoice_date).toLocaleDateString('en-IN')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">{invoice.customer_name}</p>
                                                <p className="text-sm text-gray-500">{invoice.customer_phone}</p>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-gray-900">
                                                ₹{parseFloat(invoice.grand_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Print Styles */}
            <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { margin: 0; padding: 0; }
          body * { visibility: hidden; }
          #invoice-print, #invoice-print * { visibility: visible; }
          #invoice-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px !important;
          }
          .no-print { display: none !important; }
          
          /* Compact layout for print */
          h1 { font-size: 24px !important; }
          h2 { font-size: 18px !important; margin-bottom: 10px !important; }
          p, td, th, input { font-size: 10pt !important; }
          .input-field { border: none !important; }
          
          /* Hide empty rows if possible or compact them */
          tr { line-height: 1.2; }
          td, th { padding: 4px !important; }
          
          /* Ensure colors print */
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
        </div>
    );
};

export default Invoices;
