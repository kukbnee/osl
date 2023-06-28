/**
 * FullModal로 띄워야하는 화면 아래 function으로 생성하여 switch문에 추가
 */
import collectData from "../../modules/constants/collectData.js";


function GrtInfoInputModal() {

  return (
    <>
      <div className="content-top">
        <p className="top-tit"><strong>윤리 경영 실천</strong> 및 <strong>보증브로커</strong> <br /> <strong>피해예방</strong>을 위한 협조 확약</p>
      </div>

      <section className="section commitment">
        <div className="box-list-wrap">
          <div className="box-list-header">
            <h4 className="tit fc-gray">1. 윤리 경영 실천</h4>
            <button type="button" className="box-list-open">
              <span className="blind">접기</span>
            </button>
            <button type="button" className="box-list-hide blind">
              <span className="blind">접기</span>
            </button>
          </div>
          <div className="box-list-cont active">
            <p className="txt fc-lightGray">
            본인은 신용보증 신청 등과 관련하여 신용보증기금(이하 '신보')의 인권˚윤리경영 실천과 고객 및 신보 임직원 등의 인권보호에 적극 협조한다.<br />

본인은 신보 임직원 등에게 보증 청탁 및 금품, 선풀, 향응 등을 제공하지 않을 것 이며, 만약 신보 임직원등으로부터 금전거래, 금품, 선물, 향응 등을 요구받은 경우에는 즉시 신보의 인권윤리팀 또는 홈페이지 부패신고센터나 감사 제보센터에 신고한다.<br />

상기사항을 위반하여 발생하는 모든 피해 및 불이익은 본인이 책임지며 이의를 제기하지 않는다.<br />

신고자의 신분은 관련 법률과 신보의 내규에 따라 철저하게 보호됩니다.<br />
            </p>
          </div>
        </div>
        <div className="box-list-wrap">
          <div className="box-list-header">
            <h4 className="tit fc-gray">2. 보증브로커 피해예방</h4>
            <button type="button" className="box-list-open">
              <span className="blind">접기</span>
            </button>
            <button type="button" className="box-list-hide blind">
              <span className="blind">접기</span>
            </button>
          </div>
          <div className="box-list-cont active">
            <p className="txt fc-lightGray">
            본인은 보증의 알선을 목적으로 대가성 수수료를 요구하거나 허위자료작성 및 자료 위˚변조해주는 대가로 금품을 요구하는 보증브로커 등과 관련이 없으며, 만일 이에 해당되는 경우 보증전액해지, 신규보증 중단 등의 불이익을 받게 되어도 이의를 제기하지 않는다.<br />

*브로커 등 제3자 부당 개입 사건 신고: 홈페이지 부조리신고센터 또는 신보 VOC팀(1588-6565)<br />
            </p>
          </div>
        </div>
        <div className="box-list-wrap">
          <div className="box-list-header">
            <h4 className="tit fc-gray">3. 입력 내용 최종 확인</h4>
            <button type="button" className="box-list-open">
              <span className="blind">접기</span>
            </button>
            <button type="button" className="box-list-hide blind">
              <span className="blind">접기</span>
            </button>
          </div>
          <div className="box-list-cont active">
            <p className="txt fc-lightGray">
            조사자료 입력내용이 실제와 다를 경우 보증 신청이 거절될 수 있습니다.<br />

입력내용을 다시 한번 확인하시려면 취소 버튼을, 계속하여 보증을 신청하시려면 확인 버튼을 눌러 계속 진행해 주십시오.<br />
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function SelfCheckModal() {

  const jobData = collectData("job");


  return (
    <>
      <div className="container">
        <div className="content">
          <div className="content-body">
            <div className="content-top pad-b0">
              <div className="inp-block">
                <div className="inp-wrap">
                  <input type="text" className="inp type01 min-w-auto" placeholder="업종명" />
                </div>
                <button type="button" className="btn btn-md btn-default left-inp">
                  <span className="txt">검색</span>
                </button>
              </div>
            </div>
            <div className="section pad-0">
              <div className="tbl-wrapper">
                <table className="tbl-wrap">
                  <caption>
                    보증취업 제한 업종코드, 업종명 표
                  </caption>
                  <colgroup>
                    <col style={{ width: "100px" }} />
                    <col style={{ width: "auto" }} />
                  </colgroup>
                  <thead className="border">
                    <tr>
                      <th scope="col">업종 코드</th>
                      <th scope="col">업종명</th>
                    </tr>
                  </thead>

                  <tbody className="first-blue">
                    {jobData.map(function (data, idx) {
                      return (
                        <>
                          <tr>
                            <td>
                              <span className="txt-data">{data.code}</span>
                            </td>
                            <td>
                              <span className="txt-data">{data.value}</span>
                            </td>
                          </tr>
                        </>
                      )
                    })}
                  </tbody>

                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function EntrustAgreeModal() {
  return (
    <>
      <div className="content-top" style={{textAlign: "center", padding: "5px"}}>
        <p className="top-tit" style={{textDecorationLine: "underline"}}><b>고객정보 조회 위임 동의</b></p>
      </div>
      <div className="section">
        <p className="info-con-txt" style={{fontSize: "15px"}}>본인은 대출신청을 위하여 본인의 공동인증서를 정부24, 국세청(홈택스), 건강보험공단에 로그인 후 사업자번호, 성명, 부가세신고서, 매입매출 정보, 4대보험완납증명 등을 전자적 방식으로 조회, 수집 및 기업은행에 제공하는 것에 대해 이해하였으며 동의합니다.</p>
      </div>
      <div className ="section pad-1" style={{padding: "10px"}}>
        <div className ="box-cont">
          <div className ="b-title" style={{fontSize: "20px"}}><b>정보 제공에 관한 사항</b></div>
          <div className ="b-txt">
            <dl>
              <dt>위임받는자</dt>
              <dd>
                <ul className ="list-type01">
                  <li>중소기업은행</li>
                </ul>
              </dd>

              <dt>위임내용</dt>
              <dd>
                <ul className ="list-type01">
                  <li>정부24, 국세청(홈택스), 건강보험공단에 등록된 개인 및 사업자관련 정보에 대한 조회 및 활용(서류제출)</li>
                </ul>
              </dd>

              <dt>조회/수집 거래정보</dt>
              <dd>
                <ul className ="list-type01">
                  <li>사업자등록증명, 납세증명(국세), 지방세납세증명, 부가가치세과세표준증명(또는 면세사업자 수입금액증명), 부가가치세신고서, 매입매출처별세금계산서합계표, 표준재무제표증명, 4대보험완납증명, 주민등록등본, 주민등록초본</li>
                </ul>
              </dd>

              <dt>동의를 거부할 권리 및 동의를 거부할 경우의 불이익</dt>
              <dd>
                <ul className ="list-type01">
                  <li>위 거래정보 조회 위임 동의는 계약의 체결 및 이행을 위하여 필수적이므로 위 사항에 동의하셔야만 서비스 이용이 가능합니다.</li>
                </ul>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </>
  )
}


export const ModalContents = (props) => {
  switch (props.componentNm) {
    case "GrtInfoInputModal": return <GrtInfoInputModal />
    case "SelfCheckModal": return <SelfCheckModal />
    case "EntrustAgreeModal": return <EntrustAgreeModal />
    case "CustAgreeModal2": return <></>
    case "CustAgreeModal3": return <></>
    case "CustAgreeModal4": return <></>
    case "CustAgreeModal5": return <></>
    case "CustAgreeModal6": return <></>
    default: return null;
  }

}