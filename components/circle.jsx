import React from 'react'

export default function Circle(props) {
    return (
        <svg viewBox="0 0 16 16">
            <path className={props.className} d="M8 13A5 5 0 1 0 8 3a5 5 0 0 0 0 10z" />
        </svg>
    )
}