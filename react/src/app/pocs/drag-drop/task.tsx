import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function Task({ task }: { task: { id: number; title: string; completed: boolean } }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };
    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className="p-2 bg-white dark:bg-gray-700 rounded-lg mb-2">
            <input
                type="checkbox"
                checked={task.completed}
                onChange={() => { }}
                className="mr-2"
            />
            {task.title}
        </div>
    );
}