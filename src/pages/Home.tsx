import { useState, useRef, useEffect } from "react";
import SwipeDeck from "../components/SwipeDeck";
import { useTranslation } from 'react-i18next';
import { useActivate, useUnactivate, useAliveController } from "react-activation";

import api from "../api";
import Header from "../components/Header";
import MenuBar from '../components/MenuBar';
import MatchModal from '../components/MatchModal';
import ScreenLoader from "../components/ScreenLoader";
import { setReloadHomePage } from "../store/userSlice";
//import { setReactions } from "../store/profileFormSlice";
import { navigate } from "../navigationService";

import { useLocation, useNavigate } from "react-router";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useAppSelector, type ProfileState } from "../types";
const MySwal = withReactContent(Swal);

interface HomeProps{
    savedScroll: number;
    onSaveScroll: (scroll: number)=>void;
}

export default function Home({ savedScroll, onSaveScroll }: HomeProps) {
  const {t} = useTranslation()
  const {drop} = useAliveController()
  const { dateFilter, user, isLoggedIn } = useAppSelector((state) => state.user);
  //const { reactions } = useAppSelector((state) => state.profileForm);
  const [profiles, setProfiles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const nnavigate = useNavigate();

  const location = useLocation();

  const [reactions, setReactions] = useState<any[]>([]);
  
  const [remainingSwiping, setRemainingSwiping] = useState<number>(0);
  const [subscriptionData, setSubscriptionData] = useState<any>({});
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reactionsRef = useRef(reactions)
  useEffect(() => {
    reactionsRef.current = reactions;
  }, [reactions]);

  const startTimer = () => {
      if (intervalRef.current) return; // already running
      intervalRef.current = setInterval(() => {
        //alert('hhh')
        sendReactions()
        //console.log("Tick... reactionsRef", reactionsRef.current, reactions);
      }, 5000);
  };
  const stopTimer = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = null;
  };
  useEffect(() => {
      console.log('location href', location)
      if (location?.state?.reloadHome === true) {
        nnavigate(location.pathname, {replace: true, state: null})//Remove filter in memory
        MySwal.fire({ 
            title: "Info!",
            text: "Filter application ...",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
        });
        setReload(true)
      }
    }, [location]);
  
  useEffect(() => {
      setRemainingSwiping(user?.profile?.remainingFreeSwiping-reactions?.length)
      //console.log("remainingSwiping", remainingSwiping)
      setSubscriptionData(user?.profile?.subscriptionData)
    }, [user]);
  
    // Code to execute on isLoggedIn change
    useEffect(() => {
        //Kill all alive components on Logging out
      if (isLoggedIn === true) {
        //setReload(true)
      }
      if (isLoggedIn === false) {
        drop('home')
      }
    }, [isLoggedIn]);
  useActivate(() => {
    startTimer()
    window.scrollTo(0, savedScroll || 0);
    return () => {
      // save scroll before unmount
      onSaveScroll(window.scrollY);
    };
    
  });
  // Clear interval when component is "deactivated" (but not unmounted)
  useUnactivate(() => {
    stopTimer()
    sendReactions()
    ////////////////////////////////////////
    setReloadHomePage(false)
    console.log("PageA hidden");
  });

    const sendReactions = async () => {
        if (reactionsRef.current.length===0) return
        const reactionsToSend = reactionsRef.current
        console.log('reactionsRef.current', reactionsRef.current)
        try{
            setReactions([])
            const res = await api.post(`/save-reactions`, {reactions: reactionsToSend})
            if (res.data.status === true) {
                //alert('success')
            }else{
                setReactions([...reactionsToSend, ...reactionsRef?.current])
            }
        } catch (err) {
            setReactions([...reactionsToSend, ...reactionsRef?.current])
            console.error("Error fetching profiles:", err);
        }
    };

    useEffect(() => {
        if (reload) {
            setReload(false)
            setProfiles([])
            fetchProfiles()
        }
    }, [reload]);
    

    // fetch profiles from API
    const fetchProfiles = async () => {
        console.log('fetchProfiles', page, dateFilter)
        setLoading(true);
        try {
            const res = await api.get(`home-profiles-load?page=${page}`, {params: dateFilter});
            //const res = await api.get(`https://testnet-backend.piketplace.com/api/v1/index-loading?page=${page}`);
            console.log('res fetchProfiles', res.data)
            setProfiles(res.data.profiles.data); // adjust to your API structure
            if (res.data.profiles.data.length==0) {
                setPage(1);
            }
        } catch (err) {
            console.error("Error fetching profiles:", err);
        }
        console.log('profiles', profiles)
        setLoading(false);
    };
  
    // Load data on page change
    useEffect(() => {
        fetchProfiles();
    }, [page]);

    //Load once
    useEffect(() => {
      startTimer();
    }, []);

    const handleSwipe = (dir: string, user: ProfileState, nb?: number):void => {
        setRemainingSwiping(remainingSwiping-1)
        console.log("Swiped", dir, user);
        //if (dir === "right") api.post(`/like/${user.id}`);
        //if (dir === "left") api.post(`/dislike/${user.id}`);
        //if (dir === "up") api.post(`/superlike/${user.id}`);
        
        if (dir === "right"){
            //setReactions([...reactions, {id: user.id, type: 'like'}])
            setReactions(reactions => {
                return [...reactions, {id: user.id, type: 'like'}]
            });
        }
        if (dir === "left"){
            setReactions([...reactions, {id: user.id, type: 'dislike'}])
        }
        //if (dir === "up") api.post(`/superlike/${user.id}`);

        // 🔄 when deck gets empty, fetch next page
        if (nb === 1) {
            setPage((p) => p + 1);
        }
    };

    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

    return (
        <>
            <Header title={""} showBackButton={false} showWishList={true} />
            <MenuBar/>
            <div className="page-content space-top p-b65">
                <div className="container fixed-full-area">
                    {loading ? (
                        <div className="flex items-center justify-center h-screen bg-gray-100">
                            <div className="" style={{width: "100%", height: "70vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <svg className="loader-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style={{shapeRendering: "auto", display: "block", background: "transparent"}} width="50" height="50" xmlnsXlink="http://www.w3.org/1999/xlink"><g><circle strokeDasharray="164.93361431346415 56.97787143782138" r="35" strokeWidth="10" fill="none" cy="50" cx="50"><animateTransform keyTimes="0;1" values="0 50 50;360 50 50" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform"></animateTransform></circle><g></g></g></svg>
                            </div>
                        </div>
                    ):profiles.length>0?
                        (<div className="flex items-center justify-center h-screen bg-gray-100">
                            <SwipeDeck
                              key={JSON.stringify(profiles)}
                              profiles={profiles}
                              onSwipe={handleSwipe}
                              remainingFreeSwiping={remainingSwiping}
                              isSwipingUnlimited={subscriptionData?subscriptionData['unlimited likes']:false}
                              subscriptionData={subscriptionData}
                              />
                        </div>)
                        :(<div className="flex items-center justify-center h-screen bg-gray-100">
                            <div className="" style={{width: "100%", height: "70vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <div className="" style={{width: "100%", textAlign: "center"}}>
                                    <label className="my-4" style={{}}>No profile found</label>
                                    <div className="" style={{display: 'flex', justifyContent: "space-between", }}>
                                        <button onClick={fetchProfiles} className="btn btn-gradient w-100 btn-shadow rounded-xl">
                                            {t('reload')}
                                        </button>
                                        <button onClick={() => navigate('/filter')} className="btn btn-gradient w-100 btn-shadow rounded-xl">
                                            {t('ajust filter')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>)
                    }
                </div>
            </div>
            <MatchModal show={show} onHide={handleClose}/>
            <ScreenLoader/>
        </>
    );
}
