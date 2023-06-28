import { Route, Routes } from "react-router";
import { lazy, Suspense } from 'react';
import Loading from './modules/components/Loading.js';
import Detail from './pages/guide/Detail.js';
import Ready from './pages/guide/Ready.js';
import ServiceError from './pages/common/ServiceError.js';
import SystemError from './pages/common/SystemError.js';
import PathConstants from './modules/constants/PathConstants.js';

const Redirect        = lazy(()=> import('./pages/common/Redirect.js'));
const Main            = lazy(()=> import('./pages/Main.js'));
const Progress        = lazy(()=> import('./pages/common/Progress.js'));
const DelfinoCheck    = lazy(()=> import('./pages/common/DelfinoCheck.js'));
const CheckView       = lazy(()=> import('./pages/common/delfino-check.js'));
const CustAgree       = lazy(()=> import('./pages/judge/prejudge/CustAgree.js'));
const SuitTest        = lazy(()=> import('./pages/judge/prejudge/SuitTest.js'));
const DataCollect     = lazy(()=> import('./pages/judge/prejudge/DataCollect.js'));
const CustInfoInput   = lazy(()=> import('./pages/judge/prejudge/CustInfoInput.js'));
const SuitResult      = lazy(()=> import('./pages/judge/prejudge/SuitResult.js'));
const DocStatus       = lazy(()=> import('./pages/judge/prejudge/DocStatus.js'));
const GrtInfoInput    = lazy(()=> import('./pages/judge/prejudge/GrtInfoInput.js'));
const DocNtxCheck     = lazy(()=> import('./pages/judge/prejudge/DocNtxCheck.js'));

const ApprInfo        = lazy(()=> import('./pages/lonexecute/ApprInfo.js'));
const UntactAgrm      = lazy(()=> import('./pages/lonexecute/UntactAgrm.js'));
const StampTax        = lazy(()=> import('./pages/lonexecute/StampTax.js'));
const ApplyInfoInput  = lazy(()=> import('./pages/lonexecute/ApplyInfoInput.js'));
const LonContentCheck = lazy(()=> import('./pages/lonexecute/LonContentCheck.js'));
const FinanceCusLaw   = lazy(()=> import('./pages/lonexecute/FinanceCusLaw.js'));
const ArsCertificate  = lazy(()=> import('./pages/lonexecute/ArsCertificate.js'));
const Result          = lazy(()=> import('./pages/lonexecute/Result.js'));

//라우터 목록 정의
function Routing() {

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path={PathConstants.SERVICE_ERROR} element={<ServiceError headerNm="서비스 장애" />} />
        <Route path={PathConstants.SYSTEM_ERROR} element={<SystemError />} />
        <Route path={PathConstants.REDIRECT} element={<Redirect />} />
        <Route path={`${PathConstants.REDIRECT}:type`} element={<Redirect />} />
        <Route path={PathConstants.MAIN} element={<Main />} />
        <Route path={PathConstants.PROGRESS} element={<Progress headerNm={PathConstants.PROGRESS_NM} />} />
        
        <Route path="/checkView" element={<CheckView />} />
        <Route path={PathConstants.CERTIFICATE_SCRP} element={<DelfinoCheck headerNm={PathConstants.CERTIFICATE_SCRP_NM} certType="scrp" />} />
        <Route path={PathConstants.CERTIFICATE_CERT} element={<DelfinoCheck headerNm={PathConstants.CERTIFICATE_NM} certType="cert" />} />
        <Route path={PathConstants.CERTIFICATE_SIGN} element={<DelfinoCheck headerNm={PathConstants.CERTIFICATE_SIGN_NM} certType="sign" />} />
        
        <Route path={PathConstants.GUIDE_DETAIL} element={<Detail headerNm={PathConstants.GUIDE_DETAIL_NM} />} />
        <Route path={PathConstants.GUIDE_READY} element={<Ready headerNm={PathConstants.GUIDE_READY_NM} />} />
        <Route path={PathConstants.PREJUDGE_CUSTAGREE} element={<CustAgree headerNm={PathConstants.PREJUDGE_CUSTAGREE_NM} />} />
        <Route path={PathConstants.PREJUDGE_SUITTEST} element={<SuitTest headerNm={PathConstants.PREJUDGE_SUITTEST_NM} />} />
        <Route path={PathConstants.PREJUDGE_DATACOLLECT} element={<DataCollect headerNm={PathConstants.PREJUDGE_DATACOLLECT_NM} />} />
        <Route path={PathConstants.PREJUDGE_DOCSTATUS} element={<DocStatus headerNm={PathConstants.PREJUDGE_DOCSTATUS_NM} />} />
        <Route path={PathConstants.PREJUDGE_CUSTINFOINPUT} element={<CustInfoInput headerNm={PathConstants.PREJUDGE_CUSTINFOINPUT_NM} />} />
        <Route path={PathConstants.PREJUDGE_SUITRESULT} element={<SuitResult headerNm={PathConstants.PREJUDGE_SUITRESULT_NM} />} />
        <Route path={PathConstants.PREJUDGE_GRTINFOINPUT} element={<GrtInfoInput headerNm={PathConstants.PREJUDGE_GRTINFOINPUT_NM} />} />
        <Route path={PathConstants.PREJUDGE_DOCTXCHECK} element={<DocNtxCheck headerNm={PathConstants.PREJUDGE_DOCTXCHECK_NM} />} />

        <Route path={PathConstants.LONEXECUTE_APPRINFO} element={<ApprInfo headerNm={PathConstants.LONEXECUTE_APPRINFO_NM} />} />
        <Route path={PathConstants.LONEXECUTE_UNTACTAGRM} element={<UntactAgrm headerNm={PathConstants.LONEXECUTE_UNTACTAGRM_NM} />} />
        <Route path={PathConstants.LONEXECUTE_STAMPTAX} element={<StampTax headerNm={PathConstants.LONEXECUTE_STAMPTAX_NM} />} />
        <Route path={PathConstants.LONEXECUTE_APPLYINFOINPUT} element={<ApplyInfoInput headerNm={PathConstants.LONEXECUTE_APPLYINFOINPUT_NM} />} />
        <Route path={PathConstants.LONEXECUTE_LONCONTENTCHECK} element={<LonContentCheck headerNm={PathConstants.LONEXECUTE_LONCONTENTCHECK_NM} />} />
        <Route path={PathConstants.LONEXECUTE_FINANCECUSLAW} element={<FinanceCusLaw headerNm={PathConstants.LONEXECUTE_FINANCECUSLAW_NM} />} />
        <Route path={PathConstants.LONEXECUTE_ARSCERTIFICATE} element={<ArsCertificate headerNm={PathConstants.LONEXECUTE_ARSCERTIFICATE_NM} />} />
        <Route path={PathConstants.LONEXECUTE_SUCCRESULT} element={<Result headerNm={PathConstants.LONEXECUTE_SUCCRESULT_NM} />} />
        
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </Suspense>
  );

}

export default Routing;
