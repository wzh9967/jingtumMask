import React, { Component } from 'react'
import PropTypes from 'prop-types'
import OrderRowErrorMessage from './order-row-error-message/'
import OrderRowWarningMessage from './order-row-warning-message/'

export default class OrderRowWrapper extends Component {

  static propTypes = {
    children: PropTypes.node,
    errorType: PropTypes.string,
    label: PropTypes.string,
    showError: PropTypes.bool,
    showWarning: PropTypes.bool,
    warningType: PropTypes.string,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  render () {
    const {
      children,
      errorType = '',
      label,
      showError = false,
      showWarning = false,
      warningType = '',
    } = this.props
    const formField = Array.isArray(children) ? children[1] || children[0] : children
    const customLabelContent = children.length > 1 ? children[0] : null

    return (
      <div className="send-v2__form-row">
        <div className="send-v2__form-label">
          {label}
          {showError && <OrderRowErrorMessage errorType={errorType}/>}
          {!showError && showWarning && <OrderRowWarningMessage warningType={warningType} />}
          {customLabelContent}
        </div>
        <div className="send-v2__form-field">
          {formField}
        </div>
      </div>
    )
  }

}
