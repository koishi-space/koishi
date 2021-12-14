import jwtDecode from "jwt-decode";
import http from "./httpService";

var apiEndpoint = (process.env.REACT_APP_API_URL + "/auth");

http.setJwt(getJwt());

async function login(email, password) {
  const { data: jwt } = await http.post(apiEndpoint, { email, password });
  localStorage.setItem("auth-token", jwt);
}

function loginWithJwt(jwt) {
  localStorage.setItem("auth-token", jwt);
}

function logout() {
  localStorage.removeItem("auth-token");
}

function getCurrentUser() {
  try {
    const jwt = getJwt();
    return jwt != null ? jwtDecode(jwt) : null;
  } catch (ex) {
    return null;
  }
}

function getJwt() {
  return localStorage.getItem("auth-token") || "";
}

export default {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt,
};
