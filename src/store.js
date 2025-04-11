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
      quanxian:{
        "扫码展示": false,
        '扫码答题考试':false,
        '扫码调研问卷': false,
        '扫码考评':false,
        '发票扫码查验':false,
        '扫码填报': false,
        '扫码巡检': false,
        '固定资产': false,
        '物品领用': false,
        '任务督办': false,
        '单位来访登记': false,
        '档案管理': false,
        'app签名':false,
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
export const quanxian = "quanxian"

const mutations = {
    [USERINFO](state, userinfo) {
        state.userinfo = userinfo;
        state.org_id = userinfo.org_id;
    },
    [ORGINFO](state, orginfo) {
        state.orginfo = orginfo;
    },
    [quanxian](state, quanxian) {
      state.quanxian = quanxian;
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
