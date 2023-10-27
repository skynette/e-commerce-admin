'use client'

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns } from "@/app/(dashboard)/[storeId]/(routes)/sizes/components/columns";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import APIList from "@/components/ui/api-list";
import { ColorColumn } from "./columns";



interface ColorsClientProps {
    data: ColorColumn[]
}

const ColorsClient = ({ data }: ColorsClientProps) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Colors (${data.length})`}
                    description="Manage colors for your store."
                />
                <Button
                    onClick={() => router.push(`/${params.storeId}/colors/new`)}
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
            <Heading title="API" description="API endpoints for colors (for Developers)" />
            <Separator />
            <APIList entityName="colors" entityIdName="colorId" />
        </>
    );
}

export default ColorsClient;