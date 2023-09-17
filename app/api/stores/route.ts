import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        // get the user id from clerk and the name from the request body
        const { userId } = auth()
        const body = await req.json()
        console.log({ body })
        const { name } = body

        // check if the user id and name are present
        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        if (!name) return new NextResponse("Missing name", { status: 400 })

        // create the store
        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        })

        return NextResponse.json(store)
    } catch (error) {
        console.log(`[STOES_POST] ${error}`)
        return new NextResponse("Internal Error", { status: 500 })
    }
}