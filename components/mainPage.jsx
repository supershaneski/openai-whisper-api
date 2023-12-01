'use client'

import React from 'react'
import { createPortal } from 'react-dom'

import classes from './mainPage.module.css'

import { startStates } from './startbutton'

import ControlPanel from './controlPanel'
import Dialog from './dialog'
import SnackBar from './snackbar'
import AudioModal from './audiomodal'
import Modal from './modal'

import Transcript from './transcript'

import { useAppStore } from '../stores/appStore'
import { useAppData } from '../stores/appData'

export default function MainPage() {

    const dataCount = useAppData((state) => state.count)
    const dataItems = useAppData((state) => state.items)
    const addDataItems = useAppData((state) => state.add)
    const deleteDataItem = useAppData((state) => state.delete)

    const minDecibels = useAppStore((state) => state.threshold)
    const maxPause = useAppStore((state) => state.interval)
    const language = useAppStore((state) => state.language)
    const temperature = useAppStore((state) => state.temperature)
    const endpoint = useAppStore((state) => state.endpoint)
    
    const listRef = React.useRef(null)
    const mediaRef = React.useRef()
    const chunksRef = React.useRef([])
    const animFrame = React.useRef()
    const timerCount = React.useRef()

    const abortControllerRef = React.useRef()

    const [transcripts, setTranscripts] = React.useState([])
    const [sendCount, setSendCount] = React.useState(0)

    const startRef = React.useRef(startStates.default)
    const recordRef = React.useRef(false)
    const countDownRef = React.useRef(false)
    const countRef = React.useRef(0)
    const recordDateTime = React.useRef('')

    const [isReady, setReady] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState('')

    const [isRecording, setRecording] = React.useState(false)
    const [startState, setStartState] = React.useState(startStates.default)

    const [isCountDown, setCountDown] = React.useState(false)

    const [openSettings, setOpenSettings] = React.useState(false)
    const [openSnack, setOpenSnack] = React.useState(false)

    const [openAudioDialog, setOpenAudioDialog] = React.useState(false)
    const [audioFile, setAudioFile] = React.useState('')

    const [openModal, setOpenModal] = React.useState(false)

    const [isMounted, setMounted] = React.useState(false)
    

    React.useEffect(() => {
        
        abortControllerRef.current = new AbortController()
        setMounted(true)

        return () => {

            try {

                setMounted(false)
                
                if(abortControllerRef.current) {
                    abortControllerRef.current.abort()
                }

            } catch(err) {
                console.log(err)
            }

        }

    }, [])

    React.useEffect(() => {

        setTranscripts(dataItems)

        setTimeout(() => {
            listRef.current.scrollTop = listRef.current.scrollHeight
        }, 900)

    }, [dataCount, dataItems])

    React.useEffect(() => {

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

            navigator.mediaDevices.getUserMedia({ audio: true }).then(handleStream).catch(handleError)
    
        } else {
    
            setErrorMessage('Media devices not supported')
            
        }

        return () => {

            try {
                
                window.cancelAnimationFrame(animFrame.current)

            } catch(error) {
                console.log(error)
            }

        }

    }, [minDecibels, maxPause,language, endpoint, temperature])

    React.useEffect(() => {

        if(isCountDown) {

            timerCount.current = setInterval(() => {
                
                countRef.current += 100

            }, 100)

        }

        return () => {
            clearInterval(timerCount.current)
        }

    }, [isCountDown])

    const handleError = (error) => {
        console.log(error)
        setErrorMessage('Error calling getUserMedia')
    }

    const handleStream = (stream) => {

        try {
            
            mediaRef.current = new MediaRecorder(stream, {
                audioBitsPerSecond: 128000,
                mimeType: 'audio/webm;codecs=opus',
            })

        } catch(error) {

            console.log(error)

            mediaRef.current = new MediaRecorder(stream, {
                audioBitsPerSecond: 128000,
            })

        }

        console.log("handle stream2...")

        //mediaRef.current = new MediaRecorder(stream)

        mediaRef.current.addEventListener('dataavailable', handleData)
        mediaRef.current.addEventListener("stop", handleStop)
        
        setReady(true)

        checkAudioLevel(stream)

    }

    const checkAudioLevel = (stream) => {

        const audioContext = new AudioContext()
        const audioStreamSource = audioContext.createMediaStreamSource(stream)
        const analyser = audioContext.createAnalyser()
        analyser.maxDecibels = -10
        analyser.minDecibels = minDecibels
        audioStreamSource.connect(analyser)

        const bufferLength = analyser.frequencyBinCount
        const domainData = new Uint8Array(bufferLength)

        const detectSound = () => {

            let soundDetected = false

            analyser.getByteFrequencyData(domainData)

            for (let i = 0; i < bufferLength; i++) {
                if (domainData[i] > 0) {
                    soundDetected = true
                }
            }

            if(soundDetected === true) {

                if(recordRef.current) {
                    
                    if(countDownRef.current) {

                        setCountDown(false)
                        countDownRef.current = false
                        countRef.current = 0

                    }

                } else {

                    if(startRef.current === startStates.active) {

                        recordDateTime.current = (new Date()).toISOString()

                        setRecording(true)
                        recordRef.current = true
                        
                        setCountDown(false)
                        countDownRef.current = false
                        countRef.current = 0

                        mediaRef.current.start()

                    }

                }
                
            } else {

                if(recordRef.current) {

                    if(countDownRef.current) {

                        if(countRef.current >= maxPause) {

                            if(startRef.current === startStates.active) {

                                setRecording(false)
                                recordRef.current = false
                                
                                setCountDown(false)
                                countDownRef.current = false
                                countRef.current = 0

                                mediaRef.current.stop()

                            }

                        }

                    } else {

                        setCountDown(true)
                        countDownRef.current = true
                        countRef.current = 0

                    }

                }
                
            }

            animFrame.current = window.requestAnimationFrame(detectSound)

        }

        animFrame.current = window.requestAnimationFrame(detectSound)
        
    }

    const handleData = (e) => {

        chunksRef.current.push(e.data)

    }

    const handleStop = () => {

        const blob = new Blob(chunksRef.current, {type: 'audio/webm;codecs=opus'})
        
        const datetime = recordDateTime.current
        const name = `file${Date.now()}` + Math.round(Math.random() * 100000)
        const file = new File([blob], `${name}.webm`)

        chunksRef.current = []
        
        setSendCount((prev) => prev + 1)

        sendData(name, datetime, file)

    }

    const sendData = async (name, datetime, file) => {

        let options = {
            language: language,
            endpoint: endpoint,
            temperature: temperature,
        }

        let formData = new FormData()
        formData.append('file', file, `${name}.webm`)
        formData.append('name', name)
        formData.append('datetime', datetime)
        formData.append('options', JSON.stringify(options))

        console.log("[send data]", (new Date()).toLocaleTimeString())

        try {

            const url = '/api/'
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData,
                signal: abortControllerRef.current.signal,
            })
    
            if(!response.ok) {
                
                /**
                 * I am assuming that all 500 errors will be caused by
                 * problem in accessing the remote API endpoint for simplicity.
                 */
                if(response.status === 500) {
                    setOpenSnack(true)
                }

            }

            const result = await response.json()

            setSendCount((prev) => prev - 1)

            console.log("[received data]", (new Date()).toLocaleTimeString())

            /**
             * verify if result does not contain any useful data, disregard
             */
            const data = result?.data
            if(data) {

                /**
                 * we will check if there is timestamp
                 * we are using vtt format so we should always have it
                 */
                if(data.indexOf(':') > 0 && data.indexOf("-->") > 0) {

                    addDataItems(result)

                }

            }
            

        } catch(err) {
            console.log(err)
            setSendCount((prev) => prev - 1)
        }

    }

    const handleStart = () => {

        if(startRef.current === startStates.default) {

            startRef.current = startStates.active

            setStartState(startStates.active)

        } else {

            if(mediaRef.current.state !== 'inactive') {
                mediaRef.current.stop()
            }

            setRecording(false)
            recordRef.current = false
            
            setCountDown(false)
            countDownRef.current = false
            countRef.current = 0

            startRef.current = startStates.default

            setStartState(startStates.default)

        }

    }

    const handleOpenSettings = () => {
        setOpenSettings(true)
    }

    const handleCloseSettings = () => {
        setOpenSettings(false)
    }

    const handleClickTranscript = async (file) => {
        /**
         * TODO: Play audio data
         */

        setAudioFile(file)
        setOpenAudioDialog(true)

    }

    const handleCloseSnack = () => {
        setOpenSnack(false)
    }

    const handleCloseAudio = () => {
        setOpenAudioDialog(false)
        setAudioFile('')
    }

    const handleDelete = (file) => {
        
        setAudioFile(file)
        setOpenModal(true)
        
    }

    const handleCloseModal = () => {

        setAudioFile('')
        setOpenModal(false)
    }

    const handleClickModal = () => {
        
        deleteDataItem(audioFile)

        setAudioFile('')
        setOpenModal(false)

    }

    return (
        <div className={classes.container}>
            <div ref={listRef} className={classes.main}>
            {
                !isReady &&
                <div className={classes.mainError}>
                    <span className={classes.error}>{ errorMessage }</span>
                </div>
            }
            {
                (isMounted && isReady && transcripts.length === 0) &&
                <div className={classes.mainError}>
                    <span className={classes.info}>No transcripts</span>
                </div>
            }
            {
                (isMounted && isReady && transcripts.length > 0) &&
                <div className={classes.list}>
                    {
                        transcripts.map((item) => {
                            return (
                                <Transcript
                                key={item.filename}
                                {...item}
                                onClick={() => handleClickTranscript(item.filename)}
                                onDelete={handleDelete}
                                />
                            )
                        })
                    }
                </div>
            }
            </div>
            <div className={classes.control}>
                <ControlPanel
                state={startState}
                isSignalOn={sendCount > 0}
                isRecording={isRecording}
                disabled={!isReady}
                disabledSetting={!isReady || startState === startStates.active}
                onStartClick={handleStart}
                onSettingsClick={handleOpenSettings}
                />
            </div>
            {
                openSettings && createPortal(
                    <Dialog onClose={handleCloseSettings} />,
                    document.body,
                )
            }
            {
                openSnack && createPortal(
                    <SnackBar onClose={handleCloseSnack} text="Problem sending the request to remote Whisper API." />,
                    document.body,
                )
            }
            {
                openAudioDialog && createPortal(
                    <AudioModal file={audioFile} onClose={handleCloseAudio} />,
                    document.body,
                )
            }
            {
                openModal && createPortal(
                    <Modal text='Are you sure you want to delete this transcript?' 
                    buttonText='Delete' onButtonClick={handleClickModal} onCancel={handleCloseModal} />,
                    document.body,
                )
            }
        </div>
    )
}