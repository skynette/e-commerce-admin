import Navbar from "@/components/Navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from 'next/navigation'

interface LayoutProps {
    children: React.ReactNode;
    params: {
        storeId: string;
    };
}
export default async function DashboardLayout({ children, params }: LayoutProps) {

    const { userId } = auth()
    if (!userId) {
        redirect('/sign-in')
    }
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId
        }
    })

    if (!store) redirect('/')

    return (
        <>
            {/* expect server coponent */}
            <Navbar />
            {children}
        </>
    )
}
