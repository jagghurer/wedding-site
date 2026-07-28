/*
=================================================
МАРИНА & ПАВЕЛ
RSVP API
Google Apps Script
=================================================
*/

const SHEET_ID = "1nBD3emxs77GmGnyBO7ld4aUdHI6WxSjvZFcc2w2rZBY";
const SHEET_NAME = "RSVP";

function doPost(e) {
  try {
    const rawBody = e && e.postData && e.postData.contents ? e.postData.contents : "";
    let data = {};

    if (rawBody) {
      const contentType = e && e.postData && e.postData.type ? e.postData.type : "";

      if (contentType.includes("application/json")) {
        data = JSON.parse(rawBody);
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        data = parseFormData(rawBody);
      } else {
        try {
          data = JSON.parse(rawBody);
        } catch (err) {
          data = parseFormData(rawBody);
        }
      }
    }

    if (data.website && String(data.website).trim() !== "") {
      return jsonResponse({ success: false, error: "spam" });
    }

    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }

    const headers = [
      "timestamp",
      "guestId",
      "guestDisplayName",
      "guestFormName",
      "name",
      "attending",
      "ceremony",
      "guests",
      "transfer",
      "allergy",
      "allergy_comment",
      "alcohol",
      "soft_drinks",
      "soft_drinks_comment",
      "main_dish",
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    }

    const guestId = String(data.guestId || "").trim();
    const values = sheet.getDataRange().getValues();
    let alreadyExists = false;

    for (let i = 1; i < values.length; i++) {
      if (String(values[i][1] || "") === guestId && guestId) {
        alreadyExists = true;
        break;
      }
    }

    if (alreadyExists) {
      return jsonResponse({ success: true, duplicate: true });
    }

    const row = [
      new Date(),
      guestId,
      data.guestDisplayName || "",
      data.guestFormName || "",
      data.name || "",
      data.attending || "",
      data.ceremony || "",
      data.guests || "",
      normalizeArray(data.transfer),
      data.allergy || "",
      data.allergy_comment || "",
      normalizeArray(data.alcohol),
      normalizeArray(data.soft_drinks),
      data.soft_drinks_comment || "",
      data.main_dish || "",
    ];

    sheet.appendRow(row);

    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  }
}

function doGet() {
  return jsonResponse({
    success: true,
    project: "Marina & Pavel Wedding RSVP",
    status: "online",
  });
}

function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return value || "";
}

function parseFormData(rawBody) {
  const result = {};
  const pairs = String(rawBody || "").split("&");

  pairs.forEach((pair) => {
    if (!pair) return;
    const [key, ...rest] = pair.split("=");
    const decodedKey = decodeURIComponent(key);
    const decodedValue = decodeURIComponent(rest.join("=") || "");
    result[decodedKey] = decodedValue;
  });

  return result;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
