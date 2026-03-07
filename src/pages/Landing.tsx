import { useState, useEffect } from "react";

import { setGeolocation,
    setIsSaving, 
} from "../store/userSlice";
import { signinPiketplace, showPiAdInterstitial, 
} from "../store/userSlice";
//import { navigate } from "../navigationService";

import LoaderWhite from '../components/LoaderWhite';
import SwitchLanguage from '../components/SwitchLanguage';
import { useTranslation } from 'react-i18next';

import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/swiper-bundle.css';
// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import type { RootState } from "../store";
import { useAppSelector, type GeolocationType } from "../types";
import { useAppDispatch } from "../hooks/reduxHooks";

export default function Landing() {
    const dispatch = useAppDispatch()
    const {t} = useTranslation()
    const { isLoggedIn, isSaving } = useAppSelector((state) => state.user);
    const geolocation: GeolocationType|null = useAppSelector(
        (state: RootState) => state.user.geolocation
    );
    
    const [showLanguageOffCanvas, setShowLanguageOffCanvas] = useState(false);
    const handleLanguageOffCanvasShow = () => {setShowLanguageOffCanvas(true)};
    const handleLanguageOffCanvasClose = () => {setShowLanguageOffCanvas(false)};
    
    const findSomeone = async () => {
        /* navigate('/registration-firstname')
        return */
        //updateLanguage()
        dispatch(signinPiketplace(geolocation));
    };
    const geolocate = async () => {
        //alert('geolocate')
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
            let userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
            dispatch(setGeolocation(userLocation))
            console.log('this.userLocation', position)
            }, error => {
            console.error("Error getting user location:", error);
            });
            console.log('this.userLocation out')
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };
    
    useEffect(() => {
      dispatch(showPiAdInterstitial())
      dispatch(setIsSaving(false))
      geolocate()
      if (isLoggedIn) {
        //navigate('/home')
      }
    }, [dispatch]);

    return (
        <>
            <div className="content-body bg-gray-color">
                <div className="welcome-area bg-image">
                    <div className="welcome-inner">
                        <div className="dz-media">
                            <img src="/images/onboarding/pic1.png" alt=""/>
                        </div>
                        <Swiper
                            spaceBetween={30}
                            speed={1500}
                            centeredSlides={true}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            pagination={{
                                clickable: true,
                            }}
                            navigation={false}
                            modules={[Autoplay, Pagination, Navigation]}
                            className="mySwiper get-started"
                        >
                            <SwiperSlide>
                                <div className="slide-info">
                                    <div className="started">
                                        <h2 className="title mb-3">Start Your Dating Story</h2>
                                        <p>Your companion for meaningful connections</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="slide-info">
                                    <div className="started">
                                        <h2 className="title mb-3">Begin Your Chapter of Love</h2>
                                        <p>Embrace the dating world armed with tools and support</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="slide-info">
                                    <div className="started">
                                        <h2 className="title mb-3">Your Journey of Connection</h2>
                                        <p>Explore essentials and delights that boost confidence</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                    <div className="bottom-btn container">
                        {/* <div id="errors">
                            {typeof error === "string"?error:JSON.stringify(error)}
                        </div> */}
                        <button disabled={isSaving} onClick={() => findSomeone()} className="btn btn-lg btn-gradient w-100 dz-flex-box btn-shadow rounded-xl">
                            {t('find someone')}<LoaderWhite/>
                        </button>
                    </div>
                </div>
            </div>
            <a onClick={handleLanguageOffCanvasShow} className="setting-input" style={{position: "absolute", top: "20px", left: "20px", zIndex: "1"}}>
                <svg fill="#ff50a2" width="24px" height="24px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><title>ionicons-v5-l</title><path d="M478.33,433.6l-90-218a22,22,0,0,0-40.67,0l-90,218a22,22,0,1,0,40.67,16.79L316.66,406H419.33l18.33,44.39A22,22,0,0,0,458,464a22,22,0,0,0,20.32-30.4ZM334.83,362,368,281.65,401.17,362Z"></path><path d="M267.84,342.92a22,22,0,0,0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73,39.65-53.68,62.11-114.75,71.27-143.49H330a22,22,0,0,0,0-44H214V70a22,22,0,0,0-44,0V90H54a22,22,0,0,0,0,44H251.25c-9.52,26.95-27.05,69.5-53.79,108.36-31.41-41.68-43.08-68.65-43.17-68.87a22,22,0,0,0-40.58,17c.58,1.38,14.55,34.23,52.86,83.93.92,1.19,1.83,2.35,2.74,3.51-39.24,44.35-77.74,71.86-93.85,80.74a22,22,0,1,0,21.07,38.63c2.16-1.18,48.6-26.89,101.63-85.59,22.52,24.08,38,35.44,38.93,36.1a22,22,0,0,0,30.75-4.9Z"></path></g></svg>
            </a>
            <SwitchLanguage showLanguageOffCanvas={showLanguageOffCanvas} handleLanguageOffCanvasClose={handleLanguageOffCanvasClose}/>
        </>
    );
}
