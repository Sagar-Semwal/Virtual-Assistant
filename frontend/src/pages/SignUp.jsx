


import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import bg from "../assets/authBg.png";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext.jsx";
import axios from "axios"

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate=useNavigate()
     const [name,setName]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const {serverUrl,setUserData}=useContext(UserDataContext)
  const [error,setError]=useState("")
  const [loading,setLoading]=useState(false)

const handleSignUp=async (e)=>{
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
        let result=await axios.post(`${serverUrl}/api/auth/signup`,{
            name,
            email,
            password
        },{withCredentials:true})

        setUserData(result.data)
        setLoading(false)

        navigate("/customize")
        
    } catch (error) {

        console.log(error)
        setUserData(null)
        setError(error.response.data.message)
        setLoading(false)
        
    }

}




    return (
        <div
            className="relative min-h-screen overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${bg})` }}
        >
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-black/10 via-black/20 to-black/55" />

            {/* Blue Glow Behind Form */}
            <div className="absolute right-20 top-1/2 h-137.5 w-137.5 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[150px]" />

            {/* Noise */}
            <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-size-[24px_24px]" />

            {/* Main Container */}
            <div className="relative z-10 flex min-h-screen items-center justify-end px-10 lg:px-24">

                {/* Signup Form */}
                <form
                    className="
                        relative
                        w-full
                        max-w-117.5
                        rounded-[34px]
                        overflow-hidden
                        border border-white/15
                        bg-white/8
                        backdrop-blur-3xl
                        shadow-[0_25px_80px_rgba(0,0,0,.45)]
                        p-10
                    "

                    onSubmit={handleSignUp}
                >
                    {/* Glass Shine */}
                    <div className="absolute inset-0 rounded-[34px] bg-linear-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

                    {/* Top Glow */}
                    <div className="absolute -top-24 right-8 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />

                    <div className="relative z-10">

                        {/* Badge */}
                        <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-medium tracking-widest uppercase text-cyan-300">
                            AI PLATFORM
                        </span>

                        {/* Heading */}
                        <h1 className="mt-6 text-5xl font-bold text-white">
                            Create
                            <br />
                            Assistant
                        </h1>

                        {/* Description */}
                        <p className="mt-4 text-gray-300 leading-relaxed">
                            Build Your Own Advanced AI Voice Assistant.
                        </p>

                        {/* Inputs */}
                        <div className="mt-10 space-y-5">

                            {/* Name */}
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-gray-400 backdrop-blur-md transition-all duration-300 outline-none focus:border-cyan-400 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20"
                                required
                                onChange={(e)=>setName(e.target.value)}
                                value={name}
                            />

                            {/* Email */}
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-gray-400 backdrop-blur-md transition-all duration-300 outline-none focus:border-cyan-400 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20"
                                required
                                onChange={(e)=>setEmail(e.target.value)}
                                value={email}

                               
                            />

                            {/* Password */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 pr-14 py-4 text-white placeholder:text-gray-400 backdrop-blur-md transition-all duration-300 outline-none focus:border-cyan-400 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20"
                                    required

                                    onChange={(e)=>setPassword(e.target.value)}
                                    value={password}
                                />

                                {!showPassword ? (
                                    <IoEye
                                        size={22}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors hover:text-cyan-400"
                                        onClick={() => setShowPassword(true)}
                                    />
                                ) : (
                                    <IoEyeOff
                                        size={22}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors hover:text-cyan-400"
                                        onClick={() => setShowPassword(false)}
                                    />
                                )}
                            </div>


                                {error.length>0 && <p className="text-red-500 "> 
                                    *{error}</p>}

                            {/* Create Account Button */}
                            <button
                                type="submit"
                                className="
                                    group
                                    relative
                                    mt-3
                                    w-full
                                    overflow-hidden
                                    rounded-2xl
                                    bg-linear-to-r
                                    from-cyan-400
                                    via-sky-500
                                    to-blue-600
                                    py-4
                                    font-semibold
                                    text-white
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:shadow-[0_15px_40px_rgba(14,165,233,.45)]
                                "
                            >
                                <span className="relative z-10"
                                disabled={loading}
                                >
                                   {loading?"Loading..": "Create Account"}
                                </span>

                                <span className="absolute inset-0 translate-x-[-120%] bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="my-8 flex items-center gap-3">
                            <div className="h-px flex-1 bg-white/10" />

                            <span className="text-xs uppercase tracking-widest text-gray-400">
                                OR
                            </span>

                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        {/* Sign In */}
                        <p className="mt-8 text-center text-gray-300">
                            Already have an account?

                            <span className="ml-2 cursor-pointer font-semibold text-cyan-400 transition hover:text-cyan-300"
                            onClick={()=>navigate("/signin")}
                            >
                                Sign In
                            </span>
                        </p>

                    </div>
                </form>
            </div>

            {/* Floating Blur */}
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />
        </div>
    );
};

export default SignUp;

