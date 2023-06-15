import {FcGoogle} from "react-icons/fc";

const OAuth = () => {
    return (
        <button
            className="flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-lg active:shadow-xl transition duration-200 ease-in-out rounded">
            <FcGoogle className="text-lg bg-white rounded-full mr-2"/>Continue
            with
            Google</button>
    );
};

export default OAuth;