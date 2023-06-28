import { useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import OslBtn from "../../modules/components/OslBtn";
import OslHeader from "../../modules/components/OslHeader";
import { callOpenApi,  callLocalApi } from "../../modules/common/tokenBase";
import { getCommaAmt, getDotYmd } from "../../modules/utils/util";
import PathConstants from "../../modules/constants/PathConstants";
import API from "../../modules/constants/API";

/**
 * 컴포넌트명 : 대출실행결과
 * 설명 : 결과 값에 따라 성공 실패
 * @param {*} props
 * props항목별 설명
 * process
 * 성공 데이터 및 실패사유 조회 loexFnsgInq
 */
function Result(props) {

  const [resultYn, setResultYn] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [resultData, setResultData] = useState({});
  useLayoutEffect(()=> {
    setShowLoading(true);
    callOpenApi(
      API.LONEXECUTE.RESULT_LOEX,
      {},
      (res)=> {
        //[todo]
        //pgrsScd 진행상태 코드
        if(res.data.RSLT_DATA.pgrsScd === "완료") {
          setResultYn("Y");
          //대출정보 데이터
        }else if(res.data.RSLT_DATA.pgrsScd === "실패") {
          setResultYn("N");
          //실패사유 데이터
        }else {
          //로딩
        }
        
        setResultData(res.data.RSLT_DATA);
        setShowLoading(false);
      }
    )

  }, []);

  // if (userResult === true) {
/*
{
        "lastLoapAmtTit": "60000000",
        "loapYmd": "20230201",
        "lastLoapAmt": "",
        "aplyInr": "4.6",
        "baseInr": "2.4",
        "spread": "1.2",
        "loanYmd": "20230223",
        "dfteExpyYmd": "20240223",
        "loapExpire": "20250223",
        "itpmScdlDd": "1 ",
        "attrAcntEnn": "기업 1234-45678-1235",
        "mmcrBsnnNm": "디씨온",
        "lgnMnbrNm": "김용영",
        "enprFnusNm": "BF",
        "sangHwan": "01",
        "antcAmt": "100000"
    }
*/
  let navigate = useNavigate();
  function cbOslBtn() {
    navigate(PathConstants.MAIN,{state: {tabIdx: 22}});
  }
  return (
    <>
      <OslHeader headerNm={props.headerNm} />
      <div className="container">
        <div className="content">
          <div className="content-body">
            <div className="content-top line-be4">
              <p className="top-tit">대출 금액 <span className="fw-b"><em className="fc-default">{getCommaAmt(resultData.lastLoapAmtTit)}</em>원</span>이 <br /> <strong>입금</strong>되었습니다.</p>
              <figure className="payment">
                <img src="../assets/img/ico/ico_payment.png" alt="payment" />
              </figure>
            </div>

            <section className="section line-tf4">
              <div className="info-wrap">
                <div className="info-box">
                  <span className="tit fc-gray">신청일자</span>
                  <span className="txt fc-dark ta-r">{getDotYmd(resultData.loanYmd)}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">대출금액</span>
                  <span className="txt fc-dark ta-r">{getCommaAmt(resultData.lastLoapAmtTit)}원</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">대출이자</span>
                  <p className="txt fc-dark ta-r">{resultData.aplyInr}%<span className="dp-b fs14 fc-lightGray ta-r">(기준금리 {resultData.baseInr}% <br />+ 가산금리 {resultData.spread}%)</span></p>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">대출 실행일</span>
                  <span className="txt fc-dark ta-r">{getDotYmd(resultData.loanYmd)}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">거치기간 만료일</span>
                  <span className="txt fc-dark ta-r">{getDotYmd(resultData.dfteExpyYmd)}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">대출 만료일</span>
                  <span className="txt fc-dark ta-r">{getDotYmd(resultData.loapExpire)}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">이자지급시기</span>
                  <span className="txt fc-dark ta-r">매월 {resultData.itpmScdlDd}일</span>
                </div>
                <div className="info-box ai-c">
                  <span className="tit fc-gray">대출금 입금 및 계좌번호</span>
                  <span className="txt fc-dark ta-r"><br/><br/>{resultData.attrAcntEnn}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">기업명</span>
                  <span className="txt fc-dark ta-r">{resultData.mmcrBsnnNm}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">대표자명</span>
                  <span className="txt fc-dark ta-r">{resultData.lgnMnbrNm}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">자금용도</span>
                  <span className="txt fc-dark ta-r">{resultData.enprFnusNm}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">상환방법</span>
                  <span className="txt fc-dark ta-r">{resultData.sangHwan}</span>
                </div>
                <div className="info-box ai-c">
                  <span className="tit fc-gray ">총 원리금 및 수수료 부담 예상액</span>
                  <span className="txt fc-dark ta-r">{getCommaAmt(resultData.antcAmt)}원</span>
                </div>
              </div>
            </section>

            <section className="section descr-wrap line-tf4">
              <div className="descr-cont">
                <h2 className="descr-tit fc-default">지연배상금률</h2>
                <p className="descr-txt">여신이자율에 연체가산금의 연3%를 더하여 적용합니다. 단 최고 지연배상금률을 연 11%로 합니다.</p>
                <ul className="bullet-type01 descr-add">
                  <li className="item fc-lightGray">
                    <sapn>여신만료일 이내에 변동될 수 있습니다.</sapn>
                  </li>
                </ul>
              </div>

              <div className="descr-cont">
                <h2 className="descr-tit fc-default">중도상환해약금</h2>
                <p className="descr-txt">중도상환금액(분할상관금의 할부금 상환기일 전 상환 포함) x 요율(고정금리 <em className="fc-default">0.9%</em>/변동금리  <em className="fc-default">0.8%</em>) x (대출잔여일수÷대출기간)</p>
                <ul className="bullet-type01 descr-add">
                  <li className="item fc-lightGray">
                    <span>대출기간 중 금리종류가 변경되더라도 당초 대출취급시점(기간 연장을 한 경우에는 직전 기간연장시점)의 요율을 적용하기로 합니다.</span>
                  </li>
                  <li className="item fc-lightGray">
                    <span>변동금리 대출로서 대출기간이 금리변동주기 이내인 경우에는 고정금리 대출 요율을 적용하기로 합니다.</span>
                  </li>
                  <li className="item fc-lightGray">
                    <span>중도상환해약금 요율<br />[부동산 담보]<br />- 고정금리 : 1.4%, 변동금리: 1.2%<br />[부동산 담보 외]<br />- 고정금리: 0.9%, 변동금리 : 0.8%</span>
                  </li>
                </ul>
              </div>
            </section>
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
      {showLoading&&
        <div className="loading"></div>
      }
    </>
  )
  //대출 실패
  // } else  { 
  //     return (
  //         <>
  //             <div className="container">
  //                 <div className="content">
  //                     <div className="content-body loan-fail">
  //                         <div className="content-top">
  //                             <p className="top-tit"><b>대출 신청</b>이 <b>실패</b>했습니다.</p>
  //                         </div>
  //                         <div className="section pad-t30 line-tf4">
  //                             <div className="info-wrap pad-t0 pad-b0">
  //                                 <div className="info-box">
  //                                     <span className="tit fc-gray"><i className="ico-check-fail"></i> 실패 사유</span>
  //                                     <span className="txt fc-dark">{실패사유}</span>
  //                                 </div>
  //                             </div>
  //                             <p className="txt-desc">
  //                                 위의 사유로 대출 신청이 완료되지 않았습니다. <br /> 자세한 정보를 원하시면 고객센터로 <br /> 연락해 주시기 바랍니다.
  //                                 <span><a href="tel:027297633">02-729-7633</a> (09:30 ~ 17:30)</span>
  //                             </p>
  //                         </div>
  //                     </div>
  //                     <div className="content-footer">
  //                         <button type="button" className="btn btn-lg default-bg">
  //                             <span className="txt">나가기</span>
  //                         </button>
  //                     </div>
  //                 </div>
  //             </div>
  //         </>
  //     )
  // }
}

export default Result;