//store/modules/auth.js


import axios from "axios";


function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16)
        .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4()
      + s4() + s4();
}

function eq(a,b) {
  if(!a || !b) return false;
  return a === b;
}

const state = {
  user: null,
  posts: null,
  contacts : null,
  chats : null,
  chatsCounter : 1,
  meta : null,
  mediaOptions : null, quickActions : null,
  quickReplies : [],
  chatHistory : { sessions : []}
};

const getters = {
    //Contacts
  StateChats: (state) => state.chats,
  StateMeta: (state) => state.meta,
  StateMediaOptions: (state) => state.mediaOptions,
  StateQuickActions: (state) => state.quickActions,
  StateChatHistory: (state) => state.chatHistory.sessions
};

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

  async GetChats({ commit }) {
    let response = await axios.get("/api/sessions/assigned.json");
    commit("setChats", response.data.results);
    commit("setMeta", response.data.meta);
  },

  async AddChat({ commit },chat) {
    for(var c in state.chats){
      if(state.chats[c].contactId == chat.contactId){
        state.chats[c].active = !!chat.active;
        state.chats[c].assigned = !!chat.assigned;
        console.log(state.chats[c],chat)
        state.chats.splice(c,1);
        //commit("setChats", state.chats);
        //return;
      }
    }
    if(chat.active)
      state.chats.push(chat);
    commit("setChats", state.chats);
  },

  async SendChat({ commit,dispatch }, msg) {
    msg.messageIdRef = msg.messageIdRef || guid();
    msg.version=msg.version || 0;
    dispatch("ReadChat",msg);
    let response = await axios.post("/api/sessions/message/send",{
                        id : msg.id,
                        message : msg.text,
                        template : msg.template,
                        sessionId : msg.sessionId,
                        template : msg.template,action : msg.action,
                        messageIdRef : msg.messageIdRef
                    });
    msg.messageId = response.data.results[0].messageId;
    msg.version = 1;
    dispatch("ReadChat",msg);
    return response.data;
  },

  async ReadChat({ commit },m) {
    m.messageIdRef = m.messageIdRef || guid();
    for(var c in state.chats){
      var chat = state.chats[c];
      if( (m.sessionId == chat.sessionId ) || (m.contactId == chat.contactId) ){
        var index  = -1
        for(var j in chat.messages){
          var msg = chat.messages[j];
          if(eq(msg.messageId,m.messageId) || eq(msg, m) || eq(msg.messageIdExt,m.messageIdExt) || eq(msg.messageIdRef, m.messageIdRef)){
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

  async OnlineStatus({ commit }) {
    let StatusForm = new FormData();
    var currentStatus = state.meta.isOnline;
    StatusForm.append('status', !currentStatus)
    let response = await axios.post("/auth/online/status",StatusForm);
    state.meta.isOnline = response.data.meta;
    commit("setMeta", state.meta);
  },

  async LoadMediaOptions({ commit }) {
    let response = await axios.get("/gallery/map/media_reply");
    commit("setMediaOptions", response.data);
  },

  async LoadQuickActions({ commit }) {
    let response = await axios.get("/gallery/map/quick_actions");
    commit("setQuickActions", response.data);
  },

  async LoadQuickReplies({ commit },tags) {
    var categories = (tags || {categories : []}).categories;
    var _categories = [];
    var resps = [];
    for(var i in categories){
      var quickReplyMatched = state.quickReplies.filter(function (quickReply) {
        return quickReply.id.category == categories[i]
      })[0];
      if(quickReplyMatched){
          resps.push(quickReplyMatched);
      } else {
        _categories.push(categories[i]);
      }
    }

    if(_categories.length){
      let response = await axios.get("/category/map/smart_reply.json?value="
          + _categories.join(",")
      );
      var data = response.data;
      for(var i in data){
        state.quickReplies.push(data[i]);
        resps.push(data[i]);
      }
    }
    return resps;
    //commit("setMediaOptions", response.data);
  },

  async GetSessions({ commit },options) {
    if(state.chatHistory.contactId == options.contactId){
      return state.chatHistory.sessions;
    }
    let response = await axios.get("/api/sessions/contact",{params : options });
    state.chatHistory.contactId = options.contactId;
    state.chatHistory.sessions = response.data.results;
    commit("setChatHistory",state.chatHistory)
    return response.data.results;
  },
  async GetSessionChats({ commit },options) {
    let response = await axios.post("/api/sessions/messages",options);
    return response.data.results;
  },

};

const mutations = {
  //Contacts
  setChats(state, chats) {
    for(var c in chats){
      chats[c].lastmsg = {};
      for (var i = 0; i < chats[c].messages.length; i++) {
        if(chats[c].messages[i].type == 'I'){
          chats[c].ilastmsg = chats[c].messages[i];
        }  
        if(["I","O"].indexOf(chats[c].messages[i].type) >=0 ){
          chats[c].lastmsg = chats[c].messages[i];
        }
      }
    }
    state.chats = chats;
  },
  setChatHistory(state, chatHistory) {
    state.chatHistory = chatHistory;
  },
  setMeta(state, meta) {
    state.meta = meta;
  },
  setQuickActions(state, quickActions) {
    state.quickActions = quickActions;
  },
  setMediaOptions(state, mediaOptions) {
    state.mediaOptions = mediaOptions;
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
