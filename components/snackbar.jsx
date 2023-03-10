import React from 'react'
import PropTypes from 'prop-types'

import classes from './snackbar.module.css'

export default function SnackBar({ text = '', onClose = undefined }) {
    
    const [snackState, setSnackState] = React.useState(0)
    
    React.useEffect(() => {

        setTimeout(() => {

            setSnackState(1)

        }, 1300)
        
    }, [])

    React.useEffect(() => {

        if(snackState > 0) {

            setTimeout(() => {

                onClose()

            }, 300)

        }

    }, [snackState])

    const classContainer = snackState === 1 ? [classes.container, classes.hide].join(' ') : [classes.container, classes.show].join(' ')

    return (
        <div className={classContainer}>
            <div className={classes.content}>
                <span className={classes.text}>{ text }</span>
            </div>
        </div>
    )
}

SnackBar.propTypes = {
    /**
     * The message to be displayed
     */
    text: PropTypes.string,
    /**
     * Close event handler
     */
    onClose: PropTypes.func,
}