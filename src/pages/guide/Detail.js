import { useNavigate } from "react-router";
import OslHeader from "../../modules/components/OslHeader";
import OslBtn from "../../modules/components/OslBtn";
import PathConstants from "../../modules/constants/PathConstants";
import collectData from "../../modules/constants/collectData";
import { getCommaAmt } from "../../modules/utils/util";
import FooterCopyright from "../common/FooterCopyright";
import { useEffect, useLayoutEffect, useState } from "react";

const detailData = collectData("detail");

/**
 * 컴포넌트명 : 상품안내(첫페이지)
 * 설명 : 내용확인후 사전준비안내 화면 이동
 * @param {*} props
 * props항목별 설명
 * process
 * 다음버튼 클릭시 토큰체크 및 상태체크를 위해 Redirct.js로 이동
 */
function Detail(props) {
  let navigate = useNavigate();

  function cbOslBtn() {
    navigate(PathConstants.REDIRECT);
  }
  const data = detailData;

  //당일 날짜
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const currentDay = year + "." + month + "." + day;

  return (
    <>
      {(!!props.headerNm) && <OslHeader headerNm={props.headerNm} />}
      <div className="container">
        <div className="content">
          <div className="content-body">
            <div className="content-top">
              <p className="top-tit">
                <b>e커머스 소상공인<br />성공 보증부대출</b>
              </p>
              <p className="top-desc">
                {/* 상품특징: 네이버 스마트스토어 개인사업자의 사업성공을 응원하는 비대면 전용 보증부 대출 */}
                <span className="fc-p">IBK기업은행</span>과 <span className="fc-p">신용보증기금</span>의 업무협약을 통해 출시한 개인사업자 <span className="fc-p">비대면 전용 상품</span>
              </p>
            </div>
            <div className="section pad-b40">
              <div className="loan-amount">
                <div className="txt-won">
                  <i className="ico-won"></i> 금액
                  <p className="num"><strong>최대 {getCommaAmt(data.loanMn)}</strong> 원</p>
                </div>
                <div className="txt-rate">
                  <i className="ico-rate"></i>금리 : {data.lendrate} %
                </div>
              </div>
            </div>
            <div className="section pad-0">
              <div className="box-cont">
                <div className="b-title">상품 요약</div>
                <div className="b-txt">
                  <dl>
                    <dt>대출대상</dt>
                    <dd>
                      <ul className="list-type00">
                        <li>- 다음의 조건을 모두 충족하는 개인사업자</li>
                        <li>➊ 네이버 스토어 입점 6개월 이상 & 매출 3개월 연속 50만원 이상</li>
                        <li>➋ 당행 신용등급 B이상</li>
                        <li>➌ 사업자등록증명원상 개업년월일 6개월 이상 경과</li>
                      </ul>
                    </dd>

                    <dt>제외대상</dt>
                    <dd>
                      <ul className="list-type00">
                        <li>➊ IBK기업은행 내규 및 신용보증기금에서 정한 취급제한 사유에 해당하는 기업</li>
                        <li>➋ 공동사업자</li>
                      </ul>
                    </dd>

                    <dt>대출기간</dt>
                    <dd>
                      <ul className="list-type00">
                        <li>- 5년(1년 거치) 또는 8년(3년 거치)</li>
                      </ul>
                    </dd>

                    {/* <dt>자금 용도</dt>
                      <dd>
                        <ul className ="list-type00">
                          <li>사업장 운영자금</li>
                        </ul>
                      </dd>

                      <dt>대출 과목</dt>
                      <dd>
                        <ul className ="list-type00">
                          <li>최대 8년 이내(3년 거치 5년 균등분할)</li>
                        </ul>
                      </dd>

                      <dt>서비스 이용시간 (은행 영업일만 가능)</dt>
                      <dd>
                        <ul className ="list-type00">
                          <li>09:30 ~ 17:00<br /><span className ="sTxt1">※ 고객센터 : 02-729-7633</span></li>
                        </ul>
                      </dd> */}

                  </dl>
                </div>
              </div>

              <div className="box-cont">
                <div className="b-title">대출 정보</div>
                <div className="b-txt">
                  <dl>
                    {/* <dt>대출한도</dt>
                      <dd>
                        <ul className ="list-type00">
                          <li>최대 1억원 (90% 신용보증기금 보증서)</li>
                        </ul>
                      </dd> */}

                    <dt>대출금리</dt>
                    <dd>
                      <ul className="list-type00">
                        <li><strong>▪ 금리우대 : </strong>최저 1.0%p ~ 최고 1.5%p 자동감면</li>
                        <li>- 당행 신용등급 및 e 커머스 판매활동 등급*에 따라 상이</li>
                        <li>* 플랫폼에서 생성된 판매활동정보(주문, 결제, 배송내역 등)를 평가하여 산출</li>

                        <li><strong>▪ 금리예시 : </strong>최저 연 4.76% ~ 최고 연 5.97% (2023.4.17. 기준)</li>
                        <li>* 기준금리 (연 3.43%) + 가산금리(연 2.83%p~3.54%p) - 감면금리(연 1.0%p~1.5%p)</li>
                        <li>* 산출기준 : 대출금액 1억원/대출기간 8년/변동금리(3월)/신용등급 AAA+~B급/변동금리(3월)/90%부분신용 보증/원금균등상환/운전자금</li>
                        <li>* 적용금리는 고객의 신용등급, 기여도 및 시장금리 등에 따라 변동 가능</li>

                        <li><strong>▪ 금리종류 : </strong>변동금리(KORIBOR 3,6,12월물)</li>
                      </ul>
                    </dd>

                    <dt>연체이자<br />(지연배상금)</dt>
                    <dd>
                      <ul className="list-type00">
                        <li><strong>▪ 연체이자율 : </strong>대출이자율에 연체가산금리 연 3%를 더하여 적용(단, 최고 연체이자율 연 11%)</li>
                        <li>- 「이자를 납입하기로 약정한 날」에 납입하지 아니한 때 : 이자를 납입하여야 할 날의 다음날부터 14일까
                          지는 내셔야할 약정이자에 대해 연체이자가 적용되고, 14일이 경과되면 대출원금에 대한 연체이자를 내
                          셔야 합니다.</li>
                        <li>- 「원금을 상환하기로 약정한 날」에 상환하지 아니한 때 : 원금을 상환하여야 할 날의 다음날부터는 대출원
                          금에 대한 연체이자를 내셔야 합니다.</li>
                        <li>- 「분할상환금(또는 분할상환 원리금)을 상환하기로 한 날」에 상환하지 아니한 때 : 분할상환원금(또는 분할
                          상한원리금)을 상환하여야 할 날의 다음날부터는 해당 분할상환원금(또는 분할상환원리금)에 대한 연체이
                          자를 내셔야 하며, 2회이상 연속하여 지체한 때에는 대출원금잔액에 대한 연체이자를 내셔야 합니다.</li>
                        <li>- 기타 은행여신거래기본약관 제7조에서 정한 대출기한 전의 채무변제의무 사유에 해당되어 기한의 이익이
                          상실된 때 : 기한의 이익이 상실되는 날부터 대출원금에 대한 연체이자를 내셔야 합니다.</li>
                      </ul>
                    </dd>

                    <dt>이자계산방법</dt>
                    <dd>
                      <ul className="list-type00">
                        <li>- 1년을 365일(윤년은 366일)로 보고 1일 단위로 계산</li>
                      </ul>
                    </dd>

                    <dt>자금용도</dt>
                    <dd>
                      <ul className="list-type00">
                        <li><strong>▪ 운전자금</strong>(수시로대출 제외)</li>
                      </ul>
                    </dd>

                    <dt>담보여부</dt>
                    <dd>
                      <ul className="list-type00">
                        <li>▪ 90% 부분신용보증서 담보</li>
                      </ul>
                    </dd>

                    <dt>상환방법</dt>
                    <dd>
                      <ul className="list-type00">
                        <li>▪ 원금균등분할상환 : 매 1월, 3월, 6월 중 선택하여 대출금 분할상환</li>
                        <li>※ 이자는 매 1월 단위로 약정납입일에 후취</li>
                        <li>※ 여신만료일(분할상환금 상환일포함) 및 이자지급시기 등이 은행휴무일휴일(법정공휴일, 대체공휴일, 토요일
                          및 근로자의 날 포함)인 경우에는 다음 영업일로 연기</li>
                      </ul>
                    </dd>

                    <dt>부대비용</dt>
                    <dd>
                      <ul className="list-type00">
                        <li>▪ 인지세 : 5천만원 이하 비과세 / 1억원 이하 7만원(고객 3.5만원, 은행 3.5만원)</li>
                        <li>▪ 보증료율 : 연 0.8% ~ 1.5%(신용보증기금의 대안평가모형등급에 따라 상이)</li>
                      </ul>
                    </dd>

                    <dt>중도상환해약금</dt>
                    <dd>
                      <ul className="list-type00">
                        <li>▪ 중도상환해약금 : 면제</li>
                      </ul>
                    </dd>

                    <dt>필요서류</dt>
                    <dd>
                      <ul className="list-type00">
                        <li>- 사업자등록증명원</li>
                        <li>- 부가세과세표준증명</li>
                        <li>- 면세사업자수입금액증명</li>
                        <li>- 부가세신고서</li>
                        <li>- 매입매출처별합계표</li>
                        <li>- 재무제표</li>
                        <li>- 국세납세증명</li>
                        <li>- 지방세납세증명</li>
                        <li>- 4대보험완납증명</li>
                        <li>- 주민등록등본</li>
                        <li>- 주민등록초본</li>
                        <li>* 단, 상기 서류는 스크래핑 방식으로 자동제출</li>
                      </ul>
                    </dd>

                    {/* <dt>금융지원 제외대상</dt>
                      <dd>
                        <ul className ="list-type00">
                          <li>휴∙폐업 중인 기업</li>
                          <li>연체대출금 보유 또는 국세∙지방세 체납기업</li>
                          <li>보증 제한업종을 영위하는 기업(도박, 유흥, 오락, 점술 등)</li>
                          <li>기타 신용상태가 불량하다고 판단되는 기업</li>
                          <li>개업일 1년 이하 기업(심사일 기준 경과 여부)</li>
                          <li>금년도 부가세 신고금액이 0원인 기업(간이과세자/면세사업자는 전년도)</li>
                          <li>대표자 개인신용평점 745점 미만 기업(NICE사 기준)</li>
                          <li>신용보증기금 및 기술보증기금 동시 이용중인 기업</li>
                          <li>중앙회 개인보증 이용기업</li>
                          <li>신용관리대상정보 등재 중인 기업</li>
                          <li>보증기관의 보증사고 관련자(사고 및 대위변제)</li>
                          <li>대표자 자가소유 부동산이 권리침해 (가압류 및 가처분 등) 등재</li>
                        </ul>
                      </dd> */}
                  </dl>
                </div>
              </div>

              <div className="box-cont">
                <div className="b-title">유의사항</div>
                <div className="b-txt pad-b0">
                  <ul className="list-type00">
                    <li>- 만기 경과후 기한의 이익상실에 대한 안내 : 만기일 경과 후 대출금액을 전액 상환하지 않거나, 기한연장
                      하지 않은 경우, 은행여신거래기본약관(기업용) 제7조에 따라 기한의 이익이 상실되어 대출잔액에 대한
                      지연배상금이 부과됩니다. 연체가 계속되는 경우, 「신용정보의 이용 및 보호에 관한 법률」과 「신용정보
                      관리규약」에 의해 신용관리대상자로 등록되어 금융 불이익을 받을 수 있습니다.</li>
                    <li>- 고객에게 발생할 수 있는 불이익 : 해당사항 없음</li>
                  </ul>
                </div>
              </div>
              <div className="box-cont">
                <div className="b-title">기타 안내사항</div>
                <div className="b-txt pad-b0">
                  <ul className="list-type00">
                    <li>- 계약사항은 은행여신거래기본약관(기업용) 및 여신거래약정서 내용에 따르며, 추가약정이 필요한 계약사
                      항의 경우 추가약정서 작성 또는 여신거래약정서 내 특약사항 작성을 통해 계약함</li>
                  </ul>
                  <div className="txt-greyBox mar-t30">
                    <ul className="list-type02 pad-t10">
                      <li>상환능력에 비해 대출금이 과도할 경우, 귀하의 개인신용평점이 하락할 수 있습니다.</li>
                      <li>개인신용평점 하락 시 금융거래와 관련된 불이익이 발생할 수 있습니다.</li>
                      <li>일정기간 대출 원리금을 연체할 경우, 모든 원리금을 변제할 의무가 발생할 수 있습니다.</li>
                      <li>대출취급이 부적정한 경우(연체금 보유, 신용 점수 등 낮음) 대출이 제한될 수 있습니다.</li>
                      <li>담보 물건, 담보종류 등에 따라 대출조건이 차등 적용되며, 담보물이 부적합할 경우 대출이 제한될 수 있습니다.</li>
                    </ul>
                    <ul className="list-type03 pad-t10">
                      <li>계약을 체결하기 전에 상품(서비스)설명서 및 약관을 반드시 확인하시기 바랍니다.</li>
                      <li>일반금융소비자는 ⎡금융소비자 보호에 관한 법률⎦ 제19조 제1항에 따라 IBK기업은행으로부터 충분히 설명을 받을 권리가 있으며, 그 설명을 이해한 후 거래하시기 바랍니다.</li>
                      <li>자세한 문의는 거래 영업점 또는 고객센터(1566-2566)로 문의주시기 바랍니다.</li>
                      <li>IBK기업은행은 금품,향응을 받지 않습니다. 윤리경영 위반 사실이나 개선이 필요한 경우 신고해주시기 바랍니다.<br />(☎︎ 02-729-7490, e-mail: ibkethics@ibk.co.kr)</li>
                    </ul>
                    <p>준법감시인 심의필 : 제2021-3154호(2021.08.26)</p>
                    <p>유효기간(2022.08.26)</p>
                    <p>{currentDay}</p>
                  </div>
                </div>
              </div>
              <FooterCopyright />
            </div>
            <OslBtn
              obj={{
                type: "button",
                disabled: false,
                text: ["진행"],
                link: "",
                callbackId: cbOslBtn
              }} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Detail;