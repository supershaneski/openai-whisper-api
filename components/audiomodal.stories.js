import AudioModal from './audiomodal';

export default {
  title: 'Whisper/AudioModal',
  component: AudioModal,
  tags: ['autodocs'],
  argTypes: {
    onClose: { action: 'close' },
  },
};

export const Primary = {
  args: {
    file: '3bb44b94-9f0c-4835-aa7a-aaeafcce7e3d.mp3',
  },
};
