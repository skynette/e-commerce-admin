'use client'

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ProductColumn, columns } from "./columns";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import APIList from "@/components/ui/api-list";

interface ProductClientProps {
    data: ProductColumn[]
}

const ProductClient = ({ data }: ProductClientProps) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Products (${data.length})`}
                    description="Manage your products here."
                />
                <Button
                    onClick={() => router.push(`/${params.storeId}/products/new`)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                </Button>
            </div>
            <Separator />
            <DataTable
                columns={columns}
                data={data}
                searchKey="label"
            />
            <Heading title="API" description="API endpoints for products (for Developers)"/>
            <Separator />
            <APIList entityName="products" entityIdName="prouctId" />
        </>
    );
}

export default ProductClient;