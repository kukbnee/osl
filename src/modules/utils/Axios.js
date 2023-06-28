//ajax통신 공통정의
import axios from 'axios'
import { oslLogout } from '../common/oslLogin';
import { authorization, getSessionData } from '../common/tokenBase';
import PathConstants from '../constants/PathConstants';

let isError = false;

const instance = axios.create({
 // baseURL: "/api1/",
  timeout: 600000,
  transformRequest: [
    function (data) {
      console.log("transformRequest>>", data);
      return data;
    },
  ],
  transformResponse: [
    function (data) {
      console.log("transformResponse>>", data);
      return JSON.parse(data);
    },
  ],
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, DELETE, PUT, POST, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
    "Accept": "application/json",
    "Content-Type": "application/json; charset=UTF-8",
  },
});

instance.interceptors.request.use(
  //요청을 보내기 전처리
  function (config) {

    config.headers = Object.assign(
      config.headers,
      { "appKey": process.env.REACT_APP_OSL_APP_KEY }
    );
    //config.data = JSON.stringify(config.data);

    return Promise.resolve(config);
  },
  function (error) {
    return Promise.reject(error);
  }
);


instance.interceptors.response.use(
  //응답처리
  function (response) {
    //response 가공
    return Promise.resolve(response);
  },
  function (error) {
    //오류 처리
    return Promise.reject(error);
  }
);



const request = async function (opt) {
  const options = {
    baseURL: process.env.REACT_APP_IBK_OAP_URL,
    method: "POST",
    ifHandleError: true,
    validateStatus: function(status) {
      if(status === 401) {
        alert('다른 기기에서 접속한 이력이 있습니다. 재시도 해주시기 바랍니다.');
        oslLogout();
      }
      return status >=200 && status < 300 || status === 307;
    },
    ...opt,
  };
  console.log("request options>>", options);
  try {
    const response = (await instance(options));
    // if (!response.success && options.ifHandleError) {
    //   //[todo]처리
    // }

    return response;
  } catch (error) {
    console.log("resErr", error);
    //window.location.href = PathConstants.SERVICE_ERROR;
    return error;
  }
};

export default request;