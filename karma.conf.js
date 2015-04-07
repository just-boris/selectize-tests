module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['bower', 'jasmine'],
        files: [
            'test/*.spec.js'
        ],
        bowerPackages: [
            'jquery',
            'microplugin',
            'sifter',
            'selectize',
            'jasmine-ajax',
            'jasmine-jquery'
        ],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: true
    });
};
