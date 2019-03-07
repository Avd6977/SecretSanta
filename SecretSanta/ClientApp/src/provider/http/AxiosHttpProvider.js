import axios from "axios";

export class AxiosHttpProvider {
  async get(url, config) {
    return await axios.get(url, config);
  }

  async post(url, body, config) {
    return axios.post(url, body, config);
  }

  async request(config) {
    return axios(config);
  }
}
