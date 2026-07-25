import { useContext, useEffect, useRef, useState } from "react";
import { UserDataContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"
import { GiHamburgerMenu, GiCrossedBones } from "react-icons/gi";



 const contacts = {
  bro: import.meta.env.VITE_CONTACT_BRO,
  shivam: import.meta.env.VITE_CONTACT_SHIVAM,
};

let voices = [];

const Home = () => {
  const [listening, setListening] = useState(false);
  const capitalizeFirst = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);

  const synth = window.speechSynthesis;

  const {
    userData,
    serverUrl,
    setUserData,
    getGeminiResponse,
  } = useContext(UserDataContext);

  // keep latest getGeminiResponse in a ref so the recognition effect
  // doesn't need it in its dependency array (it's not memoized on context side)
  const getGeminiResponseRef = useRef(getGeminiResponse);
  useEffect(() => {
    getGeminiResponseRef.current = getGeminiResponse;
  }, [getGeminiResponse]);

  const navigate = useNavigate();

  // ---------------- LOGOUT ----------------

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });

      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.error("Logout error:", error);
    }
  };

  // ---------------- START RECOGNITION ----------------

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error", error);
        }
      }
    }
  };

  // ---------------- TEXT TO SPEECH ----------------

  const speak = (text) => {
    if (!text) return;

    synth.cancel(); // stop any current speech first

    const utterance = new SpeechSynthesisUtterance(text);

    const maleVoice = voices.find(
      (voice) => voice.name === "Google UK English Male"
    );

    if (maleVoice) {
      utterance.voice = maleVoice;
    }

    isSpeakingRef.current = true;

    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;

      setTimeout(() => {
        startRecognition(); // delay avoids race condition with mic picking up tail of speech
      }, 800);
    };

    synth.speak(utterance);
  };

  // ---------------- HANDLE COMMAND ----------------

  const handleCommand = (data) => {
    if (!data) return;

    const { type, userInput, message, response } = data;

    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }

    else if (type === "youtube_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
    }

    else if (type === "youtube_play") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
    }

    else if (type === "calculator_open") {
      window.open("https://www.google.com/search?q=calculator", "_blank");
    }

    else if (type === "instagram_open") {
      window.open("https://www.instagram.com/", "_blank");
    }

    else if (type === "facebook_open") {
      window.open("https://www.facebook.com/", "_blank");
    }
    else if (type === "youtube_open") {
  window.open("https://www.youtube.com/", "_blank");
}

    else if (type === "weather-show") {
      window.open("https://www.google.com/search?q=weather", "_blank");
    }

    else if (type === "whatsapp_open") {
      window.open("https://web.whatsapp.com/", "_blank");
    }

    else if (type === "whatsapp_open_contact") {
      const contactName = userInput.toLowerCase().trim();
      const phoneNumber = contacts[contactName];

      if (phoneNumber) {
        window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}`, "_blank");
      } else {
        speak(`Sorry, I don't have ${userInput} in your contacts.`);
      }
    }

    else if (type === "whatsapp_message") {
      const contactName = userInput.toLowerCase().trim();
      const phoneNumber = contacts[contactName];

      if (phoneNumber) {
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`, "_blank");
      } else {
        speak(`Sorry, I don't have ${userInput} in your contacts.`);
      }
    }

    else if (
      type === "get_time" ||
      type === "get_date" ||
      type === "get_day" ||
      type === "get_month" ||
      type === "get_date_time" ||
      type === "general"
    ) {
      speak(response);
    }
  };

  // ---------------- LOAD VOICES + GREETING ----------------
  // merged into one handler so the greeting doesn't overwrite voice loading

  useEffect(() => {
    const loadVoices = () => {
      voices = synth.getVoices();
    };

    loadVoices();

    synth.onvoiceschanged = () => {
      loadVoices();

      if (userData?.name) {
        const greeting = new SpeechSynthesisUtterance(
          `Hello ${userData.name}, what can I help you with?`
        );

        const maleVoice = voices.find(
          (voice) => voice.name === "Google UK English Male"
        );

        if (maleVoice) {
          greeting.voice = maleVoice; // fixed: was greeting.lang (wrong), should be .voice
        }

        synth.speak(greeting);
      }
    };

    return () => {
      synth.onvoiceschanged = null;
    };
  }, [synth, userData]);

  // ---------------- SPEECH RECOGNITION ----------------

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
        } catch (e) {
          if (e.name !== "InvalidStateError") {
            console.error(e);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);

      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
            } catch (e) {
              if (e.name !== "InvalidStateError") console.error(e);
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      isRecognizingRef.current = false;
      setListening(false);

      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
            } catch (e) {
              if (e.name !== "InvalidStateError") console.error(e);
            }
          }
        }, 1000);
      }
    };

    recognition.onresult = async (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();

      const assistantName = userData?.assistantName;

      if (!assistantName) {
        return;
      }

      const lowerTranscript = transcript.toLowerCase();
      const lowerAssistantName = assistantName.toLowerCase();

      if (lowerTranscript.includes(lowerAssistantName)) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();

        isRecognizingRef.current = false;
        setListening(false);

        const data = await getGeminiResponseRef.current(transcript);

        handleCommand(data);
        setUserText("");
        setAiText(data?.response ?? "");
      }
    };

    return () => {
      isMounted = false;
      recognition.stop();

      setListening(false);
      isRecognizingRef.current = false;

      clearTimeout(startTimeout); // fixed: was clearInterval
    };
  }, [userData]); // getGeminiResponse handled via ref, not needed here

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
        py-10
      "
    >
      {/* Background Glow */}
      <div
        className="
          absolute
          top-[-120px]
          sm:top-[-180px]
          left-1/2
          -translate-x-1/2
          w-[320px]
          h-[320px]
          sm:w-[500px]
          sm:h-[500px]
          rounded-full
          bg-purple-600/20
          blur-[100px]
          sm:blur-[130px]
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-[-120px]
          right-[-80px]
          w-[260px]
          h-[260px]
          sm:w-[400px]
          sm:h-[400px]
          rounded-full
          bg-blue-600/10
          blur-[90px]
          sm:blur-[120px]
          pointer-events-none
        "
      />

      {/* Mobile fullscreen overlay menu - top-level sibling, not constrained by any flex/max-w parent */}
      <div
        className={`
          fixed inset-0 w-screen h-screen
          bg-[#080612]/90 backdrop-blur-xl
          flex flex-col items-center justify-start
          pt-24 gap-4
          z-50
          transition-transform duration-300
          lg:hidden
          overflow-y-auto
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <GiCrossedBones
          onClick={() => setMenuOpen(false)}
          className="fixed top-6 right-6 text-2xl cursor-pointer z-50"
        />

        <button
          className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-gray-200 w-full max-w-[220px] text-center"
          onClick={() => { setMenuOpen(false); navigate("/customize"); }}
        >
          Customize
        </button>

        <button
          className="px-5 py-2.5 rounded-xl border border-red-400/20 bg-red-500/5 backdrop-blur-md text-sm font-medium text-red-300 w-full max-w-[220px] text-center"
          onClick={() => { setMenuOpen(false); handleLogout(); }}
        >
          Logout
        </button>

        <h1 className="text-white text-lg font-semibold mt-6 w-full max-w-[220px] text-center">History</h1>

        <div className="flex flex-col gap-2 w-full max-w-[220px] mx-auto">
          {userData?.history?.map((his, index) => (
            <span
              key={index}
              className="text-gray-300 text-sm text-center truncate px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
              title={his}
            >
              {his}
            </span>
          ))}
        </div>
      </div>

      {/* Desktop sliding history sidebar */}
      <div
        className={`
          hidden lg:flex
          fixed top-0 right-0 h-screen w-80
          bg-[#0f0c1d]/95 backdrop-blur-xl
          border-l border-white/10
          shadow-[0_0_60px_rgba(0,0,0,0.5)]
          flex-col
          pt-8 px-5 gap-3
          z-50
          transition-transform duration-300
          overflow-y-auto
          ${historyOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-white text-xl font-semibold">History</h1>
          <GiCrossedBones
            onClick={() => setHistoryOpen(false)}
            className="text-2xl cursor-pointer text-gray-300 hover:text-white transition-colors"
          />
        </div>

        {userData?.history?.length ? (
          userData.history.map((his, index) => (
            <div
              key={index}
              className="w-full text-gray-200 text-sm leading-relaxed break-words whitespace-normal px-4 py-3 rounded-lg bg-white/5 border border-white/10"
            >
              {his}
            </div>
          ))
        ) : (
          <span className="text-gray-500 text-sm text-center px-3 py-2">
            No history yet
          </span>
        )}
      </div>

      {/* Top Right Buttons */}
      <div
        className={`
          absolute
          top-4
          right-4
          sm:top-6
          sm:right-6
          flex
          flex-wrap
          justify-end
          gap-2
          sm:gap-3
          z-50
          max-w-[calc(100%-2rem)]
          ${historyOpen ? "lg:hidden" : ""}
        `}
      >
        <GiHamburgerMenu
          onClick={() => setMenuOpen(true)}
          className={`lg:hidden text-2xl cursor-pointer text-white ${menuOpen ? "hidden" : ""}`}
        />

        <button
          className="
            px-3
            py-2
            sm:px-5
            sm:py-2.5
            rounded-xl
            border
            border-white/10
            bg-white/5
            backdrop-blur-md
            text-xs
            sm:text-sm
            font-medium
            text-gray-200
            transition-all
            duration-300
            hover:bg-white/10
            hover:border-purple-400/50
            hover:text-purple-300
            hidden
            lg:block
          "
          onClick={() => navigate("/customize")}
        >
          Customize
        </button>

        <div className="relative hidden lg:block">
          <button
            className="
              px-3
              py-2
              sm:px-5
              sm:py-2.5
              rounded-xl
              border
              border-white/10
              bg-white/5
              backdrop-blur-md
              text-xs
              sm:text-sm
              font-medium
              text-gray-200
              transition-all
              duration-300
              hover:bg-white/10
              hover:border-purple-400/50
              hover:text-purple-300
            "
            onClick={() => setHistoryOpen((prev) => !prev)}
          >
            History
          </button>
        </div>

        <button
          className="
            px-3
            py-2
            sm:px-5
            sm:py-2.5
            rounded-xl
            border
            border-red-400/20
            bg-red-500/5
            backdrop-blur-md
            text-xs
            sm:text-sm
            font-medium
            text-red-300
            transition-all
            duration-300
            hover:bg-red-500/10
            hover:border-red-400/50
            hidden
            lg:block
          "
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Assistant */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Assistant Image */}
        <div
          className="
            w-[220px]
            h-[220px]
            sm:w-[280px]
            sm:h-[280px]
            md:w-[340px]
            md:h-[340px]
            rounded-full
            overflow-hidden
            border
            border-purple-400/30
            bg-white/5
            shadow-[0_0_40px_rgba(139,92,246,0.25)]
            sm:shadow-[0_0_60px_rgba(139,92,246,0.25)]
          "
        >
          <img
            src={userData?.assistantImage}
            alt="AI Assistant"
            className="
              w-full
              h-full
              object-cover
            "
          />
        </div>

        {/* Assistant Name */}
        <h1 className="mt-6 sm:mt-8 text-2xl sm:text-3xl md:text-4xl font-bold text-center px-2">
          I'm{" "}
          <span className="text-purple-400">
            {userData?.assistantName}
          </span>
        </h1>

        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-400 text-center px-4">
          Your personal virtual assistant
        </p>

      <img
  src={aiText ? aiImg : userImg}
  alt={aiText ? "AI Assistant" : "User"}
  className="
    w-[160px]
    h-[160px]
    sm:w-[200px]
    sm:h-[200px]
    md:w-[240px]
    md:h-[250px]
    object-contain
    mix-blend-screen
    mt-6
    sm:mt-10
  "
/>

        <h1
          className={`mt-6 sm:mt-10 text-lg sm:text-2xl md:text-3xl font-semibold tracking-wide text-center px-4 max-w-[90%] sm:max-w-lg md:max-w-xl mx-auto break-words transition-all duration-300 ${
            aiText ? "text-purple-300" : "text-white"
          }`}
        >
          {userText ? capitalizeFirst(userText) : aiText ? capitalizeFirst(aiText) : null}
        </h1>


        {/* Listening Status
        {listening && (
          <p className="mt-4 text-sm text-purple-400">
            Listening...
          </p>
        )} */}

      </div>
    </div>
  );
};

export default Home;
