import {  useEffect } from "react";
import { useNavigate } from "react-router";
import { updateField } from "../../store/profileFormSlice";
import { useAppSelector, type ProfileState } from "../../types";
import { useAppDispatch } from "../../hooks/reduxHooks";

export default function FirstName() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isLoggedIn } = useAppSelector((state) => state.user);
    const profileForm: ProfileState = useAppSelector((state) => state.profileForm);
    
    useEffect(() => {
      if (isLoggedIn) {
        //navigate('/home')
      }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateField({ field: e.target.name, value: e.target.value }));
    };

    return (
        <>
          <div className="content-body bg-gray-color" style={{height: "100vh"}}>
            <div className="page-content">
                <div className="container">
                    <div className="account-area">
                        <a onClick={() => navigate(-1)} className="back-btn dz-flex-box">
                            <i className="icon feather icon-chevron-left"></i>
                        </a>
                        <div className="section-head ps-0">
                            <h3>Enter your name?</h3>
                        </div>
                        <div className="mb-2 input-group input-group-icon input-mini">
                            <div className="input-group-text">
                                <div className="input-icon">
                                    <i className="icon feather icon-user"></i>
                                </div>
                            </div>
                            <input type="text" value={profileForm.firstname} name="firstname" maxLength={10} onChange={handleChange} className="form-control" placeholder="Enter first name"/>								
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer fixed bg-white">
                <div className="container">
                    <button disabled={profileForm.firstname==""} onClick={() => navigate('/registration-birth-date')} className="btn btn-lg btn-gradient w-100 dz-flex-box btn-shadow rounded-xl">Next</button>
                </div>
            </div>
          </div>
        </>
    );
}
