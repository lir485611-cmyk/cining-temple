/**
 * 南海慈寧宮 - Google Apps Script 後端系統
 * 
 * 部署須知：
 * 1. 點擊右上角「部署」->「新增部署」。
 * 2. 類型選擇「網頁應用程式」。
 * 3. 執行身分：選擇「我」。
 * 4. 誰有權限存取：選擇「任何人」。
 */

const PRODUCT_SHEET_ID = '1AxzphT6sT3CYTwFDlhFftfZhLJh_OCfjCmxfF9I918U';
const MEMBER_SHEET_ID = '1_BseP1u7W5C6ulUkJ1kMPHu7gIJWpRbY-vxCovNunDo';
const ORDER_SHEET_ID = '1AEBWFkF1yyZe3z6E1qTAkxhpMm04YlexI-PlNoXC0Yg';

// 指定的目標回拋試算表 ID
const LIGHTING_SHEET_ID = '1ji7dhR6UqK1Xatpiu-fRuLEc67NP6gR_0cQvFr1wMac';
const INQUIRY_SHEET_ID = '1pbB2kXGjWt9PU8kbW0qiNDnkQ4bpIFK45fKjZOgc87A';

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
 * 處理點燈與問事表單提交 (回拋至指定 Sheet)
 */
function handleCustomFormSubmission(data) {
  try {
    const ssId = data.formType === '點燈報名' ? LIGHTING_SHEET_ID : INQUIRY_SHEET_ID;
    const ss = SpreadsheetApp.openById(ssId);
    const sheet = ss.getSheets()[0];
    
    let lastCol = sheet.getLastColumn();
    if (lastCol === 0) {
      const isLighting = data.formType === '點燈報名';
      const defaultHeaders = [
        "提交時間", 
        "姓名", 
        "電話", 
        "生日", 
        "性別", 
        "地址", 
        isLighting ? "項目" : "類別", 
        isLighting ? "說明" : "事由"
      ];
      sheet.getRange(1, 1, 1, defaultHeaders.length).setValues([defaultHeaders]);
      lastCol = defaultHeaders.length;
    }
    
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    
    const newRow = headers.map(header => {
      const h = header.toString().trim();
      if (h === '提交時間' || h === '時間' || h.toLowerCase() === 'timestamp') return data.timestamp || new Date().toLocaleString();
      if (h === '姓名') return data.name || '';
      if (h === '電話') return data.phone || '';
      if (h === '生日' || h === '出生日期') return data.birthday || '';
      if (h === '性別') return data.gender || '';
      if (h === '地址') return data.address || '';
      if (h === '項目' || h === '類別' || h === '請示類別') return data.item || '';
      if (h === '說明' || h === '事由' || h === '內容' || h === '問事說明' || h === '祈願內容') return data.reason || '';
      return '';
    });

    sheet.appendRow(newRow);
    return createJsonResponse({ success: true, message: '資料已成功寫入試算表' });
  } catch (e) {
    return createJsonResponse({ error: '寫入試算表失敗', details: e.toString() });
  }
}

function doGet(e) {
  const action = e.parameter.action || 'getProducts';
  try {
    if (action === 'getProducts') {
      const ss = SpreadsheetApp.openById(PRODUCT_SHEET_ID);
      const sheet = ss.getSheets()[0];
      const data = sheet.getDataRange().getValues();
      const headers = data[0].map(h => h.toString().toLowerCase().trim());
      const products = data.slice(1).map(row => {
        let obj = {};
        headers.forEach((h, i) => { obj[h] = row[i]; });
        return obj;
      }).filter(p => p.status === 'Active');
      return createJsonResponse(products);
    }
    return createJsonResponse({ error: '未知的 GET Action' });
  } catch (err) {
    return createJsonResponse({ error: '伺服器錯誤', details: err.toString() });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}