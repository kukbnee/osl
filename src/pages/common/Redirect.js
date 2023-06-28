import { useRef } from "react";
import { useState, useEffect, useLayoutEffect, useContext} from "react";
import { useNavigate, useParams } from "react-router";
import { TokenContext } from "../../App";
import { oslLogin, oslLogout } from "../../modules/common/oslLogin";
import { isState, isToken } from "../../modules/common/tokenBase";
import AlertModal from "../../modules/components/AlertModal";
import collectData from "../../modules/constants/collectData";
import PathConstants from "../../modules/constants/PathConstants";

const progressCdList = collectData("progressCd");
/**
  프로세스 수정
네이버        OSL           메인박스
======================================
Naver → Detail  → Redirct
       
        Ready  ← -isToken ↔ BoxLogin
               ←    ↓
        State  ← -isState
네이버에서 사업자번호 받아올때 사용
new URLSearchParams(location.search).get("id");        
 */

function Redirect() {
  let {type} = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //api통신 중 로딩띄우기
  const [showLoading, setShowLoading] = useState(false);

  //token여부
  const {tokenYn} = useContext(TokenContext);
  //진행상태 코드
  const [stateCd, setStateCd] = useState("");
  useEffect(()=> {
    //alert("redirect>>토큰체크" + tokenYn);
    console.log("Redirection_tokenYn>>", tokenYn);
    if(tokenYn === "Y") {
      isState((ingInfo)=>{
        console.log("isState>>", ingInfo);
        setStateCd(ingInfo.pgrsScd);
        if(ingInfo.pgrsScd === "00" || ingInfo.pgrsScd === null || ingInfo.pgrsScd === "null" || ingInfo.pgrsScd === '') {
          navigate(PathConstants.GUIDE_READY);
        }else {
          setShowLoading(true);
          navigate(
            PathConstants.MAIN,
            {
              state: {
                tabIdx: "2" + stateCd //진행상태
              }
            }
          )
        }
      },
      (err)=> {
        console.log("faillog", err);
        setStateCd("00");
      });

    }else {
      handleShow();
    }
  }, [tokenYn]);

  // useEffect(()=> {
    
  //   console.log("Redirection_stateCd>>", stateCd);
  //   if(tokenYn === "Y") {
  //     if(stateCd === "00" || stateCd === null || stateCd === "null" || stateCd === '') {
  //       navigate(PathConstants.GUIDE_READY);
  //     }else {
  //       navigate(
  //         PathConstants.MAIN,
  //         {
  //           state: {
  //             tabIdx: "2" + stateCd //진행상태
  //           }
  //         }
  //       )
  //     }
  //   }else {
      
  //   }
  // }, [stateCd]);


  let msg = "로그인을 하시겠습니까?"
  if(type === "refresh") msg = "세션이 종료되었습니다.\n" + msg;
  else msg = "로그인이 필요한 서비스입니다.\n" + msg;
  return (
    <>
    {show&&
      <AlertModal 
        show={show}
        msg={msg}
        btnNm={["확인", "취소"]}
        onClickFn={(btnIdx) => {
          
          if(btnIdx === 0) {
            oslLogin();
          }else {
            handleClose();
            navigate(PathConstants.GUIDE_DETAIL);
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

export default Redirect;