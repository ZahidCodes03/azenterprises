const PDFDocument = require('pdfkit');

// Convert number to words (Indian format)
const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero';

    const numStr = Math.floor(num).toString().padStart(9, '0');
    let words = '';

    // Crores
    const crores = parseInt(numStr.substring(0, 2));
    if (crores > 0) {
        words += (crores < 20 ? ones[crores] : tens[Math.floor(crores / 10)] + ' ' + ones[crores % 10]) + ' Crore ';
    }

    // Lakhs
    const lakhs = parseInt(numStr.substring(2, 4));
    if (lakhs > 0) {
        words += (lakhs < 20 ? ones[lakhs] : tens[Math.floor(lakhs / 10)] + ' ' + ones[lakhs % 10]) + ' Lakh ';
    }

    // Thousands
    const thousands = parseInt(numStr.substring(4, 6));
    if (thousands > 0) {
        words += (thousands < 20 ? ones[thousands] : tens[Math.floor(thousands / 10)] + ' ' + ones[thousands % 10]) + ' Thousand ';
    }

    // Hundreds
    const hundreds = parseInt(numStr.substring(6, 7));
    if (hundreds > 0) {
        words += ones[hundreds] + ' Hundred ';
    }

    // Tens and Ones
    const remaining = parseInt(numStr.substring(7, 9));
    if (remaining > 0) {
        if (words !== '') words += 'and ';
        words += remaining < 20 ? ones[remaining] : tens[Math.floor(remaining / 10)] + ' ' + ones[remaining % 10];
    }

    return words.trim() + ' Rupees Only';
};

// Generate Invoice PDF
const generateInvoicePDF = (invoiceData) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 40, size: 'A4' });
            const chunks = [];

            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            const pageWidth = doc.page.width - 80;

            // helper: draw common header (company info + invoice title)
            const drawHeader = () => {
                doc.fontSize(20).font('Helvetica-Bold').fillColor('#16a34a')
                    .text('A Z ENTERPRISES', { align: 'center' });
                doc.fontSize(10).font('Helvetica').fillColor('#333')
                    .text('Authorized Solar Distributors / Installation', { align: 'center' });
                doc.fontSize(9)
                    .text('GSTIN: 01ACMFA6519J1ZF', { align: 'center' })
                    .text('BY-PASS ROAD HANDWARA – 193221', { align: 'center' })
                    .text('Contact: 7006031785, 6006780785', { align: 'center' });

                doc.moveDown();
                doc.strokeColor('#16a34a').lineWidth(2)
                    .moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).stroke();

                // Invoice Title
                doc.moveDown();
                doc.fontSize(16).font('Helvetica-Bold').fillColor('#16a34a')
                    .text('TAX INVOICE', { align: 'center' });
                doc.moveDown();
            };

            // draw the header on the first page
            drawHeader();

            // Invoice Details Box
            const boxTop = doc.y;
            doc.fontSize(10).font('Helvetica').fillColor('#333');

            // Left side - Invoice details
            doc.text(`Invoice No: ${invoiceData.invoice_no}`, 50, boxTop);
            doc.text(`Date: ${new Date(invoiceData.invoice_date).toLocaleDateString('en-IN')}`, 50, boxTop + 15);

            // Right side - Customer details
            doc.text('Bill To:', 320, boxTop);
            doc.font('Helvetica-Bold').text(invoiceData.customer_name, 320, boxTop + 15);
            doc.font('Helvetica').fontSize(9);
            if (invoiceData.customer_address) {
                doc.text(invoiceData.customer_address, 320, boxTop + 30, { width: 200 });
            }
            if (invoiceData.customer_phone) {
                doc.text(`Phone: ${invoiceData.customer_phone}`, 320, doc.y + 5);
            }
            if (invoiceData.customer_gstin) {
                doc.text(`GSTIN: ${invoiceData.customer_gstin}`, 320, doc.y + 5);
            }

            doc.moveDown(3);

            // Items Table
            const tableHeaders = ['S.No', 'Particulars', 'HSN', 'Qty', 'Unit', 'Rate', 'GST%', 'CGST', 'SGST', 'Amount'];
            const colWidths = [30, 100, 45, 30, 30, 55, 35, 45, 45, 60];

            // helpers for pagination
            const bottomMargin = 40;
            const rowHeight = 18;

            const drawTableHeader = (y) => {
                let x = 40;
                doc.fillColor('#16a34a').rect(40, y, pageWidth, 20).fill();
                doc.fillColor('white').fontSize(8).font('Helvetica-Bold');
                tableHeaders.forEach((header, i) => {
                    doc.text(header, x + 3, y + 5, { width: colWidths[i], align: 'center' });
                    x += colWidths[i];
                });
            };

            // start position for table
            let tableTop = doc.y + 10;
            // if there isn't room for at least one header + one row, start a new page
            const headerHeight = 20;
            if (tableTop + headerHeight + rowHeight > doc.page.height - bottomMargin) {
                doc.addPage();
                drawHeader();
                tableTop = doc.y + 10; // reset top on new page below header
            }

            drawTableHeader(tableTop);

            // Table Rows
            let rowY = tableTop + 20;
            doc.fontSize(8).font('Helvetica').fillColor('#333');

            // we'll need to draw borders per page segment
            let currentPageStart = tableTop;

            invoiceData.items.forEach((item, index) => {
                if (!(item.qty && item.qty > 0)) return;

                // check if we need a new page before drawing this row
                if (rowY + rowHeight > doc.page.height - bottomMargin) {
                    // finish border on current page
                    doc.strokeColor('#16a34a').lineWidth(1)
                        .rect(40, currentPageStart, pageWidth, rowY - currentPageStart).stroke();

                    // add a fresh page and repeat header
                    doc.addPage();
                    drawHeader();

                    // position new table top below header
                    tableTop = doc.y + 10;
                    drawTableHeader(tableTop);
                    currentPageStart = tableTop;
                    rowY = tableTop + 20;
                }

                let xPos = 40;
                const amount = item.qty * item.rate;
                const gstAmount = amount * (item.gst / 100);
                const cgst = gstAmount / 2;
                const sgst = gstAmount / 2;

                // Alternate row colors
                if (index % 2 === 0) {
                    doc.fillColor('#f0fdf4').rect(40, rowY, pageWidth, rowHeight).fill();
                }
                doc.fillColor('#333');

                const rowData = [
                    (index + 1).toString(),
                    item.name,
                    item.hsn || '-',
                    item.qty.toString(),
                    item.unit || 'Nos',
                    `₹${item.rate.toFixed(2)}`,
                    `${item.gst}%`,
                    `₹${cgst.toFixed(2)}`,
                    `₹${sgst.toFixed(2)}`,
                    `₹${(amount + gstAmount).toFixed(2)}`
                ];

                rowData.forEach((data, i) => {
                    doc.text(data, xPos + 3, rowY + 5, { width: colWidths[i], align: i === 1 ? 'left' : 'center' });
                    xPos += colWidths[i];
                });

                rowY += rowHeight;
            });

            // final border for whatever is left on the last page
            doc.strokeColor('#16a34a').lineWidth(1)
                .rect(40, currentPageStart, pageWidth, rowY - currentPageStart).stroke();

            // Before drawing totals, make sure there is enough room on current page
            const remainingHeight = 4 * 18 + 40; // approx space needed for totals + amount in words etc
            if (rowY + remainingHeight > doc.page.height - bottomMargin) {
                doc.addPage();
                drawHeader();
                rowY = doc.y + 10; // start under fresh header
            }

            // Totals Section
            rowY += 10;
            const totalsX = 350;
            doc.fontSize(10).font('Helvetica');

            doc.text('Sub Total:', totalsX, rowY);
            doc.text(`₹${invoiceData.subtotal.toFixed(2)}`, totalsX + 120, rowY, { align: 'right' });

            rowY += 18;
            doc.text('CGST Total:', totalsX, rowY);
            doc.text(`₹${invoiceData.cgst_total.toFixed(2)}`, totalsX + 120, rowY, { align: 'right' });

            rowY += 18;
            doc.text('SGST Total:', totalsX, rowY);
            doc.text(`₹${invoiceData.sgst_total.toFixed(2)}`, totalsX + 120, rowY, { align: 'right' });

            rowY += 18;
            doc.font('Helvetica-Bold').fillColor('#16a34a');
            doc.text('Grand Total:', totalsX, rowY);
            doc.text(`₹${invoiceData.grand_total.toFixed(2)}`, totalsX + 120, rowY, { align: 'right' });

            // Amount in words
            rowY += 25;
            doc.fillColor('#333').font('Helvetica').fontSize(9);
            doc.text(`Amount in Words: ${numberToWords(invoiceData.grand_total)}`, 40, rowY);

            // Bank Details
            rowY += 30;
            doc.font('Helvetica-Bold').fontSize(10).fillColor('#16a34a')
                .text('Bank Details:', 40, rowY);
            doc.font('Helvetica').fontSize(9).fillColor('#333');
            rowY += 15;
            doc.text('Account Name: A Z ENTERPRISES', 40, rowY);
            doc.text('Account Number: 0012010100003649', 40, rowY + 12);
            doc.text('IFSC: JAKA0FOREST', 40, rowY + 24);

            // Terms & Conditions
            rowY += 50;
            doc.font('Helvetica-Bold').fontSize(10).fillColor('#16a34a')
                .text('Terms & Conditions:', 40, rowY);
            doc.font('Helvetica').fontSize(8).fillColor('#666');
            rowY += 15;
            const terms = [
                '• Cable price up to 40 meters only',
                '• Extra material beyond scope chargeable',
                '• Installation after advance payment',
                '• Price validity: 15 days',
                '• Warranty as per manufacturer',
                '• No hidden charges'
            ];
            terms.forEach(term => {
                doc.text(term, 40, rowY);
                rowY += 12;
            });

            // Signature Section
            rowY += 20;
            doc.strokeColor('#333').lineWidth(0.5)
                .moveTo(400, rowY + 30).lineTo(520, rowY + 30).stroke();
            doc.fontSize(9).fillColor('#333')
                .text('Authorized Signatory', 400, rowY + 35, { width: 120, align: 'center' })
                .font('Helvetica-Bold').text('A Z ENTERPRISES', 400, rowY + 48, { width: 120, align: 'center' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateInvoicePDF, numberToWords };
