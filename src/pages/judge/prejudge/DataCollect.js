import { useState, useEffect, useLayoutEffect } from "react";
import OslHeader from "../../../modules/components/OslHeader";
import OslBtn from "../../../modules/components/OslBtn";
import API from "../../../modules/constants/API.js";
import { useNavigate } from "react-router-dom";
import PathConstants from "../../../modules/constants/PathConstants";
import { callOpenApi,  callLocalApi, getSessionData } from "../../../modules/common/tokenBase";
import AlertModal from "../../../modules/components/AlertModal";
import { getBsnn } from "../../../modules/utils/util";

/**
 * 컴포넌트명 : 자료 수집
 * 설명 : 사업자번호, 행정구역 수집
 * @param {*} props
 * props항목별 설명
 */
function DataCollect(props) {
  const DO_SELECT = "선택하세요";
  //시도 axios 결과
  const [cityList, setCityList] = useState([]);
  //시군구 axios 결과
  const [countyList, setCountyList] = useState([]);
  //사업자번호 axios 결괴
  const [bsnfNo, setBsnfNo] = useState("");


  //시도인지 시군구인지
  const [flag, setFlag] = useState("");
  //시도 선택값
  const [sido, setSido] = useState(DO_SELECT);
  //시군구선택값
  const [sigungu, setSigungu] = useState(DO_SELECT);
  //팝업에 보내줄 시도 시군구 리스트
  const [districtsList, setDistrictsList] = useState([]);

  //select태그 활성/비활성
  const [disabledYn, setDisabledYn] = useState(true);
  //팝업창 활성/비활성
  const [active, setActive] = useState("");
  const handleCloseDistricts = () => {setActive(""); document.body.style.overflow = "";}
  const handleShowDistricts = () => {setActive(" active"); document.body.style.overflow = "hidden";}
  //api통신 중 로딩띄우기
  const [showLoading, setShowLoading] = useState(false);

  //alert 띄우기위한 함수 및 변수
  function openPop() {
    setShow(true);
    document.body.style.overflow = "hidden";
  }
  function closePop() {
    setShow(false);
    document.body.style.overflow = "";
  }
  const [show, setShow] = useState(false);
  const handleShow = ()=> openPop();
  const handleClose = ()=> closePop();
  //메세지내용
  const [msgCont, setMsgCont] = useState("");
  //라우터 화면이동
  let navigate = useNavigate();

  //화면 렌더링전 사업자번호 조회
  useLayoutEffect(()=> {
    setShowLoading(true);
    //사업자번호get
    callOpenApi(
      API.PREJUDGE.DATACOLLECT_BSNFNOINQ,
      {},
      (res) => {
        setShowLoading(false);
        setBsnfNo(res.data.RSLT_DATA.bsnfNo);
      }
    )
  }, []);
  
  useEffect(()=> {
    console.log("flag", flag);
    if(flag === "sido") {
      callOpenApi(
        API.PREJUDGE.DATACOLLECT_GETCITYINQ,
        {},
        (res)=> {
          console.log(res);
          setCityList(res.data.RSLT_DATA.city);
        }
      );
    }else if(flag === "sigungu") {
      callOpenApi(
        API.PREJUDGE.DATACOLLECT_GETCOUNTYINQ,
        {city: sido},
        (res)=> {
          console.log(res);
          setCountyList(res.data.RSLT_DATA.result);
        }
      );
    }else {
      console.log("flag값없음", flag);
    }

  }, [flag]);
  useEffect(()=> {
    console.log("cityList", cityList);
    if(cityList.length != 0) {
      setDistrictsList(cityList);
    }
  },[cityList]);

  useEffect(()=> {
    console.log("countyList", countyList);
    let copy = countyList;
    countyList.map((data, idx)=> {
      
      copy[idx] = data;
      console.log(copy[idx]);
    });
    setCountyList(copy);
    if(countyList.length != 0) {
      setDistrictsList(countyList);
    }
  },[countyList]);

  useEffect(()=> {
    console.log(districtsList);
    if(districtsList.length != 0) {
      handleShowDistricts();
    }
  }, [districtsList]);

  useEffect(()=> {
    console.log("active", active);
    if(active === " active") {      
      setDisabledYn(true);
    }
    else {
      setDisabledYn(false);
      setFlag("");
    } 

  }, [active]);
  
  useEffect(()=> {
    setSigungu(DO_SELECT);
  }, [sido]);

  
  //시도 시군구 팝업시 어두운부분 클릭시 팝업 닫힘
  const clicked = (e) => {
    const clicked = e.target.closest('.bottom-inner');
    if(clicked) return;
    else{
      setActive("")
    }
  }

  //다음버튼 콜백함수
  function cbOslBtn() {
    console.log("시도", sido);
    console.log("시군구", sigungu);
    if(!sido || sido === DO_SELECT || !sigungu || sigungu === DO_SELECT) {
      
      setMsgCont("행정구역을 선택해주세요.");
      handleShow();
    }else {
      setShowLoading(true);
      //시군구저장
      callOpenApi(
        API.PREJUDGE.DATACOLLECT_RSPLRGSN,
        {sidoCd: sido, ccwcd: sigungu},
        (res)=> {
          console.log(res);
          //setCityList(res.data.RSLT_DATA.city);
          setShowLoading(false);
          //navigate(PathConstants.PREJUDGE_DOCSTATUS);
          if(res.data.STATUS === "0000") {
            navigate(PathConstants.CERTIFICATE_SCRP, {
              state: {sidoCd: res.data.RSLT_DATA.sidoCd, ccwcd: res.data.RSLT_DATA.ccwcd}
            });
          }else {
            //에러
            // navigate(PathConstants.SERVICE_ERROR);
          }
          
        },
        (err)=> {
          //alert(err);
        }
      )
    }
  }
  

  return (
    <>
      <OslHeader headerNm={props.headerNm} />
      <div className="container" >
        <div className="content">
          <div className="content-body">
            <div className="content-top">
              <p className="top-tit"><strong>자료 수집을</strong> 위해<br />
                <strong>입력해야할 내용</strong>이 있습니다.
              </p>
            </div>
            <div className="section">
              <ul className="sele-list type02">
                <li className="item">
                  <div className="question-wrap txt-wrap">
                    <p className="txt fc-6">
                      사업자 번호
                    </p>
                  </div>
                  <div className="form-group">
                    <div className="sele-list type01 radius answer-wrap">
                      <div className="item">
                        <input type="text" name="text01" id="text01_01" placeholder="사업자 번호" disabled={true} value={getBsnn(bsnfNo)} />
                      </div>
                      <div className="btn-wrap">
                        <button type="reset" className="btn btn-sm btn-reset"><span className="blind">재작성</span></button>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="item">
                <span className="sm-txt info">주민등록상 행정구역을 선택해주세요.</span>
                  <div className="question-wrap txt-wrap">
                    <p className="txt fc-6">
                      시,도
                    </p>
                  </div>

                  <div className="sele-list type01 radius answer-wrap mar-t10">
                    <div className="item">
                      <label className="ui-select">
                        <select name="sSel" id="sSel1" disabled={disabledYn} defaultValue={sido}
                          onClick={() => {
                            setFlag("sido");
                            setDisabledYn(true);
                          }}
                        >
                          <option>{sido}</option>
                        </select>
                        <span className="radio"></span>
                      </label>
                    </div>
                  </div>
                </li>
                <li className="item">
                  <div className="question-wrap txt-wrap">
                    <p className="txt fc-6">
                      시,군,구
                    </p>
                  </div>

                  <div className="sele-list type01 radius answer-wrap mar-t10">
                    <div className="item">
                      <label className="ui-select">
                        <select name="sSel" id="sSel1" disabled={disabledYn} defaultValue={sigungu} 
                          onClick={() => {
                            if(sido === DO_SELECT) {
                              setDisabledYn(true);
                              setMsgCont("시/도를 선택해주세요.");
                              handleShow();
                            }else {
                              setFlag("sigungu");
                              setDisabledYn(true);
                            }
                          }}
                        >
                          <option>{sigungu}</option>
                        </select>
                        <span className="radio"></span>
                      </label>
                    </div>
                  </div>
                </li>
              </ul>
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
      {<ViewDistricts flag={flag} districtsList={districtsList} clicked={clicked} active={active} setActive={setActive} setSido={setSido} setSigungu={setSigungu} handleCloseDistricts={handleCloseDistricts}></ViewDistricts>}
      {show&&<AlertModal 
        show={show}
        msg={msgCont}
        btnNm={["확인"]}
        onClickFn={(btnIdx)=> {
          handleClose();
          setDisabledYn(false);

        }}
      />}
      {showLoading&&
        <div className="loading"></div>}
    </>
  )
}

/**
 * 시도 시군구 리스트 팝업 컴포넌트
 * @param {*} props 
 * @returns 
 */
function ViewDistricts(props) {

  console.log("VIEWDISTRICTS", props.cityList);
  return (
    <div id="bottom01" className={"bottom-sheet" + props.active}
    onClick={(e)=> props.clicked(e)}>
      <div className="bottom-inner">
        <div className="bottom-header">
          <p className="title fc-01">시,도 선택</p>
          <button type="button" className="btn btn-close"
            onClick={() => {
              props.setActive("");
              //props.disabledYn(false);
            }}
          >
            <span className="blind">닫기</span>
          </button>
        </div>
        <div className="bottom-content">
          <div className="select-box">
            <ul className="select-btn-list col2">
            {
              
              props.districtsList.map((data, idx)=> {
                return (
                  <li key={`sido-${idx}`}>
                    <button onClick={()=> {
                        console.log("flag", props.flag)
                        if(props.flag === "sido") {
                          props.setSido(data);
                        }else {
                          props.setSigungu(data);
                        }
                        props.handleCloseDistricts();
                      }}><span>{data}</span></button>
                  </li>
                )
              }
              )
            }
            </ul>
          </div>
        </div>
      </div>
    </div>

  )
}

export default DataCollect;
