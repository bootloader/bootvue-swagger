 
import formatters from './formatters';
import {MyConst} from './global';

function textScore(str1,str2){
	if(!str1 || !str1) return 0; 
	str1 = str1.replace(/([_-])/g," ");
	str2 = str2.replace(/([_-])/g," ");
	var score = str1.score(str2) + str2.score(str1);
	console.log("str1=str2",str1,str2,"====>",score);
	return score;
}

function eq(a,b) {
	if(!a || !b) return false;
	if(a=="null" || b=="null") return false;
	return a === b;
}

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
		  session._new = (session.lastReadStamp < session.lastInComingStamp) 
		  				|| (session._waiting && (session.lastInComingStamp > MyConst.sessionLoadStamp) 
		                && (!session._lastReadStamp || (session._lastReadStamp < session.lastInComingStamp)));

		   session._searchText = [session.contact.name, session.contact.email, session.contact.phone, session.contact.csid].join(" ")
		 return session;
 	},
	appendMessage(session,m){
		if(!m || m.length) return;
		let chat = session;
		var index  = -1
		for(var j in chat.messages){
		  var msg = chat.messages[j];
		  if(eq(msg.messageIdRef, m.messageIdRef)){
			msg.messageId = m.messageId;
			msg.version = 1;
		  }
		  if(eq(msg.messageId,m.messageId) || eq(msg, m) 
				|| eq(msg.messageIdExt,m.messageIdExt) || eq(msg.messageIdRef, m.messageIdRef)){
			index = j;
			if(m.version < msg.version){
			  m=msg;
			}            
			break;
		  }
		}
		m.name = m.name || session.name;
		if(chat.messages){
			if(index < 0) {
			  chat.messages.push(m);
			} else {
			  chat.messages.splice(index, 1, m);
			}
		}
		chat.lastmsg = m;
		//state.chats[c].newmsg = true;
		return chat;
	},
	quickReply(quickReply,tags){
		var text = tags.text;
		var categories = tags.categories || [];
		quickReply.title = quickReply.title || "";
		quickReply.title_len = (quickReply.title).length || 1;
		quickReply.template = quickReply.template || "";
		quickReply.matchIndex = text ? quickReply.title.toLowerCase().indexOf(text) : -1;
		quickReply.match = (categories.indexOf(quickReply.category)>-1);
		var catScore = (quickReply.match ? 0.5:0) + textScore(categories.join(" "),quickReply.category)/2;
		quickReply.matchScore = 
		  (quickReply.matchIndex==0 ? 1 : 0) +  (quickReply.matchIndex > 0 ? quickReply.matchIndex/quickReply.title_len : 0)
		  + catScore + textScore(text,quickReply.title)
		  + textScore(text,quickReply.template);
	}
 }