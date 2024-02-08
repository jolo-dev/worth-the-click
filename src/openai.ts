import { OpenAI } from '@langchain/openai';
// import { OpenAIStream } from 'ai';
// import { OpenAIStream, StreamingTextResponse } from 'ai';
import {
  // AnalyzeDocumentChain,
  // LLMChain,
  loadSummarizationChain,
} from 'langchain/chains';
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

    const promptTemplate = `
    I want you to act as a text summarizer to help me create a concise summary of the text I provide.
    The summary can be up to 2 sentences, expressing the key points and concepts written in the original text without adding your interpretations.
    Please, write about maximum 200 characters.
    My first request is to summarize this text – ${cleanText}.
    `;

    // const prompt = new PromptTemplate({
    //   inputVariables: ['cleanText'],
    //   template: promptTemplate,
    // });

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });

    const docs = await textSplitter.createDocuments([cleanText]);

    const llm = new OpenAI({
      openAIApiKey,
    });

    const summarizeChain = loadSummarizationChain(llm, {
      type: 'map_reduce',
    });

    // const combineDocumentsChain = new LLMChain({
    //   prompt: promptTemplate,
    //   llm,
    // });

    // const summarizeChain = new AnalyzeDocumentChain({
    //   combineDocumentsChain,
    //   textSplitter,
    // });

    // const stream = await openai.stream(prompt);
    const stream = await summarizeChain.stream({ input_documents: docs });
    console.log('summarizeChain', stream);
    return stream;
    // const completion = await openai.chat.completions.create({
    //   model: 'gpt-3.5-turbo',
    //   messages: [{ role: 'assistant', content: promptTemplate }],
    //   stream: true,
    // });

    // Convert the response into a friendly text-stream
    // const stream = OpenAIStream(completion);

    // Respond with the stream
    // const response = new StreamingTextResponse(stream);
    // if (response.ok && response.body) {
    // console.log(response.body);

    // return response.body;
    // }
  } catch (error) {
    console.error(error);
    return '<b>Probably, too big to fetch </b>';
  }
}
export async function readFromStream(
  stream: ReadableStream,
  url: string,
): Promise<string> {
  let result = '';
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const container = document.querySelector<HTMLElement>(`[data-url="${url}"]`);

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const chunk = decoder.decode(value);
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
