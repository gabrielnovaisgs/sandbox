import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task } from "./task";

export function Collumn({ title, items }: { title: string; items: any[] }) {
    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">{title}</h2>

            <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">
                <SortableContext
                    items={items}
                    strategy={verticalListSortingStrategy}>
                    {items.map((item) => (
                        <Task key={item.id} task={item} />
                    ))}

                </SortableContext>
            </div>
        </div>
    );
}