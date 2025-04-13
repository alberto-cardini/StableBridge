import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const approveInvoice = async (invoiceId: string) => {
    console.log("Approving invoice with ID:", invoiceId);
    const res = await axios.post(`${BASE_URL}/invoices/${invoiceId}/accept`);
    return res.data;
};

export const confirmPayment = async (invoiceId: string) => {
    console.log("Approving invoice with ID:", invoiceId);
    const res = await axios.post(`${BASE_URL}/invoices/${invoiceId}/pay`);
    return res.data;
};