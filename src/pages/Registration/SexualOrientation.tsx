import { useState, useEffect } from "react";

import { navigate } from "../../navigationService";

import { updateField } from "../../store/profileFormSlice";
import { useAppSelector, type ProfileState } from "../../types";
import { useAppDispatch } from "../../hooks/reduxHooks";

export default function SexualOrientation() {
    const dispatch = useAppDispatch();
    const { isLoggedIn, settings } = useAppSelector((state) => state.user);
    const profileForm: ProfileState = useAppSelector((state) => state.profileForm);
    
    const [checkedState, setCheckedState] = useState(profileForm.sexual_orientation);

    const handleOnChange = (position: number) => {
        const updatedCheckedState = checkedState.map((item, index) => {
            if (index === position) {
                //const it = { ...item, value: !item.value }
                const it = {name: item.name, value: !item.value }
                console.log('it', it)
                return it
            }
            return item
        });
        /* const updatedTabCheckBoxes = checkedState.map((item, index) =>
            index === position ? !item : item
        ); */
        setCheckedState(updatedCheckedState);
        dispatch(updateField({ field: "sexual_orientation", value: updatedCheckedState }));
    }

    useEffect(() => {
      if (isLoggedIn) {
        //navigate('/home')
      }
    });
    useEffect(() => {
      const res = JSON.parse(settings.sexual_orientations)?.map((val: string)=>{return {name:val, value: false}})
      if (checkedState.length==0) {
        setCheckedState(res)
        dispatch(updateField({ field: "sexual_orientation", value: res }));
      }
      //console.log('ressssssssssss', res)
    }, []);

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
                            <h3>Your sexual orientation ?</h3>
                        </div>
                        {profileForm.sexual_orientation.map(({ name }, index) => {
                            return (
                                <div key={index} className="form-check mb-3">
                                    <input className="form-check-input" type="checkbox"
                                        id={`custom-checkbox-${index}`}
                                        key={`checkbox-${index}`}
                                        name={name}
                                        value={name}
                                        checked={checkedState[index].value}
                                        onChange={() => handleOnChange(index)}/>
                                    <label key={index} className="form-check-label" htmlFor={`custom-checkbox-${index}`}>
                                        {name}
                                    </label>
                                </div>
                            );
                        })}
                        {/* <div className="form-check mb-3">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheck2"/>
                            <label className="form-check-label" for="flexCheck2">
                                Gay
                            </label>
                        </div>
                        <div className="form-check mb-3">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheck3"/>
                            <label className="form-check-label" for="flexCheck3">
                                Lesbian
                            </label>
                        </div>
                        <div className="form-check mb-3">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheck4"/>
                            <label className="form-check-label" for="flexCheck4">
                                Bisexual
                            </label>
                        </div>
                        <div className="form-check mb-3">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheck5"/>
                            <label className="form-check-label" for="flexCheck5">
                                Asexual
                            </label>
                        </div>
                        <div className="form-check mb-3">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheck6"/>
                            <label className="form-check-label" for="flexCheck6">
                                Queer
                            </label>
                        </div>
                        <div className="form-check mb-3">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheck7"/>
                            <label className="form-check-label" for="flexCheck7">
                                Demisexual
                            </label>
                        </div>	 */}
                    </div>
                </div>
            </div>
            <div className="footer fixed bg-white">
                <div className="container">
                    <button disabled={profileForm.sexual_orientation.filter(x=>x.value===true).length==0} onClick={() => navigate('/registration-interested-gender')} className="btn btn-lg btn-gradient w-100 dz-flex-box btn-shadow rounded-xl">Next</button>
                </div>
            </div>
          </div>
        </>
    );
}
