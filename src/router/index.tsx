import {
    createBrowserRouter,
} from "react-router-dom";
import App from "../pages/app.tsx";
import Login from "../pages/login.tsx";
import AuthRoute from "../components/AuthRoute.tsx";
import '../scss/app.scss';
import GuestRoute from "../components/GuestRoute.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthRoute component={App}/>,
    },
    {
        path: "/login",
        element: <GuestRoute component={Login}/>,
    },
]);

export default router;
