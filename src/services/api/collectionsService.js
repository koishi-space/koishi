import http from "../httpService";

var apiEndpoint = process.env.REACT_APP_API_URL + "/collections";

export async function createCollection(collection) {
  return http.post(apiEndpoint, collection);
}

export default {
  createCollection,
};
