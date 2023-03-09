import StartButton, { startStates } from './startbutton';

export default {
  title: 'Whisper/StartButton',
  component: StartButton,
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'click' },
  },
};

export const Primary = {
  args: {
    disabled: false,
    isRecording: false,
    state: startStates.default,
  },
};
