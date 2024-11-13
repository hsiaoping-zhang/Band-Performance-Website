import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Home from "./pages/Home";
import NewActivity from "./pages/NewActivity";
import UpdateActivity from "./pages/UpdateActivity";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Navbars from "./componenet/Navbar";
// import { UserContext } from "./Context";
import ApplicationLogin from "./pages/ApplicationLogin";
import ApplySuccess from "./pages/ApplySuccess";
import Login from "./pages/Login";
import PerformerListPage from "./pages/PerformerList";
import ActivityListPage from "./pages/ActivityList";
import ApproveUser from "./pages/ApproveUser";
import PerformerActivity from "./pages/PerfomerActivity";

const root = ReactDOM.createRoot(document.querySelector("#application")!);
// SetToken("permission", "guest")
// const user = { login: true, permission: ["Admin"] };
export enum PermissionCode {
    Guest = "guest",
    User = "user",
    Admin = "admin"
};

export let CurrentUser = {
    name: null,
    permission: PermissionCode.Guest
}

// { name: "guest", loggedIn: false, permission: "false" }

function App() {
    const [user, setUser] = useState({ name: "~" })

    return (<div>
        {/* <UserContext.Provider value={{ user, setUser }}> */}
            <Navbars></Navbars>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/apply" element={<ApplicationLogin />} />
                    <Route path="/applySuccess" element={<ApplySuccess />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/performerActivity" element={<PerformerActivity />}/>
                    <Route path="/newActivity" element={<NewActivity />} />
                    {/* <Route element={<ProtectedRoutes permissions={[PermissionCode.Admin, PermissionCode.User]}/>}>
                        <Route path="/performerList" element={<PerformerListPage/>} />
                    </Route> */}

                    <Route element={<ProtectedRoutes permissions={[PermissionCode.Admin]}/>}>
                        
                        <Route path="/performerList" element={<PerformerListPage/>} />
                        <Route path="/activityList" element={<ActivityListPage/>} />
                        <Route path="/updateActivity/:activity_id" element={<UpdateActivity />} />
                        <Route path="/approveUser" element={<ApproveUser />}/>
                    </Route>
                    {/* <Route path="/updateActivity" element={<UpdateActivity />}/> */}
                </Routes>
            </BrowserRouter>
        {/* </UserContext.Provider> */}

    </div>)
}

root.render(
    <App></App>
);
