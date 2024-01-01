import prismadb from "@/lib/prismadb";
import axios from "axios";


const SECRET_KEY = process.env.NEXT_PUBLIC_FLUTTERWAVE_SK

export async function GET(req: Request) {
    const reqUrl = new URL(req.url || '', 'http://www.example.com');
    const queryParams = Object.fromEntries(reqUrl.searchParams);

    // Access the individual query parameters
    const { tx_ref, transaction_id, status } = queryParams;

    if (status === 'successful') {
        try {
            const order = await prismadb.order.findUnique({
                where: {
                    id: tx_ref
                }
            });
            const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`
            const headers = {
                'Authorization': SECRET_KEY,
                'Content-Type': 'application/json'
            }
            const response = await axios.get(url, { headers });

            if (response.data.status === 'success') {
                await prismadb.order.update({
                    where: {
                        id: order?.id
                    },
                    data: {
                        isPaid: true
                    }
                });
                return new Response('Payment successful', { status: 200 });
            } else {
                // Inform the customer their payment was unsuccessful
                return new Response('Payment unsuccessful', { status: 400 });
            }
        } catch (error) {
            // Handle any errors that occur during the process
            console.error('Error:', error);
            return new Response('An error occurred', { status: 500 });
        }
    } else {
        return new Response('Payment unsuccessful', { status: 400 });
    }
}