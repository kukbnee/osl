/**
 * 
 * @param {*} props 
 * styleMark
 * tabList[{id,link,name}]
 * @returns 
 */
function TabComponent(props) {
  let tabIdx = props.tabIdx;
  if(typeof props.tabIdx === "string") {
    if(props.tabIdx.length > 1) {
      tabIdx = parseInt(props.tabIdx.substring(0,1));
    }
  }
  return (
    <div className="tab-wrapper fixed">
      <ul className="tab-list-wrap">
        {
          props.tabList.map((data, idx)=> {
            let liStyle = "";
            let spanStyle = "";
            if(tabIdx===idx) liStyle = " on";
            if(false) spanStyle = " state-mark s-red";
            return (
              <li key={`key-${idx}`} className={`item${liStyle}`}>
                <a onClick={()=> {
                  props.setTabIdx(idx);
                }} className="item-cont">
                    <span className={`tab-txt${spanStyle}`}>{data.name}</span>
                </a>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default TabComponent;