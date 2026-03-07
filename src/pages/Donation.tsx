import { useState, useEffect } from "react";

import { piPayment } from "../store/userSlice";
//import { navigate } from "../../navigationService";
import { useNavigate } from "react-router";
import Header from '../components/Header';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch } from "../hooks/reduxHooks";
import { useAppSelector } from "../types";

export default function FirstName() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {t} = useTranslation()
    const { isLoggedIn, user } = useAppSelector((state) => state.user);

    const [amount, setAmount] = useState(1)
    
    useEffect(() => {
      if (isLoggedIn) {
        //navigate('/home')
      }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(parseFloat(e.target.value))
    };
    
    const makePayment = () => {
        //alert('makepaiement')
        const uuid = uuidv4()
        dispatch(piPayment({
            amount: amount,
            memo: "Donation",
            metadata: {
                userId: user.id,
                type: 'donation',
                uniqueId: uuid,
            },
        }));
        navigate('/payment-verification', {
            state: {
                uniqueId: uuid,
                from: "donation",
            }
        })
    };

    return (
        <>
            <Header showBackButton={true} title={t('side_menu.donate')} showWishList={false}/>
            <div className="page-content space-top">
                <div className="container">
                    <div className="account-area">
                        <div className="section-head ps-0">
                            <h3 style={{textAlign: "center", color: "#ff50a2"}}>
                                Support us by donating Pi <br/><br/> <i className="flaticon flaticon-heart"></i>
                            </h3>
                        </div>
                        <div className="section-head ps-0">
                            <h5>Enter the Pi amount to donate</h5>
                        </div>
                        <div className="mb-2 input-group input-group-icon input-mini">
                            <div className="input-group-text">
                                <div className="input-icon">
                                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 19H6.2C5.0799 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2C3 7.07989 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H17.8C18.9201 5 19.4802 5 19.908 5.21799C20.2843 5.40973 20.5903 5.71569 20.782 6.09202C21 6.51984 21 7.0799 21 8.2V8.5M9 9.5V8.5M9 9.5H11.0001M9 9.5C7.88279 9.49998 7.00244 9.62616 7.0001 10.8325C6.99834 11.7328 7.00009 12 9.00009 12C11.0001 12 11.0001 12.2055 11.0001 13.1667C11.0001 13.889 11 14.5 9 14.5M9 15.5V14.5M9 14.5L7.0001 14.5M14 10H17M14 20L16.025 19.595C16.2015 19.5597 16.2898 19.542 16.3721 19.5097C16.4452 19.4811 16.5147 19.4439 16.579 19.399C16.6516 19.3484 16.7152 19.2848 16.8426 19.1574L21 15C21.5523 14.4477 21.5523 13.5523 21 13C20.4477 12.4477 19.5523 12.4477 19 13L14.8426 17.1574C14.7152 17.2848 14.6516 17.3484 14.601 17.421C14.5561 17.4853 14.5189 17.5548 14.4903 17.6279C14.458 17.7102 14.4403 17.7985 14.405 17.975L14 20Z" stroke="#ff50a2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                </div>
                            </div>
                            <input type="text" value={amount} name="firstname" onChange={handleChange} className="form-control" placeholder="Enter amount"/>								
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer fixed bg-white">
                <div className="container">
                    <button disabled={amount==0} onClick={() => makePayment()} className="btn btn-lg btn-gradient w-100 dz-flex-box btn-shadow rounded-xl">
                        {t('cart.proceed')}
                    </button>
                </div>
            </div>
        </>
    );
}
