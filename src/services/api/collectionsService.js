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

// create new collection
export async function createCollection(collection) {
  return http.post(apiEndpoint, collection);
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
  return http.post(
    `${apiEndpoint}/${collectionId}/data`, newRow
  );
}

// delete row on a certain index
export async function deleteRow(collectionId, rowIndex) {
  return http.delete(
    `${apiEndpoint}/${collectionId}/data/${rowIndex}`
  );
}

export default {
  createCollection,
  getCollections,
};
