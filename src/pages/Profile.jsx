import {useState} from "react";
import {getAuth, updateProfile} from "firebase/auth";
import {useNavigate} from "react-router";
import {toast} from "react-toastify";
import {db} from "../firebase.js";
import {doc, updateDoc} from "firebase/firestore";

const Profile = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [changeDetail, setChangeDetail] = useState(false);
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });
    const {name, email} = formData;

    async function handleOnLogout() {
        await auth.signOut();
        navigate("/");
    }

    function handleOnChange(e) {
        setFormData(prevState => ({...prevState, [e.target.id]: e.target.value}));
    }

    async function handleOnSubmit() {
        try {
            if (auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, {
                    displayName: name,
                });
                const docRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(docRef, {
                    name: name,
                });
            }
            toast.success("Name updated successfully");
        } catch (e) {
            console.log(e)
            toast.error("Name could not be updated");
        }
    }

    return (
        <>
            <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
                <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
                <div className="w-full md:w-[66%] lg:w-[50%] mt-6 px-3">
                    <form>
                        {/*Name input*/}
                        <input type="text" id="name" value={name} disabled={!changeDetail} onChange={handleOnChange}
                               className={`w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out mb-6 ${changeDetail ? 'bg-red-200 focus:bg-red-200' : ''}`}/>
                        {/*Email input*/}
                        <input type="email" id="email" value={email} disabled
                               className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out mb-6"/>
                        <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
                            <p className="flex items-center">Do you want to change your name? <span
                                className="text-red-600 hover:text-red-700 cursor-pointer transition duration-200 ease-in-out ml-1"
                                onClick={async () => {
                                    changeDetail ? await handleOnSubmit() : null;
                                    setChangeDetail(prevState => !prevState);
                                }}>{changeDetail ? "Apply change" : "Edit"}</span>
                            </p>
                            <p className="text-blue-600 hover:text-blue-800 cursor-pointer transition duration-200 ease-in-out"
                               onClick={handleOnLogout}>Sign
                                out</p>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Profile;
