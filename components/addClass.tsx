"use client";
import { useState } from "react";

interface AddClassProps {
    onAddClass: (className: string) => void;
}

export const AddClass = ({ onAddClass }: AddClassProps) => {
    const [newClassName, setNewClassName] = useState("");

    return (
        <div className="mt-6 flex justify-center gap-4">
            <input
                type="text"
                placeholder="Enter class name"
                className="w-full px-4 py-2 border rounded-lg"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
            />
            <button
                className="w-2xs bg-blue-500 px-6 py-2 rounded-lg text-white"
                onClick={() => {
                    if (newClassName) {
                        onAddClass(newClassName);
                        setNewClassName("");
                    }
                }}
            >
                Add Class
            </button>
        </div>
    );
};
