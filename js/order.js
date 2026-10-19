// 點餐頁：產生表單、即時計算價格、送出至 Google Sheet
const $ = id => document.getElementById(id);
const form = $('orderForm');
let qty = 1;

function chip(group, value, label, type = 'radio') {
  const id = `${group}-${value}`;
  return `<label><input class="chip-input" type="${type}" name="${group}" id="${id}" value="${value}"><span class="chip">${label}</span></label>`;
}

function renderForm() {
  $('tabs').innerHTML = MENU.map((c, i) =>
    `<button type="button" class="tab${i === 0 ? ' active' : ''}" data-cat="${i}" role="tab">${c.category}</button>`
  ).join('');

  $('drinks').innerHTML = MENU.map((c, ci) => c.items.map((d, di) => `
    <label data-cat="${ci}"${ci === 0 ? '' : ' hidden'}>
      <input class="chip-input" type="radio" name="drink" value="${ci}-${di}">
      <span class="drink">
        <span class="dname">${d.name}</span>${d.star ? '<span class="star">★</span>' : ''}${d.note ? `<span class="note">${d.note}</span>` : ''}
        <span class="dprice">M $${d.M}・L $${d.L}</span>
      </span>
    </label>`).join('')).join('');

  $('sizes').innerHTML = chip('size', 'M', '中杯 M') + chip('size', 'L', '大杯 L');
  $('sugars').innerHTML = SUGARS.map(s => chip('sugar', s, s)).join('');
  $('ices').innerHTML = ICES.map(s => chip('ice', s, s)).join('');
  $('toppings').innerHTML = TOPPINGS.map((t, i) => chip('topping', i, `${t.name} +$${t.price}`, 'checkbox')).join('');

  form.size.value = 'M';
}

function getDrink() {
  const v = form.drink.value;
  if (!v) return null;
  const [ci, di] = v.split('-').map(Number);
  return { category: MENU[ci].category, ...MENU[ci].items[di] };
}

function getOrder() {
  const drink = getDrink();
  const size = form.size.value;
  const toppings = [...form.querySelectorAll('input[name=topping]:checked')].map(el => TOPPINGS[el.value]);
  const unitPrice = drink ? drink[size] : 0;
  const toppingPrice = toppings.reduce((s, t) => s + t.price, 0);
  return {
    name: $('name').value.trim(),
    category: drink ? drink.category : '',
    item: drink ? drink.name : '',
    size,
    unitPrice,
    sugar: drink && drink.fixedSugar ? '固定甜度' : form.sugar.value,
    ice: form.ice.value,
    toppings: toppings.map(t => t.name),
    toppingPrice,
    qty,
    total: drink ? (unitPrice + toppingPrice) * qty : 0,
  };
}

function update() {
  const drink = getDrink();
  const fixed = !!(drink && drink.fixedSugar);
  form.querySelectorAll('input[name=sugar]').forEach(el => {
    el.disabled = fixed;
    if (fixed) el.checked = false;
  });
  $('sugarHint').textContent = fixed ? '此飲品為固定甜度' : '';

  const o = getOrder();
  $('pName').textContent = o.name || '—';
  $('pItem').textContent = o.item ? `${o.item}（${o.size}）` : '尚未選擇';
  $('pUnit').textContent = `$${o.unitPrice}`;
  $('pSugarIce').textContent = [o.sugar, o.ice].filter(Boolean).join(' / ') || '—';
  $('pTop').textContent = o.toppings.length ? `${o.toppings.join('、')}（+$${o.toppingPrice}）` : '無';
  $('pQty').textContent = o.qty;
  $('qty').textContent = qty;
  $('pTotal').textContent = `$${o.total}`;
}

function showMsg(text, ok) {
  const el = $('msg');
  el.textContent = text;
  el.className = `msg ${ok ? 'ok' : 'err'}`;
}

function validate(o) {
  if (!o.name) return '請輸入姓名';
  if (!o.item) return '請選擇飲品';
  if (!o.sugar) return '請選擇甜度';
  if (!o.ice) return '請選擇冰塊';
  return '';
}

$('tabs').addEventListener('click', e => {
  const btn = e.target.closest('.tab');
  if (!btn) return;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === btn));
  document.querySelectorAll('#drinks label').forEach(l => { l.hidden = l.dataset.cat !== btn.dataset.cat; });
});
$('minus').addEventListener('click', () => { qty = Math.max(1, qty - 1); update(); });
$('plus').addEventListener('click', () => { qty = Math.min(20, qty + 1); update(); });
form.addEventListener('input', update);
form.addEventListener('change', update);

form.addEventListener('submit', async e => {
  e.preventDefault();
  const o = getOrder();
  const err = validate(o);
  if (err) return showMsg(err, false);

  $('msg').className = 'msg';
  const btn = $('submitBtn');
  btn.disabled = true;
  btn.textContent = '送出中…';
  try {
    // text/plain 可避免 CORS 預檢，Apps Script 端以 JSON.parse 解析
    const res = await fetch(API_URL, { method: 'POST', body: JSON.stringify(o), headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || '送出失敗');
    showMsg(`✔ 已送出：${o.name} 的 ${o.item}（${o.size}）× ${o.qty}，共 $${o.total}`, true);
    const name = o.name;
    form.reset();
    $('name').value = name;
    form.size.value = 'M';
    qty = 1;
    update();
  } catch (ex) {
    showMsg(`送出失敗，請稍後再試（${ex.message}）`, false);
  } finally {
    btn.disabled = false;
    btn.textContent = '送出訂單';
  }
});

renderForm();
update();
