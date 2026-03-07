import { Link } from 'react-router';

import Header from '../components/Header';
import { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';

import { setIsLoading, 
} from "../store/userSlice";
//import { navigate } from "../navigationService";
import api from "../api";

import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/swiper-bundle.css';
// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useAppDispatch } from '../hooks/reduxHooks';
import { useAppSelector } from '../types';

export default function Subscriptions() {
  const dispatch = useAppDispatch();
  const {t} = useTranslation()
  const { isLoading } = useAppSelector((state) => state.user);

  const swiperRef = useRef<any>(null);
  const [subscriptions, setSubscriptions] = useState<any>([]);
  const [activeSubscription, setActiveSubscription] = useState<any>(null);
  const [subscriptionIndex, setSubscriptionIndex] = useState<number>(0);

  // Get my profile from API
  const getSubscriptions = async () => {
      dispatch(setIsLoading(true));
      try {
          const res = await api.get(`get-subscriptions`);
          console.log(`get-subscriptions`, res.data); // adjust to your API structure
          setSubscriptions(res.data.subscriptions)
          setActiveSubscription(res.data.my_profile?.active_subscription)
      } catch (err) {
          console.error("Error :", err);
      }
      dispatch(setIsLoading(false));
  };

  // Load data on page change
  useEffect(() => {
    getSubscriptions();
    console.log('swiperRef', swiperRef)
    //dispatch(changeLanguage('fr'))
  }, []);

  if (isLoading) {
      return (
          <>
              <Header showBackButton={true} title={"Subscriptions"} showWishList={false} classes={`bg-gray-color`} />
              <div className="content-body bg-gray-color" style={{height: "100vh"}}>
                <div className="page-content space-top p-b65">
                    <div className="container fixed-full-area">
                        <div className="flex items-center justify-center h-screen bg-gray-100">
                            <div className="" style={{width: "100%", height: "70vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <svg className="loader-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style={{shapeRendering: "auto", display: "block", background: "transparent"}} width="50" height="50" xmlnsXlink="http://www.w3.org/1999/xlink"><g><circle strokeDasharray="164.93361431346415 56.97787143782138" r="35" strokeWidth="10" fill="none" cy="50" cx="50"><animateTransform keyTimes="0;1" values="0 50 50;360 50 50" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform"></animateTransform></circle><g></g></g></svg>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
          </>
      );
  }

  return (
    <>
      <Header showBackButton={true} title={"Subscriptions"} showWishList={false} classes={`bg-gray-color`} />
      <div className="content-body bg-gray-color" style={{height: "100vh"}}>
        <div className="page-content space-top p-b60">
          <div className="container"> 
            <div className="dz-subscribe-area">
              <div className="subscribe-area-top">
                <div className="swiper subscription-swiper2">
                  <Swiper
                      ref={swiperRef}
                      onSlideChange={(swiper) => {
                        //alert(swiper.activeIndex)
                        setSubscriptionIndex(swiper.activeIndex)
                      }}
                      spaceBetween={30}
                      speed={1500}
                      centeredSlides={true}
                      autoplay={{
                          delay: 3000,
                          disableOnInteraction: true,
                      }}
                      pagination={{
                          clickable: true,
                      }}
                      navigation={false}
                      modules={[Autoplay, Pagination, Navigation]}
                      className="mySwiper get-started"
                  >
                      {subscriptions?.map((subscription: any) => (
                          <SwiperSlide key={`slider${subscription.id}`}>
                              <div className={`subscribe-box ${subscription?.code}`}>
                                <h3 className="title">{subscription.name}</h3>
                                {activeSubscription?.code==subscription.code && (<div className="badge">Active</div>)}
                              </div>
                          </SwiperSlide>
                        ))
                      }
                  </Swiper>
                  <div className="swiper-btn">
                    <div className="swiper-pagination style-1 flex-1"></div>
                  </div>
                </div>
              </div>
              {subscriptions?.map((subscription: any, index: number) => (
                  subscriptionIndex === index && (<div key={subscription.id} className={`subscribe-content ${subscription?.code}`}>
                    <ul className="pricing-data">
                      {
                        subscription?.contents?.map((content: any) => (
                          <li className="list-true">
                            {((content.item.type=='boolean' && content.value==1)) && (<i className="icon feather icon-check"></i>)}
                            {((content.item.type=='boolean' && content.value==0) || (content.item.type=='int' && content.value==0)) && (<i className="icon feather icon-lock"></i>)}
                            {(content.item.type=='int' && content.value!=0 && content.value!=-1) && (<i>{content.value}</i>)}
                            <span>{content.name}</span>
                          </li>
                        ))
                      }
                    </ul>
                    {(activeSubscription===null || subscription.upgradable_to === true) && (
                        <div className="bottom-btn container bg-white text-center px-5">
                          <Link to={`/subscription-details/${subscription.id}`} className="btn btn-gradient dz-flex-box btn-shadow rounded-xl">
                          {activeSubscription===null?t('subscribe'):t('upgrade')}
                          </Link>
                        </div>
                      )
                    }
                  </div>)
                ))
              }
            </div>
          </div> 
        </div>
      </div>
    </>
  );
}