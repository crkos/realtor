import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {db} from "../firebase.js";
import {doc, getDoc} from "firebase/firestore";
import Spinner from "../components/Spinner.jsx";
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore, {EffectFade, Pagination, Navigation, Autoplay} from 'swiper';
import 'swiper/css/bundle';

const Listing = () => {
    const params = useParams();
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
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
        </main>
    );
};

export default Listing;
