import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { billboardId: string } }) {
    try {

        if (!params.billboardId) return new NextResponse("Billboard ID is required", { status: 400 })

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId
            },
        })
        return NextResponse.json(billboard)
    } catch (error) {
        console.log(`[BILLBOARD_GET]: ${error}`)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}


export async function PATCH(request: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {
        const { userId } = auth()
        const body = await request.json()

        const { label, imageUrl } = body

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        if (!label) return new NextResponse("label is required", { status: 400 })
        if (!imageUrl) return new NextResponse("imageUrl is required", { status: 400 })
        if (!params.billboardId) return new NextResponse("Billboard ID is required", { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                userId,
                id: params.storeId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 401 })

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        })

        return NextResponse.json(billboard)
    } catch (error) {
        console.log(`[BILLBOARD_PATCH]: ${error}`)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}


export async function DELETE(request: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        if (!params.billboardId) return new NextResponse("Billboard ID is required", { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                userId,
                id: params.storeId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 401 })


        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId
            },
        })
        return NextResponse.json(billboard)
    } catch (error) {
        console.log(`[BILLBOARD_DELETE]: ${error}`)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}