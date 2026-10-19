// 山妍涼語 點餐記錄 —— 綁定於「2026手搖飲點餐記錄」試算表的 Web App
const SHEET_NAME = '點餐記錄';
const TZ = 'Asia/Taipei';
const HEADERS = ['時間', '姓名', '分類', '品項', '尺寸', '單價', '甜度', '冰塊', '加料', '加料金額', '數量', '總價'];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSpreadsheetTimeZone() !== TZ) ss.setSpreadsheetTimeZone(TZ);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getSheets()[0];
    sheet.setName(SHEET_NAME);
  }
  if (sheet.getRange(1, 1).getValue() !== HEADERS[0]) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// 在編輯器手動執行一次，完成授權並建立標題列
function setup() {
  getSheet_();
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const name = String(d.name || '').trim();
    const qty = Number(d.qty);
    const total = Number(d.total);
    if (!name || !d.item || !(qty > 0) || !(total > 0)) {
      return json_({ ok: false, error: '資料不完整' });
    }
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      getSheet_().appendRow([
        new Date(), name, d.category, d.item, d.size, Number(d.unitPrice),
        d.sugar, d.ice, (d.toppings || []).join('、'), Number(d.toppingPrice) || 0, qty, total
      ]);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  const values = getSheet_().getDataRange().getValues();
  const orders = values.slice(1).map(r => {
    const o = {};
    HEADERS.forEach((h, i) => { o[h] = r[i]; });
    o['時間'] = r[0] instanceof Date ? Utilities.formatDate(r[0], TZ, 'MM/dd HH:mm') : r[0];
    return o;
  });
  return json_({ ok: true, orders });
}
