import Header from '../components/Header';
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';

import { setIsSaving, 
} from "../store/userSlice";
//import { navigate } from "../navigationService";
import { useNavigate, useLocation } from 'react-router';
import api from "../api";
import LoaderWhite from '../components/LoaderWhite';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useAppSelector } from '../types';
import { useAppDispatch } from '../hooks/reduxHooks';

export default function PaymentVerification() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const {t} = useTranslation()
  const location = useLocation();
  const MySwal = withReactContent(Swal);

  const { isSaving } = useAppSelector((state) => state.user);

  // Load data on page change
  useEffect(() => {
    dispatch(setIsSaving(true))
    setTimeout(() => {
      dispatch(setIsSaving(false))
    }, 10000);
    return () => {
      verifyPayment()
      //alert('unmounting')
    };
  }, []);
  
  const verifyPayment = async () => {
      //alert('makepaiement')
      const {uniqueId, from} = location.state
      const type = from
      //alert(uniqueId)
      try {
          const res = await api.post(`payment-verifier`, {uniqueId, type});
          console.log(`payment-verifier`, res.data); // adjust to your API structure
          if (res.data.status === true && res.data.isPaymentDone === true) {
            const title = from
            const message = from
            MySwal.fire({ 
              title: title,
              text: message,
              icon: "success",
              showConfirmButton: true,
            });
          }else{
            const title = "Info"
            const message = res.data.message
            MySwal.fire({ 
              title: title,
              text: message,
              icon: "error",
              showConfirmButton: true,
            });
          }
          //navigate(-1)
        } catch (err) {
          console.error("Error :", err);
      }
  };

  return (
    <>
      <Header showBackButton={true} title={"Payment verification"} showWishList={false} classes={` bg-gray-color`}/>
      <div className="content-body bg-gray-color" style={{height: "100vh"}}>
        <div className="page-content space-top p-b60">
          <div className="container"> 
            <div className="dz-subscribe-area">
              <div className={`subscribe-content`}>
                <div className="bottom-btn container bg-white text-center px-5" style={{top: "50%"}}>
                  <button disabled={isSaving} onClick={() => navigate(-1)} className="btn btn-gradient dz-flex-box btn-shadow rounded-xl w-100">
                    {t('close')} <LoaderWhite/>
                  </button>
                </div>
              </div>
            </div>
          </div> 
        </div>
      </div>
    </>
  );
}