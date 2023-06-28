/**
 * 금액 콤마 삽입
 * @param {} x 
 * @returns 10,000,000
 */
export const getCommaAmt = (x)=> {
  if(!x) return "";
	var resultVal = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return resultVal;
}

/**
 * 날짜 점 삽입
 * @param {*} x 
 * @returns yyyy.mm.dd
 */
export const getDotYmd = (x)=> {
  console.log("getDotYmd", x);
  if(!x) return "";
  if(x.length !== 8) return x;
  else return x.substring(0, 4) + "." + x.substring(4,6) + "." + x.substring(6,8)
}

/**
 * 사업자번호 대쉬 삽입
 * @param {} x 
 * @returns 
 */
export const getBsnn = (x)=> {
  if(!x) return "";
  if(x.length !== 10)  {
    return x;
  } else {
    console.log("subs > ", x.substring(0, 5) + "-" + x.substring(5))
    return x.substring(0, 3) + "-" + x.substring(3,5) + "-" + x.substring(5,10);
  }
}

/**
 * 만나이 계산
 * @param {*} bStr 
 * @returns 
 */
export const getAge = (bStr)=> {
  console.log(bStr)
  var today = new Date();
  var birthDate = getDate(bStr);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if( m<0 || (m===0 && today.getDate() < birthDate.getDate())){
    age--;
  }
  return age;
}
function getDate(yyyymmdd){
  let idx = 4
  let len = yyyymmdd.length;
  if(len === 6) idx = 2;
  else if(len !== 8) console.log("잘못된 생년월일");
  var year = yyyymmdd.substring(0,idx);
  var month = yyyymmdd.substring(idx,idx+2);
  var day = yyyymmdd.substring(idx+2,idx+4);
  return new Date(Number(year), Number(month), Number(day)); 
}

/**
 * 단어별 맞춤 조사 선택을 위한 함수
 * @param {*} word 
 * @returns 
 */
export const checkBatchimEnding = (word)=> {
  if (typeof word !== 'string') return null;

  var lastLetter = word[word.length - 1];
  var uni = lastLetter.charCodeAt(0);

  if (uni < 44032 || uni > 55203) return null;

  return (uni - 44032) % 28 != 0;
}

/**
 * 매출액 전기 당기 추출을 위한 yyyy값 리턴(수정가능성있음)
 * @returns 
 */
export const getYear = ()=> {
  var today = new Date();
  return today.getFullYear();
}
 
export const getEncode = (str) => {
 let encodeValue = encodeURIComponent(str)
    .replace(/\-/g, "%2D")
    .replace(/\_/g, "%5F")
    .replace(/\./g, "%2E")
    .replace(/\!/g, "%21")
    .replace(/\~/g, "%7E")
    .replace(/\*/g, "%2A")
    .replace(/\'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
  return encodeValue;
}
