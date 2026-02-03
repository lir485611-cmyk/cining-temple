
/**
 * 南海慈寧宮 - Google Apps Script 後端系統
 */

const PRODUCT_SHEET_ID = '1AxzphT6sT3CYTwFDlhFftfZhLJh_OCfjCmxfF9I918U';
const MEMBER_SHEET_ID = '1_BseP1u7W5C6ulUkJ1kMPHu7gIJWpRbY-vxCovNunDo';
const ORDER_SHEET_ID = '1AEBWFkF1yyZe3z6E1qTAkxhpMm04YlexI-PlNoXC0Yg';

/**
 * 密碼雜湊 helper (SHA-256)
 */
function hashPassword(input) {
  const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input, Utilities.Charset.UTF_8);
  let txtHash = '';
  for (let i = 0; i < rawHash.length; i++) {
    let hashVal = rawHash[i];
    if (hashVal < 0) hashVal += 256;
    if (hashVal.toString(16).length === 1) txtHash += '0';
    txtHash += hashVal.toString(16);
  }
  return txtHash;
}

/**
 * 處理 GET 請求
 */
function doGet(e) {
  const action = e.parameter.action || 'getProducts';
  
  try {
    if (action === 'getProducts') {
      return getProducts();
    }
    return createJsonResponse({ error: '未知的 GET Action: ' + action });
  } catch (err) {
    return createJsonResponse({ error: '伺服器錯誤', details: err.toString() });
  }
}

/**
 * 處理 POST 請求
 */
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;

    if (action === 'register') {
      return registerMember(params);
    } else if (action === 'login') {
      return loginMember(params);
    } else if (action === 'createOrder') {
      return createOrder(params);
    }
    
    return createJsonResponse({ error: '未知的 POST Action: ' + action });
  } catch (err) {
    return createJsonResponse({ error: '處理 POST 請求失敗', details: err.toString() });
  }
}

/**
 * 創建訂單與扣除庫存
 */
function createOrder(data) {
  const lock = LockService.getScriptLock();
  try {
    // 嘗試取得鎖定，避免併發下單導致庫存計算錯誤
    lock.waitLock(10000); 

    const productSS = SpreadsheetApp.openById(PRODUCT_SHEET_ID);
    const productSheet = productSS.getSheetByName('商品清單') || productSS.getSheets()[0];
    const productData = productSheet.getDataRange().getValues();
    const productHeaders = productData[0].map(h => h.toString().toLowerCase().trim());
    
    const idIdx = productHeaders.indexOf('product_id');
    const stockIdx = productHeaders.indexOf('stock');
    const nameIdx = productHeaders.indexOf('name');

    const cartItems = data.items; // [{product_id, quantity}]
    const updates = [];

    // 1. 檢查庫存是否充足
    for (const item of cartItems) {
      let found = false;
      for (let i = 1; i < productData.length; i++) {
        if (productData[i][idIdx].toString() === item.product_id) {
          const currentStock = Number(productData[i][stockIdx]) || 0;
          if (currentStock < item.quantity) {
            return createJsonResponse({ error: `庫存不足：${productData[i][nameIdx]} 僅剩 ${currentStock}` });
          }
          updates.push({ row: i + 1, newStock: currentStock - item.quantity });
          found = true;
          break;
        }
      }
      if (!found) return createJsonResponse({ error: `找不到商品 ID: ${item.product_id}` });
    }

    // 2. 執行庫存扣除
    updates.forEach(upd => {
      productSheet.getRange(upd.row, stockIdx + 1).setValue(upd.newStock);
    });

    // 3. 寫入訂單資訊
    const orderSS = SpreadsheetApp.openById(ORDER_SHEET_ID);
    const orderSheet = orderSS.getSheetByName('訂單資訊') || orderSS.getSheets()[0];
    const orderHeaders = orderSheet.getDataRange().getValues()[0].map(h => h.toString().toLowerCase().trim());
    
    const orderId = 'ORD' + new Date().getTime();
    const createdAt = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

    const newOrderRow = orderHeaders.map(h => {
      switch(h) {
        case 'o_id': return orderId;
        case 'm_id': return data.m_id;
        case 'o_items': return JSON.stringify(data.items);
        case 'o_total': return data.o_total;
        case 'o_status': return 'Pending'; // 預設待處理
        case 'o_shipping_addr': return data.o_shipping_addr;
        case 'o_created_at': return createdAt;
        default: return '';
      }
    });

    orderSheet.appendRow(newOrderRow);

    return createJsonResponse({ success: true, order_id: orderId });

  } catch (e) {
    return createJsonResponse({ error: '下單失敗', details: e.toString() });
  } finally {
    lock.releaseLock();
  }
}

/**
 * 商品讀取邏輯
 */
function getProducts() {
  try {
    const ss = SpreadsheetApp.openById(PRODUCT_SHEET_ID);
    let sheet = ss.getSheetByName('商品清單') || ss.getSheets()[0];
    const data = sheet.getDataRange().getValues();
    
    if (data.length < 2) return createJsonResponse({ error: '試算表內尚無法務項目數據' });

    const headers = data[0].map(h => h.toString().trim().toLowerCase());
    const keyMap = {
      'product_id': 'product_id',
      'name': 'name',
      'category': 'category',
      'price': 'price',
      'original_price': 'original_price',
      'stock': 'stock',
      'image_url': 'image_url',
      'description': 'description',
      'detail_content': 'detail_content',
      'spec': 'spec',
      'status': 'status'
    };

    const products = data.slice(1).map((row, idx) => {
      if (row.every(cell => cell === "" || cell === null)) return null;
      let obj = {};
      headers.forEach((h, i) => {
        let key = keyMap[h] || h;
        let val = row[i];
        if (['price', 'original_price', 'stock'].includes(key)) val = Number(val) || 0;
        obj[key] = val;
      });

      let strUrl = (obj.image_url || "").toString();
      if (strUrl.indexOf('drive.google.com') > -1) {
        let idMatch = strUrl.match(/\/d\/([-\w]{25,})/) || strUrl.match(/[?&]id=([-\w]{25,})/);
        if (idMatch) obj.image_url = "https://drive.google.com/uc?export=view&id=" + idMatch[1];
      }
      if (!obj.product_id) obj.product_id = 'S' + (idx + 1).toString().padStart(3, '0');
      return obj;
    }).filter(p => p !== null && p.name && p.status === 'Active');

    return createJsonResponse(products);
  } catch (e) {
    return createJsonResponse({ error: '抓取試算表失敗', details: e.toString() });
  }
}

/**
 * 會員驗證
 */
function loginMember(data) {
  const ss = SpreadsheetApp.openById(MEMBER_SHEET_ID);
  let sheet = ss.getSheetByName('會員清單') || ss.getSheets()[0];
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(h => h.toString().toLowerCase().trim());
  const emailIdx = headers.indexOf('email');
  const pwdIdx = headers.indexOf('password');
  const hashedInputPassword = hashPassword(data.password);

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (row[emailIdx].toString().trim().toLowerCase() === data.email.trim().toLowerCase() && 
        row[pwdIdx].toString() === hashedInputPassword) {
      const member = {};
      headers.forEach((header, idx) => { if (header !== 'password') member[header] = row[idx]; });
      return createJsonResponse({ success: true, member: member });
    }
  }
  return createJsonResponse({ error: '電子郵件或密碼不正確' });
}

function registerMember(data) {
  const ss = SpreadsheetApp.openById(MEMBER_SHEET_ID);
  let sheet = ss.getSheetByName('會員清單') || ss.getSheets()[0];
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(h => h.toString().toLowerCase().trim());
  const emailIndex = headers.indexOf('email');
  
  if (emailIndex !== -1) {
    for (let i = 1; i < values.length; i++) {
      if (values[i][emailIndex].toString().toLowerCase().trim() === data.email.toLowerCase().trim()) {
        return createJsonResponse({ error: '此電子郵件已被註冊' });
      }
    }
  }

  const newId = 'M' + new Date().getTime();
  const createdAt = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
  const hashedPassword = hashPassword(data.password);

  const newRow = headers.map(h => {
    switch(h) {
      case 'member_id': return newId;
      case 'email': return data.email;
      case 'password': return hashedPassword;
      case 'full_name': return data.full_name || '';
      case 'phone': return data.phone || '';
      case 'address': return data.address || '';
      case 'gender': return data.gender || '';
      case 'birthday': return data.birthday || '';
      case 'member_level': return 'Regular';
      case 'created_at': return createdAt;
      default: return '';
    }
  });

  sheet.appendRow(newRow);
  return createJsonResponse({ success: true, member: { member_id: newId, email: data.email, full_name: data.full_name, address: data.address } });
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
