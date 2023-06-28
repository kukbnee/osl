/**
 * IBK시스템에서 제공
 * OSL프로젝트의 리액트에 맞게 수정함
 */
/*
IBKS에서 제공한 callOpenApi 분석
callOpenApi(uri, data, successCB, errorCB)
api uri
post방식 data param
success콜백
error콜백
1. authorization(func)
  isSessionExpire() >>> getSessionData() === null, getSessionData().expire < getCurTimestamp() true  : false
  true면 refreshAccessToken()호출 >> isSessionRefreshExpire()체크 >> getSessionData()가 null || getSessionData().refreshExpire < getCurTimestamp() true : false 
    true면 callback(null)(xhr.abort)
    아니면 isSessionRefreshExpire()체크 true이면 callback(null)(xhr.abort) false면 appKey,grantType,refresh토큰값받아와서 api(app/cm/v1/cmm300/tokenRefresh)호출 >>성공시 받아온데이터로 updateSession
  아니면 callbak(getSession())(getSessionData()갖고 accessToken 체크및 헤더추가해서 api(uri) 호출)
정리...
isSessionExpire체크, 만료시 isSessionRefreshExpire체크 만료시 요청취소
  isSessionExpire체크 만료아닐시 oAuth값 담아서 해당 api호출,
  isSeesionExpire체크 만료, isSEssionRefreshExpire체크 만료아닐시 
  tokenRefresh api호출하고 받아온값으로 /COM001/getRefreshToken.do호출하고 storage.setItem("si"), 받아온 값으로 oAuth값 담아서 해당 api호출
*/
import axios from "axios";
import API from "../constants/API";
import PathConstants from "../constants/PathConstants";
import request from "../utils/Axios";
import { getCookie } from "./boxlogin";
import oslLogin, { oslLogout } from "./oslLogin";


var _APP_KEY          = "l7xxK128ZveJ93TckkQ3lfiy4BBL8XGHeJJP";
var _STORAGE_KEY = "session";
var _SESSION_KEY = "SI";

var _EXPIRE_KEY = "expire";

var _REFRESH_EXPIRE_KEY = "refresh_expire";
var _REFRESH_TOKEN_EXPIRE_KEY = "refreshExpire";

var _ACCESS_TOKEN_KEY = "accessToken";

var _REFRESH_TOKEN_KEY = "refreshToken";

var _TOKEN_TYPE_KEY = "tokenType";

var _PROFILE_IMG_KEY  = "profileImage";
var _PROFILE_NM_KEY   = "bplcNm";
var _PROFILE_TYPE_KEY = "indvEnprDcd";
var _PROFILE_ATHR_CD  = "lgnMmbrAthrCd";
var _PROFILE_BSNN_NO  = "mmcrBsnnNo";

var _POST_METHOD = "POST";
var _GET_METHOD = "GET";

var _REFRESH_TOKEN_GRANT_TYPE = "refresh_token";

var _REFRESH_TOKEN_EXPIRESIN = 60000*30;


/**
 * 여기서 사용하는 storage를 정의한다.
 */
//var _STORAGE = localStorage;	
var _STORAGE = sessionStorage;

/**
 * 모든 ajax통신은 이 함수 호출을 통해서 한다
 * @param {*} uri
 * @param {*} data 
 * @param {*} successCB 
 * @param {*} errorCB 
 */
export const callOpenApi = async ( uri, data, successCB, errorCB )=> {
	
	//토큰인증
	authorization( async function( oAuth ) {
		
		console.log("authorization");

		var successCallBack = successCB || AjaxSuccessHandler;
		var errorCallBack = errorCB || AjaxErrorHandler;
		var appKey = _APP_KEY;
		var sendData = data || {};

		// if( oAuth == null || oAuth.accessToken == null ) {
		// 	oslLogin();
		// 	return ;
		// }
		
		let configData = {
			headers: {
				"Content-Type": "application/json",
				"appKey": process.env.REACT_APP_OSL_APP_KEY,
				"Authorization": oAuth.tokenType+" "+oAuth.accessToken
			}
		}
		
    const res = await request({
      method: "post",
      url: uri,
      data: JSON.stringify(sendData),
			headers: configData.headers
    })
		.then((response) => {
			console.log("requestAxios", response);
			successCallBack(response);
			return response;
		})
		.catch((error) => {
			errorCallBack(error);
			console.log("error : ", error);
		});
	});
}

/**
 * access token 체크
 * @param {*} callback OAP통신
 */
export const authorization = ( callback )=> {
	
	if( isSessionExpire() ){
		console.log("SessionExpire=true");
		refreshAccessToken(callback);
	}
	else{
		console.log("SessionExpire=false");
		callback(getSessionData());	
	}
}

/**
 * refresh token 체크해서 토큰 재생성
 * @param {*} callback OAP통신
 */
async function refreshAccessToken( callback ){
	
	if( isSessionRefreshExpire() ) {
		console.log("SessionRefreshExpire==>true");
		//refersh token 만료시 로그아웃
		oslLogout();
	}
	else{
		console.log("SessionRefreshExpire==>false", callback);
		var refreshToken = getSessionRefreshToken();
		if( refreshToken == null ) {
			oslLogout();
		}else {
			var sendData = {
					"appKey": process.env.REACT_APP_OSL_APP_KEY,
					"refreshToken": refreshToken,
					"grantType": _REFRESH_TOKEN_GRANT_TYPE
			};

			let configData = {
				headers: {
					"Content-Type": "application/json",
					"appKey": process.env.REACT_APP_OSL_APP_KEY
				}
			};

			const res = await request({
				method: "post",
				url: process.env.REACT_APP_IBK_OAP_URL + "/app/cm/v1/cmm300/tokenRefresh",
				data: JSON.stringify(sendData),
				headers: configData.headers
			})
			.then((response) => {
				console.log("refreshToken", response);
				updateSession(response.data, callback);
				
			})
			.catch((error) => {
				console.log("error : ", error);
			});
		}
	}
}

/**
 * sessionStorage upadate
 * @param {*} newData 
 * @param {*} callback OAP통신
 */
async function updateSession( newData, callback ){	
	var data = getSessionData();
	let callbackData = data;
	console.log("getSessiondata", data);
	if( data ){
		for(let key in newData ){
			/**
			 * Token 갱신시에 2개의 필드는 널이 리턴되므로 업데이트 하지 않음
			 */
			if( key !== "grantType" && key !== "refreshTokenExpiresIn" ){
				data[key] = encodeURIComponent(newData[key]);
				callbackData[key] = newData[key];
			}
		}
	}
	else{
		data = newData;
		callbackData = newData;
	}
	
	let configData = {
		headers: {
			"Content-Type": "application/json",
			"appKey": process.env.REACT_APP_OSL_APP_KEY
		}
	}
	console.log("!!!!!!!!!!!!!!!",JSON.stringify(data));
	const res = await request({
		method: "post",
		url: process.env.REACT_APP_IBK_OAP_URL + "/api/cm/v1/cmi501/tokenIssue",
		data: JSON.stringify(data),
		headers: configData.headers
	})
	.then((response) => {
		console.log("getRefreshToken", response);
		console.log("callback newData", data);
		saveSession(response.data.token);
		callback(callbackData);
	})
	.catch((error) => {
		console.log("error : ", error);
	});

}

/**
 * 토큰체크 함수 (osl추가)
 * @returns access token 정상 : 'Y', refresh token : 만료 'N', sessionStorage 없으면 : 'X'
 */
export const isToken = ()=> {
	if( isSessionExpire() ){
		console.log("isToken_accessToken>>만료", getSessionData());
		//세션이 없는경우
		if(!getSessionData()) {
			console.log("isToken_accessToken>>세션없음");
			return "X";
		}
		//세션은 있는데 만료인경우
		if( isSessionRefreshExpire() ) {
			console.log("isToken_refreshToken>>만료");
			return "N";
		}else {
			return "Y";
		}
	}else {
		console.log("isToken_accessToken>>있음");
		return "Y";

	}
}

/**
 * 진행상태체크 함수 (osl추가)
 * @retruns 사용자별 진행상태코드 반환
 * 네이버 ticketId, bzn 받아서 넣어줘야함
 */
export const isState = (successCB, failCB)=> {
	callOpenApi(
		API.COMMOM.LOANPGSTINQ,
		{ticketId: "" , bzn: ""},
		(res)=> {
			successCB(res.data.RSLT_DATA);
			console.log("tokenbase isState>>", res.data.RSLT_DATA.loapPstcd);
			//return res.data.RSLT_DATA.loapPstcd;
		},
		(res)=> {
			failCB(res);
		}
	);
}

/**
 * sessionStorage의 값 체크
 * @returns sessionStorage의 값으로 token값 추출
 */
export const getSessionData = ()=> {
	var token = _STORAGE.getItem(_SESSION_KEY);
	console.log("token="+JSON.stringify(token,null,2),);
	if( token == null || token === undefined || token === "undefined" || "{}" === JSON.stringify(token) || !token ) {
		console.log("null!!!!!!!!");
		return null;
	}
	return parseJwt(token);	
}

/**
 * access token 만료 시간 체크
 * @returns 
 */
export const isSessionExpire = ()=> {	
	if( getSessionData() == null ){
		return true;
	}
	
	console.log("isSessionExpire: session time="+getSessionValue(_EXPIRE_KEY)+" cur time="+getCurTimestamp());
	
	if( getSessionValue(_EXPIRE_KEY) < getCurTimestamp() ){
		return true;
	}
	return false;
}

/**
 * refresh token 만료 시간 체크
 * @returns 
 */
export const isSessionRefreshExpire = ()=> {	
	if( getSessionData() == null ){
		return true;
	}	
	if( getSessionValue(_REFRESH_TOKEN_EXPIRE_KEY) < getCurTimestamp() ){
		return true;
	}
	return false;
}

/**
 * 현재시간
 * @returns 
 */
function getCurTimestamp(){
	return Math.floor(new Date().getTime()/1000);
}

/**
 * sessionStorage의 값으로 token값 추출
 * @param {*} token 
 * @returns 
 */
function parseJwt(token) {
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));
	return JSON.parse(jsonPayload);
}

/**
 * sessionStorage 값 저장
 * @param {} token 
 */
function saveSession(token){
	//initSession(token);
	_STORAGE.setItem(_SESSION_KEY,token);
}



function getStorageObj(data){
	var cur = getCurTimestamp();
	data[_EXPIRE_KEY] = cur+data.expiresIn-1;
	data[_REFRESH_EXPIRE_KEY]= cur+_REFRESH_TOKEN_EXPIRESIN-1;
	return data;
}

function initSession(token){	
	var data = parseJwt(token);
	//console.log("token="+JSON.stringify(data,null,2));
	return getStorageObj(data);
}

function saveStorage( input ){	
	var data = getStorageObj(input);
	_STORAGE.setItem(_STORAGE_KEY,JSON.stringify(data));
}

function updateStorage( input ){	
	var data = getStorageData();
	var newData = getStorageObj(input);
	if( data ){
		for(let key in newData ){
			data[key] = newData[key];
		}
		_STORAGE.setItem(_STORAGE_KEY,JSON.stringify(data));
	}
	else{
		_STORAGE.setItem(_STORAGE_KEY,JSON.stringify(newData));
	}
}

function getStorageData(){
	var sessionData = _STORAGE.getItem(_STORAGE_KEY);
	if( sessionData === undefined ){
		return null;
	}
	return JSON.parse(sessionData);	
}

function getStorageValue( key ){	
	var rawData = _STORAGE.getItem(_STORAGE_KEY);
	if( rawData != null ){
		var data = getStorageData();	
		return data[key];
	}
	return null;
}

function getSessionValue( key ){	
	var token = _STORAGE.getItem(_SESSION_KEY);
	if( token != null ){
		var data = getSessionData();	
		return data[key];
	}
	return null;
}

function isExpire(){	
	if( getStorageData() == null ){
		return true;
	}	
	if( getStorageValue(_EXPIRE_KEY) < getCurTimestamp() ){
		return true;
	}
	return false;
}

function isRefreshExpire(){	
	if( getStorageData() == null ){
		return true;
	}	
	if( getStorageValue(_REFRESH_EXPIRE_KEY) < getCurTimestamp() ){
		return true;
	}
	return false;
}

function clearStorage(){
	_STORAGE.clear();
}


function getTokenType(){
	return getStorageValue( _TOKEN_TYPE_KEY );
}

function getRefreshToken(){
	return isRefreshExpire() ? null : getStorageValue( _REFRESH_TOKEN_KEY );
}

function getSessionRefreshToken(){
	return isSessionRefreshExpire() ? null : getSessionValue( _REFRESH_TOKEN_KEY );
}

/*
function getOpenApi( uri, data, successCB, errorCB ){
	
	var successCallBack = successCB || AjaxSuccessHandler;
	var errorCallBack = errorCB || AjaxErrorHandler;
	var appKey = _APP_KEY;
	var sendData = data || {};
	
	//console.log("sendData=["+ sendData +"]");
	//console.log("callOpenApi: oAuth=",JSON.stringify(oAuth,null,2));
	
	$.ajax({
		type: _GET_METHOD,
		url: _OPEN_API_URL + uri,
		beforeSend: function (xhr){
			xhr.setRequestHeader( "Content-Type", "application/json"  );
			xhr.setRequestHeader( "appKey", appKey );
		},
		data: sendData,
		success: function (data){
			successCallBack(data);
		},
		error: function (jqXHR, textStatus, exception, errorThrown){
			errorCallBack(jqXHR, textStatus, exception, errorThrown);
		}
	});
}

function getOpenServer( uri, data, successCB, errorCB ){
	
	var successCallBack = successCB || AjaxSuccessHandler;
	var errorCallBack = errorCB || AjaxErrorHandler;
	var sendData = data || {};
	
	$.ajax({
		type: _GET_METHOD,
		url: uri,
		data: sendData,
		success: function (data){
			successCallBack(data);
		},
		error: function (jqXHR, textStatus, exception, errorThrown){
			errorCallBack(jqXHR, textStatus, exception, errorThrown);
		}
	});
}

function callOpenApiNonAuth( uri, data, successCB, errorCB ){
	var successCallBack = successCB || AjaxSuccessHandler;
	var errorCallBack = errorCB || AjaxErrorHandler;
	
	$.ajax({
		type: _POST_METHOD,
		url: _OPEN_API_URL + uri,		
		beforeSend: function (xhr){
			xhr.setRequestHeader( "Content-Type", "application/json"  );
			xhr.setRequestHeader( "AppKey", _APP_KEY )
		},
		data: JSON.stringify(data),
		success: function (data){
			successCallBack(data);
		},
		error: function (jqXHR, textStatus, exception, errorThrown){
			errorCallBack(jqXHR, textStatus, exception, errorThrown);
		}
	});
}

function callOpenApiSecret( uri, data, secret, successCB, errorCB ){
	var successCallBack = successCB || AjaxSuccessHandler;
	var errorCallBack = errorCB || AjaxErrorHandler;
	
	$.ajax({
		type: _POST_METHOD,
		url: _OPEN_API_URL + uri,		
		beforeSend: function (xhr){
			xhr.setRequestHeader( "Content-Type", "application/json"  );
			xhr.setRequestHeader( "appKey", _APP_KEY )
			xhr.setRequestHeader( "appSecret", secret )
		},
		data: JSON.stringify(data),
		success: function (data){
			successCallBack(data);
		},
		error: function (jqXHR, textStatus, exception, errorThrown){
			errorCallBack(jqXHR, textStatus, exception, errorThrown);
		}
	});
}
*/

function AjaxSuccessHandler(data){
	// skip...
}

function AjaxErrorHandler(jqXHR, textStatus, exception, errorThrown) {
    var msg = '';
    
    if (jqXHR.status === 0) {
        //msg = 'Not connect.\n Verify Network.';
    	msg = '인터넷 연결이 불안정합니다. 네트워크 상태를 확인하시기 바랍니다.';    	
    } else if (jqXHR.status === 404) {
        msg = 'Requested page not found. [404]';
    } else if (jqXHR.status === 500) {
        msg = 'Internal Server Error [500].';
    } else if (exception === 'parsererror') {
        msg = 'Requested JSON parse failed.';
    } else if (exception === 'timeout') {
        msg = 'Time out error.';
    } else if (exception === 'abort') {
        msg = 'Ajax request aborted.';
    } else if (jqXHR.status == 401){
				msg = '다른 기기에서 접속한 이력이 있습니다. 재시도 해주시기 바랍니다.';
		}
		else {
        msg = 'Uncaught Error.\n' + jqXHR.responseText + '\n' + exception;
    }
    //cMsgbox("error", "Invalid async client request", '<h5>' + msg + errorThrown, "", "");
    alert(msg);
		//window.location.href = PathConstants.SERVICE_ERROR;
}

export function checkLogin( callback ){
	if( isSessionExpire() ){
		callback(!isSessionRefreshExpire());
	}
	else{
		callback(true);	
	}
}

export function isValidSession(){
	if( isSessionExpire() ){
		return !isSessionRefreshExpire();
	}
	else{
		return true;	
	}
}

function getProfileImg() {
	//var p = getStorageValue( _PROFILE_IMG_KEY );
	var p = getSessionValue( _PROFILE_IMG_KEY );
	//console.log("ProfileImg="+p);
	return (p == null || p == "null" || p == "undefined") ? "" : String(p);
}

function getProfileNm() {
	//var p = getStorageValue( _PROFILE_NM_KEY );
	var p = getSessionValue( _PROFILE_NM_KEY );
	return (p == null || p == "null" || p == "undefined") ? "" : String(p);
}

function getProfileType() {
	//var p = getStorageValue( _PROFILE_TYPE_KEY );
	var p = getSessionValue( _PROFILE_TYPE_KEY );
	return (p == null || p == "null" || p == "undefined") ? "" : String(p);
}

function getProfileAthrCd() {
	//var p = getStorageValue( _PROFILE_TYPE_KEY );
	var p = getSessionValue( _PROFILE_ATHR_CD );
	return (p == null || p == "null" || p == "undefined") ? "" : String(p);
}

function getProfileBsnnNo() {
	var p = getSessionValue( _PROFILE_BSNN_NO );
	return (p == null || p == "null" || p == "undefined") ? "" : String(p);
}

/**
 * 로컬backend로 직접 호출 테스트시 사용
 * @param {} uri 
 * @param {*} param 
 * @param {*} successCB 
 * @param {*} errorCB 
 */
export const callLocalApi = async(uri,param,successCB,errorCB)=> {

	var successCallBack = successCB || AjaxSuccessHandler;
	var errorCallBack = errorCB || AjaxErrorHandler;

	let configData = {
		headers: {
			"Content-Type": "application/json",
			"appKey": "l7xxQr5uo10vlnRn1rlPNUmCRsDbOPSxJZOL",
			"Accept": "application/json",
			"lgnMnbrId": "32UfmZ5I4x"
		}
	}

	await axios.post(
		"/api2" + uri,
		JSON.stringify(param),
		configData
	).then((res)=> {
		console.log("callLocalApi success res data : ", res);
		// if(res.data.STATUS !== "200") {
		// 	window.location.href = PathConstants.SERVICE_ERROR;
		// }else {
			successCallBack(res);
		//}
		
	}).catch((jqXHR, textStatus, exception, errorThrown)=> {
		console.log(jqXHR, textStatus)
		console.log(exception, errorThrown);
		//errorCallBack(jqXHR, textStatus, exception, errorThrown);
		//window.location.href = PathConstants.SERVICE_ERROR;
		//callback(null);
	});
}