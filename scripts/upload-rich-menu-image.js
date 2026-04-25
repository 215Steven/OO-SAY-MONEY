const fs = require('fs');
const https = require('https');

// ==========================================
// 請在這裡填入您的 Access Token 與 Rich Menu ID
// ==========================================
const TOKEN = 'VB34sFRUTQXSWEmEWM8slE9zzdeDmKF2bFpZlGkrQIrR3rd65deRYL8GAT3pXMHcTIBnZE8eZKjQsEyz2IryCNRjoZPJ9DPxt3SQW+BZ+qEeXtOK75JZjVUF5EEpsFsh6Mn99q8shZHYP5GO3AecOAdB04t89/1O/w1cDnyilFU=';
const RICH_MENU_ID = 'richmenu-d97a9d1c2613381122490e05258800df';
const IMAGE_PATH = './6-grid.png'; // 替換成您的 6 格圖文圖片路徑 (格式需為 JPG 或 PNG, 2500x1686, <= 1MB)

if (!fs.existsSync(IMAGE_PATH)) {
  console.error(`找不到圖片: ${IMAGE_PATH}，請確認檔名是否正確，或是放在這個專案資料夾裡。`);
  process.exit(1);
}

const fileStat = fs.statSync(IMAGE_PATH);

const options = {
  hostname: 'api-data.line.me',
  path: `/v2/bot/richmenu/${RICH_MENU_ID}/content`,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'image/png', // 如果是 jpg 請改成 image/jpeg
    'Content-Length': fileStat.size
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('--- 圖片上傳結果 ---');
    if (res.statusCode === 200) {
       console.log('✅ 圖片上傳成功！');
    } else {
       console.log('❌ 發生錯誤，狀態碼:', res.statusCode);
       console.log('錯誤訊息:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(e);
});

// 讀取圖片並寫入 request
const fileStream = fs.createReadStream(IMAGE_PATH);
fileStream.pipe(req);
