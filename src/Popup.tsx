export default function Popup() {

    const saveOpenAi = () => {
        const openaiApiKey = document.querySelector<HTMLInputElement>('input[name="openai-api"]')?.value;
        chrome.storage.sync.set({ openaiApiKey }, () => {
            console.log('Value is set to ', openaiApiKey);
        });
    }
    return (
        <div class="openai-api-key-form">
            <h3>OpenAI API Key</h3>
            <input onClick={saveOpenAi} type="text" placeholder="Enter your OpenAI API key" name="openai-api" />
        </div>
    );
}