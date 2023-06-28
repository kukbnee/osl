import { useNavigate } from "react-router-dom";
import OslHeader from "../../modules/components/OslHeader";
import PathConstants from "../../modules/constants/PathConstants";

function ServiceError(props) {
  let navigate = useNavigate();
  return (
    <>
      <OslHeader headerNm={props.headerNm} backYn={true}/>
      <div className="container">
        
        <div className="content">
        
          <div className="content-body error">
            <div className="content-top">
              <p className="top-tit"><b>일시적인</b><br /><b>서비스 장애</b>입니다.</p>
            </div>
            <div className="section line-tf4">
              <p className="fs18 lh30">불편을 드려 죄송합니다.<br />다시 시도해주세요.</p>
            </div>
          </div>
        
          <div className="content-footer">
            <button type="button" className="btn btn-lg default-bg" onClick={()=> {navigate(PathConstants.GUIDE_DETAIL);}}>
              <span className="txt">홈으로</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ServiceError;