import PathConstants from "../constants/PathConstants.js";
import { getClientOs, deleteCookie, loginDomain } from "./boxlogin.js";
export default "";
// SPA로그인 시작
export const oslLogin = ()=> {
  
  if(getClientOs() == "PC") {
    alert("pc는 지원하지 않습니다.");
    window.location.href = PathConstants.GUIDE_DETAIL;
    // document.querySelector("#ifrmPage").setAttribute("src", loginDomain()+"/COM001/login.do?callType=spa");
    // let element = 
    // `<div class="pcLoginWrap on" id="pcLoginWrap">
    //   <div class="bg"></div>
    //   <div class="pclayerPopCont">
    //     <iframe src="`+loginDomain()+"/COM001/login.do?callType=spa"+`" width="100%" height="100%" scrolling="auto" frameBorder="0" id="ifrmPage">이 브라우저는 iframe을
    //       지원하지 않습니다.
    //     </iframe>
    //   </div>
    // </div>`;
    // document.querySelector("body").insertAdjacentHTML("afterbegin", element);
  }else {
     window.location.href = loginDomain()+"/COM001/login.do?callType=spa";
  }
}

export const oslLogout = ()=> {
  // 쿠키정리
  deleteCookie("idSave");
  deleteCookie("auth");
  deleteCookie("cookieExpires");
  sessionStorage.clear();

  // window.location.href = loginDomain() + "/magicsso/SPLogout.jsp?nextPage=" + window.location.origin+"/";

  //다시해야댐
  window.location.href = "/refresh";

}
