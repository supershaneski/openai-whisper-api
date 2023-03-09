import React from 'react'
import classes from './iconbutton.module.css'

function IconButton({ disabled, children, size = 24, onClick = undefined }) {
    return (
        <div className={classes.iconButton} onClick={disabled ? () => {} : onClick} style={{
            width: `${size}px`,
            height: `${size}px`,
        }}>
        { children }
        </div>
    )
}

export default IconButton