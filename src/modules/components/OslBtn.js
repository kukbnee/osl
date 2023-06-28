/**
 * 사용법 : 
 * 버튼이 필요한 컴포넌트에서
 * 1. import OslBtn
 * 2. jsx에 <OslBtn/>정의
 * 3. props전송 ex)<OslBtn obj={{}} /> 
 *  obj형식은 objVerif참고
 *
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OslBtn(props) {

  /**
   * 각 컴포넌트에서 Footer에 보내는 props.obj의 propery 정의
   */
  const objVerif = {
    type: "",                 //ex)"button"
    disabled: true,           //ex)디폴드 disabled는 true
    text: [],                 //ex)[취소,확인]
    link: "",                 //ex)"/judgeStep3.js"
    callbackId: function(){}  //각 컴포넌트에 버튼클릭에 대한 콜백함수명 (각 컴포넌트에서 정의한 콜백함수)
  }
  /**
   * 각 컴포넌트에서 받아온 props.obj 속성과 Footer에서 정의한 object 속성 비교검증
   */
  useEffect(()=>{
    for(let key in objVerif) {
      if(!props.obj.hasOwnProperty(key) && (typeof objVerif[key] != typeof props.obj[key])) {
        console.log("props형식이 맞지 않습니다.");
        return null;
      }
    }
  },[]);

  const obj = props.obj;
  const type = obj.type;

  const [link, setLink] = useState(obj.link);
  const navigate = useNavigate();
  
  return (
    <div className="content-footer">
      {
        obj.text.map((data, idx)=>{
          return (
            <button
              key={`btn_${idx}`} 
              type="button" 
              className="btn btn-lg default-bg"
              disabled={obj.disabled}
              onClick={()=> {
                setCallback(obj.callbackId, navigate, link)
              }} 
            >
              <span className="txt">{data}</span>
            </button>
          );
        })
      }

      
    </div>
  )
}

function setCallback(callbackId, arg0, arg1) {

  if(typeof callbackId == 'function') {
    callbackId(arg0, arg1);
  }else {
    console.log("콜백함수가 없습니다.");
    return;
  }
  
}

export default OslBtn;