import fs from "fs"
import path from "path"
import axios from 'axios'
import FormData from 'form-data'

export async function POST(req) {

    /**
     * TODO: Add bad request handling
     */

    const form = await req.formData()
    
    const blob = form.get('file')
    const name = form.get('name')
    const datetime = form.get('datetime')
    const raw_options = form.get('options')

    const options = JSON.parse(raw_options)

    const buffer = Buffer.from( await blob.arrayBuffer() )
    const filename = `${name}.m4a`
    let filepath = `${path.join('public', 'uploads', filename)}`
    
    fs.writeFileSync(filepath, buffer)

    let header = {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_APIKEY}`
    }

    let formData = new FormData()
    formData.append("file", fs.createReadStream(filepath))
    formData.append("model", "whisper-1")
    formData.append("response_format", "vtt") // e.g. text, vtt, srt

    formData.append("temperature", options.temperature)
    formData.append("language", options.language)

    const url = options.endpoint === 'transcriptions' ? 'https://api.openai.com/v1/audio/transcriptions' : 'https://api.openai.com/v1/audio/translations'
    
    let result = await new Promise((resolve, reject) => {

        axios.post(url, formData, {
            headers: {
                ...header,
            }
        }).then((response) => {
            
            resolve({
                output: response.data,
            })

        }).catch((error) => {
            
            reject(error)

        })

    })

    const data = result?.output

    /**
     * Sample output
     */
    //const data = "WEBVTT\n\n00:00:00.000 --> 00:00:03.000\nI wrote a letter to my friend , and on the way I dropped it.\n00:00:02.000 --> 00:00:05.000\nI dropped it, I dropped it."

    return new Response(JSON.stringify({ 
        datetime,
        filename,
        data,
    }), {
        status: 200,
    })

}