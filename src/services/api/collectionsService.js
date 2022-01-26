import http from "../httpService";

var apiEndpoint = process.env.REACT_APP_API_URL + "/collections";

// ===Collection===
// get all user's collections
export async function getCollections() {
  return http.get(apiEndpoint);
}

// get one exact collection with all fields populated
export async function getCollection(collectionId) {
  return http.get(`${apiEndpoint}/${collectionId}`);
}

// get one exact collection but do not populate its fields
export async function getCollectionNoPopulate(collectionId) {
  return http.get(`${apiEndpoint}/${collectionId}?noPopulate`);
}

// create new collection
export async function createCollection(collection) {
  return http.post(apiEndpoint, collection);
}

// edit collection
export async function editCollection(collectionId, payload) {
  return http.put(`${apiEndpoint}/${collectionId}`, payload);
}

// delete a collection
export async function deleteCollection(collectionId, actionToken) {
  if (!actionToken) return http.delete(`${apiEndpoint}/${collectionId}`);
  else
    return http.delete(
      `${apiEndpoint}/${collectionId}?actionToken=${actionToken}`
    );
}

// ===Model===
// get collection model
export async function getCollectionModel(collectionId) {
  return http.get(`${apiEndpoint}/${collectionId}/model`);
}

// ===Data===
// get collection data
export async function getCollectionData(collectionId) {
  return http.get(`${apiEndpoint}/${collectionId}/data`);
}

// add new row to the collection data
export async function addRowToCollection(collectionId, newRow) {
  return http.post(`${apiEndpoint}/${collectionId}/data`, newRow);
}

// delete row on a certain index
export async function deleteRow(collectionId, rowIndex) {
  return http.delete(`${apiEndpoint}/${collectionId}/data/${rowIndex}`);
}

// ===Settings===
// get collection settings
export async function getCollectionSettings(collectionId) {
  return http.get(`${apiEndpoint}/${collectionId}/settings`);
}

// save collection settings
export async function saveCollectionSettings(collectionId, settings) {
  return http.put(`${apiEndpoint}/${collectionId}/settings`, settings);
}

// reset collection settings
export async function resetCollectionSettings(collectionId) {
  return http.put(`${apiEndpoint}/${collectionId}/settings/reset`);
}

export default {
  getCollections,
  getCollection,
  getCollectionNoPopulate,
  createCollection,
  editCollection,
  deleteCollection,
  getCollectionModel,
  getCollectionData,
  addRowToCollection,
  deleteRow,
  getCollectionSettings,
  saveCollectionSettings,
  resetCollectionSettings,
};
