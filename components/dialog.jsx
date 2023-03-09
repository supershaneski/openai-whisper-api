import React from 'react'
import PropTypes from 'prop-types'

import classes from './dialog.module.css'

import languages from '../assets/language-support.json'

import { useAppStore } from '../stores/appStore'

export default function Dialog({ onClose = undefined }) {

    const language = useAppStore((state) => state.language)
    const setLanguage = useAppStore((state) => state.setLanguage)

    const endpoint = useAppStore((state) => state.endpoint)
    const setEndpoint = useAppStore((state) => state.setEndpoint)

    const temperature = useAppStore((state) => state.temperature)
    const setTemperature = useAppStore((state) => state.setTemperature)

    const prompt = useAppStore((state) => state.prompt)
    const setPrompt = useAppStore((state) => state.setPrompt)

    const interval = useAppStore((state) => state.interval)
    const setInterval = useAppStore((state) => state.setInterval)

    const threshold = useAppStore((state) => state.threshold)
    const setThreshold = useAppStore((state) => state.setThreshold)

    return (
        <div className={classes.container}>
            <div className={classes.dialog}>
                <div className={classes.contents}>
                    <h4 className={classes.subtitle}>Recording</h4>
                    <div className={classes.item}>
                        <label className={classes.label}>MaxPause</label>
                        <select className={classes.select} value={interval} onChange={(e) => setInterval(e.target.value)}>
                            <option value={2500}>2500 ms</option>
                            <option value={3000}>3000 ms</option>
                            <option value={3500}>3500 ms</option>
                            <option value={4000}>4000 ms</option>
                            <option value={4500}>4500 ms</option>
                            <option value={5000}>5000 ms</option>
                        </select>
                    </div>
                    <div className={classes.item}>
                        <label className={classes.label}>MinDecibels</label>
                        <select className={classes.select} value={threshold} onChange={(e) => setThreshold(e.target.value)}>
                            <option value={-70}>-70 dB</option>
                            <option value={-65}>-65 dB</option>
                            <option value={-60}>-60 dB</option>
                            <option value={-55}>-55 dB</option>
                            <option value={-50}>-50 dB</option>
                            <option value={-45}>-45 dB</option>
                            <option value={-40}>-40 dB</option>
                            <option value={-35}>-35 dB</option>
                            <option value={-30}>-30 dB</option>
                        </select>
                    </div>
                    <h4 className={classes.subtitle}>Speech to Text</h4>
                    <div className={classes.item}>
                        <label className={classes.label}>Endpoint</label>
                        <select className={classes.select} value={endpoint} onChange={(e) => setEndpoint(e.target.value)}>
                            <option value="transcriptions">Transcriptions</option>
                            <option value="translations">Translations</option>
                        </select>
                    </div>
                    <div className={classes.item}>
                        <label className={classes.label}>Language</label>
                        <select className={classes.select} value={language} onChange={(e) => setLanguage(e.target.value)}>
                        {
                            languages.languages.map((item) => {
                                return <option key={item.code} value={item.code}>{ item.name }</option>
                            })
                        }
                        </select>
                    </div>
                    <div className={classes.item}>
                        <label className={classes.label}>Temperature</label>
                        <select className={classes.select} value={temperature} onChange={(e) => setTemperature(e.target.value)}>
                            <option value={0}>0</option>
                            <option value={0.1}>0.1</option>
                            <option value={0.2}>0.2</option>
                            <option value={0.3}>0.3</option>
                            <option value={0.4}>0.4</option>
                            <option value={0.5}>0.5</option>
                            <option value={0.6}>0.6</option>
                            <option value={0.7}>0.7</option>
                            <option value={0.8}>0.8</option>
                        </select>
                    </div>
                </div>
                <div className={classes.action}>
                    <button className={classes.button} onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    )
}

Dialog.propTypes = {
    /**
     * Close dialog event handler
     */
    onClose: PropTypes.func
}