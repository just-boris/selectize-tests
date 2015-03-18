module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/selectize/dist/js/standalone/selectize.js',
            'bower_components/jasmine-ajax/lib/mock-ajax.js',
            'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
            'test/*.spec.js'
        ],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: true
    });
};
