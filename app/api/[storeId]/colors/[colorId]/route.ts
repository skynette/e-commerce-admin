import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { colorId: string } }) {
    try {

        if (!params.colorId) return new NextResponse("Color ID is required", { status: 400 })

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId
            },
        })
        return NextResponse.json(color)
    } catch (error) {
        console.log(`[COLOR_GET]: ${error}`)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}


export async function PATCH(request: Request, { params }: { params: { storeId: string, colorId: string } }) {
    try {
        const { userId } = auth()
        const body = await request.json()
        const { name, value } = body

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        if (!name) return new NextResponse("name is required", { status: 400 })
        if (!value) return new NextResponse("value is required", { status: 400 })
        if (!params.colorId) return new NextResponse("Color ID is required", { status: 400 })

        console.log('passed checks')
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                userId,
                id: params.storeId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 401 })

        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value
            }
        })
        return NextResponse.json(color)
    } catch (error) {
        console.log(`[COLOR_PATCH]: ${error}`)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}


export async function DELETE(request: Request, { params }: { params: { storeId: string, colorId: string } }) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        if (!params.colorId) return new NextResponse("Color ID is required", { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                userId,
                id: params.storeId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 401 })


        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId
            },
        })
        return NextResponse.json(color)
    } catch (error) {
        console.log(`[COLOR_DELETE]: ${error}`)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}