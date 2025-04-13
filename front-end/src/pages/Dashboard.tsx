
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoiceList } from "@/components/InvoiceList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<'sent' | 'received'>('sent');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleInvoiceAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          {viewMode === 'sent' && (
            <InvoiceForm onInvoiceAdded={handleInvoiceAdded} />
          )}
        </div>
        
        <div className="mb-6">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'sent' | 'received')}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="sent">Sent Invoices</TabsTrigger>
              <TabsTrigger value="received">Received Invoices</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {viewMode === 'sent' ? (
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid grid-cols-3 w-full max-w-md">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <div>
                    <h2 className="text-lg font-medium mb-4">All Sent Invoices</h2>
                    <Separator className="mb-6" />
                    <InvoiceList refreshTrigger={refreshTrigger} setRefreshTrigger = {setRefreshTrigger} status="all" viewType="sent" />
                  </div>
                </TabsContent>
                
                <TabsContent value="pending">
                  <div>
                    <h2 className="text-lg font-medium mb-4">Pending Invoices</h2>
                    <Separator className="mb-6" />
                    <p className="text-sm text-muted-foreground mb-6">
                      These invoices are waiting for buyer approval or payment.
                    </p>
                    <InvoiceList refreshTrigger={refreshTrigger} setRefreshTrigger = {setRefreshTrigger} status="pending" viewType="sent" />
                  </div>
                </TabsContent>
                
                <TabsContent value="completed">
                  <div>
                    <h2 className="text-lg font-medium mb-4">Completed Invoices</h2>
                    <Separator className="mb-6" />
                    <p className="text-sm text-muted-foreground mb-6">
                      These invoices have been approved and paid.
                    </p>
                    <InvoiceList refreshTrigger={refreshTrigger} setRefreshTrigger = {setRefreshTrigger} status="completed" viewType="sent" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid grid-cols-3 w-full max-w-md">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <div>
                    <h2 className="text-lg font-medium mb-4">All Received Invoices</h2>
                    <Separator className="mb-6" />
                    <InvoiceList refreshTrigger={refreshTrigger} setRefreshTrigger = {setRefreshTrigger} status="all" viewType="received" />
                  </div>
                </TabsContent>
                
                <TabsContent value="pending">
                  <div>
                    <h2 className="text-lg font-medium mb-4">Pending Approval</h2>
                    <Separator className="mb-6" />
                    <p className="text-sm text-muted-foreground mb-6">
                      These invoices are waiting for your approval.
                    </p>
                    <InvoiceList refreshTrigger={refreshTrigger} setRefreshTrigger = {setRefreshTrigger} status="pending" viewType="received" />
                  </div>
                </TabsContent>
                
                <TabsContent value="approved">
                  <div>
                    <h2 className="text-lg font-medium mb-4">Approved Invoices</h2>
                    <Separator className="mb-6" />
                    <p className="text-sm text-muted-foreground mb-6">
                      These invoices have been approved and are awaiting confirmation of receipt.
                    </p>
                    <InvoiceList refreshTrigger={refreshTrigger} setRefreshTrigger = {setRefreshTrigger} status="approved" viewType="received" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
};

export default Dashboard;
