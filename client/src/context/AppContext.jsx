import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();

axios.defaults.baseURL = "https://quickstay-7lu6.onrender.com";

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) } catch { return null }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [searchedCities, setSearchedCities] = useState([]);  // ← added

  const currency = "₹";
  const isSignedIn = !!token;

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get('/api/rooms')
      if (data.success) {
        setRooms(data.rooms)
      }
    } catch (error) {
      console.error("Fetch rooms error:", error.message)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const login = (userData, jwt) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwt);
    setUser(userData);
    setToken(jwt);
    setIsOwner(userData.role === "hotelOwner" || userData.role === "admin");
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setIsOwner(false);
    setShowHotelReg(false);
    setSearchedCities([]);  // ← clear on logout
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      setIsOwner(user.role === "hotelOwner" || user.role === "admin");
    }
  }, [user]);

  return (
    <AppContext.Provider value={{
      user, setUser,
      token, isSignedIn, isOwner, setIsOwner,
      login, logout,
      showHotelReg, setShowHotelReg,
      axios,
      rooms, setRooms, fetchRooms,
      currency,
      searchedCities, setSearchedCities,  // ← added
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
