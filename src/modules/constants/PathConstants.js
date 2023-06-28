/**
 * 라우팅 Path정의
 */
const PathConstants = {
  //진행상태조회
  //안내
    //상품안내
    //대출신청 전 사전준비안내
  //사전심사
    //심사준비: 고객동의(pdf)
    //(공통API)공동인증서
    //심사준비: 적합성 적정성 확인
    //심사준비: 적합성 적정성 결과
    //심사준비: 자가진단
    //사전심사자료작성(보증신청정보입력) (공통API)스크래핑?
    //스크래핑 서류제출상태
    //(진행상태)사전심사 상태/결과
  //보증심사
    //(진행상태)보증심사 상태/결과
    //보증승인내역 확인
    //(공통API)계좌개설
  //대출실행
    //대출신청서작성 및 실행요청
    //여신거래약정서 작성
    //비대면 약정
    //(공통API)공동인증서
    //대출 실행 결과
  //사후관리
    //(진행상태)대출현황 조회
    //대출상환
    //대출계약 철회 후 상환
    //대출계약 미철회 상환(일반상환)
  
  //depth 1
  INDEX: '/guide/index', //첫페이지
  MAIN: '/main',
  REDIRECT: '/',
  REDIRECT_REFRESH: '/refresh',
  REDIRECT_FIRST: '/first',
  REDIRECT_EXPIRE: '/expire',
  PROGRESS: '/progress', //진행상태
  SERVICE_ERROR: '/serviceerror', //일시적 서비스 장애
  SYSTEM_ERROR: '/systemerror', //시스템 점검
  CERTIFICATE_CERT: '/certificate/cert', // 브라우저인증서
  CERTIFICATE_SIGN: '/certificate/sign',
  CERTIFICATE_SCRP: '/certificate/scrp',
    //dummy
  GUIDE: '/guide',  //안내
  PREJUDGE: '/prejudge',  //사전심사
  GRTJUDGE: '/grtjudge', //보증심사
  LONAPPLY: '/lonapply', //대출신청
  LONEXECUTE: '/lonexecute', //대출실행
  POSTMANAGEMENT: '/postmanagement', //사후관리

  //depth2
  ERROR_SERVICEERROR: '/error/serviceerror', //일시적 서비스 장애
  ERROR_SYSTEMINSPECT: '/error/systeminspect', //시스템 점검
  GUIDE_DETAIL: '/guide/detail',  //상품안내
  GUIDE_READY: '/guide/ready',  //대출신청 전 사전준비안내

  PREJUDGE_CUSTAGREE: '/prejudge/custagree',  //고객동의
  PREJUDGE_SUITTEST: '/prejudge/suittest',  //적합성적정성검사
  PREJUDGE_SUITRESULT: '/prejudge/suitresult',  //적합성적정성결과
  PREJUDGE_SELFCHECK: '/prejudge/selfcheck',  //자가진단
  PREJUDGE_GRTINFOINPUT: '/prejudge/grtinfoinput',  //보증심사자료작성
  PREJUDGE_DOCSTATUS: '/prejudge/docstatus',  //자료수집상태
  PREJUDGE_DATACOLLECT: '/prejudge/datacollect', //사업자번호, 행정구역 주소지 입력
  PREJUDGE_CUSTINFOINPUT: '/prejudge/custinfoinput', //고객정보 입력
  PREJUDGE_DOCTXCHECK: '/prejudge/docntxcheck', //스크래핑통지 확인 및 재통지
  
  GRTJUDGE_ACCOPEN: '/grtjudge/accopen',  //개좌개설

  LONEXECUTE_APPRINFO: '/lonexecute/apprinfo',  //보증승인내역 확인
  LONEXECUTE_APPLYINFOINPUT: '/lonexecute/applyinfoinput',  //대출신청서작성 및 실행요청
  LONEXECUTE_STAMPTAX: '/lonexecute/stamptax', // 인지세 확인
  LONEXECUTE_LONCONTENTCHECK: '/lonexecute/loncontentcheck', //대출 내용 최종 확인
  LONEXECUTE_UNTACTAGRM: '/lonexecute/untactagrm',  //대출 약관 동의
  LONEXECUTE_SUCCRESULT: '/lonexecute/result',  //대출실행결과
  LONEXECUTE_ARSCERTIFICATE: '/lonexecute/arscertificate', // ARS인증
  LONEXECUTE_FINANCECUSLAW: '/lonexecute/financecuslaw', // 금융소비자법 대응

  POSTMANAGEMENT_REPAY: '/postmanagement/repay',  //대출상환
  POSTMANAGEMENT_REVOKREPAY: '/postmanagement/revokrepay', //계약철회 후 상환

  CERTIFICATE_SCRP_NM: '스크래핑', //공동인증서
  CERTIFICATE_SIGN_NM: '전자서명', //전자서명
  PROGRESS_NM: '진행현황', //진행상태
  GUIDE_DETAIL_NM: '상품안내',  //상품안내
  GUIDE_READY_NM: '대출신청 전 사전준비안내',  //대출신청 전 사전준비안내

  PREJUDGE_CUSTAGREE_NM: '고객동의',  //고객동의
  PREJUDGE_SUITTEST_NM: '적합성적정성검사',  //적합성적정성검사
  PREJUDGE_SUITRESULT_NM: '적합성적정성결과',  //적합성적정성결과
  PREJUDGE_SELFCHECK_NM: '자가진단',  //자가진단
  PREJUDGE_GRTINFOINPUT_NM: '보증심사자료 작성',  //보증심사자료작성
  PREJUDGE_DOCSTATUS_NM: '자료수집상태',  //자료수집상태
  PREJUDGE_DATACOLLECT_NM: '자료수집', //사업자번호, 행정구역 주소지 입력
  PREJUDGE_CUSTINFOINPUT_NM: '고객정보 및 관리영업점 확인',
  PREJUDGE_DOCTXCHECK_NM: '서류통지상태',
  
  GRTJUDGE_ACCOPEN_NM: '계좌개설',  //개좌개설

  LONEXECUTE_APPRINFO_NM: '보증승인내역 확인',  //보증승인내역 확인
  LONEXECUTE_APPLYINFOINPUT_NM: '대출신청서작성 및 실행요청',  //대출신청서작성 및 실행요청
  LONEXECUTE_STAMPTAX_NM: '대출 실행', //인지세 확인
  LONEXECUTE_LONCONTENTCHECK_NM: '대출 실행', // 대출 내용 최종 확인
  LONEXECUTE_UNTACTAGRM_NM: '비대면 약정',  //대출 약관 동의
  LONEXECUTE_SUCCRESULT_NM: '대출실행결과',  //대출실행결과
  LONEXECUTE_ARSCERTIFICATE_NM: '대출 신청', // ARS인증
  LONEXECUTE_FINANCECUSLAW_NM: '중요사항 안내 확인', // 금융소비자법 대응

  POSTMANAGEMENT_REPAY_NM: '대출상환',  //대출상환
  POSTMANAGEMENT_REVOKREPAY_NM: '계약철회 후 상환' //계약철회 후 상환

}

export default PathConstants;