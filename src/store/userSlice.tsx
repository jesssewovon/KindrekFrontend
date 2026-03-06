// store/userSlice.tsx
import { createSlice } from "@reduxjs/toolkit";

import { createAsyncThunk } from '@reduxjs/toolkit';

import * as bootstrap from 'bootstrap';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal);

import i18n from "../i18n"; // your i18n config

import api from "../api"
import { navigate } from "../navigationService";
import type { GeolocationType, UserState } from "../types";

export const signinPiketplace = createAsyncThunk<void, GeolocationType|null>(
  'auth/signinPiketplace',
  async (geolocation, thunkAPI) => {
    const executePaymentCompletion = (data: any) =>{
        //alert('incomplete payment found')
        let paymentId = data.paymentId
        let txid = data.txid
        const config = {headers: {'Content-Type': 'application/json', 'Access-Control-Allow_Origin': '*'}};
        api.post('/incomplete', { paymentId:paymentId, txid:txid }, config);
    };
    const onIncompletePaymentFound = (payment: any) =>{
        //console.log('signin onIncompletePaymentFound', payment)
        const txid = payment.transaction.txid;
        //const txUrl = payment.transaction._link;
        const paymentId = payment.identifier;
        const data = {
            paymentId:paymentId,
            txid:txid,
        }
        executePaymentCompletion(data)
    };
    try {
      //const scopesState = thunkAPI.getState()?.user?.scopes
      const state: any = thunkAPI.getState()
      const scopesState = state.user.scopes
      const auth = await window.Pi.authenticate(scopesState, onIncompletePaymentFound);
      console.log('signinPiketplace', auth)
      const authResult = auth
        const referred_by = document.getElementById('referred_by') as HTMLInputElement
        if (referred_by) {
            authResult.referred_by = referred_by?.value
        }
        //alert(authResult.referred_by)
        const config = {headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
        }};
        //authResult.user_country = this.user_country
        authResult.geolocation = geolocation
        const locale = i18n.language
        //alert("locale "+locale)
        const res = await api.post(`/signin`, { authResult, locale }, config)
        if (res.data.status == "success") {
          const user = res.data.user || res.data.current_user_for_automatic_update
          const hideAd = user?.profile?.subscriptionData && user?.profile?.subscriptionData['hide ads']===true
          if (user?.has_profile===true && !hideAd) {
            thunkAPI.dispatch(showPiAdRewarded("after-login"))
          }
        }
        return res.data
      //return auth; // this goes to `fulfilled` reducer
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const signoutPiketplace = createAsyncThunk(
  'auth/signoutPiketplace',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post('/signout')
      return res.data
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const changeLanguage = createAsyncThunk<any, string>(
  'auth/changeLanguage',
  async (lang, thunkAPI) => {
    i18n.changeLanguage(lang, function(error, t){
      //console.log('changed language', error)
      /* MySwal.fire({
        title: "Info",
        text: t('successfull'),
        icon: "success",
        showConfirmButton: true,
        timer: 1500
      }); */
    })
    const state: any = thunkAPI.getState()
    const userState = state.user.user
    if (userState.isLoggedIn) {
      //alert('isloggedin')
      await api.post('/switchLocale', {lang})
    }
  }
);

export const unlockWithPiRewardedAd = createAsyncThunk<any, { adId: string; type: string }>(
  'auth/unlockWithPiRewardedAd',
  async ({adId, type}, thunkAPI) => {
      const state: any = thunkAPI.getState()
      const userState = state.user.user
      const username = userState.user?.username
      //alert('In unlock-with-pi-rewarded-ad '+username+" - "+adId)
      const res = await api.post('/unlock-with-pi-rewarded-ad', {username, adId, type})
      if (res.data.status === true) {
        if (res.data.message) {
          MySwal.fire({
            title: "Info",
            text: res.data.message,
            icon: "success",
            showConfirmButton: true,
            timer: 1500
          });
        }
      }else{
        MySwal.fire({ 
          title: "Info",
          text: i18n.t('an_error_occured'),
          icon: "error",
          showConfirmButton: false,
          timer: 1500
        });
      }
  }
);

export const showPiAdRewarded = createAsyncThunk<any, string>(
  'auth/showPiAdRewarded',
  async (type, thunkAPI) => {
    try{
      const ready = await window.Pi.Ads.isAdReady("rewarded");
      //alert("ready "+JSON.stringify(ready))
      if (ready.ready !== true) {
          const requestAdResponse = await window.Pi.Ads.requestAd("rewarded");
          if (requestAdResponse.result === "ADS_NOT_SUPPORTED") {
              // display modal to update Pi Browser
              // showAdsNotSupportedModal()
              //alert('rewarded ADS_NOT_SUPPORTED')
              return;
          }
          if (requestAdResponse.result === "AD_LOADED") {
              // display modal ads are temporarily unavailable and user should try again later
              // showAdUnavailableModal()
              //alert('rewarded AD_NOT_LOADED')
              //functions.msg_box_new(this.confDialog, 'error', i18n.global.t('message.info'), i18n.global.t("message.ads_unavailable"))
              //return;
          }else if(requestAdResponse.result === "AD_FAILED_TO_LOAD"){
              //functions.msg_box_new(this.confDialog, 'error', i18n.global.t('message.info'), i18n.global.t("message.ad_failed_to_load"))
          }else if(requestAdResponse.result === "AD_NOT_AVAILABLE"){
              //functions.msg_box_new(this.confDialog, 'error', i18n.global.t('message.info'), i18n.global.t("message.ads_unavailable"))
          }else {
              //functions.msg_box_new(this.confDialog, 'error', i18n.global.t('message.info'), i18n.global.t("message.an_error_occured"))
          }
      }/*else{
          const requestAdResponse = await Pi.Ads.requestAd("rewarded");
      }*/
      const showAdResponse = await window.Pi.Ads.showAd("rewarded");
      /* if (this.user && this.user.username==="djedje00") {
          alert("showAdResponse "+JSON.stringify(showAdResponse))
      } */
      //alert("showAdResponse "+JSON.stringify(showAdResponse))
      //alert('rewarded result '+showAdResponse.result)
      //alert('rewarded '+showAdResponse.adid+' - '+showAdResponse.adId)
      
      if (showAdResponse.result === "AD_REWARDED") {
          //alert("showAdResponse "+JSON.stringify(showAdResponse))
          //alert('rewarded adId '+showAdResponse.adid+' - '+showAdResponse.adId)
          // reward user logic, usually delegate rewarding user to your backend which would
          // firstly verify `adId` against Pi Platform API, then decide whether to reward the user
          // and rewarded user if the rewarded ad status is confirmed
          // e.g.:
          const adId = showAdResponse.adId
          thunkAPI.dispatch(unlockWithPiRewardedAd({adId, type}));
          // if (result.rewarded) {
          // showRewardedModal(result.reward)
          // } else {
          // showRewardFailModal(result.error)
          // }
            //const result = await this.rewardUserForWatchingRewardedAd(adId, origin);
      } else if(showAdResponse.result === "AD_CLOSED") {
          //functions.msg_box_new(this.confDialog, 'error', i18n.global.t('message.info'), i18n.global.t("message.ads_unavailable"))
      } else if(showAdResponse.result === "AD_NOT_AVAILABLE") {
          //functions.msg_box_new(this.confDialog, 'error', i18n.global.t('message.info'), i18n.global.t("message.ads_unavailable"))
      } else if(showAdResponse.result === "AD_NETWORK_ERROR") {
          //functions.msg_box_new(this.confDialog, 'error', i18n.global.t('message.info'), i18n.global.t("message.encountered_network_connection_issues"))
      } else if(showAdResponse.result === "AD_DISPLAY_ERROR") {
          //functions.msg_box_new(this.confDialog, 'error', i18n.global.t('message.info'), i18n.global.t("message.ad_failed_to_be_displayed"))
      } else if(showAdResponse.result === "USER_UNAUTHENTICATED") {
          //functions.msg_box_new(this.confDialog, 'error', i18n.global.t('message.info'), i18n.global.t("message.not_authenticated_try_again"))
          //this.signInPiNetwork({isLoggedIn: true})
      } else {
          //alert('rewarded AD_NOT_REWARDED')
          // fallback logic
          // showAdErrorModal()
          //functions.msg_box_new(this.confDialog, 'error', i18n.global.t('message.info'), i18n.global.t("message.an_error_occured"))
      }
    }catch(err){
        //alert('catch error')
        //alert('catch error '+err.message)
        //alert('catch error '+JSON.stringify(err))
    }
  }
);

export const showPiAdInterstitial = createAsyncThunk(
  'auth/showPiAdInterstitial',
  async (_, thunkAPI) => {
    try{
      const ready = await window.Pi.Ads.isAdReady("interstitial");
      //alert('Pi Ads ready '+JSON.stringify(ready))
      //console.log('Pi Ads ready', ready)
      //alert('Pi Ads start')
      if (ready.ready === false) {
          //alert('Pi Ads not ready, request again')
          const requestAdResponse = await window.Pi.Ads.requestAd("interstitial");
          //console.log('Pi Ads requestAd',  requestAdResponse)
          //alert('Pi Ads requestAdResponse '+JSON.stringify(requestAdResponse))
          /*if (requestAdResponse.result == "AD_LOADED") {
              this.can_show_add = true
          }*/
          if (requestAdResponse) {
            if (requestAdResponse.result === "AD_LOADED") {
                //
            }else if(requestAdResponse.result === "AD_FAILED_TO_LOAD"){
                //functions.msg_box_new(this.confDialog, 'error', i18n.global.t('message.info'), i18n.global.t("message.ad_failed_to_load"))
            }else if(requestAdResponse.result === "AD_NOT_AVAILABLE"){
                //functions.msg_box_new(this.confDialog, 'error', i18n.global.t('message.info'), i18n.global.t("message.ads_unavailable"))
            }
          }
      }else{
          //alert('Pi Ads ready')
      }
      const showAdResponse = await window.Pi.Ads.showAd("interstitial");
      //console.log('Pi Ads showAdResponse', showAdResponse)
      //alert('Pi interstitial Ads showAdResponse '+JSON.stringify(showAdResponse))
      if (!showAdResponse) {
        return
      }
      if (showAdResponse.result === "AD_CLOSED") {
        //Nothing to do
      } else if(showAdResponse.result === "AD_NOT_AVAILABLE") {
          //functions.msg_box_new(this.confDialog, 'error', i18n.global.t('message.info'), i18n.global.t("message.ads_unavailable"))
      } else if(showAdResponse.result === "AD_NETWORK_ERROR") {
          //functions.msg_box_new(this.confDialog, 'error', i18n.global.t('message.info'), i18n.global.t("message.encountered_network_connection_issues"))
      } else if(showAdResponse.result === "AD_DISPLAY_ERROR") {
          //functions.msg_box_new(this.confDialog, 'error', i18n.global.t('message.info'), i18n.global.t("message.ad_failed_to_be_displayed"))
      }
    }catch(err){
        //alert('catch error')
        //alert('catch error '+err.message)
        //alert('catch error '+JSON.stringify(err))
    }
  }
);

export const piPayment = createAsyncThunk<void, any>(
  'auth/piPayment',
  async (data, thunkAPI) => {
    //const scopes = ["username", "payments", "wallet_address", "preferred_language"];
    const config = {headers: {'Content-Type': 'application/json', 'Access-Control-Allow_Origin': '*'}};
    const onIncompletePaymentFound = (payment: any) =>{
        //console.log('onIncompletePaymentFound jn', payment);
        let txid = payment.transaction.txid;
        let paymentId = payment.identifier;
        let data = {
            paymentId:paymentId,
            txid:txid,
        }
        executePaymentCompletion(data)
    };

    const executePaymentCompletion = (data: any) =>{
        //alert('incomplete payment found')
        let paymentId = data.paymentId
        let txid = data.txid
        const config = {headers: {'Content-Type': 'application/json', 'Access-Control-Allow_Origin': '*'}};
        api.post('/incomplete', { paymentId:paymentId, txid:txid }, config);
    };

    ///////////////////////////////////////////////////////////////////////////////
    const onReadyForServerApproval = (paymentId: string) =>{
        //console.log('onReadyForServerApproval', paymentId);
        let res = api.post("/approve", { paymentId:paymentId }, config);
        //console.log('approve res', res);
        return res;
    };
    const onReadyForServerCompletion = (paymentId: string, txid: string) =>{
        //console.log('onReadyForServerCompletion', paymentId, txid);
        return api.post('/complete', { paymentId:paymentId, txid:txid }, config);
    };
    const onCancel = (paymentId: string) =>{
        //commit('CLEAR_PAYMENT_VERIFIER')
        //console.log('onCancel', paymentId);
        //return api.get('/cancel', { paymentId:paymentId }, config);
    };
    const onError = (error: any, payment: any) =>{
        //console.log('onError', error);
        if (payment) {
            //console.log(payment);
        }
    };

    /*Pi.authenticate(['payments'], onIncompletePaymentFound).then(function(auth) {
        console.log(auth.user.username);
        
    }).catch(function(error) {
      console.error(error);
    });*/
    const state: any = thunkAPI.getState()
    const scopesState = state?.user?.scopes
    window.Pi.authenticate(scopesState, onIncompletePaymentFound).then(function(auth: any) {
        console.log(auth.user.username);
        window.Pi.createPayment({
          amount: data?.amount,
          memo: data?.memo, // e.g: "Digital kitten #1234",
          //metadata: { orderId: data.orderId, userId: data.userId, type: data.type }, // e.g: { kittenId: 1234 }
          metadata: data?.metadata, // e.g: { kittenId: 1234 }
        }, {
          onReadyForServerApproval: onReadyForServerApproval,
          onReadyForServerCompletion: onReadyForServerCompletion,
          onCancel: onCancel,
          //onCancel: function(paymentId) { console.log('canc') },
          onError: onError,
          //onError: function(error, payment) { /* ... */ },
        });

    }).catch(function(error: any) {
      console.error(error);
    });
});



export const initialState: UserState = {
  user: null,   // user profile data
  isLoggedIn: false,
  token: "",
  isDarkTheme: false,
  connecting: false,
  isLoading: false,
  isSaving: false,
  isOpenLoading: false,
  settings: {},
  scopes: [
    "username",
    "payments",
    "wallet_address",
    //"preferred_language",
  ],
  /* dateFilter: {
    genders: [],
    min_age: 18,
    max_age: 80,
    max_distance: 80,
  }, */
  dateFilter: null,
  geolocation: null,
  reloadHomePage: false,
  showScreenLoader: false,
  error: "",
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
    loggedUserOut: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.token = "";
    },
    setIsLoggedIn: (state, action) => {
      alert('in setIsLoggedIn')
      state.isLoggedIn = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsSaving: (state, action) => {
      state.isSaving = action.payload;
    },
    setIsDarkTheme: (state, action) => {
      state.isDarkTheme = action.payload;
      if (state.isDarkTheme===true) {
        document.body.classList.add("theme-dark");
      }else{
        document.body.classList.remove("theme-dark");
      }
    },
    setBodyClass: (_, action) => {
        document.body.classList.add(action.payload);
    },
    setDateFilter: (state, action) => {
        state.dateFilter = action.payload;
    },
    setGeolocation: (state, action) => {
        state.geolocation = action.payload;
    },
    setReloadHomePage: (state, action) => {
        state.reloadHomePage = action.payload;
    },
    setShowScreenLoader: (state, action) => {
        state.showScreenLoader = action.payload;
    },
    setSettings: (state, action) => {
        state.settings = action.payload;
    },
    setError: (state, action) => {
        state.error = action.payload;
    },
    showOffcanvas(id: any) {
        var myOffcanvas = document.getElementById(id)
        if (myOffcanvas) {
            var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas)
            bsOffcanvas.show()
        }
    },
    hideOffcanvas(id: any) {
        var myOffcanvas = document.getElementById(id)
        if (myOffcanvas) {
            var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas)
            bsOffcanvas.hide()
        }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signinPiketplace.pending, (state) => {
        state.isSaving = true;
        state.error = "";
      })
      .addCase(signinPiketplace.fulfilled, (state, action) => {
        state.isSaving = false;
        //alert('fulfilled signinPiketplace');
        console.log('fulfilled signinPiketplace', state, action.payload);
        const data: any = action.payload
        if (data.status==="success") {
            state.isLoggedIn = true;
            state.token = data.token;
            if (data.current_user_for_automatic_update || data.user) {
              state.user = data?.current_user_for_automatic_update??(data?.user??null);
            }
            /* MySwal.fire({ 
              title: "Hello!",
              text: "Connexion new1",
              icon: "success",
              showConfirmButton: false,
              timer: 1500
            }); */
            if(data.redirectTo) {
                navigate(data.redirectTo)
            }else{
                navigate('/home')
            }

        }
      })
      .addCase(signinPiketplace.rejected, (state, action) => {
        //alert('rejected signinPiketplace');
        state.isSaving = false;
        state.error = JSON.stringify(action.payload) || 'Authentication failed';
      })
      .addCase(signoutPiketplace.pending, (state) => {
        //alert('pending signoutPiketplace');
        state.isSaving = true;
      })
      .addCase(signoutPiketplace.fulfilled, (state, action) => {
        console.log('fulfilled signoutPiketplace');
        state.isSaving = false;
        //alert('fulfilled signoutPiketplace');
        console.log('fulfilled signoutPiketplace', state, action.payload);
        const data = action.payload
        if (data.status=='success') {
            navigate('/')
            state.isLoggedIn = false;
            state.token = "";
            state.user = null;
            /* MySwal.fire({
              title: <p>Hello React JSX!</p>,
              text: "Deconnexion",
              icon: "success",
              //confirmButtonText: "Cool",
              showConfirmButton: false,
              timer: 1500
            }); */
            
        }
      })
      .addCase(signoutPiketplace.rejected, (state, action) => {
        console.log('rejected signoutPiketplace', state, action);
        //alert('rejected signoutPiketplace');
        state.isSaving = false;
        //state.error = action.payload || 'Authentication failed';
      })
      .addCase(unlockWithPiRewardedAd.pending, (state) => {
        //alert('pending unlockWithPiRewardedAd');
        state.isSaving = true;
      })
      .addCase(unlockWithPiRewardedAd.fulfilled, (state) => {
        console.log('fulfilled unlockWithPiRewardedAd');
        state.isSaving = false;
      })
      .addCase(unlockWithPiRewardedAd.rejected, (state, action) => {
        console.log('rejected unlockWithPiRewardedAd', state, action);
        //alert('rejected unlockWithPiRewardedAd');
        state.isSaving = false;
        //state.error = action.payload || 'Authentication failed';
      })
      ;
  },
});

export const { setUser, clearUser, setIsDarkTheme, setIsLoggedIn,
  setIsLoading, loggedUserOut, hideOffcanvas, showOffcanvas, setSettings,
  setIsSaving, setDateFilter, setGeolocation, setReloadHomePage,
  setShowScreenLoader, setError, 
} = userSlice.actions;
export default userSlice.reducer;