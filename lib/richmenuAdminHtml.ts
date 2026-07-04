export const RICHMENU_ADMIN_HTML = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>會員選單管理後台</title>
<style>
  body { font-family: -apple-system, "PingFang TC", "Microsoft JhengHei", sans-serif; background: #f7f5f2; margin: 0; padding: 24px; color: #333; }
  .wrap { max-width: 640px; margin: 0 auto; }
  h1 { font-size: 20px; margin-bottom: 4px; }
  p.desc { color: #777; font-size: 13px; margin-top: 0; margin-bottom: 24px; line-height: 1.6; }
  .card { background: #fff; border: 1px solid #e5e0da; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .step-title { font-size: 14px; font-weight: 700; margin-bottom: 6px; }
  .step-desc { font-size: 13px; color: #777; margin-bottom: 12px; line-height: 1.6; }
  label { display: block; font-size: 13px; color: #555; margin-bottom: 6px; font-weight: 600; }
  input[type=password] {
    width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px;
    font-size: 14px; margin-bottom: 12px;
  }
  button {
    background: #2a8f8a; color: #fff; border: none; padding: 10px 18px; border-radius: 8px;
    font-size: 14px; cursor: pointer; font-weight: 600;
  }
  button:hover { background: #237370; }
  button:disabled { background: #ccc; cursor: not-allowed; }
  a.notion-link { display: inline-block; margin-top: 10px; color: #2a8f8a; font-weight: 600; font-size: 14px; }
  .status { font-size: 13px; padding: 10px 12px; border-radius: 8px; margin-top: 12px; white-space: pre-wrap; line-height: 1.6; }
  .status.ok { background: #e6f4ea; color: #1e7a3d; }
  .status.err { background: #fdecea; color: #b3261e; }
  #steps { display: none; }
</style>
</head>
<body>
<div class="wrap">
  <h1>會員選單管理後台</h1>
  <p class="desc">OO SAY MONEY 會員六格圖文選單的實際內容改在 Notion 資料庫編輯，這裡只負責「同步」跟「套用」兩個動作。</p>

  <div class="card" id="tokenCard">
    <label>管理密鑰（ADMIN_TOKEN）</label>
    <input type="password" id="tokenInput" placeholder="請輸入 Vercel 環境變數 ADMIN_TOKEN 的值" />
    <button id="unlockBtn">開始</button>
    <div id="tokenStatus"></div>
  </div>

  <div id="steps">
    <div class="card">
      <div class="step-title">步驟 1：同步目前選單到 Notion</div>
      <div class="step-desc">第一次使用，或懷疑 Notion 內容跟 LINE 實際狀態不一致時按這個，會把「目前 LINE 選單」的 6 格內容寫進 Notion 資料庫。</div>
      <button id="syncBtn">同步目前選單到 Notion</button>
      <div id="syncStatus"></div>
    </div>

    <div class="card">
      <div class="step-title">步驟 2：去 Notion 編輯</div>
      <div class="step-desc">同步成功後，點下面連結打開 Notion 資料庫，六列對應 A～F 六格。「類型」選連結或文字，「內容」填網址或訊息文字，改完存檔即可（Notion 會自動存檔）。</div>
      <div id="notionLinkArea"></div>
    </div>

    <div class="card">
      <div class="step-title">步驟 3：套用 Notion 內容到 LINE 選單</div>
      <div class="step-desc">在 Notion 改完之後回來按這個，才會真的重建 LINE 選單、重新連結所有現有會員。</div>
      <button id="applyBtn">套用 Notion 設定到 LINE 選單</button>
      <div id="applyStatus"></div>
    </div>
  </div>
</div>

<script>
  let token = localStorage.getItem("oosaymoney_admin_token") || "";
  document.getElementById("tokenInput").value = token;

  function showSteps() {
    document.getElementById("steps").style.display = "block";
  }

  async function unlock() {
    token = document.getElementById("tokenInput").value.trim();
    if (!token) { alert("請輸入 ADMIN_TOKEN"); return; }
    localStorage.setItem("oosaymoney_admin_token", token);
    const statusEl = document.getElementById("tokenStatus");
    statusEl.innerHTML = "";
    try {
      const res = await fetch("/api/admin/richmenu", { headers: { "x-admin-token": token } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || ("HTTP " + res.status));
      statusEl.innerHTML = '<div class="status ok">驗證成功（目前選單 ID： ' + data.richMenuId + '）</div>';
      showSteps();
    } catch (e) {
      statusEl.innerHTML = '<div class="status err">驗證失敗：' + e.message + '</div>';
    }
  }

  async function syncToNotion() {
    const statusEl = document.getElementById("syncStatus");
    const btn = document.getElementById("syncBtn");
    btn.disabled = true;
    statusEl.innerHTML = '<div class="status">同步中...</div>';
    try {
      const res = await fetch("/api/admin/richmenu/sync-to-notion", {
        method: "GET",
        headers: { "x-admin-token": token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || ("HTTP " + res.status));
      statusEl.innerHTML = '<div class="status ok">同步成功！</div>';
      document.getElementById("notionLinkArea").innerHTML =
        '<a class="notion-link" href="' + data.notionUrl + '" target="_blank" rel="noopener">開啟 Notion 資料庫 →</a>';
    } catch (e) {
      statusEl.innerHTML = '<div class="status err">同步失敗：' + e.message + '</div>';
    } finally {
      btn.disabled = false;
    }
  }

  async function applyFromNotion() {
    const statusEl = document.getElementById("applyStatus");
    const btn = document.getElementById("applyBtn");
    btn.disabled = true;
    statusEl.innerHTML = '<div class="status">處理中，請稍候（會重建選單並重新連結所有會員，可能需要一點時間）...</div>';
    try {
      const res = await fetch("/api/admin/richmenu/apply", {
        method: "POST",
        headers: { "x-admin-token": token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || ("HTTP " + res.status));
      let msg = "套用成功！\\n新選單 ID：" + data.newRichMenuId +
        "\\n已重新連結會員：" + data.relinked + " / " + data.totalMembers +
        (data.failedUserIds && data.failedUserIds.length ? ("\\n連結失敗：" + data.failedUserIds.length + " 位") : "") +
        "\\n設定已" + (data.settingPersistedToNotion ? "自動存到 Notion，之後可再次修改後直接套用" : "無法寫入 Notion，請手動更新 Vercel 環境變數 LINE_RICH_MENU_ID_6 = " + data.newRichMenuId);
      statusEl.innerHTML = '<div class="status ok">' + msg + '</div>';
    } catch (e) {
      statusEl.innerHTML = '<div class="status err">套用失敗：' + e.message + '</div>';
    } finally {
      btn.disabled = false;
    }
  }

  document.getElementById("unlockBtn").addEventListener("click", unlock);
  document.getElementById("syncBtn").addEventListener("click", syncToNotion);
  document.getElementById("applyBtn").addEventListener("click", applyFromNotion);
  if (token) unlock();
</script>
</body>
</html>
`;
