import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        // get the user id from clerk and the name from the request body
        const { userId } = auth()
        const body = await req.json()

        const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } = body

        // check if the user id name and imageUrl are present
        if (!userId) return new NextResponse("Unauthenticated!", { status: 401 })
        if (!name) return new NextResponse("Missing name!", { status: 400 })
        if (!price) return new NextResponse("Missing price!", { status: 400 })
        if (!categoryId) return new NextResponse("Missing categoryId!", { status: 400 })
        if (!images || !images.length) return new NextResponse("Missing images!", { status: 400 })
        if (!sizeId) return new NextResponse("Missing sizeId!", { status: 400 })
        if (!colorId) return new NextResponse("Missing colorId!", { status: 400 })

        if (!params.storeId) return new NextResponse("Missing storeId!", { status: 400 })

        // find the store for the current uid
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                userId,
                id: params.storeId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 401 })

        // create the product
        const product = await prismadb.product.create({
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                },
                isFeatured,
                isArchived,
                storeId: params.storeId
            }
        })

        return NextResponse.json(product)
    } catch (error) {
        console.log(`[PRODUCTS_POST] ${error}`)
        return new NextResponse("Internal Error", { status: 500 })
    }
}


export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get("categoryId") || undefined
        const colorId = searchParams.get("colorId") || undefined
        const sizeId = searchParams.get("sizeId") || undefined
        const isFeatured = searchParams.get("isFeatured")

        if (!params.storeId) return new NextResponse("Missing storeId", { status: 400 })


        // get the product
        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured === "true" ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json(products)
    } catch (error) {
        console.log(`[PRODUCTS_GET] ${error}`)
        return new NextResponse("Internal Error", { status: 500 })
    }
}