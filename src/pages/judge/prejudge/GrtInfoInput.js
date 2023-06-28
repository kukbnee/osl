/** 
 * import 순서
 * react hook, custom hook, 
 * external component(module), 
 * internal component(module), 
 * data, 
 * css
 */
/**
 * 화면명 : 보증심사자료 작성
 * 설명
 * @param {*} props
 * props항목별 설명
 */

import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router";
import OslBtn from "../../../modules/components/OslBtn.js";
import OslHeader from "../../../modules/components/OslHeader.js";
import PathConstants from "../../../modules/constants/PathConstants.js";
import collectData from "../../../modules/constants/collectData.js";
import FullModal from "../../../modules/components/FullModal.js";
import RadioInlineComponent from "../../common/RadioInlineComponent";
import TitleComponent from "../../common/TitleComponent";
import SelectComponent from "../../common/SelectComponent";
import TextComponent from "../../common/TextComponent";
import AlertModal from "../../../modules/components/AlertModal";
import { useDaumPostcodePopup } from "react-daum-postcode";
import API from "../../../modules/constants/API.js";
import request from "../../../modules/utils/Axios";
import { callOpenApi,  callLocalApi, isState } from "../../../modules/common/tokenBase";
import { getYear } from "../../../modules/utils/util.js";
import { delay } from "q";

const grtInfoData = collectData("GrtInfoInput");
//현재 104/GrnyExntDatWrtn postCode 데이터 입력 안할시 넘어가게 해놓음 추후 처리필요


function GrtInfoInput(props) {
  const [userResult, setUserResult] = useState([99, 99, 99, 99, 99, 99, 99, 99, 99, '5', 99, 99]); //결과값 저장 state
  const [paramResult, setParamResult] = useState([99, 99, 99, 99, 99, 99, 99, 99, 99, '5', 99, 99]); //결과값 저장 state
  const [disabledYn, setDisabledYn] = useState(true);
  const [agreeYn, setAgreeYn] = useState(false);
  //밸리데이션 성공여부
  const [valiYn, setValiYn] = useState(false);
  //보증심사자료 등록 성공여부
  const [inputYn, setInputYn] = useState(false);
  //스크래핑 통지 성공여부
  const [ntxYn, setNtxYn] = useState(false);
  const navigate = useNavigate(); //다음화면을 위한 navigate
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [comshow, setComShow] = useState(false);
  const comHandleShow = () => setComShow(true);
  const comHandleClose = () => setComShow(false);
  const [showPost, setShowPost] = useState(false);
  const postHandleShow = () => setShowPost(true);
  const postHandleClose = () => setShowPost(false);
  const [postCd, setPostCd] = useState("");
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");
  const [msgCont, setMsgCont] = useState("");
  const [visible, setVisible] = useState(false);
  //api통신 중 로딩띄우기
  const [showLoading, setShowLoading] = useState(false);
  const [errshow, setErrShow] = useState(false);
  const errhandleClose = () => setErrShow(false);
  const errhandleShow = () => setErrShow(true);

  //**항목별 데이터 분리 */
  const arrTitleData = [];
  grtInfoData.find((data) => {
    if(data.title.indexOf("전기") > -1) arrTitleData.push(getYear()-2 + "년 매출액(원)");
    else if(data.title.indexOf("당기") > -1) arrTitleData.push(getYear()-1 + "년 매출액(원)");
    else arrTitleData.push(data.title);
    
  });
  const arrRadioData = [];
  grtInfoData.find((data) => {
    if (data.type === "radio") {
      arrRadioData.push(data);
    }
  });
  const arrTextData = [];
  grtInfoData.find((data) => {
    if (data.type === "text") {
      arrTextData.push(data);
    }
  });
  
  const arrSeleectData = [];
  grtInfoData.find((data) => {
    if (data.type === "select") {
      arrSeleectData.push(data);
    }
  });
  const arrSearchData = [];
  grtInfoData.find((data) => {
    if (data.type === "search") {
      arrSearchData.push(data);
    }
  });

  useEffect(() => {
    setParamResults("radio");
    // setParamResults("select");
    // setParamResults("text");
    //빈값체크하고 버튼 활성화/비활성화
    console.log(userResult);
    let validCheckIdx = userResult.findIndex((data, idx) => data === 99 || data === "");
    if (validCheckIdx === -1 && agreeYn) {
      setDisabledYn(false);
    }else if(validCheckIdx === 3 && agreeYn) {
      if(userResult[2] === 0) {
        if([userResult[8], userResult[10], userResult[11]].findIndex((data)=> data !== 99 && data !== "") > -1) {
          setDisabledYn(false);
        }else {
          setDisabledYn(true);
        }
      }else {
        setDisabledYn(true);
      }
    }else {
      console.log("밸리실패");
      setDisabledYn(true);
    }
  }, [userResult, agreeYn]);

  useEffect(() => {
  }, [agreeYn]);

  useEffect(() => {
    if(valiYn) {
      saveGrtInfoInput();
    }
  }, [valiYn]);

  // useEffect(()=> {
  //   if(inputYn) {
  //     //[todo]스크래핑내용통지
  //     scpgNtx();
  //   }
  // }, [inputYn]);

  // useEffect(()=> {
  //   if(ntxYn) {
  //     //[todo]스크래핑내용통지확인
  //     scpgNtxCheck();
  //   }
  // }, [ntxYn]);

  useEffect(()=> {
    console.log("파람리절트", paramResult);
  }, [paramResult]);

  // popup
  function openPop() {
    setShow(true);
    document.body.style.overflow = "hidden";
  }
  function closePop() {
    setShow(false);
    document.body.style.overflow = "";
  }

  const setParamResults = (type)=> {
    for(let idx=0; idx<grtInfoData.length; idx++) {
      
      if(grtInfoData[idx].type === type && userResult[idx] !== 99) {
        console.log("setParamResults>>>", grtInfoData[idx]);
        let copy = [...paramResult];
        copy[idx] = grtInfoData[idx].radioList.find((data)=> userResult[idx] === data.id).dbVal;
        console.log("setParamResults dbval>>>" + userResult[idx], grtInfoData[idx].radioList.find((data)=> userResult[idx] === data.id).dbVal);
        setParamResult(copy);
        //setParamResult(grtInfoData[idx].radioList.find((data)=> userResult[idx] === data.id));
      }
    }
  }

  const saveGrtInfoInput = () => {
    /*
    {
	"bsunOnrRlcd": "01",  주 사업장 소유자
	"bsunRgifYn": "N",  주 사업장관리침해여부(최근1년이내)
	"iruTrthRsplAdrYn ": "Y", 주민등록상실제거주지주소여부
	"iruAdpaOwnDcd": "01",  주민등록상주소지본인소유코드
	"rshsOwrRlcd": "01",  거주주택소유자관계코드
	"rshsExHspsYn": "N",  본인 혹은 배우자 명의로 실거주 외 주택보유여부
	"rshsRgifYn": "N",  거주주택권리침해여부
	"frstLoapAmt":"1000000000", 고객이 신청한 대출신청금액
	"loanTrmCnt":"5", 대출기간 단위코드(년, 월, 일, 주)에 따라 대출기간 년수, 월수, 일수 등이 적용되는 기간
	"loteUncd":"Y", 대출기간 단위에 다른 분류 코드, D 일 M 월 S 특정일자 Y 년
	"bsunZpcd":"",
	"bsunRdnd":"",
	"bsunRdnmDtad":"",
	"rshsRdnd":"",  거주주택도로명주소
	"rshsRdnmDtad":"",  거주주택도로명상세주소
	"rshsZpcd":"",  거주주택우편번호
	"elgrExntElctAmslBaseYy": "2021", 전기매출년도
	"elgrExntPrprAmslAmt": "450000000", 전기매출금액
	"elgrExntCrtrAmslBaseYy": "2022", 당기매출년도
	"elgrExntCrtrAmslAmt": "550000000"  당기매출금액
}
    */
   
    const params = {
      
    };

    console.log("params > ", params);

    //보증심사자료 저장
    //[TODO]전자서명해시값 받은후 -> 전자서명 필요(인증서) -> 보증신청 연동 필요
    setShowLoading(true);
    callOpenApi(
      API.PREJUDGE.GRTINFOINPUT_GRNYEXTDATWRTN,
       {
        bsunOnrRlcd: paramResult[0],  //주 사업장 소유자
        bsunRgifYn: paramResult[1],  //주 사업장관리침해여부(최근1년이내)
        iruTrthRsplAdrYn : paramResult[2], //주민등록상실제거주지주소여부
        iruAdpaOwnDcd: paramResult[4],  //주민등록상주소지본인소유코드
        rshsOwrRlcd: paramResult[5],  //거주주택소유자관계코드
        rshsExHspsYn: paramResult[6],  //본인 혹은 배우자 명의로 실거주 외 주택보유여부
        rshsRgifYn: paramResult[7],  //거주주택권리침해여부
        frstLoapAmt: paramResult[8], //고객이 신청한 대출신청금액
        loanTrmCnt: paramResult[9], //대출기간 단위코드(년, 월, 일, 주)에 따라 대출기간 년수, 월수, 일수 등이 적용되는 기간
        loteUncd: "Y", //대출기간 단위에 다른 분류 코드, D 일 M 월 S 특정일자 Y 년
        rshsRdnd: addr1,  //거주주택도로명주소
        rshsRdnmDtad: addr2,  //거주주택도로명상세주소
        rshsZpcd: postCd,  //거주주택우편번호
        elgrExntElctAmslBaseYy: (getYear()-2).toString(), //전기매출년도
        elgrExntPrprAmslAmt: paramResult[10], //전기매출금액
        elgrExntCrtrAmslBaseYy: (getYear()-1).toString(), //당기매출년도
        elgrExntCrtrAmslAmt: paramResult[11]  //당기매출금액주소
       },
      (res)=> {
        //0000 아닐시로 변경
        setShowLoading(false);
        console.log(res);
        if(res.data.STATUS === "0000") {
          navigate(PathConstants.PREJUDGE_DOCTXCHECK);
        }else if(res.data.STATUS === "9999"){
          errhandleShow();
          setMsgCont("사용량이 많아 현재 처리가 원할하지 않으니 처음부터 다시 시도 해주시기 바랍니다."); 
        }
        
          //진행상태 이동
        // navigate(PathConstants.MAIN,  {
        //   state: {
        //     tabIdx: 21 //진행상태
        //   }
        // })
        
      },
      (err)=> {
        //[todo]등록이되지않았습니다
        //alert(err);
      }
    )
  }

  // const scpgNtx = ()=> {
  //   setShowLoading(true);
  //   callOpenApi(
  //     API.PREJUDGE.GRTINFOINPUT_SCPGNTX,
  //     {scpgNo: "ALL"},
  //     (res)=> {
  //       setShowLoading(false);
  //       console.log("scpgNtx", res.data);
  //       if(res.data.RSLT_DATA.resultYn === "Y") {
  //         setNtxYn(true);
  //       }
  //     },
  //     (err)=> {
  //       console.log("SCPGNTX_ERR", err);
  //     }
  //   )
    
  // }
  
  // const scpgNtxCheck = ()=> {
  //   setShowLoading(true);
  //   callOpenApi(
  //     API.PREJUDGE.DOCNTXCHECK_NOFCGTLNDOCSMYNINQ,
  //     {},
  //     (res)=> {
  //       setShowLoading(false);
  //       console.log("scpgNtxCheck", res.data);
  //       if(res.data.RSLT_DATA.flrYn === "Y") {
  //         //[todo]브라우저인증서
  //         //navigate(PathConstants.CERTIFICATE_SIGN);
  //       }else {
  //         //[todo]통지화면
  //         navigate(PathConstants.PREJUDGE_DOCTXCHECK);
  //       }
  //     },
  //     (err)=> {
  //       console.log("SCPGNTXCHECK_ERR", err);
  //       //[todo]통지화면
  //       //navigate(PathConstants.PREJUDGE_DOCTXCHECK);
  //     }
  //   )
    
  // }

  function cbOslBtn() {
    let lonAmt = userResult[8];
    let lonAmtTmp = Math.floor(lonAmt % 1000000)
    lonAmt = Math.floor(lonAmt / 1000000) * 1000000;
    console.log(msgCont, lonAmt);
    if (lonAmt < 10000000) {
      setMsgCont("대출 희망 금액은 최소 1천만부터 입력가능합니다.");
      handleShow();
    } else if (lonAmtTmp != 0) {
      setMsgCont("1백만원 단위로 입력 가능합니다.");
      handleShow();
    } else if (lonAmt > 100000000) {
      setMsgCont("대출 희망금액은 최대 1억원까지 입력가능합니다.");
      handleShow();
    } else if(!userResult[10] || !userResult[11] || userResult[10] === 99 || userResult[11] === 99 || userResult[10] === "0" || userResult[11] === "0") {
      setMsgCont("매출액을 입력해주세요.");
      handleShow();
    } else {
      setValiYn(true);
    }

    //GrtInfoInput();
  }


  useEffect(()=> {
    let copy = [...userResult];
    console.log(postCd);
    console.log(addr1)
    console.log(addr2)
    if(!!postCd && !!addr1 && !!addr2.trim()) {
      copy[3] = "Y";
    }else {
      copy[3] = 99;
    }
    setUserResult(copy);
  }, [postCd, addr1, addr2])

  // const saveGrtInfoInput = async () => {

  //   const res = await request({
  //     method: "post",
  //     url: API.PREJUDGE.PREJUDGE_GRTINFOINPUT,
  //     data: {
  //       bsunOwrRlcd: userResult[0], // 주사업장소유자
  //       bsunRgifDcd: userResult[1], // 주사업장관리침해
  //       rshsOwrRlcd: userResult[5], //거주주택소유자
  //       rshsRgifDcd: userResult[7], //거주주택권리침해
  //       // lastLoapAmt: "5000000", //대출희망금액
  //       // loanTrmCnt: "5", //대출기간
  //       rshsRdnd: addr1, //거주주택도로명주소
  //       rshsRdnmDtad: addr2, //거주주택상세주소
  //       rshsZpcd: postCd, // 거주주택우편번호

  //       bsunZpcd: "",
  //       bsunRdnd: "",
  //       bsunRdnmDtad: "",

  //     }
  //   })
  //     .then((response) => {
  //       console.log(response)
  //       return response;
  //     })

  //     .catch((error) => {
  //       console.log("error : ", error);
  //     });
  // }


  return (
    <>
      <OslHeader headerNm={props.headerNm} />
      <div className="container">
        <div className="content">
          <div className="content-body">
            <div className="content-top pad-b30">
              <p className="top-tit"><strong>조사 자료 자가체크를</strong> 위해<br />
                <strong>확인해야할 내용</strong>이 있습니다.</p>
            </div>

            <div className="section line-tf4">
              <ol className="sele-list type02 pad-b10">
                {grtInfoData.map((data, idx) => {
                  return (
                    <li key={`li_${idx}`} className="item">
                      <TitleComponent
                        showYn={(idx === 3 && userResult[2] === 1) ? true : (idx !== 3) ? true : false}
                        title={arrTitleData[idx]}
                        styleTxt="txt"
                      />
                      {(data.type === "radio" &&
                        <>
                          <RadioInlineComponent
                            showYn={true}
                            radioData={arrRadioData[data.radioId]}
                            styleSeleList={`sele-list type01 radius answer-wrap`}
                            checked={userResult[idx]}
                            onChangeFn={(radioIdx) => {
                              //console.log("온체인지", data.radioList.find((rData)=> rData.dbVal === userResult[idx]).id);
                              console.log(userResult[idx]);
                              
                              let copy = [...userResult]
                              //copy[data.id] = data.radioList[radioIdx].dbVal;
                              copy[data.id] = radioIdx;
                              setUserResult(copy);
                            }}
                          />

                        </>
                      )}
                      {(data.type === "search" &&
                        <Search arrSearchData={arrSearchData} userResult={userResult} setVisible={setVisible} postHandleShow={postHandleShow}
                        setAddr1={setAddr1} setAddr2={setAddr2} setPostCd={setPostCd} addr1={addr1} addr2={addr2} postCd={postCd}
                        />
                      )}
                      {
                        (data.type === "text") &&
                        <TextComponent
                          showYn={true}
                          styleSeleList="sele-list type01 radius answer-wrap"
                          styleInput="w100p ta-r"
                          textData={arrTextData[data.textId]}
                          inputType={data.placeholder.indexOf("숫자") > -1 ? "number" : "text"}
                          onChangeFn={(value) => {
                            let copy = [...userResult];
                            copy[data.id] = value === 0 ? 99 : value;
                            setUserResult(copy)
                            let copy2 = [...paramResult]
                            copy2[data.id] = value === 0 ? 99 : value;
                            setParamResult(copy2);

                          }}

                        />
                      }
                      {
                        (data.type === "select") &&
                        <SelectComponent
                          showYn={true}
                          selectData={arrSeleectData[data.selectId]}
                          styleSeleList="sele-list type01 radius answer-wrap"
                          onChangeFn={(value) => {
                            let copy = [...userResult];
                            copy[data.id] = value;
                            setUserResult(copy);
                            let copy2 = [...paramResult]
                            copy2[data.id] = value;
                            setParamResult(copy2);
                          }}
                        />
                      }
                    </li>
                  )
                })}



              </ol>
              <div className="terms-wrap mar-t30">
                <div className="txt-wrap bg-gray">
                  <p className="info-con-txt mar-t0">* 대출 희망금액은 최대 1억원까지 입력 가능하며, 보증기관 심사과정에서 금액이 변동 될 수 있습니다.</p>
                  <p className="info-con-txt mar-t0">* 최소 신청 희망금액은 1천만원이며, 1백만원 단위로 입력 가능합니다.</p>
                  <p className="info-con-txt mar-t0">* 한도조회 이후 보증 신청 시 사업자등록증 상 주소로 사업장 현장실사 예정입니다.</p>
                </div>

                <div className="ui-cont-wrap flex">
                  <div className="ui-decide">
                    <input type="checkbox" id="checkbox01" value={agreeYn} onChange={() => { setAgreeYn(!agreeYn) }}
                    />
                    <label htmlFor="checkbox01" className="input-label">윤리 경영 실천 및 보증브로커 피해예방을 위한 협조 확약 등</label>
                  </div>
                  <div className="ui-pop">
                    <a data-id="" className="btn-pop-arrow" title="윤리 경영 실천 및 보증브로커 피해예방을 위한 협조 확약 등" onClick={() => comHandleShow()}><span className="blind">윤리 경영 실천 및 보증브로커 피해예방을 위한 협조 확약 등</span></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <OslBtn obj={{
            type: "button",
            disabled: disabledYn,
            text: ["확인"],
            link: "",
            callbackId: cbOslBtn
          }} />


        </div>
        {comshow &&
          <FullModal
            showYn={comshow}
            handleClose={comHandleClose}
            headerNm=""
            footerNm="닫기"
            content="GrtInfoInputModal"
            type="component"
            onClickFn={() => {
            }}
          />
        }
        {showPost &&
          <FullModal
            showYn={showPost}
            handleClose={postHandleClose}
            headerNm=""
            footerNm="닫기"
            content=""
            type="post"
          />
        }
      </div>
      {show &&
        <AlertModal
          show={show}
          msg={msgCont}
          btnNm={["확인"]}
          onClickFn={() => {
            setMsgCont("");
            handleClose();
          }}
        />
      }
      {errshow &&
        <AlertModal
        show={errshow}
          msg={msgCont}
          btnNm={["확인"]}
          onClickFn={() => {
            setMsgCont("");
            errhandleClose();
            navigate(PathConstants.GUIDE_DETAIL)
          }}
        />
      }
      {showLoading&&
        <div className="loading"></div>
      }
    </>
  )

}

function Search(props) {
  
  const data = props.arrSearchData;
  

  const showPost = useDaumPostcodePopup();

  const postHandleComplete = (data) => {
    console.log("콜백데이터", data);
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
    props.setPostCd(data.sigunguCode);
    props.setAddr1(fullAddress);
  };

  const postHandleClick = () => {
    showPost({ onComplete: postHandleComplete });
  };


  if (props.userResult[2] === 1) {
    return (
      <div className="sele-list answer-wrap">
        <div className="item">
          <div className="inp-block">
            <input type="text" className="inp type01 disabled w175 address"
              name="text01"
              id="text01_01"
              placeholder=""
              value={props.postCd}
              readOnly
            />
            <button type="button" className="btn btn-md address-btn bg-skyblue"
              onClick={postHandleClick}
            >
              <span className="fc-white fs-18">
                {data[0].title}
              </span>
            </button>
          </div>
          <input type="text" className="inp type01" name="text01" id="text01_02" placeholder="" value={props.addr1} readOnly />
          <input type="text" className="inp type01" name="text01" id="text01_03" placeholder="" value={props.addr2}
          onChange={(e)=>{
            props.setAddr2(e.currentTarget.value)
            
          }}/>
        </div>
      </div>
    )
  } else {
    return null;
  }
}


/**
* 빈값 밸리데이션 체크
* 빈값일시 항목별 title, 조사, 동사로 메세지값 완성
* @param {사용자 체크값} userResult 
* @param {선택한 신용기관} userCrdBru 
* @param {입력한 신용점수} userCrdScr 
* @returns 
*/
function validCheckEmpty(userResult, props) {
  let msgType = "";
  let msg = "";
  let verb = "하시기 바랍니다.";
  for (let i = 0; i < userResult.length; i++) {
    if (!userResult[i] || userResult[i] === 99) {
      let josa = "";
      if (checkBatchimEnding(grtInfoData[grtInfoData.findIndex((data) => data.id === i)].title)) {
        josa = "을 ";
      } else {
        josa = "를 ";
      }
      if (i == 1 || i == 11) {
        verb = "입력" + verb;
      } else {
        verb = "선택" + verb;
      }
      if (userResult[9] < 10000000) {
        return msgType = ("1000")
      }

      msg = grtInfoData[grtInfoData.findIndex((data) => data.id === i)].title + josa + verb;

      return msg;
      return msgType;
    }
  }
  return null;
}

/**
 * 단어별 맞춤 조사 선택을 위한 함수
 * @param {*} word 
 * @returns 
 */
function checkBatchimEnding(word) {
  if (typeof word !== 'string') return null;

  var lastLetter = word[word.length - 1];
  var uni = lastLetter.charCodeAt(0);

  if (uni < 44032 || uni > 55203) return null;

  return (uni - 44032) % 28 != 0;
}


export default GrtInfoInput;