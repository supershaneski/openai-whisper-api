import ControlPanel from './controlPanel';
import { startStates } from './startbutton';

export default {
  title: 'Whisper/ControlPanel',
  component: ControlPanel,
  tags: ['autodocs'],
  argTypes: {
    state: {
      options: [startStates.default, startStates.active],
      control: { type: 'select' }
    },
    onSettingsClick: { action: 'settingsClick' },
    onStartClick: { action: 'startClick' },
  },
};

/*
disabled = false,
    disabledSetting = false,
    isRecording = false,
    isSignalOn = false,
    state = startStates.default,
    onStartClick = undefined,
    onSettingsClick = undefined,*/

export const Primary = {
  args: {
    state: startStates.default,
    disabled: false,
    disabledSetting: false,
    isRecording: false,
    isSignalOn: false,
  },
};
