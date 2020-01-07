import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

/* eslint-disable */
axios.interceptors.request.use(
  config => {
    config.baseURL = process.env.VUE_APP_BDL_API_URL;
    config.params = Object.assign(
      {format: 'json', 'page-size': 100},
      config.params
    );
    config.headers = Object.assign(
      {
        // 'X-ClientId': process.env.VUE_APP_BDL_API_KEY,
        // 'Access-Control-Allow-Origin': '*',
      },
      config.headers
    );
    console.log(config);
    return config;
  },
  error => {
    console.log('TCL: error', error);
    // Do something with request error
    return Promise.reject(error);
  }
);

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawerVisibility: false,
  },
  getters: {
    getDrawerVisibility(state) {
      return state.drawerVisibility;
    },
  },
  mutations: {
    setDrawerVisibility(state, value) {
      state.drawerVisibility = value;
    },
  },
  actions: {
    getSubjects(ctx, payload) {
      return axios({
        method: 'get',
        url: 'subjects',
        params: payload,
      })
        .then(r => {
          if (r.data) {
            return r;
          }
          return false;
        })
        .catch(e => {
          return e;
        });
    },
  },
  modules: {},
});
