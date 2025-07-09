import { useContext } from "react"
import { CountContext } from "./page"

export function Counter() {
    const { countState } = useContext(CountContext)
    return (
        <div className="text-black">
            <h2 className="text-xl font-bold">Counter</h2>
            <p className="">{countState}</p>
        </div>
    )
}