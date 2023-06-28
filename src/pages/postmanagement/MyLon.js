import { useState, useLayoutEffect } from "react";
import { callOpenApi } from "../../modules/common/tokenBase";
import OslBtn from "../../modules/components/OslBtn";
import API from "../../modules/constants/API";
/**
 * 컴포넌트명: 나의대출
 * 설명: 대출계좌 조회(전문) > 대출계좌 있으면 대출정보 화면 보여주고, 대출계좌가 없으면 대출계좌 없다는 문구화면 보여줌
 * @param {*} props 
 * @returns 
 */
function MyLon(props) {

  //화면분기 Y:대출있음 N:대출없음
  const [myLonYn, setMyLonYn] = useState("");
  //대출정보
  const [myLonInfo, setMyLonInfo] = useState({});
  //api통신 중 로딩띄우기
  const [showLoading, setShowLoading] = useState(false);
  useLayoutEffect(()=> {
    setShowLoading(true);
    callOpenApi(
      API.COMMOM.MYLOANINQ,
      {},
      (res)=> {
        setShowLoading(false);
        setMyLonInfo(res.data.RSLT_DATA);
      }
    )
  }, []);
  useLayoutEffect(()=> {
    if(JSON.stringify(myLonInfo) !== "{}") {
      if(myLonInfo.loanYn === "Y") {
        setMyLonYn("Y");
      }else {
        setMyLonYn("N");
      }
    }
  }, [myLonInfo]);



  function cbOslBtn() {

  }
  return (
    <>
    <div className="container">
      <div className="content">
      {myLonInfo.loanYn==="Y"&&<>
        <div className="content-body pad-t16">
          <div className="content-top pad-t0">
            <div className="txt-wrap">
              <p className="txt">
              e커머스 소상공인<br />성공 보증부대출
              </p>
              <span className="txt xs-txt fc-lightGray">
                {myLonInfo.acn}
              </span>
              {/* 대출 잔액? */}
              <div className="mar-t16 ta-r">
                <em className="txt xl-txt bold">{myLonInfo.loanBal}</em>
                <span className="txt l-txt">원</span>
              </div>
            </div>
          </div>

          <div className="section pad-0">
            <div className="box-cont">
              <div className="b-title">대출 상태</div>
              <div className="b-txt info-wrap tit-nowrap">
                <div className="info-box">
                  <span className="tit fc-gray">신청일자</span>
                  <span className="txt fc-dark ta-r">{myLonInfo.loapYmd}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">대출금액</span>
                  <span className="txt fc-dark ta-r">{myLonInfo.loanAmt}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">대출이자</span>
                  <span className="txt fc-dark ta-r">{myLonInfo.aplyInr}%<br />
                    <span className="fs14 fc-lightGray ta-r">({myLonInfo.baseInr}% + {myLonInfo.rdin}%)</span>
                  </span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">대출 실행일</span>
                  <span className="txt fc-dark ta-r">{myLonInfo.loexYmd}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">거치기간 만료일</span>
                  <span className="txt fc-dark ta-r">{myLonInfo.dfteExpiYmd}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">대출 만료일</span>
                  <span className="txt fc-dark ta-r">{myLonInfo.loepYmd}</span>
                </div>
                <div className="info-box">
                  <span className="tit fc-gray">다음 이자 지급 시기</span>
                  <span className="txt fc-dark ta-r">{myLonInfo.nextItpmYmd}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <OslBtn
          obj={{
            type: "button",
            disabled: false,
            text: ["대출 상환"],
            link: "",
            callbackId: cbOslBtn
          }}
        />
        </>
      }
      {myLonYn==="N"&&
        <div className="content-body pad-t0">
          <div className="txt-wrap no-data-wrap">
            <p className="txt l-txt ta-c">
              현재 보유 중인 대출이<br />
              없습니다.
            </p>
          </div>
        </div>
      }
      </div>
    </div>
    {showLoading&&
      <div className="loading"></div>
    }
    </>
  )
}

export default MyLon;