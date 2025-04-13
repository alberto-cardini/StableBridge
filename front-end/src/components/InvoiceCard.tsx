import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, CheckCircle, Clock, MoreVertical, ChevronDown, ChevronUp } from "lucide-react";
import { Invoice, createEscrow, releasePayment } from "@/lib/mockData";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { approveInvoice, confirmPayment } from "@/lib/api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

interface InvoiceCardProps {
  invoice: Invoice;
  onStatusChange: () => void;
  viewType: "sent" | "received";
}

export function InvoiceCard({
  invoice,
  onStatusChange,
  viewType
}: InvoiceCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const {
    user
  } = useAuth();

  const handleApproveInvoice = async () => {
    setIsLoading(true);
    try {
      console.log("Approving invoice with ID:", invoice.invoiceId);
      await approveInvoice(invoice.invoiceId); // use invoiceId
      toast.success("Invoice approved successfully!");
      onStatusChange(); // refresh list if needed
    } catch (error: unknown) {
      console.error(error);
      toast.error("Unable to approve invoice");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReceipt = async () => {
    setIsLoading(true);
    try {
      await confirmPayment(invoice.invoiceId); // use invoiceId
      toast.success("Payment confirmed!");
      onStatusChange();
    } catch (error: unknown) {
      console.error(error);
      toast.error("Unable to confirm payment");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: invoice.currency?.includes("RL") ? invoice.currency.substring(2) : invoice.currency || 'USD'
    }).format(amount);
  };

  const getStatusBadge = () => {
    switch (invoice.status) {
      case 'accepted':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border border-amber-200">Approved</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border border-emerald-200">Completed</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border border-emerald-200">Paid</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border border-gray-200">Pending</Badge>;
    }
  };

  return <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            <h3 className="font-semibold text-lg">{invoice.name}</h3>
            {getStatusBadge()}
          </div>
          
          <div className="mt-2 space-y-1">
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(invoice.amount)}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar size={14} className="inline" />
              {invoice.invoiceId || ''} - {new Date(invoice.date).toLocaleDateString('en-US')}
            </p>
            {<p className="text-sm text-muted-foreground mt-1">
                {viewType === 'received' ? 'From:' : 'To:'} <span className="font-medium">
                  {viewType === 'sent' && invoice.buyerUsername ? invoice.buyerUsername : invoice.companyName}
                </span>
              </p>}
          </div>
        </div>
        
        <Button variant="ghost" size="sm" className="p-1 h-8 w-8" onClick={() => setIsDetailsOpen(!isDetailsOpen)}>
          {isDetailsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </div>
      
      {isDetailsOpen && <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invoice.description && <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm">{invoice.description}</p>
              </div>}
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Invoice Number</p>
              <p className="text-sm">{invoice.invoiceId || invoice.id}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
              <p className="text-sm">{new Date(invoice.issueDate || invoice.date).toLocaleDateString('en-US')}</p>
            </div>
            
            {invoice.dueDate && <div>
                <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                <p className="text-sm">{new Date(invoice.dueDate).toLocaleDateString('en-US')}</p>
              </div>}
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Currency</p>
              <p className="text-sm">{invoice.currency || 'USD'}</p>
            </div>
            
            {invoice.buyerUsername && viewType === 'sent' && <div>
                <p className="text-sm font-medium text-muted-foreground">Sent To</p>
                <p className="text-sm">{invoice.buyerUsername}</p>
              </div>}
            
            {invoice.products && invoice.products.length > 0 && <div className="col-span-1 md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">Products</p>
                <ul className="space-y-1">
                  {invoice.products.map((product, index) => <li key={index} className="text-sm">
                      {product.name} - {formatCurrency(product.price)} x {product.quantity}
                    </li>)}
                </ul>
              </div>}
            
            {invoice.pdfUrl && <div className="col-span-1 md:col-span-2 mt-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                    View Invoice PDF
                  </a>
                </Button>
              </div>}
          </div>
        </div>}
      
      {isOpen && <div className="mt-3 border rounded-md p-4 bg-white shadow-md absolute right-0 z-10 w-72">
          <h4 className="font-medium mb-2">Options</h4>
          <Button variant="outline" size="sm" className="w-full mb-2" onClick={() => {
        setIsOpen(false);
        // Add any action you want for this option
        toast.info("Invoice details view toggled");
        setIsDetailsOpen(!isDetailsOpen);
      }}>
            {isDetailsOpen ? "Hide Details" : "Show Details"}
          </Button>
          {/* Add more options as needed */}
        </div>}
      
      <div className="mt-4">
        {invoice.status === 'pending' && <div className="flex items-center text-amber-600 text-sm mb-3">
            <Clock size={14} className="mr-1" />
            Waiting for approval
          </div>}
        
        {invoice.status === 'accepted' && <div className="flex items-center text-amber-600 text-sm mb-3">
            <CheckCircle size={14} className="mr-1" />
            Approved, waiting for confirmation
          </div>}
        
        {(invoice.status === 'completed' || invoice.status === 'paid') && <div className="flex items-center text-emerald-600 text-sm mb-3">
            <CheckCircle size={14} className="mr-1" />
            {invoice.status === 'paid' ? 'Paid' : 'Completed'}
          </div>}
      </div>
      
      {viewType === 'received' && invoice.status === 'pending' && <div className="mt-2">
          <Button onClick={handleApproveInvoice} disabled={isLoading} className="w-full">
            {isLoading ? "Processing..." : "Approve Invoice"}
          </Button>
        </div>}
      
      {viewType === 'received' && invoice.status === 'accepted' && <div className="mt-2">
          <Button onClick={handleConfirmReceipt} disabled={isLoading} variant="default" className="w-full bg-emerald-600 hover:bg-emerald-700">
            {isLoading ? "Processing..." : "Confirm Receipt"}
          </Button>
        </div>}
    </Card>;
}
