export class ApiService {
  _http;

  defaultHeaders = () => {
    return {
      "Access-Control-Allow-Origin": "*"
    };
  };

  constructor(http) {
    this._http = http;
  }

  get = async (url, config = {}) =>
    await this.makeRequest(`${this.baseUrl}/${url}`, "GET", null, config);

  post = async (url, body, config = {}) =>
    await this.makeRequest(`${this.baseUrl}/${url}`, "POST", body, config);

  put = async (url, body, config = {}) =>
    await this.makeRequest(`${this.baseUrl}/${url}`, "PUT", body, config);

  delete = async (url, config = {}) =>
    await this.makeRequest(`${this.baseUrl}/${url}`, "DELETE", null, config);

  makeRequest = async (url, method, body = null, config = {}) => {
    config.headers = { ...config.headers, ...this.defaultHeaders() };
    try {
      const res = await this._http.request({
        url,
        method,
        data: body,
        ...config
      });
      return !res ? null : res.data;
    } catch (e) {
      const response = e.response;
      if (response && response.data) {
        const message = response.data.error || response.data.message;
        if (message) {
          console.alert(message);
        }
      }
      const message = e.message || "Something went wrong.";
      console.alert(message);
    }
  };
}
