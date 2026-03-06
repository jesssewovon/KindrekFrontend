import { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import Header from '../components/Header';
import MenuBar from '../components/MenuBar';

import api from "../api";
import ScreenLoader from "../components/ScreenLoader";
import { setShowScreenLoader } from "../store/userSlice";
//import { setReactions } from "../store/profileFormSlice";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import type { AppDispatch } from '../store';
const MySwal = withReactContent(Swal);

export default function Explore() {
  const dispatch = useDispatch<AppDispatch>();
  const {t} = useTranslation()

  /* const { isLoading, dateFilter, reloadHomePage,
    user, isLoggedIn, showScreenLoader
  } = useSelector((state: RootState) => state.user); */

  const [openLoading, setOpenLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(0);

  const bottomRef = useRef(null)

  const getEvents = async (pageNum: number) => {
      if(lastPage && lastPage<=page) return
      console.log('getEvents', page, pageNum, events)
      setLoading(true);
      //alert(page)
      try {
          const res = await api.get(`/get-events?page=${pageNum}`, {params: {}});
          //const res = await api.get(`https://testnet-backend.piketplace.com/api/v1/index-loading?page=${page}`);
          setEvents([...events, ...res.data.events.data]); // adjust to your API structure
          setLastPage(res.data.events.last_page)
          //window.scrollTo(0, savedScroll || 0);
      } catch (err) {
          console.error("Error fetching users:", err);
      }
      console.log('events', events)
      setLoading(false);
      setOpenLoading(false);
  };
  
  const joinEvent = async (event: any, index: number) => {
      dispatch(setShowScreenLoader(true));
      try {
          const events_id = event.id
          const res = await api.post(`/join-event`, {events_id});
          if (res.data.status === true) {
            setEvents(prev=>{
              const newArray = [...prev]
              newArray.splice(index, 1)
              return newArray
            })
            MySwal.fire({ 
              title: "Info!",
              text: res.data.message,
              icon: "success",
              showConfirmButton: false,
              timer: 1500
            });
          }else{
            MySwal.fire({ 
              title: "Info!",
              text: res.data.message,
              icon: "error",
              showConfirmButton: false,
              timer: 1500
            });
          }
      } catch (err) {
          MySwal.fire({ 
            title: "Info!",
            text: t('an_error_occured'),
            icon: "error",
            showConfirmButton: false,
          });
          console.error("Error fetching users:", err);
      }
      dispatch(setShowScreenLoader(false));
  };

  useEffect(() => {
    getEvents(page)
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
            <Header showBackButton={true} title={"Explore"} showWishList={false}/>
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
      <Header showBackButton={true} title={"Explore"} showWishList={false}/>
      <MenuBar/>
      <div className="page-content space-top p-b60">
        <div className="container">
          <div className="row g-3">
            {events.map((event, index) => (
                <div key={`event${event.id}`} className="col-md-6 col-12">
                  <div className="dz-media-card style-3">
                    <div className="dz-media">
                      <img src={event.image} alt={event.title}/>
                    </div>
                    <div className="dz-content">
                      <h3 className="title">{event.title}</h3>
                      <p>{event.description}</p>
                      <a onClick={()=>joinEvent(event, index)} className="btn btn-light rounded-xl">
                        JOIN NOW
                      </a>
                    </div>
                  </div>
                </div>
              ))
            }
            {loading && (<div style={{width: "100%", textAlign: "center"}}>
              <svg className="loader-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style={{shapeRendering: "auto", display: "block", background: "transparent", margin: "auto"}} width="50" height="50" xmlnsXlink="http://www.w3.org/1999/xlink"><g><circle strokeDasharray="164.93361431346415 56.97787143782138" r="35" strokeWidth="10" fill="none" cy="50" cx="50"><animateTransform keyTimes="0;1" values="0 50 50;360 50 50" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform"></animateTransform></circle><g></g></g></svg>
            </div>)}
            {
              !loading && events.length==0 ? (
                <div style={{width: "100%", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", height: "80vh"}}>
                  <div style={{display: "block", width: "100%", textAlign: "center"}}>
                    <div style={{display: "block", width: "100%", textAlign: "center"}}>
                      <p>No events</p> 
                    </div>
                    <div style={{display: "block", width: "100%", textAlign: "center"}}>
                      <svg id="event-icon" width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14H16C16.5523 14 17 13.5523 17 13C17 12.4477 16.5523 12 16 12H8Z" fill="#152C70"></path> <path d="M7 17C7 16.4477 7.44772 16 8 16H12C12.5523 16 13 16.4477 13 17C13 17.5523 12.5523 18 12 18H8C7.44772 18 7 17.5523 7 17Z" fill="#152C70"></path> <path fillRule="evenodd" clipRule="evenodd" d="M7 2C7.55228 2 8 2.44772 8 3V4H16V3C16 2.44772 16.4477 2 17 2C17.5523 2 18 2.44772 18 3V4.10002C20.2822 4.56329 22 6.58104 22 9V17C22 19.7614 19.7614 22 17 22H7C4.23858 22 2 19.7614 2 17V9C2 6.58104 3.71776 4.56329 6 4.10002V3C6 2.44772 6.44772 2 7 2ZM20 10H4V17C4 18.6569 5.34315 20 7 20H17C18.6569 20 20 18.6569 20 17V10Z" fill="#152C70"></path> </g></svg>
                    </div>
                  </div>
                </div>
              ):!loading && lastPage && lastPage<=page && (<div style={{width: "100%", textAlign: "center"}}>
                No more events
              </div>)
            }
            {/* bottom sentinel */}
            {!openLoading && (<div ref={bottomRef} style={{ height: 1 }} />)}
            {/* <div className="col-md-6 col-12">
              <div className="dz-media-card style-3">
                <div className="dz-media">
                  <img src="../src/assets/images/explore/pic1.png" alt=""/>
                </div>
                <div className="dz-content">
                  <h3 className="title">Free Tonight</h3>
                  <p>Down for something spontaneous</p>
                  <a href="javascript:void(0);" className="btn btn-light rounded-xl">JOIN NOW</a>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="dz-media-card style-3">
                <div className="dz-media">
                  <img src="../src/assets/images/explore/pic2.png" alt=""/>
                </div>
                <div className="dz-content">
                  <h3 className="title">Looking for Love</h3>
                  <p>Sweep me off my feet</p>
                  <a href="javascript:void(0);" className="btn btn-light rounded-xl">JOIN NOW</a>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="dz-media-card style-3">
                <div className="dz-media">
                  <img src="../src/assets/images/explore/pic3.png" alt=""/>
                </div>
                <div className="dz-content">
                  <h3 className="title">Let's be Friends</h3>
                  <p>Maybe even besties</p>
                  <a href="javascript:void(0);" className="btn btn-light rounded-xl">JOIN NOW</a>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="dz-media-card style-3">
                <div className="dz-media">
                  <img src="../src/assets/images/explore/pic4.png" alt=""/>
                </div>
                <div className="dz-content">
                  <h3 className="title">Coffee Date</h3>
                  <p>Take me to your favorite cafe</p>
                  <a href="javascript:void(0);" className="btn btn-light rounded-xl">JOIN NOW</a>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="dz-media-card style-3">
                <div className="dz-media">
                  <img src="../src/assets/images/explore/pic5.png" alt=""/>
                </div>
                <div className="dz-content">
                  <h3 className="title">Get Photo Verified</h3>
                  <p>Get Verified</p>
                  <a href="javascript:void(0);" className="btn btn-light rounded-xl">JOIN NOW</a>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <ScreenLoader/>
    </>
  );
}