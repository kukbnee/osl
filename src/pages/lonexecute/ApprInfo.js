import { useEffect, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import OslHeader from "../../modules/components/OslHeader";
import OslBtn from "../../modules/components/OslBtn";
import Loading from "../../modules/components/Loading";
import AlertModal from "../../modules/components/AlertModal";
import collectData from "../../modules/constants/collectData";
import { callOpenApi,  callLocalApi } from "../../modules/common/tokenBase";
import { getCommaAmt, getDotYmd } from "../../modules/utils/util";
import PathConstants from "../../modules/constants/PathConstants";
import API from "../../modules/constants/API";

/**
 * 컴포넌트명 : 보증 승인 내역
 * 설명 : 대출 실행 보증 승인 내역
 * @param {*} props
 * props항목별 설명
 * process
 * 조회 gratDtliq
 * 유효성검사 grnyVldtVrfc
 * 약관동의화면 이동
 */
function ApprInfo(props) {

  const VALID_MSG = [
    "신청하신 보증승인유효기간이 만료 되었습니다.\n자세한내용은 거래영업점 또는 고객센터(1588-2588)에 문의해주시기바랍니다.",
    "지금은 이용가능시간이 아닙니다.\n은행영업일 09:00~16:00에 다시 신청해주세요.",
    "대출신청을 위해서는 기업은행계좌가 필요합니다.\n계좌개설버튼을 선택하시면 안내 SMS를 보내드립니다."
  ]
  //보증승인내역 여부
  const [resStatus, setResStatus] = useState("");
  //보증승인정보 조회 데이터
  const [apprInfoData, setApprInfoData] = useState({});
  //alert 띄우기위한 함수 및 변수
  function openPop() {
    setShowAlert(true);
    document.body.style.overflow = "hidden";
  }
  function closePop() {
    setShowAlert(false);
    document.body.style.overflow = "";
  }
  const [showAlert, setShowAlert] = useState(false);
  const handleShow = ()=> openPop();
  const handleClose = ()=> closePop();
  const [alertMsgCont, setAlertMsgCont] = useState("");
  
  const [showBtnAlert, setBtnShowAlert] = useState(false);

  
  useLayoutEffect(()=> {
    callOpenApi(
      API.LONEXECUTE.APPRINFO_GRATDTLIQ, 
      {}, 
      (res)=> {

        setResStatus(res.data.STATUS);
        setApprInfoData(res.data.RSLT_DATA);
      }
    );

  }, []);

  useEffect(()=> {
    console.log("resStatus", resStatus);
  }, [resStatus]);

  useEffect(()=> {
    console.log("apprInfoData>>", apprInfoData);
  }, [apprInfoData]);

  let navigate = useNavigate();

  function cbOslBtn() {
    
    callOpenApi(
      API.LONEXECUTE.APPRINFO_GRNYVLDTVRFC,
      {},
      (res)=> {
         //보증승인유효기간
        if(res.data.RSLT_DATA.gratVlteExpyYn !== "Y") {
          setAlertMsgCont(VALID_MSG[0]);
          handleShow();
        }
        //영업일여부 이용시간여부
        // else if(res.data.RSLT_DATA.hlddYn !== "Y" && res.data.RSLT_DATA.chaEntHourYn !== "Y") {
        //   setAlertMsgCont(VALID_MSG[1]);
        //   handleShow();
        //   setBtnNm("확인")
        // }
        else if(res.data.RSLT_DATA.chaEntHourYn !== "Y") {
          setAlertMsgCont(VALID_MSG[1]);
          handleShow();
        }
        //계좌개설여부
        else if(res.data.RSLT_DATA.achlYn !== "Y") {
          setAlertMsgCont(VALID_MSG[2]);
          setBtnShowAlert(true);
        }
        //유효성 검증 성공일시 
        else {
          navigate(PathConstants.LONEXECUTE_UNTACTAGRM);
        }
      }
    )
    
  }

  if(resStatus === "0000") {
    return (
      <>
      <OslHeader headerNm={props.headerNm} />
      <div className="container">
        <div className="content">
          <div className="content-body">
            <div className="content-top line-be4">
              <p className="top-tit"><strong>보증 승인 정보 확인 후 대출을 <br /> 실행해 주세요.</strong></p>
            </div>

            <section className="section line-tf4">
              <div className="info-wrap">
                <div className="info-box">
                  <span className="tit fc-gray">기업명</span>
                  <span className="txt fc-dark ta-r">{apprInfoData.entpNm}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">대표자명</span>
                  <span className="txt fc-dark ta-r">{apprInfoData.rpprNm}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">보증기업</span>
                  <span className="txt fc-dark ta-r">{apprInfoData.grnyNm}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">보증서 발급금액</span>
                  <span className="txt fc-dark ta-r">{getCommaAmt(apprInfoData.loanScdlAmt).slice(0,-4)}원</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">보증서 발급일</span>
                  <span className="txt fc-dark ta-r">{getDotYmd(apprInfoData.grnyIssuYmd)}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">보증서 만기일</span>
                  <span className="txt fc-dark ta-r">{getDotYmd(apprInfoData.grnyExpiYmd)}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">담당 영업점</span>
                  <span className="txt fc-dark ta-r">{apprInfoData.brm}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">예상보증료율</span>
                  <span className="txt fc-dark ta-r">{apprInfoData.antcGrfrRt.slice(0,-4)}%</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">대출실행기한</span>
                  <span className="txt fc-dark ta-r">{getDotYmd(apprInfoData.lodlYmd)}</span>
                </div>
              </div>
            </section>

            <section className="section list-wrap line-tf4">
              <ul className="bullet-type02 mar-l10">
                <li className="item fc-gray">
                  <span>대출 실행 기한 이내에 대출 실행을 완료해 주시기 바랍니다. 경과 시 보증 인은 자동 취소됩니다.</span>
                </li>
                <li className="item fc-gray">
                  <span>보증 승인 후 신용관리대상정보 등재, 휴폐업, 연체, 보증사고 등 불량사유 발생 시 대출 실행이 불가할 수 있습니다.</span>
                </li>
                <li className="item fc-gray">
                  <span>보증료는 대출 실행 시점에 따라 변경될 수 있습니다.</span>
                </li>
              </ul>
              <p className="txt fw-b fc-dark ta-c">이 보증서로 대출을 실행하시겠습니까?</p>
            </section>
          </div>
          <OslBtn
            obj={{
              type: "button",
              disabled: false,
              text: ["대출 실행"],
              link: "",
              callbackId: cbOslBtn
            }} />
        </div>
      </div>
      {showAlert&&
        <AlertModal
          show={showAlert}
          msg={alertMsgCont}
          btnNm={["확인"]}
          onClickFn={(btnIdx)=> {
            handleClose();
          }}
        />}
        {showBtnAlert&&
          <AlertModal
            show={showBtnAlert}
            msg={alertMsgCont}
            btnNm={["계좌개설"]}
            onClickFn={(btnIdx) => {
              callOpenApi(
                API.LONEXECUTE.APPRINFO_SENDACNTSMS,
                {},
                (res)=> {
                  console.log(res.data.RSLT_DATA);
                  setBtnShowAlert(false);
                }
              )
            }}
          />}
      </>
    )
  }else if(resStatus.indexOf("99") > -1){
    return (
      <>
      <OslHeader headerNm={props.headerNm} />
      <div className="container">
        <div className="content">
          <div className="content-body approval-empty">
            <div className="content-top">
              <p className="top-tit">대출 실행 <b>가능한 보증서</b><br /><b>내역이 없습니다.</b></p>
            </div>
            <div className="section line-tf4">
              <p className="fs18 lh30">* 보증승인 관련한 자세한 사항은 IBK 고객센터 또는 가까운 영업점으로 문의해 주시기 바랍니다.</p>
            </div>
          </div>
          <div className="content-footer">
            <button type="button" className="btn btn-lg default-bg" onClick={()=> {navigate(PathConstants.MAIN)}}>
              <span className="txt">확인</span>
            </button>
          </div>
        </div>
      </div>
      </>
    );
  }else {
    return (
      <Loading />
    )
  }


}

export default ApprInfo;