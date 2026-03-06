import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import { useActivate, useUnactivate } from "react-activation";

import api from "../api";
import Header from "../components/Header";
import MenuBar from '../components/MenuBar';
//import { setReactions } from "../store/profileFormSlice";
import { navigate } from "../navigationService";
import type { RootState } from '../store';

interface WishListProps{
    savedScroll: number;
    onSaveScroll: (scroll: number)=>void;
}

export default function WishList({ savedScroll, onSaveScroll }: WishListProps) {
  const {t} = useTranslation()
  const { user } = useSelector((state: RootState) => state.user);
  const [crushes, setCrushes] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(0);
  const [openLoading, setOpenLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [subscriptionData, setSubscriptionData] = useState<any>({});
  const [reinitList, setReinitList] = useState<boolean>(false);

  const containerRef = useRef<any>(null)
  const bottomRef = useRef<any>(null)

  const onScroll = (): void => {
    onSaveScroll(window.scrollY);
  };

  useEffect(() => {
    setSubscriptionData(user.profile?.subscriptionData)
  }, [user]);

  useActivate(() => {
    //alert("savedScroll "+savedScroll)
    window.scrollTo(0, savedScroll || 0);
    //window.addEventListener("scroll", onScroll);
    return () => {
      // save scroll before unmount
      //onSaveScroll(window.scrollY);
    };
  });
  // Clear interval when component is "deactivated" (but not unmounted)
  useUnactivate(() => {
    window.removeEventListener("scroll", onScroll);
    //console.log("useUnactivate savedScroll", savedScroll)
  });

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);
  
  // fetch users from API
  const fetchCrushes = async (pageNum: number) => {
      console.log('fetchCrushes', page, pageNum, crushes)
      setLoading(true);
      //alert(page)
      try {
          const res = await api.get(`get-wish-list?page=${pageNum}`, {params: {}});
          //const res = await api.get(`https://testnet-backend.piketplace.com/api/v1/index-loading?page=${page}`);
          setCrushes([...crushes, ...res.data.list.data]); // adjust to your API structure
          setLastPage(res.data.list.last_page)
          //window.scrollTo(0, savedScroll || 0);
      } catch (err) {
          console.error("Error fetching users:", err);
      }
      console.log('crushes', crushes)
      setLoading(false);
      setOpenLoading(false);
  };
  const redirectionTo = async (reaction: any) => {
      if (subscriptionData['see who likes you'] === true) {
        navigate(`/profile-details/${reaction.sender?.id}`)
      }
  };
  const reload = async () => {
      setReinitList(true)
      setCrushes([])
  };
  
  // Fetch first page on mount
  useEffect(() => {
    //alert('refetch '+page)
    fetchCrushes(page);
  }, []);
  // Load data on crushes array change
  useEffect(() => {
    //console.log('new value for crushes', crushes, page)
    if (reinitList) {
      setReinitList(false)
      page!==1?setPage(1):fetchCrushes(1)
    }
  }, [crushes]);
  // Load data on crushes array change
  useEffect(() => {
    fetchCrushes(page)
  }, [page]);

  useEffect(() => {
    const bottomObserver = new IntersectionObserver((entries) => {
      console.log('gffffffffffffffffffff')
      if (entries[0].isIntersecting && !loading && lastPage>page) {
        console.log("🔽 Bottom visible → load", page);
        setPage((p) => p + 1);
      }
    }, {threshold: 1});

    if (bottomRef.current) bottomObserver.observe(bottomRef.current);

    return () => {
      if (bottomRef.current) {
        bottomObserver.unobserve(bottomRef.current);
      }

    };
  }, [loading]);

  if (openLoading) {
      return (
          <>
              <Header showBackButton={true} title={"Liked you"} showWishList={false}/>
              <MenuBar/>
              <div className="page-content space-top p-b65">
                  <div className="container fixed-full-area">
                      <div className="flex items-center justify-center h-screen bg-gray-100">
                          <div className="" style={{width: "100%", height: "70vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
                              <svg className="loader-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style={{shapeRendering: "auto", display: "block", background: "transparent"}} width="50" height="50" xmlnsXlink="http://www.w3.org/1999/xlink"><g><circle strokeDasharray="164.93361431346415 56.97787143782138" r="35" strokeWidth="10" fill="none" cy="50" cx="50"><animateTransform keyTimes="0;1" values="0 50 50;360 50 50" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform"></animateTransform></circle><g></g></g></svg>
                          </div>
                      </div>
                  </div>
              </div>
          </>
      );
  }
  return (
    <>
      <Header showBackButton={true} title={"Liked you"} showWishList={false}/>
      <MenuBar/>
      <div className="page-content space-top p-b65">
        <div className="container">
          <div style={{width: "100%", textAlign: "center"}}>
            <button onClick={() => reload()} className="btn mb-2 me-2 btn-light rounded-xl">
                {t('reload')}
            </button>
          </div>
          <div className="row g-2" id="scroll-container"
            ref={containerRef}
          >
            {crushes.map((reaction, index) => (
                <div key={`reaction${reaction.id}-${index}`} className="col-6" onClick={() => redirectionTo(reaction)}>
                  <div className="dz-media-card" style={{position: "relative"}}>
                    <a>
                      <div className="dz-media">
                        <img src={reaction.sender?.imageFirst} alt={reaction.sender?.firstname} style={{filter: `blur(${!subscriptionData['see who likes you']?20:0}px)`}}/>
                      </div>
                      <div className="dz-content">
                        <h6 className="title" style={{filter: `blur(${!subscriptionData['see who likes you']?4:0}px)`}}>{reaction.sender?.firstname}</h6>  
                        <span className="about" style={{filter: `blur(${!subscriptionData['see who likes you']?4:0}px)`}}>{reaction.sender?.about_me}</span> 
                      </div>
                    </a>
                    {subscriptionData['see who likes you'] === false && (<div style={{position: "absolute", top: "40%", width: "100%", padding: "20px"}}>
                      <button onClick={() => navigate('/subscription')} className="btn btn-gradient w-100 btn-shadow rounded-xl my-2">
                        {t('subscribe')}
                      </button>
                    </div>)}
                  </div>
                </div>
              ))
            }
            {loading && (<div style={{width: "100%", textAlign: "center"}}>
              <svg className="loader-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style={{shapeRendering: "auto", display: "block", background: "transparent", margin: "auto"}} width="50" height="50" xmlnsXlink="http://www.w3.org/1999/xlink"><g><circle strokeDasharray="164.93361431346415 56.97787143782138" r="35" strokeWidth="10" fill="none" cy="50" cx="50"><animateTransform keyTimes="0;1" values="0 50 50;360 50 50" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform"></animateTransform></circle><g></g></g></svg>
            </div>)}
            {
              !loading && crushes.length==0 ? (<div style={{width: "100%", textAlign: "center"}}>
                No likes
              </div>):!loading && lastPage && lastPage<=page && (<div style={{width: "100%", textAlign: "center"}}>
                No more likes
              </div>)
            }
            {/* bottom sentinel */}
            <div ref={bottomRef} style={{ height: 1 }} />
          </div>
        </div>
      </div>
    </>
  );
}