//store/modules/auth.js


import axios from "axios";
import Vue from 'vue';
import formatters from '../../services/formatters';
import {MyConst} from '../../services/global';

var guid = formatters.guid

function eq(a,b) {
  if(!a || !b) return false;
  if(a=="null" || b=="null") return false;
  return a === b;
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
  var expiryDateStamp = new Date().getTime()-MyConst.config.chatSessionTimeout;
  chat.expired = chat.expired || (chat.lastInComingStamp < expiryDateStamp);
  chat.active = chat.active && !chat.expired
  chat._assignedToMe = ((MyConst.agent == chat.assignedToAgent) && !chat.resolved)
  if((chat.assignedToAgent == MyConst.agent) || !chat.assignedToAgent){
    chat._tab = "ME";
  } else if(!((chat.assignedToAgent == MyConst.agent) || !chat.assignedToAgent)){
     chat._tab = "TEAM";
  }

}

const state = {
  user: null,agents : [],
  posts: null,
  contacts : null,
  chats : null,chatsVersion : 0, chatsSize : null,
  chatsCounter : 1,
  meta : null,
  mediaOptions : null, quickActions : null, quickLabels : null,
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
      x =  x || (axios.get("/api/sessions/assigned.json"));
      return x;
    };
  })()
}

const actions = {
  async Register({dispatch}, form) {
    await axios.post('register', form)
    let UserForm = new FormData()
    UserForm.append('username', form.username)
    UserForm.append('password', form.password)
    await dispatch('LogIn', UserForm)
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

  async CreatePost({ dispatch }, post) {
    await axios.post("post", post);
    return await dispatch("GetPosts");
  },

  async GetPosts({ commit }) {
    let response = await axios.get("posts");
    commit("setPosts", response.data);
  },

  async LogOut({ commit }) {
  	axios.get("/auth/logout");
    let user = null;
    commit("logout", user);
  },

  async LoadChats({ commit }) {
    let response = await cache._GetChats();
    validateResponse(response);
    commit("setChats", response.data.results);
    commit("setMeta", response.data.meta);
    return response;
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

  async AddChat({ commit },chat) {
    for(var c in state.chats){
      if(state.chats[c].contactId == chat.contactId){
        state.chats[c].active = !!chat.active;
        state.chats[c].getAssignedToAgent = chat.getAssignedToAgent;
        state.chats[c].resolved = chat.resolved;
        setChatFlags(state.chats[c])
        state.chats.splice(c,1);
        //commit("setChats", state.chats);
        //return;
      }
    }
    if(chat.active)
      state.chats.push(chat);
    commit("setChats", state.chats);
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
      dispatch("ReadChat",msg);
  },
  async SendChatPost({ commit,dispatch }, msg) {
    dispatch("ReadChat",msg);
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

  async UpdateChatMessageStatus({ commit },msgStatus) {
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
              commit("setChats", state.chats);
              return;
          }
        }
      }
    }
  },

  async ReadChat({ commit },m) {
    if(!m) return;
    m.messageIdRef = m.messageIdRef || guid();
    for(var c in state.chats){
      var chat = state.chats[c];
      if(m.sessionId == chat.sessionId){
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
        m.name = m.name || state.chats[c].name;
        if(index < 0) {
          chat.messages.push(m);
        } else {
          chat.messages.splice(index, 1, m);
        }
        //state.chats[c].newmsg = true;
        break;
      }
    }

    commit("setChats", state.chats);
  },

  async OnlineStatus({ commit },newStatus) {
    let StatusForm = new FormData();
    var currentStatus = state.meta.isOnline;
    StatusForm.append('status', newStatus)
    let response = await axios.post("/auth/online/status",StatusForm);
    state.meta.isOnline = response.data.meta;
    commit("setMeta", state.meta);
  },

  async SetAgentOptionsStatus({ commit },agentSessons) {
    for(var i in agentSessons){
      state.agents.map(function(agent) {
        if(agent.code == agentSessons[i].agentCode){
          agent.session = agentSessons[i];
        }
      });
    }
    commit("setAgents", state.agents);
  },

  async LoadAgentOptions({ commit,dispatch }) {
    let p1 = axios.get("/api/options/agents");
    let p2 = axios.get("/api/options/agents/status");

    let r1 = await p1;
    validateResponse(r1);
    if(r1.data && r1.data.results){
       commit("setAgents", r1.data.results);
    }
    let r2 = await p2;
    validateResponse(r2);
    if(r2.data && r2.data.results){
       dispatch("SetAgentOptionsStatus", r2.data.results);
    }
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

  async LoadQuickReplies({ commit },tags) {
    if(!state.quickReplies || state.quickReplies.length == 0){
        let response = await axios.get("/category/map/smart_reply.json");
        validateResponse(response);
        for (var i in response.data) {
          response.data[i].template = formatters.nullify(response.data[i].template);
        }
        commit("setQuickReply",response.data)
    }

    var categories = (tags || {categories : []}).categories;
    var _categories = [];
    var resps = state.quickReplies.map(function (quickReply) {
          if(categories.indexOf(quickReply.category)>-1){
            quickReply.match = true
          }
          return quickReply;
    });
    return resps.sort(function(a,b) {
        if(a.match)
          return -1
        else if(b.match){
          return 1
        } else 1
    });
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
  }

};

const mutations = {
  //Contacts
  setChats(state, chats) {
    for(var c in chats){
      chats[c].lastmsg = {};
      if(chats[c].messages)
        for (var i = 0; i < chats[c].messages.length; i++) {
          if(chats[c].messages[i].type == 'I'){
            chats[c].ilastmsg = chats[c].messages[i];
          }  
          if(["I","O"].indexOf(chats[c].messages[i].type) >=0 ){
            chats[c].lastmsg = chats[c].messages[i];
          }
          chats[c].messages[i].stamps = chats[c].messages[i].stamps || { }
        }
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
  },
  setUser(state, username) {
    state.user = username;
  },
  setPosts(state, posts) {
    state.posts = posts;
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
};
