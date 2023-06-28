/** 
 * import 순서
 * react hook, custom hook, 
 * external component(module), 
 * internal component(module), 
 * data, 
 * css
 */

/**
 * 화면명 : 일시적인 서비스 장애
 * 설명 : 
 * @param {*} props
 * props항목별 설명
 */
function ServiceError() {
  return (
    <>
      <div class="wrapper">

        <div class="container">
          <div class="content">
            <div class="content-body error">
              <div class="content-top">
                <p class="top-tit"><b>일시적인</b><br /><b>서비스 장애</b>입니다.</p>
              </div>
              <div class="section line-tf4">
                <p class="fs18 lh30">불편을 드려 죄송합니다.<br />다시 시도해주세요.</p>
              </div>
            </div>
            <div class="content-footer">
              <button type="button" class="btn btn-lg default-bg">
                <span class="txt">홈으로</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
export default ServiceError;