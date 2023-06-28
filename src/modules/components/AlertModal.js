/**
 * AlertModal
 * @param {*} props 
 * show 모달open여부
 * msg 내용
 * btnNm 버튼명 Array
 * onClickFn 클릭 콜백함수
 * @returns 
 */
function AlertModal(props) {
  const showYn = props.show;
  const msg = props.msg;
  const arrBtnNm = props.btnNm;
  return (
    <div id="layer01" className="pop-wrap layer-pop" style={{display: showYn?"block":"none"}}>
      <div className="pop-inner pop-l">
          <div className="pop-content">
              <p className="desc ta-c" style={{whiteSpace: "pre-wrap"}}>{msg}</p>
          </div>
          <div className="pop-btn-area">
            {
              arrBtnNm.map((data, idx)=> {
                return (
                  <button key={`alertBtn-${idx}`} type="button" className="btn btn-base fc-01" 
                    onClick={(e)=>{
                      props.onClickFn(idx);
                    }}>
                    <span>{data}</span>
                  </button>
                )

              })
            }
              
          </div>
      </div>
    </div>
  )
}

export default AlertModal;