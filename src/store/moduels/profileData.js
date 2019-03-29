// import { mutations, actions, getters, state } from "module";
const userProfileData = {
  state: {
    profileData: {}
  },
  mutations: {
    MUTATION_SET_USER_PROFILE_DATA (state, payload) {
      state.profileData = payload
    }
  },
  getters: {
    getProfileData: state => state.profileData
  }
}
export default userProfileData
