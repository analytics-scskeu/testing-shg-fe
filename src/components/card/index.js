import React from "react";

const Card = ({ cardHeader, cardBody, label }) => {
    return (
        <div className="flex flex-col h-full min-h-[385px] md:min-h-[465px] mx-3 mb-8 relative bg-white shadow-lg shadow-gray-500/25 hover:shadow-xl transition duration-300 outline-2 outline-offset-[-2px] outline-transparent hover:outline-primary-shade3">
            {label && (
                <div className="absolute top-4 right-4 px-2 py-1 bg-[#EC6D74] text-white font-semibold text-xs">
                    {label}
                </div>
            )}
            {cardHeader && (
                <div className="overflow-hidden bg-container flex items-center justify-center">{cardHeader}</div>
            )}
            <div className="p-4 sm:p-8 flex flex-col grow">{cardBody}</div>
        </div>
    );
};

export default Card;
