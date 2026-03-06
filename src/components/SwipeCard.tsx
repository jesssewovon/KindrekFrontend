import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";

import '../assets/scss/pages/_tinder-swiper.scss';

import { navigate } from "../navigationService";

import { setShowScreenLoader
} from "../store/userSlice";
import { showPiAdRewarded
} from "../store/userSlice";

import LoaderWhite from "../components/LoaderWhite";
import api from "../api";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import type { ProfileState } from "../types";
import type { AppDispatch } from "../store";
const MySwal = withReactContent(Swal);

import MotionLazyImage from "./MotionLazyImage";

interface SwipeCardProps{
  profile: ProfileState;
  onSwipe: (dir: string,
    user: ProfileState,
    nb?: number)=>void;
  disabled: boolean;
  remainingFreeSwiping: number;
  isSwipingUnlimited: boolean;
  subscriptionData: any;
}
export default function SwipeCard({ profile, onSwipe, disabled, remainingFreeSwiping, isSwipingUnlimited, subscriptionData }: SwipeCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {t} = useTranslation()
  const MotionDiv = motion.create("div");

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

  // Opacity for indicators
  const opacityLeft = useTransform(x, [-80, 0], [1, 0]);
  const opacityRight = useTransform(x, [0, 80], [0, 1]);
  //const opacityUp = useTransform(y, [-80, 0], [1, 0]);

  const [dragging, setDragging] = useState(false);

  const [isSwiped, setIsSwiped] = useState(false);

  const handleDragEnd = (_: any, info: any) => {
    if (!subscriptionData['unlimited likes'] && remainingFreeSwiping <= 0) return;
    if (disabled) return;

    if (info.offset.x > 80) {
      setIsSwiped(true);
      onSwipe?.("right", profile);
    } else if (info.offset.x < -80) {
      setIsSwiped(true);
      onSwipe?.("left", profile);
    } else if (info.offset.y < -80) {
      setIsSwiped(true);
      onSwipe?.("up", profile);
    }
  };

  // Programmatic swipe
  const triggerSwipe = (direction: string) => {
    //alert('here right Programmatic')
    if (disabled || isSwiped) return;
    //alert('fgbb')
    let toX = 0;
    let toY = 0;

    if (direction === "right") toX = 300;
    if (direction === "left") toX = -300;
    if (direction === "up") toY = -300;

    // Animate motion values
    animate(x, toX, { duration: 0.4 });
    animate(y, toY, { duration: 0.4 });

    // Fire callback after short delay
    setTimeout(() => {
      setIsSwiped(true);
      onSwipe?.(direction, profile);
    }, 400);
  };

  const messageBeforeMatching = async (profile: ProfileState) => {
    dispatch(setShowScreenLoader(true))
    const corresponding_profile_id = profile.id
    const res = await api.post(`/message-before-matching`, {corresponding_profile_id})
    dispatch(setShowScreenLoader(false))
    if (res.data.status === true) {
      if (res.data.can_message === true) {
        navigate(`/chat/${corresponding_profile_id}`)
      }else{
        MySwal.fire({ 
            title: "Info!",
            text: res.data.message,
            icon: "error",
            showConfirmButton: true,
        });
      }
    }else{
      MySwal.fire({ 
          title: "Info!",
          text: res.data.message,
          icon: "error",
          showConfirmButton: true,
      });
    }
  };

  if (isSwiped) return null;

  return (
    <MotionDiv
      className="w-full h-full bg-white rounded-2xl shadow-lg flex flex-col items-center justify-start overflow-hidden cursor-grab"
      style={{ x, y, rotate, opacity, width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: "20px", position: "relative" }}
      //drag={disabled ? false : true}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.5}
      onDragStart={() => setDragging(true)}
      onDragEnd={(e, info) => {
        setDragging(false);
        handleDragEnd(e, info);
      }}
    >
      <MotionLazyImage
        src={profile.imageFirst}
        alt={profile.firstname}
        effect="blur"
        style={{
          x,
          y,
          rotate,
          opacity,
          objectFit: "cover",
          width: "100%",
          height: "100%",
          filter: `blur(${
            (!subscriptionData || !subscriptionData["unlimited likes"]) &&
            remainingFreeSwiping <= 0
              ? 20
              : 0
          }px)`,
        }}
        drag={!disabled}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.5}
        onDragEnd={handleDragEnd}
        width="100%"
        height="100%"
        placeholderSrc="/loader.gif"
      />

      {/* profile info */}
      {/* <div className="p-4 w-full text-center" style={{width: "100%", height: "20%", display: "flex", alignItems: "flex-end", position: "absolute", bottom: "0", background: "linear-gradient(180deg, rgba(30, 34, 46, 0.00) 37.50%, rgba(30, 34, 46, 0.67) 44.84%, #1E222E 56.23%, #1E222E 100%)"}}>
        <h2 className="text-lg font-bold">{profile.firstname}</h2>
        <p className="text-gray-600">{profile.id} years</p>
      </div> */}
      <div className="dz-gallery-slider" style={{position: "absolute", top: "0", width: "100%", height: "100%", backgroundImage: "linear-gradient(180deg, rgba(49, 70, 133, 0) 67.50%, rgba(30, 34, 46, 0.67) 84.84%, #1E222E 96.23%, #1E222E 100%)"}}>
        <div className="dz-content" style={{width: "100%", display: "flex", justifyContent: "space-between", padding: "0 15px", position: "absolute", bottom: "15px"}}>
            <div onClick={() => navigate(`/profile-details/${profile.id}`)} className="left-content">
                {profile.isNew===true?
                  (<span className="badge badge-primary d-inline-flex gap-1 mb-2">
                    New here
                  </span>):
                  (
                    profile.distance?
                    (<span className="badge badge-primary d-inline-flex gap-1 mb-2">
                      <i className="icon feather icon-map-pin"></i>
                      Nearby
                    </span>):""
                  )
                }
                <h4 className={`title ${(!subscriptionData || !subscriptionData['unlimited likes']) && remainingFreeSwiping<=0?'text-blur':''}`} style={{color: 'white'}}><a>{profile.firstname} , {profile.age} </a></h4>
                {profile.distance && (<p className={`mb-0 ${(!subscriptionData || !subscriptionData['unlimited likes']) && remainingFreeSwiping<=0?'text-blur':''}`}>
                  <i className="icon feather icon-map-pin"></i>
                  &nbsp; {profile.distance} km away
                </p>)}
                {profile.interests?.length && (
                  <ul className="intrest">
                    <li><span className="badge">Photography</span></li>
                    {profile.interests?.map((name, index) => {
                        return (
                            <li key={index}><span className="badge">{name}</span></li>
                        );
                    })}
                  </ul>
                )}
            </div>
            {/* <a onClick={()=>{triggerSwipe("right")}} className="dz-icon dz-sp-like" style={{width: "50px", height: "50px", borderRadius: "50%", background :"var(--btn-gradient)", color: "#fff"}}>
                <i className="flaticon flaticon-heart" style={{fontSize: "28px"}}></i>
            </a> */}
            <a onClick={()=>{messageBeforeMatching(profile)}} className="dz-icon dz-sp-like" style={{width: "50px", height: "50px", borderRadius: "50%", background :"var(--btn-gradient)", color: "#fff"}}>
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M22 11.5V15.5C22 19 20 20.5 17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H12" stroke="#fff" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.7" d="M7 9L10.13 11.5C11.16 12.32 12.85 12.32 13.88 11.5" stroke="#fff" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.7" d="M19.4792 2.81994L19.7592 3.38993C19.8992 3.66993 20.2492 3.92994 20.5592 3.98994L20.9392 4.04994C22.0792 4.23994 22.3492 5.07994 21.5292 5.90994L21.1792 6.25993C20.9492 6.49993 20.8192 6.95993 20.8892 7.27993L20.9392 7.48994C21.2492 8.86994 20.5192 9.39993 19.3192 8.67993L19.0592 8.52993C18.7492 8.34993 18.2492 8.34993 17.9392 8.52993L17.6792 8.67993C16.4692 9.40993 15.7392 8.86994 16.0592 7.48994L16.1092 7.27993C16.1792 6.95993 16.0492 6.49993 15.8192 6.25993L15.4692 5.90994C14.6492 5.07994 14.9192 4.23994 16.0592 4.04994L16.4392 3.98994C16.7392 3.93994 17.0992 3.66993 17.2392 3.38993L17.5192 2.81994C18.0592 1.72994 18.9392 1.72994 19.4792 2.81994Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </a>
        </div>
      </div>
      {/* ❌ LEFT */}
      <MotionDiv
        className="absolute right-5 px-4 py-4 border-4 border-green-500 text-green-500 text-2xl font-bold rounded-xl rotate-[20deg]"
        style={{ opacity: opacityLeft, position: "absolute", top: "60px", right: "5px"}}
      >
        <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100px", width: "100px", borderRadius: "50%", backgroundColor: "#FF945A", color: "#fff", fontSize: "50px"}}>
            ❌
        </div>
        {/* <span className="p-2" style={{fontSize: "20px", backgroundColor: "#000000aa"}}>
          Dislike
        </span> */}
      </MotionDiv>

      {/* ❤️ RIGHT */}
      <MotionDiv
        className="absolute left-5 px-4 py-4 border-4 border-red-500 text-red-500 text-2xl font-bold rounded-xl rotate-[-20deg]"
        style={{ opacity: opacityRight, position: "absolute", top: "60px", left: "5px" }}
      >
        <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100px", width: "100px", borderRadius: "50%", backgroundColor: "#A8D789", fontSize: "50px"}}>
            <i className="fa-solid fa-check" style={{fontSize: "50px", color: "#fff"}}></i>
        </div>
        {/* ❤️ Like */}
      </MotionDiv>

      {/* ⭐️ UP */}
      {/* <MotionDiv
        className="absolute left-1/2 -translate-x-1/2 px-4 py-2 border-4 border-blue-500 text-blue-500 text-2xl font-bold rounded-xl"
        style={{ opacity: opacityUp, position: "absolute", top: "30%", left: "40%", transform: "translateX: calc(1/2 * -100%) calc(1/2 * -100%)" }}
      >
        <span className="py-2 px-2" style={{background: "green"}}>⭐️ Super Like</span>
        
      </MotionDiv> */}
      {(!subscriptionData || !subscriptionData['unlimited likes']) && remainingFreeSwiping <= 0 && (<div className="p-1" style={{position: "absolute", zIndex: "9", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.7)"}}>
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="" style={{width: "100%", height: "70vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <div className="" style={{width: "100%", textAlign: "center"}}>
                    <label className="my-4" style={{}}>Action needed</label>
                    <div className="" style={{}}>
                        <button onClick={() => dispatch(showPiAdRewarded("unlock-swiping"))} className="btn btn-gradient w-100 btn-shadow rounded-xl my-2">
                            {t('unlock with PiAd')} <LoaderWhite/>
                        </button>
                        <button onClick={() => navigate('/subscriptions')} className="btn btn-light w-100 btn-shadow rounded-xl my-2">
                            {t('subscribe to unlock')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>)}
    </MotionDiv>
  );
}
