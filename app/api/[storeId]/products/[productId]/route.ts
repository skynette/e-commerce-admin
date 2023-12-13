import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { productId: string } }) {
    try {

        if (!params.productId) return new NextResponse("Prodcut ID is required", { status: 400 })

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true,
            }
        })
        return NextResponse.json(product)
    } catch (error) {
        console.log(`[PRODUCT_GET]: ${error}`)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}


export async function PATCH(request: Request, { params }: { params: { storeId: string, productId: string } }) {
    try {
        const { userId } = auth()
        const body = await request.json()

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
        if (!params.productId) return new NextResponse("Product ID is required", { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                userId,
                id: params.storeId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }

        await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany: {},
                },
                isFeatured,
                isArchived,
            },
        });

        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image),
                        ],
                    },
                },
            },
        })

        return NextResponse.json(product)
    } catch (error) {
        console.log(`[PRODUCT_PATCH]: ${error}`)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}


export async function DELETE(request: Request, { params }: { params: { storeId: string, productId: string } }) {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        if (!params.productId) return new NextResponse("Product ID is required", { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                userId,
                id: params.storeId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 401 })


        const product = await prismadb.product.delete({
            where: {
                id: params.productId
            },
        })
        return NextResponse.json(product)
    } catch (error) {
        console.log(`[PRODUCT_DELETE]: ${error}`)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}