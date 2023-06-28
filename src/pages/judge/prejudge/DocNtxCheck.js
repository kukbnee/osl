import { useRef } from "react";
import { useEffect } from "react";
import { useState, useLayoutEffect } from "react";
import { useInterval } from "../../../modules/common/hook/useInterval";
import { callOpenApi, callLocalApi } from "../../../modules/common/tokenBase";
import OslBtn from "../../../modules/components/OslBtn";
import OslHeader from "../../../modules/components/OslHeader";
import API from "../../../modules/constants/API";
import { useNavigate } from "react-router";
import PathConstants from "../../../modules/constants/PathConstants";

/**
 * 컴포넌트명 : 서류통지확인 및 재통지
 * 설명
 * 서류통지 확인 api 호출
 * 통지 안된 서류 재통지
 * @param {*} props
 * props항목별 설명
 */
function DocNtxCheck(props) {

  //api통신 중 로딩띄우기
  const [showLoading, setShowLoading] = useState(false);
  //서류항목별 통지여부(전체여부, 항목별 여부)
  const [ntxList, setNtxList] = useState([{scpgScsYn: "N"},{scpgScsYn: "N"},{scpgScsYn: "N"},{scpgScsYn: "N"},{scpgScsYn: "N"},{scpgScsYn: "N"},{scpgScsYn: "N"},{scpgScsYn: "N"},{scpgScsYn: "N"},{scpgScsYn: "N"}]);
  //다음버튼 활성/비활성
  const [disabledYn, setDisabledYn] = useState(true);
  //모두 완료 여부 N: 모두완료 Y: 하나이상 미완료
  const [flrYn, setFlrYn] = useState("");
  //통지 여부 체크 성공여부
  const [ntxCheckYn, setNtxCheckYn] = useState(false);

  const navigate = useNavigate(); //다음화면을 위한 navigate

  useLayoutEffect(()=>{
    callOpenApi(
      API.PREJUDGE.DOCNTXCHECK_SCPGNTX,
      {scpgNo: "ALL"},
      (res)=> {
        setShowLoading(false);
        console.log("scpgNtx", res.data);
        if(res.data.RSLT_DATA.resultYn === "Y") {
          scpgNtxCheck();
        }
      },
      (err)=> {
        console.log("SCPGNTX_ERR", err);
      }
    )
  })


  const scpgNtxCheck = ()=> {
    setShowLoading(true);
    callOpenApi(
      API.PREJUDGE.DOCNTXCHECK_NOFCGTLNDOCSMYNINQ,
      {},
      (res)=> {
        setShowLoading(false);
        console.log("scpgNtxCheck", res.data);
        if(res.data.RSLT_DATA.flrYn === "Y") {
          //[todo]브라우저인증서
          navigate(PathConstants.CERTIFICATE_SIGN);
        }else if(res.data.RSLT_DATA.flrYn === "N"){
          navigate(PathConstants.CERTIFICATE_SIGN);
        }
      },
      (err)=> {
        console.log("SCPGNTXCHECK_ERR", err);
        //[todo]통지화면
        //navigate(PathConstants.PREJUDGE_DOCTXCHECK);
      }
    )   
  }

  //통지 재 전송
  //   const scpgNtx = ()=> {
  //   callOpenApi(
  //     API.PREJUDGE.GRTINFOINPUT_SCPGNTX,
  //     {scpgNo: "ALL"},
  //     (res)=> {
  //       scpgNtxCheck();
  //     },
  //     (err)=> {
  //       console.log("SCPGNTX_ERR", err);
  //     }
  //   ) 
  // }
  

  // useInterval(()=> {
  //   console.log("interval>>", flrYn);
  //   console.log("scpgList>>>>>", ntxList);
  //   if(flrYn !== "Y") {
  //     callOpenApi(
  //       API.PREJUDGE.DOCNTXCHECK_NOFCGTLNDOCSMYNINQ,//API.PREJUDGE. 11개 통지 여부,
  //       {},
  //       (res)=> {
  //         setShowLoading(false);
  //         console.log("통지전송확인", res.data);
  //         setFlrYn(res.data.RSLT_DATA.scpgFnsgYn);
  //         if(res.data.RSLT_DATA.flrYn === "Y") {
  //           setNtxCheckYn(true);
            
  //         }
  //         setNtxList(res.data.RSLT_DATA.nofcDocInfoList);
  //         delay.current = null;
  //         //모두 통지 완료일때 N
  //         //하나이상 통지 안됐을때 Y
  //         //서류항목 별 완료여부
  //       },
  //       (err)=> {
  //         console.log("통지전송확인에러", err);
  //       }
  //     );
  //   }
  // }, delay.current);



  function cbOslBtn() {
    console.log("전자서명 go");
  }

  return (
    <>
      <OslHeader headerNm={props.headerNm} />
      {
      ntxList.length >= 10?
      <div className="container">
          <div className="content-body">
            <div className="content-top pad-b30">         
              <p className="top-tit"><strong>신용보증기금에 서류를 보내는 중 입니다.</strong></p>
              <span className="fs18"><img src="../assets/img/common/IBK_Kodit_loding2.gif" alt="인터넷 납세서비스 Home tax" width={400}/></span>
            </div>
            {/* <div className="scrap-wrap">
              <ul className="scrapping">
                <NtxList scpgScsYn={flrYn} ntxList={ntxList} />
                <li>
                  <div className="box-chk flex">
                    <p className="box-left">사업자등록증명</p>
                    
                    <p className="box-right">{ntxList[1].scpgScsYn === "N"?<span className="sending sm-txt">통지중</span>:<span className="sm-txt">통지완료</span>}</p>
                  </div>
                </li>
                <li>
                  <div className="box-chk flex">
                    <p className="box-left">
                      부가가치세 과세표준증명
                      <span className="sm-txt">(면세사업자 수입금액증명)</span>
                    </p>
                    <p className="box-right">{(ntxList[2].scpgScsYn === "N" &&  ntxList[3].scpgScsYn === "N") ?<span className="sending sm-txt">통지중</span>:<span className="sm-txt">통지완료</span>}</p>
                  
                  </div>
                  
                </li>
                <li>
                  <div className="box-chk flex">
                    <p className="box-left">부가세신고서</p>
                    <p className="box-right">{ntxList[4].scpgScsYn === "N"?<span className="sending sm-txt">통지중</span>:<span className="sm-txt">통지완료</span>}</p>
                  </div>
                </li>
                <li>
                  <div className="box-chk flex">
                    <p className="box-left">매입매출처별세금계산서 합계표</p>
                    <p className="box-right">{ntxList[5].scpgScsYn === "N"?<span className="sending sm-txt">통지중</span>:<span className="sm-txt">통지완료</span>}</p>
                  </div>
                </li>
                <li>
                  <div className="box-chk flex">
                    <p className="box-left">표준재무제표증명</p>
                    <p className="box-right">{ntxList[6].scpgScsYn === "N"?<span className="sending sm-txt">통지중</span>:<span className="sm-txt">통지완료</span>}</p>
                  </div>
                </li>
                <li>
                  <div className="box-chk flex">
                    <p className="box-left">납세증명서(국세)</p>
                    <p className="box-right">{ntxList[7].scpgScsYn === "N"?<span className="sending sm-txt">통지중</span>:<span className="sm-txt">통지완료</span>}</p>
                  </div>
                </li>
                <li>
                  <div className="box-chk flex">
                    <p className="box-left">납세증명서(지방세)</p>
                    <p className="box-right">{ntxList[8].scpgScsYn === "N"?<span className="sending sm-txt">통지중</span>:<span className="sm-txt">통지완료</span>}</p>
                  </div>
                </li>
                <li>
                  <div className="box-chk flex">
                    <p className="box-left">4대사회보험료완납증명서</p>
                    <p className="box-right">{ntxList[9].scpgScsYn === "N"?<span className="sending sm-txt">통지중</span>:<span className="sm-txt">통지완료</span>}</p>
                  </div>
                </li>
                <li>
                  <div className="box-chk flex">
                    <p className="box-left">주민등록등본</p>
                    <p className="box-right">{ntxList[10].scpgScsYn === "N"?<span className="sending sm-txt">통지중</span>:<span className="sm-txt">통지완료</span>}</p>
                  </div>
                </li>
                <li>
                  <div className="box-chk flex">
                    <p className="box-left">주민등록초본</p>
                    <p className="box-right">{ntxList[11].scpgScsYn === "N"?<span className="sending sm-txt">통지중</span>:<span className="sm-txt">통지완료</span>}</p>
                  </div>
                </li>
              </ul>
            </div> */}
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
      :<div className="loading"></div>
      }
    </>
  )
}

function NtxList(props) {
  console.log("NtxList>>>", props.ntxList);
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
    props.ntxList.map((data, idx)=> {
      return(
        <li>
          <div className="box-chk flex">
            <p className="box-left">{!scMapping[data.scpgDcd]}</p>
            <p className="box-right">{props.scpgScsYn === "N"?<span className="sending sm-txt">통지중</span>:<span className="sm-txt">통지완료</span>}</p>
          </div>
        </li>
      );
    })
  );

}
export default DocNtxCheck;