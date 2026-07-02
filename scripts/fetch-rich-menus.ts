const token = "VB34sFRUTQXSWEmEWM8slE9zzdeDmKF2bFpZlGkrQIrR3rd65deRYL8GAT3pXMHcTIBnZE8eZKjQsEyz2IryCNRjoZPJ9DPxt3SQW+BZ+qEeXtOK75JZjVUF5EEpsFsh6Mn99q8shZHYP5GO3AecOAdB04t89/1O/w1cDnyilFU=";

async function listRichMenus() {
  try {
    const response = await fetch("https://api.line.me/v2/bot/richmenu/list", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(error);
  }
}

listRichMenus();
