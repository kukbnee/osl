import { memo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Loading from "../../modules/components/Loading";

const PdfViewer = memo((props)=> {
  
  const [numPages, setNumPages] = useState(null); // 총 페이지수
  const [pageNumber, setPageNumber] = useState(1); // 현재 페이지
  const [pageScale, setPageScale] = useState(1); // 페이지 스케일
  const [arrPages, setArrPages]= useState([]);
  const index = props.idx;
  const content = props.content;

  function onDocumentLoadSuccess({numPages}) {
    
    // console.log(`numPages ${numPages}`);
    setNumPages(numPages);
    console.log(content.length, index);
    
    //props.setPopHeight(document.querySelector(".pop-content").scrollHeight);
    
    
  }

  function onPageLoadSuccess(props) {
    
    //console.log(props);
  }

  return (
    <Document file={{ url: props.pdfData.pdfvalue, httpHeaders: { 'X-CustomHeader': '40359820958024350238508234' }, withCredentials: true }} onLoadSuccess={onDocumentLoadSuccess} loading={<Loading />}>
    
      {
        Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} width={1280/3-36} height={720/2} renderTextLayer={false} renderAnnotationLayer={false} onLoadSuccess={onPageLoadSuccess} loading={<Loading />}/>
        ))
      }
    
    </Document>

  );
});

export default PdfViewer;