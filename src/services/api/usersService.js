import http from "../httpService";

var apiEndpoint = (process.env.REACT_APP_API_URL + "/users");

export async function registerUser(user) {
    return http.post(apiEndpoint, user);
}

export async function verifyUser(token) {
  return http.post(apiEndpoint + "/verify", {"verificationCode": token});
}

export default {
  registerUser,
  verifyUser,
};
