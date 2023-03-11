import Modal from './modal';

export default {
  title: 'Whisper/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    onCancel: { action: 'cancel' },
    onButtonClick: { action: 'click' },
  },
};

export const Primary = {
  args: {
    text: 'Are you sure you want to delete this transcript?',
    buttonText: 'Delete'
},
};
