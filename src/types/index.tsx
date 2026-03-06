//import { LatLngExpression } from "leaflet";

export interface UserState {
  user: any|null,
  username?: string,
  isLoggedIn: boolean,
  token: string,
  isDarkTheme: boolean,
  connecting: boolean,
  isLoading: boolean,
  isSaving: boolean,
  isOpenLoading: boolean,
  settings: any,
  scopes: Array<string>,
  dateFilter: any,
  geolocation: GeolocationType|null,
  reloadHomePage: boolean,
  showScreenLoader: boolean,
  error: string,
}
export interface ProfileState {
  id?: number;
  firstname: string;
  birthdate: string;
  about_me?: string|null;
  address?: string;
  gender: string;
  sexual_orientation: any[];
  images?: any;
  interested_gender: string;
  interested_min_age?: number|null;
  interested_max_age?: number|null;
  interested_max_distance?: number|null;
  relationship_goal: string;
  reactions: string[];
  interests?: string[];
  age?: number;
  distance?: string;
  /////////////////////////////
  isNew?: boolean;
  imageFirst?: string;
  hasActiveSubscription?: boolean;
  active_subscription?: any;
  isOnline?: boolean;
  onlineTimeAgo?: string;
}
export interface latlngType {
  lat: string,
  lng: string,
}
export interface GeolocationType {
  latitude: string,
  longitude: string,
  accuracy?: string,//Non-required
}
export interface ChatMessageType {
  id: number;
  message: string;
  sender_profiles_id: number;
  created_at: string;
}