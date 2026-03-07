import Header from '../components/Header';
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

import Nouislider from "nouislider-react";
import { setIsLoading, setDateFilter,
} from "../store/userSlice";
//import { navigate } from "../navigationService";
import { useNavigate } from 'react-router';
import api from "../api";
import { useAppSelector, type ProfileState } from '../types';
import { useAppDispatch } from '../hooks/reduxHooks';

export default function Filter() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const {t} = useTranslation()
  const { isLoading, dateFilter } = useAppSelector((state) => state.user);
  
  const profileForm: ProfileState = useAppSelector((state) => state.profileForm);
  const [profile, setProfile] = useState<ProfileState>(profileForm);
  const [genders, setGenders] = useState([]);

  const onSlide = (render: unknown, handle: number, value: number[], un: unknown, percent: number[]) => {
    console.log("onSlide", render, handle, value, un, percent)
    //alert('hererrr')
    dispatch(setDateFilter({...dateFilter, min_age: value[0], max_age: value[1]}));
    //console.log('dateFilter', value, dateFilter)
  };

  // Get my profile from API
  const getMyProfile = async () => {
      dispatch(setIsLoading(true));
      try {
          const res = await api.get(`get-my-profile`);
          console.log(`get-my-profile`, res.data); // adjust to your API structure
          setProfile(res.data.profile); // adjust to your API structure
          if (dateFilter==null) {
            dispatch(setDateFilter({
              genders: ['men', 'women', 'other'],
              min_age: res.data.profile?.interested_min_age,
              max_age: res.data.profile?.interested_max_age,
              max_distance: res.data.profile?.interested_max_distance,
            }))
          }
          setGenders(res.data.genders)
      } catch (err) {
          console.error("Error fetching users:", err);
      }
      console.log('profile ik', genders, dateFilter, profile)
      dispatch(setIsLoading(false));
  };

  // Load data on page change
  useEffect(() => {
    getMyProfile();
    //dispatch(changeLanguage('fr'))
  }, []);

  
  const handleGendersChange = (name: string) => {
      /////////////////////////////////////////////////////////
      if (dateFilter?.genders.includes(name)) {
        const selectedGenders = dateFilter?.genders?.filter((x:string)=>x!=name)
        dispatch(setDateFilter({...dateFilter, genders: selectedGenders}))
      }else{
        dispatch(setDateFilter({...dateFilter, genders: [...dateFilter?.genders, name]}))
      }
      //console.log('final dateFilter', dateFilter, tab)
  };

  if (isLoading) {
      return (
          <>
              <Header showBackButton={true} title={"Date filter"} showWishList={false}/>
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
      <Header showBackButton={true} title={"Date filter"} showWishList={false}/>
      <div className="page-content space-top p-b50">
        <div className="container">
          <div className="card style-1">
            <div className="card-header">
              <h6 className="title font-w400 font-14 mb-0">Who you want to date</h6>
            </div>
            <div className="card-body">
              {genders?.map(( name , index) => {
                  return (
                      <div key={index} className="form-check">
                        <label className="form-check-label" htmlFor={`custom-filterCheck-${index}`}>
                          {t(name)}
                        </label>
                        <input className="form-check-input"
                          type="checkbox"
                          id={`custom-filterCheck-${index}`}
                          key={`filterCheck-${index}`}
                          name={name}
                          value={name}
                          checked={dateFilter?.genders?.includes(name)}
                          onChange={() => handleGendersChange(name)}
                         />
                      </div>
                  );
              })}
            </div>
          </div>
          <div className="card style-1">
            <div className="card-header">
              <h6 className="title font-w400 font-14 mb-0">Age</h6>
            </div>
            <div className="card-body">
              <div className="mb-3 title font-w600 font-16">
                <span className="example-val title slider-margin-value-min" style={{color: "var(--title)"}}>Between {dateFilter?.min_age} </span>
                <span className="example-val title slider-margin-value-max" style={{color: "var(--title)"}}>and {dateFilter?.max_age}</span>
              </div>
              <div style={{margin: "auto 10px"}}>
                <Nouislider
                  range={{ min: 18, max: 82 }}
                  start={[dateFilter?.min_age ?? 18, dateFilter?.max_age ?? 80]}
                  step={1}
                  onSlide={onSlide}
                  connect
                />
              </div>
            </div>
          </div>
          <div className="card style-1">
            <div className="card-header">
              <h6 className="title font-w400 font-14 mb-0">Distance</h6>
            </div>
            <div className="card-body">
              {dateFilter?.max_distance && (<div className="mb-3 title font-w600 font-16">
                <span className="example-val title slider-margin-value-min" style={{color: "var(--title)"}}>Up to  {dateFilter?.max_distance} kilometers only</span>
              </div>)}
              <div style={{ width: "100%", margin: "15px auto" }}>
                <Nouislider
                  /* start={[date_filter_max_distance]} */         // ✅ single value
                  start={dateFilter?.max_distance??80}         // ✅ single value
                  range={{ min: 18, max: 100 }}
                  connect={[true, false]} // ✅ fill only before the handle
                  onUpdate={(rendered) => dispatch(setDateFilter({...dateFilter, max_distance: Math.round(rendered[0])}))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer fixed">
        <div className="container">
          <a onClick={() => navigate('/home?reload=true', {state: {reloadHome: true}})} className="btn btn-lg btn-gradient w-100 dz-flex-box btn-shadow rounded-xl">Apply</a>
        </div>
      </div>
    </>
  );
}