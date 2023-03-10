import SnackBar from './snackbar';

export default {
  title: 'Whisper/SnackBar',
  component: SnackBar,
  tags: ['autodocs'],
  argTypes: {
    onClose: { action: 'close' },
  },
};

export const Primary = {
  args: {
    text: 'Reference error: The `api` variable is not defined.'
  },
};
