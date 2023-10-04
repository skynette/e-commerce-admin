import { UserButton, auth } from "@clerk/nextjs"
import { MainNav } from "@/components/MainNav"
import { redirect } from 'next/navigation'
import StoreSwitcher from "@/components/StoreSwitcher"
import prismadb from "@/lib/prismadb"
import ThemeToggle from "./ThemeToggle"

const Navbar = async () => {

    const { userId } = auth()
    if (!userId) redirect('/sign-in')

    const stores = await prismadb.store.findMany({
        where: {
            userId
        }
    })

    return (
        <div className="border-b ">
            <div className="flex h-16 items-center px-4">
                <StoreSwitcher items={stores} />
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-2">
                    <div className=''>
                        <ThemeToggle />
                    </div>
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </div>
    )
}

export default Navbar