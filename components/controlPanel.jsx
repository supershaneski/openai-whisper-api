import React from 'react'
import PropTypes from 'prop-types'

import SettingsIcon from './settings'
import SignalIcon from './signal'

import StartButton, { startStates } from './startbutton'

import classes from './controlPanel.module.css'

export default function ControlPanel({
    disabled = false,
    disabledSetting = false,
    isRecording = false,
    isSignalOn = false,
    state = startStates.default,
    onStartClick = undefined,
    onSettingsClick = undefined,
}) {
    return (
        <div className={classes.container}>
            <div className={classes.center}>
                <StartButton 
                disabled={disabled}
                isRecording={isRecording}
                state={state}
                onClick={disabled ? () => {} : onStartClick}
                />
            </div>
            <div className={classes.bottom}>
                <div className={classes.item}>
                    <div className={classes.iconPanel}>
                        <SignalIcon color={isSignalOn ? '#00D8FF' : '#E6E6E6'} />
                    </div>
                </div>
                <div className={classes.item}>
                    {
                        disabledSetting &&
                        <div className={disabledSetting ? classes.disabledButton : classes.iconButton}>
                            <SettingsIcon color={disabledSetting ? '#E6E6E6' : '#656565' } />
                        </div>
                    }
                    {
                        !disabledSetting &&
                        <div className={disabledSetting ? classes.disabledButton : classes.iconButton} onClick={disabledSetting ? () => {} : onSettingsClick}>
                            <SettingsIcon color={disabledSetting ? '#E6E6E6' : '#656565' } />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

ControlPanel.propTypes = {
    /**
     * Disable StartButton
     */
    disabled: PropTypes.bool,
    /**
     * Disable Settings
     */
    disabledSetting: PropTypes.bool,
    /**
     * Start state
     */
    state: PropTypes.string,
    /**
     * Enables recording animation
     */
    isRecording: PropTypes.bool,
    /**
     * Lights up when there is backend process
     */
    isSignalOn: PropTypes.bool,
    /**
     * Handles Settings click
     */
    onSettingsClick: PropTypes.func,
    /**
     * Handles StartButton click
     */
    onStartClick: PropTypes.func,
}