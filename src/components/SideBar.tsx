import { Link } from 'react-router';
import { useState } from "react";
import { useTheme } from "../ThemeContext";

import { setIsDarkTheme } from "../store/userSlice";
import { signinPiketplace, signoutPiketplace } from "../store/userSlice";
import { useTranslation } from 'react-i18next';
import SwitchLanguage from './SwitchLanguage';


import Loader from './Loader';
import { useAppSelector, type GeolocationType } from '../types';
import { useAppDispatch } from '../hooks/reduxHooks';

export default function SideBar() {
	const {t} = useTranslation()
	const { isSideBarOpen, setSideBarStatus } = useTheme();
	const dispatch = useAppDispatch();
    const { isDarkTheme, user, isLoggedIn, isLoading, settings } = useAppSelector((state) => state.user);
	const geolocation: GeolocationType|null = useAppSelector(
		(state) => state.user.geolocation
	);
	const [showLanguageOffCanvas, setShowLanguageOffCanvas] = useState(false);
	const handleLanguageOffCanvasShow = () => {
		setShowLanguageOffCanvas(true)
		setSideBarStatus(false)
	};
	const handleLanguageOffCanvasClose = () => {setShowLanguageOffCanvas(false)};
		
	const handleLogin = () => {
		dispatch(signinPiketplace(geolocation));
	};

	const handleLogout = () => {
		if (isLoading) {
			return
		}
		dispatch(signoutPiketplace());
	};
	const handleClickOnLink = () => {
		setSideBarStatus(false)
	};

    return (
    	<>
    		<div className={`dark-overlay ${isSideBarOpen?'active':''}`} onClick={() => setSideBarStatus(false)}></div>
	    	<div className={`sidebar ${isSideBarOpen?'show':''}`}>
				<div className="inner-sidebar" style={{display: "grid",alignItems: "center"}}>
					{isLoggedIn && user?
						(<>
							<Link to="profile" className="author-box">
								<div className="dz-media">
									<img src={user?.profile?.imageFirst} alt={user?.firstname} style={{height: '100%', objectFit: 'cover'}}/>
								</div>
								<div className="dz-info">
									<h5 className="name">{user?.profile?.firstname}</h5>
									<span>@{user?.username}</span>
								</div>
							</Link>
							<ul className="nav navbar-nav">	
								{/* <li>
									<Link to="/" className="nav-link">
										<span className="dz-icon">
											<i className="icon feather icon-heart"></i>
										</span>
										<span>W3Dating Package</span>
									</Link>
								</li>
								<li>
									<Link to="/" className="nav-link">
										<span className="dz-icon">
											<i className="icon feather icon-list"></i>
										</span>
										<span>Package List</span>
									</Link>
								</li>
								<li>
									<Link to="/" className="nav-link">
										<span className="dz-icon">
											<i className="icon feather icon-wind"></i>
										</span>
										<span>Welcome</span>
									</Link>
								</li>
								<li>
									<Link to="/" className="nav-link">
										<span className="dz-icon">
											<i className="icon feather icon-grid"></i>
										</span>
										<span>Components</span>
									</Link>
								</li> */}
								<li>
									<Link onClick={handleClickOnLink} to="/wishlist" className="nav-link">
										<span className="dz-icon">
											<i className="flaticon flaticon-heart"></i>
										</span>
										<span>Wishlist</span>
									</Link>
								</li>
								<li>
									<Link onClick={handleClickOnLink} to="/chat-list" className="nav-link">
										<span className="dz-icon">
											<i className="flaticon flaticon-chat-1"></i>
										</span>
										<span>New matchs</span>
									</Link>
								</li>
								<li>
									<Link onClick={handleClickOnLink} to="/settings" className="nav-link">
										<span className="dz-icon">
											<i className="icon feather icon-settings"></i>
										</span>
										<span>Settings</span>
									</Link>
								</li>
								<li>
									<Link onClick={handleClickOnLink} to="/profile" className="nav-link">
										<span className="dz-icon">
											<i className="icon feather icon-user"></i>
										</span>
										<span>{t('side_menu.profile')}</span>
									</Link>
								</li>
								<li>
									<a onClick={handleLanguageOffCanvasShow} className="nav-link">
										<span className="dz-icon">
                    						<svg fill="#ff50a2" width="24px" height="24px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><title>ionicons-v5-l</title><path d="M478.33,433.6l-90-218a22,22,0,0,0-40.67,0l-90,218a22,22,0,1,0,40.67,16.79L316.66,406H419.33l18.33,44.39A22,22,0,0,0,458,464a22,22,0,0,0,20.32-30.4ZM334.83,362,368,281.65,401.17,362Z"></path><path d="M267.84,342.92a22,22,0,0,0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73,39.65-53.68,62.11-114.75,71.27-143.49H330a22,22,0,0,0,0-44H214V70a22,22,0,0,0-44,0V90H54a22,22,0,0,0,0,44H251.25c-9.52,26.95-27.05,69.5-53.79,108.36-31.41-41.68-43.08-68.65-43.17-68.87a22,22,0,0,0-40.58,17c.58,1.38,14.55,34.23,52.86,83.93.92,1.19,1.83,2.35,2.74,3.51-39.24,44.35-77.74,71.86-93.85,80.74a22,22,0,1,0,21.07,38.63c2.16-1.18,48.6-26.89,101.63-85.59,22.52,24.08,38,35.44,38.93,36.1a22,22,0,0,0,30.75-4.9Z"></path></g></svg>
										</span>
										<span>{t('side_menu.language')}</span>
									</a>
								</li>
								<li>
									<Link to="/subscriptions" onClick={handleClickOnLink} className="nav-link">
										<span className="dz-icon">
											<i className="icon feather icon-list"></i>
										</span>
										<span>{t('Subscriptions')}</span>
									</Link>
								</li>
								<li>
									<Link to="/donation" onClick={handleClickOnLink} className="nav-link">
										<span className="dz-icon">
											<svg height="24px" width="24px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 511.999 511.999" xmlSpace="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style={{fill: "#ff50a2"}} d="M457.246,476.261H123.109c-21.42,0-41.994-10.142-55.041-27.13l-57.491-74.863 c-1.939-2.525-2.982-5.623-2.963-8.806l0.328-56.891c0.046-7.879,6.447-14.24,14.323-14.24c0.013,0,0.024,0,0.037,0 c16.997,0.044,41.367,0.12,60.942,0.239c8.637,0.052,15.951,0.109,21.125,0.173c11.003,0.135,13.96,0.17,18.186,4.387l84.293,84.293 c9.738,9.738,25.582,9.738,35.32,0l0.127-0.127c9.737-9.737,9.737-25.582,0-35.32l-78.822-77.56 c-9.449-9.298-21.954-14.419-35.209-14.419H14.323C6.412,255.998,0,249.586,0,241.675c0-7.91,6.412-14.323,14.323-14.323h113.94 c20.822,0,40.462,8.042,55.301,22.647l78.902,77.64c20.988,20.988,20.988,55.005,0.083,75.912l-0.126,0.126 c-20.908,20.907-54.925,20.907-75.831,0l-80.264-80.264c-9.036-0.129-30.615-0.278-69.823-0.398l-0.218,37.7l54.499,70.967 c7.661,9.976,19.744,15.933,32.322,15.933h334.137c13.771,0,24.976-11.203,24.976-24.976v-0.179 c0-13.771-11.203-24.976-24.976-24.976H319.006c-7.91,0-14.323-6.412-14.323-14.323s6.412-14.323,14.323-14.323h138.238 c29.566,0,53.621,24.054,53.621,53.621v0.179C510.867,452.207,486.812,476.261,457.246,476.261z"></path> <circle style={{fill: "#ffffff00"}} cx="363.596" cy="184.132" r="134.075"></circle> <g> <path style={{fill: "#ff50a2"}} d="M363.601,332.534c-81.827,0-148.399-66.57-148.399-148.399c0-81.827,66.57-148.397,148.399-148.397 c81.827,0,148.397,66.57,148.397,148.397C512,265.964,445.428,332.534,363.601,332.534z M363.601,64.383 c-66.032,0-119.753,53.72-119.753,119.752s53.722,119.753,119.753,119.753s119.752-53.722,119.752-119.753 S429.633,64.383,363.601,64.383z"></path> <path style={{fill: "#ff50a2"}} d="M358.087,255.922c-24.062-0.802-43.713-13.234-43.713-26.067c0-6.818,6.016-16.843,13.635-16.843 c8.422,0,15.239,11.831,30.078,14.437v-32.484c-18.448-7.018-40.104-15.64-40.104-41.307c0-25.466,18.849-37.697,40.104-40.704 v-5.614c0-2.807,3.208-5.414,7.62-5.414c3.81,0,7.62,2.607,7.62,5.414v5.013c12.432,0.401,35.893,3.609,35.893,17.445 c0,5.414-3.609,16.442-12.432,16.442c-6.617,0-10.427-6.417-23.461-7.419v29.276c18.247,6.818,39.502,16.242,39.502,43.312 c0,24.864-16.041,39.903-39.502,43.713v5.815c0,2.807-3.81,5.414-7.62,5.414c-4.411,0-7.62-2.607-7.62-5.414V255.922z M360.092,163.283v-23.862c-9.023,1.805-12.833,6.417-12.833,11.229C347.259,156.465,352.473,160.075,360.092,163.283z M371.321,200.379v26.869c6.818-1.604,12.232-5.414,12.232-12.633C383.553,207.998,378.54,203.787,371.321,200.379z"></path> </g> </g></svg>
										</span>
										<span>{t('side_menu.donate')}</span>
									</Link>
								</li>
								<li>
									<a onClick={() => handleLogout()} className="nav-link">
										<span className="dz-icon">
											<i className="icon feather icon-log-out"></i>
										</span>
										<span>{t('log_out')}</span>
										<Loader/>
									</a>
								</li>
							</ul>
						</>
						):
						(
						  
						  <div className="mt-4 mx-2">
		                    <button disabled={isLoading} onClick={() => handleLogin()} className="btn mb-2 me-2 btn-icon icon-start w-100 btn-primary">
								{t('log_in_first')}
								<Loader/>
							</button>
		                  </div>
						)
					}
					<div className="sidebar-bottom">
						<ul className="app-setting">
							<li>
								<div className="mode">
									<span className="dz-icon">                        
										<i className="icon feather icon-moon"></i>
									</span>					
									<span>Dark Mode</span>
									<div className="custom-switch">
										<input type="checkbox" className="switch-input theme-btn" id="toggle-dark-menu" checked={isDarkTheme} onChange={() => dispatch(setIsDarkTheme(!isDarkTheme))}/>
										<label className="custom-switch-label" htmlFor="toggle-dark-menu"></label>
									</div>					
								</div>
							</li>
						</ul>
						<div className="app-info">
							<h6 className="name"> - {settings?.app_name??''}</h6>
							<div style={{display: "flex", justifyContent: "space-between", paddingTop: "10px", fontSize: "16px"}}>
								<a onClick={()=>window.Pi.openUrlInSystemBrowser(settings?.tos_url)} className="ver-info">ToS</a>
								<a onClick={()=>window.Pi.openUrlInSystemBrowser(settings?.privacy_policy_url)} className="ver-info">Privacy Policy</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<SwitchLanguage showLanguageOffCanvas={showLanguageOffCanvas} handleLanguageOffCanvasClose={handleLanguageOffCanvasClose}/>
		</>
    );
}