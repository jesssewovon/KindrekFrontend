import { useEffect } from "react";

import { navigate } from "../../navigationService";

import { updateField } from "../../store/profileFormSlice";
import { useAppSelector, type ProfileState } from "../../types";
import { useAppDispatch } from "../../hooks/reduxHooks";

export default function BirthDate() {
    const dispatch = useAppDispatch();
    const { isLoggedIn, settings } = useAppSelector((state) => state.user);
    //const profileForm = useAppSelector((state) => state.profileForm);
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
                        <a onClick={() => navigate('-1')} className="back-btn dz-flex-box">
                            <i className="icon feather icon-chevron-left"></i>
                        </a>
                        <div className="section-head ps-0">
                            <h3>Enter your Birth Date?</h3>
                        </div>
                        <div className="mb-2 input-group input-group-icon input-mini">
                            <div className="input-group-text">
                                <div className="input-icon">
                                    <i className="icon feather icon-calendar"></i>
                                </div>
                            </div>
                            <input type="date" value={profileForm.birthdate} name="birthdate" onChange={handleChange} max={settings.birthdate_max_date} className="form-control"/>								
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer fixed bg-white">
                <div className="container">
                    <button disabled={profileForm.birthdate==""} onClick={() => navigate('/registration-gender')} className="btn btn-lg btn-gradient w-100 dz-flex-box btn-shadow rounded-xl">Next</button>
                </div>
            </div>
          </div>
        </>
    );
}
