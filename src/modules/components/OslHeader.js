import { useState } from "react";
import { useNavigate } from "react-router";
import PathConstants from "../constants/PathConstants";
import AlertModal from "./AlertModal";

function OslHeader(props) {
  const headerNm = props.headerNm;
  const backYn = props.backYn;
  const GUIDE_MSG = "상품상세 화면으로 이동하시겠습니까?";
    // popup
  function openPop() {
    setShow(true);
    document.body.style.overflow = "hidden";
  }
  function closePop() {
    setShow(false);
    document.body.style.overflow = "";
  }
  const [show, setShow] = useState(false);
  const handleShow = ()=> openPop();
  const handleClose = ()=> closePop();
  const navigate = useNavigate();
  return (
    <>
    <header className="header-wrap">
      
      <div className="header">
        {backYn&&
        <button type="button" className="btn btn-back" onClick={()=> {navigate(-1)}}>
            <span className="blind">뒤로가기</span>
        </button>
        }
        <div className="h-title">
            <span>{headerNm}</span>
        </div>
        <button type="button" className="btn btn-close" onClick={handleShow}>
            <span className="blind">닫기</span>
        </button>
      </div>
    </header>
    {show&&
    <AlertModal 
      show={show}
      msg={GUIDE_MSG}
      btnNm={["확인", "취소"]}
      onClickFn={(btnIdx)=> {
        if(btnIdx === 0) {
          navigate(PathConstants.GUIDE_DETAIL)
        }
        handleClose();
      }}
    />
    }
    </>
  );
}

export default OslHeader;