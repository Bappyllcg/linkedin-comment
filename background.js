// Background service worker for API communication
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateComment') {
    fetch('https://linkedin-ai.bappy-llcg.workers.dev/', {
      method: 'POST',
      body: JSON.stringify({ prompt: request.postText }),
      headers: {'Content-Type': 'application/json'}
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => sendResponse({success: true, comment: data.response}))
    .catch(error => {
      console.error("API request error:", error);
      sendResponse({success: false, error: error.message});
    });
    return true; // Keep message channel open for async response
  }
});