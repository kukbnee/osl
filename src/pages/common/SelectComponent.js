/**
 * 
 * @param {*} props 
 * showYn
 * selectData
 * styleSeleList
 * @returns 
 */
function SelectComponent(props) {
  const objSelectData = props.selectData;
  if(props.showYn) {
    return (
    <div className={props.styleSeleList}>
      <div className="item">
        <label className="ui-select">
          <select 
            name="sSel" 
            id="sSel1" 
            onChange={(e) => {
              props.onChangeFn(e.target.value);
            }}>
          {
            objSelectData.selectList.map((data, idx)=>{
              return (
                <option key={idx} value={data.value}>{data.name}</option>
              )
            })
          }    
          </select>
          <span></span>
        </label>
      </div>
    </div>
    );
  }else {
    return null;
  }
}
export default SelectComponent;