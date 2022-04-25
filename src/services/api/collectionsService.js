import http from "../httpService";

var apiEndpoint = process.env.REACT_APP_API_URL + "/collections";

// ===Collection===
// get all user's collections
export async function getCollections() {
  return http.get(apiEndpoint);
}

export async function getPublicCollections(fetchOwners = true) {
  return http.get(`${apiEndpoint}/public?fetchOwners=${fetchOwners}`);
}

export async function getPublicCollection(collectionId) {
  return http.get(`${apiEndpoint}/public/${collectionId}`);
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
  return http.patch(`${apiEndpoint}/${collectionId}`, payload);
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
export async function editRow(collectionId, rowIndex, payload) {
  return http.put(`${apiEndpoint}/${collectionId}/data/${rowIndex}`, payload);
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

// create new, empty collection settings preset
export async function newCollectionSettings(collectionId) {
  return http.post(`${apiEndpoint}/${collectionId}/settings/new`);
}

// save collection settings
export async function saveCollectionSettings(
  collectionId,
  settingsId,
  settings
) {
  return http.put(
    `${apiEndpoint}/${collectionId}/settings/${settingsId}`,
    settings
  );
}

// rename collection settings
export async function renameCollectionSettings(
  collectionId,
  settingsId,
  newName
) {
  return http.patch(
    `${apiEndpoint}/${collectionId}/settings/${settingsId}/rename`,
    { name: newName }
  );
}

// reset collection settings
export async function resetCollectionSettings(collectionId) {
  return http.put(`${apiEndpoint}/${collectionId}/settings/reset`);
}

// delete collection settings preset
export async function deleteCollectionSettings(collectionId, settingsId) {
  return http.delete(`${apiEndpoint}/${collectionId}/settings/${settingsId}`);
}

// save realtime session as a regular collection
export async function saveRealtimeSession(title, data, model, settings) {
  console.log(data);
  return http.post(`${apiEndpoint}/realtime/save`, {
    title: title,
    sessionData: data,
    model: model,
    settings: settings,
  });
}

export async function getEmptySettings() {
  return http.get(`${apiEndpoint}/empty/settings`);
}

const exp = {
  getCollections,
  getPublicCollections,
  getPublicCollection,
  getCollection,
  getCollectionNoPopulate,
  createCollection,
  editCollection,
  deleteCollection,
  getCollectionModel,
  getCollectionData,
  addRowToCollection,
  editRow,
  deleteRow,
  getCollectionSettings,
  saveCollectionSettings,
  resetCollectionSettings,
  newCollectionSettings,
  renameCollectionSettings,
  deleteCollectionSettings,
  saveRealtimeSession,
  getEmptySettings,
};

export default exp;
