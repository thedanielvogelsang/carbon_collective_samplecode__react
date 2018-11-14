import React from 'react';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const ResourceTitleDash = (props) => {
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
        {props.graph ?
        <button
          type="button"
          className="update-bill-button"
          style={{color: props.color}}
          onClick={props.showCalculationModal}
              >
            How We Calculate
        </button> : null }
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

// {props.graph ? <BarGraphIcon props={props} /> : null }
// {props.graph ? <BarGraphIcon props={props} /> : null }
