import { useEffect, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import AlertModal from "../../modules/components/AlertModal.js";
import OslBtn from "../../modules/components/OslBtn";
import { callOpenApi,  callLocalApi } from "../../modules/common/tokenBase.js";
import PathConstants from "../../modules/constants/PathConstants.js";
import API from "../../modules/constants/API";

/**
 * 컴포넌트명 : ARS 인증 화면
 * 설명
 * @param {*} props
 * props항목별 설명
 * process
 * 조회(번호생성요청) ArsCrtcCretRgst
 * 검증(인증확인) ArcCrtcCnfa
 */
function ArsCertificate(props) {

  const MSG_SUCCESS = "인증을 성공 하셨습니다.";
  const MSG_FAIL = "인증을 실패 하셨습니다.";
  
  const [certNum, setCertNum] = useState(-1);
  const [acitId, setAcitId] = useState("");
  const callApiFn = ()=> {
    setCertNum(-1);
    callOpenApi(
      API.LONEXECUTE.ARSCERTIFICATE_ARSCRTCCRETRGST,
      {}, //userid
      (res)=> {
        console.log(res);
        setCertNum(res.data.RSLT_DATA.twoChnlArsCrtcRrn);
        setAcitId(res.data.RSLT_DATA.twoChnlArsAcitId);
      }
    );
  }
  useLayoutEffect(()=> {
    callApiFn();
  }, []);

  const [msgCont, setMsgCont] = useState("");
  const [show, setShow] = useState(false);
  const handleShow = ()=> setShow(true); document.body.style.overflow = "hidden";
  const handleClose = ()=> setShow(false); document.body.style.overflow = "";
  const [resPassYn, setResPassYn] = useState("N");

  useEffect(()=> {

  }, [resPassYn]);

  let navigate = useNavigate();
  function cbOslBtn() {
    
    callOpenApi(
      API.LONEXECUTE.ARSCERTIFICATE_ARSCRTCCNFA,
      {"twoChnlArsAcitId": acitId},
      (res)=> {
        console.log(res);
        if(res.data.RSLT_DATA.arsCrtcYn ==="Y") {
          setResPassYn("Y");
          setMsgCont(MSG_SUCCESS);
          handleShow();
        }else {
          setMsgCont(MSG_FAIL);
          handleShow();
        }
        //상태값 ok되면 다음페이지(공동인증서 인증 화면)
        //상태값 실패시 이전화면?유지?
      },
      (err)=> {

      }
    );
  }

  return (
    <>
      <div className="container">
        <div className="content">
          <div className="content-body">
            <div className="content-top mar-t40">
              <p className="top-tit ta-c">인증번호</p>
              <span className="auth-num fc-default">{certNum===-1?<img src="/assets/img/ico/loading.jpg" style={{width: "100px", height: "100px"}} />:`${certNum}`}</span>
              {/* <span className="auth-num fc-default"><strong>{certNum}</strong></span> */}
            </div>

            <section className="section auth-wrap line-tf4">
              <p className="auth-txt">고객님께 ARS 인증을 위해 전화를 걸고 있습니다. 거래를 승인하시려면 ARS전화에서 인증번호를 입력해주세요.</p>
              <div className="btn-wrap ta-c">
                <button type="button" className="btn-line02 mar-t50"
                  onClick={()=>{
                    callApiFn();
                  }}
                >
                  <span className="txt">인증번호 재요청</span>
                </button>
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
      {
        show&&
          <AlertModal 
            show={show}
            msg={msgCont}
            btnNm={["확인"]}
            onClickFn={()=> {
              if(msgCont === MSG_SUCCESS) {
                //화면이동
                navigate(PathConstants.CERTIFICATE_CERT);
              }else {
                //유지
              }
              handleClose();
            }}
          />
      }
    </>
  )
}

export default ArsCertificate;