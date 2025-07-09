import { useState } from "react"

interface Item {
    id: string
    name: string
    checked: boolean
}
export function TodoList() {
    const [checkList, setCheckList] = useState<Item[]>([])
    const [newItem, setNewItem] = useState('')

    function handleAddItem() {
        if (checkList.find(item => item.id == newItem.trim())) {
            alert('Item already exists!')
            return
        }
        setCheckList([...checkList, { name: newItem, checked: false, id: newItem.trim() }])
    }

    function handleCheckItem(id: string) {
        setCheckList(checkList.map(item => {
            if (item.id === id) {
                item.checked = !item.checked

            }
            return item
        }))


    }

    function handleRemoveItem(id: string) {
        setCheckList(checkList.filter(item => item.id !== id))
    }
    return (
        <div className="bg-white text-black">
            <form onSubmit={(e) => { e.preventDefault() }}>
                <input className="" type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} />
                <button className="border border-black text-black" onClick={handleAddItem}>Add</button>
            </form>
            <ul>
                {checkList.map((item) => (
                    <li key={item.id}>

                        {item.name} -
                        <input type="checkbox" checked={item.checked} onChange={(e) => handleCheckItem(item.id)} />
                        <button onClick={() => handleRemoveItem(item.id)}>Delete</button>
                    </li>

                ))}
            </ul>
        </div>
    )
}