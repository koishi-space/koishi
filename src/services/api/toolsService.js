import http from "../httpService";
import { getJwt } from "../authService";

var apiEndpoint = process.env.REACT_APP_API_URL + "/tools";

export async function exportCollectionAsJSON(collectionId) {
  return fetch(`${apiEndpoint}/export/${collectionId}/json`, {
    headers: new Headers({
      "x-auth-token": getJwt(),
    }),
  });
}

export default {
  exportCollectionAsJSON,
};
