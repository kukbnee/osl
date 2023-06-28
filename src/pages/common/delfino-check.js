import { useState, useEffect } from "react";
import ReactDelfino from "../../react-delfino";

import "./delfino-check.css";


const CheckView = (props)=> {
    const [delfinoLoaded, setDelfinoLoaded] = useState(false);
    const resultAction = "/jsp/signResult";
    let Delfino, DelfinoConfig;

    let multiSignDelimiter = '';
    let browserName;

    function TEST_checkExpireWarning(certExpireDate) {
        var beforeDay = 180;
        if (certExpireDate == null) return;

        var year = certExpireDate.substring(0,4);
        var month = certExpireDate.substring(5,7);
        var day = certExpireDate.substring(8,10);

        var toDay = new Date();
        var expireDate = new Date(year, month-1, day, "23", "59", "59");
        var betweenDay = (expireDate.getTime()-toDay.getTime())/1000/60/60/24;

        //alert(year + ":" + month + ":"+ day + "\n" + parseInt(betweenDay, 10));
        if (betweenDay <= beforeDay) alert("인증서 만료일은 " +  certExpireDate + " 입니다. " + parseInt(betweenDay, 10) + "일 남았습니다.");
    }

    //전자서명시 호출되는  CallBack 함수
    // var __result;
    function TEST_complete(result){
        // __result = result;
        if(result.status==0) return;
        if(result.status==1){
            document.delfinoForm.PKCS7.value = result.signData;
            if (document.delfinoForm.PKCS_TYPE.value == "mdSign" && Array.isArray(result.signData)) document.delfinoForm.PKCS7.value = result.signData.join(document.delfinoForm.SIGN_Delimeter.value);
            document.delfinoForm.VID_RANDOM.value = result.vidRandom;

            document.delfinoForm.MACAddress.value = "_";
            document.delfinoForm.tokenSerialNumber.value = "_";
            document.delfinoForm.CONFIRM_PKCS7.value = "";

            //TODO: scrapingSign 결과값
            document.delfinoForm.signingCert.value = "";
            document.delfinoForm.signingTime.value = "";
            document.delfinoForm.withoutSignedPkcs7.value = "";
            document.delfinoForm.withoutSignedPkcs1.value = "";
            if(result.cert!=null) document.delfinoForm.signingCert.value = result.cert;
            if (document.delfinoForm.PKCS_TYPE.value == "scrapingSign") {
                if (Array.isArray(result.signData)) {
                    var pkcs7 = "";
                    var withoutSignedPkcs7 = "";
                    var withoutSignedPkcs1 = "";
                    var signingTime = "";
                    for (var i=0; i<result.signData.length; i++) {
                        pkcs7 += result.signData[i].p7 + document.delfinoForm.SIGN_Delimeter.value;
                        withoutSignedPkcs7 += result.signData[i].p7WithoutSignedAttribute + document.delfinoForm.SIGN_Delimeter.value;
                        withoutSignedPkcs1 += result.signData[i].p1 + document.delfinoForm.SIGN_Delimeter.value;
                        signingTime += result.signData[i].signingTime + document.delfinoForm.SIGN_Delimeter.value;
                    }
                    document.delfinoForm.signData1.value = result.signData[0].p1;
                    document.delfinoForm.signData2.value = result.signData[1].p1;
                    document.delfinoForm.certTxt1.value = result.cert;
                    document.delfinoForm.PKCS7.value = pkcs7;
                    document.delfinoForm.withoutSignedPkcs7.value = withoutSignedPkcs7;
                    document.delfinoForm.withoutSignedPkcs1.value = withoutSignedPkcs1;
                    document.delfinoForm.signingTime.value = signingTime;
                } else {
                    //document.delfinoForm.PKCS7.value = result.signData;
                    document.delfinoForm.withoutSignedPkcs7.value = result.signData;
                    if(result.pkcs1SignData!=null) document.delfinoForm.withoutSignedPkcs1.value = result.pkcs1SignData;
                    if(result.signingTime!=null) document.delfinoForm.signingTime.value = result.signingTime;
                }
            }

            if(result.confirmSignData!=null) document.delfinoForm.CONFIRM_PKCS7.value = result.confirmSignData;
            if(result.MACAddress!=null) document.delfinoForm.MACAddress.value = result.MACAddress;
            if(result.tokenSerialNumber!=null) document.delfinoForm.tokenSerialNumber.value = result.tokenSerialNumber;
            if(result.certExpireDate!=null) TEST_checkExpireWarning(result.certExpireDate);

            //CertGate
            document.delfinoForm.EA_serviceType.value = "_";
            document.delfinoForm.EA_signSubjectDN.value = "_";
            if(result.serviceType!=null) document.delfinoForm.EA_serviceType.value = result.serviceType;
            if(result.signSubjectDN!=null) document.delfinoForm.EA_signSubjectDN.value = result.signSubjectDN;

            document.delfinoForm.submit();
        }
        else{
            //if (Delfino.isPasswordError(result.status)) alert("비밀번호 오류 횟수 초과됨"); //v1.1.6,0 over & DelfinoConfig.passwordError = true
            alert("error:" + result.message + "[" + result.status + "]");
        }
    }

    //인증서로그인: Delfino.login()
    function TEST_certLogin(){
        document.delfinoForm.PKCS_TYPE.value = "base64";
        var signOptions = {'withMACAddressAll':true, policyOidCertFilter: ""};
        //signOptions = {'withMACAddress':true};

        Delfino.login("login=certLogin", TEST_complete, signOptions);
    }

    //사용자 확인 전자서명: 문자열
    function TEST_confirmSign_string() {
        document.delfinoForm.PKCS_TYPE.value = "base64";
        var signFormat = "출금계좌번호:이체금액:입금은행:입금계좌번호:받는분";
        var signData = "524902-01-055983:10,000:홍콩은행:097-21-0441-120:김모군";
        var signOptions = {policyOidCertFilter: ""};

        //Delfino.confirmSign({data:signData, dataType:'strings'}, signFormat, TEST_complete);
        Delfino.confirmSign({data:signData, dataType:'strings'}, signFormat, signOptions, TEST_complete);
    }

    //전문형태의 사용자 미확인 전자서명
    function TEST_withoutConfirmSign() {
        document.delfinoForm.PKCS_TYPE.value = "base64";
        var signData = "param=전문형태의 전자서명&데이타=201금융 보험 부동산 서비스 04";
        var signOptions = {cacheCert:false, policyOidCertFilter:""};
        //signOptions = {resetCertificate:false, cacheCert:false, policyOidCertFilter:""};
        //signOptions = {policyOidCertFilter: ""};

        //Delfino.sign(signData, TEST_complete);
        Delfino.sign(signData, signOptions, TEST_complete);
    }

    //<h2>다중전자서명</h2>
    //한번의 패스워드 입력으로 여러개의 서명(PKCS7)값을 생성 하고 싶은 경우 사용된다.<br/>
    //서버에서는 여러개를 각각 잘라내 PKCS7값을 검증해야한다. <br/>
    function TEST_multiSign(){
        document.delfinoForm.PKCS_TYPE.value = "base64";
        var data1 = document.delfinoForm.nonce1.value;
        var data2 = document.delfinoForm.nonce2.value;
        var signData = data1 + DelfinoConfig.multiSignDelimiter + data2
        var signOptions = {policyOidCertFilter: ""};
        signOptions.signTitle = "대출계약서" + DelfinoConfig.multiSignDelimiter + "출금이체동의서";
        
        //Delfino.multiSign(signData, TEST_complete);
        Delfino.multiSign(signData, signOptions, TEST_complete);
    }

    /*
    //전자서명:다중서명:  Delfino.sign()
    function TEST_multiSign(){
        var inData = "01:201금융 보험 부동산 서비스04:전자서명원문데이타|전자서명 원본데이타2";
        Delfino.sign(inData, TEST_complete,
            {
                cacheCertFilter:false,
                cacheCert:false,
                //issuerCertFilter:"cn=CrossCertTestCA2,ou=AccreditedCA,o=CrossCert,c=KR|cn=CrossCertTestCA,ou=AccreditedCA,o=CrossCert,c=KR",
                multiSign:true,
                //encoding: "euckr",
                multiSignDelimeter:"|"
            }
        );
        //return false;
    }
    */

    //전자서명: KB투자증권: Delfno.sign()
    function TEST_signNoCache(){
        document.delfinoForm.PKCS_TYPE.value = "base64";
        var inData = "Y";
        var inFormat = "투자증권약관에동의합니다.";
        Delfino.sign(inData, TEST_complete,
            {
                dataType:           "strings",
                format:             inFormat,
                delimeter:          ":",
                cacheCertFilter:    false,
                cacheCert:          false
                //policyOidCertFilter:CERT_Accept_Koscom
            }
        );
        //return false;
    }



    //전자서명: 전자채권: Delfno.sign()
    function TEST_bondsSign(isMulti){
        document.delfinoForm.PKCS_TYPE.value = "signedData";
        var inData = "000000000070002011112420111129YN테스트성명　　　　　　　　　　　　　　　10581450342098120581";

        if (isMulti) {
            inData    += DelfinoConfig.multiSignDelimiter;
            inData    += "0000000000700-2012132420111129YN홍  길성명123　　　　　　　　　　　　10581450342098120581";
            var confirmFormat = "[{\"location\":32,\"length\":10,\"label\":\"이  름\",\"format\":\"bold\"},{\"location\":14,\"length\":8,\"label\":\"날  짜\",\"format\":\"insert+####-##-##\"},{\"location\":57,\"length\":12,\"label\":\"계좌번호1\",\"format\":\"lastHide 2\"},{\"location\":57,\"length\":12,\"label\":\"계좌번호2\",\"format\":\"mask **##########\"}]";
            //elfino.confirmMultiSign(inData, confirmFormat, {dataType:'fixedLengthData', signType:'signedData', encoding:'euckr'}, TEST_complete);
            Delfino.sign(inData, TEST_complete,
                {
                    signType:"signedData",
                    dataType:"fixedLengthData",
                    format:confirmFormat,
                    multiSign:true,
                    multiSignDelimeter:DelfinoConfig.multiSignDelimiter,
                    addCertStoreType: false,
                    encoding: "euckr"
                }
            );
            return;
        }

        Delfino.sign(inData, TEST_complete,
            {
                signType:"signedData",
                addCertStoreType: false,
                encoding: "euckr"
            }
        );
        //return false;
    }

    //Delfino.mdSign()
    function TEST_mdSign(isMulti) {
        document.delfinoForm.PKCS_TYPE.value = "mdSign";
        var detachedDigest = "b0e5036fdb1f65006449b245fc46986945fc64433a3d709074f9160480f1a1b7";
        if (isMulti) detachedDigest = ['b0e5036fdb1f65006449b245fc46986945fc64433a3d709074f9160480f1a1b7', '22e5036fdb1f65006449b245fc46986945fc64433a3d709074f9160480f1a1b7'];
        // alert("messageDigest값이 아래와 같아야합니다.\n" + detachedDigest);

        if (isMulti) {
            document.delfinoForm.detachedMD.value = detachedDigest.join(document.delfinoForm.SIGN_Delimeter.value);
            Delfino.mdMultiSign(detachedDigest, TEST_complete);
            //Delfino.mdMultiSign(detachedDigest, TEST_complete, {cacheCertFilter:false, cacheCert:false});
        } else {
            document.delfinoForm.detachedMD.value = detachedDigest;
            //Delfino.mdSign(detachedDigest, TEST_complete);
            Delfino.mdSign(detachedDigest, TEST_complete, {cacheCertFilter:false, cacheCert:false});
        }
    }

    //Delfino.scrapingSign()
    function TEST_scrapingSign(isMulti) {
        if (document.delfinoForm.SIGN_Delimeter.value == "") isMulti = false;
        document.delfinoForm.PKCS_TYPE.value = "scrapingSign";

        var tbsData = "델피노 test 스크래핑용 서명원문1";
        if (isMulti) tbsData = [document.delfinoForm.nonce1.value, document.delfinoForm.nonce2.value];

        var signOptions = {};
        signOptions.cacheCert = false;
        signOptions.resetCertificate = true;
        signOptions.policyOidCertFilter = "";

        alert("스크래핑용서명원문\n[" + tbsData + "]");
        Delfino.scrapingSign(tbsData, signOptions, TEST_complete);
    }
    //사용하지 마세요.
    function TEST_cooconSign(isMulti) {
        if (document.delfinoForm.SIGN_Delimeter.value == "") isMulti = false;
        document.delfinoForm.PKCS_TYPE.value = "scrapingSign";
        var tbsData = "델피노 test 스크래핑용 서명원문1";
        if (isMulti) tbsData = ["델피노 test 스크래핑용 서명원문1", "두번째 test 스크래핑용 서명원문2"];

        var signOptions = {};
        signOptions.cacheCert = false;
        signOptions.resetCertificate = true;
        signOptions.policyOidCertFilter = "";

        signOptions.withPkcs1 = true;
        signOptions.certInResult = true;
        //signOptions.signingTimeInResult = true;
        //signOptions.withoutSigningTime = true;

        if (isMulti) {
            signOptions.multiSign = true;
            signOptions.multiSignDelimiter = document.delfinoForm.SIGN_Delimeter.value;
            tbsData = tbsData.join(document.delfinoForm.SIGN_Delimeter.value);
        }
        alert("쿠콘 스크래핑용서명원문\n[" + tbsData + "]");
        Delfino.sign(tbsData, signOptions, TEST_complete);
    }


    //전자서명: signKeyValue
    function TEST_signKeyValue() {
        document.delfinoForm.PKCS_TYPE.value = "base64";
        var delimeter = ":";
        var keys = "출금계좌번호:이체금액:수수료:내 통장 표시내용:입금은행:입금계좌번호:수취인:수취인 통장 표시내용:출금계좌번호";
        var values = "1234-1234-1234:10,000:100::국민은행:4321-4321-4321:아무개::2234-1234-1234";
        var formats = "출금계좌번호:이체금액:수수료:내 통장 표시내용:입금은행:입금계좌번호:수취인:수취인 통장 표시내용:출금계좌번호2";
        Delfino.signKeyValue(keys, values, formats, delimeter, TEST_signKeyValueCallback);
    }
    function TEST_signKeyValueCallback(pkcs7, vid_random) {
        var result = {};
        result.status = 1;
        result.signData = pkcs7;
        result.vidRandom = vid_random;
        TEST_complete(result);
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
        if (global._Delfino_SystemMode == "test" || global._Delfino_SystemMode == "dev" ) {
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
            DelfinoConfig.yessignCaHost    = yessignCaHost_real;
            DelfinoConfig.yessignCaPort    = yessignCaPort_real;
            DelfinoConfig.crosscertCaPort  = crosscertCaPort_real;
            DelfinoConfig.crosscertCaHost  = crosscertCaHost_real;
            DelfinoConfig.signkoreaCaHost  = signkoreaCaHost_real;
            DelfinoConfig.signkoreaCaPort  = signkoreaCaPort_real;
            DelfinoConfig.kicaCaHost       = kicaCaHost_real;
            DelfinoConfig.kicaCaPort       = kicaCaPort_real;
            DelfinoConfig.yessignWebCmpUrl = yessignWebCmpUrl_real;
            DelfinoConfig.cg.VPCGClientConfig.finCertOptions.finCertSdkUrl = finCertSdkUrl_real;
            DelfinoConfig.cg.VPCGClientConfig.finCertOptions.finCertCorpSdkUrl = finCertCorpSdkUrl_real;
            DelfinoConfig.cg.VPCGClientConfig.finCertOptions.encryptedFinCertParams = encryptedFinCertParams_real;
        } else {
            DelfinoConfig.yessignCaHost    = DelfinoConfig.yessignCaHost_test;
            DelfinoConfig.yessignCaPort    = DelfinoConfig.yessignCaPort_test;
            DelfinoConfig.crosscertCaPort  = DelfinoConfig.crosscertCaPort_test;
            DelfinoConfig.crosscertCaHost  = DelfinoConfig.crosscertCaHost_test;
            DelfinoConfig.signkoreaCaHost  = DelfinoConfig.signkoreaCaHost_test;
            DelfinoConfig.signkoreaCaPort  = DelfinoConfig.signkoreaCaPort_test;
            DelfinoConfig.kicaCaHost       = DelfinoConfig.kicaCaHost_test;
            DelfinoConfig.kicaCaPort       = DelfinoConfig.kicaCaPort_test;
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
    function TEST_certComplete(code, msg){
        if(code!=1){
          if(code==0){
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
    function TEST_certComplete2(result){
        TEST_certComplete(result.status, result.message);
    }

    function TEST_requestCertificate(){
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
            Delfino.requestCertificate2(caName, referenceValue, secretValue, TEST_certComplete2, {enableKmCert:true}); //정보인증 발급
            //Delfino.requestCertificate2(caName, referenceValue, secretValue, TEST_certComplete, {recovery:true, enableKmCert:true}); //정보인증 재발급
        } else if (caName == "yessignWebCmp") {
            Delfino.requestCertificate2(caName, referenceValue, secretValue, TEST_certComplete2, {browserCertificate:true}); //브라우저인증서 발급
        } else if (caName == "fincert") {
            Delfino.requestCertificate2("fincert", referenceValue, secretValue, TEST_certComplete2, {simpleKeyReq:true, showComplete: true}); //개인금융인증서 발급
        } else if (caName == "fincertcorp") {
            var bizNoValue = document.certForm.bizNoValue.value;
            Delfino.requestCertificate2("fincert", referenceValue, secretValue, TEST_certComplete2, {finCertMode: 'fincertcorp', simpleKeyReq: true, showComplete: true, bizNo: bizNoValue}); //기업금융인증서 발급
        } else {
            Delfino.requestCertificate(caName, referenceValue, secretValue, TEST_certComplete);
        }
    }

    function TEST_updateCertificate(){
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
            Delfino.updateCertificate2(caName, TEST_certComplete2, {resetCertificate:true, cacheCert:false, enableKmCert:true}); //정보인증 갱신
        } else if (caName == "yessignWebCmp") {
            Delfino.updateCertificate2(caName, TEST_certComplete2, {cacheCert:false, policyOidCertFilter:"1.2.410.200005.1.1.1-B|1.2.410.200005.1.1.5-B"}); //브라우저인증서 갱신
        } else if (caName == "fincertcorp") {
            var bizNoValue = document.certForm.bizNoValue.value;
            var certSeqNumValue = document.certForm.certSeqNumValue.value;
            Delfino.updateCertificate2('fincert', TEST_certComplete2, {finCertMode: 'fincertcorp', resetCertificate:true, cacheCert:false, certSeqNum: certSeqNumValue, bizNo: bizNoValue});
        } else {
            //Delfino.updateCertificate(caName, TEST_certComplete);
            Delfino.updateCertificate2(caName, TEST_certComplete2, {cacheCert:false, policyOidCertFilter:""}); //인증서캐쉬정보 사용하기
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
        document.relayForm.method="post";
        document.relayForm.target="testResult";
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
        document.relayForm.method="get";
        document.relayForm.target="testResult";
        document.relayForm.action = DelfinoConfig.certRelay.providerUrl;
        document.relayForm.submit();
    }

    function TEST_importCertificate(){
        Delfino.importCertificate(TEST_completeImport);
    }
    function TEST_exportCertificate(){
        Delfino.exportCertificate(TEST_completeExport);
        //Delfino.exportCertificate({disableExpireFilter:true}, TEST_completeExport); //만료된 인증서 보이기
    }
    function TEST_completeImport(result) {
        if(result.status==0) {
            alert("가져오기 취소"); //사용자취소
        } else if(result.status==1) {
            alert("가져오기 성공");
        } else {
            alert(result.message + "[" + result.status + "]");
        }
    }
    function TEST_completeExport(result) {
        if(result.status==0) {
            alert("내보내기 취소"); //사용자취소
        } else if(result.status==1) {
            alert("내보내기 성공");
        } else {
            alert(result.message + "[" + result.status + "]");
        }
    }
    function TEST_manageCertificate() {
        Delfino.manageCertificate();
    }
    // "[<b>"+global.DC_platformInfo.type+","+global.DC_platformInfo.name+","+global.DC_platformInfo.Mobile+"</b>][<b>"+global.DC_browserInfo.name+","+global.DC_browserInfo.version+"</b>]["+global.navigator.appName+"]"


    useEffect(()=> {
        // 마운트 되었을 때,
        console.log(ReactDelfino.Delfino, ReactDelfino.DelfinoConfig);
        if(!delfinoLoaded) {
            ReactDelfino.init().then(()=> {
                console.log(ReactDelfino.Delfino, ReactDelfino.DelfinoConfig);
                Delfino = ReactDelfino.Delfino;
                DelfinoConfig = ReactDelfino.DelfinoConfig;
                setDelfinoLoaded(true);

                yessignCaHost_real    = DelfinoConfig.yessignCaHost;
                yessignCaPort_real    = DelfinoConfig.yessignCaPort;
                crosscertCaPort_real  = DelfinoConfig.crosscertCaPort;
                crosscertCaHost_real  = DelfinoConfig.crosscertCaHost;
                signkoreaCaHost_real  = DelfinoConfig.signkoreaCaHost;
                signkoreaCaPort_real  = DelfinoConfig.signkoreaCaPort;
                kicaCaHost_real       = DelfinoConfig.kicaCaHost;
                kicaCaPort_real       = DelfinoConfig.kicaCaPort;
                yessignWebCmpUrl_real = DelfinoConfig.yessignWebCmpUrl;
                finCertSdkUrl_real    = DelfinoConfig.cg.VPCGClientConfig.finCertOptions.finCertSdkUrl;
                finCertCorpSdkUrl_real= DelfinoConfig.cg.VPCGClientConfig.finCertOptions.finCertCorpSdkUrl;
                encryptedFinCertParams_real = DelfinoConfig.cg.VPCGClientConfig.finCertOptions.encryptedFinCertParams;

                if (typeof(DelfinoConfig.cg) == "object") DelfinoConfig.cg.VPCGClientConfig.defaultProvider = "delfino";


                // 모듈캐쉬기능 사용시 샘플/START
                // Delfino.resetRecentModule();
                Delfino.setModule();
                //if (!DC_platformInfo.Mobile) { Delfino.resetRecentModule(); Delfino.setModule(); }
                console.log('init done end');
            });
        } else {
            Delfino = ReactDelfino.Delfino;
            DelfinoConfig = ReactDelfino.DelfinoConfig;
        }
        return ()=> {
            // unmount 된 후.
        };
    }, [delfinoLoaded]);

    return (
      <div className="delfino-check">
        <table className="body" align="center" border="0" cellPadding="0" cellSpacing="0">
          <tr>
          
            <td align="right"><h3>WIZVERA Delfino 전자서명 테스트  <font size="2">sample</font></h3></td>
          </tr>
        </table>


        <table className="body" align="center" border="0" cellPadding="6" cellSpacing="1" bgcolor="#E3E3E3">
          <tr>
            <td className="head"><b>브라우저 점검</b></td>
            <td className="body_l">
              ■ 브라우저({browserName})의 기본기능인 POST를 이용한  대용량 테이타 전송테스트 입니다.<br/>정상적으로 결과가 나오지 않으면 PC(브라우저)점검이 필요합니다.

              <form name="delfinoForm" method="post" target="testResult" action="/jsp/delfinoCheckResult">
                <input type="hidden" name="MACAddress" value="" />
                <input type="hidden" name="tokenSerialNumber" value="" />
                <input type="hidden" name="CONFIRM_PKCS7"/>

                <input type="hidden" name="signingCert"/>
                <input type="hidden" name="signingTime"/>
                <input type="hidden" name="withoutSignedPkcs7"/>
                <input type="hidden" name="withoutSignedPkcs1"/>

                <input type="hidden" name="detachedMD" />
                <input type="hidden" name="EA_serviceType" />
                <input type="hidden" name="EA_signSubjectDN" />

                PKCS7: <textarea name="PKCS7" defaultValue="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" /><br/>
                VID_R:&nbsp; <input type="text" name="VID_RANDOM"  size="34" style={{fontSize:"9pt"}} defaultValue="LvRWH51fyhltWJk/Pb9my5CNX3M=" />
                  <input type="text" name="SIGN_Delimeter" size="1" defaultValue="multiSignDelimiter" />
                  <select name="PKCS_TYPE">
                  <option value="base64">base64</option>
                  <option value="hex">hex</option>
                  <option value="base64Url">base64Url</option>
                  <option value="signedData">signedData</option>
                  <option value="mdSign">mdSign</option>
                  <option value="mdSignB64Url">mdSignB64Url</option>
                  <option value="scrapingSign">scrapingSign</option>
                </select><input type="checkbox" name="debug" /><br/>
                        주민번호: <input type="text" name="idn" defaultValue="" size="14" />
                <input type="submit" /> <input type="reset" /><br/>
                nonce 1 : <input type="text" name="nonce1"/><br/>
                nonce 2 : <input type="text" name="nonce2"/><br/>
                SignData 1 : <textarea name="signData1"/><br/>
                SignData 2 : <textarea name="signData2"/><br/>
                CERT: <textarea name="certTxt1"/><br/>
              </form>
            </td>
          </tr>

          <tr>
            <td className="head"><b>인증서관리 확인</b></td>
            <td className="body_l">
              ■ 개인에 저장된 공인인증서를 확인합니다.
              <input type="button" value="인증서관리" onClick={TEST_manageCertificate}/>

            </td>
          </tr>
          <tr>
            <td className="head"><b>인증서로그인 확인</b></td>
            <td className="body_l">
              ■ 유효기간이 만기된 인증서는 보이지 않습니다. 정상적으로 보이지 않으면 인증서관리에서 인증서가 있는지 확인하시기 바랍니다 <a href="javascript:TEST_certLogin();TEST_certLogin();" >.</a>
              <a href="javascript:setTimeout(function(){TEST_certLogin();}, 500); TEST_certLogin();" >.</a>
              <input type="button" value="인증서로그인" onClick={TEST_certLogin} />
              <a href="javascript:Delfino.setPolicyOidCertFilter('');Delfino.setIssuerCertFilter('');alert('인증서필터링이 제거되엇습니다.');" >setFilter</a>

              {/*<a href="javascript:Delfino.setModule('G2');TEST_certLogin();" >G2</a>
              <a href="javascript:Delfino.setModule('G3');TEST_certLogin();" >G3</a>
              <a href="javascript:Delfino.setModule('G4');TEST_certLogin();" >G4</a>
              <a href="javascript:Delfino.setModule('G5');TEST_certLogin();" >G5</a>
              <a href="javascript:Delfino.setModule('G10');TEST_certLogin();" >G10</a>*/}

            </td>
          </tr>

          <tr>
            <td className="head"><b>전자서명 확인</b></td>
            <td className="body_l">
              ■ 이체나 약관동의시 사용되는 전자서명 기능을 확인합니다. 로그인시 사용된 인증서만 보여집니다<a href="javascript:Delfino.resetCertificate();alert('인증서 캐쉬가 초기화되었습니다.');" >.</a>
              <input type="button" value="서명(confirm)" onClick={TEST_confirmSign_string} />
              <input type="button" value="서명(sign)"    onClick={TEST_withoutConfirmSign} />
              <input type="button" value="다중서명"       onClick={TEST_multiSign} />
              <input type="button" value="MD서명"       onClick={()=>{TEST_mdSign();}} />
              <input type="button" value="MD다중서명"       onClick={()=>{TEST_mdSign(true);}} />
              <input type="button" value="스크래핑"       onClick={()=>{TEST_scrapingSign(true);}} />
              {/*<a href="javascript:TEST_signKeyValue();" >KB</a>*/}

              {/*<a href="javascript:TEST_signNoCache();" >증권</a>
              <a href="javascript:TEST_bondsSign(false);" >채권</a>
              <a href="javascript:TEST_bondsSign(true);" >멀티</a>
              <a href="javascript:TEST_mdSign(true);" >MD</a>
              <a href="javascript:TEST_cooconSign(true);" >C</a>*/}

              {/*<input type="button" value="다중서명"       :onclick="TEST_multiSign" />*/}
              {/*<a href="javascript:TEST_scrapingSign(true);" >#P1</a>*/}
            </td>
          </tr>
          <tr>
            <td className="head"><b>인증서이동하기</b></td>
            <td className="body_l">
              ■ 중계서버를 이용한 인증서 로밍기능을 <a onClick={TEST_relayCheck} >확인</a>합니다.
              <input type="button" value="내보내기" onClick={TEST_exportCertificate} />
              <input type="button" value="가져오기" onClick={TEST_importCertificate} />

              {/*<a href="javascript:TEST_importCheck();" >test</a>
              <br/>
              ■ 브라우저 인증서 이동기능을 확인합니다.(G4전용)
              <input type="button" value="내보내기" onclick="javascript:TEST_exportCertificateG4();" />
              <input type="button" value="가져오기" onclick="javascript:TEST_importCertificateG4();" />*/}


              <form id="relayForm" name="relayForm">
                  <input type="hidden" name="index" value="" />
                  <input type="hidden" name="cmd" value="" />
                  <input type="hidden" name="pubKey" value="" />
                  <input type="hidden" name="clientAuth" value="" />
                  <input type="hidden" name="serverAuth" value="" />
                  <input type="hidden" name="sessionKey" value="" />
                  <input type="hidden" name="signedData" value="" />
              </form>
            </td>
          </tr>

          {/*<tr>
            <td className="head"><b>인증서 발급/갱신</b></td>
            <td className="body_l">
              ■ 참조번호/인가코드를 입력하여 인증서 발급/갱신을 테스트합니다.

              <form id="certForm" name="certForm">
                  &nbsp;&nbsp;- 참조번호: <input type="text" name="referenceValue" value="93613" size="10" />
                  &nbsp;&nbsp;
                  <select name="caType">
                    <option selected value="test">개발CA</option><option value="real">운영CA</option>
                  </select>
                  <select name="caName">
                    <option selected value="yessign">금결원</option>
                    <option value="crosscert">전자인증</option>
                    <option value="signkorea">코스콤</option>
                    <option value="kica">정보인증</option>
                    <option value="yessignWebCmp">WebCmp</option>
                    <option value="fincert">금융(개인)</option>
                    <option value="fincertcorp">금융(기업)</option>
                  </select>
                  <br/>&nbsp;&nbsp;- 인가코드: <input type="text" name="secretValue" value="0912978800814393922" size="20" />
                  &nbsp;&nbsp;
                  <input type="button" value="인증서발급" onclick="javascript:TEST_requestCertificate();" />
                  <input type="button" value="갱신"      onclick="javascript:TEST_updateCertificate();" />

                  <br/>&nbsp;&nbsp;- 사업자번호: <input type="text" name="bizNoValue" value="2158710208" size="7" /> *금융(<a href="https://t-4user.yeskey.or.kr/test.html" target="test_fincert">개인</a>/<a href="https://t-4user.yeskey.or.kr/testCorp.html" target="test_fincertcorp">기업</a>)인증서 <a href="https://www.yessign.or.kr/testcert/index.jsp" target="test_cert">발급</a>시 사용
                  <br/>&nbsp;&nbsp;- 인증서일련번호: <input type="text" name="certSeqNumValue" value="" size="4" /> *금융(기업) 인증서 갱신시 사용
              </form>
            </td>
          </tr>*/}


        </table>


        <br/>
        <table className="body" align="center" border="0" cellPadding="6" cellSpacing="1" bgcolor="#E3E3E3">
          <tr>
            <td className="head">
              <b>테스트결과</b>
            </td>
          </tr>
          <tr>
            <td className="body" height="240">
              <iframe name='testResult' id='testResult' frameBorder='0' width='100%' height='100%' src='/jsp/delfinoCheckResult'></iframe>
            </td>
          </tr>
        </table>


        <br/>
        <hr width="80%" />
        <table className="body" border="0" align="center" cellPadding="0" cellSpacing="0">
          <tr>
            <td height="40"><div style={{fontSize:"9pt"}} align="center">
              Copyrigh<a href="javascript:alert(document.cookie);">t</a> &#169; 2008-2014, <a href='http://www.wizvera.com' target="_new">WIZVERA</a> Co.,
              Ltd. All rights reserved.

            <a href='javascript:fn_selectViewport();'>PC/mobile</a>
            <a href='javascript:fn_selectEXT();'>추가</a>
            <a href='javascript:fn_selectSystemLang();'>lang</a>
            {/*<a href='javascript:fn_selectUiType();'></a>*/}
            <a href='javascript:fn_selectSystemMode();'></a>
            <a href='javascript:changeModuleTypeCookie();'>cookie</a>
            <a href="javascript:location.href=delfino.conf.handler.reqUrl + '/cacert.html'">cacert</a>
            <a href='javascript:delfino.handler.execute()'>exec</a>

            </div></td>
          </tr>
        </table>
      </div>
    );
}

export default CheckView;