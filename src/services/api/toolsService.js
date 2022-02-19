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

export async function shareCollection(collectionId, userEmail, allowEditing) {
  return http.post(`${apiEndpoint}/share/add/${collectionId}`, {
    userEmail: userEmail,
    role: allowEditing ? "edit" : "view",
  });
}

export async function getCollectionShareInvites() {
  return http.get(`${apiEndpoint}/share/invites`);
}

export async function acceptCollectionShare(actionTokenId) {
  return http.put(`${apiEndpoint}/share/accept/${actionTokenId}`);
}

export async function declineCollectionShare(actionTokenId) {
  return http.put(`${apiEndpoint}/share/decline/${actionTokenId}`);
}

export async function removeCollectionShare(collectionId, userEmail) {
  return http.put(`${apiEndpoint}/share/remove/${collectionId}`, {
    userEmail: userEmail,
  });
}

export async function removeAllCollectionShares(collectionId) {
  return http.put(`${apiEndpoint}/share/remove/${collectionId}/all`);
}

export default {
  exportCollectionAsJSON,
  shareCollection,
  getCollectionShareInvites,
  acceptCollectionShare,
  removeCollectionShare,
  removeAllCollectionShares,
};
