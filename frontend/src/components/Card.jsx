import { useContext } from "react";
import { UserDataContext } from "../context/UserContext.jsx";

const Card = ({ image }) => {
  const {
      serverUrl,
    userData,
    setUserData,
    backEndImage,
    setBackEndImage,
    frontEndImage,
    setFrontEndImage,
    selectedImage,
    setSelectedImage
  } = useContext(UserDataContext);

  return (
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

        ${
          selectedImage === image
            ? "border-purple-400 shadow-[0_0_30px_rgba(139,92,246,0.6)]"
            : "border-white/10 hover:border-purple-400/70"
        }
      `}
      onClick={() => {
        setSelectedImage(image)
        setBackEndImage(null)
        setFrontEndImage(null)


      }}
    >
      <img
        src={image}
        alt="AI Avatar"
        className="
          w-full
          h-full
          object-cover
          object-[center_20%]
          transition-transform
          duration-500
          group-hover:scale-105
        "
      />

      {/* Gradient */}
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

      {/* Inner glow */}
      <div
        className={`
          absolute
          inset-0
          rounded-2xl
          ring-1
          ring-inset
          transition-all
          duration-300
          pointer-events-none
          ${
            selectedImage === image
              ? "ring-purple-400/80"
              : "ring-white/10 group-hover:ring-purple-400/50"
          }
        `}
      />
    </div>
  );
};

export default Card;