chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarize",
    title: "Summarize Text",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "summarize" && info.selectionText) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: summarizeText,
      args: [info.selectionText]
    });
  }
});

async function summarizeText(selectedText) {
  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer YOUR_OPENAI_API_KEY`
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: `Summarize the following text: ${selectedText}`,
      max_tokens: 100
    })
  });

  const data = await response.json();
  alert(`Summary: ${data.choices[0].text.trim()}`);
}
