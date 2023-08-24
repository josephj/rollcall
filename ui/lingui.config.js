/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ["en", "zh-TW"],
  sourceLocale: "en",
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["src"],
    },
  ],
  format: "po",
};
