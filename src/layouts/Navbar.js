"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function Navbar({ toggleSidebar }) {
    return (
        <nav className="flex justify-between border-b border-secondary-shade2 py-3">
            <button
                type={"button"}
                onClick={toggleSidebar}
                className="flex items-center justify-center focus:outline-none transition duration-300 ease-in-out"
            >
                <FontAwesomeIcon icon={faBars} className="h-4 w-4 text-primary-shade1 ml-2 px-2 py-2" />
            </button>
        </nav>
    );
}
