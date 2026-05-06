import fs from 'fs';
import path from 'path';

// 請確認這裡有你的 Token (可從 .env 複製過來)
const token = "VB34sFRUTQXSWEmEWM8slE9zzdeDmKF2bFpZlGkrQIrR3rd65deRYL8GAT3pXMHcTIBnZE8eZKjQsEyz2IryCNRjoZPJ9DPxt3SQW+BZ+qEeXtOK75JZjVUF5EEpsFsh6Mn99q8shZHYP5GO3AecOAdB04t89/1O/w1cDnyilFU=";

// ==========================================
// 1. 在這裡設定你【最新的 6 格選單】動作與網址
// ==========================================
const richMenuConfig = {
  size: { width: 2500, height: 1686 },
  selected: true,
  name: "會員專屬 6 格選單 (更新版)",
  chatBarText: "會員專屬選單",
  areas: [
    {
      bounds: { x: 0, y: 0, width: 833, height: 843 },
      action: { type: "message", text: "財務防線" }
    },
    {
      bounds: { x: 833, y: 0, width: 834, height: 843 },
      action: { type: "uri", uri: "https://liff.line.me/2007659354-EofSbRGu" } // 替換這裡的 URL
    },
    {
      bounds: { x: 1667, y: 0, width: 833, height: 843 },
      action: { type: "message", text: "啟富藍圖" }
    },
    {
      bounds: { x: 0, y: 843, width: 833, height: 843 },
      action: { type: "message", text: "理財靈感" }
    },
    {
      bounds: { x: 833, y: 843, width: 834, height: 843 },
      action: { type: "message", text: "預約聊聊" }
    },
    {
      bounds: { x: 1667, y: 843, width: 833, height: 843 },
      action: { type: "uri", uri: "https://liff.line.me/2007659354-ktfXFigk" } // 替換這裡的 URL
    }
  ]
};

// ==========================================
// 2. 在這裡指定你【最新的 6 格圖片】路徑
// ==========================================
// 請將你的圖文選單圖片 (JPG/PNG，尺寸需為 2500x1686 或符合比例，檔案 < 1MB)
// 放到這個專案目錄下，並將檔名寫在這裡：
const imagePath = path.join(process.cwd(), 'richmenu-6grid.jpg');

async function createAndUploadRichMenu() {
  try {
    console.log("正在建立新的圖文選單設定...");
    // 建立 Rich Menu
    const createRes = await fetch("https://api.line.me/v2/bot/richmenu", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(richMenuConfig)
    });
    
    if (!createRes.ok) throw new Error(`建立失敗: ${await createRes.text()}`);
    const { richMenuId } = await createRes.json() as any;
    console.log(`✅ 建立成功！新的 Rich Menu ID 為: ${richMenuId}`);

    console.log("正在上傳圖片...");
    // 讀取圖片檔案
    if (!fs.existsSync(imagePath)) {
        throw new Error(`找不到圖片檔案: ${imagePath}。請確認你有把圖片放到正確位置。`);
    }
    const imageBuffer = fs.readFileSync(imagePath);

    // 上傳圖片到該 Rich Menu
    const uploadRes = await fetch(`https://api.line.me/v2/bot/richmenu/${richMenuId}/content`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "image/jpeg" // 如果是 png, 請改成 image/png
      },
      body: imageBuffer
    });

    if (!uploadRes.ok) throw new Error(`圖片上傳失敗: ${await uploadRes.text()}`);
    console.log(`✅ 圖片上傳成功！`);

    console.log("\n==============================================");
    console.log("🎉 更新完成！請將以下 ID 複製並貼到你的 .env 檔案中的 LINE_RICH_MENU_ID_6");
    console.log(richMenuId);
    console.log("==============================================\n");

  } catch (error) {
    console.error("發生錯誤:", error);
  }
}

createAndUploadRichMenu();
