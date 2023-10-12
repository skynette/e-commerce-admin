import prismadb from '@/lib/prismadb'
import React from 'react'
import SizeForm from './size-form'

const SizePage = async ({ params }: { params: { sizeId: string, storeId: string } }) => {
    const Size = await prismadb.size.findUnique({
        where: {
            id: params.sizeId
        }
    })
    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId
        }
    })
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeForm initialData={Size}/>
            </div>
        </div>
    )
}

export default SizePage