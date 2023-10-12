'use client'

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Heading } from "./ui/heading";
import { Separator } from "./ui/separator";
import { useParams, useRouter } from "next/navigation";
import { BillBoardColumn, columns } from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/columns";
import { DataTable } from "./ui/data-table";
import APIList from "./ui/api-list";

interface BillBoardClientProps {
    data: BillBoardColumn[]
}

const BillBoardClient = ({ data }: BillBoardClientProps) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Billboards (${data.length})`}
                    description="Manage your billboards here."
                />
                <Button
                    onClick={() => router.push(`/${params.storeId}/billboards/new`)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Billboard
                </Button>
            </div>
            <Separator />
            <DataTable
                columns={columns}
                data={data}
                searchKey="label"
            />
            <Heading title="API" description="API endpoints for billboards (for Developers)"/>
            <Separator />
            <APIList entityName="billboards" entityIdName="billboardId" />
        </>
    );
}

export default BillBoardClient;