import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import OslHeader from "../../../modules/components/OslHeader";
import OslBtn from "../../../modules/components/OslBtn";
import PathConstants from "../../../modules/constants/PathConstants";
import { callOpenApi,  callLocalApi } from "../../../modules/common/tokenBase";
import API from "../../../modules/constants/API";
import { useInterval } from "../../../modules/common/hook/useInterval";
import AlertModal from "../../../modules/components/AlertModal";
import { useLayoutEffect } from "react";

/**
 * 화면명 : 서류제출
 * 설명
 * @param {*} props
 * props항목별 설명
 */
function DocStatus(props) {

  //모두 완료 여부 N: 모두완료 Y: 하나이상 미완료
  const [flrYn, setFlrYn] = useState("");
  //스크래핑 항목별 수집상태
  const [docStatus, setDocStatus] = useState([false,false,false,false,false,false,false,false,false,false,false]);
  //다음버튼 활성여부 true로 돌려놔야댐
  const [disabledYn, setDisabledYn] = useState(true);
  //서류 상태 
  const [scpgList, setScpgList] = useState([]);
  //alert팝업 show/hide
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [msgCont, setMsgCont] = useState("");
  //모두 재전송 버튼 활성여부
  const [retry,setRestry] = useState(false);

  const delay = useRef(1000);
  //미수집내역 있을시 찾음
  function isSpace(e)  {
    if(e.scpgInqDcd === "")  {

      return e.scpgDcd;
    }
  }
  useInterval(()=> {
    console.log("interval>>", flrYn);
    console.log("scpgList>>>>>", scpgList);
    if(flrYn !== "Y") {
      //서류수집 상태 조회
      callOpenApi(
        API.PREJUDGE.DOCSTATUS_SCPGPGRSHSTINQ,
        {},
        (res)=> {
          console.log(res.data.RSLT_DATA);
          let arrScpg = res.data.RSLT_DATA.scpgList;
          setFlrYn(res.data.RSLT_DATA.scpgFnsgYn);
          //if(arrScpg.findIndex((data, idx)=> data.scpgScsYn === "N") === -1) setFlrYn("Y");
          setScpgList(res.data.RSLT_DATA.scpgList);
          
          delay.current = 10000;
        }
      )
    }
  }, delay.current);

  // useLayoutEffect(()=> {
  //     //서류수집 상태 조회
  //     callOpenApi(
  //       API.PREJUDGE.DOCSTATUS_SCPGPGRSHSTINQ,
  //       {},
  //       (res)=> {
  //         console.log(res.data.RSLT_DATA);
  //         let arrScpg = res.data.RSLT_DATA.scpgList;
  //         setFlrYn(res.data.RSLT_DATA.scpgFnsgYn);
  //         setScpgList(res.data.RSLT_DATA.scpgList);

  //         const spaceArr = arrScpg.filter(isSpace);         
  //         let copy = [...docStatus];
  //         copy[0] = spaceArr[0].scpgDcd;
  //         copy[1] = spaceArr[1].scpgDcd;
  //         copy[2] = spaceArr[2].scpgDcd;
  //         copy[3] = spaceArr[3].scpgDcd;
  //         copy[4] = spaceArr[4].scpgDcd;
  //         copy[5] = spaceArr[5].scpgDcd;
  //         copy[6] = spaceArr[6].scpgDcd;
  //         copy[7] = spaceArr[7].scpgDcd;
  //         copy[8] = spaceArr[8].scpgDcd;
  //         copy[9] = spaceArr[9].scpgDcd;
  //         copy[10] = spaceArr[10].scpgDcd;
  //         setDocStatus(copy);
  //       }
  //     )
  // }, []);

  useEffect(()=> {
    if(flrYn === "N") {
      setDisabledYn(true);
      return ()=> setFlrYn("");
    }else if(flrYn === "Y") {
      //차주검증
      callOpenApi(
        API.PREJUDGE.DOCSTATUS_DBTOVRFC,
        {},
        (res)=> {
          // 전체검증여부
          // res.data.RSLT_DATA.vrfcYn;
          if(res.data.RSLT_DATA.opbsDyYn === "N" // 개업일 검증 여부
            && res.data.RSLT_DATA.jntEsnnYn === "N" // 공동사업자 여부
            && res.data.RSLT_DATA.nttxDlpmYn === "N" // 국세 체납 여부
            && res.data.RSLT_DATA.lctxDlpmYn === "N") { // 지방세 체납 여부
            //모두 완료, 버튼 활성화
            setDisabledYn(false);
            const spaceArr = scpgList.filter(isSpace);         
          let copy = [...docStatus];
          copy[0] = spaceArr[0].scpgDcd;
          copy[1] = spaceArr[1].scpgDcd;
          copy[2] = spaceArr[2].scpgDcd;
          copy[3] = spaceArr[3].scpgDcd;
          copy[4] = spaceArr[4].scpgDcd;
          copy[5] = spaceArr[5].scpgDcd;
          copy[6] = spaceArr[6].scpgDcd;
          copy[7] = spaceArr[7].scpgDcd;
          copy[8] = spaceArr[8].scpgDcd;
          copy[9] = spaceArr[9].scpgDcd;
          copy[10] = spaceArr[10].scpgDcd;
          setDocStatus(copy);
          }else {
            setMsgCont("차주검증에 실패하였습니다.\n당일은 해당대출을 진행이 불가합니다.");
            handleShow();
          }
        },
        (err)=> {

        }
      )
      
    }

  }, [flrYn]);

  useEffect(()=> {
    
      console.log("scpgList>>", scpgList);
    
  }, [scpgList]);


  let navigate = useNavigate();

  function cbOslBtn() {
    navigate(PathConstants.PREJUDGE_CUSTINFOINPUT);
  }

  //미수집내역 있을시 찾음
  function requestScpg(e)  {
    if(e !== false)  {
      setDisabledYn(false);
      return e;
    }
  }

  function callSpaceScpg() {
    console.log("callSpaceScpg", docStatus);
    const rqstDcd = docStatus.filter(requestScpg)
    console.log(rqstDcd, "asdfadsfhuadsfuqwjeaiflasdjf")
    navigate(PathConstants.CERTIFICATE_SCRP, {
      state: {rqstDcd : rqstDcd}
    });
  }

  return (
    <>
      <OslHeader headerNm={props.headerNm} />
      {scpgList.length >= 10?
      <div className="container">
        <div className="content">
          <div className="content-body diagnosis">
            <div className="content-top pad-b30">
              <p className="top-tit"><strong>아직 전송되지 않은 서류</strong>가 있습니다.
                서류 수집 내역을 확인해주세요.</p>
              <p className="top-txt fc-6">
                전체 서류가 전송완료인 경우에만 다음화면 진행이 가능합니다.
              </p>
              <div className="mar-t40">
                <button type="button" disabled={retry} className="btn btn-sm btn-default" onClick={()=>{
                  callSpaceScpg()
                }}>
                  <span className="txt">모두 재전송</span>
                </button>
              </div>
            </div>
            <div className="scrap-wrap">
              <ul className="scrapping">    
                <ScrpList scpgScsYn={flrYn} scpgList={scpgList} docStatus={docStatus}/> 
                
              </ul>
            </div>
          </div>
          <OslBtn
            obj={{
              type: "button",
              disabled: disabledYn,
              text: ["다음"],
              link: "",
              callbackId: cbOslBtn
            }} />
        </div>
      </div>
      :<div className="loading"></div>
      }
      {show &&
        <AlertModal
          show={show}
          msg={msgCont}
          btnNm={["확인"]}
          onClickFn={() => {
            handleClose();
            if(msgCont.indexOf("실패") > -1) {
              setMsgCont("");
              navigate(PathConstants.GUIDE_DETAIL);
            }
            
          }}
        />
      }
    </>
  )
}

function ScrpList(props) {
  console.log("SCRPLIST>>>", props.scpgList);
  	// 780000 : 사업자등록 증명원 -> S1
		// 780002 : 부가가치세과세표준증명원 -> S1
		// 780004 : 면세사업자수입금액증명원 -> S2
		// 780006 : 부가세신고서 -> S3
		// 780008 : 부가가치매입매출합계표 -> S4
		// 780010 : 표준재무제표 -> S6
		// 780012 : 국세납세증명서 -> S7
		// 780014 : 지방세납세증명서 -> S8
		// 780016 : 4대보험완납증명서 -> S9
		// 780018 : 주민등록등본 -> SA
		// 780020 : 주민등록초본 -> SB
  const scMapping = {
    S1: "사업자등록 증명원",
    S2: "부가가치세과세표준증명원",
    S3: "면세사업자수입금액증명원",
    S4: "부가세신고서",
    S5: "부가가치매입매출합계표",
    S6: "표준재무제표",
    S7: "국세납세증명서",
    S8: "지방세납세증명서",
    S9: "4대보험완납증명서",
    SA: "주민등록등본",
    SB: "주민등록초본"
  }

  return(
    <>
      <li>
        <div className="box-chk flex">
          <p className="box-left">사업자등록증명</p>
          <p className="box-right">{props.scpgList[0].scpgInqDcd === "" ? <span className="sending sm-txt">미수집</span> : <span className="sm-txt">전송완료</span>}</p>
        </div>
      </li>
      <li>
        <div className="box-chk flex">
          <p className="box-left">부가가치세 과세표준증명<br/>(면세사업자 수입금액증명)</p>
          <p className="box-right">{props.scpgList[1].scpgInqDcd === "" ? <span className="sending sm-txt">미수집</span> : <span className="sm-txt">전송완료</span>}</p>
        </div>
      </li>
      <li>
        <div className="box-chk flex">
          <p className="box-left">부가세신고서</p>
          <p className="box-right">{props.scpgList[2].scpgInqDcd === "" ? <span className="sending sm-txt">미수집</span> : <span className="sm-txt">전송완료</span>}</p>
        </div>
      </li>
      <li>
        <div className="box-chk flex">
          <p className="box-left">매입매출처별세금계산서 합계표</p>
          <p className="box-right">{props.scpgList[3].scpgInqDcd === "" ? <span className="sending sm-txt">미수집</span> : <span className="sm-txt">전송완료</span>}</p>
        </div>
      </li>
      <li>
        <div className="box-chk flex">
          <p className="box-left">표준재무제표증명</p>
          <p className="box-right">{props.scpgList[4].scpgInqDcd === "" ? <span className="sending sm-txt">미수집</span> : <span className="sm-txt">전송완료</span>}</p>
        </div>
      </li>
      <li>
        <div className="box-chk flex">
          <p className="box-left">납세증명서(국세)</p>
          <p className="box-right">{props.scpgList[5].scpgInqDcd === "" ? <span className="sending sm-txt">미수집</span> : <span className="sm-txt">전송완료</span>}</p>
        </div>
      </li>
      <li>
        <div className="box-chk flex">
          <p className="box-left">납세증명서(지방세)</p>
          <p className="box-right">{props.scpgList[6].scpgInqDcd === "" ? <span className="sending sm-txt">미수집</span> : <span className="sm-txt">전송완료</span>}</p>
        </div>
      </li>
      <li>
        <div className="box-chk flex">
          <p className="box-left">4대사회보험료완납증명서</p>
          <p className="box-right">{props.scpgList[7].scpgInqDcd === "" ? <span className="sending sm-txt">미수집</span> : <span className="sm-txt">전송완료</span>}</p>
        </div>
      </li>
      <li>
        <div className="box-chk flex">
          <p className="box-left">주민등록등본</p>
          <p className="box-right">{props.scpgList[8].scpgInqDcd === "" ? <span className="sending sm-txt">미수집</span> : <span className="sm-txt">전송완료</span>}</p>
        </div>
      </li>
      <li>
        <div className="box-chk flex">
          <p className="box-left">주민등록초본</p>
          <p className="box-right">{props.scpgList[9].scpgInqDcd === "" ? <span className="sending sm-txt">미수집</span> : <span className="sm-txt">전송완료</span>}</p>
        </div>
      </li>
    </>
  );

}

export default DocStatus;