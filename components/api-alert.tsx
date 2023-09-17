'use client'

import { Copy, Server } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Badge, BadgeProps } from "./ui/badge"
import { Button } from "./ui/button"
import { toast } from "react-hot-toast"
import { cn } from "@/lib/utils"

interface ApiAlertProps {
    title: string,
    description: string,
    variant: 'public' | 'admin'
}

const textMap: Record<ApiAlertProps['variant'], string> = {
    public: "Public",
    admin: "Admin"
}

const variantMap: Record<ApiAlertProps['variant'], BadgeProps["variant"]> = {
    public: "secondary",
    admin: "destructive"
}

export const ApiAlert: React.FC<ApiAlertProps> = ({ title, description, variant }) => {
    const onCopy = () => {
        navigator.clipboard.writeText(description)
        toast.success('Api route copied to clipboard.')
    }
    return (
        <Alert>
            <Server className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-x-2">
                {title}
                <Badge
                    variant={variantMap[variant]}
                    className={
                        cn('bg-green-400 text-white hover:bg-green-500 hover:cursor-pointer', textMap[variant] === "Admin" && 'bg-blue-400 hover:bg-blue-500')}
                >
                    {textMap[variant]}
                </Badge>
            </AlertTitle>
            <AlertDescription className="mt-4 flex items-center justify-between">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    {description}
                </code>
                <Button variant={'outline'} size={'icon'} onClick={onCopy}>
                    <Copy className="h-4 w-4" />
                </Button>
            </AlertDescription>
        </Alert>
    )
}