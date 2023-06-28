/** 
 * import 순서
 * react hook, custom hook, 
 * external component(module), 
 * internal component(module), 
 * data, 
 * css
 */
import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router";
import OslBtn from "../../../modules/components/OslBtn";
import OslHeader from "../../../modules/components/OslHeader";
import collectData from "../../../modules/constants/collectData";
import PathConstants from '../../../modules/constants/PathConstants.js';
import { callOpenApi,  callLocalApi } from "../../../modules/common/tokenBase";
import API from "../../../modules/constants/API";
import { useRef } from "react";
import { useInterval } from "../../../modules/common/hook/useInterval";
//suitTestData[5].radioList.find((data)=> data.id===parseInt(userResult[5])-1).value
const suitTestData = collectData("SuitTest");
/**
 * 컴포넌트명 : 적합성 적정성 결과
 * 설명
 * @param {*} props
 * props항목별 설명
 */
function SuitResult(props) {

  const obj = {
    // lfncJdgmRsltDcd: "01",
    // age: "35",
    // cdbuScr: "500",
    // cusEad: "ibk@gamil.com",
    // lfncAcmDcd: null,
    // lfncHlasDcd: "01",
    // lfncEnprPsntIncmDcd: "01",
    // lfncFtrAntcAnicDcd: "01",
    // lfncLbltDcd: "01",
    // lfncFxngExpdDcd: "01",
    // lfncOvduDcd: "01",
    // lfncCrdtScrCnfaYn: null,
    // lfncRepmWayDcd: "01",
    // lfncCrdtScrVainDcd: "01",
    // innfGthrCosnYn: null
  };
  const [userResult, setUserResult] = useState({});
  const [suitData, setSuitData] = useState({});
  //api통신 중 로딩띄우기
  const [showLoading, setShowLoading] = useState(false);
  //판단결과구분코드
  const [lfncJdgmRsltDcd, setLfncJdgmRsltDcd] = useState("");
  useLayoutEffect(()=> {
    setShowLoading(true);
    callOpenApi(
      API.PREJUDGE.SUITRESULT_CMPBPOPYEXCNVRFCIQRG,
      {},
      (res)=> {
        setShowLoading(false);
        // lfncJdgmRsltDcd (판단결과구분코드)
        setLfncJdgmRsltDcd(res.data.RSLT_DATA.lfncJdgmRsltDcd);
        
      }
    )
    //obj.lfncJdgmRsltDcd = null;
    
  }, []);
  //10초마다 모두완료가 아닐시 수집상태 여부API 호출
  const delay = useRef(10000);
  useInterval(()=> {
    setShowLoading(true);
    if(!!lfncJdgmRsltDcd && lfncJdgmRsltDcd !== "01") {
      callOpenApi(
        API.PREJUDGE.SUITRESULT_CMPBPOPYEXCNVRFCINQ,
        {},
        (res)=> {
          if(!!res.data.RSLT_DATA.lfncJdgmRsltDcd) {
            delay.current = null;
            setShowLoading(false);
            if(res.data.RSLT_DATA.lfncJdgmRsltDcd === "01") {
              
              setUserResult({lfncJdgmRsltDcd:"Y"});
            }else {
              let obj = res.data.RSLT_DATA;
              obj["flag"] = "Y";
              setUserResult(obj);
            }
          }
          
  /* 
        result.setLfncJdgmRsltDcd(lfncJdgmRsltDcd);
        result.setAge(String.valueOf(failSelectLfncOsl003L.get("AGE")));//연령
        result.setLfncHlasDcd(String.valueOf(failSelectLfncOsl003L.get("LFNC_HLAS_DCD")));	//보유자산
        result.setLfncEnprPsntIncmDcd(String.valueOf(failSelectLfncOsl003L.get("LFNC_ENPR_PSNT_INCM_DCD")));	//현재소득
        result.setLfncFtrAntcAnicDcd(String.valueOf(failSelectLfncOsl003L.get("LFNC_FTR_ANTC_ANIC_DCD"))); 	//미래예상소득
        result.setLfncLbltDcd(String.valueOf(failSelectLfncOsl003L.get("LFNC_LBLT_DCD"))); 				//부채
        result.setLfncFxngExpdDcd(String.valueOf(failSelectLfncOsl003L.get("LFNC_FXNG_EXPD_DCD"))); 		//고정지출
        result.setLfncOvduDcd(String.valueOf(failSelectLfncOsl003L.get("LFNC_OVDU_DCD"))); 				//연체
        result.setCdbuScr(String.valueOf(failSelectLfncOsl003L.get("CDBU_SCR"))); 						//cb점수
        result.setLfncCrdtScrVainDcd(String.valueOf(failSelectLfncOsl003L.get("LFNC_CRDT_SCR_VAIN_DCD"))); 	//평가기관
        result.setLfncRepmWayDcd(String.valueOf(failSelectLfncOsl003L.get("LFNC_REPM_WAY_DCD"))); 			//변제방법
        result.setCusEad(String.valueOf(failSelectLfncOsl003L.get("CUS_EAD"))); 							//이메일
  */          
            //setSuitData(res.data.RSLT_DATA);
            
          
        }
      );
    }
  }, delay.current);

  useEffect(()=> {
    // 판단결과구분코드 부적합시
    console.log("lfncJdgmRsltDcd>>", lfncJdgmRsltDcd);
  }, [lfncJdgmRsltDcd]);

  useEffect(()=> {
    console.log(userResult);
    if(userResult.flag === "Y") {
      //적합성결과 코드값과 collect data에 정의한 코드값과 value값 매칭해서 추출
      setSuitData({
        lfncJdgmRsltDcd: lfncJdgmRsltDcd,
        age: userResult.age,
        cdbuScr: userResult.cdbuScr,
        cusEad: userResult.cusEad,
        lfncAcmDcd: suitTestData[0].radioList.filter((data)=> data.dbVal===userResult.lfncHlasDcd.trim()).length !== 0?
          suitTestData[0].radioList.filter((data)=> data.dbVal===userResult.lfncHlasDcd.trim())[0].value:"",
        lfncHlasDcd: suitTestData[3].radioList.filter((data)=> data.dbVal===userResult.lfncHlasDcd.trim()).length !== 0?
          suitTestData[3].radioList.filter((data)=> data.dbVal===userResult.lfncHlasDcd.trim())[0].value:"",
        lfncEnprPsntIncmDcd: suitTestData[4].radioList.filter((data)=> data.dbVal===userResult.lfncEnprPsntIncmDcd.trim()).length !== 0?
          suitTestData[4].radioList.filter((data)=> data.dbVal===userResult.lfncEnprPsntIncmDcd.trim())[0].value:"",
        lfncFtrAntcAnicDcd: suitTestData[5].radioList.filter((data)=> data.dbVal===userResult.lfncFtrAntcAnicDcd.trim()).length !== 0?
          suitTestData[5].radioList.filter((data)=> data.dbVal===userResult.lfncFtrAntcAnicDcd.trim())[0].value:"",
        lfncLbltDcd: suitTestData[6].radioList.filter((data)=> data.dbVal===userResult.lfncLbltDcd.trim()).length !== 0?
          suitTestData[6].radioList.filter((data)=> data.dbVal===userResult.lfncLbltDcd.trim())[0].value:"",
        lfncFxngExpdDcd: suitTestData[7].radioList.filter((data)=> data.dbVal===userResult.lfncFxngExpdDcd.trim()).length !== 0?
          suitTestData[7].radioList.filter((data)=> data.dbVal===userResult.lfncFxngExpdDcd.trim())[0].value:"",
        lfncOvduDcd: suitTestData[8].radioList.filter((data)=> data.dbVal===userResult.lfncOvduDcd.trim()).length !== 0?
          suitTestData[8].radioList.filter((data)=> data.dbVal===userResult.lfncOvduDcd.trim())[0].value:"",
        lfncCrdtScrCnfaYn: suitTestData[9].radioList.filter((data)=> data.dbVal===userResult.lfncCrdtScrCnfaYn.trim()).length !== 0?
          suitTestData[9].radioList.filter((data)=> data.dbVal===userResult.lfncCrdtScrCnfaYn.trim())[0].value:"",
        lfncRepmWayDcd: suitTestData[12].radioList.filter((data)=> data.dbVal===userResult.lfncRepmWayDcd.trim()).length !== 0?
          suitTestData[12].radioList.filter((data)=> data.dbVal===userResult.lfncRepmWayDcd.trim())[0].value:"",
        lfncCrdtScrVainDcd: userResult.lfncCrdtScrVainDcd,
      });
    }
    
    // return ()=> {
    //   window.document.querySelector(".loading").remove();
    // }
    
  }, [userResult]);

  const navigate = useNavigate();
  let crdBru = "";
  let crdScr = "";
  
  /**
   * state = {result: [적합성적정성 결과값 배열], crdBru: "신용기관"}
   
  const { state } = useLocation();
  try {
    crdBru = state.crdBru;
    crdScr = state.crdScr;
    userResult = state.result;
  }catch {
    //에러페이지
  }
  */
  // const DIFF_RESULT = [0,99,0,0,0,0,0,0,0,99,0,99]; //적합성적정성 답안지

  // let userRadioResult = [...userResult];
  // let diffRadioResult = [...DIFF_RESULT];
  // let incorrectIdxList = [];
  // //radio선택항목만 남김
  // userRadioResult.splice(1,1);
  // userRadioResult.splice(8,1);
  // userRadioResult.splice(9,1);
  // diffRadioResult.splice(1,1);
  // diffRadioResult.splice(8,1);
  // diffRadioResult.splice(9,1);
  
  // diffRadioResult.map((data, idx)=> {
  //   if(data != userRadioResult[idx]) {
  //     incorrectIdxList.push(userRadioResult[idx]);
  //   }
  // });

  function cbOslBtn() {
    //보증심사자료 작성 이동
    navigate(PathConstants.PREJUDGE_GRTINFOINPUT);
    // //진행상태 이동
    // navigate(PathConstants.MAIN,
    //   {
    //     state: {
    //       tabIdx: 2 //진행상태
    //     }
    //   }
    // );
  }

  return (
    <>
      <OslHeader headerNm={props.headerNm} />
      {!lfncJdgmRsltDcd?
      <div className="container">
        <div className="content">
          <div className="content-body prescreening">
            <div className="content-top line-be4">
              <p className="top-tit">
                <span className="fw-b">적합성・적정성 확인 중입니다.<br /> 잠시만 기다려 주세요.</span>
              </p>
            </div>
            <div className="loading" style={{backgroundColor: "transparent"}}></div>
          </div>
        </div>
      </div>
      :lfncJdgmRsltDcd === "01"?
      <div className="container">
        <div className="content">
          <div className="content-body">
            <div className="content-body prescreening">
              <div className="content-top">
                <div className="result-y">
                  <p className="top-tit">
                    홍길동 님의<br />
                    <span className="fw-b">적합성・적정성 판단결과</span><br />
                    <span className="fw-b fc-p">적합</span>으로 확인됩니다
                  </p>
                </div>
              </div>
            </div>
          </div>

          <OslBtn
            obj={{
              type: "button",
              disabled: false,
              text: ["다음"],
              link: "",
              callbackId: cbOslBtn
            }} />

        </div>
      </div>
      :
      <div className="container">
        <div className="content">
          <div className="content-body">
            <div className="content-top line-be4">
              <p className="top-tit">홍길동님의 <br /> <strong>적합성&middot;적정성 판단결과</strong> <br /> <strong className="fc-r">부적합</strong>으로 확인됩니다.</p>
            </div>

            <section className="section line-tf4">
              <div className="info-wrap">
                <div className="info-box">
                  <span className="tit fc-gray">연령</span>
                  <span className="txt fc-dark ta-r">{suitData.age}세</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">보유자산</span>
                  <span className="txt fc-dark ta-r">{suitData.lfncHlasDcd}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">현재소득</span>
                  <span className="txt fc-dark ta-r">{suitData.lfncEnprPsntIncmDcd}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">미래예상소득</span>
                  <span className="txt fc-dark ta-r">{suitData.lfncFtrAntcAnicDcd}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">부채</span>
                  <span className="txt fc-dark ta-r">{suitData.lfncLbltDcd}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">고정지출</span>
                  <span className="txt fc-dark ta-r">{suitData.lfncFxngExpdDcd}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">연채여부</span>
                  <span className="txt fc-dark ta-r">{suitData.lfncOvduDcd}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">신용점수</span>
                  <span className="txt fc-dark ta-r">
                    {suitData.lfncCrdtScrCnfaYn === "N"?<>잘모름</>:`${suitData.cdbuScr}점`}
                  </span>
                </div>
                {
                  suitData.lfncCrdtScrCnfaYn === "Y"&&
                    <div className="info-box">
                      <span className="tit fc-gray">평가기관</span>
                      <span className="txt fc-dark ta-r">{suitData.lfncCrdtScrVainDcd}</span>
                    </div>
                }
                <div className="info-box">
                  <span className="tit fc-gray">변제방법</span>
                  <span className="txt fc-dark ta-r">{suitData.lfncRepmWayDcd}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">이메일주소</span>
                  <span className="txt fc-dark ta-r">{suitData.cusEad}</span>
                </div>
              </div>
            </section>

            <section className="section line-tf4 pad-b0">
              <div className="list-wrap type01">
                <h2 className="list-tit fc-gray">안내사항</h2>
                <ul className="bullet-type01">
                  <li className="item">
                    <span className="fc-gray">부적합 판정을 받으신 고객은, 당일자에는 대면 및 비대면 대출 신청을 할 수 없습니다.</span>
                  </li>
                  <li className="item">
                    <span className="fc-gray">확인서 재작성은 다음날부터 가능합니다.</span>
                  </li>
                  <li className="item">
                    <span className="fc-gray">자세한 문의사항은 거래하실 영업점 또는 고객센터(<a href="tel:1566-2566" className="fc-gray">1566-2566</a>)으로 문의주시기 바랍니다.</span>
                  </li>
                </ul>
              </div>
            </section>

          </div>

          <OslBtn
            obj={{
              type: "button",
              disabled: false,
              text: ["나가기"],
              link: "",
              callbackId: cbOslBtn
            }} />
        </div>
      </div>
      }
      
    </>
  );

}

export default SuitResult;