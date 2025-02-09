import { ModeToggle } from "@/components/ModeToggle"
import { ImageIcon } from "lucide-react"
import Sidebar from "./Sidebar"

export default function Header() {
    return (
        <header className="border-b">
            <div className="flex h-16 items-center px-4">
                <div className="flex items-center space-x-2">
                    <ImageIcon className="h-6 w-6" />
                    <span className="text-xl font-bold">
                        Image Captioning
                    </span>
                </div>
                <div className="ml-auto space-x-2">
                    <Sidebar />
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}

