import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router";
import SelectComponent from "../../common/SelectComponent";
import TextComponent from "../../common/TextComponent";
import TitleComponent from "../../common/TitleComponent";
import OslBtn from "../../../modules/components/OslBtn";
import OslHeader from "../../../modules/components/OslHeader";
import { checkBatchimEnding, getAge } from "../../../modules/utils/util";
import PathConstants from "../../../modules/constants/PathConstants";
import collectData from "../../../modules/constants/collectData";
import AlertModal from "../../../modules/components/AlertModal";
import { callOpenApi,  callLocalApi } from "../../../modules/common/tokenBase";
import API from "../../../modules/constants/API.js";


const suitTestData = collectData("SuitTest");
/**
 * 컴포넌트명 : 적합성 적정성 검사
 * 설명   : 
 * 
 * @param {*} props
 * props항목별 설명
 */
function SuitTest(props) {

  //고객 이메일
  const [resEmail, setResEmail] = useState("");
  //고객 나이
  const [resAge, setResAge] = useState("");
  //등록 파라미터
  const [params, setParams] = useState({
    age:                "", //연령                     userResult[1]
    cdbuScr:            "", //신용점수                  userCrdScr
    cusEad:             "", //이메일                   userResult[11]
    lfncAcmDcd:         "", //소비자구분코드            userResult[0]
    lfncLnugDcd:        "", //대출용도                 userResult[2]
    lfncHlasDcd:        "", //보유자산구분코드          userResult[3]
    lfncEnprPsntIncmDcd:"", //현재소득구간구분코드      userResult[4]
    lfncFtrAntcAnicDcd: "", //미래예상연간소득구분코드  userResult[5]
    lfncLbltDcd:        "", //여신금융상담부채구분코드  userResult[6]
    lfncFxngExpdDcd:    "", //고정지출구분코드         userResult[7]
    lfncOvduDcd:        "", //연체구분코드             userResult[8]
    lfncCrdtScrCnfaYn:  "", //신용점수확인여부          userResult[9]
    lfncRepmWayDcd:     "", //변제방법구분코드          userResult[10]
    lfncCrdtScrVainDcd: "", //신용점수평가기관구분코드  userCrdBru
    innfGthrCosnYn:     "", //개인정보수집동의여부      agreeYn
  });

  //api통신 중 로딩띄우기
  const [showLoading, setShowLoading] = useState(false);
  
  useLayoutEffect(()=> {
    setShowLoading(true);
    callOpenApi(
      API.PREJUDGE.SUITTEST_SBNTPOPYINQ,
      {},
      (res)=> {
        if(res.data.RSLT_DATA.email === "-"){
          setResEmail("");
        }
        setShowLoading(false);
        console.log(res);
        setResEmail(res.data.RSLT_DATA.email.trim());
        setResAge(getAge(res.data.RSLT_DATA.brthdy));
      }
    );
  }, []);

  /**
   * 항목별 데이터 분리
   */
  let arrTitleData = [];
  suitTestData.find((data) => {
    arrTitleData.push(data.title);
  });
  let arrRadioData = [];
  suitTestData.find((data) => {
    if(data.type === "radio") {
      arrRadioData.push(data);
    }
  });
  let arrTextData = [];
  suitTestData.find((data) => {
    if(data.type === "text") {
      console.log(resAge);
      // if(data.title==="연령") data["value"] = resAge;
      // if(data.title==="교부 받을 이메일 주소") data["value"] = resEmail;
      arrTextData.push(data);
    }
  });
  let arrSeleectData = [];
  suitTestData.find((data) => {
    if(data.type === "select") {
      arrSeleectData.push(data);
    }
  });

  const [showTitleYn, setShowTitleYn] = useState(true);
  const [showCrdElYn, setShowCrdElYn] = useState(true); //신용관련 element show/hide
  const [userResult, setUserResult] = useState([0,99,5,99,99,99,99,99,99,99,99,99]); //결과값 저장 state
  const inputRef = useRef([]);  //밸리데이션체크시 focus를 위한 값
  const [userCrdBru, setUserCrdBru] = useState("01"); //신용기관 선택값
  const [userCrdScr, setUserCrdScr] = useState(""); //신용점수 입력값
  const [reqResult, setReqResult] = useState({});
  const [agreeYn, setAgreeYn] = useState("N"); //하단 동의 체크 여부
  const [alertBtnNm, setAlertBtnNm] = useState(["확인"]);
  let navigate = useNavigate(); //다음화면을 위한 navigate

  // const {apiPath, setApiPath} = useContext(Context1);
  // console.log(apiPath);
  // useEffect(()=> {
  //   console.log(apiPath);
  //   if(apiPath != "/") navigate(PathConstants.PREJUDGE_DATACOLLECT);
  // },[apiPath]);
  
  useEffect(()=> {
    console.log(resAge, userResult);
    let copy = [...userResult];
    copy[1] = resAge;
    copy[11] = resEmail;
    console.log(resAge, copy);
    setUserResult(copy);
  }, [resAge, resEmail]);


   // popup
   function openPop() {
    setShow(true);
    document.body.style.overflow = "hidden";
  }
  function closePop() {
    setShow(false);
    document.body.style.overflow = "";
  }
  const [show, setShow] = useState(false);
  const handleShow = ()=> openPop();
  const handleClose = ()=> closePop();
  const [msgCont, setMsgCont] = useState("");
  const [successYn, setSuccessYn] = useState(false);

  useEffect(()=> {
    console.log("유저리절트>>", userResult);
    if(userResult[9] === 1) {
      setShowCrdElYn(false);
    }else {
      setShowCrdElYn(true);
    }

    setParams({
      age:                userResult[1], //연령                     userResult[1]
      cdbuScr:            userCrdScr, //신용점수                  userCrdScr
      cusEad:             userResult[11], //이메일                   userResult[11]
      lfncAcmDcd:         "0"+(userResult[0]+1), //소비자구분코드            userResult[0]
      lfncLnugDcd:        "0"+(userResult[2]+1), //대출용도                 userResult[2]
      lfncHlasDcd:        "0"+(userResult[3]+1), //보유자산구분코드          userResult[3]
      lfncEnprPsntIncmDcd:"0"+(userResult[4]+1), //현재소득구간구분코드      userResult[4]
      lfncFtrAntcAnicDcd: "0"+(userResult[5]+1), //미래예상연간소득구분코드  userResult[5]
      lfncLbltDcd:        "0"+(userResult[6]+1), //여신금융상담부채구분코드  userResult[6]
      lfncFxngExpdDcd:    "0"+(userResult[7]+1), //고정지출구분코드         userResult[7]
      lfncOvduDcd:        "0"+(userResult[8]+1), //연체구분코드             userResult[8]
      lfncCrdtScrCnfaYn:  userResult[9]===0?"Y":"N", //신용점수확인여부          userResult[9]
      lfncRepmWayDcd:     "0"+(userResult[10]+1), //변제방법구분코드          userResult[10]
      lfncCrdtScrVainDcd: userCrdBru, //신용점수평가기관구분코드  userCrdBru
      innfGthrCosnYn:     agreeYn, //개인정보수집동의여부      agreeYn
    })
  }, [userResult]);

  useEffect(()=> {
    console.log(userCrdBru);
    let copy = {...params};
    copy.lfncCrdtScrVainDcd = userCrdBru;
    copy.cdbuScr = userCrdScr;
    copy.innfGthrCosnYn = agreeYn;
    setParams(copy);
  }, [userCrdBru, userCrdScr, agreeYn]);

  useEffect(()=> {
    console.log("등록파라미터>>", params);
  }, [params]);
  
  function cbOslBtn() {
    //inputRef.current = ["1111"];
    console.log("REF>>",inputRef);
    
    const msg = validCheckEmpty(agreeYn, userResult, userCrdBru, userCrdScr, inputRef);
    
    if(!!msg) {
      setAlertBtnNm(["확인"]);
      setMsgCont(msg);
      handleShow();
      //스크롤이동
      
    }else {
      //데이터 전송
      setSuccessYn(true);
      setAlertBtnNm(["확인", "취소"]);
      setMsgCont("신청대출 실행 후 관련 계약서류를 입력하신 고객님의 이메일주소(" + userResult[11] + ")로 제공합니다.\n이메일주소가 맞는지 한번 더 확인바랍니다.");
      handleShow();
      
    }
    
  }

  
  return (
    <>
    
    <OslHeader headerNm={props.headerNm}/>
    <div className="container">
      <div className="content">
        <div className="content-body">
          <div className="content-top">
            <p className="top-tit"><strong>사업자 정보를 확인</strong>하는 중 입니다.
            </p>
            <p className="top-txt">
              기다리는 시간 동안 사장님께서 작성하셔야 하는 확인서가 있어요!
            </p>
          </div>
          <div className="section line-tf4 bg-greyf4">
            <div className="bg-white">
              <p className="info-tit">적합성ㆍ적정성고객정보 확인서</p>
              <p className="info-con-txt">
                본 확인서는 [금융소비자 보호에 관한 법률]에 의거하여 고객님의 연령, 대출목적(용도) 등을 파악하고, 고객님이 신청하신 상품이 고객님의 상황에 적합・적정한지 여부를 확인하기 위한 기초 자료로 활용됩니다.
              </p>
              <p className="info-con-txt">
                아래 체크리스트에 고객님의 상황에 부합하거나 가장 가까운 항목을 정확히 선택하여 주시기 바랍니다.
              </p>
              <p className="info-con-txt">
                - 보유자산, 부채 항목은 작성일 기준, 현재 소득은 최근 1년 기준으로 작성하세요.
              </p>
            </div>
          </div>
          <div className="section line-tf4">
            <ul className="sele-list type02">
              {
                suitTestData.map((data, idx)=> {
                  
                  return (
                    <li key={`li_${idx}`} className="item">
                      <TitleComponent
                        showYn={(data.id===9 && data.type!="radio")?showCrdElYn:true}
                        title={arrTitleData[idx]}
                        styleTxt="txt"
                      />
                      { 
                        (data.type === "radio") && 
                        <RadioComponent 
                          radioRef={inputRef}
                          radioData={arrRadioData[data.radioId]} 
                          styleFormGroup={(data.radioId != 8)?"form-group":"form-group inline row2"} 
                          checked={userResult[data.id]}
                          isDisabled={data.id===0 || data.id===2?true:false}
                          onChangeFn={(radioDataId)=> {
                            let copy = [...userResult];
                            copy[data.id] = radioDataId;
                            setUserResult(copy);
                          }}
                        /> 
                      }
                      <br/>
                      {
                      (data.id === 0) &&<p className="info-con-txt">
                        * 전문금융소비자란? 국가, 한국은행, 금융회사(은행, 종합금융회사, 보험회사 등), 주권상장법인, 겸영여신업자, 금융상품판매대리・중개업자, 특수목적을 위해 설립된 법인 등을 뜻합니다.
                        <br/>
                        * 전문금융소비자는 청약 철회권을 행사할 수 없습니다.
                      </p>
                      }
                      { 
                        (data.type === "text")  && 
                          <TextComponent
                            textRef={inputRef}
                            showYn={(data.textId===1)?showCrdElYn:true}
                            styleSeleList="sele-list type01 radius answer-wrap"
                            styleInput=""
                            textData={(data.id===1)?{id:1,value:resAge}:(data.id===11)?{id:11,value:resEmail}:arrTextData[data.textId]}
                            inputType={data.placeholder.indexOf("숫자")>-1?"number":"text"}
                            isDisabled={data.id===1&&false}
                            onChangeFn={(value)=>{
                              if(data.id === 1) {
                                setResAge(value);
                              }else if(data.id === 9) {
                                setUserCrdScr(value);
                              }else if(data.id === 11){
                                setResEmail(value);
                              }else {
                                let copy = [...userResult];
                                copy[data.id] = value;
                                setUserResult(copy);
                              }
                              
                            }}
                          />                          
                      }
                      { 
                        (data.type === "select")&& 
                          <SelectComponent
                            showYn={showCrdElYn}
                            selectData={arrSeleectData[data.selectId]}
                            styleSeleList="sele-list type01 radius answer-wrap mar-t10"
                            onChangeFn={(value)=> {
                              setUserCrdBru(value);
                            }}
                          />                          
                      }
                    </li>
                  )
                })
              }
            </ul>
            <div className="terms-wrap mar-t20">
              <div className="txt-wrap bg-gray">
                <p className="txt s-txt">
                  본인은 은행에 제공한 적합성・적정성 관련 정보와 관련하여 다음과 같은 사항을 확인합니다.
                </p>
                <ul className="info-con-wrap mar-t10">
                  <li className="info-con-txt">1. 적합성・적정성 관련 정보는 본인의 연령, 대출목적(용도) 등의 정보를 정확히 알려드린 것입니다.</li>
                  <li className="info-con-txt">2. 적합성・적정성 판단결과 “적합”의 의미는 고객님과  여신 상담이 가능한 것을 말하며, 여신신청에 대한 승인을 의미하는 것은 아닙니다.</li>
                  <li className="info-con-txt">3. 본인이 제공한 정보가 정확하지 않거나, 정보에 변경사항이 발생한 경우에는 적합성・적정성 판단이 달라질 수 있음을 설명 받았습니다.</li>
                  <li className="info-con-txt">4. 상기 목적을 위해 본인의 개인(신용)정보를 수집, 이용 또는 제공하는 것에 동의합니다.</li>
                </ul>
              </div>

              <div className="ui-cont-wrap">
                <div className="ui-decide">
                  <input type="checkbox" id="checkbox01" onChange={()=> {
                    if(agreeYn === "Y") setAgreeYn("N")
                    else setAgreeYn("Y");
                  }}/>
                    <label htmlFor="checkbox01" className="input-label">본인은 위 안내사항을 충분히 이해하고 동의합니다.</label>
                </div>
                <p className="info-con-txt mar-t10">* 본 확인서는 [금융소비자 보호에 관한 법률] 제17조 및 제18조에 따라 작성되었습니다.</p>
              </div>
            </div>
          </div>
        </div>
        <OslBtn
          obj={{
            type: "button",
            disabled: false,
            text: ["제출"],
            link: "",
            callbackId: cbOslBtn
          }} ></OslBtn>
      </div>
    </div>
    {
      show&&
      <AlertModal
        show={show}
        msg={msgCont}
        btnNm={alertBtnNm}
        onClickFn={(btnIdx)=> {
          handleClose();
          if(successYn && btnIdx===0) {

            // let param = {
            //   age: userResult[1],// 연령
            //   cdbuScr: userCrdScr,// CB점수
            //   cusEad: userResult[11],// 이메일주소
            //   lfncAcmDcd: "0"+(userResult[0]+1), // 여신금융상담소비자구분코드
            //   lfncHlasDcd: "0"+(userResult[3]+1),// 여신금융상담보유자산구분코드
            //   lfncEnprPsntIncmDcd: "0"+(userResult[4]+1),// 여신금융상담기업현재소득구분코드
            //   lfncFtrAntcAnicDcd: "0"+(userResult[5]+1),// 여신금융상담미래예상연간소득구분코드
            //   lfncLbltDcd: "0"+(userResult[6]+1),// 여신금융상담고정지출구분코드
            //   lfncFxngExpdDcd: "0"+(userResult[7]+1),// 여신금융상담고정지출구분코드
            //   lfncOvduDcd: "0"+(userResult[8]+1),// 여신상담연체구분코드
            //   lfncCrdtScrCnfaYn: (userResult[9]===0?"N":"Y"),// 신용점수확인여부
            //   lfncRepmWayDcd: "0"+(userResult[10]+1),   // 여신금융상담변제방법구분코드
            //   lfncCrdtScrVainDcd: userCrdScr==="KCB"?"02":"01",// 여신금융상담신용점수평가기관구분코드
            //   innfGthrCosnYn: "Y",// 개인정보수집동의여부
            // };
            setShowLoading(true);
            callOpenApi(API.PREJUDGE.SUITTEST_SBNTPOPYVRFC, 
              params, 
              (res)=> {
                setShowLoading(false);
                console.log(res);
                if(res.data.RSLT_DATA.resultYn === "Y") {
                  navigate(PathConstants.PREJUDGE_DATACOLLECT);
                }else {
                  //에러
                  // navigate(PathConstants.SERVICE_ERROR);
                }
              }
            );
          }
        }}
      
      />
    }
    {showLoading&&
      <div className="loading"></div>
    }
    </>
  );

}

/**
 * 라디오박스 컴포넌트(적정성 적합성용)
 * @param {} props 
 * @returns 
 */
function RadioComponent(props) {
  const objRadioData = props.radioData;
  const styleFormGroup = props.styleFormGroup;
  
  return (
    <>
      {
        objRadioData.radioList.map((data, idx)=>{
          return (
            <div key={`sRadio${objRadioData.id}_${data.id}`} className={styleFormGroup}>
              <label className="form-radio">
                <input 
                  ref={(el)=>{
                    if(idx === 0) props.radioRef.current[objRadioData.id]=el;
                    //console.log(data + "EL>>", props.radioRef);
                  }}
                  type="radio" 
                  name={`sRadio${objRadioData.id}`} 
                  id={`sRadio${objRadioData.id}_${data.id}`} 
                  value="" 
                  checked={(props.checked === data.id) ? true : false}
                  disabled={props.isDisabled ? true : false}
                  onChange={(e)=>{
                    props.onChangeFn(data.id);
                  }}
                />
                  <span className="radio"></span>{data.value}
              </label>
            </div>
          )
        })
      }
    </>
  );
}

/**
 * 빈값 밸리데이션 체크
 * 빈값일시 항목별 title, 조사, 동사로 메세지값 완성
 * @param {사용자 체크값} userResult 
 * @param {선택한 신용기관} userCrdBru 
 * @param {입력한 신용점수} userCrdScr 
 * @returns 
 */
function validCheckEmpty(agreeYn, userResult, userCrdBru, userCrdScr, inputRef) {

  let msg = "";
  let verb = "하시기 바랍니다.";
  //inputRef.current.focus();
  if(agreeYn === 'N') {return "동의여부를 확인 바랍니다.";}
  for(let i=0; i<userResult.length; i++) {
    if((userResult[i] !== 0 && !userResult[i]) || userResult[i] === 99) {
      console.log(i+"밸리데이션 체크", userResult)
      let josa = "";
      if (checkBatchimEnding(suitTestData[suitTestData.findIndex((data) => data.id === i)].title)) {
        josa = "을 ";
      } else {
        josa = "를 ";
      }
      if (i == 1 || i == 11) {
        verb = "입력" + verb;
      } else {
        verb = "선택" + verb;
      }
      msg = suitTestData[suitTestData.findIndex((data) => data.id === i)].title + josa + verb;
      inputRef.current[i].focus();
      return msg;
    }else if(i === 9) {
      console.log()
      if(userResult[i] === 0) {
        if(!userCrdBru) {
          inputRef.current[i].focus();
          return "신용기관을 선택하시기 바랍니다.";
        }else if(!userCrdScr) {
          inputRef.current[i].focus();
          return "신용점수를 입력하시기 바랍니다.";
        }else if(userCrdScr > 999 || userCrdScr < 1) {
          inputRef.current[i].focus();
          return "신용점수를 정확히 입력하시기 바랍니다.";
        }
      }
    }
  }
  return null;
}

export default SuitTest;
