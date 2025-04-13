import { useState, useEffect } from "react";
import { Invoice } from "@/lib/mockData"; // You can delete mockData later
import { InvoiceCard } from "@/components/InvoiceCard";
import { useAuth } from "@/context/AuthContext";

interface InvoiceListProps {
  refreshTrigger?: number;
  setRefreshTrigger?: React.Dispatch<React.SetStateAction<number>>;
  status?: "pending" | "approved" | "completed" | "all";
  viewType?: "sent" | "received";
  onRefresh?: () => void;
}

export function InvoiceList({ refreshTrigger = 0, setRefreshTrigger, status = "all", viewType = "sent" }: InvoiceListProps) {  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;

      try {
        console.log("🔁 Refreshing invoices due to refreshTrigger:", refreshTrigger);
        const res = await fetch('http://localhost:3000/invoices');
            const data = await res.json();

        let filteredInvoices = data;

        if (viewType === 'sent') {
          filteredInvoices = data.filter((inv: Invoice) => inv.supplierWallet === user.walletAddress);
        } else if (viewType === 'received') {
          filteredInvoices = data.filter((inv: Invoice) => inv.buyerWallet === user.walletAddress);
        }

        if (status !== "all") {
          filteredInvoices = filteredInvoices.filter((inv: Invoice) => inv.status === status);
        }

        setInvoices(filteredInvoices);
      } catch (error) {
        console.error("Errore nel caricamento delle fatture:", error);
      }
    };

    fetchInvoices();
  }, [user, refreshTrigger, status, viewType]);

  const handleStatusChange = () => {
    if (setRefreshTrigger) {
      setRefreshTrigger(prev => prev + 1);
    } else {
      console.warn("⚠️ setRefreshTrigger non definito in InvoiceList");
    }
  };

  if (invoices.length === 0) {
    return (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No invoices found</p>
        </div>
    );
  }

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {invoices.map((invoice) => (
            <InvoiceCard
                key={invoice.id || invoice.invoiceId}
                invoice={invoice}
                onStatusChange={handleStatusChange}
                viewType={viewType}
            />
        ))}
      </div>
  );
}