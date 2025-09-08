"use client";
import { useState } from "react";
import { Button } from "./form";

const Tabs = ({ tabs = [], defaultActiveTab = "" }) => {
    const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.key);

    return (
        <div className="w-full p-4 lg:p-6 relative pt-12">
            {/* Tab headers */}
            <div className="flex border-b border-gray-200 space-x-6 max-lg:w-full max-lg:overflow-x-auto max-lg:absolute max-lg:top-0 max-w-fit">
                {tabs.map((tab) => (
                    <Button
                        styling="clean"
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center py-2 md:px-12 border-b-3 border-transparent transition-colors text-sm md:text-lg min-w-fit ${
                            activeTab === tab.key
                                ? "!border-link text-link font-bold"
                                : "text-shade1 hover:text-link font-medium"
                        }`}
                    >
                        {tab.icon && <span className="mr-1">{tab.icon}</span>}
                        {tab.label}
                    </Button>
                ))}
            </div>

            {/* Tab content */}
            <div className="pt-4">{tabs.find((t) => t.key === activeTab)?.content}</div>
        </div>
    );
};

export default Tabs;
