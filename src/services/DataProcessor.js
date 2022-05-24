 
import formatters from './formatters';
import {MyConst} from './global';
import string_score from 'string_score'; //DO NOT REMOVE THIS, its string extension

function textScore(str1,str2){
	if(!str1 || !str1) return 0; 
	str1 = str1.replace(/([_-])/g," ");
	str2 = str2.replace(/([_-])/g," ");
	var score = str1.score(str2) + str2.score(str1);
	//console.log("str1=str2",str1,str2,"====>",score);
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
		  session.local = session.local || {
			  active : false, expired : false, tags : {}
		  };
		  var expiryDateStamp = session._stamp-MyConst.config.chatSessionTimeout;

		  session.local.activeInbound =  (session.lastInComingStamp>0 && session.lastInComingStamp > expiryDateStamp)
		  session.local.expired = (
			  	session.expired 
				|| (session.lastInComingStamp>0 && session.lastInComingStamp < expiryDateStamp)) 
			&& !session.resolved;
		  session.local.active = session.active && !session.local.expired;
		  session.local.lastActivityStamp = session.lastInComingStamp || session.updatedStamp;
		  session.local.channelId = session?.contact?.channelId || (session?.contact?.channelType + ":" + session?.contact?.lane);
		  session.local.lane = session?.contact?.lane || '';

		 	//Extra Derived 
		  session.local.resolved = !!session.resolved;
		  session.local.open = session.local.active && !session.local.expired && session.local.activeInbound;
		  session.local.closed = session.local.expired || !session.local.active;
		  session.local.isModeAgent = session.mode=='AGENT';
		  session.local.isModeBot = session.mode=='BOT';
		  session.local.isShowAgentPush = (session.local.closed || !session.local.isModeAgent);

		  session._assignedToMe = ((MyConst.agent == session.assignedToAgent) && !session.resolved)
		  if(session.assignedToDept !== MyConst.dept){
			session._tab = "ORG";
		  }	 else if((session.assignedToAgent == MyConst.agent) || !session.assignedToAgent){
		    session._tab = "ME";
		  } else if(!((session.assignedToAgent == MyConst.agent) || !session.assignedToAgent)){
		     session._tab = "TEAM";
		  }
		  if(!session.local.active){
			//session._tab = "HISTORY";
		  }

		  session.local.is_agent_responded = false;
		  if(session?.msg?.lastMsg){
		      if(session.msg.lastMsg.type == "I"){
				session.local.isInBound = true;
		        session.lastInComingStamp = Math.max(session.lastInComingStamp,session.msg.lastMsg.timestamp);
		      } else if(session.msg.lastMsg.type == "O"){
				session.local.isOutBound = true;
		        session.lastResponseStamp = Math.max(session.lastInComingStamp,session.msg.lastMsg.timestamp);
		      }
			  if(session.msg.lastMsg?.route?.senderType == "AGENT"){
				session.local.is_agent_responded = true;
			  }
		  }
		  session._gracestamp = session._stamp-MyConst.config.chatIdleTimeout;
		  session._waitingSinceStamp = Math.max(session.lastResponseStamp,session.agentSessionStamp);
		  session.local.is_waiting = session.local.isModeAgent && !session.local.resolved
		  						&& ((session.lastResponseStamp < session.lastInComingStamp) 
									|| (session.local.isInBound || !session.local.is_agent_responded));
		  session._waitingstamp_en= formatters.timespan((session._stamp - session._waitingSinceStamp)/1000);
		  session.local.is_waiting_long = session.local.is_waiting && (session.lastResponseStamp < session._gracestamp);
		  session._new = (session.lastReadStamp < session.lastInComingStamp) 
		  				|| (session.local.is_waiting && (session.lastInComingStamp > MyConst.sessionLoadStamp) 
		                && (!session._lastReadStamp || (session._lastReadStamp < session.lastInComingStamp)));

		session.local.is_unassigned = (session.mode == 'AGENT' && !session.assignedToAgent);
		session.local.is_assigned = (session.mode == 'AGENT' && session.assignedToAgent);
		let agent = session?.local?.agent;
		session.local.is_offline_agent = false;
		if(agent?.session){
			session.local.is_offline_agent = (agent.session.isAvailableNot || !agent.session.isLoggedIn);
		}
		session.local.is_unattended = !agent || (session.local.is_waiting_long && session.local.is_offline_agent);

		if(!session?.contact?.name){
			session.contact.name = session.name;
		}

		session._searchText = [session?.contact?.name, session?.contact?.email, session?.contact?.phone, session?.contact?.csid].join(" ").toLowerCase();
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
		m.replyMessage = m.replyMessage || null;

		if(m.type == "I"){
			session.lastInComingStamp = Math.max(session.lastInComingStamp,m.timestamp);
		} else if(m.type == "O"){
			session.lastResponseStamp = Math.max(session.lastResponseStamp, m.timestamp);
		}
		if(chat.messages){
			if(index < 0) {
			  chat.messages.push(m);
			} else {
			  chat.messages.splice(index, 1, m);
			}
		}
		chat.msg.lastMsg = m;
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