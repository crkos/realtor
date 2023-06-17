import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {formatDistance} from "date-fns";
import {Timestamp} from "firebase/firestore";
import {MdLocationOn} from "react-icons/md";
import {priceFormatter} from "../utils/priceFormatter.js";


const ListingItem = ({listing, id}) => {
    const t = Timestamp.fromDate(new Date());
    const d = t.toDate();
    return (
        <li className="bg-white flex flex-col justify-between items-center shadow-md hover:shadow-lg rounded-md overflow-hidden transition-shadow duration-200 relative m-[10px]">
            <Link className="contents" to={`/category/${listing.type}/${id}`}>
                <img src={listing.imgUrls[0]} alt="House"
                     className="h-[170px] w-full object-cover hover:scale-105 transition duration-200 ease-in"
                     loading="lazy"/>
                <p className="absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg">{formatDistance(listing.timestamp?.toDate(), d, {addSuffix: false})}</p>
                <div className="w-full p-[10px]">
                    <div className="flex items-center space-x-1">
                        <MdLocationOn className="h-4 w-4 text-green-600"/>
                        <p className="font-semibold text-sm mb-[2px] text-gray-600 truncate">{listing.address}</p>
                    </div>
                    <p className="font-semibold m-0 text-xl truncate">{listing.name}</p>
                    <p className="text-[#457b9d] mt-2 font-semibold ">{priceFormatter.format(listing.offer ? listing.discountedPrice : listing.regularPrice)}
                        {listing.type === "rent" ? " / month" : null}
                    </p>
                    <div className="flex items-center mt-[10px] space-x-3">
                        <div className="flex items-center space-x-1">
                            <p className="font-bold text-xs">{listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                            <p className="font-bold text-xs">{listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}</p>
                        </div>
                    </div>
                </div>
            </Link>
        </li>
    );
};

ListingItem.propTypes = {
    listing: PropTypes.object.isRequired,
    id: PropTypes.string
};

export default ListingItem;
