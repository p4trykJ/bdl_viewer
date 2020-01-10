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
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  config => {
    if (config.statusText === 'OK') {
      return config;
    }
  },
  error => {
    vm.$root.$emit(
      'showSnackbar',
      error.response.data.errors[0].errorReason,
      'error'
    );
    return Promise.reject(error);
  }
);

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawerVisibility: false,
    variables: [],
    variable: undefined,
  },
  getters: {
    getDrawerVisibility(state) {
      return state.drawerVisibility;
    },
    getVariables(state) {
      return state.variables;
    },
    getVariable(state) {
      return state.variable;
    },
  },
  mutations: {
    setDrawerVisibility(state, value) {
      state.drawerVisibility = value;
    },
    setVariables(state, value) {
      state.variables = value;
    },
    setVariable(state, value) {
      state.variable = value;
    },
  },
  actions: {
    getSubjects(ctx, payload) {
      return axios({
        method: 'get',
        url: 'subjects',
        params: payload,
      })
        .then(r => r)
        .catch(e => {
          // console.log(e.response.data);
          return e;
        });
    },
    getVariables(ctx, payload) {
      return axios({
        method: 'get',
        url: 'variables',
        params: payload,
      })
        .then(r => r)
        .catch(e => {
          return e;
        });
    },
    getVariable(ctx, id) {
      return axios({
        method: 'get',
        url: `variables/${id}`,
      })
        .then(r => r)
        .catch(e => {
          return e;
        });
    },
  },
  modules: {},
});
