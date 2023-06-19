import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {db} from "../firebase.js";
import {doc, getDoc} from "firebase/firestore";
import Spinner from "../components/Spinner.jsx";
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore, {EffectFade, Pagination, Navigation, Autoplay} from 'swiper';
import 'swiper/css/bundle';
import {FaShare, FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair} from "react-icons/fa";
import {priceFormatter} from "../utils/priceFormatter.js";
import {getAuth} from "firebase/auth";
import Contact from "../components/Contact.jsx";

const Listing = () => {
    const params = useParams();
    const auth = getAuth();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const [contactLandLord, setContactLandLord] = useState(false);
    SwiperCore.use([EffectFade, Pagination, Navigation, Autoplay]);
    useEffect(() => {
        async function fetchListing() {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListing(docSnap.data());
                setLoading(false);
            }
        }

        fetchListing();
    }, [params.listingId]);

    if (loading) return <Spinner/>;

    return (
        <main>
            <Swiper slidesPerView={1} navigation pagination={{type: "progressbar"}} effect="fade"
                    modules={[EffectFade]} autoplay={{delay: 3000}}>
                {listing.imgUrls.map((url, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <div className="w-full overflow-hidden h-[300px] relative"
                                 style={{
                                     background: `url(${url}) center no-repeat`,
                                     backgroundSize: 'cover'
                                 }}>

                            </div>
                        </SwiperSlide>
                    )
                })
                }
            </Swiper>
            <div
                className="top-[13%] right-[3%] fixed z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
                onClick={async () => {
                    await navigator.clipboard.writeText(window.location.href);
                    setShareLinkCopied(true);
                    setTimeout(() => {
                        setShareLinkCopied(false);
                    }, 2000);
                }}
            >
                <FaShare
                    className="text-lg text-slate-500"/>
            </div>
            {shareLinkCopied ? (
                <p className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2">Link
                    Copied!</p>
            ) : null}
            <div
                className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white md:space-x-3 lg:space-x-5">
                <div className="w-full">
                    <p className="text-2xl font-bold mb-3 text-blue-900">{listing.name} - {priceFormatter.format(listing.offer ? listing.discountedPrice : listing.regularPrice)} {listing.type === "rent" ? "/ month" : null}</p>
                    <p className="flex items-center mt-6 mb-3 font-semibold"><FaMapMarkerAlt
                        className="text-green-700 mr-1"/>{listing.address}</p>
                    <div className="flex justify-start items-center space-x-4 w-[75%]">
                        <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">{listing.type === "rent" ? "Rent" : "Sale"}</p>
                        <p className="w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md">{listing.offer ?
                            <span>
                                {priceFormatter.format(listing.regularPrice - listing.discountedPrice)} Discount
                            </span> : <p>{priceFormatter.format(listing.regularPrice)} </p>}
                        </p>
                    </div>
                    <p className="mb-3 mt-3 "><span className="font-semibold">Description - </span>{listing.description}
                    </p>
                    <ul className="flex items-center space-x-4 text-sm font-semibold sm:space-x-10">
                        <li className="flex items-center whitespace-nowrap">
                            <FaBed
                                className="mr-1 text-lg"/>{listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`}
                        </li>
                        <li className="flex items-center whitespace-nowrap">
                            <FaBath
                                className="mr-1 text-lg"/>{listing.bathrooms > 1 ? `${listing.bedrooms} Baths` : `${listing.bedrooms} Bath`}
                        </li>
                        <li className="flex items-center whitespace-nowrap">
                            <FaParking
                                className="mr-1 text-lg"/>{listing.parking ? "Parking spot" : "No parking"}
                        </li>
                        <li className="flex items-center whitespace-nowrap">
                            <FaChair
                                className="mr-1 text-lg"/>{listing.furnished ? "Furnished" : "Not furnished"}
                        </li>
                    </ul>
                    {listing.userRef !== auth.currentUser?.uid && !contactLandLord ? <div className="mt-6">
                        <button
                            className="px-7 py-2 bg-blue-600 text-white font-medium rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full text-center transition duration-200 ease-in-out"
                            onClick={() => setContactLandLord(true)}
                        >Contact
                            landlord
                        </button>
                    </div> : null}
                    {contactLandLord ? <Contact listing={listing} userRef={listing.userRef}/> : null}

                </div>
                <div className="bg-blue-300 w-full h-[200px] lg:h-[400px] overflow-x-hidden"></div>
            </div>
        </main>
    );
};

export default Listing;
