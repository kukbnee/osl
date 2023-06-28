export default "";
/*  공통 로그인 추가  START*/
	export const loginDomain = ()=> {
		var domain = "";
		var box = "www.ibkbox.net";
		if(window.location.href.indexOf("//local") > -1){
			domain = "http://local"+box+":8081";
		}else if(window.location.href.indexOf("//dev") > -1){
			domain = "https://dev"+box;
		}else{
			domain = "https://"+box;
		}
		return domain;
	}
	export const getCookie = (cookieName)=> {
		var x,y;
		var val = document.cookie.split(';');
		
		for(var i = 0; i < val.length; i++){
			x = val[i].substr(0, val[i].indexOf('='));
			y = val[i].substr(val[i].indexOf('=')+1);
			x = x.replace(/^\s+|\s+$/g, '');
			
			if(x == cookieName){
				return unescape(y);
			}
		}
		
	}
	export const deleteCookie = (cookieName)=> {
		var expireDate = new Date();
		expireDate.setDate(expireDate.getDate() -1);
//		expireDate.setMinutes(expireDate.getMinutes() -1);
		document.cookie = cookieName + "= ;path=/; domain=ibkbox.net; expires=" + expireDate.toString(); // expireDate.toGMTString()
		
	}
	export const getClientOs = ()=> {
		var userAgent = navigator.userAgent.toLowerCase();
		var os = "";
		if(userAgent.indexOf("android") > -1 || userAgent.indexOf("iphone") > -1 || userAgent.indexOf("iapd") > -1 || userAgent.indexOf("mobile") > -1){
			os = "MOBILE";
		}else{
			os = "PC";
		}
		return os
	}
	
	// // 자동 로그인 호출
	// var dateTime = new Date();
	// var cookieTime = getCookie("cookieExpires")==undefined?"0":getCookie("cookieExpires");
	
	// // 만료쿠키 삭제
	// if(dateTime.getTime() >  parseInt(cookieTime)){
	// 	deleteCookie("idSave");
	// 	//deleteCookie("auth");
	// 	deleteCookie("cookieExpires");
	// }
	
	// window.addEventListener("message", receiveLoginMsg);
	
	// export const receiveLoginMsg = (e)=> {
		
	// 	if(typeof e.data == "object"){
	// 		var obj = e.data;
			
	// 		if(obj.tokenInfo != undefined){
	// 			// 초기화
	// 			sessionStorage.clear();
	// 			sessionStorage.setItem("SI", obj.tokenInfo);
	// 			location.href = "/ui/spa/index.html";
	// 		}
			
	// 	}else if(typeof e.data == "string"){
	// 		// iframe 스크롤보이기
	// 		if("scroll_auto" == e.data){
	// 			$("#ifrmPage").attr("scrolling", "auto");
	// 		// iframe 스크롤보이기
	// 		}else if("scroll_no" == e.data){
	// 			$("#ifrmPage").attr("scrolling", "no");
	// 		// ESG자가진단 화면 호출
	// 		}else if("redirectBiz" == e.data){
	// 			location.href = "/consult/selectBiz";
	// 			// 로그인 화면 닫기
	// 		}else if("btn_close" == e.data){
	// 			$(".pcLoginWrap").removeClass("on");
	// 		}
	// 	}
	// }

	// // 사업장 추가
	// export const companyReg = ()=> {
	// 	if(getClientOs() == "PC"){
	// 		$(".pcLoginWrap").addClass("on");
	// 		$("#ifrmPage").attr("src", loginDomain()+"/COM002/selectCompany.do?redirect=biz");
	// 	}else{
	// 		location.href = loginDomain()+"/COM002/selectCompany.do?redirect=biz";
	// 	}
	// }