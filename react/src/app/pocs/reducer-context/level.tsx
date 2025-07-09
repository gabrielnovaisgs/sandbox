import { ReactNode } from "react";

export function Level({ children }: { children?: ReactNode }) {
    return (
        <div className="m-4 border-2 border-black p-4 bg-white">
            {children}
        </div>
    )
}