import {useEffect, useState} from "react";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase.js";
import PropTypes from "prop-types";
import {toast} from "react-toastify";

const Contact = ({userRef, listing}) => {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");

    function handleOnMessageChange(e) {
        setMessage(e.target.value);
    }

    useEffect(() => {
        async function getLandlord() {
            const landlord = doc(db, "users", userRef);
            const docSnap = await getDoc(landlord);
            if (docSnap.exists()) {
                setLandlord(docSnap.data());
            } else {
                toast.error("Landlord not found");
            }
        }

        getLandlord();
    }, [userRef])

    return (
        <div>
            {landlord !== null ? (
                <div className="flex flex-col w-full">
                    <p className="mt-6">Contact {landlord.name} for the {listing.name.toLowerCase()}</p>
                    <div className="mt-3 mb-6">
                        <textarea
                            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focust:text-gray-700 focus:bg-white focus:border-slate-600"
                            name="message"
                            id="message"
                            rows="2"
                            value={message}
                            onChange={handleOnMessageChange}>

                        </textarea>
                    </div>
                    <a href={`mailto:${landlord.email}?subject=${listing.name}&body=${message}`}>
                        <button type="button"
                                className="px-7 mb-6 py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-xl transition duration-200 ease-in-out w-full text-center">Send
                            message
                        </button>
                    </a>
                </div>
            ) : null}
        </div>
    );
};

Contact.propTypes = {
    userRef: PropTypes.string,
    listing: PropTypes.object
}

export default Contact;
