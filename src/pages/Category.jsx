import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {collection, getDocs, limit, orderBy, query, where, startAfter} from "firebase/firestore";
import {db} from "../firebase.js";
import Spinner from "../components/Spinner.jsx";
import ListingItem from "../components/ListingItem.jsx";
import {useParams} from "react-router";

const Category = () => {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastFetchListing, setLastFetchListing] = useState(null);
    const params = useParams();

    useEffect(() => {
        async function fetchListings() {
            try {
                const listingRef = collection(db, "listings");
                const q = query(listingRef, where("type", "==", params.categoryName), orderBy("timestamp", "desc"), limit(8));
                const querySnapshot = await getDocs(q);
                const lastVisible = querySnapshot.docs[querySnapshot.size - 1];
                setLastFetchListing(lastVisible);
                const listings = [];
                querySnapshot.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });
                setListings(listings);
                console.log(listings)
                setLoading(false);
            } catch (error) {
                toast.error("Error while fetching listings");
            }
        }

        fetchListings();

    }, [params.categoryName])

    async function handleOnFetchMoreListings() {
        try {
            const listingRef = collection(db, "listings");
            const q = query(listingRef, where("type", "==", params.categoryName), orderBy("timestamp", "desc"), limit(4), startAfter(lastFetchListing));
            const querySnapshot = await getDocs(q);
            const lastVisible = querySnapshot.docs[querySnapshot.length - 1];
            setLastFetchListing(lastVisible);
            const listings = [];
            querySnapshot.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                });
            });
            setListings(prev => {
                return [...prev, ...listings]
            });
            setLoading(false);
        } catch (error) {
            toast.error("Error while fetching listings");
        }
    }


    return (
        <div className="max-w-6xl mx-auto px-3">
            <h1 className="text-3xl text-center mt-6 font-bold">{params.categoryName === "rent" ? "Places for rent" : "Places for sale"}</h1>
            {loading ? <Spinner/> : listings && listings.length > 0 ? (
                <>
                    <main>
                        <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            <>
                                {listings.map((listing) => (
                                    <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
                                ))}
                            </>
                        </ul>
                    </main>
                    {lastFetchListing && (
                        <div className="flex justify-center items-center">
                            <button
                                onClick={handleOnFetchMoreListings}
                                className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 transition duration-200 ease-in-out rounded">Load
                                more
                            </button>
                        </div>
                    )}
                </>
            ) : <p>There are no current offers</p>
            }
        </div>
    );
};

export default Category;
