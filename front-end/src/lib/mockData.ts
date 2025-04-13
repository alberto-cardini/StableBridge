
export interface Invoice {
  id: string;
  name: string;
  amount: number;
  date: string;
  companyId: string;
  companyName: string;
  status: 'pending' | 'accepted' | 'completed' | 'paid';
  pdfUrl?: string;
  currency?: string;
  issuerWallet?: string;
  recipientWallet?: string;
  description?: string;
  dueDate?: string;
  invoiceId?: string;
  supplierWallet?: string;
  buyerWallet?: string;
  buyerUsername?: string;  // Added this property
  issueDate?: string;
  products?: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
}

// Mock invoices
export const mockInvoices: Invoice[] = [
  {
    id: "inv-001",
    name: "Office Supplies",
    amount: 1250.75,
    date: "2025-03-15",
    companyId: "comp-123",
    companyName: "Demo Company",
    status: "pending",
    pdfUrl: "/invoice-sample.pdf",
    description: "Monthly office supplies including stationery, paper, and printer cartridges",
    dueDate: "2025-04-15",
    invoiceId: "INV-0001",
    supplierWallet: "rSUPPLIERWALLETADDRESS",
    buyerWallet: "rBUYERWALLETADDRESS",
    issueDate: "2025-03-15",
    currency: "RLUSD",
    products: [
      { name: "Paper Reams", price: 450.25, quantity: 5 },
      { name: "Printer Cartridges", price: 600.50, quantity: 2 },
      { name: "Stationery Set", price: 200.00, quantity: 1 }
    ]
  },
  {
    id: "inv-002",
    name: "Marketing Services",
    amount: 5600.00,
    date: "2025-03-10",
    companyId: "comp-123",
    companyName: "Demo Company",
    status: "accepted",
    pdfUrl: "/invoice-sample.pdf",
    description: "Digital marketing campaign for Q1 2025",
    dueDate: "2025-04-10",
    invoiceId: "INV-0002",
    supplierWallet: "rSUPPLIERWALLETADDRESS",
    buyerWallet: "rBUYERWALLETADDRESS",
    issueDate: "2025-03-10",
    currency: "RLUSD",
    products: [
      { name: "SEO Optimization", price: 2000.00, quantity: 1 },
      { name: "Social Media Management", price: 1800.00, quantity: 1 },
      { name: "Content Creation", price: 1800.00, quantity: 1 }
    ]
  },
  {
    id: "inv-003",
    name: "IT Equipment",
    amount: 8750.50,
    date: "2025-03-05",
    companyId: "comp-123",
    companyName: "Demo Company",
    status: "completed",
    pdfUrl: "/invoice-sample.pdf",
    description: "New hardware for development team",
    dueDate: "2025-04-05",
    invoiceId: "INV-0003",
    supplierWallet: "rSUPPLIERWALLETADDRESS",
    buyerWallet: "rBUYERWALLETADDRESS",
    issueDate: "2025-03-05",
    currency: "RLUSD",
    products: [
      { name: "Laptops", price: 6000.00, quantity: 3 },
      { name: "Monitors", price: 1800.00, quantity: 6 },
      { name: "Keyboards & Mice", price: 950.50, quantity: 10 }
    ]
  },
  {
    id: "inv-004",
    name: "Consulting Services",
    amount: 12000.00,
    date: "2025-03-01",
    companyId: "comp-123",
    companyName: "Demo Company",
    status: "pending",
    pdfUrl: "/invoice-sample.pdf",
    description: "Business strategy consulting for Q2 2025",
    dueDate: "2025-04-01",
    invoiceId: "INV-0004",
    supplierWallet: "rSUPPLIERWALLETADDRESS",
    buyerWallet: "rBUYERWALLETADDRESS",
    issueDate: "2025-03-01",
    currency: "RLUSD",
    products: [
      { name: "Strategy Workshop", price: 5000.00, quantity: 1 },
      { name: "Market Analysis", price: 3500.00, quantity: 1 },
      { name: "Implementation Planning", price: 3500.00, quantity: 1 }
    ]
  }
];

let invoicesData = [...mockInvoices];

export const getInvoices = () => {
  return [...invoicesData];
};

export const addInvoice = (invoice: Omit<Invoice, 'id' | 'date' | 'status'>) => {
  const newInvoice: Invoice = {
    ...invoice,
    id: `inv-${String(invoicesData.length + 1).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
  };
  
  invoicesData = [newInvoice, ...invoicesData];
  return newInvoice;
};

export const updateInvoiceStatus = (id: string, status: Invoice['status']) => {
  invoicesData = invoicesData.map(invoice => 
    invoice.id === id ? { ...invoice, status } : invoice
  );
  
  return invoicesData.find(invoice => invoice.id === id);
};

// Mock payment functions
export const createEscrow = async (invoiceId: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return updateInvoiceStatus(invoiceId, 'accepted');
};

export const releasePayment = async (invoiceId: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return updateInvoiceStatus(invoiceId, 'completed');
};
