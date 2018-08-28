import React from 'react';
import barGraphIcon from './img/barGraph_icon.svg'

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const BarGraphIcon = (props) => {
  return(
    <div className="manage-bills-div" onClick={(e) => props.props.changePage('/managebills')}>
      <img alt="manage bills button" className="manage-bills-button" src={barGraphIcon} />
    </div>
  )
}

export const ResourceTitleDash = (props) => {
  if(props.resourceType === "gas"){
    return(
      <div className="data-title-container">
        <h6 className="data-title">Heat</h6>
        <BarGraphIcon props={props} />
      </div>
    )
  }else if(props.resourceType === "carbon"){
    return(
      <div className="data-title-container">
        <h6 className="data-title">{capitalizeFirstLetter(props.resourceType)}</h6>
        <button
          className="update-bill-button"
          style={{color: props.color}}
          onClick={(e) => props.changePage('/carbon-calculations')}
              >
            How We Calculate
         </button>
      </div>
    )
  }else{
    return(
      <div className="data-title-container">
        <h6 className="data-title">{capitalizeFirstLetter(props.resourceType)}</h6>
        <BarGraphIcon props={props} />
      </div>
    )
  }
}

export const ResourceTitle = (props) => {
  if(props.resourceType === "gas"){
    return(
      <div className="data-title-container">
        <h6 className="data-title">Heat</h6>
      </div>
    )
  }else if(props.resourceType === "carbon"){
    return(
      <div className="data-title-container">
        <h6 className="data-title">{capitalizeFirstLetter(props.resourceType)}</h6>
      </div>
    )
  }else{
    return(
      <div className="data-title-container">
        <h6 className="data-title">{capitalizeFirstLetter(props.resourceType)}</h6>
      </div>
    )
  }
}
