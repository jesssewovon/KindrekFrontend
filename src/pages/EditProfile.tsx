import Header from '../components/Header';
import { useState, useEffect } from "react";
import { setIsLoading } from "../store/userSlice";
import { updateProfile } from "../store/profileFormSlice";
import api from "../api";
import LoaderWhite from '../components/LoaderWhite';
import Lock from '../components/Lock';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useTranslation } from 'react-i18next';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useAppSelector, type ProfileState } from '../types';
import { useAppDispatch } from '../hooks/reduxHooks';
const MySwal = withReactContent(Swal);

export default function EditProfile() {
  const dispatch = useAppDispatch();
  const {t} = useTranslation()
  const { isLoading, user, settings, isSaving } = useAppSelector((state) => state.user);
  const profileForm: ProfileState = useAppSelector((state) => state.profileForm);
  console.log('profileForm', profileForm)

  //const [subscriptionData, setSubscriptionData] = useState(user.profile?.subscriptionData);
  const subscriptionData = user.profile?.subscriptionData;

  const [profile, setProfile] = useState<ProfileState>(profileForm);
  const [interestsForm, setInterestsForm] = useState<any[]>([]);
  const [relationshipGoals, setRelationshipGoals] = useState<string[]>([]);
  const [sexualOrientation, setSexualOrientation] = useState<any[]>([]);
  const [genders, setGenders] = useState<string[]>([]);

  const [showFirstnameOffCanvas, setShowFirstnameOffCanvas] = useState(false);
  const handleFirstnameOffCanvasClose = () => setShowFirstnameOffCanvas(false);
  const handleFirstnameOffCanvasShow = () => setShowFirstnameOffCanvas(true);

  const [showAboutmeOffCanvas, setShowAboutmeOffCanvas] = useState(false);
  const handleAboutmeOffCanvasClose = () => setShowAboutmeOffCanvas(false);
  const handleAboutmeOffCanvasShow = () => {
    if (subscriptionData['control profile']===false) {
      subscriptionMessage()
      return
    }
    setShowAboutmeOffCanvas(true);
  }

  const [showBirthdateOffCanvas, setShowBirthdateOffCanvas] = useState(false);
  const handleBirthdateOffCanvasClose = () => setShowBirthdateOffCanvas(false);
  const handleBirthdateOffCanvasShow = () => setShowBirthdateOffCanvas(true);

  const [showGenderOffCanvas, setShowGenderOffCanvas] = useState(false);
  const handleGenderOffCanvasClose = () => setShowGenderOffCanvas(false);
  const handleGenderOffCanvasShow = () => setShowGenderOffCanvas(true);
  
  const [showInterestsOffCanvas, setShowInterestsOffCanvas] = useState(false);
  const handleInterestsOffCanvasClose = () => setShowInterestsOffCanvas(false);
  const handleInterestsOffCanvasShow = () => {
    if (subscriptionData['control profile']===false) {
      subscriptionMessage()
      return
    }
    setShowInterestsOffCanvas(true);
  }
  
  const [showRelationshipGoalOffCanvas, setShowRelationshipGoalOffCanvas] = useState(false);
  const handleRelationshipGoalOffCanvasClose = () => setShowRelationshipGoalOffCanvas(false);
  const handleRelationshipGoalOffCanvasShow = () => setShowRelationshipGoalOffCanvas(true);
  
  const [showSexualOrientationOffCanvas, setShowSexualOrientationOffCanvas] = useState(false);
  const handleSexualOrientationOffCanvasClose = () => setShowSexualOrientationOffCanvas(false);
  const handleSexualOrientationOffCanvasShow = () => setShowSexualOrientationOffCanvas(true);

  // Get my profile from API
  const getMyProfile = async () => {
      dispatch(setIsLoading(true));
      try {
          const res = await api.get(`/get-my-profile`);
          console.log(`get-my-profile`, res.data); // adjust to your API structure
          setProfile(res.data.profile); // adjust to your API structure
          setInterestsForm(res.data.interest_form); // adjust to your API structure
          setRelationshipGoals(res.data.relationship_goals); // adjust to your API structure
          setSexualOrientation(res.data.sexual_orientation_form); // adjust to your API structure
          setGenders(res.data.genders); // adjust to your API structure
      } catch (err) {
          console.error("Error fetching users:", err);
      }
      console.log('profile', profile)
      dispatch(setIsLoading(false));
  };

  // Load data on page change
  useEffect(() => {
    getMyProfile();
  }, []);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      //console.log("onFileChange", event.target.name, event.target.files[0], typeof event.target.files[0]);
          const profileFormImagesUpdate = {...profile?.images,
              [event.target.name]: event.target.files?event.target.files[0]:"",
          }
          setProfile({ ...profile, images: profileFormImagesUpdate });
    };

  const handleFirstnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); // prevent the default action
    setProfile({ ...profile, firstname: e.target.value });
  };
  
  const handleAboutmeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault(); // prevent the default action
    setProfile({ ...profile, about_me: e.target.value });
  };
  
  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); // prevent the default action
    setProfile({ ...profile, birthdate: e.target.value });
  };
  
  const handleGenderChange = (gender: string) => {
    setProfile({ ...profile, gender: gender });
    setShowGenderOffCanvas(false)
  };
  
  const handleInterestAddOnClick = (position: number) => {
      //alert('handleInterestAddOnClick')
      const updatedInterestsForm = interestsForm.map((item: any, index) => {
          console.log('updatedInterestsForm', item, index, position)
          if (index === position) {
              //alert('index === position')
              //const it = { ...item, value: !item.value }
              const it = {name: item.name, value: !item.value }
              console.log('it', it)
              return it
          }
          return item
      });
      setInterestsForm(updatedInterestsForm);
      setProfile({ 
        ...profile,
        interests: updatedInterestsForm?.
          filter(x=>x.value===true)?.
          map(x=>x.name)
      });
  }
  const handleSexualOrientationChange = (position: number) => {
      const updatedSexualOrientation = sexualOrientation.map((item: any, index) => {
          console.log('updatedSexualOrientation', item, index, position)
          if (index === position) {
              const it = {name: item.name, value: !item.value }
              console.log('it', it)
              return it
          }
          return item
      });
      setSexualOrientation(updatedSexualOrientation);
      setProfile({ 
        ...profile,
        sexual_orientation: updatedSexualOrientation?.
          filter(x=>x.value===true)?.
          map(x=>x.name)
      });
  }
  const handleRelationshipGoalChange = (value: string) => {
      //console.log('test', value)
      setProfile({ ...profile, relationship_goal: value });
      setShowRelationshipGoalOffCanvas(false)
  };
  const displayInterests = () => {
      return profile?.interests?.map(x=>t(x))?.join(', ')
  };
  
  const displaySexualOrientation = () => {
      return profile?.sexual_orientation?.
        map(x=>t(x))?.
        join(', ')
  };
  
  const displayProfileImage = (type: string) => {
      if (typeof profile.images?.[type] === "string") {
        return profile.images[type]
      }
      if (typeof profile.images?.[type] === "object") {
        return URL.createObjectURL(profile.images?.[type])
      }
      return '/images/recent-pic/drop-bx.png'
  };

  const saveProfile = async () => {
      dispatch(updateProfile(profile));
  };
  
  const subscriptionMessage = async () => {
      MySwal.fire({ 
          title: "Info!",
          text: t('subscribe to have full control on profile'),
          icon: "error",
          showConfirmButton: true,
      });
  };

  if (isLoading) {
      return (
          <>
              <Header showBackButton={true} title={"Edit profile"} showWishList={false}/>
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
      <Header showBackButton={true} title={"Edit profile"} showWishList={false}/>
      <div className="page-content space-top p-b65">
        <div className="container"> 
          <div className="row g-3 mb-3" data-masonry='{"percentPosition": true }'>
            <div className="col-8">
              <div className="dz-drop-box style-2">
                <div className="drop-bx bx-lg">
                  <div className="imagePreview" style={{backgroundImage: `url(${displayProfileImage('image1')})`}}>
                    <div  className="remove-img remove-btn d-none"><i className="icon feather icon-x"></i></div>
                    <input type='file' onChange={onFileChange} name="image1" className="form-control d-none imageUpload"  id="imageUpload" accept=".png, .jpg, .jpeg"/>
                    <label htmlFor="imageUpload"></label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="row g-3">
                <div className="col-12">
                  <div className="dz-drop-box style-2" style={{overflow: "hidden"}}>
                    <img src="/images/recent-pic/drop-bx.png" alt=""/>
                    <div className="drop-bx">
                      <div className="imagePreview" style={{backgroundImage: `url(${displayProfileImage('image2')})`}}>
                        <div  className="remove-img remove-btn d-none"><i className="icon feather icon-x"></i></div>
                        <input type='file' onChange={onFileChange} name="image2" className="form-control d-none imageUpload"  id="imageUpload2" accept=".png, .jpg, .jpeg"/>
                        <label htmlFor="imageUpload2"></label>
                      </div>
                    </div>
                    {subscriptionData['control profile']===false && (<div onClick={()=>subscriptionMessage()} className={``} style={{position: "absolute", top: "0", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center"}}>
                     <Lock/>
                    </div>)}
                  </div>
                </div>
                <div className="col-12">
                  <div className="dz-drop-box style-2" style={{overflow: "hidden"}}>
                    <img src="/images/recent-pic/drop-bx.png" alt=""/>
                    <div className="drop-bx">
                      <div className="imagePreview" style={{backgroundImage: `url(${displayProfileImage('image3')})`}}>
                        <div  className="remove-img remove-btn d-none"><i className="icon feather icon-x"></i></div>
                        <input type='file' onChange={onFileChange} name="image3" className="form-control d-none imageUpload"  id="imageUpload3" accept=".png, .jpg, .jpeg"/>
                        <label htmlFor="imageUpload3"></label>
                      </div>
                    </div>
                    {subscriptionData['control profile']===false && (<div onClick={()=>subscriptionMessage()} className={``} style={{position: "absolute", top: "0", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center"}}>
                     <Lock/>
                    </div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card style-3">
            <div className="card-header">
              <h6 className="title mb-0 font-14 font-w500">Firstname</h6>
            </div>
            <div className="card-body">
              <a onClick={handleFirstnameOffCanvasShow} className="setting-input" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom3" aria-controls="offcanvasBottom">
                <span>{profile.firstname}</span>
                <i className="icon feather dz-flex-box icon-chevron-right ms-auto me-0"></i>
              </a>
            </div>
          </div>
          
          <div className="card style-3">
            <div className="card-header">
              <h6 className="title mb-0 font-14 font-w500">About me</h6>
            </div>
            <div className="card-body">
              <a onClick={handleAboutmeOffCanvasShow} className="setting-input" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom3" aria-controls="offcanvasBottom">
                <span>{profile.about_me}</span>
                {
                  subscriptionData['control profile']===false?
                  (
                    <i className="dz-flex-box  ms-auto"><Lock/></i>
                  ):
                  (
                    <i className="icon feather dz-flex-box icon-chevron-right ms-auto me-0"></i>
                  )
                }
              </a>
            </div>
          </div>
          
          <div className="card style-3">
            <div className="card-header">
              <h6 className="title mb-0 font-14 font-w500">Date birth</h6>
            </div>
            <div className="card-body">
              <a onClick={handleBirthdateOffCanvasShow} className="setting-input" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom3" aria-controls="offcanvasBottom">
                <span>{profile.birthdate}</span>
                <i className="icon feather dz-flex-box icon-chevron-right ms-auto me-0"></i>
              </a>
            </div>
          </div>
          
          <div className="card style-3">
            <div className="card-header">
              <h6 className="title mb-0 font-14 font-w500">Gender</h6>
            </div>
            <div className="card-body">
              <a onClick={handleGenderOffCanvasShow} className="setting-input" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom3" aria-controls="offcanvasBottom">
                <span>{profile.gender}</span>
                <i className="icon feather dz-flex-box icon-chevron-right ms-auto me-0"></i>
              </a>
            </div>
          </div>
          
          <div className="card style-3">
            <div className="card-header">
              <h6 className="title mb-0 font-14 font-w500">interests</h6>
            </div>
            <div className="card-body">
              <a onClick={handleInterestsOffCanvasShow} className="setting-input" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom1" aria-controls="offcanvasBottom3">
                <span>{displayInterests()}</span>
                {
                  subscriptionData['control profile']===false?
                  (
                    <i className="dz-flex-box  ms-auto"><Lock/></i>
                  ):
                  (
                    <i className="icon feather dz-flex-box icon-chevron-right ms-auto me-0"></i>
                  )
                }
              </a>
            </div>
          </div>
          
          <div className="card style-3">
            <div className="card-header">
              <h6 className="title mb-0 font-14 font-w500">Relationship goals</h6>
            </div>
            <div className="card-body">
              <a onClick={handleRelationshipGoalOffCanvasShow} className="setting-input" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottomRelationshipGoal" aria-controls="offcanvasBottom3">
                <span>{profile.relationship_goal}</span>
                <i className="icon feather dz-flex-box icon-chevron-right ms-auto me-0"></i>
              </a>
            </div>
          </div>
          
          <div className="card style-3">
            <div className="card-header">
              <h6 className="title mb-0 font-14 font-w500">language I know</h6>
            </div>
            <div className="card-body">
              <a href="javascript:void(0);" className="setting-input" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLang" aria-controls="offcanvasLang">
                <span className="select-lang">English</span>
              </a>
            </div>
          </div>
          
          <div className="card style-3">
            <div className="card-header">
              <h6 className="title mb-0 font-14 font-w500">Sexual Orientation</h6>
            </div>
            <div className="card-body">
              <a onClick={handleSexualOrientationOffCanvasShow} className="setting-input" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom3" aria-controls="offcanvasBottom3">
                <span>{displaySexualOrientation()}</span>
                <i className="icon feather dz-flex-box icon-chevron-right ms-auto me-0"></i>
              </a>
            </div>
          </div>
        </div> 
      </div>

      <div className="footer fixed">
        <div className="container">
          <button disabled={isSaving} onClick={saveProfile} className="btn btn-lg btn-gradient w-100 dz-flex-box btn-shadow rounded-xl">
            Save <LoaderWhite/>
          </button>
        </div>
      </div>
    
      <Offcanvas placement={'bottom'} show={showFirstnameOffCanvas} onHide={handleFirstnameOffCanvasClose}>
        <Offcanvas.Header closeButton className="share-style">
          <Offcanvas.Title>
            <h6 className="title mb-0">Firstname</h6>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="input-group input-group-icon">
            <div className="input-group-text">
              {/* <div className="input-icon">
                <i className="icon feather icon-map-pin"></i>
              </div> */}
            </div>
            <input type="text" className="form-control" value={profile.firstname} onChange={handleFirstnameChange} maxLength={10}/>
          </div>
          <button onClick={handleFirstnameOffCanvasClose} className="btn btn-gradient w-100 dz-flex-box btn-shadow rounded-xl">
            {t('close')}
          </button>
        </Offcanvas.Body>
      </Offcanvas>
      
      <Offcanvas placement={'bottom'} show={showAboutmeOffCanvas} onHide={handleAboutmeOffCanvasClose}>
        <Offcanvas.Header closeButton className="share-style">
          <Offcanvas.Title>
            <h6 className="title mb-0">About me</h6>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="input-group input-group-icon">
            <div className="input-group-text">
              {/* <div className="input-icon">
                <i className="icon feather icon-map-pin"></i>
              </div> */}
            </div>
            {/* <input type="text" className="form-control" value={profile.about_me} onChange={handleAboutmeChange}/> */}
            <textarea rows={3} className="form-control" onChange={handleAboutmeChange}>{profile.about_me}</textarea>
          </div>
          <button onClick={handleAboutmeOffCanvasClose} className="btn btn-gradient w-100 dz-flex-box btn-shadow rounded-xl">
            {t('close')}
          </button>
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas placement={'bottom'} show={showBirthdateOffCanvas} onHide={handleBirthdateOffCanvasClose}>
        <Offcanvas.Header closeButton className="share-style">
          <Offcanvas.Title>
            <h6 className="title mb-0">Date of birth {profile.birthdate}</h6>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="input-group input-group-icon">
            <div className="input-group-text">
              {/* <div className="input-icon">
                <i className="icon feather icon-map-pin"></i>
              </div> */}
            </div>
            <input type="date" className="form-control" max={settings?.birthdate_max_date} value={profile.birthdate} onChange={handleBirthdateChange}/>
          </div>
          <button onClick={handleBirthdateOffCanvasClose} className="btn btn-gradient w-100 dz-flex-box btn-shadow rounded-xl">
            {t('close')}
          </button>
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas placement={'bottom'} show={showGenderOffCanvas} onHide={handleGenderOffCanvasClose}>
        <Offcanvas.Header closeButton className="share-style">
          <Offcanvas.Title>
            <h6 className="title mb-0">Gender</h6>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="radio style-2">
            {genders?.map(( name , index) => {
                return (
                    <label key={index} className="radio-label" htmlFor={name}>
                        <input type="radio" name="radio2" value={name}
                            id={name} 
                            checked={
                                profile.gender ===
                                name
                            }
                            onChange={() =>
                                handleGenderChange(
                                    name
                                )
                            }/>
                        <span className="checkmark">						
                            <span className="text">{name}</span>
                            <span className="check"></span>							
                        </span>
                    </label>
                );
            })}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas placement={'bottom'} show={showInterestsOffCanvas} onHide={handleInterestsOffCanvasClose}>
        <Offcanvas.Header closeButton className="share-style">
          <Offcanvas.Title>
            <h6 className="title mb-0">Interest</h6>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="input-group input-group-icon search-input">
            <div className="input-group-text">
              <div className="input-icon">
                <i className="icon feather icon-search"></i>
              </div>
            </div>
            <input type="search" className="form-control ms-0" placeholder="Search..."/>
          </div>
          <ul className="dz-tag-list style-2">
            {interestsForm?.map(({ name }, index) => {
                return (
                    <li key={index}>
                      <div onClick={() => handleInterestAddOnClick(index)} className={`dz-tag ${interestsForm[index].value?'selected-interest':''}`}>
                        <span>{name}</span>
                      </div>
                    </li>
                );
            })}
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    
      <Offcanvas placement={'bottom'} show={showRelationshipGoalOffCanvas} onHide={handleRelationshipGoalOffCanvasClose}>
        <Offcanvas.Header closeButton className="share-style m-0 pb-0">
          <Offcanvas.Title>
            <h6 className="title mb-0">Relationship Goals</h6>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="radio style-2">
            {relationshipGoals?.map(( name , index) => {
                return (
                    <label key={index} className="radio-label" htmlFor={name}>
                        <input type="radio" name="radio2" value={name}
                            id={name} 
                            checked={
                                profile.relationship_goal ===
                                name
                            }
                            onChange={() =>
                                handleRelationshipGoalChange(
                                    name
                                )
                            }/>
                        <span className="checkmark">						
                            <span className="text">{name}</span>
                            <span className="check"></span>							
                        </span>
                    </label>
                );
            })}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    
      <div className="offcanvas offcanvas-bottom" id="offcanvasLang">
        <div className="offcanvas-header share-style">
          <h6 className="title mb-0">Language</h6>
          <button type="button" className="btn-close dz-flex-box" data-bs-dismiss="offcanvas" aria-label="Close">
            <i className="icon feather icon-x font-22"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="dz-list">
            <ul className="mb-2 confirm-lang">
              <li data-lang="indian">
                <a href="javascript:void(0);" className="item-content py-2 item-link">
                  <div className="media media-30 me-3">
                    <img src="../assets/images/flags/india.svg" alt="/"/>
                  </div>
                  <div className="dz-inner">
                    <span className="title">Indian</span>
                  </div>
                </a>
              </li>
              <li data-lang="English">
                <a href="javascript:void(0);" className="item-content py-2 item-link">
                  <div className="media media-30 me-3">
                    <img src="../assets/images/flags/united-states.svg" alt="/"/>
                  </div>
                  <div className="dz-inner">
                    <span className="title">English</span>
                  </div>
                </a>
              </li>
              <li data-lang="German">
                <a href="javascript:void(0);" className="item-content py-2 item-link">
                  <div className="media media-30 me-3">
                    <img src="../assets/images/flags/germany.svg" alt="/"/>
                  </div>
                  <div className="dz-inner">
                    <span className="title">German</span>
                  </div>
                </a>
              </li>
              <li data-lang="Italian">
                <a href="javascript:void(0);" className="item-content py-2 item-link">
                  <div className="media media-30 me-3">
                    <img src="../assets/images/flags/italy.svg" alt="/"/>
                  </div>
                  <div className="dz-inner">
                    <span className="title">Italian</span>
                  </div>
                </a>
              </li>	
              <li className="border-0" data-lang="Spainsh">
                <a href="javascript:void(0);" className="item-content py-2 item-link">
                  <div className="media media-30 me-3">
                    <img src="../assets/images/flags/spain.svg" alt="/"/>
                  </div>
                  <div className="dz-inner">
                    <span className="title">Spainsh</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    
      <Offcanvas placement={'bottom'} show={showSexualOrientationOffCanvas} onHide={handleSexualOrientationOffCanvasClose}>
        <Offcanvas.Header closeButton className="share-style m-0 pb-0">
          <Offcanvas.Title>
            <h6 className="title">Sexual Orientation</h6>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="radio style-2">
            {sexualOrientation?.map(( {name} , index) => {
                return (
                    <div key={index} className="form-check mb-3">
                        <input className="form-check-input" type="checkbox"
                            id={`custom-checkbox-${index}`}
                            key={`checkbox-${index}`}
                            name={name}
                            value={name}
                            checked={sexualOrientation[index].value}
                            onChange={() => handleSexualOrientationChange(index)}/>
                        <label key={index} className="form-check-label" htmlFor={`custom-checkbox-${index}`}>
                            {name}
                        </label>
                    </div>
                );
            })}
          </div>
          <button onClick={handleSexualOrientationOffCanvasClose} className="btn btn-gradient w-100 dz-flex-box btn-shadow rounded-xl">
            {t('close')}
          </button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}