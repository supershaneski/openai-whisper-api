import React from 'react'
import PropTypes from 'prop-types'

import classes from  './modal.module.css'

export default function Modal({ text = '', buttonText = '', onButtonClick = undefined, onCancel = undefined }) {
    return (
        <div className={classes.container}>
            <div className={classes.dialog}>
                <div className={classes.contents}>
                    <p className={classes.text}>{ text }</p>
                </div>
                <div className={classes.action}>
                    <button onClick={onButtonClick} className={`${classes.button} ${classes.main}`}>{ buttonText }</button>
                    <button onClick={onCancel} className={`${classes.button} ${classes.cancel}`}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

Modal.propTypes = {
    /**
     * Text message
     */
    text: PropTypes.string,
    /**
     * Button caption
     */
    buttonText: PropTypes.string,
    /**
     * Click event handler for action button
     */
    onButtonClick: PropTypes.func,
    /**
     * Cancel button event handler
     */
    onCancel: PropTypes.func,
}