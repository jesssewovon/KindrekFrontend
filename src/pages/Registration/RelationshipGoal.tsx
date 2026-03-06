import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { navigate } from "../../navigationService";

import { updateField } from "../../store/profileFormSlice";
import type { RootState } from "../../store";
import type { ProfileState } from "../../types";

export default function RelationshipGoal() {
    const dispatch = useDispatch();
    const { isLoggedIn, settings } = useSelector((state: RootState) => state.user);
    const profileForm: ProfileState = useSelector((state: RootState) => state.profileForm);

    const [relationshipGoals, setRelationshipGoals] = useState([])
    
    useEffect(() => {
      if (isLoggedIn) {
        //navigate('/home')
      }
    });
    useEffect(() => {
      console.log("settings", settings)
      setRelationshipGoals(buildRelationshipFormList(settings))
    }, []);
    const buildRelationshipFormList = (settings: any) => {
        const list = JSON.parse(settings.relationship_goals)
        return list.map((val: any)=>{
            return {name: val, value: false}
        })
    };
    const handleRadioChange = (value: string) => {
        //console.log('test', value)
        dispatch(updateField({ field: "relationship_goal", value: value }));
    };

    return (
        <>
          <div className="content-body bg-gray-color" style={{height: "100vh"}}>
            <div className="page-content">
                <div className="container">
                    <div className="account-area">
                        <a onClick={() => navigate("-1")} className="back-btn dz-flex-box">
                            <i className="icon feather icon-chevron-left"></i>
                        </a>
                        <div className="section-head ps-0">
                            <h3>What are you looking for right now ?</h3>
                        </div>
                        <div className="radio style-2">
                            {relationshipGoals.map(({ name }, index) => {
                                return (
                                    <label key={index} className="radio-label" htmlFor={name}>
                                        <input type="radio" name="radio2" value={name}
                                            id={name} 
                                            checked={
                                                profileForm.relationship_goal ===
                                               name
                                            }
                                            onChange={() =>
                                                handleRadioChange(
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
                    </div>
                </div>
            </div>
            <div className="footer fixed bg-white">
                <div className="container">
                    <button disabled={profileForm.relationship_goal==""} onClick={() => navigate('/registration-images')} className="btn btn-lg btn-gradient w-100 dz-flex-box btn-shadow rounded-xl">Next</button>
                </div>
            </div>
          </div>
        </>
    );
}
