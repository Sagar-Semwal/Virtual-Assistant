import Card from "../components/Card.jsx";
import { RiImageAddLine } from "react-icons/ri";

import Image1 from "../assets/image1.png";
import Image2 from "../assets/image2.jpg";
import Image4 from "../assets/image4.png";
import Image5 from "../assets/image5.png";
import Image6 from "../assets/image6.jpeg";
import Image7 from "../assets/image7.jpeg";
import customizeBg from "../assets/customize.png";

import { useContext, useRef } from "react";
import { UserDataContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";


const Customize = () => {
  const {
    serverUrl,
    userData,
    setUserData,
    backEndImage,
    setBackEndImage,
    frontEndImage,
    setFrontEndImage,
    selectedImage,
    setSelectedImage,
  } = useContext(UserDataContext);

  const navigate = useNavigate()

  const inputImage = useRef();

 const handleImage = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setBackEndImage(file);
  setFrontEndImage(URL.createObjectURL(file));
  setSelectedImage("input");
};
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
        flex-col
        items-center
        justify-center
        px-4
        sm:px-6
        py-12
      "
    >
    <button
  type="button"
  onClick={() => navigate("/")}
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
          top-[-150px]
          left-1/2
          -translate-x-1/2
          w-[400px]
          sm:w-[500px]
          h-[400px]
          sm:h-[500px]
          rounded-full
          bg-purple-600/20
          blur-[120px]
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-[-200px]
          right-[-100px]
          w-[300px]
          sm:w-[400px]
          h-[300px]
          sm:h-[400px]
          rounded-full
          bg-blue-600/10
          blur-[120px]
          pointer-events-none
        "
      />

      {/* Header */}
      <div className="relative z-10 text-center mb-10">
        <p className="text-xs sm:text-sm uppercase tracking-[0.25em] sm:tracking-[0.35em] text-purple-300 mb-3">
          Customize Your Assistant
        </p>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          Choose Your{" "}
          <span className="text-purple-400">
            AI Avatar
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-gray-400 max-w-md mx-auto px-4">
          Select the appearance that best represents your personal
          virtual assistant.
        </p>
      </div>

      {/* Cards */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-5xl
          flex
          justify-center
          items-center
          gap-5
          sm:gap-6
          flex-wrap
        "
      >
        <Card image={Image1} />
        <Card image={Image2} />
        <Card image={Image4} />
        <Card image={customizeBg} />
        <Card image={Image5} />
        <Card image={Image6} />
        <Card image={Image7} />

        {/* Custom Upload Card */}
        <div
          className={`
            group
            relative
            w-[180px]
            h-[240px]
            sm:w-[150px]
            sm:h-[230px]
            md:w-[160px]
            md:h-[240px]
            rounded-2xl
            overflow-hidden
            cursor-pointer
            border-2
            bg-white/5
            backdrop-blur-md
            shadow-[0_10px_30px_rgba(0,0,0,0.4)]
            transition-all
            duration-300
            hover:-translate-y-3
            hover:scale-105
            hover:shadow-[0_15px_40px_rgba(139,92,246,0.35)]
            flex
            items-center
            justify-center

            ${
              selectedImage === "input"
  ? "border-purple-400 shadow-[0_0_30px_rgba(139,92,246,0.6)]"
  : "border-white/10 hover:border-purple-400/70"
            }
          `}
        onClick={() => {
  inputImage.current.click();
}}
        >
          {!frontEndImage && (
            <RiImageAddLine
              className="
                text-white
                w-[30px]
                h-[30px]
                transition-transform
                duration-300
                group-hover:scale-110
              "
            />
          )}

          {frontEndImage && (
            <img
              src={frontEndImage}
              alt="Custom Avatar"
              className="
                w-full
                h-full
                object-cover
                transition-transform
                duration-500
                group-hover:scale-105
              "
            />
          )}

          {/* Gradient Overlay */}
          <div
            className="
              absolute
              inset-0
              pointer-events-none
              bg-gradient-to-t
              from-black/60
              via-transparent
              to-transparent
            "
          />

          {/* Inner Border */}
          <div
            className={`
              absolute
              inset-0
              rounded-2xl
              ring-1
              ring-inset
              pointer-events-none
              transition-all
              duration-300

              ${
                selectedImage === "input"
                  ? "ring-purple-400/80"
                  : "ring-white/10 group-hover:ring-purple-400/50"
              }
            `}
          />

          <input
            type="file"
            accept="image/*"
            hidden
            ref={inputImage}
            onChange={handleImage}
          />
        </div>
      </div>

      {/* Next Button */}

      {selectedImage &&<button
        type="submit"
        className="
          group
          relative
          mt-10
          w-full
          max-w-[500px]
          overflow-hidden
          rounded-2xl
          bg-gradient-to-r
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
          active:scale-[0.98]
        "
        onClick={()=>navigate("/customize2")}

      >
        <span className="relative z-10">
          Next
        </span>

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
    </div>
  );
};

export default Customize;