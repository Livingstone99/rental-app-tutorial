function generatePassword() {
  var length = 8,
    charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

const keepOnlyWantedKeys = (obj, keys) => {
  let newObj = {};
  for (let key in obj) {
    if (keys.indexOf(key) !== -1) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

function containsAny(str, substrings) {
  for (var i = 0; i != substrings.length; i++) {
    var substring = substrings[i];
    if (str.indexOf(substring) != -1) {
      return true;
    }
  }
  return false;
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  do {
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  } while (color === "#000000");
  return color;
}

function getDateInYYMMDD() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  return yyyy + "-" + mm + "-" + dd;
}

function getTodayPlusOne() {
  let newDate = new Date();

  newDate.setDate(newDate.getDate() + 1);
  // get date in format YYMMDD from
  var dd = newDate.getDate();
  var mm = newDate.getMonth() + 1; //January is 0!
  var yyyy = newDate.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  return yyyy + "-" + mm + "-" + dd;
}

function getTimeInHHMMSS() {
  var today = new Date();
  var hh = today.getHours();
  var mm = today.getMinutes();
  var ss = today.getSeconds();

  if (hh < 10) {
    hh = "0" + hh;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  if (ss < 10) {
    ss = "0" + ss;
  }

  return hh + ":" + mm + ":" + ss;
}

get4CharsDigit = () => {
  var length = 4,
    charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const sortArray = (arr) => {
  return arr.sort((a, b) => b.index - a.index);
};

const sortArrayByDiscount = (arr) => {
  return arr.sort((a, b) => a.index - b.index);
};

function generateRandom4digits() {
  var digits = "0123456789";
  var retVal = "";
  for (var i = 0; i < 4; i++) {
    retVal += digits[Math.floor(Math.random() * 10)];
  }
  return retVal;
}

function generateRandom6digits() {
  var digits = "0123456789";
  var retVal = "";
  for (var i = 0; i < 6; i++) {
    retVal += digits[Math.floor(Math.random() * 10)];
  }
  return retVal;
}

function getCurrentFullDate() {
  const now = new Date();
  const currentFullDate = now.toISOString();

  return currentFullDate;
}

function getCurrentDateWithTimeOffset() {
  const now = new Date();
  const currentFullDate = now.toISOString();

  // Add 5 minutes to the current time
  const offsetDate = new Date(now.getTime() + 30 * 60000); // 5 minutes * 60 seconds * 1000 milliseconds

  const offsetFullDate = offsetDate.toISOString();

  return offsetFullDate;
}

function generateDateRange(startDate, endDate) {
  const dateArray = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    return null;
  }

  while (start <= end) {
    dateArray.push(start.toISOString().slice(0, 10));
    start.setDate(start.getDate() + 1);
  }

  return dateArray;
}

module.exports = {
  generatePassword,
  keepOnlyWantedKeys,
  containsAny,
  getRandomColor,
  getDateInYYMMDD,
  getTimeInHHMMSS,
  getTodayPlusOne,
  get4CharsDigit,
  uuidv4,
  sortArray,
  sortArrayByDiscount,
  getCurrentFullDate,
  getCurrentDateWithTimeOffset,
  generateRandom4digits,
  generateRandom6digits,
  generateDateRange
};
