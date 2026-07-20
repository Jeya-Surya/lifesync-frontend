import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import {Outlet} from "react-router-dom";

const Layout = ({topbarProps}) => {
    return (
        <div className="flex min-h-screen bg-surface-3">

            {/* Fixed sidebar on the left */}
            <Sidebar />

            {/* Main content — pushed right by sidebar width */}
            <div className="flex-1 flex flex-col ml-52">

                {/* Sticky topbar */}
                <Topbar {...topbarProps} />

                {/* Page content scrolls here */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}

export default Layout;