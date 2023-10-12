import { format } from "date-fns"
import prismadb from "@/lib/prismadb";
import { CategoryColumn } from "./components/columns";
import CategoryClient from "./components/client";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
    // fetch categories for this store
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId
        },
        include:{
            billboard: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedCategory: CategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: format(item.createdAt, "MMM do, yyyy"),
    }))

    return (<div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryClient data={formattedCategory} />
        </div>
    </div>);
}

export default CategoriesPage;