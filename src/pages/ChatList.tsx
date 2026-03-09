import { Link } from 'react-router';

import { useEffect, useState } from 'react';

/* import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal); */

import api from "../api";

import { setIsLoading } from '../store/userSlice';

import Header from '../components/Header';
import MenuBar from '../components/MenuBar';

import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/swiper-bundle.css';
// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import moment from 'moment';
import { useAppSelector, type ProfileState } from '../types';
import { useAppDispatch } from '../hooks/reduxHooks';

export default function ChatList() {
  //const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { isLoading, user } = useAppSelector((state) => state.user);

  const [chatList, setChatList] = useState([]);
  const [onlineList, setOnlineList] = useState<ProfileState[]>([]);

  // Load data on page change
  useEffect(() => {
    getChatList();
  }, []);

  const getChatList = async () => {
      dispatch(setIsLoading(true));
      try {
          const res = await api.get(`/get-chat-list`);
          console.log(`/get-chat-list`, res.data); // adjust to your API structure
          //setReaction(res.data.reaction);
          setChatList(res.data.chatList.data);
          setOnlineList(res.data.onlineList);
      } catch (err) {
          console.error("Error fetching users:", err);
      }
      dispatch(setIsLoading(false));
  };
  
  const getCorresponder = (chat: any) => {
      return user.profile.id===chat.sender.id?chat.receiver:chat.sender
  };
  
  if (isLoading) {
    return (
        <>
            <Header showBackButton={true} title={"Chats & Matches"} showWishList={false}/>
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
      <Header showBackButton={true} title={"Chats & Matches"} showWishList={false}/>
      <MenuBar/>
      <div className="page-content space-top p-b60">
            <div className="container">
              <div className="swiper chat-swiper">
                <Swiper
                    spaceBetween={15}
                    slidesPerView={'auto'}
                    speed={500}
                    autoplay={false}
                    loop={false}
                    a11y={false}
                    freeMode={true}
                    pagination={false}
                    navigation={false}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper get-started"
                >
                    {onlineList?.map((profile: ProfileState) => (
                        <SwiperSlide key={`online-${profile.id}`}>
                            <Link to={`/chat/${profile?.id}`} className={`recent ${profile.isOnline?'active':''}`}>                
                              <div className="media media-60 rounded-circle">
                                <img src={profile?.imageFirst} alt={profile?.firstname}/>
                              </div>
                              <span>{profile?.firstname}</span>
                            </Link>
                        </SwiperSlide>
                      ))
                    }
                </Swiper>
              </div>
              <div className="title-bar">
                <h6 className="title">Message</h6>
              </div>
              {chatList.length>0?(
                <ul className="message-list">
                  {chatList?.map((chat: any, index) => {
                      return (
                          <li key={`chat-${index}`} className={` ${getCorresponder(chat)?.isOnline?'active':''}`}>
                            <Link to={`/chat/${getCorresponder(chat)?.id}`}>
                              <div className="media media-60">
                                <img src={getCorresponder(chat)?.imageFirst} alt={getCorresponder(chat)?.firstname}/>
                              </div>
                              <div className="media-content">
                                <div>
                                  <h6 className="name">{getCorresponder(chat)?.firstname}</h6>
                                  <p className="last-msg" style={{}}>{chat.last_message?.message}</p>
                                </div>
                                {/* .break-word-customer{
                                    width: 120px;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    display: inline-block;
                                } */}
                                {chat.last_message && (<div className="right-content">
                                  {/* <span className="date">
                                    {chat.last_message?.sentTimeAgo}
                                  </span> */}
                                  <span className="date">
                                    {moment(chat.last_message?.created_at).fromNow()}
                                  </span>
                                  <div className="seen-btn active dz-flex-box">
                                    {chat.messages_count===0?
                                      (<i className="icon feather icon-check"></i>):
                                      chat.messages_count
                                    }
                                  </div>
                                </div>)}
                              </div>
                            </Link>
                          </li>
                      );
                  })}
                </ul>
              ):(
                <div style={{display: "flex", height: "60vh", alignItems: "center", justifyContent: "center"}}>
                  <div style={{display: "block", width: "100%", textAlign: "center"}}>
                    <div style={{display: "block", width: "100%", textAlign: "center"}}>
                      No messages 
                    </div>
                    <div style={{display: "block", width: "100%", textAlign: "center"}}>
                      <svg id="message-icon" width="64px" height="64px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect id="view-box" width="24" height="24" fill="none"></rect> <path id="Shape" d="M6.485,18.519a9.891,9.891,0,0,1-4.876.981c-.285,0-.584-.006-.887-.018a.739.739,0,0,1-.65-.432.738.738,0,0,1,.085-.775,11.192,11.192,0,0,0,2.072-3.787A9.751,9.751,0,1,1,10.751,19.5,9.661,9.661,0,0,1,6.485,18.519ZM6.808,17a8.247,8.247,0,1,0-3.139-3.015.75.75,0,0,1,.092.535A10.189,10.189,0,0,1,2.2,17.99a7.2,7.2,0,0,0,3.816-.947.745.745,0,0,1,.431-.136A.756.756,0,0,1,6.808,17Zm-.057-4.5a.75.75,0,0,1,0-1.5h7a.75.75,0,0,1,0,1.5Zm0-4a.75.75,0,0,1,0-1.5h5a.75.75,0,1,1,0,1.5Z" transform="translate(1.249 2.25)" fill="#141124"></path> </g></svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
      </div>
    </>
  );
}