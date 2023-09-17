import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import SettingsForm from "./SettingsForm"

interface SettingsPageProps {
    params: {
        storeId: string
    }
}

export default async function SettingsPage({ params }: SettingsPageProps) {
    const { userId } = auth()
    if (!userId) redirect('/sign-in')

    const store = await prismadb.store.findFirst({
        where: {
            userId,
            id: params.storeId
        }
    })

    if (!store) redirect('/')

    return (
        <div className="flex flex-clol">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm initialData={store}/>
            </div>
        </div>
    )
}
