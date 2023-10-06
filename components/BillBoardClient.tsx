'use client'

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Heading } from "./ui/heading";
import { Separator } from "./ui/separator";
import { useParams, useRouter } from "next/navigation";

const BillBoardClient = () => {
    const router = useRouter();
    const params = useParams();
    
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title="Billboards (0)"
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
        </>
    );
}

export default BillBoardClient;