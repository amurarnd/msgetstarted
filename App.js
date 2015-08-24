/**
 App MediaSignage Inc (c) open source digital signage project.
 Visit Github for license and docs: http://git.digitalsignage.com
 @class App
 @constructor
 @return {Object} instantiated App
 **/
define(['underscore', 'jquery', 'backbone', 'bootstrap', 'backbone.controller', 'ComBroker', 'Lib', 'Pepper', 'Elements', 'bootbox', 'platform', 'flashdetect', 'placeholder'], function (_, $, Backbone, Bootstrap, backbonecontroller, ComBroker, Lib, Pepper, Elements, bootbox, platform, flashdetect, placeholder) {
    var App = Backbone.Controller.extend({

        // app init
        initialize: function () {
            window.BB = Backbone;

            BB.globs = {};
            BB.SERVICES = {};
            BB.EVENTS = {};
            BB.LOADING = {};
            BB.CONSTS = {};

            BB.CONSTS.OS_UNKNOWN = 0;
            BB.CONSTS.OS_FLASH = 1;
            BB.CONSTS.OS_DESK_NO_FLASH = 2;
            BB.CONSTS.OS_MOBILE = 3;
            BB.CONSTS.STUDIO_LITE = 0;
            BB.CONSTS.STUDIO_PRO = 1;
            BB.APPS_SUPPORT = BB.CONSTS.OS_UNKNOWN;
            BB.STUDIO_TYPE = -1;

            BB.globs['UNIQUE_COUNTER'] = 0;
            BB.globs['RC4KEY'] = '226a3a42f34ddd778ed2c3ba56644315';

            BB.globs['ERI'] = 'f7bee07a7e79c8efdb961c4d30d20e10c66442110de03d6141';
            BB.globs['PRO_MODULES'] = '4.33';
            BB.globs['PRO_VERSION'] = '4';

            BB.lib = new Lib();
            BB.Pepper = new Pepper();
            _.extend(BB.Pepper, BB.comBroker);
            //BB.Pepper.setServerAddress();
            BB.lib.addBackboneViewOptions();
            BB.comBroker = new ComBroker();
            BB.comBroker.name = 'AppBroker';
            window.log = BB.lib.log;
            window.pepper = BB.Pepper;

            // modify only for private / hybrid mediaSERVER change links below
            window.g_protocol = 'http://';
            window.g_masterDomain = 'galaxy.signage.me';

            // localization
            require(['LanguageSelectorView', 'Elements'], function (LanguageSelectorView, Elements) {
                new LanguageSelectorView({el: Elements.LANGUAGE_PROMPT});
            });

            // router init
            require(['LayoutRouter', 'BusinessModel'], function (LayoutRouter, BusinessModel) {

                /**
                 modify the following lines when you are hosting the entire project
                 on your own web server (resellers / enterprise).
                 you can retrieve your reseller id by logging to the Enterprise Studio
                 and selecting Help > About
                 **/
                BB.CONSTS.REDIRECT = 'digitalsignage.com';  //'http://www.gsignage.com';
                BB.CONSTS.RESELLER = 1;                     //300762;

                new BusinessModel();
                var LayoutRouter = new LayoutRouter();
                Backbone.history.start({root: '/msgetstarted/'});
                BB.comBroker.setService(BB.SERVICES['LAYOUT_ROUTER'], LayoutRouter);
                // LayoutRouter.navigate('authenticate/_/_', {trigger: true});
            });

            // debug platforms
            // console.log('name: ' + platform.name + ' version: ' + platform.version + ' product: ' + platform.product + ' os: ' + platform.os);

            if (FlashDetect.installed || FlashDetect.versionAtLeast(13)) {
                BB.APPS_SUPPORT = BB.CONSTS.OS_FLASH;
            } else {
                var os = BB.lib.getOS();
                if (os == 'windows' || os == 'osx') {
                    BB.APPS_SUPPORT = BB.CONSTS.OS_DESK_NO_FLASH;
                } else {
                    BB.APPS_SUPPORT = BB.CONSTS.OS_MOBILE;
                }
            }
        }
    });

    return App;

});