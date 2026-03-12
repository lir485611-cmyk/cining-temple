/**
 * 南海慈寧宮 - Google Apps Script 後端系統
 * 負責處理線上問事與點燈報名，並將資料寫入指定的 Google Sheets
 */

// 試算表 ID 配置
const LIGHTING_SHEET_ID = '1ji7dhR6UqK1Xatpiu-fRuLEc67NP6gR_0cQvFr1wMac';
const INQUIRY_SHEET_ID = '1pbB2kXGjWt9PU8kbW0qiNDnkQ4bpIFK45fKjZOgc87A';
const PRODUCT_SHEET_ID = '1AxzphT6sT3CYTwFDlhFftfZhLJh_OCfjCmxfF9I918U'; // 商品清單試算表 ID

/**
 * 處理 POST 請求
 */
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;

    if (action === 'submitCustomForm') {
      return handleCustomFormSubmission(params);
    }
    
    return createJsonResponse({ error: '未知的 Action: ' + action });
  } catch (err) {
    return createJsonResponse({ error: '系統錯誤', details: err.toString() });
  }
}

/**
 * 處理 GET 請求
 */
function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getProducts') {
    return getProducts();
  }
  
  return ContentService.createTextOutput("南海慈寧宮後端 API 運作中。").setMimeType(ContentService.MimeType.TEXT);
}

/**
 * 獲取商品清單
 */
function getProducts() {
  try {
    const ss = SpreadsheetApp.openById(PRODUCT_SHEET_ID);
    const sheet = ss.getSheetByName('商品清單');
    
    if (!sheet) {
      return createJsonResponse({ error: '找不到「商品清單」工作表' });
    }

    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return createJsonResponse([]);

    const headers = data[0].map(h => h.toString().trim());
    const rows = data.slice(1);

    const products = rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        let value = row[index];
        // 處理數值欄位
        if (['price', 'original_price', 'stock'].includes(header)) {
          value = parseFloat(value) || 0;
        }
        obj[header] = value;
      });
      return obj;
    }).filter(p => p.status === 'Active');

    return createJsonResponse(products);
  } catch (err) {
    return createJsonResponse({ error: '獲取商品失敗', details: err.toString() });
  }
}

/**
 * 根據表單類型分流寫入不同的試算表
 */
function handleCustomFormSubmission(data) {
  try {
    // 判斷要寫入哪份試算表
    const isLighting = (data.formType === '點燈報名');
    const ssId = isLighting ? LIGHTING_SHEET_ID : INQUIRY_SHEET_ID;
    
    const ss = SpreadsheetApp.openById(ssId);
    const sheet = ss.getSheets()[0]; // 取得第一個工作表
    
    let lastCol = sheet.getLastColumn();

    // 如果是全新的表，先建立標題列
    if (lastCol === 0) {
      const headers = isLighting 
        ? ["提交時間", "信眾姓名", "聯絡電話", "性別", "項目", "其他說明"]
        : ["提交時間", "信眾姓名", "聯絡電話", "生日(國/農曆)", "性別", "地址", "項目", "其他說明"];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    // 準備新行資料
    let newRowData;
    if (isLighting) {
      newRowData = [
        data.timestamp || new Date().toLocaleString('zh-TW', { hour12: false }),
        data.name || '',
        data.phone || '',
        data.gender || '',
        data.item || '',
        data.reason || ''
      ];
    } else {
      newRowData = [
        data.timestamp || new Date().toLocaleString('zh-TW', { hour12: false }),
        data.name || '',
        data.phone || '',
        data.birthday || '',
        data.gender || '',
        data.address || '',
        data.item || '',
        data.reason || ''
      ];
    }

    sheet.appendRow(newRowData);
    return createJsonResponse({ success: true, message: '資料已同步至試算表' });
  } catch (e) {
    return createJsonResponse({ error: '寫入試算表失敗', details: e.toString() });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
