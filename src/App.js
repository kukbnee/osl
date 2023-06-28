
import Routing from './Routing';
import React, { useState, useEffect } from 'react';
import { getSessionData, isState, isToken } from './modules/common/tokenBase';
import { useInterval } from './modules/common/hook/useInterval';
import { useLocation } from 'react-router';
import ScrollToTop from './pages/common/ScrollToTop';
import { useRef } from 'react';
import { pdfjs } from 'react-pdf';

export let TokenContext = React.createContext(); //보관함
function App() {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  // let [objParam, setObjParam] = useState({bizNum: "12345", lonNum: "6789"});
  // let [apiPath, setApiPath] = useState("/");
  const [tokenYn, setTokenYn] = useState(()=> isToken());
  //const [redirectType, setRedirectType] = useState("init");
  // const {pathname} = useLocation();
  // //페이지 이동시 스크롤 최상단 고정
  // useEffect(()=> {
  //   console.log("현재경로>>", pathname);
  //   window.scrollTo(0,0);
  //   console.log("스크롤위치", window.pageYOffset);
  // }, [pathname]);
  //
  useEffect(()=> {
    console.log("토큰여부>>", tokenYn);
    if(tokenYn === "Y" || tokenYn === "N") {
      //setRedirectType("refresh");
    }
  }, [tokenYn]);

  console.log("###################개발빌드적용확인###################");
  console.log("REACT_APP_PROXY_PATH=", process.env.REACT_APP_PROXY_PATH);
  console.log("REACT_APP_MNB_API_URL=", process.env.REACT_APP_MNB_API_URL);
  console.log("REACT_APP_LRB_API_URL=", process.env.REACT_APP_LRB_API_URL);
  console.log("REACT_APP_IBK_OAP_URL=", process.env.REACT_APP_IBK_OAP_URL);
  console.log("sessionInfo=", getSessionData());

  //임시 토큰값 갱신
  // const delay = useRef(60000);
  // useInterval(()=> {
  //   isState((ingInfo)=>{
  //     console.log("isState>>", ingInfo);
  //   },
  //   (err)=> {
  //     console.log("상태조회 실패>>", err);
  //   }
  //   );
  // }, delay.current);

  return (
    <>
      <ScrollToTop />
      <TokenContext.Provider value={{tokenYn}}>
        <div className="wrapper">
          <Routing />
        </div>
      </TokenContext.Provider>
    </>
  );
}

export default App;
