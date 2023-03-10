import MainPage from '../components/mainPage'

export const metadata = {
    title: 'Whisper API Sample App',
    description: 'A sample webapp for transcribing speech using OpenAI Speech to Text API based on Whisper',
    viewport: 'maximum-scale=1.0, minimum-scale=1.0, initial-scale=1.0, width=device-width, user-scalable=0',
    icons: {
        icon: '/logo192.png',
        shortcut: '/logo192.png',
        apple: '/logo192.png',
        other: {
            rel: 'apple-touch-icon-precomposed',
            url: '/logo192.png',
        }
    }
}

export default function Page({ props }) {
    return <MainPage {...props} />;
}