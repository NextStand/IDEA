export default {
    /**
     * 设置登录者用户信息
     * @param {Object} state 
     * @param {Objec} payload 载荷
     */
    setUserInfo(state, payload) {
        payload["cu_password"] = payload["cu_password"].substr(0, 10);
        state.userInfo = { ...state.userInfo, ...payload };
        sessionStorage.setItem('userInfo', JSON.stringify(payload));
    }
}