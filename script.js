document.getElementById('plantForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const plantName = document.getElementById('plantName').value;
  const plantIssue = document.getElementById('plantIssue').value;

  const responseDiv = document.getElementById('response');
  responseDiv.classList.remove('hidden');
  responseDiv.innerText = 'Thinking... 🌿';

  try {
    const res = await fetch('/api/advice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ plantName, plantIssue })
    });

    const data = await res.json();
    responseDiv.innerText = data.advice || 'No advice received.';
  } catch (err) {
    responseDiv.innerText = 'Something went wrong. Please try again.';
  }
});