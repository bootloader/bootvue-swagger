 
 import formatters from './formatters';
import {MyConst} from './global';

 export default {
 	session (session){
		  session._stamp = new Date().getTime();
		  var expiryDateStamp = session._stamp-MyConst.config.chatSessionTimeout;
		  session.expired = session.expired || (session.lastInComingStamp < expiryDateStamp);
		  session.active = session.active && !session.expired
		  session._assignedToMe = ((MyConst.agent == session.assignedToAgent) && !session.resolved)
		  if((session.assignedToAgent == MyConst.agent) || !session.assignedToAgent){
		    session._tab = "ME";
		  } else if(!((session.assignedToAgent == MyConst.agent) || !session.assignedToAgent)){
		     session._tab = "TEAM";
		  }
		  if(session.lastmsg){
		      if(session.lastmsg.type == "I"){
		        session.lastInComingStamp = Math.max(session.lastInComingStamp,session.lastmsg.timestamp);
		      } else if(session.lastmsg.type == "O"){
		        session.lastResponseStamp = Math.max(session.lastInComingStamp,session.lastmsg.timestamp);
		      }
		  }
		  session._gracestamp = session._stamp-MyConst.config.chatIdleTimeout;
		  session._waitingSinceStamp = Math.max(session.lastResponseStamp,session.agentSessionStamp);
		  session._waiting = (session.lastResponseStamp < session.lastInComingStamp);
		  session._waitingstamp_en= formatters.timespan((session._stamp - session._waitingSinceStamp)/1000);
		  session._attention = session._waiting && (session.lastResponseStamp < session._gracestamp);
		  session._new = session._waiting && (session.lastInComingStamp > MyConst.sessionLoadStamp) 
		                && (!session._lastReadStamp || (session._lastReadStamp < session.lastInComingStamp));

		 return session;
 	}
 }