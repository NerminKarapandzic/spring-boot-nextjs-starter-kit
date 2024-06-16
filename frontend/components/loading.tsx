import { Icons } from "./icons";


export default function Loading() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <Icons.spinner className="mr-2 h-36 w-36"/>
        </div>
    )
}