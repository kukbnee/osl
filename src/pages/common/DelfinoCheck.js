import { useLayoutEffect } from "react";
import { useEffect, useState } from "react";
import API from "../../modules/constants/API.js";
import { callOpenApi, callLocalApi } from "../../modules/common/tokenBase.js";
import ReactDelfino from "../../react-delfino";
import { useLocation, useNavigate } from "react-router";
import PathConstants from "../../modules/constants/PathConstants.js";
import { getEncode } from "../../modules/utils/util.js";
import { param } from "jquery";
import OslHeader from "../../modules/components/OslHeader.js";

/**
 * 컴포넌트명 : 브라우저 인증
 * 설명 : 브라우저 인증서 호출 및 인증값 전송
 * @param {*} props
 * props항목별 설명
 */
function DelfinoCheck(props) {

  let sidoCd = "";
  let ccwcd = "";
  let pgrsScd= "";
  let rqstDcd = "";
  let loanDcd = "";
  const { state } = useLocation();
  try {
    sidoCd = state.sidoCd;
    ccwcd = state.ccwcd;
    pgrsScd =  state.pgrsScd;
    rqstDcd = state.rqstDcd;
    loanDcd = state.loanDcd;
  }catch {
    sidoCd = "서울시";
    ccwcd = "관악구";
  }
  //스크래핑
  const certType = props.certType;
  const appCdArr = [];
  const orgCdArr = [];
  const svcCdArr = [];
  const stepDataArr = [];

  //전자서명
  /**
   * 인증전 output
   * {
   *  elcrDdcnMngmNo:"",
   *  lonDdcnItmNmList:[
   *    {
   *      lonDdcnItmDcd:"",
   *      lonDdcnHashVl:""
   *    }
   *  ]
   * }
   * delfino result
   * {
   *  signData:"",
   *  vidRandom:"",
   *  certExpireDate:"",
   *  status:1
   * }
   * 인증후 input
   * {
   *  elcrDdcnMngmNo:"",
   *  lonDdcnItmNmList:[
   *    {
   *      lonDdcnItmDcd:"",
   *      lonDdcnHashVl:"",
   *      lonDdcnElsgVl:""
   *    }
   *  ]
   * }
   */
  let lonDdcnItmNmList = [];
  let elcrDdcnMngmNo = "";

  const [delfinoLoaded, setDelfinoLoaded] = useState(false);
  const resultAction = "/jsp/signResult";
  let Delfino, DelfinoConfig;

  let multiSignDelimiter = '';
  let browserName;

  let navigate = useNavigate();

  function TEST_checkExpireWarning(certExpireDate) {
    var beforeDay = 180;
    if (certExpireDate == null) return;

    var year = certExpireDate.substring(0, 4);
    var month = certExpireDate.substring(5, 7);
    var day = certExpireDate.substring(8, 10);

    var toDay = new Date();
    var expireDate = new Date(year, month - 1, day, "23", "59", "59");
    var betweenDay = (expireDate.getTime() - toDay.getTime()) / 1000 / 60 / 60 / 24;

    //alert(year + ":" + month + ":"+ day + "\n" + parseInt(betweenDay, 10));
    if (betweenDay <= beforeDay) alert("인증서 만료일은 " + certExpireDate + " 입니다. " + parseInt(betweenDay, 10) + "일 남았습니다.");
  }

  //인증서로그인: Delfino.login()
  //TEST_complete 진행상태
  function TEST_certLogin() {
    var signOptions = { 'withMACAddressAll': true, policyOidCertFilter: "" };
    Delfino.login("login=certLogin", TEST_complete, signOptions);
  }

  function TEST_scrapingSign(data) {
    console.log("scrapingSignData>>>>>>>>>>>>", data);
    // document.delfinoForm.PKCS_TYPE.value = "scrapingSign";
    var tbsData = [];
    for (var i = 0; i < data.RSLT_DATA.step.length; i++) {
      tbsData[i] = data.RSLT_DATA.step[i].nonce;
      appCdArr[i] = data.RSLT_DATA.step[i].appCd;
      orgCdArr[i] = data.RSLT_DATA.step[i].orgCd;
      svcCdArr[i] = data.RSLT_DATA.step[i].svcCd;
      stepDataArr[i] = data.RSLT_DATA.step[i].stepData;
    }
    console.log("tbsData????????",tbsData);

    var signOptions = {};
    signOptions.cacheCert = false;
    signOptions.resetCertificate = true;
    signOptions.policyOidCertFilter = "";

    Delfino.scrapingSign(tbsData, signOptions, TEST_complete_scrp);
  }

  function TEST_complete_scrp(result) {
    console.log("scrapingResult>>>>>>>>>>>>>", result);
    // __result = result;
    if (result.status == 0) return;
    if (result.status == 1) {
      var param = { sidoCd: sidoCd, ccwcd: ccwcd, scpgSignData: [] };
      var cert = result.cert.replaceAll("\r\n", "");
      var vid = result.vidRandom;
      var signData = [];
      console.log("signData In");
      if (Array.isArray(result.signData)) {
        console.log("signData Arr In");
        for (var i = 0; i < result.signData.length; i++) {
          console.log("signData Arr In Index " + i);
          if (orgCdArr[i] === "hometax") {
            signData[i] = result.signData[i].p1;
          } else {
            signData[i] = result.signData[i].p7;
          }
          param.scpgSignData[i] = { appCd: appCdArr[i], orgCd: orgCdArr[i], svcCd: svcCdArr[i], stepData: getEncode(stepDataArr[i]), signData: getEncode(signData[i]), vid: getEncode(vid), cert: getEncode(cert), loginMethod: "", step: "", };
          console.log(">>>>>>>>>>>>>>>>>>>>>>",param.scpgSignData[i]);
          //document.getElementById("resultTxt").value = document.getElementById("resultTxt").value + "{\"orgCd\":\""+orgCdArr[i]+"\",\"svcCd\":\""+svcCdArr[i]+"\",\"stepData\":\""+stepDataArr[i]+"\",\"signData\":\""+signData[i]+"\",\"vid\":\""+result.vidRandom+"\",\"cert\":\""+result.cert+"\"}";
        }
      }

      //if(result.certExpireDate!=null) TEST_checkExpireWarning(result.certExpireDate);
      callApiComplete(param);
      if(pgrsScd === "64"){
        //대출실행일경우 대출실행완료
        navigate(PathConstants.LONEXECUTE_FINANCECUSLAW);
      }else{
      navigate(PathConstants.PREJUDGE_DOCSTATUS);
    }
    } else {
      //if (Delfino.isPasswordError(result.status)) alert("비밀번호 오류 횟수 초과됨"); //v1.1.6,0 over & DelfinoConfig.passwordError = true
      alert("error:" + result.message + "[" + result.status + "]");
    }
  }
/*
{
    "STATUS": "0000",
    "RSLT_MSG": "SUCCESS",
    "RSLT_DATA": {
        "elcrDdcnMngmNo": "20230426170018775UlU",
        "lonDdcnItmNmList": [
            {
                "lonDdcnItmDcd": "2208",
                "lonDdcnHashVl": "7f415331727421f95eadd847d6b7595265b71d886382e4ea94fd5bb87f7f4dd9"
            },
            {
                "lonDdcnItmDcd": "2209",
                "lonDdcnHashVl": "e09b8f6dfbc1981dd9974329456de5d80e37f1ea7b1f1c030f225d8045416095"
            },
            {
                "lonDdcnItmDcd": "2211",
                "lonDdcnHashVl": "a0a36492f7d8530c910139a13475a67292fa3dc589fd3f047c0265bcb7e58ef2"
            }
        ]
    }
}
*/
  //Delfino.mdSign()
  function TEST_mdSign(isMulti, lonDdcnHashVl, resData) {
    console.log("TEST_mdSign >> ", lonDdcnHashVl);
    //document.delfinoForm.PKCS_TYPE.value = "mdSign";
    
    var detachedDigest = lonDdcnHashVl; //['b0e5036fdb1f65006449b245fc46986945fc64433a3d709074f9160480f1a1b7', '22e5036fdb1f65006449b245fc46986945fc64433a3d709074f9160480f1a1b7'];
    // alert("messageDigest값이 아래와 같아야합니다.\n" + detachedDigest);

   
    // document.delfinoForm.detachedMD.value = detachedDigest.join(document.delfinoForm.SIGN_Delimeter.value);
    Delfino.mdMultiSign(detachedDigest, TEST_complete_mdSign);
    //Delfino.mdMultiSign(detachedDigest, TEST_complete, {cacheCertFilter:false, cacheCert:false});

   
  }
  
  function TEST_complete_mdSign(result) {
    if(loanDcd !== "untactAgrm"){
      console.log("loanDcd?-====",loanDcd);
    console.log("eSign TEST>>>>>>>>>>>>>", result);
    //RA인증 처리  
    // let param = {
    //     atshDsnc: "TEST_certLogin",
    //     elsgVl : result.signData,
    //     sessionNonceVl : result.nonce,
    //     vidRandomVl : result.vidRandom,
    //     signData : result.signData
    //   }
    //   console.log("RA Cert >>>>>", param)
    //  callApiRAComplete(param)
        if(!!elcrDdcnMngmNo && lonDdcnItmNmList.length > 0) {
          let param = {
            elcrDdcnMngmNo: elcrDdcnMngmNo,
            lonDdcnItmNmList : lonDdcnItmNmList
          };
          if (result.status == 1) {
            for(let idx=0; idx<lonDdcnItmNmList.length; idx++) {
              param.lonDdcnItmNmList[idx]["lonDdcnElsgVl"] = getEncode(result.signData[idx]);
            }
            console.log("result.signData", result.signData);
            console.log("result.signData", getEncode(result.signData));
            callApiComplete(param);
          }else {
            alert("error:" + result.message + "[" + result.status + "]");
          }

        }else {
          alert("인증이 정상적으로 이루어지지 않았습니다.");
        }
      }else {
        //untactAgrm 해쉬값생성
        console.log("loanDcd?-====",loanDcd)
        if(!!elcrDdcnMngmNo && lonDdcnItmNmList.length > 0) {
          let param = {
            elcrDdcnMngmNo: elcrDdcnMngmNo,
            lonDdcnItmNmList : lonDdcnItmNmList
          };
          if (result.status == 1) {
            for(let idx=0; idx<lonDdcnItmNmList.length; idx++) {
              param.lonDdcnItmNmList[idx]["lonDdcnElsgVl"] = getEncode(result.signData[idx]);
            }
            callOpenApi(
              API.LONEXECUTE.UNTACTAGRM_GRNYLNAGAGRMNTX,
              param,
              (res)=> {
                console.log(res.data);
                console.log("GRNYLNAGAGRMNTX")
                if(res.data.RSLT_DATA.rpcd === "0000"){
                  navigate(PathConstants.LONEXECUTE_APPLYINFOINPUT);
                }else if(res.data.RSLT_DATA.rpcd === "9999"){
                 console.log(res.data.RSLT_DATA.flrcon);
                }
              },
              (err1, err2)=> {
                console.log("에러>>" + err1, err2);
              }
            )
          }else {
            alert("error:" + result.message + "[" + result.status + "]");
          }

        }else {
          alert("인증이 정상적으로 이루어지지 않았습니다.");
        }
      }
    }

  function TEST_complete(result) {
    if (certType === "sign_pre") {
      navigate(PathConstants.MAIN, {
        state: {
          tabIdx: 21 //진행상태
        }
      });
    } else if (certType === "sign_exec") {
      navigate(PathConstants.LONEXECUTE_SUCCRESULT);
    } else {
      navigate(PathConstants.LONEXECUTE_APPLYINFOINPUT);
    }
  }

  var yessignCaHost_real;
  var yessignCaPort_real;
  var crosscertCaPort_real;
  var crosscertCaHost_real;
  var signkoreaCaHost_real;
  var signkoreaCaPort_real;
  var kicaCaHost_real;
  var kicaCaPort_real;
  var yessignWebCmpUrl_real;
  var finCertSdkUrl_real;
  var finCertCorpSdkUrl_real;
  var encryptedFinCertParams_real;
  function TEST_setFinCert(domain) {
    if (domain == "kbstar.com") {
      DelfinoConfig.cg.VPCGClientConfig.finCertOptions.encryptedFinCertParams = "hMnB4z4fVb2tXA4AVtfqrvvN0JMoOrKw7RCE0HPW1/wBgkV4L89ElQLuBQRH/bs+RNfa3CIHnVvuXkZ6tMzdGOIJgGgEhVwtQXdxOAnpLsDk1n24H+ur+BICeZ/h1Huw";
      DelfinoConfig.cg.VPCGClientConfig.finCertOptions.encryptedFinCertParams_test = "95aVFoTFEd4gosXHAuPmZFPayInQ4lIqp0F3dqnsCSvM2Wa6KebxuREZuOyYffHP3oL0By7VgJjXIs9iuCQNPrFnpXblvL6Q+999tNfyCWOwS2q2gn0fB1M+Y4fiC3Xd";
      encryptedFinCertParams_real = DelfinoConfig.cg.VPCGClientConfig.finCertOptions.encryptedFinCertParams;
    } else if (domain == "kfcc.co.kr") {
      DelfinoConfig.cg.VPCGClientConfig.finCertOptions.encryptedFinCertParams = "O9lAT0m7Uwa4h7ZE668E7O+RCx4IJitZUQUX0JUf+Kd0IbJwaylET2K9UqJqU5tmZVGfqCk/kpYtvKFt1wUJOgzvTXSrQFvhaMziQSazHnBjwh32C6m+ngL0atOHTfBw";
      DelfinoConfig.cg.VPCGClientConfig.finCertOptions.encryptedFinCertParams_test = "bKXlUzYmpmeLzW9h9VjDc2f4pMNK089k3Xg+9vTW00JJs1gQx//ad3OnBjda0SX6g+DBwDHmilnyW4qiE6r2og2mywbDf2iIryeM5XyMbDkAJ6UxH/whmz5W0nnwXkGF";
      encryptedFinCertParams_real = DelfinoConfig.cg.VPCGClientConfig.finCertOptions.encryptedFinCertParams;
    }
    if (global._Delfino_SystemMode == "test" || global._Delfino_SystemMode == "dev") {
      DelfinoConfig.cg.VPCGClientConfig.finCertOptions.finCertSdkUrl = DelfinoConfig.cg.VPCGClientConfig.finCertOptions.finCertSdkUrl_test;
      DelfinoConfig.cg.VPCGClientConfig.finCertOptions.finCertCorpSdkUrl = DelfinoConfig.cg.VPCGClientConfig.finCertOptions.finCertCorpSdkUrl_test;
      DelfinoConfig.cg.VPCGClientConfig.finCertOptions.encryptedFinCertParams = DelfinoConfig.cg.VPCGClientConfig.finCertOptions.encryptedFinCertParams_test;
    } else {
      DelfinoConfig.cg.VPCGClientConfig.finCertOptions.finCertSdkUrl = "https://4user.yeskey.or.kr/v1/fincert.js";
      DelfinoConfig.cg.VPCGClientConfig.finCertOptions.finCertCorpSdkUrl = "https://4user.yeskey.or.kr/v1/fincertCorp.js";
      DelfinoConfig.cg.VPCGClientConfig.finCertOptions.encryptedFinCertParams = encryptedFinCertParams_real;
    }
  }
  if (document.location.hostname.indexOf("kbstar.com") >= 0) {
    if (window.confirm("kbstar.com 도메인용 encryptedFinCertParams으로 변경하시겠습니까?")) TEST_setFinCert("kbstar.com");
  } else if (document.location.hostname.indexOf("kfcc.co.kr") >= 0) {
    if (window.confirm("kfcc.co.kr 도메인용 encryptedFinCertParams으로 변경하시겠습니까?")) TEST_setFinCert("kfcc.co.kr");
  }

  function TEST_selectCA(caType, caName) {
    if (caType == "real") {
      DelfinoConfig.yessignCaHost = yessignCaHost_real;
      DelfinoConfig.yessignCaPort = yessignCaPort_real;
      DelfinoConfig.crosscertCaPort = crosscertCaPort_real;
      DelfinoConfig.crosscertCaHost = crosscertCaHost_real;
      DelfinoConfig.signkoreaCaHost = signkoreaCaHost_real;
      DelfinoConfig.signkoreaCaPort = signkoreaCaPort_real;
      DelfinoConfig.kicaCaHost = kicaCaHost_real;
      DelfinoConfig.kicaCaPort = kicaCaPort_real;
      DelfinoConfig.yessignWebCmpUrl = yessignWebCmpUrl_real;
      DelfinoConfig.cg.VPCGClientConfig.finCertOptions.finCertSdkUrl = finCertSdkUrl_real;
      DelfinoConfig.cg.VPCGClientConfig.finCertOptions.finCertCorpSdkUrl = finCertCorpSdkUrl_real;
      DelfinoConfig.cg.VPCGClientConfig.finCertOptions.encryptedFinCertParams = encryptedFinCertParams_real;
    } else {
      DelfinoConfig.yessignCaHost = DelfinoConfig.yessignCaHost_test;
      DelfinoConfig.yessignCaPort = DelfinoConfig.yessignCaPort_test;
      DelfinoConfig.crosscertCaPort = DelfinoConfig.crosscertCaPort_test;
      DelfinoConfig.crosscertCaHost = DelfinoConfig.crosscertCaHost_test;
      DelfinoConfig.signkoreaCaHost = DelfinoConfig.signkoreaCaHost_test;
      DelfinoConfig.signkoreaCaPort = DelfinoConfig.signkoreaCaPort_test;
      DelfinoConfig.kicaCaHost = DelfinoConfig.kicaCaHost_test;
      DelfinoConfig.kicaCaPort = DelfinoConfig.kicaCaPort_test;
      DelfinoConfig.yessignWebCmpUrl = DelfinoConfig.yessignWebCmpUrl_test;
      DelfinoConfig.cg.VPCGClientConfig.finCertOptions.finCertSdkUrl = DelfinoConfig.cg.VPCGClientConfig.finCertOptions.finCertSdkUrl_test;
      DelfinoConfig.cg.VPCGClientConfig.finCertOptions.finCertCorpSdkUrl = DelfinoConfig.cg.VPCGClientConfig.finCertOptions.finCertCorpSdkUrl_test;
      DelfinoConfig.cg.VPCGClientConfig.finCertOptions.encryptedFinCertParams = DelfinoConfig.cg.VPCGClientConfig.finCertOptions.encryptedFinCertParams_test;
    }
    if (caName == "yessign") {
      alert("[" + caType + "," + caName + "][" + DelfinoConfig.yessignCaHost + ":" + DelfinoConfig.yessignCaPort + "]");
    } else if (caName == "crosscert") {
      alert("[" + caType + "," + caName + "][" + DelfinoConfig.crosscertCaHost + ":" + DelfinoConfig.crosscertCaPort + "]");
    } else if (caName == "signkorea") {
      alert("[" + caType + "," + caName + "][" + DelfinoConfig.signkoreaCaHost + ":" + DelfinoConfig.signkoreaCaPort + "]");
    } else if (caName == "kica") {
      alert("[" + caType + "," + caName + "][" + DelfinoConfig.kicaCaHost + ":" + DelfinoConfig.kicaCaPort + "]");
    } else if (caName == "yessignWebCmp") {
      alert("[" + caType + "," + caName + "][" + DelfinoConfig.yessignWebCmpUrl + "]");
    } else if (caName == "fincert") {
      alert("[" + caType + "," + caName + "][" + DelfinoConfig.cg.VPCGClientConfig.finCertOptions.finCertSdkUrl + "]");
    } else if (caName == "fincertcorp") {
      alert("[" + caType + "," + caName + "][" + DelfinoConfig.cg.VPCGClientConfig.finCertOptions.finCertCorpSdkUrl + "]");
    }
  }
  function TEST_certComplete(code, msg) {
    if (code != 1) {
      if (code == 0) {
        alert("사용자가 취소하였습니다.");
        return;
      } else {
        //발급/갱신 에러
        alert("발급오류:" + code + ":" + msg);
      }
      return;
    }
    alert("인증서 발급에 성공하였습니다.");
  }
  function TEST_certComplete2(result) {
    TEST_certComplete(result.status, result.message);
  }

  function TEST_requestCertificate() {
    var caType = document.certForm.caType.value;
    var caName = document.certForm.caName.value;
    var referenceValue = document.certForm.referenceValue.value;
    var secretValue = document.certForm.secretValue.value;
    TEST_selectCA(caType, caName);

    if (caName == "fincert" || caName == "fincertcorp") {
      if (!(Delfino.getModule() == "G4" || Delfino.getModule() == "G10")) {
        if (!window.confirm("금융인증서 발급기능은 G4/G10만 지원합니다. G10으로 변경하시겠습니까?")) return;
        Delfino.setModule("G10");
      }
    }

    if (caName == "kica") {
      Delfino.requestCertificate2(caName, referenceValue, secretValue, TEST_certComplete2, { enableKmCert: true }); //정보인증 발급
      //Delfino.requestCertificate2(caName, referenceValue, secretValue, TEST_certComplete, {recovery:true, enableKmCert:true}); //정보인증 재발급
    } else if (caName == "yessignWebCmp") {
      Delfino.requestCertificate2(caName, referenceValue, secretValue, TEST_certComplete2, { browserCertificate: true }); //브라우저인증서 발급
    } else if (caName == "fincert") {
      Delfino.requestCertificate2("fincert", referenceValue, secretValue, TEST_certComplete2, { simpleKeyReq: true, showComplete: true }); //개인금융인증서 발급
    } else if (caName == "fincertcorp") {
      var bizNoValue = document.certForm.bizNoValue.value;
      Delfino.requestCertificate2("fincert", referenceValue, secretValue, TEST_certComplete2, { finCertMode: 'fincertcorp', simpleKeyReq: true, showComplete: true, bizNo: bizNoValue }); //기업금융인증서 발급
    } else {
      Delfino.requestCertificate(caName, referenceValue, secretValue, TEST_certComplete);
    }
  }

  function TEST_updateCertificate() {
    var caType = document.certForm.caType.value;
    var caName = document.certForm.caName.value;
    TEST_selectCA(caType, caName);

    if (caName == "fincert") {
      alert("금융(개인)인증서 갱신기능은 제공하지 않습니다.");
      return;
    }
    if (caName == "fincert" || caName == "fincertcorp") {
      if (!(Delfino.getModule() == "G4" || Delfino.getModule() == "G10")) {
        if (!window.confirm("금융인증서 갱신기능은 G4/G10만 지원합니다. G10으로 변경하시겠습니까?")) return;
        Delfino.setModule("G10");
      }
    }

    //Delfino.resetCertificate(); //인증서캐쉬 초기화
    //Delfino.setIssuerCertFilter(''); //인증서 필터링

    if (caName == "kica") {
      Delfino.updateCertificate2(caName, TEST_certComplete2, { resetCertificate: true, cacheCert: false, enableKmCert: true }); //정보인증 갱신
    } else if (caName == "yessignWebCmp") {
      Delfino.updateCertificate2(caName, TEST_certComplete2, { cacheCert: false, policyOidCertFilter: "1.2.410.200005.1.1.1-B|1.2.410.200005.1.1.5-B" }); //브라우저인증서 갱신
    } else if (caName == "fincertcorp") {
      var bizNoValue = document.certForm.bizNoValue.value;
      var certSeqNumValue = document.certForm.certSeqNumValue.value;
      Delfino.updateCertificate2('fincert', TEST_certComplete2, { finCertMode: 'fincertcorp', resetCertificate: true, cacheCert: false, certSeqNum: certSeqNumValue, bizNo: bizNoValue });
    } else {
      //Delfino.updateCertificate(caName, TEST_certComplete);
      Delfino.updateCertificate2(caName, TEST_certComplete2, { cacheCert: false, policyOidCertFilter: "" }); //인증서캐쉬정보 사용하기
    }
  }

  function TEST_importCheck() {
    document.relayForm.cmd.value = "deviceAuth";
    document.relayForm.index.value = "168";
    document.relayForm.pubKey.value = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4A577nBWpsnjQ0hbURGA2Ol1O+w5mE+Bi+bBuoVLtxuUW1P5RG5skKvh6gFnG/1A2PBwNaNNBB5U8Dh8mBjpxQQovNx6qzSAGNz9Tbwu7+kfRZLR8MMol6So55otgMZ9+9viIaRSmTrkdAHaex/EJMIvcaWutpFKFpPb6y+78s9oEkESR61fqcH4xC54vnZDNIW0warcI1lJElS0HdmG26ta5JnCIq92/gyGyCCGYhn7B4fYHdDcFg+ahH5jXfAWFDQWe4W25nIK8Tg6qRFRg+zdqak4dAffwXr7Q/dSNpuy5+QoqnjB5j6GyoiMPDs4S9lwc0tDCNqPEBu2BpgNvQIDAQAB";
    document.relayForm.clientAuth.value = "m3k6rN9VL8HHVoLpEKQMiMXNcmRJ/XQyrmMG79UCtDxccsFSVWmMr4aDoRBGzO5N";
    document.relayForm.serverAuth.value = "Dlblmscimifdm4vesG50rg==";
    document.relayForm.sessionKey.value = "SzfO+wkYBd2PjA2kSxa5Bgo3ZS7wjkgvdkoa248//WiTPLujzCEqNSFHmGIqFoxecPKUUyN8p2huPg5GaNB22cNISGnxm5XWYdA4vkCDlU5Ye0X7krWxA3dSITCN8Fc5wIHMZ8/BtF/1Yru0GedxDj/i5hbCuW2PTSmtVci93j0N3NZqkCv+IOGiWetbPk6YdiW7RDv7pmwXNUvce/D4cRFlbya5F5w1FKppGhrTTSEN/6BHLQ1pTrdCaB38PxfE3+QYCw8nA6Rd4t14CiujErN9qNkN5gLHacRplTyIBiQHYGmbjJZi43W+A7fok3f+s8ifa7NIEdHZasDcw0cW5Q==";
    document.relayForm.signedData.value = "fgR4wXbTRLMiUf2o44WMtlW1V/RnAq4bfLWwwOf4hNf/Cj5uPJK4w6YJW4NoKFDZ9FxY6EV9cuuCNsW00S6Zd89ZUSATsnFstJukVBGaMHNr/eSjVVt6xtV9vN9ORP/7rXxDAUwwHQoZ0L55VWlUBL3GliDZUzHBX189TX0el+KOvmPoCF6HUTuGfZVEhqfSStEPlfKaeEIIKzdfb743ATLXCEhSMaB3ogPEq5PkUesJQTfzJC8vzpke9yW55pp2g4ihhWw1CljwLeJArdmUz/Z2Vm67h4s3txBmZPlMQbb5q12DCxmi7DwMB7dgNVeMl1vMDtc++YroHkNHHP/Ehw==";
    document.relayForm.method = "post";
    document.relayForm.target = "testResult";
    document.relayForm.action = DelfinoConfig.certRelay.providerUrl;
    document.relayForm.submit();
  }
  function TEST_relayCheck() {
    document.relayForm.cmd.value = "check";
    document.relayForm.index.value = "";
    document.relayForm.pubKey.value = "";
    document.relayForm.clientAuth.value = "";
    document.relayForm.serverAuth.value = "";
    document.relayForm.sessionKey.value = "";
    document.relayForm.signedData.value = "";
    document.relayForm.method = "get";
    document.relayForm.target = "testResult";
    document.relayForm.action = DelfinoConfig.certRelay.providerUrl;
    document.relayForm.submit();
  }

  function TEST_importCertificate() {
    Delfino.importCertificate(TEST_completeImport);
  }
  function TEST_exportCertificate() {
    Delfino.exportCertificate(TEST_completeExport);
    //Delfino.exportCertificate({disableExpireFilter:true}, TEST_completeExport); //만료된 인증서 보이기
  }
  function TEST_completeImport(result) {
    if (result.status == 0) {
      alert("가져오기 취소"); //사용자취소
    } else if (result.status == 1) {
      alert("가져오기 성공");
    } else {
      alert(result.message + "[" + result.status + "]");
    }
  }
  function TEST_completeExport(result) {
    if (result.status == 0) {
      alert("내보내기 취소"); //사용자취소
    } else if (result.status == 1) {
      alert("내보내기 성공");
    } else {
      alert(result.message + "[" + result.status + "]");
    }
  }
  function TEST_manageCertificate() {
    Delfino.manageCertificate();
  }
  // "[<b>"+global.DC_platformInfo.type+","+global.DC_platformInfo.name+","+global.DC_platformInfo.Mobile+"</b>][<b>"+global.DC_browserInfo.name+","+global.DC_browserInfo.version+"</b>]["+global.navigator.appName+"]"


  useEffect(() => {
    // 마운트 되었을 때,
    console.log(ReactDelfino.Delfino, ReactDelfino.DelfinoConfig);
    if (!delfinoLoaded) {
      ReactDelfino.init().then(() => {
        console.log(ReactDelfino.Delfino, ReactDelfino.DelfinoConfig);
        Delfino = ReactDelfino.Delfino;
        DelfinoConfig = ReactDelfino.DelfinoConfig;
        setDelfinoLoaded(true);

        yessignCaHost_real = DelfinoConfig.yessignCaHost;
        yessignCaPort_real = DelfinoConfig.yessignCaPort;
        crosscertCaPort_real = DelfinoConfig.crosscertCaPort;
        crosscertCaHost_real = DelfinoConfig.crosscertCaHost;
        signkoreaCaHost_real = DelfinoConfig.signkoreaCaHost;
        signkoreaCaPort_real = DelfinoConfig.signkoreaCaPort;
        kicaCaHost_real = DelfinoConfig.kicaCaHost;
        kicaCaPort_real = DelfinoConfig.kicaCaPort;
        yessignWebCmpUrl_real = DelfinoConfig.yessignWebCmpUrl;
        finCertSdkUrl_real = DelfinoConfig.cg.VPCGClientConfig.finCertOptions.finCertSdkUrl;
        finCertCorpSdkUrl_real = DelfinoConfig.cg.VPCGClientConfig.finCertOptions.finCertCorpSdkUrl;
        encryptedFinCertParams_real = DelfinoConfig.cg.VPCGClientConfig.finCertOptions.encryptedFinCertParams;

        if (typeof (DelfinoConfig.cg) == "object") DelfinoConfig.cg.VPCGClientConfig.defaultProvider = "delfino";


        // 모듈캐쉬기능 사용시 샘플/START
        // Delfino.resetRecentModule();
        Delfino.setModule();
        //if (!DC_platformInfo.Mobile) { Delfino.resetRecentModule(); Delfino.setModule(); }
        console.log('init done end');
        callApiFn();
        // 임시로 스텝1제외 시키고 테스트
        if (certType === "scrp") {
          // const imsi = `{
          //   "sidoCd": "${sidoCd}",
          //   "ccwcd": "${ccwcd}",
          //   "scpgSignData": [
          //       {
          //           "appCd": "ibk_test",
          //           "orgCd": "hometax",
          //           "svcCd": "B0001",
          //           "loginMethod": "",
          //           "step": "",
          //           "stepData": "",
          //           "signData": "",
          //           "cert": "",
          //           "vid": ""
          //       },
          //       {
          //           "appCd": "ibk_test",
          //           "orgCd": "hometax",
          //           "svcCd": "B4009",
          //           "loginMethod": "",
          //           "step": "",
          //           "stepData": "",
          //           "signData": "",
          //           "cert": "",
          //           "vid": ""
          //       },
          //       {
          //           "appCd": "",
          //           "orgCd": "",
          //           "svcCd": "",
          //           "loginMethod": "",
          //           "step": "",
          //           "stepData": "",
          //           "signData": "",
          //           "cert": "",
          //           "vid": ""
          //       },
          //       {
          //           "appCd": "ibk_test",
          //           "orgCd": "hometax",
          //           "svcCd": "B1002",
          //           "loginMethod": "",
          //           "step": "",
          //           "stepData": "",
          //           "signData": "",
          //           "cert": "",
          //           "vid": ""
          //       },
          //       {
          //           "appCd": "ibk_test",
          //           "orgCd": "hometax",
          //           "svcCd": "Z5001",
          //           "loginMethod": "",
          //           "step": "",
          //           "stepData": "",
          //           "signData": "",
          //           "cert": "",
          //           "vid": ""
          //       },
          //       {
          //           "appCd": "ibk_test",
          //           "orgCd": "hometax",
          //           "svcCd": "Z0005",
          //           "loginMethod": "",
          //           "step": "",
          //           "stepData": "",
          //           "signData": "",
          //           "cert": "",
          //           "vid": ""
          //       },
          //       {
          //           "appCd": "ibk_test",
          //           "orgCd": "hometax",
          //           "svcCd": "B1003",
          //           "loginMethod": "",
          //           "step": "",
          //           "stepData": "",
          //           "signData": "",
          //           "cert": "",
          //           "vid": ""
          //       },
          //       {
          //           "appCd": "ibk_test",
          //           "orgCd": "hometax",
          //           "svcCd": "B0006",
          //           "loginMethod": "",
          //           "step": "",
          //           "stepData": "",
          //           "signData": "",
          //           "cert": "",
          //           "vid": ""
          //       },
          //       {
          //           "appCd": "ibk_test",
          //           "orgCd": "gov",
          //           "svcCd": "B1003",
          //           "loginMethod": "",
          //           "step": "",
          //           "stepData": "",
          //           "signData": "",
          //           "cert": "",
          //           "vid": ""
          //       },
          //       {
          //           "appCd": "ibk_test",
          //           "orgCd": "gov",
          //           "svcCd": "C0002",
          //           "loginMethod": "",
          //           "step": "",
          //           "stepData": "",
          //           "signData": "",
          //           "cert": "",
          //           "vid": ""
          //       },
          //       {
          //           "appCd": "ibk_test",
          //           "orgCd": "gov",
          //           "svcCd": "C0003",
          //           "loginMethod": "",
          //           "step": "",
          //           "stepData": "",
          //           "signData": "",
          //           "cert": "",
          //           "vid": ""
          //       },
          //       {
          //           "appCd": "ibk_test",
          //           "orgCd": "nhic",
          //           "svcCd": "E3010",
          //           "loginMethod": "",
          //           "step": "",
          //           "stepData": "",
          //           "signData": "",
          //           "cert": "",
          //           "vid": ""
          //       }
          //   ]
          // }`;
          // callApiComplete(JSON.parse(imsi));
        }else if(certType === "sign") {
          callApiFn();
        }else {
          TEST_certLogin();
        }
      });
    } else {
      Delfino = ReactDelfino.Delfino;
      DelfinoConfig = ReactDelfino.DelfinoConfig;
    }
    return () => {
      // unmount 된 후.
    };
  }, [delfinoLoaded]);

  /**
   * 서명값 인증을 위한 Step1 Data 호출
   */
  const callApiFn = () => {
    if (certType === "scrp") {
      //대출실행 스크래핑
      if(pgrsScd === "64"){
        callOpenApi(
          API.COMMOM.PRE_SCPG,
          {"scpgDcd" : "ex"},
          (res)=>{
            if (res.data.STATUS === "0000") {
              console.log("step1Data>>", res.data);
              TEST_scrapingSign(res.data);
            }
          },
          (err)=> {
            
          }
        )
      }else if(rqstDcd === null || rqstDcd === undefined || rqstDcd === 'null' || rqstDcd === 'undefined'){
        callOpenApi(
          API.COMMOM.PRE_SCPG,
          {"scpgDcd": "al"},
          (res) => {
            if (res.data.STATUS === "0000") {
              console.log("step1Data>>", res.data);
              TEST_scrapingSign(res.data);
            }
          },
          (err)=> {
            
          }
        )
      }
      else{  
        console.log("rqstDcd------",rqstDcd);
        const scpgDcd = rqstDcd.toString();
        callOpenApi(
          API.COMMOM.PRE_SCPG,
          scpgDcd,
          (res)=>{
            console.log("step1Data>>", res.data);
              TEST_scrapingSign(res.data);
          },
          (err)=>{

          }
        )};
    }else if(certType === "sign" && loanDcd !== "untactAgrm") {
      callOpenApi(
        API.COMMOM.PRESCRGSN,
        {},
        (res)=> {
          console.log(API.COMMOM.PRESCRGSN+">>"+res);
          lonDdcnItmNmList = res.data.RSLT_DATA.lonDdcnItmNmList;
          elcrDdcnMngmNo = res.data.RSLT_DATA.elcrDdcnMngmNo;
          
          let detachedDigest = [];
          for(let idx=0; idx<lonDdcnItmNmList.length; idx++) {
            detachedDigest.push(lonDdcnItmNmList[idx].lonDdcnHashVl);
          }
          TEST_mdSign(true, detachedDigest, res.data.RSLT_DATA);
        },
        (err)=> {

        }
      )
    }else {
      callOpenApi(
        API.LONEXECUTE.UNTACTAGRM_GRNYLNAGRGSN,
        {},
        (res)=> {
          console.log(res);
          lonDdcnItmNmList = res.data.RSLT_DATA.lonDdcnHashVlList;
          elcrDdcnMngmNo = res.data.RSLT_DATA.elcrDdcnMngmNo;
          
          let detachedDigest = [];
          for(let idx=0; idx<lonDdcnItmNmList.length; idx++) {
            detachedDigest.push(lonDdcnItmNmList[idx].lonDdcnHashVl);
          }
          TEST_mdSign(true, detachedDigest, res.data.RSLT_DATA);
        },
        (err)=> {

        }
      )
    }
  }
  /*
  callOpenApi(
    API.PREJUDGE.PRE_SCPG,
    (res)=> {
      if(res.data.RSLT_DATA.resultYn === "Y") {
        TEST_scrapingSign();
      }
     
    },
    ()=> {

    }
  );*/

  //RA 인증
  // const callApiRAComplete = () => {
  //   console.log(JSON.stringify(param));
  //   //전자서명시에만 RA인증
  //   if (certType === "sign"){
  //     callOpenApi(
  //       API.COMMOM.RACERT,
  //       param,
  //       (res) => {
  //         console.log("res => ", res.data);
  //         if(res.data.STATUS === "0000"){
  //           //전자서명후 RA인증완료
  //           console.log("RA인증 성공")
  //         }
  //       },
  //       (err1, err2)=>{
  //         console.log("에러>>" + err1, err2);
  //       }
  //     )
  //   }
  // }

  const callApiComplete = (param) => {

    console.log(JSON.stringify(param));
    if (certType === "scrp") {
      callOpenApi(
        API.COMMOM.SCPG,
        param,
        (res) => {
          console.log("scpg res>>", res.data);
          if(res.data.STATUS === "0000"){
            //[todo]진행상태에 따른 라우팅 
            //사전심사일 경우 행정구역

          }
          
        },
        (err1, err2)=> {
          console.log("에러>>" + err1, err2);
        }
      );
    }else if(certType === "sign") {
      console.log("@@@@@@@@@@@@@@@@@",param);
      callOpenApi(
        API.COMMOM.GNAP,
        param,
        (res)=> {
          console.log(API.COMMOM.GNAP + ">>" + JSON.stringify(res.data));
          console.log("gnap successsssssssss_________")
          if(res.data.RSLT_DATA.resultYn === "Y"){
            navigate(PathConstants.MAIN);
          }
          
          //[todo]진행상태에 따른 라우팅 
          //사전심사일 경우 진행상태 > 사전심사접수
          //대출실행일 경우 대출실행완료
          
        },
        (err1, err2)=> {
          console.log("에러>>" + err1, err2);
        }
      )
    }
  };

  return (
    <>
    {(!!props.headerNm) && <OslHeader headerNm={props.headerNm} />}
      <div className="container">
        <div className="content">
          <div className="content-body">
            <div className="content-top">
              {certType === "scrp" &&
                <div className="content-top pad-b40">
                  <p className="top-tit">
                    <strong>스크래핑을</strong> 위한 <strong>브라우저 인증 모듈</strong> 로딩중입니다.<br />
                    잠시만 기다려 주세요.
                  </p>
                </div>
              }
              {certType === "sign" &&
                <div className="content-top pad-b40">
                  <p className="top-tit"><strong>전자서명</strong> 위한<strong>브라우저 인증 모듈</strong>로딩중입니다.<br />
                    잠시만 기다려 주세요.
                  </p>
                </div>}
            </div>
            <div className="loading" style={{ backgroundColor: "transparent", height: 800 }}>
              </div>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <br/>
              <div className="content-top pad-b40">
              <span className="step-txt fc-gray" style={{ fontSize:20, marginLeft: 90}}>잠시만 기다려 주세요.
                    </span>
                    <br/>
                    <br/>
                    <span className="step-txt fc-gray" style={{ fontSize:20, marginLeft: 40}}> 최대 5분 정도 소요 될 수 있습니다.</span>
                  
                </div>
          </div>
        </div>

      </div>

    </>
  );
}

export default DelfinoCheck;