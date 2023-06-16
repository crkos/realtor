import {Outlet, Navigate} from "react-router";
import useAuthStatus from "../hooks/useAuthStatus.jsx";

const PrivateRoute = () => {
    const {loggedIn, checkingStatus} = useAuthStatus();
    if (checkingStatus) return <p>Loading</p>
    return loggedIn ? <Outlet/> : <Navigate to="/sign-in"/>
};

export default PrivateRoute;
