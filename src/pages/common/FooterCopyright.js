function FooterCopyright() {
  const copy = {
    padding: "5.56vw 0",
    borderTop: "0.28vw solid #dbdbdb",
    fontSize: "3.06vw",
    textAlign: "center",
    color: "#666",
  };
  const copytxt = {
    marginBottom: "2.78vw",
  };
  const copytxt2 = {
    marginBottom: "0",
  };
  const copyTt = {
    color: "#333",
    fontWeight: "bold",
    marginLeft: "2.78vw",
  };
  const copySpan = {
    fontWeight: "bold",
    fontSize: "4vw"
  }  
  return (
    //이용약관(https://ibkbox.net/CMS309/onload.do?dcffStplId=10005&dcffStplDtlSqn=1)  개인정보처리방침(https://ibkbox.net/CMS309/onload.do?dcffStplId=10027&dcffStplDtlSqn=1)  상품공시실(https://www.ibk.co.kr/common/navigation.ibk?linkUrl=/customer/disclosure/disclosure_info.jsp&pageId=CM01030200)  인증센터(https://ibkbox.net/ACC001/index.do)  권익위부패·공익신고(https://acrc.go.kr)
    <>
    <div style={copy}>
      <p style={copytxt2}>
        <span style={copySpan} onClick={()=> {window.location.href="https://ibkbox.net/CMS309/onload.do?dcffStplId=10005&dcffStplDtlSqn=1"}}>이용약관</span>&nbsp; &nbsp; &nbsp; &nbsp;
        <span style={copySpan} onClick={()=> {window.location.href="https://ibkbox.net/CMS309/onload.do?dcffStplId=10027&dcffStplDtlSqn=1"}}>개인정보처리방침</span>&nbsp; &nbsp; &nbsp; &nbsp;
        <span style={copySpan} onClick={()=> {window.location.href="https://www.ibk.co.kr/common/navigation.ibk?linkUrl=/customer/disclosure/disclosure_info.jsp&pageId=CM01030200"}}>상품공시실</span>&nbsp; &nbsp; &nbsp; &nbsp;<br /><br />
        <span style={copySpan} onClick={()=> {window.location.href="https://ibkbox.net/ACC001/index.do"}}>인증센터</span>&nbsp; &nbsp; &nbsp; &nbsp;
        <span style={copySpan} onClick={()=> {window.location.href="https://acrc.go.kr"}}>권익위부패·공익신고</span>
      </p>
    </div>
    <div style={copy}>
      <p style={copytxt}>
        <span style={copyTt}>주소</span> <span>서울특별시 중구 을지로 79</span>
        <span style={copyTt}>대표명</span> 김성태 <br /><br />
        <span style={copyTt}>대표전화</span> (02) 729-7633
        <span style={copyTt}>사업자등록번호</span> 202-81-00978<br /><br />
        <span style={copyTt}>통신판매번호</span> 2010-서울중구-1163<br /><br />
        <span style={copyTt}>고객센터</span> 1566-2566 (운영시간: 09:30~17:00)
      </p>
      Copyright ⓒ IBK(INDUSTRIAL BANK OF KOREA).<br />All rights reserved.
    </div>
    </>
  )
}

export default FooterCopyright;