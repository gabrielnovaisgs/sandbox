"use client"
import { closestCorners, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, TouchSensor, useSensor } from "@dnd-kit/core";
import { useState } from "react";
import { Collumn } from "./collumn";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Link from "next/link";

export default function DragDropPage() {
    // Based on this video: 

    const [tasks, setTasks] = useState([{
        id: 1,
        title: "Task 1",
        completed: false
    }, {
        id: 2,
        title: "Task 2",
        completed: false
    }, {
        id: 3,
        title: "Task 3",
        completed: false
    }])

    function getTaskPosition(id: number) {
        return tasks.findIndex(task => task.id === id);
    }
    function handleDragEnd(event: DragEndEvent): void {
        const { active, over } = event;

        // If the item is dropped outside of a valid drop zone, do nothing
        if (!over) {
            return;
        }

        // If the item is dropped on itself, do nothing
        if (active.id === over.id) {
            return;
        }

        setTasks(tasks => {
            const originalPosition = getTaskPosition(active.id as number);
            const newPosition = getTaskPosition(over.id as number);

            // using the arrayMove utility from dnd-kit
            // create a new array with the tasks reordered
            return arrayMove(tasks, originalPosition, newPosition);
        });
        console.log("Tasks reordered:");
    }

    const sensors = [
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    ]

    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Todo List Drag and Drop</h1>
            <p className="text-gray-100">This page demonstrates a drag-and-drop todo list.</p>
            <p> Original video : <Link target="_blank" href={`https://www.youtube.com/watch?v=dL5SOdgMbRY`}> link</Link></p>
            <section className="w-full h-full dark:text-white">
                <h1>Todo app</h1>
                {/* All dragabble components must be inside this context */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragEnd={handleDragEnd}
                >
                    <Collumn title="Todo" items={tasks}></Collumn>

                </DndContext>
            </section>
        </div>
    );
} 