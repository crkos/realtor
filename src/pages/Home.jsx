import Slider from "../components/Slider.jsx";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {collection, getDocs, limit, orderBy, query, where} from "firebase/firestore";
import {db} from "../firebase.js";
import {Link} from "react-router-dom";
import ListingItem from "../components/ListingItem.jsx";

const Home = () => {
    //Offers
    const [offerListings, setOfferListings] = useState(null);
    useEffect(() => {
        async function fetchListings() {
            try {
                //Get reference
                const listingRef = collection(db, "listings");
                //Create the query
                const q = query(listingRef, where("offer", "==", true), orderBy("timestamp", "desc"), limit(4));
                //Get the data
                const querySnapshot = await getDocs(q);
                const listings = [];
                querySnapshot.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });
                setOfferListings(listings);
            } catch (error) {
                toast.error("Error while fetching listings");
            }
        }

        fetchListings();
    }, [])

    //Rents
    const [rentListings, setRentListings] = useState(null);
    useEffect(() => {
        async function fetchListings() {
            try {
                //Get reference
                const listingRef = collection(db, "listings");
                //Create the query
                const q = query(listingRef, where("type", "==", "rent"), orderBy("timestamp", "desc"), limit(4));
                //Get the data
                const querySnapshot = await getDocs(q);
                const listings = [];
                querySnapshot.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });
                setRentListings(listings);
            } catch (error) {
                console.log(error);
            }
        }

        fetchListings();
    }, [])

    //Sales
    const [saleListings, setSaleListings] = useState(null);
    useEffect(() => {
        async function fetchListings() {
            try {
                //Get reference
                const listingRef = collection(db, "listings");
                //Create the query
                const q = query(listingRef, where("type", "==", "sale"), orderBy("timestamp", "desc"), limit(4));
                //Get the data
                const querySnapshot = await getDocs(q);
                const listings = [];
                querySnapshot.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });
                setSaleListings(listings);
            } catch (error) {
                console.log(error);
            }
        }

        fetchListings();
    }, [])

    return (
        <div>
            <Slider></Slider>
            <div className="max-w-6xl mx-auto pt-4 space-y-6">
                {offerListings && offerListings.length > 0 ? (
                    <div className="m-2 mb-6">
                        <h2 className="text-2xl px-3 mt-6 font-semibold">Recent offers</h2>
                        <Link to="/offers">
                            <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out">Show
                                more offers</p>
                        </Link>
                        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {offerListings.map((listing) => (
                                <ListingItem listing={listing.data} id={listing.id} key={listing.id}/>
                            ))}
                        </ul>

                    </div>
                ) : <></>}
                {rentListings && rentListings.length > 0 ? (
                    <div className="m-2 mb-6">
                        <h2 className="text-2xl px-3 mt-6 font-semibold">Places for rent</h2>
                        <Link to="/category/rent">
                            <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out">Show
                                more places for rent</p>
                        </Link>
                        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {rentListings.map((listing) => (
                                <ListingItem listing={listing.data} id={listing.id} key={listing.id}/>
                            ))}
                        </ul>

                    </div>
                ) : <></>}
                {saleListings && saleListings.length > 0 ? (
                    <div className="m-2 mb-6">
                        <h2 className="text-2xl px-3 mt-6 font-semibold">Places for sale</h2>
                        <Link to="/category/sale">
                            <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out">Show
                                more places for sale</p>
                        </Link>
                        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {saleListings.map((listing) => (
                                <ListingItem listing={listing.data} id={listing.id} key={listing.id}/>
                            ))}
                        </ul>

                    </div>
                ) : <></>}
            </div>
        </div>
    );
};

export default Home;
