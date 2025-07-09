'use client'
import { useContext, useReducer } from "react"
import { reducerController } from "./reducer-controller"
import { CountContext } from "./page"

export function Controller() {
    const { dispatch } = useContext(CountContext)

    function handleIncrement() {
        dispatch('increment')
    }
    function handleDecrement() {
        dispatch('decrement')
    }
    return (
        <div className="text-black ">
            <h1 className="text-2xl font-bold">Controller</h1>
            <div className="flex flex-row gap-2">

                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                    onClick={handleIncrement}
                >
                    Increment
                </button>
                <button
                    onClick={handleDecrement}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer">
                    Decrement
                </button>
            </div>
        </div>
    )
}