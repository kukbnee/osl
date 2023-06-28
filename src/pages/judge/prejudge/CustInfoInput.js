import { useEffect, useRef, useState } from "react";
import OslBtn from "../../../modules/components/OslBtn";
import OslHeader from "../../../modules/components/OslHeader";
import { useNavigate } from 'react-router';
import PathConstants from './../../../modules/constants/PathConstants';
import { callOpenApi,  callLocalApi } from "../../../modules/common/tokenBase";
import API from './../../../modules/constants/API';
import { getBsnn } from './../../../modules/utils/util';
import { async } from "q";
import AlertModal from "../../../modules/components/AlertModal";

/**
 * 컴포넌트명: 고객정보 및 관리영업점 확인
 * 설명: 렌더링전 사업자번호, 사업자명, 대표자명, 관리영업점, 대표자 영문명 조회
 *  관리영업점이 있는 사용자면 최초 조회 데이터로 관리영업점 노출
 *  관리영업점이 없는 최초사용자면 관리영업점 검색하여 선택
 * @param {*} props 
 * @returns 
 */
//[TODO] 테스트 가능할시에 업종 선택 셀렉트 박스 제대로 들어오는지 확인
function CustInfoInput(props) {
  const navigate = useNavigate();
  //관리부점 리스트
  const [mngmLst, setMngmLst] = useState([{
    mngmBrcd: "",
    mngmBrm: "",
    mngmTelNo: "" ,
    mngmTime: "",
    mngmAdr: ""
  }]);
  //표준산업분류코드
  const [sicLst, setSicLst] = useState([{sicCd: "", sicNm: ""}]);
  //사업자정보
  const [bznInfo, setBznInfo] = useState({
    bzn: "", //사업자번호
    bznNm: "", //사업자명
    rpprNm: "", //대표자명
    ensnCsm: "" //대표자영문명
  });
  //등록 파라미터
  const [params, setParams] = useState({
    rpprEnNm: "", //대표자영문명
    sicCd: "", //표준산업분류코드
    sicNm: "", //표준산업분류코드 명칭
    mngmBrcd: "", //관리부점 코드
    mngmBrm: "", //관리부점명
  });
  //api통신 중 로딩띄우기
  const [showLoading, setShowLoading] = useState(false);
  //관리영업점 검색 창/버튼 활성 비활성
  const [srchDisabledYn, setSrchDisabledYn] = useState(false);
  //관리영업점 검색 파라미터
  const [srchBrmReq, setSrchBrmReq] = useState("");
  //관리영업점 검색 결과리스트
  const [srchBrmResList, setSrchBrmResList] = useState([]);
  //관리영업점 검색 결과상세리스트
  const [srchBrDtlList, setSrchBrDtlList] = useState([]);
  //관리영업점 검색 결과리스트 중 선택한 상세데이터
  const [selBrDtl, setSelBrDtl] = useState({});
  //관리영업점 검색결과 영역 flag init ing comp
  const [srchYn, setSrchYn] = useState("init");
  //alert창 show/hide
  const [showAlert, setShowAlert] = useState(false);
  const handleClose = () => setShowAlert(false);
  const handleShow = () => setShowAlert(true);
  const [msgCont, setMsgCont] = useState("");
  
  function cbOslBtn() { 
    //고객정보 등록
    const mngmBrm = mngmLst.filter((x) => x.mngmBrcd === params.mngmBrcd)[0]?.mngmBrm;
    const sicNm = sicLst.filter((x) => x.sicCd === params.sicCd)[0]?.sicCd;

    params.mngmBrm = mngmBrm ?? "";
    params.sicNm = sicNm ?? "";

    let valiCheck = true;
    for(const key in params) {
      if(!params[key]) {
        valiCheck = false;
        if(key === "mngmBrcd") {
          setMsgCont("관리영업점을 선택해주세요."); 
          handleShow();
        }else if(key === "rpprEnNm") {
          setMsgCont("대표자 영문명을 입력해주세요.");
          handleShow();
        }else if(key === "sicCd") {
          setMsgCont("업종을 선택해주세요."); 
          handleShow();
        }
      }
    }
    console.log("고객정보 등록 PARAMS > ", JSON.stringify(params));
    if(valiCheck) {
      setShowLoading(true);

      callOpenApi(
        API.PREJUDGE.CUSTINFOINPUT_CSINQRG,
        params,
        (res)=> {
          setShowLoading(false);
          if(res.data.RSLT_DATA.resultYn === "Y") {
            navigate(PathConstants.PREJUDGE_SUITRESULT);
          } else {
            //실패
          }
        },
        (err)=> {
          //alert(err);
        }
      );
    }
    
  }

  //화면 진입 최초데이터 세팅
  const init =() => {
    setShowLoading(true);
    callOpenApi(
      API.PREJUDGE.CUSTINFOINPUT_CSINBSININQ,
      {},
      (res)=> {
        setShowLoading(false);
        console.log(res);
        //console.log("before : " + res.data.RSLT_DATA.mngmBr.mngmBr);
        if(res.data.RSLT_DATA.sic !== null || res.data.RSLT_DATA.sic !== 'null'){
          setSicLst(res.data.RSLT_DATA.sic);
          setBznInfo({
            bzn: res.data.RSLT_DATA.bzn,
            bznNm: res.data.RSLT_DATA.bznNm,
            rpprNm: res.data.RSLT_DATA.rpprNm,
            ensnCsm: res.data.RSLT_DATA.ensnCsm
          });

          setParams({...params, rpprEnNm: res.data.RSLT_DATA.ensnCsm});
        }else if(res.data.RSLT_DATA.mngmBr.mngmBr !== null || res.data.RSLT_DATA.mngmBr.mngmBr !== 'null'){
        if(!!res.data.RSLT_DATA.mngmBr.mngmBr.brcd.trim()) {
          searchBrm(res.data.RSLT_DATA.mngmBr.mngmBr.krnBrm);
          setSrchYn("ing");
          setSrchDisabledYn(true);
        }
        setSicLst(res.data.RSLT_DATA.sic);
        setBznInfo({
            bzn: res.data.RSLT_DATA.bzn,
            bznNm: res.data.RSLT_DATA.bznNm,
            rpprNm: res.data.RSLT_DATA.rpprNm,
            ensnCsm: res.data.RSLT_DATA.ensnCsm
        });
        
        setMngmLst([{
          mngmBrcd: res.data.RSLT_DATA.mngmBr.mngmBr.brcd,
          mngmBrm: res.data.RSLT_DATA.mngmBr.mngmBr.krnBrm,
          mngmTelNo: res.data.RSLT_DATA.mngmBr.mngmBr.brncTpn,
          mngmTime: res.data.RSLT_DATA.mngmBr.mngmBr.brncTim,
          mngmAdr: res.data.RSLT_DATA.mngmBr.mngmBr.rfntAllRdnmAdr
        }]);
      }
      },
      (err)=> {
        //alert(err);
      }
    )
  }

  //관리영업점명으로 한글검색
  const searchBrm = (init)=> {
    
    callOpenApi(
      API.PREJUDGE.CUSTINFOINPUT_BOBINQ,
      {krnBrm: (!!init)?init:srchBrmReq},
      (res)=> {
        if(res.data.STATUS === "9999") console.log("검색결과가 없습니다.");
        else setSrchBrmResList(res.data.RSLT_DATA.brcdLst);
      },
      (err)=> {
        console.log(err);
      }
    );
  }

  //관리영업점 검색 결과 상세 리스트 set
  let searchDtl = [];
  const searchBrDtl = async(pBrcd)=> {
    if(pBrcd.length > 0) {
      for(let idx=0; idx<pBrcd.length; idx++) {
        await callOpenApi(
          API.PREJUDGE.CUSTINFOINPUT_BOBDTLINQ,
          {brcd: pBrcd[idx]},
          (res)=> {
            // console.log("***", srchBrDtlListCopy);
            // let copy = [...srchBrDtlListCopy];
            // copy.push(res.data.RSLT_DATA.mngmBr);
            // setSrchBrDtlListCopy(copy);
            console.log("인덱스", idx);
            console.log("검색결과 상세영업점데이터bef>>", searchDtl);
            searchDtl = [...searchDtl, res.data.RSLT_DATA.mngmBr];
            console.log("검색결과 상세영업점데이터aft>>", searchDtl);
            if(searchDtl.length === pBrcd.length) {
              console.log("상세데이터리스트>>", searchDtl);
              setSrchBrDtlList([...searchDtl]);
              setSrchYn("comp");
            }
          },
          (err)=> {
    
          }
        )
      }
    }
  }

  const onChange = (nm, e) => {
    console.log("nm : ", nm, " value, ", e.target.value)
    
    setParams({
      ...params,
      [nm]: e.target.value
    });
  }
  // useEffect(() => {
  //   setParams({...params, rpprEnNm: bizInfo.ensnCsm});
  // }, [bizInfo.ensnCsm]);
  
  useEffect(() => {
    init();
  }, []);

  
  useEffect(()=> {
    console.log("최초조회의 관리영업점 or 관리영업점 검색결과 선택값", mngmLst);
    
      setParams({
        ...params,
        mngmBrcd: mngmLst[0]["mngmBrcd"],
        mngmBrm: mngmLst[0]["mngmBrm"]
      });
    
  }, [mngmLst]);

  useEffect(()=> {
    console.log("최초조회의 업종 or 업종 선택값", sicLst);

    setParams({
      ...params,
      sicCd: sicLst[0]["sicCd"],
      sicNm: sicLst[0]["sicNm"]
    })
  }, [sicLst]);

  const delay = useRef(1000);
  useEffect(()=> {
    console.log("관리영업점 검색결과 리스트", srchBrmResList);
    if(srchBrmResList.length > 0) {
      //loading start
      let arrBrCd = [];
      srchBrmResList.forEach((data)=> {
        arrBrCd.push(data.brcd);
      });
      
      let intervalDtl = setInterval(()=> {
        console.log("INTERVAL");
        console.log(arrBrCd.length, arrBrCd.length);
        if(arrBrCd.length === srchBrmResList.length) {
          
          searchBrDtl(arrBrCd);
          clearInterval(intervalDtl);
        }
      }, delay.current);
      
    }
  }, [srchBrmResList]);

  useEffect(()=> {
    console.log("검색된 관리영업점 상세리스트", srchBrDtlList);
    if(srchBrDtlList.length === 1) setSelBrDtl(srchBrDtlList[0]);
  }, [srchBrDtlList]);

  useEffect(()=> {
    console.log("검색된 관리영업점 중 선택한 상세데이터", selBrDtl);
    if(JSON.stringify(selBrDtl) !== "{}") {
      setSrchBrmReq(selBrDtl.krnBrm);
      setMngmLst([
        {
          mngmBrcd: selBrDtl.brcd,
          mngmBrm: selBrDtl.krnBrm,
          mngmTelNo: selBrDtl.brncTpn ,
          mngmTime: selBrDtl.brncTim,
          mngmAdr: selBrDtl.rfntAllAdr
        }
      ])
    }
  }, [selBrDtl]);

  useEffect(()=> {
    if(srchYn === "comp") {
      //window.scrollTo(0, window.document.querySelector(".container").scrollHeight);
      window.scrollTo(0, 610);
    }
  }, [srchYn]);

  useEffect(()=> {
    console.log("파람>>", params);
  }, [params]);


  return (
    <>
      <OslHeader headerNm={props.headerNm} />
      <div className="container" >
        <div className="content">
          <div className="content-body">
            <div className="content-top">

              <p className="top-tit">고객님의 정보와 관리영업점을 <br />확인해주세요.</p>
              
            </div>
            <section className="section line-tf4">
                <div className="info-wrap">
                  <div className="info-box">
                    <span className="tit fc-gray">사업자번호</span>
                    <span className="txt fc-dark ta-r">{getBsnn(bznInfo.bzn)}</span>
                  </div>
                  <div className="info-box">
                    <span className="tit fc-gray">사업장명</span>
                    <span className="txt fc-dark ta-r">{bznInfo.bznNm}</span>
                  </div>
                  <div className="info-box">
                    <span className="tit fc-gray">대표자명</span>
                    <span className="txt fc-dark ta-r">{bznInfo.rpprNm}</span>
                  </div>
                </div>
              </section>

              <div className="section line-tf4">
                <ol className="sele-list type02 pad-b10">
                  <li className="item">
                    <div className="question-wrap txt-wrap">
                      <p className="txt">
                        대표자 영문명
                      </p>
                    </div>
                    <div className="sele-list type01 radius answer-wrap mar-t10">
                      <div className="item">
                        <input type="text" className="ta" name="text01" id="text01_01" value={params.rpprEnNm} onChange={(e) => onChange("rpprEnNm", e)}/>
                      </div>
                    </div>
                  </li>
                  <li className="item">
                    <div className="question-wrap txt-wrap">
                      <p className="txt">
                        업종 선택  <img src="../assets/img/common/istock.jpg" alt="?" width={20} height={20}/> <span className="step-txt fc-gray">매출액이 가장 많은 업종</span>
                      </p>
                    </div>
                    <div className="sele-list type01 radius answer-wrap mar-t10">
                      <div className="item" >
                        <label className="ui-select">
                          <select name="sSel" id="sSel1" onChange={(e) => onChange("sicCd", e)} value={params.sicCd ?? ""} required>
                            <option value= "" disabled selected hidden>선택</option>
                            {
                              sicLst.map((item) => (
                                <option key={item} value={item.sicCd} >{item.sicNm}</option>
                              ))
                            }
                          </select>
                          <span></span>
                        </label>
                      </div>
                    </div>
                  </li>
                  <li className="item">
                    <div className="question-wrap txt-wrap">
                      <p className="txt">
                        관리영업점 검색
                      </p>
                    </div>
                    <div className="sele-list mar-t10">
                      <div className="item">
                        <div className="inp-block">
                          <input type="text" className="inp type01 w175" name="text01" id="text01_01" placeholder="관리영업점 검색" 
                            disabled={srchDisabledYn}
                            value={(srchDisabledYn)?mngmLst[0].mngmBrm:srchBrmReq} 
                            onChange={(e)=> {
                              setSrchBrmReq(e.target.value);
                            }}/>
                          <button className="btn" 
                            style={{minWidth: "83px", height: "60px",margin: "0 5px", padding: "0 10px", backgroundColor: "#3982d8", fontSize: "20px", color: "white"}}
                            disabled={srchDisabledYn}
                            onClick={()=> {
                              window.scrollTo(0, 200);
                              setSrchYn("ing");
                              //선택한 영업점 초기화
                              setSelBrDtl({});
                              //관리영업점 검색 api 호출하는 함수 호출
                              searchBrm();
                              setMsgCont("검색 후 아래 관리 영엄접을 선택해주세요.");
                              handleShow();
                            }}>검색
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* <div className="sele-list type01 radius answer-wrap mar-t10">
                      <div className="item">
                        <label className="ui-select">
                          <select name="sSe2" id="sSel2" onChange={(e) => onChange("mngmBrcd", e)} value={params.mngmBrcd ?? ""}>
                            <option key="0" value="">선택하세요</option>
                            {
                              mngmLst.map((item) => (
                                <option key={item} value={item.mngmBrcd}>{item.mngmBrm}</option>
                              ))
                            }
                          </select>
                          <span></span>
                        </label>
                      </div>
                    </div> */}
                  </li>
                  <li className="item">
                    {/* 영업점 리스트 */}
                  </li>
                  
                </ol>
                {
                  // (mngmLst.length > 0)?
                  //   <section className="section line-tf4">
                  //     <div className="info-wrap">
                  //       <div className="info-box"><span className="tit fc-gray">{mngmLst[0].mngmBrm}</span></div>
                  //       <div className="info-box"><span className="tit fc-gray">{mngmLst[0].mngmAdr}</span></div>
                  //       <div className="info-box"><span className="tit fc-gray">{mngmLst[0].mngmTelNo}</span></div>
                  //     </div>
                  //   </section>
                  // :
                  
                  (srchYn === "ing")?
                    <img src="/assets/img/ico/loading.jpg" style={{width: "30px", height: "30px", margin: "auto", display: "block"}} />
                  :
                  (srchYn === "comp" && srchBrDtlList.length > 0)&&
                  srchBrDtlList.map((data, idx)=> {
                    return (
                      <section key={`srchRes-${idx}`} className="section line-tf4" 
                        onClick={()=> {
                          //관리영업점 검색결과 초기화
                          setSrchBrDtlList([data]);
                          //선택한 관리영업점 set
                          setSelBrDtl(data);
                        }}>
                        <div className="info-wrap">
                          <div className="info-box"><span className="tit fc-gray">{data.krnBrm}</span></div>
                          <div className="info-box"><span className="tit fc-gray">{data.rfntAllAdr}{data.rfntAllRdnmAdr}</span></div>
                          <div className="info-box"><span className="tit fc-gray">{data.brncTpn}</span></div>
                        </div>
                      </section>
                    )
                  })
                  // (JSON.stringify(selBrDtl) !== "{}")&&
                  //   <section className="section line-tf4">
                  //     <div className="info-wrap">
                  //       <div className="info-box"><span className="tit fc-gray">{selBrDtl.krnBrm}</span></div>
                  //       <div className="info-box"><span className="tit fc-gray">{selBrDtl.rfntAllAdr}{selBrDtl.rfntAllRdnmAdr}</span></div>
                  //       <div className="info-box"><span className="tit fc-gray">{selBrDtl.brncTpn}</span></div>
                  //     </div>
                  //   </section>
                }
                {/* <section className="section line-tf4" onClick={()=>{alert(111);}}>
                  <div className="info-wrap">
                    <div className="info-box"><span className="tit fc-gray">04558</span></div>
                    <div className="info-box"><span className="tit fc-gray">을지로</span></div>
                    <div className="info-box"><span className="tit fc-gray">서울 중구 마른내로 72 (인현동2가)</span></div>
                    <div className="info-box"><span className="tit fc-gray">02 -2266-4191</span></div>
                  </div>
                </section>
                <section className="section line-tf4">
                  <div className="info-wrap">
                    <div className="info-box"><span className="tit fc-gray">04558</span></div>
                    <div className="info-box"><span className="tit fc-gray">을지로</span></div>
                    <div className="info-box"><span className="tit fc-gray">서울 중구 마른내로 72 (인현동2가)</span></div>
                    <div className="info-box"><span className="tit fc-gray">02 -2266-4191</span></div>
                  </div>
                </section> */}
                
              </div>
          </div>
          <OslBtn
            obj={{
              type: "button",
              disabled: false,
              text: ["다음"],
              link: "",
              callbackId: cbOslBtn
            }} />
        </div>
      </div>
      {showAlert&&
        <AlertModal
          show={showAlert}
          msg={msgCont}
          btnNm={["확인"]}
          onClickFn={() => {
            setMsgCont("");
            handleClose();
          }}
        />

      }
      {showLoading&&
        <div className="loading"></div>}
    </>
  );
}

export default CustInfoInput;