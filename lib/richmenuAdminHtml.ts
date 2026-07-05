export const RICHMENU_ADMIN_HTML = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>會員選單管理後台</title>
<style>
  body { font-family: -apple-system, "PingFang TC", "Microsoft JhengHei", sans-serif; background: #f7f5f2; margin: 0; padding: 24px; color: #333; }
  .wrap { max-width: 720px; margin: 0 auto; }
  h1 { font-size: 20px; margin-bottom: 4px; }
  p.desc { color: #777; font-size: 13px; margin-top: 0; margin-bottom: 24px; }
  .card { background: #fff; border: 1px solid #e5e0da; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  label { display: block; font-size: 13px; color: #555; margin-bottom: 6px; font-weight: 600; }
  input[type=text], input[type=password], select {
    width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px;
    font-size: 14px; margin-bottom: 12px;
  }
  button {
    background: #2a8f8a; color: #fff; border: none; padding: 10px 18px; border-radius: 8px;
    font-size: 14px; cursor: pointer; font-weight: 600;
  }
  button:hover { background: #237370; }
  button.secondary { background: #999; }
  button:disabled { background: #ccc; cursor: not-allowed; }
  .area-row { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px dashed #eee; }
  .area-label { width: 28px; font-weight: 700; color: #2a8f8a; padding-top: 10px; }
  .area-fields { flex: 1; }
  .status { font-size: 13px; padding: 10px 12px; border-radius: 8px; margin-top: 12px; white-space: pre-wrap; }
  .status.ok { background: #e6f4ea; color: #1e7a3d; }
  .status.err { background: #fdecea; color: #b3261e; }
  #mainArea { display: none; }
</style>
</head>
<body>
<div class="wrap">
  <h1>會員選單管理後台</h1>
  <p class="desc">編輯 OO SAY MONEY 會員六格圖文選單的每格動作，儲存後會自動重建選單、重新連結所有現有會員。</p>

  <div class="card" id="tokenCard">
    <label>管理密鑰（ADMIN_TOKEN）</label>
    <input type="password" id="tokenInput" placeholder="請輸入 Vercel 環境變數 ADMIN_TOKEN 的值" />
    <button id="loadBtn">讀取目前選單</button>
    <div id="tokenStatus"></div>
  </div>

  <div id="mainArea">
    <div class="card">
      <div id="areasContainer"></div>
      <button id="saveBtn">儲存並套用</button>
      <button class="secondary" id="reloadBtn" style="margin-left:8px;">重新讀取</button>
      <div id="saveStatus"></div>
    </div>
  </div>
</div>

<script>
  const LETTERS = ["A", "B", "C", "D", "E", "F"];
  let token = localStorage.getItem("oosaymoney_admin_token") || "";
  document.getElementById("tokenInput").value = token;

  function actionToFields(action) {
    if (!action) return { type: "text", value: "", label: "" };
    if (action.type === "uri") return { type: "uri", value: action.uri || "", label: action.label || "" };
    if (action.type === "message") return { type: "message", value: action.text || "", label: action.label || "" };
    return { type: action.type || "text", value: JSON.stringify(action), label: action.label || "" };
  }

  function fieldsToAction(type, value, label) {
    if (type === "uri") return { type: "uri", uri: value, label: label || undefined };
    if (type === "message") return { type: "message", text: value, label: label || undefined };
    return { type: "message", text: value || "", label: label || undefined };
  }

  function renderAreas(areas) {
    const container = document.getElementById("areasContainer");
    container.innerHTML = "";
    areas.forEach((area, i) => {
      const f = actionToFields(area.action);
      const row = document.createElement("div");
      row.className = "area-row";
      row.innerHTML = \`
        <div class="area-label">\${LETTERS[i] || i}</div>
        <div class="area-fields">
          <label>類型</label>
          <select data-idx="\${i}" class="type-select">
            <option value="uri" \${f.type === "uri" ? "selected" : ""}>連結（開啟網址 / LIFF）</option>
            <option value="message" \${f.type === "message" ? "selected" : ""}>文字（傳送訊息）</option>
          </select>
          <label>內容（連結請填完整網址，例如 https://liff.line.me/xxxx）</label>
          <input type="text" data-idx="\${i}" class="value-input" value="\${(f.value || "").replace(/"/g, "&quot;")}" />
          <label>動作標籤（選填，僅供辨識用）</label>
          <input type="text" data-idx="\${i}" class="label-input" value="\${(f.label || "").replace(/"/g, "&quot;")}" />
        </div>
      \`;
      container.appendChild(row);
    });
  }

  async function loadRichMenu() {
    token = document.getElementById("tokenInput").value.trim();
    if (!token) { alert("請輸入 ADMIN_TOKEN"); return; }
    localStorage.setItem("oosaymoney_admin_token", token);
    const statusEl = document.getElementById("tokenStatus");
    statusEl.innerHTML = "";
    try {
      const res = await fetch("/api/admin/richmenu", { headers: { "x-admin-token": token } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || ("HTTP " + res.status));
      renderAreas(data.areas);
      document.getElementById("mainArea").style.display = "block";
      statusEl.innerHTML = '<div class="status ok">讀取成功，共 ' + data.areas.length + ' 格（目前選單 ID： ' + data.richMenuId + '）</div>';
    } catch (e) {
      statusEl.innerHTML = '<div class="status err">讀取失敗：' + e.message + '</div>';
    }
  }

  async function saveRichMenu() {
    const rows = document.querySelectorAll(".area-row");
    const areas = [];
    rows.forEach((row, i) => {
      const type = row.querySelector(".type-select").value;
      const value = row.querySelector(".value-input").value.trim();
      const label = row.querySelector(".label-input").value.trim();
      areas.push({ index: i, action: fieldsToAction(type, value, label) });
    });
    const statusEl = document.getElementById("saveStatus");
    const btn = document.getElementById("saveBtn");
    btn.disabled = true;
    statusEl.innerHTML = '<div class="status">處理中，請稍候（會重建選單並重新連結所有會員，可能需要一點時間）...</div>';
    try {
      const res = await fetch("/api/admin/richmenu", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ areas }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || ("HTTP " + res.status));
      let msg = "套用成功！\\n新選單 ID：" + data.newRichMenuId +
        "\\n已重新連結會員：" + data.relinked + " / " + data.totalMembers +
        "\\n設定已" + (data.settingPersistedToNotion ? "自動存到 Notion，之後可直接在此頁再次修改" : "無法寫入 Notion，請手動更新 Vercel 環境變數 LINE_RICH_MENU_ID_6 = " + data.newRichMenuId);
      if (data.failedUsers && data.failedUsers.length) {
        msg += "\\n\\n連結失敗（" + data.failedUsers.length + " 位）：";
        data.failedUsers.forEach(function (f) {
          msg += "\\n・" + f.userId + " → " + f.reason;
        });
      }
      statusEl.innerHTML = '<div class="status ' + (data.failedUsers && data.failedUsers.length ? 'err' : 'ok') + '">' + msg + '</div>';
    } catch (e) {
      statusEl.innerHTML = '<div class="status err">套用失敗：' + e.message + '</div>';
    } finally {
      btn.disabled = false;
    }
  }

  document.getElementById("loadBtn").addEventListener("click", loadRichMenu);
  document.getElementById("reloadBtn").addEventListener("click", loadRichMenu);
  document.getElementById("saveBtn").addEventListener("click", saveRichMenu);
  if (token) loadRichMenu();
</script>
</body>
</html>
`;
