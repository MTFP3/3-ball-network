export function sanitize(str) {
  if (typeof str !== "string") return "";
  return str.replace(/[&<>"'`=\/]/g, s =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "`": "&#96;",
      "=": "&#61;",
      "/": "&#47;"
    })[s]
  );
}