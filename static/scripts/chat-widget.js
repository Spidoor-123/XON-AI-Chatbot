// chat-widget.js
document.body.insertAdjacentHTML('beforeend', `
  <div id="xon-chat-container" style="position:fixed; bottom:20px; right:20px; z-index:9999; font-family:sans-serif;">
    <button id="xon-chat-btn" style="background:#ed3237; color:#fff; border:none; border-radius:50%; width:60px; height:60px; font-size:24px; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.3);">🤖</button>
    <div id="xon-chat-window" style="display:none; width:350px; height:450px; background:#fff; border-radius:10px; box-shadow:0 5px 15px rgba(0,0,0,0.2); flex-direction:column; margin-bottom:15px;">
      <div style="background:#222; color:#fff; padding:15px; border-radius:10px 10px 0 0; font-weight:bold;">XON AI Security Assistant</div>
      <div id="xon-chat-history" style="flex:1; padding:15px; overflow-y:auto; font-size:14px; background:#f9f9f9;">
        <div style="margin-bottom:10px;"><b>AI:</b> Hello! Enter your email to check if your data has been compromised, or ask me a security question!</div>
      </div>
      <div style="display:flex; padding:10px; border-top:1px solid #ccc; background:#fff; border-radius:0 0 10px 10px;">
        <input type="text" id="xon-chat-input" placeholder="Enter email or question..." style="flex:1; padding:8px; border:1px solid #ccc; border-radius:5px; outline:none;">
        <button id="xon-chat-send" style="margin-left:10px; background:#ed3237; color:#fff; border:none; padding:8px 15px; border-radius:5px; cursor:pointer;">Send</button>
      </div>
    </div>
  </div>
`);

let chatMessages = [];

document.getElementById('xon-chat-btn').onclick = () => {
    const win = document.getElementById('xon-chat-window');
    win.style.display = win.style.display === 'none' ? 'flex' : 'none';
};

document.getElementById('xon-chat-send').onclick = async () => {
    const input = document.getElementById('xon-chat-input');
    const userMessage = input.value.trim();
    if(!userMessage) return;

    chatMessages.push({ role: "user", content: userMessage });

    const history = document.getElementById('xon-chat-history');
    history.innerHTML += `<div style="margin-top:10px; color:#0056b3;"><b>You:</b> ${userMessage}</div>`;
    input.value = '';
    history.innerHTML += `<div id="xon-loading" style="margin-top:10px; color:#666;"><i>Thinking...</i></div>`;
    history.scrollTop = history.scrollHeight;

    try {
        // We will call our FastAPI endpoint here
        const response = await fetch('http://localhost:8002/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: chatMessages })
        });
        const data = await response.json();
        
        chatMessages.push({ role: "assistant", content: data.reply });

        document.getElementById('xon-loading').remove();
        history.innerHTML += `<div style="margin-top:10px; background:#e8f0fe; padding:10px; border-radius:5px; color:#333;"><b>AI:</b> ${data.reply.replace(/\n/g, '<br>')}</div>`;
        history.scrollTop = history.scrollHeight;
    } catch (err) {
        document.getElementById('xon-loading').innerHTML = "<span style='color:red'>Connection error.</span>";
    }
};