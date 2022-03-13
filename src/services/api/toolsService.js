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

export async function exportCollectionAsXML(collectionId) {
  return fetch(`${apiEndpoint}/export/${collectionId}/xml`, {
    headers: new Headers({
      "x-auth-token": getJwt(),
    }),
  });
}

export async function exportCollectionAsXLSX(collectionId) {
  return fetch(`${apiEndpoint}/export/${collectionId}/xlsx`, {
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

export async function changeCollectionVisibility(collectionId, visibility) {
  if (visibility !== "private" && visibility !== "public")
    throw new Error(
      'Collection visibility can either be "public" or "private".'
    );
  else
    return http.put(`${apiEndpoint}/visibility/${visibility}/${collectionId}`);
}

export default {
  exportCollectionAsJSON,
  exportCollectionAsXML,
  exportCollectionAsXLSX,
  shareCollection,
  getCollectionShareInvites,
  acceptCollectionShare,
  removeCollectionShare,
  removeAllCollectionShares,
  changeCollectionVisibility,
};
