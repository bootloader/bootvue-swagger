//store/modules/auth.js


import axios from "axios";
import Vue from 'vue';
import formatters from '../../services/formatters';
import {MyConst} from '../../services/global';

import DataProcessor from '../../services/DataProcessor';

import pebounce from 'pebounce';
import string_score from 'string_score';


var guid = formatters.guid

function eq(a,b) {
  if(!a || !b) return false;
  if(a=="null" || b=="null") return false;
  return a === b;
}

function chatSize(chat){
  if(!chat) return "NoChat";
  if(!chat.messages) return "NoChatMessages";
  return chat.messages.length;
}

  function validateResponse(response){
    if(response.request.responseURL.endsWith("/auth/login")){
      //https://app.mehery.com/admin/auth/login
      console.log("===>",response.request.responseURL)
      window.location.href = response.request.responseURL;
    }

    if(response.data && response.data.message){
        //Vue.toaster.success(response.data.message);
         console.log("===>",response.data.message)
         if(Vue.$toast && Vue.$toast.success)
            Vue.$toast.success(response.data.message)
    }

  }

function setChatFlags(chat) {
  return DataProcessor.session(chat);
  console.log("setChatFlags");
}
var UPDATE_TIME = 0, REFRESH_TIMER = 0;
var updateTimer = function(){
  UPDATE_TIME = new Date().getTime();
}

const state = {
  user: null,agents : [],
  contacts : null,
  chats : [], chatsMessages : {}, chatsVersion : 0, chatsSize : null,
  chatsCounter : 1, 
  meta : { isOnline : true },
  mediaOptions : [], quickActions : [], quickLabels : [],
  quickReplies : [],
  chatHistory : { sessions : []}
};

const getters = {
    //Contacts
  StateChats: (state) => state.chats,
  StateChatsVersion : (state) => state.chatsVersion,
  StateMeta: (state) => state.meta,
  StateMediaOptions: (state) => state.mediaOptions,
  StateQuickActions: (state) => state.quickActions,
  StateQuickLabels: (state) => state.quickLabels,
  StateAgentOptions: (state) => state.agents,
  StateChatHistory: (state) => state.chatHistory.sessions
};

const cache = {
  _GetChats : (function () {
    let x = null; 
    return async function () {
      x =  x || (axios.get("/api/sessions/assigned.json",{
        //params : {withMessage : false}
      }));
      return x;
    };
  })(),
  _RefeshSession : (function () {
    let x = null; 
    return async function ({isOnline,isUpdate}) {
      x =  (isUpdate ? null : x) || (axios.get("/api/sessions/assignments.json",{
        params : {
          status : isOnline,
        //  withMessage : false
        }
      })).then(function (response) {
        console.log("_UpdateChats:success");
        return response;
      }).catch(function (error) {
        console.log("_UpdateChats:error");
      }).then(function (response) {
        console.log("_UpdateChats:always");
        setTimeout(()=> x = null,MyConst.config.chatRefreshInterval);
        return response;
      });;
      return x;
    };
  })(),
  _MatchQuickReplies : pebounce(function (tags) {
    tags = (tags || {categories : [], text : ""})
    tags.categories = tags.categories;
    var _categories = [];
    tags.text = (tags.text || "").toLowerCase() ;
    var resps = state.quickReplies.map(function (quickReply) {
          DataProcessor.quickReply(quickReply,tags);
          return quickReply;
    });
    return resps.sort(function(a,b) {
        return b.matchScore - a.matchScore;
    });

  },500)
}

const actions = {

  async RefeshSession({ commit,dispatch },isUpdate) {
      let then = Date.now() - MyConst.config.chatRefreshInterval;
      if(!isUpdate && UPDATE_TIME<then){
        return;
      }
      let response = await cache._RefeshSession({
        isOnline : state.meta.isOnline,isUpdate});
      validateResponse(response);
      if(response.data && response.data.details){
          dispatch("SetAgentOptionsStatus", response.data.details);
      }
      if(response.data && response.data.results){
          dispatch("updateChats", response.data.results);
      }
      commit("setMeta", state.meta);
      clearTimeout(REFRESH_TIMER);
      REFRESH_TIMER = setTimeout(function(){
        dispatch('RefeshSession');
      },MyConst.config.agentSessionTimeout);
      updateTimer();

  },
  async RefeshTimer({ commit,dispatch }) {
    updateTimer();
  },
  async LogIn({commit}, user) {
    await axios.post("/auth/login/submit", user)
    	.then(response => {
    		if(response.data.statusKey !== "SUCCESS"){
    			throw response.data;
    		}
    	});
    await commit("setUser", user.get("username"));
  },

  async LogOut({ commit }) {
  	axios.get("/auth/logout");
    let user = null;
    commit("logout", user);
  },

  async LoadChats({ commit,dispatch }) {
    dispatch("RefeshSession",true);
    return;
    let response = await cache._GetChats();
    validateResponse(response);
    dispatch("updateChats", response.data.results);
    commit("setMeta", response.data.meta);
    return response;
  },

  async RefreshChats({ commit,dispatch }) {
    dispatch("updateChats", state.chats);
  },

  async GetChats({ commit,dispatch }) {
    let response = await dispatch("LoadChats");
    return await new Promise((resolve, reject) => {
      var intrvl; 
      intrvl = setInterval(() => {
        if(state.chatsSize !== null){
          clearInterval(intrvl);
          resolve('foo');
        }
      }, 2000);
    });
  },

  async AddChat({ commit,dispatch},chat) {
    let _chat = Object.assign({},chat);
    for(var c in state.chats){
      if(state.chats[c].contactId == chat.contactId){
        state.chats[c].active = !!chat.active;
        state.chats[c].getAssignedToAgent = chat.getAssignedToAgent;
        state.chats[c].resolved = chat.resolved;
        //Append new messages to existing session
        for(var m in chat.messages){
          DataProcessor.appendMessage(state.chats[c],chat.messages[m]);
        }
        _chat.messages =  state.chats[c].messages || _chat.messages;

        setChatFlags(state.chats[c])
        state.chats.splice(c,1);
        //commit("setChats", state.chats);
        //return;
      }
    }
    if(_chat && _chat.active)
      state.chats.push(_chat);
    //dispatch("ReadChatMessages",chat.messages);
    dispatch("updateChats", state.chats);
  },

  async AddHistoryChat({ commit },chat) {
    var sessions = state.chatHistory.sessions;
    for(var c in sessions){
      if(sessions[c].sessionId == chat.sessionId){
        sessions[c].active = !!chat.active;
        sessions[c] = chat;
      }
    }
    commit("setChatHistory", state.chatHistory);
  },

  async SendChatPre({ commit,dispatch }, msg) {
      msg.messageIdRef = msg.messageIdRef || guid();
      msg.version=msg.version || 0;
      dispatch("ReadChatMessage",msg);
  },
  async SendChatPost({ commit,dispatch }, msg) {
    dispatch("ReadChatMessage",msg);
  },
  async SendChat({ commit,dispatch }, msg) {
    dispatch("SendChatPre",msg);
    let response = await axios.post("/api/sessions/message/send",{
                        id : msg.id,
                        message : msg.text,
                        template : msg.template,
                        sessionId : msg.sessionId,
                        template : msg.template,action : msg.action,
                        messageIdRef : msg.messageIdRef
                    });
    validateResponse(response);
    dispatch("SendChatPost",response.data.results[0]);
    return response.data;
  },

  async UpdateChatMessageStatus({ commit,dispatch },msgStatus) {
    for(var c in state.chats){
      var chat = state.chats[c];
      if(chat.messages){
        for (var m  in chat.messages) {
          var msg = chat.messages[m];
          if(eq(chat.contactType, msgStatus.contactType)
            && (eq(msg.messageId,msgStatus.messageId) || eq(msgStatus.messageIdExt,m.messageIdExt))
          ){
              msg.stamps = msg.stamps || {};
              msg.stamps[msgStatus.status] = msgStatus.timestamp;
              console.log("msg.stamps",msg.stamps)
              dispatch("updateChats", state.chats);
              return;
          }
        }
      }
    }
  },
  
  async ReadChatMessage({ commit,dispatch },m) {
      if(!m) return;
      m.messageIdRef = m.messageIdRef || guid();
      for(var c in state.chats){
        var chat = state.chats[c];
        if(m.sessionId == chat.sessionId){
            DataProcessor.appendMessage(chat,m);
            break;
        }
      }
      dispatch("updateChats", state.chats);
  },

  async ReadSession({ dispatch },chatSessions) {
    for(var s in chatSessions){
      var chatSession = chatSessions[s];
      for(var i in state.chats){
        var chat = state.chats[i];
        if(chat.sessionId == chatSession.sessionId){
          chat.status = chatSession.status;
        }
      }
    }
    dispatch("updateChats", state.chats);
  },

  //@Deperecated
  async OnlineStatus({ commit,dispatch },newStatus) {
    state.meta.isOnline = newStatus;
    dispatch("RefeshSession",true);
    return;
    let StatusForm = new FormData();
    if(newStatus !== undefined){
          StatusForm.append('status', newStatus)
    }
    let response = await axios.post("/auth/online/status",StatusForm);
    validateResponse(response);
    if(newStatus !== undefined){
      state.meta.isOnline = newStatus;
      commit("setMeta", state.meta);
    }
    if(response.data && response.data.results){
       dispatch("SetAgentOptionsStatus", response.data.results);
    }
    return response;
  },

  async SetAgentOptionsStatus({ commit },agentSessons) {
    var awayStamp = new Date().getTime()-MyConst.config.agentSessionTimeout;
    var offlineStamp = awayStamp-MyConst.config.agentSessionTimeout*2;
    for(var i in agentSessons){
      state.agents.map(function(agent) {
        var session = agentSessons[i];
        if(agent.code == session.agentCode){
          agent.session = session;

          session.isLoggedIn = (session.isLoggedIn && (session.lastOnlineStamp > offlineStamp))
          session.isAvailable = session.isLoggedIn && session.isOnline && (session.lastOnlineStamp > awayStamp);
          session.isAvailableNot = session.isLoggedIn && !session.isOnline;
          session.isAway =      session.isOnline && session.isLoggedIn && (session.lastOnlineStamp < awayStamp);
          agent.statusScore = 0;
          if(session.isAvailable ) {
             agent.statusScore = 4;
          } else if(session.isAway) {
             agent.statusScore = 3;
          } else if(session.isAvailableNot) {
             agent.statusScore = 2;
          } else if(session.isLoggedIn){
             agent.statusScore = 1;
          }

        }
      });
    }
    state.agents = state.agents.sort(function (a,b) {
      if(a.statusScore > b.statusScore || !b.statusScore){
        return -1;
      } else {
        return 1;
      }
      return 0;
    });
    commit("setAgents", state.agents);
  },

  async LoadAgentOptions({ commit,dispatch }) {
    let r1 = await axios.get("/api/options/agents");
    validateResponse(r1);
    if(r1.data && r1.data.results){
       commit("setAgents", r1.data.results);
    }
    dispatch("RefeshSession");
  },

  async LoadMediaOptions({ commit }) {
    let response = await axios.get("/gallery/map/media_reply");
    validateResponse(response);
    commit("setMediaOptions", response.data);
  },

  async LoadQuickActions({ commit }) {
    let response = await axios.get("/gallery/map/quick_actions");
    validateResponse(response);
    commit("setQuickActions", response.data);
  },

  async LoadQuickLabels({ commit }) {
    let response = await axios.get("/gallery/map/quick_labels");
    validateResponse(response);
    commit("setQuickLabels", response.data);
  },

  async AttachQuickLabels({ commit },{ sessionId,labels }) {
    let response = await axios.post("/api/contact/label?sessionId="+sessionId,{
      values : labels
    });
    validateResponse(response);
    //commit("setQuickTags", response.data);
    return response.data;
  },

  async UpdateSessionTags({ commit,dispatch },{ sessionId,status }) {
    let StatusForm = new FormData();
    StatusForm.append('status', status)
    StatusForm.append('sessionId', sessionId)
    let response = await axios.post("/api/session/status",StatusForm);
    validateResponse(response);
    dispatch("ReadSession", response.data.results);
    return response.data;
  },

  async LoadQuickReplies({ commit }, tags) {
    if(!state.quickReplies || state.quickReplies.length == 0){
        let response = await axios.get("/category/map/smart_reply.json");
        validateResponse(response);
        for (var i in response.data) {
          response.data[i].template = formatters.nullify(response.data[i].template);
        }
        commit("setQuickReply",response.data)
    }
    return cache._MatchQuickReplies(tags);
    //commit("setMediaOptions", response.data);
  },

  async GetSessions({ commit },options) {
    if(state.chatHistory.contactId == options.contactId){
      return state.chatHistory.sessions;
    }
    let response = await axios.get("/api/sessions/contact",{params : options });
    validateResponse(response);
    state.chatHistory.contactId = options.contactId;
    state.chatHistory.sessions = response.data.results;
    commit("setChatHistory",state.chatHistory)
    return response.data.results;
  },
  async GetSessionChats({ commit , dispatch},options) {
    let response = await axios.post("/api/sessions/messages",options);
    validateResponse(response);
    setChatFlags(response.data.results[0]);
    if(response.data.results[0].active){
        dispatch("AddChat",response.data.results[0]);
    } else {
        dispatch("AddHistoryChat",response.data.results[0]);
    }
    return response.data.results[0];
  },

  async AssingToAgent({commit,dispatch},{ sessionId,agentId }) {
    let AssignAgentForm = new FormData();
    AssignAgentForm.append('sessionId', sessionId);
    AssignAgentForm.append('agentId', agentId);
    let response = await axios.post("/api/session/agent",AssignAgentForm);
    validateResponse(response);
    dispatch("AddChat",response.data.results[0]);
    //commit("setQuickTags", response.data);
    return response.data;
  },

  async GetRequest({commit,dispatch},{ url,params }) {
    let response = await axios.get(url,{ params : params });
    validateResponse(response);
    return response.data;
  },

  async PostRequest({commit,dispatch},{ url,params }) {
    let response = await axios.post(url,params);
    validateResponse(response);
    return response.data;
  },

  async updateChats({commit,dispatch,rootGetters},chats){
    for(var c in chats){
        chats[c].lastReadStamp = Math.max(
          rootGetters.local.readStamp[chats[c].sessionId] || 0,
          chats[c].lastReadStamp || 0
        );
    }
    commit("setChats",chats);
  }

};

const mutations = {
  //Contacts
  setChats(state, chats) {
    for(var c in chats){
      chats[c].lastmsg = chats[c].lastmsg || {};
      if(chats[c].messages){
        for (var i = 0; i < chats[c].messages.length; i++) {
          if(chats[c].messages[i].type == 'I'){
            chats[c].ilastmsg = chats[c].messages[i];
          }  
          if(["I","O"].indexOf(chats[c].messages[i].type) >=0 ){
            chats[c].lastmsg = chats[c].messages[i];
          }
          chats[c].messages[i].stamps = chats[c].messages[i].stamps || { }
        }
      } else if(chats[c].msg){
        chats[c].ilastmsg = chats[c].msg.lastInBoundMsg || chats[c].ilastmsg;
        chats[c].lastmsg = chats[c].msg.lastMsg || chats[c].lastmsg;
      }
      state.chatsMessages[chats[c].sessionId] =  chats[c].messages || state.chatsMessages[chats[c].sessionId];
      chats[c].messages = state.chatsMessages[chats[c].sessionId];
      setChatFlags(chats[c])
    }
    state.chatsSize = chats.length;
    state.chats = chats;
    state.chatsVersion++;
  },
  setChatHistory(state, chatHistory) {
    state.chatHistory = chatHistory;
  },
  setMeta(state, meta) {
      state.meta = meta;
  },
  setQuickReply(state, quickReplies) {
    state.quickReplies = quickReplies;
  },
  setQuickActions(state, quickActions) {
    state.quickActions = quickActions;
  },
  setQuickLabels(state, quickLabels) {
    formatters.addContactLabels(quickLabels);
    state.quickLabels = quickLabels;
  },
  setMediaOptions(state, mediaOptions) {
    state.mediaOptions = mediaOptions;
  },
  setAgents(state, agents) {
    state.agents = agents;
    updateTimer();
  },
  setUser(state, username) {
    state.user = username;
  },
  logout(state, user) {
    state.user = user;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
  myGet : async function (url, params) {
    let response = await axios.get(url,{ params : params });
    validateResponse(response);
    return response.data;
  }
};
