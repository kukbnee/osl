import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import OslBtn from "../../modules/components/OslBtn";
import OslHeader from "../../modules/components/OslHeader";
import collectData from "../../modules/constants/collectData";
import FullModal from "../../modules/components/FullModal";
import { callOpenApi,  callLocalApi } from "../../modules/common/tokenBase.js"
import PathConstants from "../../modules/constants/PathConstants";
import API from "../../modules/constants/API";

/**
 * 컴포넌트명 : 대출 약관 동의
 * 설명
 * @param {*} props
 * props항목별 설명
 * process
 * 약관 저장 achlYnInq
 * 인증화면 이동
 */
const untactAgrmData = collectData("UntactAgrm");

function UntactAgrm(props) {

  //하단 동의하기버튼명
  const ALL_BTN_NM = "모두 동의하고 다음";
  const ONE_BTN_NM = "동의하고 다음";

  const [checkItems, setCheckItems] = useState([99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99]);

  const [arrPdfData, setArrPdfData] = useState([]);

  const [userResult, setUserResult] = useState([99, 99, 99, 99, 99, 99, 99, 99]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show, setShow] = useState(false);

  const [idxData, setIdxData] = useState(0);

  let navigate = useNavigate();

  const [agreeBtnNm, setAgreeBtnNm] = useState(ALL_BTN_NM); //동의버튼명 state
  const [disabledYn, setDisabledYn] = useState(false); //동의버튼활성화여부 state

  //로딩 show/hide
  const [showLoading, setShowLoading] = useState(false);

  //체크상태로 밸리데이션체크 겸 버튼상태변경 및 다음화면이동 
  useEffect(() => {
    console.log("useEffect[checkItems]", checkItems);
    if (checkItems.filter((data) => data !== 99 && data !== 0).length === 17 && agreeBtnNm === ALL_BTN_NM) { //모두동의하고 다음 클릭 > 팝업 확인 > 모두체크상태
      //다음화면이동
      //navigate(PathConstants.PREJUDGE_SUITTEST);
      callApiFn();
    } else if (checkItems.find((data) => data !== 99 && data !== 0) && (!!checkItems.find((data) => data === 99) || checkItems.findIndex((data) => data === 0) > -1)) { //한개이상 체크 및 한개이상 체크해제상태
      setAgreeBtnNm(ONE_BTN_NM);
      setDisabledYn(true);
    } else if (checkItems.filter((data) => data === 0 || data === 99).length === 17) { // 모두 해제상태 및 초기상태
      setAgreeBtnNm(ALL_BTN_NM);
      setDisabledYn(false);
    } else { //모두체크 상태
      setAgreeBtnNm(ONE_BTN_NM);
      setDisabledYn(false);
    }
  }, [checkItems]);

  const callApiFn = ()=> {
    setShowLoading(true);
    callOpenApi(
      API.LONEXECUTE.UNTACTAGRM_ACHLYNINQ,
      // {dcffStplId: ["10010","10011","10012","10013","10014","10015","10016"]},
      {dcffStplId: checkItems.filter((data)=> typeof data !== "number" && data != "1")},
      (res)=> {
        setShowLoading(false);
        if(res.data.RSLT_DATA.resultYn === "Y") {
          navigate(PathConstants.CERTIFICATE_SIGN, {state: {loanDcd : "untactAgrm"}});
        }
        
      }
    );
  };

  function cbOslBtn() {
    if (agreeBtnNm === ALL_BTN_NM) { //모두동의하고다음
      setArrPdfData(untactAgrmData);
      handleShow(true);
    } else { //동의하고다음
      callApiFn();
    }
  }

  return (
    <>
      <OslHeader headerNm={props.headerNm} />
      <div className="container">
        <div className="content">
          <div className="content-body">
            <div className="content-top">
              <p className="top-tit"><span className="fw-b">신규 대출신청</span>을 위해 다음<br />
                <span className="fw-b">항목에 동의</span>해 주세요
              </p>
            </div>
            <div className="section line-tf4">
              <div className="agree-form">
                {untactAgrmData.map(function (data, idx) {
                  {
                    if (data.type === "pdf") {
                      return (
                        <p key={`p-${idx}`} className="box-chk">
                          <input
                            type="checkbox"
                            key={`agree-terms-${data.id}`}
                            name="agree_terms"
                            checked={checkItems[idx] === 99 ? false : checkItems[idx] === 0 ? false : true
                              // (checkItems[idx] === 99)? :(checkItems[idx]===1)?setIsChecked(true):setIsChecked(false)
                            }
                            id={idx}
                            className="check-input blind"
                            onChange={(e) => {
                              if (checkItems[idx] != 99) {
                                let copy = [...checkItems];
                                copy[idx] = copy[idx] === 0 ? data.dcffStplId : 0;
                                setCheckItems(copy);
                              }
                            }}
                          />
                          <label htmlFor={idx} className="check-label">{data.title}</label>
                          <a data-id=""
                            className="btn-pop-arrow"
                            onClick={() => {
                              setArrPdfData([untactAgrmData[data.id]]);
                              handleShow(true);
                              //모달창에서 확인 버튼 누를시 전체 동의 로직 만들어야함
                            }}
                          />

                        </p>

                      )
                    }
                  }
                })}
              </div>
            </div>
            <div className="mid-tit">
              <p className="point-tit">신청 전 유의사항을 꼭 확인해주세요</p>
            </div>
            <div className="section line-tf4">
              <div className="agree-form">
                <ContentList data={untactAgrmData}
                  checkItems={checkItems}
                  setCheckItems={setCheckItems}
                  userResult={userResult}
                  setUserResult={setUserResult} 
                />
              </div>
            </div>
            <OslBtn
              obj={{
                type: "button",
                disabled: disabledYn,
                text: [agreeBtnNm],
                link: "",
                callbackId: cbOslBtn
              }} />
          </div>
        </div>
      </div>
      {show &&
        <FullModal
          showYn={show}
          handleClose={handleClose}
          headerNm="약관 동의"
          content={arrPdfData}
          type="pdf"
          disabledYn={true}
          footerNm="확인"
          onClickFn={(contId) => {
            console.log(contId, typeof contId)
            if (typeof contId === "number") {
              let copy = [...checkItems];
              copy[contId] = untactAgrmData[contId].dcffStplId;
              setCheckItems(copy);
            } else {
              setCheckItems(
                [untactAgrmData[0].dcffStplId,
                untactAgrmData[1].dcffStplId,
                untactAgrmData[2].dcffStplId,
                untactAgrmData[3].dcffStplId,
                untactAgrmData[4].dcffStplId,
                untactAgrmData[5].dcffStplId,
                untactAgrmData[6].dcffStplId,
                untactAgrmData[7].dcffStplId,
                1, 1, 1, 1, 1, 1, 1, 1, 1]);
            }

          }}
        />
      }
      {showLoading&&
        <div className="loading"></div>
      }
    </>
  )
}



function ContentList(props) {

  const titleData = props.data;

  return (
    <>
      {titleData.map(function (data, idx) {
        if (data.type === "check") {
          return (
            <React.Fragment key={idx}>
              <p className="box-chk"
                key={`box-chk1-${data.id}`}>
                <input type="checkbox"
                  name="agree_terms_11"
                  id={idx}
                  className="check-input blind"
                  checked={props.checkItems[data.id]===99?false:props.checkItems[data.id]===0?false:true}
                  onChange={(e) => {
                    let copy = [...props.checkItems];
                    copy[idx] = copy[idx] === 99 || copy[idx] === 0 ? 1 : 0;
                    props.setCheckItems(copy);
                  }} />
                <label htmlFor={idx} className="check-label no-pop">{data.title}</label>
              </p>
              <div className="box-chk-add">
                <ul className="dash-list">
                  <li>{data.content}</li>
                </ul>
              </div>
            </React.Fragment>
          )
        } else if (data.type === "check1") {
          return (
            <React.Fragment key={idx}>
              <p className="box-chk" key={`box-chk2-${data.id}`}>
                <input type="checkbox"
                name="agree_terms_11"
                id={idx}
                className="check-input blind"
                checked={props.checkItems[data.id]===99?false:props.checkItems[data.id]===0?false:true}
                onChange={(e) => {
                  let copy = [...props.checkItems];
                  copy[idx] = copy[idx] === 99 || copy[idx] === 0 ? 1 : 0;
                  props.setCheckItems(copy);
                }}/>
                <label htmlFor={idx} className="check-label no-pop">{data.title}</label>
              </p>
              <div className="box-chk-add">
                <ul className="dash-list">
                  <li>{data.contentList[0].content1}</li>
                  <li>{data.contentList[1].content2}</li>
                </ul>
              </div>
            </React.Fragment>
          )
        }
      })}
    </>
  )
}



export default UntactAgrm;