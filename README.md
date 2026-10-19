# 山妍涼語 班級手搖飲點餐系統

方便班級同學點山妍涼語飲料的網站，訂單儲存於 Google Sheet「2026手搖飲點餐記錄」。

## 網址

- GitHub Pages：https://jjjames737858-sys.github.io/2026teashop/
- 點餐頁：https://jjjames737858-sys.github.io/2026teashop/index.html
- 點餐狀況：https://jjjames737858-sys.github.io/2026teashop/status.html

## 結構

| 路徑 | 說明 |
| --- | --- |
| `index.html` | 點餐頁（菜單／表單｜價格） |
| `status.html` | 點餐狀況（統計、品項彙總、訂單明細） |
| `js/menu.js` | 菜單資料與 Apps Script Web App 網址 |
| `gas/` | 綁定於 Google Sheet 的 Apps Script（使用 clasp 管理） |

## 更新 Apps Script

```bash
cd gas
clasp push
clasp update-deployment AKfycby3TU0Gvkc8y3GyMTt9H8g9GsEDFBPBJqAYQTTHnyNkrHr9jvNSws621cWvDbnPEACr
```
