import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    _defaultView: '',    //默认地图view
    _defaultMapTreeVisible: false,    //地图目录树显示/隐藏
    _defaultNavigateVisible: false,    //行政区划面板显示/隐藏
};

const getters = {
    _getDefaultView() {          //名字随意取
        return state._defaultView;
    },
    _getDefaultMapTreeVisible() {          //名字随意取
        return state._defaultMapTreeVisible;
    },
    _getDefaultNavigateVisible() {
        return state._defaultNavigateVisible;
    }
};

const mutations = {
    _setDefaultView(state, value) {
        state._defaultView = value;
    },
    _setDefaultMapTreeVisible(state, value) {
        state._defaultMapTreeVisible = value;
    },
    _setDefaultNavigateVisible(state, value) {
        state._defaultNavigateVisible = value;
    }
}

const store = new Vuex.Store({
    // state:state,
    state,
    getters,
    mutations,
});

export default store;