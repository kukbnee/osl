
/**
 * li 하위 타이틀 컴포넌트
 * @param {*} props \
 * showYn
 * title
 * styleTxt
 * @returns 
 */
function TitleComponent(props) {
  if(props.showYn) {
    return (
      <div className="question-wrap txt-wrap">
        <p className={props.styleTxt}>
          {props.title}
        </p>
      </div>
    );
  }else {
    return null;
  }
}

export default TitleComponent;