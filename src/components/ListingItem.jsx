import PropTypes from "prop-types";

const ListingItem = ({listing, id}) => {
    
    return (
        <li key={id}>
            {listing.name}
        </li>
    );
};

ListingItem.propTypes = {
    listing: PropTypes.object.isRequired,
    id: PropTypes.string
};

export default ListingItem;
