import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        // get the user id from clerk and the name from the request body
        const { userId } = auth()
        const body = await req.json()

        const { label, imageUrl } = body

        // check if the user id name and imageUrl are present
        if (!userId) return new NextResponse("Unauthenticated!", { status: 401 })
        if (!label) return new NextResponse("Missing label!", { status: 400 })
        if (!imageUrl) return new NextResponse("Missing imageUrl!", { status: 400 })

        if (!params.storeId) return new NextResponse("Missing storeId!", { status: 400 })

        // find the store for the current uid
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                userId,
                id: params.storeId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 401 })

        // create the billboard
        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        })

        return NextResponse.json(billboard)
    } catch (error) {
        console.log(`[BILLBOARDS_POST] ${error}`)
        return new NextResponse("Internal Error", { status: 500 })
    }
}


export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        if (!params.storeId) return new NextResponse("Missing storeId", { status: 400 })


        // get the billboard
        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(billboards)
    } catch (error) {
        console.log(`[BILLBOARDS_GET] ${error}`)
        return new NextResponse("Internal Error", { status: 500 })
    }
}