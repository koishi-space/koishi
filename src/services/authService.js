import jwtDecode from "jwt-decode";
import http from "./httpService";

var apiEndpoint = process.env.REACT_APP_API_URL + "/auth";

http.setJwt(getJwt());

export async function login(email, password) {
  try {
    const { data: jwt } = await http.post(apiEndpoint, { email, password });
    localStorage.setItem("auth-token", jwt);
    return true;
  } catch (e) {
    return false;
  }
}

export function loginWithJwt(jwt) {
  localStorage.setItem("auth-token", jwt);
}

export function logout() {
  localStorage.removeItem("auth-token");
}

export function getCurrentUser() {
  try {
    const jwt = getJwt();
    return jwt != null ? jwtDecode(jwt) : null;
  } catch (ex) {
    return null;
  }
}

export function getJwt() {
  return localStorage.getItem("auth-token") || "";
}

const exp = {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt,
};

export default exp;
