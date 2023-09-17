import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function SetupPage() {
    return (
        <div className="p-10">
            <p>This is a protected route</p>
            <UserButton afterSignOutUrl="/"/>
        </div>
    )
}
