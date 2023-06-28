//API 목록 정의
/*
api/lb/v1/osl000/ingYn                  온라인소상공인 보증부 대출 진행 여부 조회
api/lb/v1/osl000/loapSttsInq            온라인소상공인 보증부 대출 진행 상태 조회  
api/lb/v1/osl000/myLoanInq              온라인소상공인 보증부 대출 나의 대출 조회    
api/lb/v1/osl001/getCityInq             온라인소상공인 보증부 대출 시도 목록 조회  
api/lb/v1/osl001/getCountyInq           온라인소상공인 보증부 대출 시군구 조회  
api/lb/v1/osl001/spag                   온라인소상공인 보증부 대출 약관동의        
api/lb/v1/osl101/sbntPopyInq            온라인소상공인 보증부 대출 적합성 적정성 기초 데이터 조회            
api/lb/v1/osl001/sbntPopyVrfc           온라인소상공인 보증부 대출 적합성 적정성 등록            
api/lb/v1/osl103/scpg                   온라인소상공인 보증부 대출 스크래핑 데이터 수집      
api/lb/v1/osl103/scpgPgrsHstInq         온라인소상공인 보증부 대출 스크래핑 수집 진행상태 조회            
api/lb/v1/osl103/csinBsinInq            온라인소상공인 보증부 대출 고객 기본 정보 조회      
api/lb/v1/osl103/csinIqrg               온라인소상공인 보증부 대출 고객 정보 조회 및 등록  
api/lb/v1/osl103/cmpbPopyExcnVrfcIqrg   온라인소상공인 보증부 대출 적합성, 적정성 조회 및 등록
api/lb/v1/osl103/cmpbPopyExcnVrfcInq    온라인소상공인 보증부 대출 적합성, 적정성 결과 조회      
api/lb/v1/osl104/grnyExntDatWrtn        온라인소상공인 보증부 대출 보증심사자료 등록    
api/lb/v1/osl104/nofcGtlnDoSmynInq      온라인소상공인 보증부 대출 서류 전송확인 조회        
api/lb/v1/osl105/gnap                   온라인소상공인 보증부 대출 보증신청      
api/lb/v1/osl300/gratDtliq              온라인소상공인 보증부 대출 보증승인내역조회    
api/lb/v1/osl300/grnyVldtVrfc           온라인소상공인 보증부 대출 보증 대출 승인 유효성 검증    
api/lb/v1/osl300/achlYnInq              온라인소상공인 보증부 대출 약관 동의  
api/lb/v1/osl301/grnyLnagRgsn           온라인소상공인 보증부 대출 일람표 HASH 생성   
api/lb/v1/osl301/grnyLnagAgrmNtx        온라인소상공인 보증부 대출 약정 통지        
api/lb/v1/osl301/grnyInfoDtl            온라인소상공인 보증부 대출 대출신청정보 조회    
api/lb/v1/osl302/loapIpif               온라인소상공인 보증부 대출 대출신청정보 입력  
api/lb/v1/osl302/sttxCnfa               온라인소상공인 보증부 대출 인지세 정보 조회  
api/lb/v1/osl302/sttxCnfaRgsn           온라인소상공인 보증부 대출 인지세 저장
api/lb/v1/osl303/loanConCnfa            온라인소상공인 보증부 대출 대출내용확인
api/lb/v1/osl304/fnlcLawCnfr            온라인소상공인 보증부 대출 금소법 대응 저장  
api/lb/v1/osl304/arsCrtcCretRgst        온라인소상공인 보증부 대출 ARS 인증 생성 요청
api/lb/v1/osl304/arsCrtcCnfa            온라인소상공인 보증부 대출 ARS 인증 확인    
api/lb/v1/osl305/nofcElddRgsn           온라인소상공인 보증부 대출 비대면전자약정서처리      
api/lb/v1/osl305/loex                   온라인소상공인 보증부 대출 대출실행    
api/lb/v1/osl305/loexFnsgInq            온라인소상공인 보증부 대출 대출실행 완료 조회          

*/
const base = process.env.REACT_APP_LRB_API_BASE;
const API = {
  COMMOM: {
    LOANPGSTINQ:                          `${base}/osl000/loanPgstInq`,
    LOAPSTTSINQ:                    `${base}/osl000/loapSttsInq`,
    MYLOANINQ:                      `${base}/osl000/myLoanInq`,

    //인증서
    PRE_SCPG:                       `${base}/osl102/getSignStepData`,
    SCPG:                           `${base}/osl103/scpg`,
    PRESCRGSN:                      `${base}/osl104/prescRgsn`,
    GNAP:                           `${base}/osl105/gnap`,
    RACERT:                         `${base}/osl001/raCert`
  },
  GUIDE: {
    
  },
  PREJUDGE: {
    CUSTAGREE_SPAG:                 `${base}/osl100/spag`,
    SUITTEST_SBNTPOPYINQ:           `${base}/osl101/sbntPopyInq`,
    SUITTEST_SBNTPOPYVRFC:          `${base}/osl101/sbntPopyVrfc`,
    DATACOLLECT_BSNFNOINQ:          `${base}/osl101/bsnfNoInq`,
    DATACOLLECT_GETCITYINQ:         `${base}/osl001/getCityInq`,
    DATACOLLECT_GETCOUNTYINQ:       `${base}/osl001/getCountyInq`,  
    DATACOLLECT_RSPLRGSN:           `${base}/osl102/rsplRgsn`,
    DOCSTATUS_SCPGPGRSHSTINQ:       `${base}/osl103/scpgPgrsHstInq`,
    DOCSTATUS_DBTOVRFC:             `${base}/osl103/dbtoVrfc`,
    CUSTINFOINPUT_CSINBSININQ:      `${base}/osl103/csinBsinInq`,
    CUSTINFOINPUT_CSINQRG:          `${base}/osl103/csinIqrg`,
    CUSTINFOINPUT_BOBINQ:           `${base}/osl103/bobInq`,
    CUSTINFOINPUT_BOBDTLINQ:        `${base}/osl103/bobDtlInq`,
    SUITRESULT_CMPBPOPYEXCNVRFCIQRG:`${base}/osl103/cmpbPopyExcnVrfcIqrg`,
    SUITRESULT_CMPBPOPYEXCNVRFCINQ: `${base}/osl103/cmpbPopyExcnVrfcInq`, 
    GRTINFOINPUT_GRNYEXTDATWRTN:    `${base}/osl104/grnyExntDatWrtn`,
    DOCNTXCHECK_SCPGNTX:            `${base}/osl104/scpgNtx`,
    DOCNTXCHECK_NOFCGTLNDOCSMYNINQ: `${base}/osl104/nofcGtlnDocSmynInq`,

    
  },
  LONEXECUTE: {
    APPRINFO_GRATDTLIQ:             `${base}/osl300/gratDtliq`,
    APPRINFO_GRNYVLDTVRFC:          `${base}/osl300/grnyVldtVrfc`,
    APPRINFO_SENDACNTSMS:           `${base}/osl300/sendAcntSms`,
    UNTACTAGRM_GRNYLNAGRGSN:        `${base}/osl301/grnyLnagRgsn`,
    UNTACTAGRM_GRNYLNAGAGRMNTX:     `${base}/osl301/grnyLnagAgrmNtx`,
    APPLYINFOINPUT_GRNYINFODTL:     `${base}/osl301/grnyInfoDtl`,
    APPLYINFOINPUT_ACNINQ:          `${base}/osl301/acnInq`,     
    APPLYINFOINPUT_LOAPIPIF:        `${base}/osl302/loapIpif`,
    STAMPTAX_STTXCNFA:              `${base}/osl302/sttxCnfa`,
    STAMPTAX_STTXCNFARGSN:          `${base}/osl302/sttxCnfaRgsn`,
    LONCONTENTCHECK_LONCONCNFA:     `${base}/osl303/loanConCnfa`,      
    AGRMINPUT:                      `${base}/osl`, 
    UNTACTAGRM_ACHLYNINQ:           `${base}/osl300/achlYnInq`,  
    SUCCRESULT:                     `${base}/osl`,  
    ARSCERTIFICATE_ARSCRTCCRETRGST: `${base}/osl304/arsCrtcCretRgst`,
    ARSCERTIFICATE_ARSCRTCCNFA:     `${base}/osl304/arsCrtcCnfa`,     
    FINANCECUSLAW_FNLCLAWCNFR:      `${base}/osl304/fnlcLawCnfr`,     
    RESULT_LOEX:                    `${base}/osl305/loex`,   
  },
  POSTMANAGEMENT: {
    REPAY:                          `${base}/osl`,     
    REVOKREPAY:                     `${base}/osl`, 
  },
  
}
export default API;