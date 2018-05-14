export default {
    /**
     * 获取登录者信息
     * @param {string} key 登录者信息key
     * @return {string | object}
     */
    me: (state) => (key) => {
        let userInfo = state.userInfo;
        if (JSON.stringify(userInfo) === "{}") {
            userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        }
        return key ? userInfo[key] : userInfo;
    }
}