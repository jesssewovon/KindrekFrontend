// api.js
import axios from "axios";

import { store } from "./store";
import { loggedUserOut, setSettings, setUser } from "./store/userSlice";

import { navigate } from "./navigationService";

//axios.defaults.baseURL = import.meta.env.VITE_APP_BACKEND_URL

const api = axios.create({
  //baseURL: "https://testnet-backend.piketplace.com/api/v1",
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
  //withCredentials: true, // send cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Example: add token if exists
    //const token = localStorage.getItem("token");
    const state = store.getState(); // 👈 access store var
    const token = state.user?.token; // 👈 access store var
    //alert(token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    //console.log('interceptors api', response.data)
    if (response.data.settings_user) {
      store.dispatch(setSettings(response.data.settings_user));
    }
    if (response.data.current_user_for_automatic_update) {
      //console.log('current_user_for_automatic_update', response.data)
      //alert('current_user_for_automatic_update')
      store.dispatch(setUser(response.data.current_user_for_automatic_update));
    }
    if(response.data.redirectTo) {
        //alert('redirectTo')
        navigate(response.data.redirectTo);
        return response;
    }
    return response;
  },
  async (error) => {
    console.log('error interceptor', error.response)
    if (error.response?.status === 401) {
      // Example: redirect to login
      store.dispatch(loggedUserOut());
      //window.location.href = "/profile";
      navigate("/");  // ✅ redirect on 401
      try {
        await axios.post("/signin", {}, { withCredentials: true });
        return api(error.config); // retry original request
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    if(error.response?.status === 403) {
        /* if(error.response?.data.redirectTo) {
            alert(error.response?.data.redirectTo)
        } */
    }
    return Promise.reject(error);
  }
);

export default api;
