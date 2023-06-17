import {useEffect, useState} from "react";
import {getAuth, updateProfile} from "firebase/auth";
import {useNavigate} from "react-router";
import {toast} from "react-toastify";
import {db} from "../firebase.js";
import {collection, doc, updateDoc, query, where, orderBy, getDocs} from "firebase/firestore";
import {FcHome} from "react-icons/fc";
import {Link} from "react-router-dom";
import ListingItem from "../components/ListingItem.jsx";

const Profile = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [changeDetail, setChangeDetail] = useState(false);
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
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
                toast.success("Name updated successfully");
            }
        } catch (e) {
            console.log(e)
            toast.error("Name could not be updated");
        }
    }

    useEffect(() => {
        async function fetchUserListings() {
            const listingRef = collection(db, "listings");
            const q = query(listingRef, where("userRef", "==", auth.currentUser.uid), orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);
            let listings = [];
            querySnapshot.forEach((doc) => {
                listings.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });
            setListings(listings);
            setLoading(false);

        }

        fetchUserListings();
    }, [auth.currentUser.uid])

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
                    <button type="submit"
                            className="bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800 w-full">
                        <Link to="/create-listing" className="flex items-center justify-center">
                            <FcHome className="mr-2 text-3xl bg-red-200 rounded-full p-1 border-2"/>
                            Sell or rent your home
                        </Link>
                    </button>
                </div>
            </section>
            <div className="max-w-6xl px-3 mt-6 mx-auto">
                {!loading && listings.length > 0 ? (
                    <>
                        <h2 className="text-2xl font-semibold text-center">My Listing</h2>
                        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6 ">
                            {listings.map((listing) => (
                                <ListingItem
                                    key={listing.id}
                                    listing={listing.data}
                                    id={listing.id}/>

                            ))
                            }
                        </ul>
                    </>
                ) : null}
            </div>
        </>
    );
};

export default Profile;
