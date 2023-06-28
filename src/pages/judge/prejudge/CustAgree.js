
import { useEffect, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import OslBtn from "../../../modules/components/OslBtn";
import OslHeader from "../../../modules/components/OslHeader";
import FullModal from "../../../modules/components/FullModal";
import PathConstants from "../../../modules/constants/PathConstants";
import collectData from "../../../modules/constants/collectData.js";
import { callOpenApi, callLocalApi, getSessionData } from "../../../modules/common/tokenBase.js"
import API from "../../../modules/constants/API.js";
import AlertModal from "../../../modules/components/AlertModal";

const custAgreeData = collectData("CustAgree");

/**
 * 컴포넌트명 : 고객정보동의
 * 설명 : 
 *  -고객정보동의 내용 확인
 *  -고객정보동의 저장
 *  -동의서 목록
      [201554](심사)공공기관 전산정보 이용 동의서.html
      [205424][205425](심사)(신보) 정보수집이용제공동의서 3종.html
      [112075](심사)1번 필수 개인(신용)정보 수집ㆍ이용 동의서(비여신금융거래).html
      [112074](심사)4번 필수 개인(신용)정보 조회 동의서.html
      [201565](심사)5번 필수 개인(신용)정보 수집ㆍ이용ㆍ제공 동의서(여신금융거래).html
      (심사)개인(신용)정보 수집이용 및 제공관련 고객권리안내문.html
 *  -저장 후 적합성 적정성 화면 이동
 * @param {*} props
 * props항목별 설명
 */
function CustAgree(props) {
/*
개인(신용)정보 수집 이용 및 제공 관련 고객 권리 안내문 10012
(필수) 개인(신용)정보 수집이용 제공 동의 (여신금융거래) dcffStplId="10014"
*/
  //하단 동의하기버튼명
  const ALL_BTN_NM = "모두 동의하고 다음";
  const ONE_BTN_NM = "동의하고 다음";
  

  /**
   * custAgreeData index와 맞아야함(마지막 두개는 제외)
   * 체크항목 state
   * 초기값    99
   * 체크해제  0
   * 체크      1
   */
  const [checkItems, setCheckItems] = useState(["1",99,99,99,99,99,99,99,99,99,99]);

  const [agreeBtnNm, setAgreeBtnNm] = useState(ALL_BTN_NM); //동의버튼명 state
  const [disabledYn, setDisabledYn] = useState(false); //동의버튼활성화여부 state

  //모달 show/hide function
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //모달 show여부 state
  const [show, setShow] = useState(false);
  //api통신 중 로딩띄우기
  const [showLoading, setShowLoading] = useState(false);
  //alert show/hide function
  const [altshow, setAltShow] = useState(false);
  const alertClose = () => setAltShow(false);
  const alertShow = () => setAltShow(true);

 
  const [msgCont, setMsgCont] = useState("");

  let navigate = useNavigate();

  //고객동의항목
  const [arrAgrData, setArrAgrData] = useState([]);
  //등록 파라미터[todo]네이버 api 정의 후 수정
  const [params, setParams] = useState({
    dcffStplId: [], // 동의항목["112075", "112074","201565","201554","205425","205424","205438"],
    ticketId: "", // 네이버파이낸셜 id?"NF0000000",
    bzn: "", //사업자번호 "123456789"
  });
  /**
   * 
   */
  const callApiFn = ()=> {
    if(checkItems[8] == "99"){
      setMsgCont("선택 동의서의 경우도 동의를 진행해야 가능한 대출 상품입니다.")
      alertShow();
    }else{
      setShowLoading(true);
      callOpenApi(
        API.PREJUDGE.CUSTAGREE_SPAG,
        // {dcffStplId: ["201554","205424","112075","112074","201565","205425"]}, //[todo]동의항목 전달 받고 수정필요
        // {dcffStplId: checkItems.filter((data)=> typeof data !== "number" && data !== "1")},
        params,
        (res)=> {
          setShowLoading(false);
          if(res.data.RSLT_DATA.resultYn === "Y") {
            navigate(PathConstants.PREJUDGE_SUITTEST);
          }
          
        }
      );
    }
  };
  
  useEffect(()=> {
    console.log("useEffect[checkItems]",checkItems);
    if(checkItems.filter((data)=> data !== 99 && data !== 0).length === 10 && agreeBtnNm === ALL_BTN_NM) { //모두동의하고 다음 클릭 > 팝업 확인 > 모두체크상태
      setParams({
        dcffStplId: checkItems.filter((data)=> typeof data !== "number" && data !== "1" && data !== ""),
        ticketId: "NF0000000",
	      bzn: "123456789"
      });
    }else if(!!checkItems.find((data, idx)=> data !== 99 && data !== 0 && idx !== 0) && (!!checkItems.find((data, idx)=> data === 99 && idx !== 8) || checkItems.findIndex((data, idx)=> data === 0 && idx !== 8) > -1)) { //한개이상 체크 및 한개이상 체크해제상태
      setAgreeBtnNm(ONE_BTN_NM);
      setDisabledYn(true);
    }else if(checkItems.filter((data)=> data === 0 || data === 99).length === 10) { // 모두 해제상태 및 초기상태
      setAgreeBtnNm(ALL_BTN_NM);
      setDisabledYn(false);
    }else { //모두체크 상태
      setAgreeBtnNm(ONE_BTN_NM);
      setDisabledYn(false);
    }
  }, [checkItems]);

  useEffect(()=> {
    if(params.dcffStplId.length > 0) {
      callApiFn();
    }    
  }, [params]);


  //동의하기버튼 콜백
  function cbOslBtn() {
    if(agreeBtnNm === ALL_BTN_NM) { //모두동의하고다음
      setArrAgrData(custAgreeData);
      handleShow(true);
    }else { //동의하고다음
      
      setParams({
        dcffStplId: checkItems.filter((data)=> typeof data !== "number" && data !== "1" && data !== ""),
        ticketId: "NF0000000",
	      bzn: "123456789"
      });

    }

  }

  return (
    <>
      <OslHeader headerNm={props.headerNm} />
      <div className="container">
        <div className="content">
          <div className="content-body">
            <div className="content-top">
              <p className="top-tit"><strong>e커머스 소상공인 성공<br />
                보증부대출</strong>을 위해 다음 항목에<br />
                동의해 주세요
              </p>
              <p className="top-txt">
                대출 한도 조회용으로 고객님의 정보를 수집합니다. <span className="fc-r">신용도에는 영향이 없으니 안심하세요.</span>
              </p>
            </div>
            <div className="section line-tf4">
              <div className="agree-form">
                <p className="box-chk">
                  <label className="check-label">{custAgreeData.filter((data)=> data.id===99)[0].title}</label>
                    <a data-id=""
                      className="btn-pop-arrow"
                      onClick={() => {
                        setArrAgrData(custAgreeData.filter((data)=> data.id===99));
                        handleShow(true);
                      }}
                    />
                </p>
              </div>
            </div>
            <div className="section line-tf4">
              <div className="agree-form">
                {custAgreeData.map(function (data, idx) {
                  return (
                  data.requiredYn !== "X"&&
                    <p key={`p-${idx}`} className="box-chk">
                      <input
                        type="checkbox"
                        name="agree_terms"
                        checked={checkItems[idx]===99?false:checkItems[idx]===0?false:true}
                        id={idx}
                        className="check-input blind"
                        onChange={(e) => {
                          console.log(idx, data.id);
                          if (checkItems[idx] !== 99) {
                            let copy = [...checkItems];
                            //asis : copy[idx] = copy[idx] === 0 ? 1 : 0;
                            copy[idx] = copy[idx] === 0 ? data.dcffStplId : 0;
                            setCheckItems(copy);
                          }
                        }}
                      />
                      <label htmlFor={idx} className="check-label">{data.title}</label>
                      <a data-id=""
                        className="btn-pop-arrow"
                        onClick={() => {
                          setArrAgrData(custAgreeData.filter((objData)=> data.id===objData.id));
                          handleShow(true);
                        }}
                      />
                    </p>
                  )
                })}
              </div>
            </div>

            <div className="section line-tf4">
              <p className="mar-t10 mar-b30 point-tit">신청 전 유의사항을 꼭 확인해주세요</p>
              <div className="agree-form">
                <p key="key-000" className="box-chk">
                  <input type="checkbox" name="agree_terms_10" id="agree_terms_10" className="check-input blind" 
                    checked={checkItems[9]===99?false:checkItems[9]===0?false:true}
                    onChange={(e)=>{
                      
                      let copy = [...checkItems];
                      copy[9] = copy[9]===0||copy[9]===99?"1":0;
                      setCheckItems(copy);
                      
                    }}
                  />
                  <label htmlFor="agree_terms_10" className="check-label">IBK기업은행에 상담 중인 대출이 없습니다.</label>
                </p>
                <p key="key-001" className="box-chk">
                  <input type="checkbox" name="agree_terms_11" id="agree_terms_11" className="check-input blind" 
                    checked={checkItems[10]===99?false:checkItems[10]===0?false:true}
                    onChange={(e)=>{
                      
                      let copy = [...checkItems];
                      copy[10] = copy[10]===0||copy[10]===99?"1":0;
                      setCheckItems(copy);
                      
                    }}
                  />
                  <label htmlFor="agree_terms_11" className="check-label">기타은행에서 정한 신용등급 등 취급제한 사유에 따라 대출 취급이 거절될 수 있음을 충분히 이해하였습니다.</label>
                </p>
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
          content={arrAgrData}
          type="pdf" //[todo] 모달타입 변경 필요(동의항목나오면 수정예정)
          disabledYn={true}
          footerNm="확인"
          onClickFn={(contId) => {
            if(contId !== 99) {
              if(typeof contId === "number") {
                let copy = [...checkItems];
                //asis : copy[contId] = 1;
                copy[contId] = custAgreeData.filter((data)=>data.id===contId)[0].dcffStplId;
                setCheckItems(copy);

              }else {
                
                setCheckItems(
                  [custAgreeData[0].dcffStplId,
                  custAgreeData[1].dcffStplId,
                  custAgreeData[2].dcffStplId,
                  custAgreeData[3].dcffStplId,
                  custAgreeData[4].dcffStplId,
                  custAgreeData[5].dcffStplId,
                  custAgreeData[6].dcffStplId,
                  custAgreeData[7].dcffStplId,1,1]);
              }
            }

          }}

        />
      }
      {showLoading&&
        <div className="loading"></div>
      }
      {altshow &&
        <AlertModal
          show={altshow}
          msg={msgCont}
          btnNm={["확인"]}
          onClickFn={() => {
            alertClose();
          }}
        />
      }
    </>
  );
}

export default CustAgree;