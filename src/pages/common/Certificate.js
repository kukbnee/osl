import OslHeader from "../../modules/components/OslHeader";
import OslBtn from "../../modules/components/OslBtn";
import { useNavigate } from "react-router";
import PathConstants from "../../modules/constants/PathConstants";
import request from "../../modules/utils/Axios";
import API from "../../modules/constants/API.js";

function Certificate(props) {

  let navigate = useNavigate();
  function cbOslBtn(){
    navigate(
      PathConstants.PREJUDGE_GRTINFOINPUT
      );
  }

  // const Certificate = async () => {
  //   const res = await request({
  //     method: "post",
  //     url: API.PREJUDGE_CERTIFICATE,
  //     data: {}
  //   }) 
  //   .then((response) => {
  //     console.log(response)
  //     return response;
  //   })
  
  //   .catch((error) => {
  //     console.log("error : ", error);
  //   });
  // }

  return (
    <>
      <OslHeader headerNm={props.headerNm}/>
      <div className ="container">
        <div className ="content">
          <div className ="content-body">
            <div className ="content-top pad-b30">
              <div className ="txt-wrap">
                <p className ="txt l-txt">
                  <b>잠깐!</b><br />
                  <b>공동인증서</b>를 <b>등록</b>해 주세요.
                </p>

                <p className ="txt">아래 기관에 공동인증서가 등록되어 있는지 확인해 주세요.</p>
                <p className ="txt xs-txt red-16c"><em className ="beware">공동인증서 미등록시 대출한도 조회가 불가합니다.</em></p>
              </div>
            </div>

            <div className ="section pad-t0">
              <ul className ="sele-list type01">
                <li className ="item">
                  <input type="radio" name="radio01" id="radio01_01" />
                  <label htmlFor ="radio01_01" className ="item-cont">
                    <img src="../assets/img/common/logo_hometax.png" alt="인터넷 납세서비스 Home tax" />
                  </label>
                </li>
                <li className ="item">
                  <input type="radio" name="radio01" id="radio01_02" />
                  <label htmlFor ="radio01_02" className ="item-cont">
                    <img src="../assets/img/common/logo_24.png" alt="정부24" />
                  </label>
                </li>
              </ul>
            </div>
          </div>
          <OslBtn
              obj={{
                type: "button",
                disabled: false,
                text: ["계속 진행"],
                link: "",
                callbackId: cbOslBtn
              }} />
        </div>
      </div>
    </>
  )
}
export default Certificate;