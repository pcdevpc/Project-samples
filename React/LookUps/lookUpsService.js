import axios from "axios";
import logger from "sabio-debug";
import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "./serviceHelpers";
const _logger = logger.extend("userLicenses");

var endpoint = `${API_HOST_PREFIX}/api/lookups`;

let getLookUp = (payload) => {
  _logger("getLookUp is executing");
  const config = {
    method: "POST",
    url: endpoint,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export { getLookUp };
