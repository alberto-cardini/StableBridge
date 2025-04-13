import { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { PlusCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const currencies = [
    { value: "RLUSD", label: "RLUSD - RippleNet USD" },
    { value: "RLEUR", label: "RLEUR - RippleNet EUR" },
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "JPY", label: "JPY - Japanese Yen" },
    { value: "AUD", label: "AUD - Australian Dollar" },
    { value: "CHF", label: "CHF - Swiss Franc" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
    { value: "CNY", label: "CNY - Chinese Yuan" }
];

const formSchema = z.object({
    invoiceId: z.string().min(1),
    name: z.string().min(1),
    buyerUsername: z.string().min(1),
    supplierWallet: z.string().min(1),
    buyerWallet: z.string().min(1),
    issueDate: z.string().min(1),
    dueDate: z.string().min(1),
    amount: z.string().min(1),
    currency: z.string().min(1),
    description: z.string().optional()
});

interface InvoiceFormProps {
    onInvoiceAdded: () => void;
}

export function InvoiceForm({ onInvoiceAdded }: InvoiceFormProps) {
    const [open, setOpen] = useState(false);
    const { user } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            invoiceId: "",
            name: "",
            buyerUsername: "",
            supplierWallet: user?.walletAddress || "",
            buyerWallet: "",
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: "",
            amount: "",
            currency: "RLUSD",
            description: ""
        }
    });

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("http://localhost:3000/invoices", {
                ...values,
                amount: parseFloat(values.amount),
                issueDate: new Date(values.issueDate),
                dueDate: new Date(values.dueDate)
            });

            toast.success("Invoice created!");
            form.reset();
            setOpen(false);
            onInvoiceAdded();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error("Failed to create invoice: " + (error.response?.data?.error || error.message));
            } else if (error instanceof Error) {
                toast.error("Unexpected error: " + error.message);
            } else {
                toast.error("Unknown error occurred");
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <PlusCircle size={16} />
                    <span>New Invoice</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add New Invoice</DialogTitle>
                    <DialogDescription>Enter invoice details below.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl><Input {...field} placeholder="e.g. Venenum" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="invoiceId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Invoice ID</FormLabel>
                                    <FormControl><Input {...field} placeholder="INV-0001" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="issueDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Issue Date</FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="dueDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Due Date</FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="amount" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl><Input type="number" step="0.01" min="0" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="currency" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Currency</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select currency" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {currencies.map((cur) => (
                                                <SelectItem key={cur.value} value={cur.value}>{cur.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Input {...field} placeholder="e.g. 50 bottiglie Venenum edizione limitata" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="buyerUsername" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Buyer Username</FormLabel>
                                <FormControl><Input {...field} placeholder="e.g. Mario" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="buyerWallet" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Buyer Wallet</FormLabel>
                                <FormControl><Input {...field} placeholder="rBUYER..." /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <DialogFooter>
                            <Button type="submit">Create Invoice</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}