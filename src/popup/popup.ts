import van from 'vanjs-core';
import { MessageBoard } from 'vanjs-ui';

const { h3, div, input, button } = van.tags;

const board = new MessageBoard({ top: '20px' });

const Form = () => {
  const divDom = div({ class: 'openai-api-key-form' }, h3('OpenAI API Key'));
  const inputDom = input({
    type: 'text',
    id: 'openai-api',
    placeholder: 'Enter your OpenAI API Key',
  });
  van.add(
    divDom,
    inputDom,
    button(
      {
        onclick: () => {
          // Get the count value from Chrome storage
          chrome.storage.sync.set({
            openai: inputDom.value,
          });
          board.show({ message: 'Added your OpenAI Key', durationSec: 2 });
        },
      },
      'Add',
    ),
  );
  return divDom;
};

document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('popup');
  popup ? van.add(popup, Form()) : null;
});
