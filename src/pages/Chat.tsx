import { useNavigate, useParams } from 'react-router';

import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from 'react';

//import Swal from 'sweetalert2'
//import withReactContent from 'sweetalert2-react-content'
//const MySwal = withReactContent(Swal);

import MessageLeft from '../components/MessageLeft';
import MessageRight from '../components/MessageRight';
import api from "../api";

import moment from 'moment';

import { setIsSaving } from '../store/userSlice';
import { useAppSelector, type ChatMessageType, type ProfileState } from '../types';
import { useAppDispatch } from '../hooks/reduxHooks';

export default function Chat() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { corresponding_profile_id } = useParams();
  const { user, isSaving } = useAppSelector((state) => state.user);

  const profileForm: ProfileState = useAppSelector((state) => state.profileForm);
  const [profile, setProfile] = useState<ProfileState>(profileForm);
  const [correspondingProfile, setCorrespondingProfile] = useState<ProfileState|null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [messageText, setMessageText] = useState<string>('');

  const [isLoadingNewMessages, setIsLoadingNewMessages] = useState<boolean>(false);
  const [isLoadingOldMessages, setIsLoadingOldMessages] = useState<boolean>(false);
  
  //const [isTopReached, setIsTopReached] = useState<boolean>(false);
  //const [isBottomReached, setIsBottomReached] = useState<boolean>(false);

  const [newMessages, setNewMessages] = useState<ChatMessageType[]>([]);
  const [oldMessages, setOldMessages] = useState<ChatMessageType[]>([]);
  const [hasOldMessages, setHasOldMessages] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageSent, setMessageSent] = useState<boolean>(false);
  const [hasNewUnreadMessages, setHasNewUnreadMessages] = useState<boolean>(false);
  const lastMessageIdRef = useRef<any>(null);

  const intervalRef = useRef<any>(null);

  const bottomRef = useRef<any>(null);

  const startTimer = () => {
      if (intervalRef.current) return; // already running
      intervalRef.current = setInterval(() => {
        console.log('Running getNewMessages')
        //alert('hhh')
        getNewMessages()
        //console.log("Tick... reactionsRef", reactionsRef.current, reactions);
      }, 30000);
      console.log('Timer started')
  };
  const stopTimer = () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('Timer stoped')
  };
  const scrollToBottom = () => {
      setTimeout(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
      }, 100);
  };
  
  const getNewMessages = async () => {
      //console.log('In getNewMessages', lastMessageIdRef.current)
      if (!lastMessageIdRef.current) {
        //setIsBottomReached(false)
        return
      }
      //console.log("getNewMessages", corresponding_profile_id, lastMessageIdRef.current)
      setIsLoadingNewMessages(true)
      try {
          const res = await api.get(`/get-new-messages/${corresponding_profile_id}`, {params: {last_message_id: lastMessageIdRef.current}});
          console.log(`/get-new-messages`, res.data); // adjust to your API structure
          setNewMessages(res.data.messages);
          if (res.data.messages.length) {
            lastMessageIdRef.current = res.data.messages[res.data.messages.length-1]?.id;
          }
      } catch (err) {
          console.error("Error fetching users:", err);
      }
      //setIsBottomReached(false)
      setIsLoadingNewMessages(false)
  };
  const getOldMessages = async () => {
      //console.log('in getOldMessages')
      const first_message_id = messages[0]?.id
      if (!first_message_id) {
        //setIsTopReached(false)
        return
      }
      setIsLoadingOldMessages(true)
      //console.log("getOldMessages", corresponding_profile_id, messages, first_message_id)
      try {
          const res = await api.get(`/get-old-messages/${corresponding_profile_id}`, {params: {first_message_id}});
          //console.log(`/get-old-messages`, res.data); // adjust to your API structure
          setOldMessages(res.data.messages);
          setHasOldMessages(res.data.hasOldMessages);
      } catch (err) {
          console.error("Error fetching users:", err);
      }
      setIsLoadingOldMessages(false)
      //setIsTopReached(false)
  };
  const sendMessage = async () => {
      //alert(messageText)
      console.log("sendMessage", corresponding_profile_id)
      dispatch(setIsSaving(true));
      try {
          const res = await api.post(`/send-message`, {corresponding_profile_id, messageText});
          console.log(`/send-message`, res.data); // adjust to your API structure
          if (res.data.status === true) {
            setMessageText('')
            setMessageSent(true)
          }
          setCorrespondingProfile(res.data.corresponding_profile);
          //setNewMessages(res.data.newMessages);
          getNewMessages()
      } catch (err) {
          console.error("Error fetching users:", err);
      }
      dispatch(setIsSaving(false));
  };

  const handleMessageInput = (e: any) => {
      setMessageText(e.target.value)
  };
  
  const setMessagesRead = () => {
      setHasNewUnreadMessages(false);
      scrollToBottom()
  };

  const getChatData = async () => {
      console.log("getChatData", corresponding_profile_id)
      setLoading(true);
      try {
          const res = await api.get(`/get-chat-data/${corresponding_profile_id}`);
          console.log(`/get-chat-data`, res.data); // adjust to your API structure
          //setReaction(res.data.reaction);
          setProfile(res.data.my_profile);
          setCorrespondingProfile(res.data.corresponding_profile);
          setMessages(res.data.messages);
          setHasOldMessages(res.data.hasOldMessages);
          if (res.data.messages.length) {
            lastMessageIdRef.current = res.data.messages[res.data.messages.length-1]?.id;
          }
      } catch (err) {
          console.error("Error fetching users:", err);
      }
      setLoading(false);
      scrollToBottom()
  };
  useEffect(() => {
    startTimer()
    getChatData()
    return ()=>{
      stopTimer()
    }
  }, []);
  
  useEffect(() => {
  }, [messages]);

  useEffect(() => {
   console.log('old loaded messages', messages)
   setMessages([...oldMessages, ...messages]);
  }, [oldMessages]);
  
  useEffect(() => {
   if (messageSent) {
    setMessageSent(false)
    scrollToBottom()
   }
  }, [messageSent]);

  useEffect(() => {
    //console.log('new loaded messages', newMessages[0], messages)
    //alert('new loaded')
   setMessages([...messages, ...newMessages]);
   
   if (newMessages.length) {
    //scrollToBottom()
    setHasNewUnreadMessages(false)
    newMessages.some((val: ChatMessageType) => {
      if (val.sender_profiles_id!=profile.id) {
        setHasNewUnreadMessages(true)
        return true
      }
    })
   }
  }, [newMessages]);

  useEffect(() => {
    const bottomObserver = new IntersectionObserver((entries) => {
      console.log('gffffffffffffffffffff')
      if (entries[0].isIntersecting) {
        console.log("🔽 Bottom visible → load");
        setMessagesRead()
      }
    }, {threshold: 1});

    if (bottomRef.current) bottomObserver.observe(bottomRef.current);

    return () => {
      if (bottomRef.current) {
        bottomObserver.unobserve(bottomRef.current);
      }

    };
  }, [loading]);

  return (
    <>
      {loading?
        (
          <div className="page-content space-top p-b65">
              <div className="container fixed-full-area">
                  <div className="flex items-center justify-center h-screen bg-gray-100">
                      <div className="" style={{width: "100%", height: "70vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
                          <svg className="loader-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style={{shapeRendering: "auto", display: "block", background: "transparent"}} width="50" height="50" xmlnsXlink="http://www.w3.org/1999/xlink"><g><circle strokeDasharray="164.93361431346415 56.97787143782138" r="35" strokeWidth="10" fill="none" cy="50" cx="50"><animateTransform keyTimes="0;1" values="0 50 50;360 50 50" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform"></animateTransform></circle><g></g></g></svg>
                      </div>
                  </div>
              </div>
          </div>
        ):
        (
          <>
            <header className="header header-fixed bg-white">
              <div className="container">
                <div className="header-content">
                  <div className="left-content me-3">
                    <a onClick={() => navigate(-1)} className="back-btn">
                      <i className="icon feather icon-chevron-left"></i>
                    </a>
                  </div>
                  <div onClick={() => navigate(`/profile-details/${correspondingProfile?.id}`)} className="mid-content d-flex align-items-center text-start">
                    <a style={{position: "relative"}} className="media media-40 rounded-circle me-3">
                      <img src={correspondingProfile?.imageFirst} alt="/"/>
                      {correspondingProfile?.isOnline && (<span style={{position: "absolute", width: "10px", height: "10px", backgroundColor: "#55D866", bottom: "0", left: "0", borderRadius: "50%", border: "1px solid #000"}}></span>)}
                    </a>
                    <div>
                      <h6 className="title">{correspondingProfile?.firstname}, {correspondingProfile?.age}</h6>
                      {correspondingProfile?.isOnline ?
                        (<span>Online</span>):
                        (<span>{correspondingProfile?.onlineTimeAgo}</span>)
                      }
                    </div>  
                  </div>
                  {/* <div className="right-content d-flex align-items-center">
                    <a className="dz-icon btn btn-primary light">
                      <i className="fa-solid fa-phone"></i>
                    </a>
                    <a className="dz-icon me-0 btn btn-primary light">
                      <i className="fa-solid fa-video"></i>
                    </a>
                  </div> */}
                </div>
              </div>
            </header>
            <div className="page-content space-top p-b60 message-content bg-gray-color" style={{minHeight: "100vh"}}>
              <div className="container" style={{overflowY: "hidden"}}>
                <div className="chat-box-area"
                  style={{
                    //height: "80vh",
                    //height: "calc(100vh - 120px)",
                    /* height: "calc(400px)",
                    width: "100%", */
                    //overflowY: "auto",
                    //border: "1px solid #ccc",
                  }}
                >
                  {/* top sentinel */}
                  {/* <div ref={topRef} style={{ height: 1 }} /> */}
                  {
                    !hasOldMessages?
                    (
                      <div style={{width: "100%", textAlign: "center"}}>
                        No old messages<hr/>
                      </div>
                    ):
                    (
                      !isLoadingOldMessages ? (
                        <div style={{width: "100%", textAlign: "center"}}>
                          <button onClick={() => getOldMessages()} className="btn mb-2 me-2 btn-light rounded-xl">
                              {t('load old messages')}
                          </button>
                        </div>
                      ):(<div style={{width: "100%", textAlign: "center"}}>
                        <svg className="loader-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style={{shapeRendering: "auto", display: "block", background: "transparent", margin: "auto"}} width="50" height="50" xmlnsXlink="http://www.w3.org/1999/xlink"><g><circle strokeDasharray="164.93361431346415 56.97787143782138" r="35" strokeWidth="10" fill="none" cy="50" cx="50"><animateTransform keyTimes="0;1" values="0 50 50;360 50 50" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform"></animateTransform></circle><g></g></g></svg>
                      </div>)
                    )
                  }
                  {/* DISPLAYING MESSAGES */}
                  {messages?.map((message, index) => {
                      return (
                        <div key={index}>
                          {
                            !messages[index-1]?.created_at?.includes(message.created_at.substr(0, 10)) &&
                            (
                              <div style={{textAlign: "center"}}>
                                <span className="active-date">
                                  {moment(message.created_at).format('ll')}
                                </span>
                              </div>
                            )
                          }
                          {
                            message.sender_profiles_id==user.profile.id?
                            (<MessageRight key={`right-${index}`} message={message.message} time={moment(message.created_at).format('LT')}/>)
                            :(<MessageLeft key={`left-${index}`} message={message.message} time={moment(message.created_at).format('LT')}/>)
                          }
                        </div>
                      );
                  })}

                  {isLoadingNewMessages && (<div style={{width: "100%", textAlign: "center"}}>
                    <svg className="loader-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style={{shapeRendering: "auto", display: "block", background: "transparent", margin: "auto"}} width="50" height="50" xmlnsXlink="http://www.w3.org/1999/xlink"><g><circle strokeDasharray="164.93361431346415 56.97787143782138" r="35" strokeWidth="10" fill="none" cy="50" cx="50"><animateTransform keyTimes="0;1" values="0 50 50;360 50 50" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform"></animateTransform></circle><g></g></g></svg>
                  </div>)}
                  {/* bottom sentinel */}
                  <div ref={bottomRef} style={{ height: 1 }} />
                </div>
              </div> 
            </div>
            <footer className="footer border-top fixed bg-white">
                <div className="container p-2">
                    <div className="chat-footer">
                        <div>
                            <div className="form-group">
                                <div className="input-wrapper message-area" style={{display: "flex", alignItems: "center", position: "relative"}}>
                                    <div className="append-media"></div>
                                    <input value={messageText} onChange={handleMessageInput} type="text" className="form-control" placeholder="Send message..." style={{border: "0", height: "45px", marginRight: "15px"}}/>
                                    <button disabled={messageText==''} onClick={sendMessage} className="btn-chat" style={{border: "0"}}>
                                      {isSaving!==true?(<i className="icon feather icon-send"></i>):
                                      (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style={{shapeRendering: "auto", display: "block", background: "transparent"}} width="34" height="34" xmlnsXlink="http://www.w3.org/1999/xlink"><g><circle strokeDasharray="164.93361431346415 56.97787143782138" r="35" strokeWidth="10" stroke="#fff" fill="none" cy="50" cx="50"><animateTransform keyTimes="0;1" values="0 50 50;360 50 50" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform"></animateTransform></circle><g></g></g></svg>)}
                                    </button>
                                    {hasNewUnreadMessages && (<span onClick={()=>{setMessagesRead()}} style={{position: "absolute", left: "0", top: "-15px", backgroundColor: "red", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%"}}>
                                      1
                                    </span>)}
                                </div>
                            </div>
                        </div>
                    </div>    
                </div>
            </footer>
          </>
        )
      }
    </>
  );
}