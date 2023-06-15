import {FcGoogle} from "react-icons/fc";
import {toast} from "react-toastify";
import {getAuth} from "firebase/auth";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {doc, getDoc, serverTimestamp, setDoc} from "firebase/firestore";
import {db} from "../firebase.js";
import {useNavigate} from "react-router";

const OAuth = () => {
    const navigate = useNavigate();

    async function onGoogleClick() {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            //Check if user exists in database
            const userDoc = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDoc);
            if (!userDocSnap.exists()) {
                await setDoc(userDoc, {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp(),
                });
            }
            navigate("/");
        } catch (e) {
            toast.error("Could not be authenticated with Google");
        }
    }

    return (
        <button
            onClick={onGoogleClick}
            type="button"
            className="flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-lg active:shadow-xl transition duration-200 ease-in-out rounded">
            <FcGoogle className="text-lg bg-white rounded-full mr-2"/>Continue
            with
            Google</button>
    );
};

export default OAuth;
