import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import api from "../../api";
import i18n from "../../i18n";
import { setUser,
    setIsSaving 
} from "../../store/userSlice";
import { showPiAdRewarded 
} from "../../store/userSlice";
import { navigate } from "../../navigationService";

import { updateField } from "../../store/profileFormSlice";
import Loader from "../../components/Loader";
import Lock from "../../components/Lock";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal);

import type { AppDispatch, RootState } from "../../store";
import type { ProfileState } from "../../types";

export default function Images() {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoggedIn, isSaving } = useSelector((state: RootState) => state.user);
    const profileForm: ProfileState = useSelector((state: RootState) => state.profileForm);
    console.log('profileForm.images', profileForm.images)
    
    useEffect(() => {
      if (isLoggedIn) {
        //navigate('/home')
      }
    });
    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = event.target;

        if (name === "image2" || name === "image3") {
            return;
        }

        if (!files || files.length === 0) {
            return;
        }

        const profileFormImagesUpdate = {
            ...profileForm.images,
            [name]: files[0],
        };

        dispatch(updateField({ field: "images", value: profileFormImagesUpdate }));
    };
    const createProfile = async () => {
        //alert('creatProfile')
        const formData = new FormData();
		
		//formData.append("about_me", "I am good boy");
		formData.append("firstname", profileForm.firstname);
		formData.append("birthdate", profileForm.birthdate);
		formData.append("gender", profileForm.gender);
		
		formData.append("interested_gender", profileForm.interested_gender);
		formData.append("relationship_goal", profileForm.relationship_goal);
        //formData.append("images", profileForm.images);
        /* profileForm.images.forEach((file) => {
            formData.append("images", file);
        }); */
        profileForm.sexual_orientation.forEach((val) => {
            if (val.value === true) {
                formData.append("sexual_orientation[]", val.name);
            }
        })
        /* Object.entries(profileForm.images).forEach(([key, val]) => {
            formData.append(`images[${key}]`, val);
        }); */
        Object.entries(profileForm.images as Record<string, File | null>).forEach(([key, val]) => {
            if (val) {
                formData.append(`images[${key}]`, val);
            }
        });
		console.log("formData", formData);
        //return
        dispatch(setIsSaving(true))
		api.post("/profiles", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then(res => {
            //console.log(res.data)
            dispatch(setIsSaving(false))
            if (res.data.status === true) {
                dispatch(setUser(res.data.user))
                /////////////////SHOW PI AD//////////////////
                const user = res.data.user || res.data.current_user_for_automatic_update
                const hideAd = user?.profile?.subscriptionData && user?.profile?.subscriptionData['hide ads']===true
                if (user?.has_profile===true && !hideAd) {
                    dispatch(showPiAdRewarded("after-account-create"))
                }
                //////////////////////////////////////////////
                MySwal.fire({
                    title: "Info",
                    text: res.data.message,
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/home')
            }else{
                MySwal.fire({ 
                    title: "Info",
                    text: res.data.message,
                    icon: "error",
                    showConfirmButton: true,
                });
            }
            console.log('res', res.data)
        }).catch(error => {
            MySwal.fire({ 
                title: "Info",
                text: i18n.t('an_error_occured'),
                icon: "error",
                showConfirmButton: true,
            });
            console.log('error', error)
        });
    };

    return (
        <>
          <div className="content-body bg-gray-color" style={{height: "100vh"}}>
            <div className="page-content p-b70">
                <div className="container">
                    <div className="account-area">
                        <a onClick={() => navigate("-1")} className="back-btn dz-flex-box">
                            <i className="icon feather icon-chevron-left"></i>
                        </a>
                        <div className="section-head ps-0">
                            <h3>Add your recent pics</h3>
                        </div>
                        <div className="row g-3" data-masonry='{"percentPosition": true }'>
                            <div className="col-8">
                                <div className="dz-drop-box">
                                    <div className="drop-bx bx-lg">
                                        <div className="imagePreview" style={{backgroundImage: `url(${typeof profileForm.images?.image1 === "object"?(URL.createObjectURL(profileForm.images?.image1)):'/images/recent-pic/drop-bx.png'})`}}>
                                            <div  className="remove-img remove-btn d-none"><i className="icon feather icon-x"></i></div>
                                            <input type='file' onChange={onFileChange} name="image1" className="form-control d-none imageUpload" id="imageUpload" accept=".png, .jpg, .jpeg"/>
                                            <label htmlFor="imageUpload"></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <div className="dz-drop-box">
                                            <img src="/images/recent-pic/drop-bx.png" alt=""/>
                                            <div className="drop-bx" style={{overflow: "hidden"}}>
                                                <div className="imagePreview" style={{backgroundImage: `url(${typeof profileForm.images?.image2 === "object"?(URL.createObjectURL(profileForm.images?.image2)):''})`}}>
                                                    <div  className="remove-img remove-btn d-none"><i className="icon feather icon-x"></i></div>
                                                    <input type='file' onChange={onFileChange} name="image2" className="form-control d-none imageUpload" id="imageUpload2" accept=".png, .jpg, .jpeg"/>
                                                    <label htmlFor="imageUpload2"></label>
                                                </div>
                                                <div className={``} style={{position: "absolute", top: "0", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                                    <Lock/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="dz-drop-box">
                                            <img src="/images/recent-pic/drop-bx.png" alt=""/>
                                            <div className="drop-bx" style={{overflow: "hidden"}}>
                                                <div className="imagePreview" style={{backgroundImage: `url(${typeof profileForm.images?.image3 === "object"?(URL.createObjectURL(profileForm.images?.image3)):''})`}}>
                                                    <div  className="remove-img remove-btn d-none"><i className="icon feather icon-x"></i></div>
                                                    <input type='file' onChange={onFileChange} name="image3" className="form-control d-none imageUpload" id="imageUpload3" accept=".png, .jpg, .jpeg"/>
                                                    <label htmlFor="imageUpload3"></label>
                                                </div>
                                                <div className={``} style={{position: "absolute", top: "0", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                                    <Lock/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer fixed bg-white">
                <div className="container">
                    <button disabled={isSaving || Object.entries(profileForm.images)?.length==0 || !profileForm.images?.image1} onClick={() => createProfile()} className="btn btn-lg btn-gradient w-100 dz-flex-box btn-shadow rounded-xl">
                        Next<Loader/>
                    </button>
                </div>
            </div>
          </div>
        </>
    );
}
