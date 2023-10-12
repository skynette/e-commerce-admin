import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        // get the user id from clerk and the name from the request body
        const { userId } = auth()
        const body = await req.json()

        const { name, billboardId } = body

        // check if the user id name and billboardId are present
        if (!userId) return new NextResponse("Unauthenticated!", { status: 401 })
        if (!name) return new NextResponse("Missing name!", { status: 400 })
        if (!billboardId) return new NextResponse("Missing billboardId!", { status: 400 })

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
        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(category)
    } catch (error) {
        console.log(`[CATEGORIES_POST] ${error}`)
        return new NextResponse("Internal Error", { status: 500 })
    }
}


export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        if (!params.storeId) return new NextResponse("Missing storeId", { status: 400 })


        // get the category
        const category = await prismadb.category.findMany({
            where: {
                storeId: params.storeId
            }
        })

        return NextResponse.json(category)
    } catch (error) {
        console.log(`[CATEGORIES_GET] ${error}`)
        return new NextResponse("Internal Error", { status: 500 })
    }
}