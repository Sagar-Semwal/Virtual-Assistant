import { createContext, useEffect, useState } from "react"
import axios from "axios"


export const UserDataContext=createContext()



const UserContext = ({children}) => {
    const serverUrl="https://virtual-assistant-backend-7lfv.onrender.com"
    const [userData,setUserData]=useState(null)
    const [frontEndImage,setFrontEndImage]=useState(null)
      const [backEndImage,setBackEndImage]=useState(null)
      const [selectedImage,setSelectedImage]=useState(null)

    const handleCurrentUser=async ()=>{
        try {
            const result=await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
            setUserData(result.data)
            // console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }


const getGeminiResponse = async (command) => {
  try {
    const result = await axios.post(
      `${serverUrl}/api/user/asktoassistant`,
      { command },
      { withCredentials: true }
    );

    console.log("Gemini API response:", result.data);

    return result.data;

  } catch (error) {
    console.log("Gemini request failed");

    console.log("Status:", error.response?.status);
    console.log("Backend message:", error.response?.data);
    console.log("Full error:", error);

    return null;
  }
};









    useEffect(()=>{
        handleCurrentUser()
    },[])

const value={
    serverUrl,
    userData,
    setUserData,
    backEndImage,
    setBackEndImage,
    frontEndImage,
    setFrontEndImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse

}

  return (
    <div>
        <UserDataContext.Provider value={value}>

            {children}    {/*<App></App> */}
        </UserDataContext.Provider>

  

    </div>
  )
}

export default UserContext
