// 點餐狀況頁：讀取 Google Sheet 訂單並彙總
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function render(orders) {
  const people = new Set(orders.map(o => o['姓名']));
  const cups = orders.reduce((s, o) => s + Number(o['數量']), 0);
  const total = orders.reduce((s, o) => s + Number(o['總價']), 0);
  $('sPeople').textContent = people.size;
  $('sCups').textContent = cups;
  $('sTotal').textContent = `$${total}`;

  if (!orders.length) {
    $('orders').innerHTML = '<tr><td colspan="9" class="empty">目前還沒有訂單</td></tr>';
    $('summary').innerHTML = '<tr><td colspan="6" class="empty">目前還沒有訂單</td></tr>';
    return;
  }

  $('orders').innerHTML = orders.map(o => `<tr>
    <td>${esc(o['時間'])}</td><td>${esc(o['姓名'])}</td><td>${esc(o['品項'])}</td><td>${esc(o['尺寸'])}</td>
    <td>${esc(o['甜度'])}</td><td>${esc(o['冰塊'])}</td><td>${esc(o['加料']) || '—'}</td>
    <td class="num">${esc(o['數量'])}</td><td class="num">$${esc(o['總價'])}</td></tr>`).join('');

  // 相同品項+尺寸+甜度+冰塊+加料合併，方便向店家點單
  const groups = new Map();
  orders.forEach(o => {
    const key = ['品項', '尺寸', '甜度', '冰塊', '加料'].map(k => o[k]).join('|');
    const g = groups.get(key) || { o, n: 0 };
    g.n += Number(o['數量']);
    groups.set(key, g);
  });
  $('summary').innerHTML = [...groups.values()]
    .sort((a, b) => String(a.o['品項']).localeCompare(b.o['品項'], 'zh-Hant'))
    .map(({ o, n }) => `<tr><td>${esc(o['品項'])}</td><td>${esc(o['尺寸'])}</td><td>${esc(o['甜度'])}</td>
      <td>${esc(o['冰塊'])}</td><td>${esc(o['加料']) || '—'}</td><td class="num">${n}</td></tr>`).join('');
}

async function load() {
  $('refresh').disabled = true;
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    render(data.orders.reverse());
  } catch (ex) {
    $('orders').innerHTML = `<tr><td colspan="9" class="empty">讀取失敗：${esc(ex.message)}</td></tr>`;
  } finally {
    $('refresh').disabled = false;
  }
}

$('refresh').addEventListener('click', load);
load();
