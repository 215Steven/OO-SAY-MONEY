import 'dotenv/config';

// 填入你要移除會員身分、返回訪客三格選單的 LINE User ID
const targetUserId = "Uxxxxxxxxxxxxxxxxx"; 

async function unlinkUserRichMenu() {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) {
    console.error("找不到 LINE_CHANNEL_ACCESS_TOKEN");
    return;
  }

  try {
    const response = await fetch(`https://api.line.me/v2/bot/user/${targetUserId}/richmenu`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      console.log(`✅ 成功解除綁定！User ID: ${targetUserId} 已恢復為預設訪客選單。`);
    } else {
      const errorText = await response.text();
      console.error(`❌ 解除綁定失敗:`, errorText);
    }
  } catch (err) {
    console.error(`❌ 發生錯誤:`, err);
  }
}

unlinkUserRichMenu();
