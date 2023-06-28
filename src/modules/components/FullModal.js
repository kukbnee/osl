import React, { useEffect, useState } from "react";
import { ModalContents } from "../../pages/common/ModalContents";
import PdfViewer from "../../pages/common/PdfViewer";

/**
 * 
 * @param {*} props 
 *  showYn={show}
 *  handleClose={handleClose}
 *  headerNm="약관 동의"
 *  content={arrPdfData}
 *  type="pdf"
 *  disabledYn={true}
 *  footerNm="확인"
 *  onClickFn={function}
 * @returns 
 */
function FullModal(props) {
  const showYn = props.showYn;
  const headerNm = props.headerNm;
  const content = props.content;
  const type = props.type
  const footerNm = props.footerNm;
console.log(content,typeof content);
  let contId = "";
  if(content.length === 1) {
    contId = content[0].id;
  }

  
  const [disabledYn, setDisabledYn] = useState(props.disabledYn);
  const [popHeight, setPopHeight] = useState(0);

  useEffect(()=> {
    //스크롤없을땐 1초뒤 버튼활성화
    setTimeout(()=> {
      if(document.querySelector(".pop-content").clientHeight + 10 > document.querySelector(".pop-content").scrollHeight) setDisabledYn(false);
    }, 1000)
    //const totalHeight = document.querySelector(".pop-content").scrollHeight;
    //const pageHeight = document.querySelector(".pop-content").clientHeight;
    
  }, []);

  useEffect(()=> {
    if(showYn) {
      document.body.style.overflow="hidden";
    }
  }, [showYn]);

  return (
    <div id="layer00" className="pop-wrap pop-full" style={{display: showYn?"block":"none"}}>
      <div className="pop-inner">
        <div className="pop-header" style={{display: !!headerNm?"block":"none"}}>
          <h3>{headerNm}</h3>
          <button 
            type="button" className="btn btn-close" 
            onClick={()=> {
              document.body.style.overflow = "";
              document.getElementById("layer00").style.display = "none";
              props.handleClose();
            }}>
            <span className="blind">닫기</span>
          </button>
        </div>
        <div className="pop-content" style={{overflow: "auto"}}
          onScroll={(e)=>{
            //console.log(e.target.scrollTop);
            const totalHeight = document.querySelector(".pop-content").scrollHeight;
            const scrollHeight = Math.round(document.querySelector(".pop-content").scrollTop);
            const diffHeight = totalHeight - scrollHeight;
            const pageHeight = document.querySelector(".pop-content").clientHeight;
            
            if(pageHeight+10 > diffHeight) {
              setDisabledYn(false);
            }
          }}>

          {
            (type==="pdf")&&
              content.map((data, idx)=> {
                return (
                  <React.Fragment key={`pdf-${idx}`}>
                  
                    
                  {!!data.modalparam&&
                      <ModalContents componentNm={data.modalparam}/>
                    
                  }
                  {!!data.pdfvalue&&
                    <PdfViewer 
                      pdfData={data}
                      setPopHeight={setPopHeight}
                      content={content}
                      idx={idx}
                    ></PdfViewer>
                  }
                  </React.Fragment>
                  // <img src={data.imgPath} />
                )
              })   
          }
          {
            (type==="component")&&
              <ModalContents componentNm={content}/>
          }
          
        </div>
        <FooterBtn disabledYn={disabledYn} footerNm={footerNm} handleClose={props.handleClose} onClickFn={props.onClickFn} contId={contId} />
      </div>
    </div>
  );
}

function FooterBtn({disabledYn, footerNm, handleClose, onClickFn, contId}) {
  
  return (
    <div className="pop-btn-area">
      <button id="footerBtn" type="button" className="btn btn-lg default-bg" disabled={disabledYn?true:false}
        onClick={()=>{
          document.body.style.overflow = "";
          document.getElementById("layer00").style.display = "none";
          handleClose();
          onClickFn(contId);
        }}
      >
        <span className="txt">{footerNm}</span>
      </button>
    </div>
  );

}

export default FullModal;