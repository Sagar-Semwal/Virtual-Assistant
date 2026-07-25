import { useContext, useState } from "react";
import { UserDataContext } from "../context/UserContext.jsx";
import axios from "axios"
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";


const Customize2 = () => {
const navigate=useNavigate()


    const {userData,backEndImage,selectedImage,serverUrl,setUserData}=useContext(UserDataContext)

const [AssistantName,setAssistantName]=useState(userData?.AssistantName || "")
const [loading,setLoading]=useState(false)

const handleUpdateAssistant=async()=>{

  try {
    setLoading(true)

let formData=new FormData()
formData.append("assistantName",AssistantName)

if(backEndImage){
  formData.append("assistantImage",backEndImage)
}else{
  formData.append("imageUrl",selectedImage)
}


    const result=await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
    console.log(result.data)
    setUserData(result.data)
    setLoading(false)
    navigate("/")
  } catch (error) {
    setLoading(false)
    console.log(error)


    
  }



}

  return (
    <div
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-[#080612]
        text-white
        flex
        items-center
        justify-center
        px-5
        py-12
      "
    >
    <button
  type="button"
  onClick={() => navigate("/customize")}
  className="
    absolute
    top-6
    left-6
    z-50
    flex
    items-center
    justify-center
    rounded-full
    p-2
    text-white
    text-3xl
    transition-all
    duration-300
    hover:bg-white/10
    hover:text-purple-400
  "
>
  <IoArrowBack />
</button>
      {/* Background Glow */}
      <div
        className="
          absolute
          top-[-180px]
          left-1/2
          -translate-x-1/2
          w-[450px]
          h-[450px]
          rounded-full
          bg-purple-600/20
          blur-[120px]
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-[-150px]
          right-[-100px]
          w-[350px]
          h-[350px]
          rounded-full
          bg-blue-600/10
          blur-[120px]
          pointer-events-none
        "
      />

      {/* Main Card */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-xl
          rounded-3xl
          border
          border-white/10
          bg-white/[0.04]
          backdrop-blur-xl
          shadow-[0_20px_80px_rgba(0,0,0,0.5)]
          px-6
          py-10
          sm:px-10
          sm:py-12
        "
      >
       

        {/* Heading */}
        <div className="text-center">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-purple-300 mb-4">
            One Last Step
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Name Your{" "}
            <span className="text-purple-400">
              Assistant
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-gray-400 max-w-md mx-auto leading-relaxed">
            Give your personal AI assistant a name. Choose something
            unique that feels right for you.
          </p>
        </div>

        {/* Input Section */}
        <div className="mt-10">
          <label
            className="
              block
              text-sm
              font-medium
              text-gray-300
              mb-3
            "
          >
            Assistant Name
          </label>

          <div
            className="
              relative
              group
            "
          >
            <input
              type="text"
              placeholder="e.g. Nova, Jarvis, Friday..."
              className="
                w-full
                rounded-2xl
                border
                border-white/10
                bg-black/20
                px-5
                py-4
                text-white
                placeholder:text-gray-600
                outline-none
                transition-all
                duration-300
                focus:border-purple-400/70
                focus:bg-white/[0.06]
                focus:shadow-[0_0_30px_rgba(139,92,246,0.15)]
              "
              onChange={(e)=>setAssistantName(e.target.value)}
              value={AssistantName}
            />

            {/* Input Glow */}
            <div
              className="
                absolute
                inset-0
                rounded-2xl
                pointer-events-none
                ring-1
                ring-inset
                ring-white/5
                group-focus-within:ring-purple-400/30
                transition-all
                duration-300
              "
            />
          </div>
        </div>

        {/* Continue Button */}

        { AssistantName &&
        <button
          type="button"
          className="
            group
            relative
            mt-8
            w-full
            overflow-hidden
            rounded-2xl
            bg-gradient-to-r
            from-cyan-400
            via-sky-500
            to-blue-600
            py-4
            font-semibold
            text-white
            shadow-[0_10px_30px_rgba(14,165,233,0.2)]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-[0_15px_40px_rgba(14,165,233,0.4)]
            active:scale-[0.98]
          "
          disabled={loading}
          onClick={handleUpdateAssistant}
        >
          <span className="relative z-10">
           {loading? "Loading":"Continue"} 
          </span>

          {/* Shine Effect */}
          <span
            className="
              absolute
              inset-0
              translate-x-[-120%]
              bg-gradient-to-r
              from-transparent
              via-white/40
              to-transparent
              transition-transform
              duration-700
              group-hover:translate-x-[120%]
            "
          />
        </button>
}

        {/* Small Footer Text */}
        <p className="text-center text-xs text-gray-600 mt-6">
          You can change your assistant's name later.
        </p>
      </div>
    </div>
  );
};

export default Customize2;