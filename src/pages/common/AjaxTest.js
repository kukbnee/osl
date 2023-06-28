import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { getSessionData } from "../../modules/common/tokenBase";
import { TokenContext } from "../../App";
import TextComponent from "./TextComponent";
import PathConstants from "../../modules/constants/PathConstants";
import { useNavigate } from "react-router-dom";
import { useLayoutEffect } from "react";

function AjaxTest() {

  //token여부
  const {tokenYn} = useContext(TokenContext);
  //호출할 api url
  const [apiPath, setApiPath] = useState("");
  //header값 object
  const [header, setHeader] = useState();
  //파라미터값 object
  const [param, setParam] = useState("{}");

  const [appKey, setAppKey] = useState("l7xxK128ZveJ93TckkQ3lfiy4BBL8XGHeJJP");
  const [auth, setAuth] = useState("");

  const [sessionData, setSessionData] = useState({});

  const [response, setResponse] = useState({});

  const navigate = useNavigate();
  useLayoutEffect(()=> {
    
  }, []);
  useEffect(()=> {
    console.log("AJAXTEST>>tokenYn>>", tokenYn);
    console.log("AJAXTEST>>tokenYn>>", getSessionData());
    if(tokenYn === "Y") {
      setSessionData(getSessionData());
      
    }else {
      navigate(PathConstants.REDIRECT);
    }
  }, [tokenYn]);

  useEffect(()=> {
    console.log("AJAXTEST>>sessionData>>", sessionData);
    if(JSON.stringify(sessionData) !== "{}" || sessionData !== undefined) {
      setAuth(sessionData.tokenType + " " + sessionData.accessToken);
    }
    
  }, [sessionData]);

  useEffect(()=> {
    console.log("AJAXTEST>>auth>>", auth);
  }, [auth])

  
	const callApi = async() => {

    let configData = {
      headers: {
        "Content-Type": "application/json",
        "appKey": "l7xxK128ZveJ93TckkQ3lfiy4BBL8XGHeJJP"
      }
    }

    await axios.post(
      apiPath, 
      JSON.stringify(param),
      configData
    ).then((res) => {
      
      setResponse(res);
      
    }).catch((jqXHR, textStatus, exception, errorThrown)=> {
      setResponse({jqXHR: jqXHR, textStatus: textStatus, exception: exception, errorThrown: errorThrown});
    });
    
  }
	return (
    <div className="container">
      <div className="content">
        <div className="content-body">
          <div className="content-top">
            <p className="top-tit">
            </p>
          </div>
          <ul className="sele-list type02">
            
            <li key={`1`} className="item">
              url : <TextComponent
              showYn={true}
              styleSeleList="sele-list type01 radius answer-wrap"
              styleInput=""
              textData={{id:0, placeholder: "url", value: apiPath}}
              inputType="text"
              isDisabled={false}
              onChangeFn={(value)=>{
                setApiPath(value);
              }}
                    />
            </li>
            <li key={`2`} className="item">
              appKey : <TextComponent 
              
              showYn={true}
              styleSeleList="sele-list type01 radius answer-wrap"
              styleInput=""
              textData={{id:1, placeholder: "appKey", value: appKey}}
              inputType="text"
              isDisabled={false}
              onChangeFn={(value)=>{
                setAppKey(value);
              }}
                    />
            </li>
            <li key={`3`} className="item">
              Authorization : <TextComponent 
              
              showYn={true}
              styleSeleList="sele-list type01 radius answer-wrap"
              styleInput=""
              textData={{id:2, placeholder: "Bearer accessToken", value: "{}"!==JSON.stringify(auth)?auth:""}}
              inputType="text"
              isDisabled={true}
              
                    />
            </li>
            <li key={`4`} className="item">
              param : <textarea style={{height: "100px"}} onChange={(e)=> {setParam(e.target.value)}}>{param}</textarea>
            </li>
          
          
          
          
          <button style={{width: "50px", height: "50px", fontSize: "15px", backgroundColor: "blue"}} onClick={()=> {callApi();}}>전송</button>
          <textarea rows={100} style={{height: "500px"}}>{JSON.stringify(response)}</textarea>
    
    </ul>
    </div>
    </div>
    </div>
  )
}

export default AjaxTest;