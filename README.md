openai-whisper-api
====

This is a sample speech transcription web application implementing `OpenAI` [Speech to Text API](https://platform.openai.com/docs/guides/speech-to-text) based on [Whisper](https://openai.com/research/whisper), an automatic speech recognition (ASR) system, built using [Next 13](https://nextjs.org/), the `React` framework.

For other versions, please check:
- [openai-whisper](https://github.com/supershaneski/openai-whisper), using the `Whisper` python module, no remote API call, built on `Next.js`
- [openai-chatterbox](https://github.com/supershaneski/openai-chatterbox), same as above but built using `Nuxt.js`
- [openai-whisper-talk](https://github.com/supershaneski/openai-whisper-talk), combines `Text completion endpoint` and `Whisper` python module to bring full voice chat with AI, built using `Nuxt.js`.

# Table of Contents

- [openai-whisper-api](#openai-whisper-api)
- [Table of Contents](#table-of-contents)
- [Usage](#usage)
- [Stack](#stack)
- [Next 13 Route Handler + File Upload](#next-13-route-handler--file-upload)
- [Speech To Text](#speech-to-text)
- [Installation](#installation)

# Usage

![User Interface](./docs/screenshot1.png "User Interface")

**Please note that you need a working `OpenAI API Key` to run this application. See the [installation](#installation) procedure below.**

Run the app and click the Start button.

Recording will only start if voice or sound is detected. You can control the detection sensitivity by adjusting the [minDecibels](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/minDecibels) value. Lower value means more soft sounds are detected. Note that the values are in negatives.

If sound is not detected for 3 seconds, recording will stop and the audio data is sent to the backend for transcribing. In normal speech, it is said that the people tend to pause, on average, [around 2 seconds between sentences](https://mannerofspeaking.org/2019/11/12/pauses-in-a-speech-why-when-and-how/). You can also control the maximum time to wait for pause by adjusting the `maxPause` value.

![Settings](./docs/screenshot2.png "Settings")

The transcriptions with timestamps will be shown in a list. In the future, you will be able to play the audio data by clicking the transcription. The transcriptions are stored in the localStorage. If the transcription does not contain any text data, it will be disregarded. 

> TODO: Audio data playback


# Stack

- [Next 13](https://nextjs.org/docs), React framework, the current latest version, with `app` directory.
  
  Using manual installation

  ```sh
  npm install next@latest react@latest react-dom@latest eslint-config-next@latest
  ```

  See [docs](https://beta.nextjs.org/docs/installation) for further instructions.

- [Storybook](https://storybook.js.org/blog/integrate-nextjs-and-storybook-automatically/), tool for UI development, **zero-config** support for Next 13 ( _look ma', no hands 🖐!_ ).

    Go to your project directory and run

    ```sh
    npx storybook@next init
    ```

- [Zustand](https://github.com/pmndrs/zustand), app state management solution using simplified flux principles. Specifically, I will be using the [persisting store middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data).

  ```sh
  npm install zustand
  ```

- [Speech to Text API](https://platform.openai.com/docs/guides/speech-to-text), OpenAI speech to text API based on the state-of-the-art open source large-v2 `Whisper` model.
  
  **Please note that this app will need an `OpenAI account` since we will be accessing API endpoint and will need a working `API key`.** 
  
  If you have not yet done so, upon signing up will be given `$18 in free credit that can be used during your first 3 months`. Visit the [OpenAI website](https://platform.openai.com/) for more details.

  If you want to try `Whisper` without using the API endpoint, please check [openai-whisper](https://github.com/supershaneski/openai-whisper) project.

- [Form-Data](https://github.com/form-data/form-data#readme), library to create readable `multipart/form-data` streams. `Whisper API` currently only has python and curl implementations. Since [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData) does not exist inside `route handler` so we need an alternative.

  ```sh
  npm install form-data
  ```

- [Axios](https://axios-http.com/), promise based HTTP client for the browser and node.js. As alternative to `curl`, I tried using just plain `fetch` but I was encountering problem when attaching the form data. So I will be using `axios` instead to submit request to `Whisper API` endpoint.

  ```sh
  npm install axios
  ```


# Next 13 Route Handler + File Upload

In my previous Next.js project, I was using `middleware` (multer and next-connect) to handle `file upload` to the API route. But for `Next 13` route handler, it is no longer necessary. You can read the uploaded file as `Blob` directly from the `FormData` in the request object and just save it manually.

In your route.js
```javascript
export async function POST(req) {

  const form = await req.formData()
  const blob = form.get("file")

  const buffer = Buffer.from( await blob.arrayBuffer() )

  const filename = "file" + Date.now() + Math.round(Math.random() * 100000) + ".m4a"
  const filepath = `${path.join("public", "uploads", filename)}`

  fs.writeFileSync(filepath, buffer)

  ...

}
```

However, one caveat, Next 13 gives warning:
> (node:5006) ExperimentalWarning: buffer.Blob is an experimental feature. This feature could change at any time


# Speech To Text

Since we are using Next.js, we will be using the `curl` method as written in the [documentation](https://platform.openai.com/docs/api-reference/audio). And since there is no `curl` in Node.js and `fetch` is causing problems, we will be using `axios` instead.

In route.js's POST handler
```javascript

  ...

  let filepath = `${path.join("public", "uploads", filename)}`
    
  let header = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_APIKEY}`
  }

  let formData = new FormData()
  formData.append("file", fs.createReadStream(filepath))
  formData.append("model", "whisper-1")
  formData.append("response_format", "vtt") // e.g. text, vtt, srt
  
  const url = "https://api.openai.com/v1/audio/transcriptions"
  
  let data = await new Promise((resolve, reject) => {

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

  ...

```

The actual `OPENAI_APIKEY` is stored in `.env` file and is not included in this repository.
Please use the `.env.example` as pattern to create your own `.env` file.

For this project, I need the `timestamp` of the transcription so I am using `response_format` as `vtt` file. If you use `text` file, the output will not contain any timestamp.

There are two endpoints we can use
```javascript
// transcription
const transcribe_url = "https://api.openai.com/v1/audio/transcriptions"

// translation
const transcribe_url = "https://api.openai.com/v1/audio/translations"

```

If the audio data will contain other language, it is better to use the translation endpoint.


# Installation

Clone the repository and install the dependencies

```sh
git clone https://github.com/supershaneski/openai-whisper-api.git myproject

cd myproject

npm install
```

Create a `.env` file in the root directory and copy the contents of `.env.example` and replace the value of `OPENAI_APIKEY` with your own.

Finally, to run the app

```sh
npm run dev
```

Open your browser to `http://localhost:3005/` to load the application page.
Please note that the port number is subject to the availability and may change.

