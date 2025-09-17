import AppHeader from "../components/common/layout/AppHeader.jsx";
import AppNav from "../components/common/layout/AppNav.jsx";
import {Outlet} from "react-router-dom";
import AppFooter from "../components/common/layout/AppFooter.jsx";

export default function RootLayout() {
    return (
        <div>
            <header>
                <AppHeader/>
                <AppNav/>
            </header>

            <main>
                <Outlet/>
            </main>

            <footer>
                <AppFooter/>
            </footer>
        </div>
    );
}