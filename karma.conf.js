module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      { pattern: 'src/**/*.test.js', type: 'module', included: true },
      { pattern: 'src/util/test-utils.js', type: 'module', included: false },
      { pattern: 'dist/*.js', type: 'module', included: false },
    ],
    exclude: [],
    preprocessors: {},
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome', 'Firefox', 'Edge'],
    singleRun: true,
    concurrency: Infinity,
    plugins: ['karma-jasmine', 'karma-spec-reporter', 'karma-chrome-launcher', 'karma-firefox-launcher', require('@chiragrupani/karma-chromium-edge-launcher')],
  });
};
