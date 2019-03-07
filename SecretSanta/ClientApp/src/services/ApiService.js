export class ApiService {
  baseUrl = `${window.location.origin}/api`;

  defaultHeaders = () => {
    return {
      "Access-Control-Allow-Origin": "*"
    };
  };

  constructor(http) {
    this._http = http;
  }

  get = async (url, config = {}) =>
    await this.makeRequest(url, "GET", null, config);

  post = async (url, body, config = {}) =>
    await this.makeRequest(url, "POST", body, config);

  put = async (url, body, config = {}) =>
    await this.makeRequest(url, "PUT", body, config);

  delete = async (url, config = {}) =>
    await this.makeRequest(url, "DELETE", null, config);

  makeRequest = async (url, method, body = null, config = {}) => {
    config.headers = { ...config.headers, ...this.defaultHeaders() };
    try {
      const res = await this._http.request({
        url: `${this.baseUrl}${url}`,
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
          window.alert(message);
        }
      }
      const message = e.message || "Something went wrong.";
      window.alert(message);
    }
  };
}
