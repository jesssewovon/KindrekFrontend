//App.tsx
import { useEffect, useState } from 'react'

import { Routes, Route, useNavigate } from 'react-router';

import Landing from './pages/Landing';
import Home from './pages/Home';
import About from './pages/About';
import ScrollPage from './pages/ScrollPage';
import Profile from './pages/Profile';
import WishList from './pages/WishList';
import ChatList from './pages/ChatList';
import Explore from './pages/Explore';
import Chat from './pages/Chat';
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';
import Filter from './pages/Filter';
import ProfileDetails from './pages/ProfileDetails';
import Donation from './pages/Donation';
import Subscriptions from './pages/Subscriptions';
import SubscriptionDetails from './pages/SubscriptionDetails';
import PaymentVerification from './pages/PaymentVerification';

import FirstName from './pages/Registration/FirstName';
import BirthDate from './pages/Registration/BirthDate';
import Gender from './pages/Registration/Gender';
import SexualOrientation from './pages/Registration/SexualOrientation';
import InterestedGender from './pages/Registration/InterestedGender';
import RelationshipGoal from './pages/Registration/RelationshipGoal';
import Images from './pages/Registration/Images';

import SideBar from './components/SideBar';

import { ThemeProvider } from "./ThemeContext";

import { AliveScope, KeepAlive } from "react-activation";

import { useSelector, useDispatch } from "react-redux";

import { setIsDarkTheme, setIsLoading,
  setShowScreenLoader, 
 } from "./store/userSlice";
import { updateField } from "./store/profileFormSlice";

import { setNavigator } from "./navigationService";

import { persistor } from "./store/index";
import type { AppDispatch, RootState } from "./store/index";
import { useVersionCheck } from "./hooks/useVersionCheck";
import { useBeforeRouteChange } from "./hooks/useBeforeRouteChange";

import moment from 'moment';
import './moment/fr';
import './moment/es';
import './moment/ar';
import './moment/zh-cn';//Simplified chinese
import './moment/vi';//Vietnamese
import './moment/fil';//Filipino
import './moment/id';//Indonesian
import './moment/ko';//Korean
import './moment/th';//Thailand

import i18n from './i18n';
//import { history } from "./navigationService";

function NavigatorSetter() {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);
  return null;
}

function App() {
  // run code when changing page
  useBeforeRouteChange(() => {
    dispatch(setShowScreenLoader(false))
    //console.log("useBeforeRouteChange", location)
  })
  
  // run version check at startup
  useVersionCheck({ persistor });

  const [scrollY, setScrollY] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const { isDarkTheme } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    setShowScreenLoader(false);
    moment.locale(i18n.language)
    dispatch(setIsDarkTheme(isDarkTheme))
    dispatch(setIsLoading(false))
    //dispatch(setIsLoggedIn(false))
    dispatch(updateField({ field: "images", value: {} }));
  }, [dispatch]);
  return (
    <>
      <ThemeProvider>
        <AliveScope>
          <SideBar/>
          <NavigatorSetter /> {/* ✅ makes navigate available everywhere */}
          {/* <HistoryRouter history={history}> */}
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={
                <KeepAlive id="home">
                  <Home savedScroll={scrollY} onSaveScroll={setScrollY} />
                </KeepAlive>
              } />
              <Route path="/about" element={<About />} />
              <Route id="scroll-page" path="/scroll-page" element={
                <KeepAlive>
                  <ScrollPage savedScroll={scrollY} onSaveScroll={setScrollY} />
                </KeepAlive>
              } />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wishlist" element={
                <KeepAlive id="wishlist">
                  <WishList savedScroll={scrollY} onSaveScroll={setScrollY} />
                </KeepAlive>
              } />
              <Route path="/chat-list" element={<ChatList />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/chat/:corresponding_profile_id" element={<Chat />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/filter" element={<Filter />} />
              <Route path="/profile-details/:id" element={<ProfileDetails />} />
              <Route path="/donation" element={<Donation />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/subscription-details/:id" element={<SubscriptionDetails />} />
              <Route path="/payment-verification" element={<PaymentVerification />} />
              <Route path="/registration-firstname" element={<FirstName />} />
              <Route path="/registration-birth-date" element={<BirthDate />} />
              <Route path="/registration-gender" element={<Gender />} />
              <Route path="/registration-sexual-orientation" element={<SexualOrientation />} />
              <Route path="/registration-interested-gender" element={<InterestedGender />} />
              <Route path="/registration-relationship-goal" element={<RelationshipGoal />} />
              <Route path="/registration-images" element={<Images />} />
            </Routes>
          {/* </HistoryRouter> */}
        </AliveScope>
      </ThemeProvider>
    </>
  )
}

export default App
