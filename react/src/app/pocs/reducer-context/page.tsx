'use client';
import React, { useReducer, createContext, Dispatch } from "react";
import { Box } from "./box";
import { reducerController } from "./reducer-controller";


export const CountContext = createContext<{ countState: number, dispatch: Dispatch<any> }>({ countState: 0, dispatch: (() => { }) });
export default function Page() {
    const [count, dispatch] = useReducer(reducerController, 0)

    return (
        <CountContext.Provider value={{ countState: count, dispatch }}>
            <div className="">
                <h1 className="text-2xl font-bold">Reducer + Context API</h1>
                <p className="">This page demonstrates the use of a reducer and Context API in React.</p>
                <p className="">You can find the code in the <code>react/src/app/pocs/reducer-context</code> directory.</p>
                <p className="">This is a simple example to illustrate how to use reducers in React.</p>
                <Box />
            </div>
        </CountContext.Provider>
    )
}

