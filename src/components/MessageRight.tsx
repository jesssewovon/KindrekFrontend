//import { useSelector } from 'react-redux';
//import type { RootState } from '../store';

interface MessageRightProps{
  message: string;
  time: string;
}
export default function MessageRight({message, time}: MessageRightProps) {
    //const { isSaving } = useSelector((state: RootState) => state.user);
    return (
    	<>
          <div className="chat-content user">
            <div className="message-item">
              <div className="bubble">{message}</div>    
              <div className="message-time">{time}</div>    
            </div>
          </div>
		  </>
    );
}