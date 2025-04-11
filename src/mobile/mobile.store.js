import Vue from "vue"
import Vuex from "vuex"
import SecureLS from "secure-ls"
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex);

let ls = new SecureLS({isCompression: false});

const SYS_ID = 1;
// const ORG_ID = 1;

const getStaticState = () => {
  return {
    sys_id: SYS_ID,
    httpurl: null,
  }
}

const getDefaultState = () => {
  return {
    token: "",
    org_id: null,
    openid: null,
    sidebar_id: null,
    task_id:null,
    userinfo: {
      pk: null,
      sys_id: SYS_ID,
      username: "",
      mobile: "",
      department_id: null,
      is_active: false,
      is_superuser: false,
      full_name: "",
      func_names: [],
      func_codenames: [],
      func_group_names: [],
      available_permissions_names: []
    },
    orginfo: {
      name: null,
    },
    systemlist: [],
  }
}


const state = {
  ...getDefaultState(),
  ...getStaticState(),
  // isActive: "home",
};

const actions = {};

export const LOGIN = "LOGIN"
export const ORGID = "ORGID"
export const LOGOUT = "LOGOUT"
export const USERINFO = "USERINFO"
export const ORGINFO = "ORGINFO"
export const OPENID = "OPENID"
export const HTTPURL = "HTTPURL"

const mutations = {
  [USERINFO](state, userinfo) {
    state.userinfo = userinfo;
    state.org_id = userinfo.org_id;
  },
  [ORGINFO](state, orginfo) {
    state.orginfo = orginfo;
  },
  [LOGIN](state, token) {
    state.token = token;
  },
  [ORGID](state, org_id) {
    state.org_id = org_id;
  },
  [OPENID](state, openid) {
    state.openid = openid;
  },
  [LOGOUT](state) {
    Object.assign(state, getDefaultState());
    state.token = null;
    state.userinfo = null;
  },
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
  [HTTPURL](state, url) {
    state.httpurl = url
  },
  setActive(state, indexa) {
    this.state.isActive = indexa;
  },
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  plugins: [createPersistedState({
    storage: {
      getItem: key => ls.get(key),
      setItem: (key, value) => ls.set(key, value),
      removeItem: key => ls.remove(key)
    }
  })]
})
