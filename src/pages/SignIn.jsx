import {useState} from "react";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import {Link} from "react-router-dom";
import OAuth from "../components/OAuth.jsx";

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const {email, password} = formData;

    const handleOnChange = (e) => {
        setFormData(prevState => ({...prevState, [e.target.id]: e.target.value}));
    }

    return (
        <section>
            <h1 className="text-3xl text-center mt-6 font-bold">Sign In</h1>
            <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto">
                <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
                    <img
                        src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80"
                        alt="Sign in keys holding"
                        className="w-full rounded-2xl"
                    />
                </div>
                <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20 mb-6">
                    <form className="space-y-4">
                        <input
                            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleOnChange}
                            placeholder="Email adress"/>
                        <div className="relative">
                            <input
                                className="w-full px-4 py-2 text-lg text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={handleOnChange}
                                placeholder="Password"
                            />
                            {showPassword ?
                                <AiFillEyeInvisible className="cursor-pointer text-2xl absolute right-3 top-3"
                                                    onClick={() => setShowPassword(prevState => !prevState)}/> :
                                <AiFillEye className="cursor-pointer text-2xl absolute right-3 top-3"
                                           onClick={() => setShowPassword(prevState => !prevState)}/>}

                        </div>
                        <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
                            <p className="mb-6">Don&apos;t have an account? <Link to="/sign-up"
                                                                                  className="text-red-600 hover:text-red-700 transition ease-in-out duration-200">Register</Link>
                            </p>
                            <Link to="/forgot-password"
                                  className="text-blue-600 hover:text-blue-700 transition duration-200 ease-in-out">Forgot
                                password?</Link>
                        </div>
                        <button type="submit"
                                className="w-full bg-blue-600 text-white px-7 py-3 rounded text-sm font-medium uppercase shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-200 ease-in-out active:bg-blue-800">Sign
                            in
                        </button>
                        <div
                            className="my-4 flex items-center before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
                            <p className="text-center font-semibold mx-4 ">OR</p>
                        </div>
                        <OAuth/>
                    </form>

                </div>
            </div>
        </section>
    );
};

export default SignIn;
