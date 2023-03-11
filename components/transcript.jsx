import React from 'react'
import PropTypes from 'prop-types'

import DeleteIcon from './delete'

import classes from './transcript.module.css'

const formatNumber = (n) => n < 10 ? '0' + n : n

const formatDateTime = (s) => {
    const date = new Date(s)

    const syear = date.getFullYear()
    let smonth = date.getMonth() + 1
    let sdate = date.getDate()

    let shour = date.getHours()
    let smins = date.getMinutes()
    let ssecs = date.getSeconds()

    smonth = formatNumber(smonth)
    sdate = formatNumber(sdate)

    shour = formatNumber(shour)
    smins = formatNumber(smins)
    ssecs = formatNumber(ssecs)

    return [[syear, smonth, sdate].join('-'), [shour, smins, ssecs].join(':')].join(' ')
}

export default function Transcript({
    filename = '',
    datetime = '',
    data = '',
    onClick = undefined,
    onDelete = undefined,
}) {

    let items = []
    let index = -1
    let flag = false

    const tokens = data.split("\n")
    for (let i = 0; i < tokens.length; i++) {
        const s = tokens[i].trim()
        if(s.indexOf(':') > 0 && s.indexOf('-->') > 0) {
            index++
            items.push({ timestamp: s, text: '' })
            flag = true
        } else if(flag) {
            items[index].text = s
            flag = false
        }
    }

    const handleDelete = (e) => {
        e.stopPropagation()
        e.preventDefault()
        onDelete(filename)
    }

    // Multiply: &#215;

    return (
        <div className={classes.container} onClick={onClick}>
            <div className={classes.top}>
                <div className={classes.datetime}>{ formatDateTime(datetime) }</div>
                <div onClick={handleDelete} className={classes.iconButton}>
                    <DeleteIcon color="#fff" />
                </div>
            </div>
            <div className={classes.list}>
            {
                items.map((item, index) => {
                    return (
                        <div key={index} className={classes.item}>
                            <div className={classes.timestamp}>{ item.timestamp }</div>
                            <div className={classes.text}>{ item.text }</div>
                        </div>
                    )
                })
            }
            </div>
        </div>
    )
}

Transcript.propTypes = {
    /**
     * Filename of audo data
     */
    filename: PropTypes.string,
    /**
     * DateTime when audio data is recorded
     */
    datetime: PropTypes.string,
    /**
     * Transcription items
     */
    data: PropTypes.string,
    /**
     * Click event handler
     */
    onClick: PropTypes.func,
    /**
     * Delete event handler
     */
    onDelete: PropTypes.func,
}