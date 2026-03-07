import { useAppSelector } from '../types';

export default function ScreenLoader() {
    const { showScreenLoader } = useAppSelector((state) => state.user);
    return (
        <>
            {showScreenLoader && (<div style={{position: "fixed", top: "0", zIndex: "999999", width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.7)"}}>
                <div style={{display: "flex", width: "100%", height: "97vh", alignItems: "center", justifyContent: "center"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style={{shapeRendering: "auto", display: "block", background: "transparent"}} width="34" height="34" xmlnsXlink="http://www.w3.org/1999/xlink"><g><circle strokeDasharray="164.93361431346415 56.97787143782138" r="35" strokeWidth="10" stroke="#fff" fill="none" cy="50" cx="50"><animateTransform keyTimes="0;1" values="0 50 50;360 50 50" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform"></animateTransform></circle><g></g></g></svg>
                </div>
            </div>)}
        </>
    );
}