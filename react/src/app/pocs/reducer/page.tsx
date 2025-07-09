'use client'

import { TodoList } from "./todo-list"




export default function Page() {
    return (
        <div className="">
            <h1 className="text-2xl font-bold">Reducer</h1>
            <p className="">This page demonstrates the use of a reducer in React.</p>
            <p className="">You can find the code in the <code>react/src/app/pocs/reducer</code> directory.</p>
            <p className="">This is a simple example to illustrate how to use reducers in React.</p>
            <TodoList />
        </div>
    )
}