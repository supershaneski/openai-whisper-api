import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_APIKEY,
    maxRetries: 4,
    timeout: 60 * 1000 // 60s
})

export async function whisper({
    mode = 'transcriptions',
    file,
    model = 'whisper-1',
    prompt = '',
    response_format = 'json',
    temperature = 0,
    language = 'en',
}) {

    const options = {
        file,
        model,
        prompt,
        response_format,
        temperature,
        language,
    }

    try {

        const response = mode === 'translations' ? await openai.audio.translations.create(options) : await openai.audio.transcriptions.create(options)
        
        return response

    } catch(error) {
        
        console.log(error.name, error.message)

        throw error
        
    }

}