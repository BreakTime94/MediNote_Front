import SiteHeader from "../components/common/header/SiteHeader.jsx";
import MainNav from "../components/common/nav/MainNav.jsx";
import {Outlet} from "react-router-dom";
import SiteFooter from "../components/common/footer/SiteFooter.jsx";

export default function RootLayout() {
    return (
        <div>
            <header>
                <SiteHeader/>
                <MainNav/>
            </header>

            <main>
                <Outlet/>
            </main>

            <footer>
                <SiteFooter/>
            </footer>
        </div>
    );
}