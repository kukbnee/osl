import { useState, useEffect, useLayoutEffect } from "react"
import { Navigate, useNavigate } from "react-router";
import OslHeader from "../../modules/components/OslHeader"
import OslBtn from "../../modules/components/OslBtn"
import collectData from "../../modules/constants/collectData"
import RadioInlineComponent from "../common/RadioInlineComponent";
import AlertModal from "../../modules/components/AlertModal";
import { callOpenApi,  callLocalApi } from "../../modules/common/tokenBase";
import { getDotYmd } from "../../modules/utils/util";
import PathConstants from "../../modules/constants/PathConstants";
import API from "../../modules/constants/API";


const stampTaxData = collectData('StampTax')
/**
 * 컴포넌트명 : 인지세 화면
 * 설명 : 대출신청금액 5천만원 이상일때 노출 표준산업 분류코드 
 * 특정 업종코드가 아니고 창업일 2년 이상일 경우 체크리스트가 뜸 반대일 경우 인지세 대상이 아니다.
 * 현재 이미 백엔드에서 해당 내용 제외한 결과값을 받고있음
 * TODO : 조건 걸릴시 체크리스트 지우는거로 개발 완료
 * @param {*} props
 * props항목별 설명
 * process
 * 조회 sttxCnfa
 */
function StampTax(props) {

  let arrRadioData = [];
  stampTaxData.find((data) => {
    if (data.type === "radio") {
      arrRadioData.push(data);
    }
  });

  const [stampTaxResData, setStampTaxResData] = useState({});
  //로딩 show/hide
  const [showLoading, setShowLoading] = useState(false);
  useLayoutEffect(()=> {
    setShowLoading(true);
    callOpenApi(
      API.LONEXECUTE.STAMPTAX_STTXCNFA, 
      {}, 
      (res)=> {
        setStampTaxResData(res.data.RSLT_DATA);
        setShowLoading(false);
        //stampTaxResData=res.data;
        //창업일,업종명
      }
    );
  }, []);


  const [userResult, setUserResult] = useState([99,99,99,99,99,99]);
  let navigate = useNavigate();

  useEffect(() => {
    console.log(userResult)
    //해당 조건 성립할경우 visible true
    
    if(stampTaxResData.esenTgtYn === "Y"){
    if(userResult.find((data,idx)=> data === 99) === 99) {
      setVisible2(false);
      setVisible1(false);
      handleSingleCheck(false, 1);
      handleSingleCheck(false, 2);
    }
    else if(userResult.find((data,idx)=> data===0) === undefined) {
      //all 해당하지않음
      setVisible2(true);
      setVisible1(false);
      handleSingleCheck(false, 1);
    }else {
      setVisible2(false);
      setVisible1(true);
      handleSingleCheck(false, 2);
    }
  }else {
    setVisible2(false);
    setVisible1(true);
  }

  },[userResult]);

  
  const [visible2, setVisible2] = useState(false);
  const [visible1, setVisible1] = useState(false);


  const [checkItems, setCheckItems] = useState([99, 99, 99]);
  useEffect(()=>{
    
  }, [checkItems]);

  const [alertShow, setAlertShow] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const handleSingleCheck = (checked, id)=> {
    console.log(checkItems);
    let copy = [...checkItems];
    if(checked) copy[id] = id;
    else copy[id] = 99;
    setCheckItems(copy);
  };
  
  const ALERT_MSG = "해당항목을 선택 및 체크하시기 바랍니다.";
  function cbOslBtn() {
    if(stampTaxResData.esenTgtYn === "Y"){
    if(!userResult.includes(99) && checkItems[0] === 0 && (checkItems[1] ===1 || checkItems[2] === 2)) {
      //담화면
      //창업일,업종명, 체크리스트1~6
      let param = {
        esenTgtYn: "Y",
        chcnYn01: userResult[0] === "0"?"Y":"N",
        chcnYn02: userResult[1] === "0"?"Y":"N",
        chcnYn03: userResult[2] === "0"?"Y":"N",
        chcnYn04: userResult[3] === "0"?"Y":"N",
        chcnYn05: userResult[4] === "0"?"Y":"N",
        chcnYn06: userResult[5] === "0"?"Y":"N",
        chcnYn07: checkItems[0] === "1"?"Y":"N",
        chcnYn08: checkItems[1] === "1"?"Y":"N",
        chcnYn09: checkItems[2] === "1"?"Y":"N"
      }
      callOpenApi(
        API.LONEXECUTE.STAMPTAX_STTXCNFARGSN, 
        {param}, 
        (res)=> {
          if(res.data.RSLT_DATA.ablYn === "Y"){
            navigate(PathConstants.LONEXECUTE_LONCONTENTCHECK);
          }
        }
      );
    }else {
      console.log(stampTaxData[userResult.findIndex((data, idx)=> data===99)]);
      setAlertShow(true);
      console.log("2")   
      //alert(stampTaxData[userResult.findIndex((data, idx)=> data===99)].id);

    }}else {
      if(checkItems[1] === 1 || checkItems[2] === 2){
        navigate(PathConstants.LONEXECUTE_LONCONTENTCHECK);
        console.log("3")
      }else {
        console.log(stampTaxData[userResult.findIndex((data, idx)=> data===99)]);
        setAlertShow(true);
        console.log("4")
      }
    }
  }
  return (
    <>
      <OslHeader headerNm={props.headerNm} />
      <div className="container">
        <div className="content">
          <div className="content-body certified">
            <div className="content-top pad-b40 line-be4">
              <div className="txt-wrap">
                <p className="txt l-txt">
                  <b>인지세 면제대상 여부 확인</b>을<br />
                  위해 정보를 선택해 주세요.
                </p>
              </div>
            </div>
            <div className="section pad-t20 line-tf4">
              <div className="form-group-wrap">
                <div className="form-group">
                  <div className="txt-wrap">
                    <label htmlFor="inp01" className="txt fc-gray">창업일</label>
                  </div>
                  <div className="inp-wrap">
                    <input type="text" id="inp01" value={getDotYmd(stampTaxResData.lglIncrYmd)} className="inp type01" disabled />
                  </div>
                  <p className="box-chk fc-gray">
                    <input type="checkbox" id="inp01_chk" className="check-input blind" defaultChecked />
                    <label htmlFor="inp01_chk" className="check-label">사업개시일로부터 2년 이내에 해당</label>
                  </p>
                </div>
                <div className="form-group">
                  <div className="txt-wrap">
                    <label htmlFor="inp02" className="txt fc-gray">업종</label>
                  </div>
                  <div className="inp-wrap">
                    <input type="text" id="inp02" value={stampTaxResData.sicCdAbbrNm} className="inp type01" disabled />
                  </div>
                  <p className="box-chk fc-gray">
                    <input type="checkbox" id="inp02_chk" className="check-input blind" defaultChecked />
                    <label htmlFor="inp02_chk" className="check-label">
                      일반 유흥주점업, 무도 유흥주점업,
                      기타 사행시설 관리 및 운영업에
                      해당하지 않음
                    </label>
                  </p>
                </div>
              </div>

              <div className="sele-list-wrap">
                <h2 className="fc-gray">창업 형태</h2>

                <ol className="sele-list type02">
                  
                  {stampTaxData.map((data, idx) => {
                    if(stampTaxData.esenTgtYn === "Y"){
                    return (
                        <li className="item" key={`li${data.id}`}>
                          <div className="question-wrap txt-wrap">
                            <p className="txt">
                              {data.title}
                            </p>
                          </div>
                          {(data.type === "radio") &&
                            <RadioInlineComponent
                              showYn={true}
                              radioData={arrRadioData[data.radioId]}
                              styleSeleList={`sele-list type01 radius answer-wrap`}
                              checked={userResult[idx]}
                              onChangeFn={(radioIdx) => {
                                let copy = [...userResult]
                                copy[idx] = radioIdx;
                                setUserResult(copy);
                              }}
                            />
                          }
                        </li>
                    )}else{
                      <></>
                    }
                  })}
                </ol>
              </div>
              {visible1 && <Check1 data= {stampTaxData}
                            userResult={userResult}
                            setUserResult={setUserResult} 
                            checkItems={checkItems}
                            handleSingleCheck={handleSingleCheck}/>}
              {visible2 && <Check2  data={stampTaxData}
                            userResult={userResult}
                            setUserResult={setUserResult} 
                            checkItems={checkItems}
                            handleSingleCheck={handleSingleCheck}/>}
            </div>
            <div className="ui-cont-wrap line-tf4">
              <div className="ui-decide">
                <input type="checkbox" id="checkbox02"
                checked= {checkItems.includes(stampTaxData[6].checkId)? true : false}
                onChange={(e)=>{
                  handleSingleCheck(e.target.checked, stampTaxData[6].checkId)
                 
                }}/>
                <label htmlFor="checkbox02" className="input-label">
                  본인은 위 확인서의 중요한 내용에 대하여 설명을 듣고 이해하였으며, 이로 인하여 발생되는 손해에 대해서는 아무런 이의를 제기하지 않겠습니다.
                </label>
              </div>
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
          {alertShow&&
            <AlertModal 
              show={alertShow}
              msg={ALERT_MSG}
              btnNm={["확인"]}
              onClickFn={()=> {
                setAlertShow(false);
              }}
            />
          }
        </div>
      </div>
      {showLoading&&
        <div className="loading"></div>
      }
    </>
  )
}
function Check1(props) {
  return (
    <>
      <div className="terms-wrap">
        <h2 className="txt fc-gray">확인 사항</h2>

        <div className="ui-cont-wrap">
          <div className="ui-decide">
            <input type="checkbox" id="checkbox01"
            checked= {props.checkItems.includes(stampTaxData[7].checkId)? true : false}
            onChange={(e)=>{
              props.handleSingleCheck(e.target.checked, stampTaxData[7].checkId)
            }}/>
            <label htmlFor="checkbox01" className="input-label">
              본인은 「조세특례제한법」 제116조제1항제19호에 따른 <em>인지세 면제 대상이 아님을 확인합니다.</em>
            </label>
          </div>
          
        </div>
      </div>


    </>
  )
}

function Check2(props) {
  return (
    <>
    <div className="terms-wrap">
        <h2 className="txt fc-gray">확인 사항</h2>

        <div className="ui-cont-wrap">
          <div className="ui-decide">
            <input type="checkbox" id="checkbox01"
            checked= {props.checkItems.includes(stampTaxData[8].checkId)? true : false}
            onChange={(e)=>{
              props.handleSingleCheck(e.target.checked, stampTaxData[8].checkId)
              
            }}/>
            <label htmlFor="checkbox01" className="input-label">
              본인은 「조세특례제한법」 제116조제1항제19호에 따른 <em>인지세 면제를 신청합니다.</em>
            </label>
          </div>
          <div className="txt-wrap mar-t10">
            <p className="txt s-txt fc-r">※ 향후 인지세 면제 대상이 아닌 것으로 판명되는 경우,「국세기본법」제47조의4제9항에 의거, 납부하지 아니한 세액의 300%에 상당하는 금액이 가산세로 부과될 수 있습니다.</p>
          </div>
        </div>
      </div>
      
    </>
  )
}
export default StampTax;