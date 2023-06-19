import {useEffect, useState} from "react";
import {collection, getDocs, limit, orderBy, query} from "firebase/firestore";
import {db} from "../firebase.js";
import Spinner from "./Spinner.jsx";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore, {Navigation, Pagination, EffectFade, Autoplay} from "swiper";
import "swiper/css/bundle";
import {useNavigate} from "react-router";
import {priceFormatter} from "../utils/priceFormatter.js";

const Slider = () => {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    SwiperCore.use([Navigation, Pagination, EffectFade, Autoplay]);

    useEffect(() => {
        async function fetchListings() {
            const docRef = collection(db, "listings");
            const q = query(docRef, orderBy("timestamp", "desc"), limit(5));
            const querySnapshot = await getDocs(q);
            let listings = [];
            querySnapshot.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                });
            });
            setListings(listings);
            setLoading(false);
        }

        fetchListings();
    }, [])

    if (loading) return (
        <Spinner/>)

    if (listings.length === 0) return (<></>)
    return (listings &&
        <>
            <Swiper slidesPerView="1" navigation pagination={{type: "progressbar"}} effect="fade"
                    autoplay={{delay: 3000}}
                    modules={[EffectFade]}>
                {listings.map(({data, id}) => {
                    return <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                        <div style={{
                            background: `url(${data.imgUrls[0]}) center, no-repeat`,
                            backgroundSize: "cover",
                        }} className="relative w-full h-[300px] overflow-hidden">
                        </div>
                        <p className="absolute text-[#f1faee] left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl">{data.name}</p>
                        <p className="absolute text-[#f1faee] left-1 bottom-3 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl">
                            {priceFormatter.format(data.discountedPrice ?? data.regularPrice)}
                            {data.type === "rent" ? " / month" : null}
                        </p>
                    </SwiperSlide>
                })}
            </Swiper>
        </>
    );
};

export default Slider;
