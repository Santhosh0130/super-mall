import React from "react";
import { Plus } from "lucide-react";

const FloatingActionButton = ({ onClick, isVisible }) => {
    if (!isVisible) return null;
    return (
        <button
            onClick={onClick}
            className="fixed bottom-20 right-5 md:bottom-8 md:right-8 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
            <Plus size={24} />
        </button>
    );
};

export default FloatingActionButton;
