import { useReducer, useState } from "react"

interface Item {
    id: string
    name: string
    checked: boolean
}
enum ListActionType {
    Add = "ADD",
    Remove = "REMOVE",
    Toggle = "TOGGLE"
}
type ListAction =
    | { type: ListActionType.Add; payload: Item }
    | { type: ListActionType.Remove; payload: { id: string } }
    | { type: ListActionType.Toggle; payload: { id: string } }

function todoListReducer(oldCheckList: Item[], action: ListAction): Item[] {
    switch (action.type) {
        case ListActionType.Add: {
            const name = action.payload.name
            if (oldCheckList.find(item => item.id == name.trim())) {
                alert('Item already exists!')
                break
            }
            return [...oldCheckList, { name: name, checked: false, id: name.trim() }]

        }

        case ListActionType.Remove: {
            return oldCheckList.filter(item => item.id !== action.payload.id)

        }
        case ListActionType.Toggle: {
            return oldCheckList.map(item => {
                if (item.id === action.payload.id) {
                    return { ...item, checked: !item.checked }
                }
                return item
            })
        }
        default: {
            throw Error('Unknown action: ' + action);
        }
    }
    return oldCheckList
}

export function TodoListReducer() {
    const [itemsList, dispach] = useReducer(todoListReducer, [])

    const [newItem, setNewItem] = useState('')

    function handleAddItem() {
        const newItemAdd = { name: newItem, checked: false, id: newItem.trim() }
        dispach({
            type: ListActionType.Add,
            payload: newItemAdd
        })
    }

    function handleCheckItem(id: string) {
        dispach({
            type: ListActionType.Toggle,
            payload: { id }
        })
    }

    function handleRemoveItem(id: string) {
        dispach({
            type: ListActionType.Remove,
            payload: { id }
        })
    }
    return (
        <div className="bg-white text-black">
            <form onSubmit={(e) => { e.preventDefault() }}>
                <input className="" type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} />
                <button className="border border-black text-black" onClick={handleAddItem}>Add</button>
            </form>
            <ul>
                {itemsList.map((item) => (
                    <li key={item.id}>

                        {item.name} -
                        <input type="checkbox" checked={item.checked} onChange={() => handleCheckItem(item.id)} />
                        <button onClick={() => handleRemoveItem(item.id)}>Delete</button>
                    </li>

                ))}
            </ul>
        </div>
    )
}
