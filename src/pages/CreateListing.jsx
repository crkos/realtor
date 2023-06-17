import {useState} from "react";
import Spinner from "../components/Spinner.jsx";
import {toast} from "react-toastify";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {getAuth} from "firebase/auth";
import {v4 as uuidv4} from "uuid";
import {serverTimestamp, addDoc, collection} from "firebase/firestore";
import {db} from "../firebase";
import {useNavigate} from "react-router";

const CreateListing = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [geolocationEnabled, setGeolocationEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: "sale",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: "",
        description: "",
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        latitude: 0,
        longitude: 0,
        images: {}
    });

    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        address,
        description,
        offer,
        regularPrice,
        discountedPrice,
        latitude,
        longitude,
        images,
    } = formData;

    function handleOnChange(e) {
        if (e.target.id === "type") {
            setFormData(prevState => ({...prevState, [e.target.id]: e.target.value}));
        } else if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
            const value = e.target.value === "true";
            setFormData(prevState => ({...prevState, [e.target.id]: value}));
        } else if (e.target.files) {
            setFormData(prevState => ({...prevState, [e.target.id]: e.target.files}));
        } else {
            setFormData(prevState => ({...prevState, [e.target.id]: e.target.value}));
        }
    }

    async function handleOnSubmit(e) {
        e.preventDefault();
        setLoading(true);
        if (discountedPrice >= regularPrice) {
            toast.error("Discounted price cannot be greater or equal than regular price");
            setLoading(false);
            return;
        }
        if (images.length > 6) {
            toast.error("You can only upload up to 6 images");
            setLoading(false);
            return;
        }
        let geolocation = {};
        let location;
        if (geolocationEnabled) {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${import.meta.env.VITE_REACT_API_GEOCODE_API_KEY}`);
            const data = await response.json();
            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

            location = data.status === "ZERO_RESULTS" && undefined;

            if (location === undefined) {
                setLoading(false);
                toast.error("Please enter a correct address");
                return;
            }
        } else {
            geolocation.lat = latitude;
            geolocation.lng = longitude;
        }

        async function storeImage(image) {
            return new Promise((resolve, reject) => {
                const storage = getStorage();
                const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
                const storageRef = ref(storage, filename);
                const uploadTask = uploadBytesResumable(storageRef, image);
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        // Handle unsuccessful uploads
                        reject(error);
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );
            });
        }

        const imgUrls = await Promise.all([...images].map((image) =>
            storeImage(image)
        )).catch(() => {
            setLoading(false);
            toast.error("Images not uploaded");
            return;
        });

        const formDataCopy = {
            ...formData,
            geolocation,
            imgUrls,
            timestamp: serverTimestamp(),
            userRef: auth.currentUser.uid
        };
        delete formDataCopy.images;
        delete formDataCopy.latitude;
        delete formDataCopy.longitude;
        !formDataCopy.offer ? delete formDataCopy.discountedPrice : null;
        const docRef = await addDoc(collection(db, "listings"), formDataCopy);
        setLoading(false);
        toast.success("Listing created successfully");
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    }


    if (loading) return (
        <Spinner/>);

    return (
        <main className="max-w-md px-2 mx-auto">
            <h1 className="text-3xl text-center mt-6 font-bold">Create Listing</h1>
            <form onSubmit={handleOnSubmit}>
                <p className="text-lg mt-6 font-semibold">Sell / Rent</p>
                <div className="flex space-x-6">
                    <button type="button" id="type" value="sale" onClick={handleOnChange}
                            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow:lg active:shadow-lg transition duration-200 ease-in-out w-full ${
                                type === "rent" ? "bg-white text-black" : "bg-slate-600 text-white"
                            }`}>Sell
                    </button>
                    <button type="button" id="type" value="rent" onClick={handleOnChange}
                            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow:lg active:shadow-lg transition duration-200 ease-in-out w-full ${
                                type === "sale" ? "bg-white text-black" : "bg-slate-600 text-white"
                            }`}>Rent
                    </button>
                </div>
                <p className="text-lg mt-6 font-semibold">Name</p>
                <input type="text" id="name" value={name} onChange={handleOnChange} placeholder="Property name"
                       maxLength="32"
                       minLength="10"
                       required
                       className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"/>
                <div className="flex space-x-6 mb-6">
                    <div>
                        <p className="text-lg font-semibold">Beds</p>
                        <input type="number" id="bedrooms" value={bedrooms} onChange={handleOnChange} min="1" max="50"
                               required
                               className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"/>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">Bathrooms</p>
                        <input type="number" id="bathrooms" value={bathrooms} onChange={handleOnChange} min="1" max="50"
                               required
                               className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"/>
                    </div>
                </div>
                <p className="text-lg mt-6 font-semibold">Parking spot</p>
                <div className="flex space-x-6">
                    <button type="button" id="parking" value={true} onClick={handleOnChange}
                            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow:lg active:shadow-lg transition duration-200 ease-in-out w-full ${
                                !parking ? "bg-white text-black" : "bg-slate-600 text-white"
                            }`}>Yes
                    </button>
                    <button type="button" id="parking" value={false} onClick={handleOnChange}
                            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow:lg active:shadow-lg transition duration-200 ease-in-out w-full ${
                                parking ? "bg-white text-black" : "bg-slate-600 text-white"
                            }`}>No
                    </button>
                </div>
                <p className="text-lg mt-6 font-semibold">Furnished</p>
                <div className="flex space-x-6">
                    <button type="button" id="furnished" value={true} onClick={handleOnChange}
                            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow:lg active:shadow-lg transition duration-200 ease-in-out w-full ${
                                !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
                            }`}>Yes
                    </button>
                    <button type="button" id="furnished" value={false} onClick={handleOnChange}
                            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow:lg active:shadow-lg transition duration-200 ease-in-out w-full ${
                                furnished ? "bg-white text-black" : "bg-slate-600 text-white"
                            }`}>No
                    </button>
                </div>
                <p className="text-lg mt-6 font-semibold">Address</p>
                <textarea id="address" value={address} onChange={handleOnChange} placeholder="Address"
                          required
                          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"/>
                {!geolocationEnabled ? (
                    <div className="flex space-x-6 mb-6">
                        <div>
                            <p className="text-lg font-semibold">Latitude</p>
                            <input type="number" id="latitude" value={latitude} onChange={handleOnChange}
                                   required
                                   min="-90"
                                   max="90"
                                   className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"/>
                        </div>
                        <div>
                            <p className="text-lg font-semibold">Longitude</p>
                            <input type="number" id="longitude" value={longitude} onChange={handleOnChange}
                                   required
                                   min="-180"
                                   max="180"
                                   className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"/>
                        </div>
                    </div>

                ) : null}
                <p className="text-lg font-semibold">Description</p>
                <textarea id="description" value={description} onChange={handleOnChange} placeholder="Description"
                          required
                          className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"/>
                <p className="text-lg font-semibold">Offer</p>
                <div className="flex space-x-6 mb-6">
                    <button type="button" id="offer" value={true} onClick={handleOnChange}
                            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow:lg active:shadow-lg transition duration-200 ease-in-out w-full ${
                                !offer ? "bg-white text-black" : "bg-slate-600 text-white"
                            }`}>Yes
                    </button>
                    <button type="button" id="offer" value={false} onClick={handleOnChange}
                            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow:lg active:shadow-lg transition duration-200 ease-in-out w-full ${
                                offer ? "bg-white text-black" : "bg-slate-600 text-white"
                            }`}>No
                    </button>
                </div>
                <div className="mb-6 flex items-center">
                    <div>
                        <p className="text-lg font-semibold">Regular price</p>
                        <div className="flex items-center justify-center space-x-6">
                            <input type="number" id="regularPrice" value={regularPrice} min="50" max="400000000"
                                   required
                                   className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
                                   onChange={handleOnChange}

                            />
                            {type === "rent" ?
                                <div><p className="text-md w-full whitespace-nowrap">$ / Month</p></div> : null}
                        </div>

                    </div>
                </div>
                {offer ?
                    <div className="mb-6 flex items-center">
                        <div>
                            <p className="text-lg font-semibold">Discounted price</p>
                            <div className="flex items-center justify-center space-x-6">
                                <input type="number" id="discountedPrice" value={discountedPrice} min="50"
                                       max="400000000"
                                       required={offer}
                                       className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
                                       onChange={handleOnChange}

                                />
                                {type === "rent" ?
                                    <div><p className="text-md w-full whitespace-nowrap">$ / Month</p></div> : null}
                            </div>

                        </div>
                    </div> : null}
                <div className="mb-6">
                    <p className="text-lg font-semibold">Images</p>
                    <p className="text-gray-600">The first image will be the cover (max 6)</p>
                    <input type="file" id="images" multiple onChange={handleOnChange} required
                           accept=".jpg,.png,.jpeg"
                           className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duratio-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
                    />
                </div>
                <button type="submit"
                        className="uppercase mb-6 w-full px-7 py-3 bg-blue-600 text-white text-center font-medium text-sm rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition
                        duration-200 ease-in-out">Create
                    listing
                </button>
            </form>
        </main>
    );
};

export default CreateListing;
