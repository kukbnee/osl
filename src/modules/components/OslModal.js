/**
 * 사용법 : 
 * Modal이 필요한 컴포넌트에서
 * 0. import OslModal
 * 1. state 선언 
 *  ex)
 *  const initAlert = {
 *    open: false,  모달 열지 여부
 *    title: "",    모달 title
 *    message: "",  모달 내용
 *    isHeader: false, 모달 헤더 여부
 *    btnNm: [], 모달 버튼명
 *    callback: () =>{ }, 모달 콜백함수
 *    cbParam: "!@#" 콜백함수 파라미터
 *  }
 *  const [alert, setAlert] = useState(initAlert)
 * 2. jsx에 <OslModal/>정의
 * 3. OslModal open 시점에서 setAlert({open:true , ...})
 */

/**
 * 공통모달
 * @param {*} param0
 * <OslModal/>에서 정의할때 정의된 props들 받아줌 
 */
function OslModal({open, setModal, message, title, isHeader, btnNm, callback, arg}) {

  //모달창 닫힐때 호출
  const handleClose = (btnIdx, arg)=> {
    //return에서 사용되는 props는 필수로 넣어줌
    setModal({open: false, message: message, btnNm: btnNm});

    //콜백함수 실행
    if(typeof callback === "function") callback(props, arg);
  }

  return (
    <>
    </>
  );
}

export default OslModal;