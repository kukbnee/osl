import { useEffect } from "react";

/**
 * li 하위 텍스트 컴포넌트
 * @param {*} props \
 * showYn
 * textData
 * styleTxt
 * styleInput
 * inputType
 * maxlength
 * @returns 
 */
function TextComponent(props) {
  const objTextData = props.textData;
  // console.log(">>>>>", objTextData);
  useEffect(()=> {
    if(props.showYn) {
      if(props.inputType==="number") {
        document.querySelector("#text"+objTextData.id).setAttribute("pattern", "\\d*"); //아이폰때무네..
      }else {
        document.querySelector("#text"+objTextData.id).setAttribute("maxLength", 40);
      }
    }
  }, []);
  if(props.showYn) {
    return (
      <div className="form-group">
        <div className={props.styleSeleList}>
          <div className="item">
            <input 
              ref={(el)=>{
                if(!!props.textRef) {
                  props.textRef.current[objTextData.id]=el;
                  // console.log("EL>>", props.textRef);
                }
              }}
              className={props.styleInput}
              type={props.inputType}
              name={`text${objTextData.id}`}  
              id={`text${objTextData.id}`}
              placeholder={objTextData.placeholder}
              disabled={props.isDisabled?true:false}
              onChange={(e) => {
                props.onChangeFn(e.target.value);
              }} 
              value={objTextData.value}

            />
          </div>
          {/* <div className="btn-wrap">
            <button type="reset" className="btn btn-sm btn-reset"><span className="blind">재작성</span></button>
          </div> */}
        </div>
      </div>
    );
  }else {
    return null;
  }
}

export default TextComponent;