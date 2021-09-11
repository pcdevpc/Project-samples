import axios from "axios";
import logger from "sabio-debug";
import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "./serviceHelpers";
const _logger = logger.extend("userLicenses");

var endpoint = `${API_HOST_PREFIX}/api/UserLicenses`;

let add = (payload) => {
  _logger("addUserLicenses is executing");
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

let getAll = (pageIndex, pageSize, tableName) => {
  _logger("getAllUserLicenses is executing");
  const config = {
    method: "GET",
    url: `${endpoint}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}&tableName=${tableName}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

let deleteLicense = (id) => {
  _logger("deleteUserLicenses is executing");
  const config = {
    method: "DELETE",
    url: `${endpoint}/${id}`,
    data: id,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

let getById = (id) => {
  _logger("getById is executing");
  const config = {
    method: "GET",
    url: `${endpoint}/${id}`,
    data: id,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

let updateById = (payload) => {
  _logger("updateById is executing");
  const config = {
    method: "PUT",
    url: `${endpoint}/${payload.id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export { getAll, deleteLicense, getById, updateById, add };
