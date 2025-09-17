import React from "react";
import { NavData } from "./navData";
import NavBar from "./NavBar.jsx";

function MainNav() {
    return (
        <nav className="w-full border-b bg-white z-50">
            <div className="container mx-auto py-3">
                <NavBar items={NavData} />
            </div>
        </nav>
    );
}

export default MainNav;