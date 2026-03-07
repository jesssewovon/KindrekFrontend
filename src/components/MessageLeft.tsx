//import { useAppSelector } from '../types';

interface MessageLeftProps{
  message: string;
  time: string;
}
export default function MessageLeft({message, time}: MessageLeftProps) {
    //const { isSaving } = useAppSelector((state) => state.user);
    return (
    	<>
          <div className="chat-content">
            <div className="message-item">
              <div className="bubble">{message}</div>    
              <div className="message-time">{time}</div>    
            </div>
          </div>
		  </>
    );
}