import axios from 'axios';
import { useLayoutEffect, useState } from 'react';
import { isEdge } from 'react-device-detect';
import { useNavigate } from 'react-router';
import Stepper from 'react-stepper-enhanced/lib/Stepper';
import { callLocalApi, callOpenApi, isState } from '../../modules/common/tokenBase';
import OslBtn from '../../modules/components/OslBtn';
//import { Card } from 'react-bootstrap';

import OslHeader from '../../modules/components/OslHeader';
import API from '../../modules/constants/API';
import collectData from '../../modules/constants/collectData';
import PathConstants from '../../modules/constants/PathConstants';
import request from '../../modules/utils/Axios';

const progressFootMsgData = collectData("progressFootMsg");
/**
 * 컴포넌트명: 진행상태
 * 설명 :
  

 * @param {*} props 
 * 
 * @returns 
 */
function Progress(props) {

  //osl진행상태
  const [progState, setProgState] = useState(props.progState);
  const [loapAmt, setLoapAmt] = useState(0);
  //전문 진행상태
  const [pgrsData, setPgrsData] = useState({});
  //진행상태화면 상단 progressbar className
  const [procing, setProcing] = useState(["", "", ""]);
  //하단문구
  const [arrFootMsg, setArrFootMsg] = useState([]);
  //api통신 중 로딩띄우기
  const [showLoading, setShowLoading] = useState(false);

  useLayoutEffect(()=> {
    console.log("layout progState", progState);
    setShowLoading(true);
    //if(!progState) {
      isState((ingInfo)=> {
        setProgState(ingInfo.loapPstcd);
      },
      (err)=> {
        console.log("상태조회실패>>", err);
      });
    //}
    
  }, []);

  useLayoutEffect(()=> {
        callOpenApi(
          API.COMMOM.LOAPSTTSINQ,
          {},
          (res)=> {
            setShowLoading(false);
            if(res.data.STATUS === "0000") {
              console.log("@@@@@@@@")
              setPgrsData(res.data.RSLT_DATA);
            }
          }
        )
  }, [progState])

  useLayoutEffect(()=> {
    console.log("pgrsData", pgrsData);
    if(pgrsData.cttrYn === "Y") {       //사전심사 서류작성 진행중 이어하기 버튼 페이지
      setProcing(["ing", "", ""]);
    }else if(pgrsData.pgrsScd === "21") { //대출실행 완료
      setProcing(["", "", "complete"]);
    }else if(pgrsData.pgrsScd === "02") { //사전심사 접수 완료
      setProcing(["ing", "", ""]);
      setArrFootMsg([...progressFootMsgData.find((data, idx)=> data.name === "PREJUDGE_APPLY_COMPLETE_FOOT_MSG").msg]);
    }else if(pgrsData.pgrsScd === "14") { //사전심사 거절
      setProcing(["ing", "", ""]);
      setArrFootMsg([...progressFootMsgData.find((data, idx)=> data.name === "PREJUDGE_REJECT_FOOT_MSG").msg]);
    }else if(pgrsData.pgrsScd === "61") { //보증심사 진행중
      setProcing(["", "ing", ""]);
      //setPgrsData({...pgrsData, lastLoapAmt: loapAmt});
      setArrFootMsg([...progressFootMsgData.find((data, idx)=> data.name === "GRTJUDGE_ING_FOOT_MSG").msg]);
    }else if(pgrsData.pgrsScd === "63") { //보증심사 거절
      setProcing(["", "ing", ""]);
      //setPgrsData({...pgrsData, lastLoapAmt: loapAmt});
      setArrFootMsg([...progressFootMsgData.find((data, idx)=> data.name === "GRTJUDGE_REJECT_FOOT_MSG").msg]);
    }else if(pgrsData.pgrsScd === "64") { //보증심사 완료 보증 확인및 대출실행 버튼
      setProcing(["", "complete", ""]);
      setArrFootMsg([...progressFootMsgData.find((data, idx)=> data.name === "GRTJUDGE_COMPLETE_FOOT_MSG").msg]);
      console.log("64일때 pgrsData.loapPstcd",);
      //progState 02, pgrsData.pgrsSsc 64일때 받아온 loapPstcd(03)으로 업데이트
      // if(progState !== pgrsData.loapPstcd && !!pgrsData.loapPstcd) {
      //   setProgState(pgrsData.loapPstcd);
      // }
    }
    
    // if(stateCd === "사전심사거절") {
    //   setProcing(["ing", "", ""]);
    //   setArrFootMsg([...progressFootMsgData.find((data, idx)=> data.name === "PREJUDGE_REJECT_FOOT_MSG").msg]);
    //   rejectReason = "";
    // }else if(stateCd === "사전심사접수완료") {
    //   setProcing(["ing", "", ""]);
    //   setArrFootMsg([...progressFootMsgData.find((data, idx)=> data.name === "PREJUDGE_APPLY_COMPLETE_FOOT_MSG").msg]);
    // }else if(stateCd === "보증심사진행중") {
    //   setProcing(["", "ing", ""]);
    //   setArrFootMsg([...progressFootMsgData.find((data, idx)=> data.name === "GRTJUDGE_ING_FOOT_MSG").msg]);
    // }else if(stateCd === "보증심사거절") {
    //   setProcing(["", "ing", ""]);
    //   setArrFootMsg([...progressFootMsgData.find((data, idx)=> data.name === "GRTJUDGE_REJECT_FOOT_MSG").msg]);
    //   rejectReason = "";
    // }else if(stateCd === "보증심사완료") {
    //   setProcing(["", "complete", ""]);
    //   setArrFootMsg([...progressFootMsgData.find((data, idx)=> data.name === "GRTJUDGE_COMPLETE_FOOT_MSG").msg]);
    // }else {
    //   setProcing(["", "", "complete"]);
    //   //tobe:그냥 완료"tit-nowrap"  상환및 청약철회""
    //   setStyleInfoWrap(" tit-nowrap");
    // }
  }, [pgrsData]);

  function cbOslBtn() {
    
  }
  return (
    <>
      {(!!props.headerNm)&&<OslHeader headerNm={props.headerNm}/>}
      <div className="container">
        <div className="content">
          <div className="content-body pad-b0">
            {/* <div className="c-tit01">1.사전심사 신청과 수신</div> */}
            <div className="section pad-t30">
              <div className="process-wrap">
                <ol className="process-h">
                  <li className={procing[0]}>사전심사</li>
                  <li className={procing[1]}>보증신청</li>
                  <li className={procing[2]}>대출실행</li>
                </ol>
                
                {pgrsData.cttrYn==="Y"&&<>
                  <p className="txt-result"><b>사전심사</b>를 위해<br/><b>서류 작성 진행중</b> 입니다.
                  </p>
                  <MidBtn pgrsData={pgrsData}/>
                </>}
                {pgrsData.pgrsScd==="02"&&<>
                  <p className="txt-result"><b>사전심사 접수</b>가<br /><b>완료</b>되었습니다.
                  </p>
                  <ul class="txt-msg list-type05">
                    <li>사전심사 결과 조회는 당일, 진행 가능 여부는 수일 내 결정하여 통지 드릴 예정이며 네이버 톡톡과 휴대폰 문자메시지로 알려드립니다.</li>
                  </ul>
                </>}
                {pgrsData.pgrsScd==="14"&&<>
                  <p className="txt-result">
                    <b>사전심사 조건</b>을<br /><b>충족하지 않았습니다.</b>    
                  </p>
                  <RejReason rejectReason={pgrsData.snbcRsnCon} />
                </>}
                {pgrsData.pgrsScd==="61"&&<>
                  <p className="txt-result">
                    <b>보증 심사</b>가 <b>진행중</b>입니다.
                  </p>
                  <GrtPrejudgeInfo pgrsData={pgrsData} />
                </>}
                {pgrsData.pgrsScd==="63"&&<>
                  <p className="txt-result">
                    <b>보증 심사 조건</b>을<br /><b>충족하지 않았습니다.</b>
                  </p>
                  <GrtPrejudgeInfo pgrsData={pgrsData} />
                </>}
                {(pgrsData.pgrsScd==="64")&&<>
                  <p className="txt-result">
                    <b>보증 심사</b>가<br /><b>완료</b>되었습니다.
                  </p>
                  <MidBtn pgrsData={pgrsData} progState= {progState}/>
                </>}
                {(pgrsData.pgrsScd==="21")&&<>
                  <p className="txt-result">
                    <b>대출 실행</b>이<br /><b>완료</b>되었습니다.
                  </p>
                </>}
                
                {
                  arrFootMsg.length > 0&&
                    <FooterMsg arrFootMsg={arrFootMsg} procing={procing}/>
                }
              </div>
            </div>
            {
              pgrsData.pgrsScd === "21"&&
                <CompleteStateInfo />
            }
          </div>
        </div>
      </div>
      {showLoading&&
      <div className="loading"></div>
      }
    </>
    

  )
}

function StateInfo(props) {
  let styleWrap = "";
  return (
    
    <div className="info-wrap pad-t0 pad-b20">
      {/* { todo: data받아오면 해당 loop로 적용하고 테스트
        props.stateInfoList.map((data, idx)=> {
          data.nm?예상보증료
          return (
            <div className="info-box">
              <span className="tit fc-gray">{data.nm}</span>
              <span className={`txt fc-dark ta-r`}>{data.value}<span className="fs14 fc-lightGray ta-r">추가될값</span></span>
            </div>
          )
        })
      } */}
      <div className="info-box">
          <span className="tit fc-gray">신청일자</span>
          <span className="txt fc-dark ta-r">2021.06.22</span>
      </div>
      <div className="info-box">
          <span className="tit fc-gray">대출금액</span>
          <span className="txt fc-dark ta-r">30,450,000원</span>
      </div>
      <div className="info-box">
          <span className="tit fc-gray">대출이자</span>
          <span className="txt fc-dark ta-r">0.00%<br /><span className="fs14 fc-lightGray ta-r">(기준금리 0.00% + 가산금리 0.00%)</span></span>
      </div> 
      <div className="info-box">
          <span className="tit fc-gray">대출 실행일</span>
          <span className="txt fc-dark ta-r">2021.07.02</span>
      </div>
      <div className="info-box">
          <span className="tit fc-gray">거치기간 만료일</span>
          <span className="txt fc-dark ta-r">2022.07.02</span>
      </div>
      <div className="info-box">
          <span className="tit fc-gray">대출 만료일</span>
          <span className="txt fc-dark ta-r">2026.07.02</span>
      </div>
      <div className="info-box">
          <span className="tit fc-gray">이자지급시기</span>
          <span className="txt fc-dark ta-r">매월 10일</span>
      </div>
        
    </div>
    
  )
}

function CompleteStateInfo(props) {
  return (
    <div className="section pad-0 pad-t30">
      <div className="box-cont">
          <div className="b-title">대출 상태</div>
          <div className="b-txt pad-b0">
              <div className="info-wrap pad-b0 tit-nowrap">
                {/* { todo: data받아오면 해당 loop로 적용하고 테스트
                  props.completeStateInfoList.map((data, idx)=> {
                    data.nm?예상보증료
                    return (
                      <div className="info-box">
                        <span className="tit fc-gray">{data.nm}</span>
                        <span className={`txt fc-dark ta-r`}>{data.value}<span className="fs14 fc-lightGray ta-r">추가될값</span></span>
                      </div>
                    )
                  })
                } */}
                  <div className="info-box">
                      <span className="tit fc-gray">신청일자</span>
                      <span className="txt fc-dark ta-r">{props.pgrsData.aplcYmd}2021.06.22</span>
                  </div>
                  <div className="info-box">
                      <span className="tit fc-gray">대출금액</span>
                      <span className="txt fc-dark ta-r">{props.pgrsData.loexAmt}30,450,000원</span>
                  </div>
                  <div className="info-box">
                      <span className="tit fc-gray">대출이자</span>
                      <span className="txt fc-dark ta-r">{props.pgrsData.aplyInr}0.00%<br /><span className="fs14 fc-lightGray ta-r">({props.pgrsData.bscIrt}% + {props.pgrsData.spreInr}%)</span></span>
                  </div> 
                  <div className="info-box">
                      <span className="tit fc-gray">대출 실행일</span>
                      <span className="txt fc-dark ta-r">{props.pgrsData.loexYmd}2021.07.02</span>
                  </div>
                  <div className="info-box">
                      <span className="tit fc-gray">거치기간 만료일</span>
                      <span className="txt fc-dark ta-r">{props.pgrsData.dfteExpiYmd}2022.07.02</span>
                  </div>
                  <div className="info-box">
                      <span className="tit fc-gray">대출 만료일</span>
                      <span className="txt fc-dark ta-r">{props.pgrsData.loepYmd}2026.07.02</span>
                  </div>
                  <div className="info-box">
                      <span className="tit fc-gray">이자지급시기</span>
                      <span className="txt fc-dark ta-r">{props.pgrsData.itpmDd}매월 10일</span>
                  </div>
                  
              </div>
          </div>
      </div>
  </div>
  )
}

function RejReason(props) {
  
  return (
    <div className="info-wrap reject">
      <div className="info-box">
        <span className="tit fc-gray">거절사유</span>
        <span className="txt fc-dark ta-r">{props.rejectReason}</span>
      </div>
    </div>
  )
}

function GrtPrejudgeInfo(props) {
  return (
    <div className="info-wrap pad-t0 pad-b20 tit-nowrap">
      {props.pgrsData.pgrsScd === "61" &&<>
      <div className="info-box">
          <span className="tit fc-gray">대출 신청금액</span>
          <span className="txt fc-dark ta-r">{props.pgrsData.frstLoapAmt}1원</span>
      </div>
      {/* <div className="info-box">
          <span className="tit fc-gray">예상 대출금액</span>
          <span className="txt fc-dark ta-r">{props.pgrsData}30,000,000원</span>
      </div> */}
      <div className="info-box">
          <span className="tit fc-gray">예상 보증금액</span>
          <span className="txt fc-dark ta-r">{props.pgrsData.gnapAmt}원</span>
      </div>
      <div className="info-box">
          <span className="tit fc-gray">예상 보증료</span>
          <span className="txt fc-dark ta-r">{props.pgrsData.antcInsnChg}150,000원({props.pgrsData.antcGrfrRt}5.00%)</span>
      </div>
      <div className="info-box">
          <span className="tit fc-gray">담당 영업점</span>
          <span className="txt fc-dark ta-r">{props.pgrsData.mngmBrm}을지로</span>
      </div>
      {/* <div className="info-box">
          <span className="tit fc-gray">담당자(연락처)</span>
          <span className="txt fc-dark ta-r">{props.pgrsData}김담당<br />(010-1234-1234)</span>
      </div> */}</>
      }
      {props.pgrsData.pgrsScd === "63" &&<>
        <div className="info-box">
          <span className="tit fc-gray">신청 일자</span>
          <span className="txt fc-dark ta-r">{props.pgrsData.aplcYmd}2022. 06. 23</span>
        </div>
        <div className="info-box">
            <span className="tit fc-gray">신청 금액</span>
            <span className="txt fc-dark ta-r">{props.pgrsData.frstLoapAmt}30,000,000원</span>
        </div>
        <div className="info-box">
            <span className="tit fc-gray">담당 영업점</span>
            <span className="txt fc-dark ta-r">{props.pgrsData.mngmBrm}을지로</span>
        </div>
        {/* <div className="info-box">
            <span className="tit fc-gray">담당자(연락처)</span>
            <span className="txt fc-dark ta-r">김담당<br />(010-1234-1234)</span>
        </div> */}
      </>}
    </div>
  )
}

function FooterMsg(props) {
  
  return (
    <ul className={`txt-msg list-type05${props.procing[1]==="complete"&& " pad-t20"}`}>
      {
        props.arrFootMsg.map((data,idx)=> {
          return (
            <li key={`ftMsg${idx}`}>{data}</li>
          )
        })
        
      }
    </ul>
  )
}

function MidBtn (props) {
  console.log("midbtn", props.progState);
  let btnNm = "";
  let naviPath = "";
  if(props.pgrsData.pgrsScd === "01") {
    naviPath = PathConstants.PREJUDGE_DATACOLLECT;
    btnNm = "이어가기";
  }else {
    if(props.progState === "10" && props.pgrsData.pgrsScd === "64") {
      //보증승인내역
      naviPath = PathConstants.LONEXECUTE_APPRINFO;
    }
    // else if(props.progState === "04") {
    //   naviPath = PathConstants.LONEXECUTE_APPLYINFOINPUT;
    // }else if(props.progState === "05") {
    //   naviPath = PathConstants.LONEXECUTE_FINANCECUSLAW;
    // }else {
      
    // }
    btnNm = "보증 확인 및 대출 실행";
  }
  let navigate = useNavigate();
  return (
  <>
    {/* <div className="info-wrap pad-t0 pad-b20 tit-nowrap">
      <div className="info-box">
          <span className="tit fc-gray">승인일</span>
          <span className="txt fc-dark ta-r">2021.07.23</span>
      </div>
    </div> */}
    <button type="button" className="btn btn-lg default-bg" onClick={()=> {navigate(naviPath)}}>
        <span className="txt">{btnNm}</span>
    </button>
  </>
  )
}

export default Progress;