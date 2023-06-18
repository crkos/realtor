import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {db} from "../firebase.js";
import {doc, getDoc} from "firebase/firestore";
import Spinner from "../components/Spinner.jsx";
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore, {EffectFade, Pagination, Navigation, Autoplay} from 'swiper';
import 'swiper/css/bundle';
import {FaShare} from "react-icons/fa";

const Listing = () => {
    const params = useParams();
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    SwiperCore.use([EffectFade, Pagination, Navigation, Autoplay]);
    useEffect(() => {
        async function fetchListing() {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListings(docSnap.data());
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
                {listings.imgUrls.map((url, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <div className="w-full overflow-hidden h-[300px] relative"
                                 style={{
                                     background: `url(${listings.imgUrls[index]}) center no-repeat`,
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
        </main>
    );
};

export default Listing;
