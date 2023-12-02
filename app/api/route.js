import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
//import axios from 'axios'
//import FormData from 'form-data'
import { cleanInput } from '../../lib/utils'

import { whisper } from '../../services/openai'

export async function POST(req) {

    const form = await req.formData()
    
    const blob = form.get('file')
    const name = cleanInput(form.get('name'))
    const datetime = cleanInput(form.get('datetime'))
    const raw_options = cleanInput(form.get('options'))

    /**
     * Simple form validation
     */
    if(!blob || !name || !datetime) {
        return new Response('Bad Request', {
            status: 400,
        })
    }

    const options = JSON.parse(raw_options)

    const buffer = Buffer.from( await blob.arrayBuffer() )
    const filename = `${name}.webm`
    let filepath = `${path.join('public', 'uploads', filename)}`
    
    fs.writeFileSync(filepath, buffer)

    // remove silence part of the audio
    let outFile = `${path.join('public', 'uploads', `out-${filename}`)}`
    const retval = await new Promise((resolve, reject) => {

        //const sCommand = `ffmpeg -i ${filepath} -af silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB:detection=peak,aformat=dblp,areverse,silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB:detection=peak,aformat=dblp,areverse ${outFile}`
        const sCommand = `ffmpeg -i ${filepath} -af silenceremove=stop_periods=-1:stop_duration=1:stop_threshold=-50dB ${outFile}`
        
        exec(sCommand, (error, stdout, stderr) => {
            
            if (error) {
                
                resolve({
                    status: 'error',
                })

            } else {

                resolve({
                    status: 'success',
                    error: stderr,
                    out: stdout,
                })

            }
            
        })

    })

    // if successful, use the output file
    if(retval.status === 'success') {
        filepath = outFile
    }


    /**
     * We are going to check the file size here to decide
     * whether to send it or not to the API.
     * As for the min file size value, it is based on my testing.
     * There is probably a better way to check if the file has no audio data.
     */
    const minFileSize = 18000 // bytes
    const stats = fs.statSync(outFile)

    if(parseInt(stats.size) < minFileSize) {

        return new Response('Bad Request', {
            status: 400,
        })
    }

    const flagDoNotUseApi = process.env?.DO_NOT_USE_API === 'true'

    if(flagDoNotUseApi) {
        
        const outputDir = path.join('public', 'uploads') 

        let sCommand = `whisper './${filepath}' --language ${options.language} --temperature ${options.temperature} --model tiny --output_dir '${outputDir}'`
        if(options.endpoint === 'translations') {
            sCommand = `whisper './${filepath}' --language ${options.language} --task translate --temperature ${options.temperature} --model tiny --output_dir '${outputDir}'`
        }

        const retval = await new Promise((resolve, reject) => {

            exec(sCommand, (error, stdout, stderr) => {
                
                if (error) {
                    
                    resolve({
                        status: 'error',
                        message: "Failed to transcribe [1]",
                    })
    
                } else {
    
                    resolve({
                        status: 'ok',
                        error: stderr,
                        out: stdout,
                    })
    
                }
                
            })
    
        })

        if(retval.status === "error" || retval.out.length === 0) {
            return new Response('Bad Request', {
                status: 400,
            })
        }

        /**
         * retval.out format: '[00:01.000 --> 00:02.000]  thank\n' +
         *             '[00:02.720 --> 00:03.720]  you\n' +
         */
        let sout = []
        let stokens = retval.out.split('\n')
        for(let i = 0; i < stokens.length; i++) {
            let n = stokens[i].indexOf(']')
            if(n > 0) {
                let s1 = stokens[i].substr(0, n + 1)
                let s2 = stokens[i].substr(n + 1)
                sout.push(s1)
                sout.push(s2)
            } else {
                sout.push(stokens[i])
            }
        }

        return new Response(JSON.stringify({ 
            datetime,
            filename,
            data: sout.join('\n'),
        }), {
            status: 200,
        })

    }

    console.log('using whisper api...', filename)

    let data = ''

    try {

        const result = await whisper({
            mode: options.endpoint,
            file: fs.createReadStream(filepath),
            response_format: 'vtt',
            temperature: options.temperature,
            language: options.language,
        })
    
        data = result

        console.log(options.endpoint, data)

    } catch(error) {

        console.log(error.name, error.message)

    } finally {

        /**
         * Sample output
         */
        //const data = "WEBVTT\n\n00:00:00.000 --> 00:00:04.000\nThe party is starting now hurry up, let's go.\n00:00:04.000 --> 00:00:07.000\nHold this one, okay, do not drop it."

        return new Response(JSON.stringify({ 
            datetime,
            filename,
            data,
        }), {
            status: 200,
        })

    }
    
}