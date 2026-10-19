// 山妍涼語 菜單資料（依 menu.jpg 逐項建立）
const API_URL = 'https://script.google.com/macros/s/AKfycby3TU0Gvkc8y3GyMTt9H8g9GsEDFBPBJqAYQTTHnyNkrHr9jvNSws621cWvDbnPEACr/exec';

const MENU = [
  { category: '山妍選茶', items: [
    { name: '茉茉春綠', M: 35, L: 40, star: true },
    { name: '梔子綠花', M: 35, L: 40 },
    { name: '山妍烏龍', M: 35, L: 40, star: true },
    { name: '晨露青茶', M: 35, L: 40 },
    { name: '莉莉亞紅茶', M: 30, L: 35 },
    { name: '蜜香紅韻', M: 39, L: 49, star: true },
    { name: '半夏紅玉', M: 39, L: 49 },
  ]},
  { category: '山妍選乳', items: [
    { name: '茉茉春綠鮮奶', M: 55, L: 65, star: true },
    { name: '梔子綠花鮮奶', M: 55, L: 65 },
    { name: '晨露青茶鮮奶', M: 49, L: 59, star: true },
    { name: '山妍烏龍茶奶', M: 55, L: 65 },
    { name: '蜜香紅韻鮮奶', M: 59, L: 69 },
    { name: '半夏紅玉鮮奶', M: 59, L: 69, star: true },
  ]},
  { category: '無咖啡因', items: [
    { name: '懷鄉冬瓜露', M: 30, L: 35, note: '固定甜度', fixedSugar: true },
    { name: '懷鄉冬瓜鮮奶', M: 49, L: 59, note: '固定甜度', fixedSugar: true },
    { name: '洽麥茶', M: 30, L: 35 },
    { name: '洽麥鮮奶', M: 49, L: 59 },
  ]},
  { category: '山妍還果', items: [
    { name: '玉荷包晨露青', M: 59, L: 69, star: true },
    { name: '玉荷包紅韻', M: 59, L: 69, star: true },
    { name: '在欉紅芒香茉茉', M: 59, L: 69 },
    { name: '在欉紅芒香烏龍', M: 59, L: 69 },
    { name: '香橙茉茉', M: 55, L: 65 },
    { name: '甘蔗晨露青', M: 55, L: 65 },
  ]},
  { category: '山妍酪奶茶', items: [
    { name: '茉茉春綠酪奶', M: 59, L: 69, star: true },
    { name: '梔子綠花酪奶', M: 59, L: 69 },
    { name: '山妍烏龍酪奶', M: 59, L: 69, star: true },
    { name: '莉莉亞紅酪奶', M: 55, L: 65 },
    { name: '蜜香紅韻酪奶', M: 65, L: 75, star: true },
    { name: '半夏紅玉酪奶', M: 65, L: 75 },
  ]},
  { category: '山妍選味', items: [
    { name: '龍妍桂花茶', M: 45, L: 55, star: true, note: '無咖啡因' },
    { name: '龍妍桂花烏龍', M: 45, L: 55 },
    { name: '龍妍桂花青茶', M: 45, L: 55 },
    { name: '龍妍桂花鮮乳', M: 65, L: 75 },
  ]},
  { category: '山妍厚奶', items: [
    { name: '茉茉春綠厚奶', M: 45, L: 55 },
    { name: '梔子綠花厚奶', M: 45, L: 55 },
    { name: '山妍烏龍厚奶', M: 45, L: 55, star: true },
    { name: '莉莉亞紅厚奶', M: 39, L: 49 },
  ]},
];

const TOPPINGS = [
  { name: '珍珠', price: 10 },
  { name: '小芋圓', price: 10 },
  { name: '茶凍', price: 10 },
  { name: '荔枝凍', price: 15 },
  { name: '寒天波波', price: 15 },
];

const SUGARS = ['無糖', '一分糖', '三分糖', '半糖', '少糖', '全糖'];
const ICES = ['去冰', '微冰', '少冰', '正常冰', '溫', '熱'];
