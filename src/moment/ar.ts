import moment from "moment";

const symbolMap: Record<string, string> = {
  "1": "١",
  "2": "٢",
  "3": "٣",
  "4": "٤",
  "5": "٥",
  "6": "٦",
  "7": "٧",
  "8": "٨",
  "9": "٩",
  "0": "٠",
};

const numberMap: Record<string, string> = {
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
  "٠": "0",
};

const months = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

moment.defineLocale("ar-custom", {
  months,
  monthsShort: months,

  weekdays: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),
  weekdaysShort: "أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),
  weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split("_"),

  longDateFormat: {
    LT: "HH:mm",
    LTS: "HH:mm:ss",
    L: "D/M/YYYY",
    LL: "D MMMM YYYY",
    LLL: "D MMMM YYYY HH:mm",
    LLLL: "dddd D MMMM YYYY HH:mm",
  },

  preparse: (string: string) =>
    string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, (m) => numberMap[m]).replace(/،/g, ","),

  postformat: (string: string) =>
    string.replace(/\d/g, (m) => symbolMap[m]).replace(/,/g, "،"),
});

export default moment;