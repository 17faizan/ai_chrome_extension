document.getElementById('summarizePageButton').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getPageContent,
  }, async (results) => {
    const pageContent = results[0].result;
    const summary = await summarizeText(pageContent);
    document.getElementById('summaryResult').textContent = `Summary: ${summary}`;
  });
});

function getPageContent() {
  return document.body.innerText;
}

async function summarizeText(text) {
  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer openai_key`
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: `Summarize the following text: ${text}`,
      max_tokens: 150
    })
  });

  const data = await response.json();
  return data.choices[0].text.trim();
}
