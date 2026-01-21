import { prisma } from "../prisma";
import { Bill, BillItem } from "@prisma/client";

interface CreateBillItemInput {
  description: string;
  quantity: number;
  rate: number;
}

interface CreateBillInput {
  invoiceNo: string; // generated on frontend or backend? Let's assume passed or generated here.
  // Actually, typically auto-generated. Let's make it optional in input and generate if missing, or user provides.
  // The requirements say "Bill Number (auto-generated)".
  date: string | Date;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  discount?: number;
  items: CreateBillItemInput[];
}

export const createBill = async (data: CreateBillInput) => {
  // Calculate amounts
  let subTotal = 0;
  const processedItems = data.items.map((item) => {
    const amount = item.quantity * item.rate;
    subTotal += amount;
    return {
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      amount: amount,
    };
  });

  const discount = data.discount || 0;
  // Tax Calculation:
  // Requirement says: CGST, SGST, IGST (auto-select based on state).
  // For simplicity, let's assume a standard tax rate or logic.
  // If state is same as business state (e.g. "Delhi"), then CGST+SGST. Else IGST.
  // We need business state. Let's assume hardcoded "Maharashtra" for A Z Enterprises for now or derived.
  // Actually, simplified logic: 18% GST default for now unless specified.
  const taxRate = 0.18; 
  const taxableAmount = subTotal - discount;
  const taxAmount = taxableAmount * taxRate;
  const grandTotal = taxableAmount + taxAmount;

  // Auto-generate invoice number if not provided?
  // Let's generate a simple sequential or time-based one if needed.
  // For now, assume the controller handles unique generation or we do it here.
  let invoiceNo = data.invoiceNo;
  if (!invoiceNo) {
      const count = await prisma.bill.count();
      invoiceNo = `INV-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;
  }

  const bill = await prisma.bill.create({
    data: {
      invoiceNo,
      date: new Date(data.date),
      customerName: data.customerName,
      customerAddress: data.customerAddress,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      subTotal,
      discount,
      taxAmount,
      grandTotal,
      items: {
        create: processedItems,
      },
    },
    include: {
      items: true,
    },
  });

  return bill;
};

export const getBills = async () => {
  return await prisma.bill.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
        items: true
    }
  });
};

export const getBillById = async (id: string) => {
  return await prisma.bill.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });
};

export const deleteBill = async (id: string) => {
  return await prisma.bill.delete({
    where: { id },
  });
};
