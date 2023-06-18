import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Profile from "./pages/Profile.jsx";
import Offers from "./pages/Offers.jsx";
import Header from "./components/Header.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CreateListing from "./pages/CreateListing.jsx";
import EditListing from "./pages/EditListing.jsx";
import Listing from "./pages/Listing.jsx";

function App() {
    return (
        <>
            <Router>
                <Header/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/sign-in" element={<SignIn/>}/>
                    <Route path="/sign-up" element={<SignUp/>}/>
                    <Route path="/forgot-password" element={<ForgotPassword/>}/>
                    <Route path="/profile" element={<PrivateRoute/>}>
                        <Route path="/profile" element={<Profile/>}/>
                    </Route>
                    <Route path="/offers" element={<Offers/>}/>
                    <Route path="/create-listing" element={<PrivateRoute/>}>
                        <Route path="/create-listing" element={<CreateListing/>}/>
                    </Route>
                    <Route path="/edit-listing" element={<PrivateRoute/>}>
                        <Route path="/edit-listing/:listingId" element={<EditListing/>}/>
                    </Route>
                    <Route>
                        <Route path="category/:categoryName/:listingId" element={<Listing/>}/>
                    </Route>
                </Routes>
                <ToastContainer
                    position="bottom-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
            </Router>
        </>
    )
}

export default App
