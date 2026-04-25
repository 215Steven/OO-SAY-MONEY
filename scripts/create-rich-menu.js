const fs = require('fs');
const https = require('https');

// 這個腳本用來幫助您將 6 格圖文選單透過 API 建立，因為 LINE 官方帳號後台建立的選單無法透過 API 綁定。
// 請將您的 Token 填入：
const TOKEN = 'YOUR_LINE_CHANNEL_ACCESS_TOKEN';

const richMenuObject = {
  "size": {
    "width": 2500,
    "height": 1686
  },
  "selected": true,
  "name": "Member 6-Grid Menu",
  "chatBarText": "會員專屬選單",
  "areas": [
    {
      "bounds": { "x": 0, "y": 0, "width": 833, "height": 843 },
      "action": { "type": "message", "text": "財務防線" }
    },
    {
      "bounds": { "x": 833, "y": 0, "width": 834, "height": 843 },
      "action": { "type": "uri", "uri": "https://liff.line.me/2007659354-EofSbRGu" }
    },
    {
      "bounds": { "x": 1667, "y": 0, "width": 833, "height": 843 },
      "action": { "type": "message", "text": "啟富藍圖" }
    },
    {
      "bounds": { "x": 0, "y": 843, "width": 833, "height": 843 },
      "action": { "type": "message", "text": "理財靈感" }
    },
    {
      "bounds": { "x": 833, "y": 843, "width": 834, "height": 843 },
      "action": { "type": "message", "text": "預約聊聊" }
    },
    {
      "bounds": { "x": 1667, "y": 843, "width": 833, "height": 843 },
      "action": { "type": "uri", "uri": "https://liff.line.me/2007659354-ktfXFigk" }
    }
  ]
};

const req = https.request('https://api.line.me/v2/bot/richmenu', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('--- 建立選單結果 ---');
    console.log(data);
    const json = JSON.parse(data);
    if (json.richMenuId) {
      console.log('\n✅ 成功！取得 Rich Menu ID：', json.richMenuId);
      console.log('👉 將這個 ID 填入 Netlify 的 LINE_RICH_MENU_ID_6 環境變數中！');
      console.log('\n接下來，您還需要將「6格圖」的圖片上傳給這個 ID。您可以寫另一段程式碼，或是使用 Postman 上傳。');
    }
  });
});

req.on('error', e => console.error(e));
req.write(JSON.stringify(richMenuObject));
req.end();
