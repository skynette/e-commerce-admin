import { format } from "date-fns"
import BillBoardClient from "@/components/BillBoardClient";
import prismadb from "@/lib/prismadb";
import { BillBoardColumn } from "./components/columns";

const BillBoardsPage = async ({ params }: { params: { storeId: string } }) => {
    // fetch billboards for this store
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedBillboard: BillBoardColumn[] = billboards.map((item) => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMM do, yyyy"),
    }))

    return (<div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <BillBoardClient data={formattedBillboard} />
        </div>
    </div>);
}

export default BillBoardsPage;