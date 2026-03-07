//import { useAppSelector } from '../types';

interface MessageRightProps{
  message: string;
  time: string;
}
export default function MessageRight({message, time}: MessageRightProps) {
    //const { isSaving } = useAppSelector((state) => state.user);
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