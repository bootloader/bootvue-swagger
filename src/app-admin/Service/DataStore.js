//store/modules/auth.js


import axios from "axios";
import Vue from 'vue';
import formatters from '../../services/formatters';
import jscovery from '../../services/jscovery';

  async function post(url,option){
    try{
        let response = await axios.post(url,option);
        return response;
    } catch (e){
      if(e.response && e.response){
        throw e;
      }
    }

  }

const state = {
  user: null,
  posts: null,
  agents : null,
  teams : null,
  chatsCounter : 1,
  meta : null,
  quickReplies : [],
  qreps : null,qaxns : null,qlabels : null, qtags : null,qmeds : null,
  quickTags:[]
};

var tagFormat = function (argument) {
    return {
        id : argument.id,
        category : argument.category,
        title : argument.title,
        text : argument.title,
        code : argument.code,
        color : formatters.hexacode(argument.category),
        selected:false
    };
}
const getters = {
    //Contacts
  isAuthenticated: (state) => !!state.user,
  StateQReps: (state) => state.qreps,
  StateQMeds: (state) => state.qmeds,
  StateQAxns: (state) => state.qaxns,
  StateQLabels: (state) => state.qlabels,
  StateQTags: (state) => state.qtags,
  StateTeams: (state) => state.teams,
  StateAgents: (state) => state.agents,
  StateMeta: (state) => state.meta,
  StateQuickTags: (state) => state.quickTags,
  StateQuickTagsSorted: function(state){
    let sortedObj = {};
    let tags = state.qtags;

    tags?.map(v=>{
        sortedObj[v.category] = sortedObj[v.category] ? [...sortedObj[v.category], v] : [v] 
    })
    return sortedObj;
  },
};

const actions = {
  async Register({dispatch}, form) {
    await axios.post('register', form)
    let UserForm = new URLSearchParams()
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

  async LogOut({ commit }) {
   axios.get("/auth/logout");
    let user = null;
    commit("logout", user);
  },

  async CreatTeam({ commit },team) {
    let response = await axios.post("/api/admins/dept",team);
    commit("setTeams", response.data.results);
  },
  async GetTeams({ commit }) {
    let response = await axios.get("/api/admins/dept");
    commit("setTeams", response.data.results);
  },
  async SetTeamsDefault({ commit },team) {
    let UserForm = new URLSearchParams();
    UserForm.append('dept_id', team.id);
    let response = await axios.post("/api/admins/dept/default",UserForm
    );
    commit("setTeams", response.data.results);
  },

  async GetAgents({ commit }) {
    let response = await axios.get("/api/admins/agent");
    commit("setAgents", response.data.results);
  },

  async CreateAgent({ commit },agent) {
    agent.agent_channels = (agent.channels || []).join(",");
    let response = await post("/api/admins/agent",agent);
    commit("setAgents", response.data.results);
  },

  async SetAgentDefault({ commit },agent) {
    let UserForm = new URLSearchParams();
    UserForm.append('agent_id', agent.id);
    let response = await axios.post("/api/admins/agent/default",UserForm
    );
    commit("setAgents", response.data.results);
  },

  async DeActivateAgent ({ commit },agent){
     console.log("--",agent)
     agent.isactive = (agent.isactive == "Y" ? "N" : "Y");
     let UserForm = new URLSearchParams();
     UserForm.append('agent_id', agent.id);
     UserForm.append('status', agent.isactive);
     let response = await axios.delete("/api/admins/agent?agent_id="+agent.id +"&status=" + agent.isactive,{
      data : {id : agent.id, status : agent.isactive }
     });
     commit("setAgents", response.data);
  },
  async DeAdminAgent ({ commit },agent){
     console.log("--",agent)
     let UserForm = new URLSearchParams();
     UserForm.append('agent_id', agent.id);
     let response = await axios.post("/api/admins/agent/admin",UserForm);
     commit("setAgents", response.data);
  },
  

  async LoadAnalytics({ commit },options) {
    let response = await axios.post("/admin/agent-dashboard-analytics",options);
    return response.data;
  },

  async LoadAgentList() {
    let response = await axios.get("/admin/fetch-agent-chat-session-list");
    return response.data;
  },

  async CreatQuickReps({ commit },qReps) {
    let UserForm = new URLSearchParams()
    UserForm.append('id', qReps.id);
    UserForm.append('category', qReps.category);
    UserForm.append('title', qReps.title);
    UserForm.append('template', qReps.template);
    let response = await axios.post("/api/tmpl/quickreps",UserForm);
    commit("setQReps", response.data.results);
  },

  async GetQuickReps({ commit }) {
    let response = await axios.get("/api/tmpl/quickreps");
    commit("setQReps", response.data.results);
  },

  async DeleteQuickReps({ commit },qReps) {
    let response = await axios.delete("/api/tmpl/quickreps?id=" + qReps.id,{
      data : {id : qReps.id}
     });
    commit("setQReps", response.data.results);
  },


// Quick Actions
  async CreatQuickAxns({ commit },qReps) {
    let UserForm = new URLSearchParams()
    UserForm.append('id', qReps.id);
    UserForm.append('category', qReps.category);
    UserForm.append('title', qReps.title);
    UserForm.append('code', qReps.code);
    let response = await axios.post("/api/tmpl/quickaxn",UserForm);
    commit("setQAxns", response.data.results);
  },

  async GetQuickAxns({ commit }) {
    let response = await axios.get("/api/tmpl/quickaxn");
    commit("setQAxns", response.data.results);
  },

  async DeleteQuickAxns({ commit },qReps) {
    let response = await axios.delete("/api/tmpl/quickaxn?id=" + qReps.id,{
      data : {id : qReps.id}
     });
    commit("setQAxns", response.data.results);
  },


// Quick Labels
  async CreatQuickLabels({ commit },qReps) {
    let UserForm = new URLSearchParams()
    UserForm.append('id', qReps.id);
    UserForm.append('category', qReps.category);
    UserForm.append('title', qReps.title);
    UserForm.append('code', qReps.code);
    let response = await axios.post("/api/tmpl/quicklabels",UserForm);
    commit("setQLabels", response.data.results);
  },

  async LoadQuickLabels({ commit }) {
    let response = await axios.get("/api/tmpl/quicklabels");
    commit("setQLabels", response.data.results);
  },

  async DeleteQuickLabels({ commit },qReps) {
    let response = await axios.delete("/api/tmpl/quicklabels?id=" + qReps.id,{
      data : {id : qReps.id}
     });
    commit("setQLabels", response.data.results);
  },


  // Quick Tags
  async CreatQuickTags({ commit },qReps) {
    let UserForm = new URLSearchParams()
    UserForm.append('id', qReps.id);
    UserForm.append('category', qReps.category);
    UserForm.append('title', qReps.title);
    UserForm.append('code', qReps.code);
    let response = await axios.post("/api/tmpl/quicktags",UserForm);
    commit("setQTags", response.data.results);
  },

  async LoadQuickTags({ commit }) {
    let response = await axios.get("/api/tmpl/quicktags");
    commit("setQTags", response.data.results);
  },

  async DeleteQuickTags({ commit },qReps) {
    let response = await axios.delete("/api/tmpl/quicktags?id=" + qReps.id,{
      data : {id : qReps.id}
     });
    commit("setQTags", response.data.results);
  },

// Media

  async CreatQuickMeds({ commit },qMeds) {
    let UserForm = new URLSearchParams()
    UserForm.append('name', qMeds.name);
    UserForm.append('category', qMeds.category);
    UserForm.append('title', qMeds.title);
    UserForm.append('url', qMeds.url);
    UserForm.append('content', qMeds.content);
    let response = await axios.post("/api/tmpl/quickmedia",UserForm);
    commit("setQMeds", response.data.results);
  },

  // Chat
  async GetSessions({ commit },options) {
    let response = await axios.get( "/api/message/session",{ params : options });
    return response.data;
  },
  async GetSessionChats({ commit },options) {
    let response = await axios.post("/api/message/messages",options);
    return response.data.data;
  },
  async DeleteSessionChats({ commit },options) {
    let response = await axios.post("/api/message/session/remove",options);
    return response.data.data;
  },


  //Taxonomy
  async GetTaxonomy({ commit },filter) {
    let response = await axios.post("/admin/tag-analytics",filter);
    //commit("setTaxonomy", response.data.results);
    return response.data;
  },


  async ParseChatFile({ commit },params) {
    const fd = new FormData();
    fd.append("file",params.file);
    fd.append("contactType",params.contactType);
    fd.append("clientDate",params.clientDate);
    fd.append("clientDateFormat",params.clientDateFormat);
    let response = await post('/api/message/session/parse',fd);
    return response.data;
  },
  async UploadParsedChat({ commit },req) {
    let response = await post('/api/message/session/import',req);
    return response.data;
  },



    //Setup Config
  async GetConfigs({ commit }) {
    let response = await axios.get("/api/config");
    //commit("setTaxonomy", response.data.results);
    return response.data;
  },
  async SetConfigs({ commit }, config) {
    let response = await axios.post("/api/config", config);
    //commit("setTaxonomy", response.data.results);
    return response.data;
  },



  async GetRequest({commit,dispatch},{ url,params }) {
    let response = await axios.get(url,{ params : params });
    return response.data;
  },

  async PostRequest({commit,dispatch},{ url,params }) {
    let response = await axios.post(url,params);
    return response.data;
  },
  async LoadQuickTag({ commit }) {
    let response = await axios.get("/gallery/map/quick_tags");
    commit("setQuickTags", response.data);
  },

  async GetFAQParent({ commit },options) {
    let response = await axios.get( "/pub/app/faq/parent",{ params : options });
    return response.data;
  },
  async GetFAQByParentCode({ commit },options) {
    let response = await axios.get( "/pub/app/faq/parent/code",{ params : options });
    return response.data;
  },
  async CreateFAQ({ commit },options) {
    let response = await axios.post( "/pub/app/faq",{ params : options });
    return response.data;
  },
  async UpdateFAQ({ commit },options) {
    let response = await axios.post( "/pub/app/update/faq",{ params : options });
    return response.data;
  },
  async getAllFAQ({ commit },options) {
    let response = await axios.get( "/pub/app/faq/all",{ params : options });
    return response.data;
  },
};

const mutations = {
  setQLabels(state, qlabels) {
    state.qlabels = qlabels;
    formatters.addContactLabels(qlabels);
  },
  setQTags(state, qtags) {
    state.qtags = qtags;
    formatters.addContactLabels(qtags);
  },
  setQAxns(state, qaxns) {
    state.qaxns = qaxns;
  },
  setQReps(state, qreps) {
    state.qreps = qreps;
  },
  setQMeds(state, qmeds) {
    state.qmeds = qmeds;
  },
  setTeams(state, teams) {
    state.teams = teams;
  },
  setAgents(state, agents) {
    state.agents = agents;
  },
  setMeta(state, meta) {
    state.meta = meta;
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
  setQuickTags(state, quickTags) {
    let tags = quickTags.map(v=>tagFormat(v));
    formatters.addContactTags(tags);
    state.quickTags = tags;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
