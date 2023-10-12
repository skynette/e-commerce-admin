'use client'

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns } from "@/app/(dashboard)/[storeId]/(routes)/categories/components/columns";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import APIList from "@/components/ui/api-list";
import { CategoryColumn } from "./columns";



interface CategoryClientProps {
    data: CategoryColumn[]
}

const CategoryClient = ({ data }: CategoryClientProps) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Categories (${data.length})`}
                    description="Manage your categories here."
                />
                <Button
                    onClick={() => router.push(`/${params.storeId}/categories/new`)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable
                columns={columns}
                data={data}
                searchKey="name"
            />
            <Heading title="API" description="API endpoints for categories (for Developers)" />
            <Separator />
            <APIList entityName="categories" entityIdName="categoryId" />
        </>
    );
}

export default CategoryClient;