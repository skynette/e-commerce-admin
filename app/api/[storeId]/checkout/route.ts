import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"
import axios from "axios";

const SECRET_KEY = process.env.NEXT_PUBLIC_FLUTTERWAVE_SK

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS,DELETE,POST,PUT",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {


    const { productIds, customer } = await req.json()

    if (!productIds || productIds.length === 0) return new NextResponse('Missing productIds', { status: 400 })

    if (!customer || !customer.name || !customer.email) return new NextResponse('Missing customer details', { status: 400 })


    const products = await prismadb.product.findMany({
        where: {
            id: {
                in: productIds
            }
        }
    })
    const totalPrice = products.reduce((total, product) => total + Number(product.price), 0)

    const order = await prismadb.order.create({
        data: {
            storeId: params.storeId,
            isPaid: false,
            phone: customer.phone,
            address: customer.address,
            orderItems: {
                create: productIds.map((productId: string) => ({
                    product: {
                        connect: {
                            id: productId
                        }
                    }
                }))
            }
        }
    })

    const orderId = order.id
    const FRONT_END_URL = process.env.NEXT_PUBLIC_FRONTEND_URL
    // Constructing the payload
    const payload = {
        "tx_ref": orderId,
        "amount": totalPrice,
        "currency": "NGN",
        "redirect_url": `${FRONT_END_URL}/cart?success=1`,
        "meta": {
            "order_id": orderId,
            "store_id": params.storeId,
            "products": productIds
        },
        "customer": customer,
        "customizations": {
            "title": "Payment for items in cart",
            "logo": "https://images.unsplash.com/photo-1628527304948-06157ee3c8a6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    };
    console.log(payload);
    try {
        const response = await axios.post('https://api.flutterwave.com/v3/payments', payload, {
            headers: {
                'Authorization': SECRET_KEY,
                'Content-Type': 'application/json'
            }
        });

        const result = JSON.stringify(response.data);
        return new NextResponse(result, { headers: corsHeaders });

    } catch (error) {
        console.error(error);
        return new NextResponse("Error occurred", { headers: corsHeaders });
    }


}