import {Outlet, Navigate} from "react-router";
import useAuthStatus from "../hooks/useAuthStatus.jsx";
import Spinner from "./Spinner.jsx";

const PrivateRoute = () => {
    const {loggedIn, checkingStatus} = useAuthStatus();
    if (checkingStatus) return <Spinner/>
    return loggedIn ? <Outlet/> : <Navigate to="/sign-in"/>
};

export default PrivateRoute;
