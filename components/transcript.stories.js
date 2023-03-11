import Transcript from './transcript';

export default {
  title: 'Whisper/Transcript',
  component: Transcript,
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'click' },
    onDelete: { action: 'delete' },
    //datetime: {
    //  control: { type: 'date' }
    //}
  },
};

export const Primary = {
  args: {
    filename: 'file2023031109121005.m4a',
    datetime: '2023-03-08T00:15:34.310Z',
    data: 'WEBVTT\n\n00:00:00.000 --> 00:00:04.000\nThe party is starting now hurry up, lets go.\n00:00:04.000 --> 00:00:07.000\nHold this one, okay, do not drop it.'
  },
};
