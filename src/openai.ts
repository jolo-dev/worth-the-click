import { OpenAI } from '@langchain/openai';
import { StreamingTextResponse } from 'ai';
import { loadSummarizationChain } from 'langchain/chains';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

let openAIApiKey: string;

chrome.storage.sync.get(['openai'], (result) => {
  openAIApiKey = result.openai;
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.openai) {
    openAIApiKey = changes.openai.newValue;
  }
});

export async function getSummary(text: string) {
  try {
    const cleanText = text
      .replaceAll('`', '')
      .replaceAll('$', '\\$')
      .replaceAll('\n', ' ');

    // const promptTemplate = `
    // I want you to act as a text summarizer to help me create a concise summary of the text I provide.
    // The summary can be up to 2 sentences, expressing the key points and concepts written in the original text without adding your interpretations.
    // Please, write about maximum 200 characters.
    // My first request is to summarize this text – ${cleanText}.
    // `;

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });

    const docs = await textSplitter.createDocuments([cleanText]);

    const llm = new OpenAI({
      openAIApiKey,
      streaming: true,
    });

    const summarizeChain = loadSummarizationChain(llm, {
      type: 'map_reduce',
    });

    const stream = (await summarizeChain.stream({
      input_documents: docs,
    })) as ReadableStream;

    // Respond with the stream
    const response = new StreamingTextResponse(stream);
    if (response.ok && response.body) {
      return response.body;
    }
  } catch (error) {
    console.error(error);
    return '<b>Probably, too big to fetch </b>';
  }
}

export async function readFromStream(
  stream: ReadableStream<{ text: string }>,
  url: string,
): Promise<string> {
  let result = '';
  const reader = stream.getReader();
  const container = document.querySelector<HTMLElement>(`[data-url="${url}"]`);

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const chunk = value.text;
      for (let i = 0; i < chunk.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 10)); // Adjust the delay as needed
        result += chunk[i];
        if (container) {
          container.style.height = 'auto';
          container.textContent += chunk[i];
        }
      }
    }
    return result;
  } catch (error) {
    console.error(error);
    return '<b>Probably, too big to fetch </b>';
  }
}
