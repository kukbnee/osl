/** 
 * import 순서
 * react hook, custom hook, 
 * external component(module), 
 * internal component(module), 
 * data, 
 * css
 */

/**
 * 화면명 : 시스템 점검
 * 설명 : 
 * @param {*} props
 * props항목별 설명
 */
function SystemInspect() {
  return (
    <>
      <div class="wrapper">
        <header class="header-wrap">
          <div class="header">
            <button type="button" class="btn btn-close">
              <span class="blind">닫기</span>
            </button>
          </div>
        </header>

        <div class="container">
          <div class="content">
            <div class="content-body system-check">
              <div class="content-top">
                <p class="top-tit"><b>시스템</b><br /><b>점검</b> 중입니다.</p>
              </div>
              <div class="section line-tf4">
                <p class="fs18 lh30">죄송합니다.<br />시스템 긴급점검으로 현재 서비스를 이용할 수 없습니다. 잠시 후에 다시 이용해 주시기 바랍니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default SystemInspect;