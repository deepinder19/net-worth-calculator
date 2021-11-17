import React from 'react'

const InputField = (props) => {
  return (
    <div className="row" key={props.field.name}>
      <div className="col-9 align-self-center">{props.field.label}</div>
      <div className="col-3 d-flex justify-content-between border-start">
        <div className="input-group my-1">
          <span className="input-group-text">{props.currencySymbol}</span>
          <input
            type="text"
            className="form-control"
            disabled={props.disabled}
            value={props.field.value}
            onFocus={props.onFieldFocus(props.field.name, props.field.value)}
            onBlur={props.onFieldBlur(props.field.name, props.field.value)}
            onChange={props.onFieldChange(props.field.name)}
          />
        </div>
      </div>
    </div>
  )
}

export default InputField
