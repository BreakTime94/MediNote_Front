
import React from "react";
import { NavData } from "./navData";
import NavBar from "./NavBar.jsx";

function MainNav() {
    return (
        <nav className="w-full border-b bg-white shadow-sm z-50 sticky top-0">
            <div className="container mx-auto">
                <NavBar
                    items={NavData}
                    align="center"
                    className="min-h-[60px]"
                />
            </div>
        </nav>
    );
}

export default MainNav;