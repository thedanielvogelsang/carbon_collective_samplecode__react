// functions
const formatDate = function(date){
  let formattedDate = new Date(date)
  let year = formattedDate.getFullYear();
  let month = formattedDate.getMonth() + 1;
  let dt = formattedDate.getDate();
  if(dt < 10){
    dt = "0" + dt;
  }
  if(month < 10){
    month = "0" + month
  }
  formattedDate = year+'-'+month+'-'+dt
  return formattedDate
}


// html
<h5> Current Number of Residents </h5>
<label>
  <div className="number-residents number-form">
    <button
      onClick={ (e) => this.updateResidents(e) }
    >-</button>
    <input
      id="noRes-id"
      type="text"
      name="no_residents"
      step="1"
      min="1"
      max="1000"
      readOnly={true}
      value={ no_residents }
    />
    <button
      onClick={ (e) => this.updateResidents(e, "add") }
    >+</button>
  </div>
</label>

<h5>Total Square Feet</h5>
<label>
  <input
    id="sq-ft"
    type="number"
    className="sq-feet"
    name="total_sq_ft"
    value ={ total_sq_ft }
    step="any"
    min="0"
    max="50000"
    placeholder={ total_sq_ft }
    onFocus={(e) => this.changePlaceholder(e)}
    onChange={(e) => this.handleChange(e) }
    onBlur={(e) => this.updateHouseDetails() }
  />
</label>
