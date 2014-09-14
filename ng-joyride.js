/**
 * Created by abhik.mitra on 27/06/14.
 */

(function (angular) {


    //TYPE = ELEMENT


    //---------------------------------------------------------//

    //TYPE = TITLE


    var defaultTitleTemplate = "ng-joyride-title-tplv1.html";
    var drctv = angular.module('ngJoyRide', []);
    drctv.run(['$templateCache', function ($templateCache) {
        $templateCache.put('ng-joyride-tplv1.html',
            "<div class=\"popover ng-joyride sharp-borders\"> <div class=\"arrow\"></div>   <h3 class=\"popover-title sharp-borders\"></h3> <div class=\"popover-content container-fluid\"></div></div>"
        );
        $templateCache.put('ng-joyride-title-tplv1.html',
            "<div id=\"ng-joyride-title-tplv1\"><div class=\"ng-joyride sharp-borders intro-banner\" style=\"\"><div class=\"popover-inner\"><h3 class=\"popover-title sharp-borders\">{{heading}}</h3><div class=\"popover-content container-fluid\"><div ng-bind-html=\"content\"></div><hr><div class=\"row\"><div class=\"col-md-4 skip-class\"><a class=\"skipBtn pull-left\" type=\"button\"><i class=\"glyphicon glyphicon-ban-circle\"></i>&nbsp; Skip</a></div><div class=\"col-md-8\"><div class=\"pull-right\"><button class=\"prevBtn btn\" type=\"button\"><i class=\"glyphicon glyphicon-chevron-left\"></i>&nbsp;Previous</button> <button id=\"nextTitleBtn\" class=\"nextBtn btn btn-primary\" type=\"button\">Next&nbsp;<i class=\"glyphicon glyphicon-chevron-right\"></i></button></div></div></div></div></div></div></div>"
        );
    }]);
    drctv.factory('joyrideElement', ['$timeout', '$compile', '$sce', function ($timeout, $compile, $sce) {
        function Element(config, currentStep, template, loadTemplateFn, hasReachedEndFn, goToNextFn, goToPrevFn, skipDemoFn,isEnd, curtainClass , addClassToCurtain, shouldDisablePrevious) {
            this.currentStep = currentStep;
            this.content = $sce.trustAsHtml(config.text);
            this.selector = config.selector;
            this.template = template || 'ng-joyride-tplv1.html';
            this.popoverTemplate = '<div class=\"row\"><div id=\"pop-over-text\" class=\"col-md-12\">' + this.content + '</div></div><hr><div class=\"row\"><div class=\"col-md-4 center\"><a class=\"skipBtn pull-left\" type=\"button\"><i class=\"glyphicon glyphicon-ban-circle\" class=\"mr5\"></i>&nbsp; Skip</a></div><div class=\"col-md-8\"><div class=\"pull-right\"><button id=\"prevBtn\" class=\"prevBtn btn btn-xs\" type=\"button\"><i class=\"glyphicon glyphicon-chevron-left\"></i>&nbsp;Previous</button> <button id=\"nextBtn\" class=\"nextBtn btn btn-xs btn-primary\" type=\"button\">' + _generateTextForNext() + '</button></div></div></div>';
            this.heading = config.heading;
            this.placement = config.placement;
            this.scroll = config.scroll;
            this.staticClass = "ng-joyride-element-static";
            this.nonStaticClass = "ng-joyride-element-non-static";
            this.loadTemplateFn = loadTemplateFn;
            this.goToNextFn = goToNextFn;
            this.skipDemoFn = skipDemoFn;
            this.goToPrevFn = goToPrevFn;
            this.hasReachedEndFn = hasReachedEndFn;
            this.type = "element";
            this.curtainClass = curtainClass;
            this.addClassToCurtain = addClassToCurtain;
            this.shouldDisablePrevious = shouldDisablePrevious;
            function _generateTextForNext() {

                if (isEnd) {

                    return 'Finish';
                } else {
                    return 'Next&nbsp;<i class=\"glyphicon glyphicon-chevron-right\">'

                }
            }

        }

        Element.prototype = (function () {
            var $fkEl;

            function _showTooltip() {
                var self =this;
                $timeout(function () {
                    $fkEl.popover('show');
                    $timeout(function () {

                        $('.nextBtn').one("click",self.goToNextFn);
                        $('.prevBtn').one("click",self.goToPrevFn);
                        $('.skipBtn').one("click",self.skipDemoFn);
                        if(self.shouldDisablePrevious){
                            $('.prevBtn').prop('disabled', true);
                        }
                    });
                }, 500);
            }

            function generate() {
                $fkEl = $(this.selector);
                _highlightElement.call(this);
                handleClicksOnElement();
                this.addClassToCurtain(this.curtainClass);
                return _generateHtml.call(this).then(angular.bind(this, _generatePopover)).then(angular.bind(this, _showTooltip));



            }
            function stopEvent(event){
                event.stopPropagation();
                event.preventDefault();
            }
            function handleClicksOnElement(){
                $fkEl.on("click",stopEvent);
            }
            function _generateHtml() {

                var promise = this.loadTemplateFn(this.template);
                return promise;


            }

            function _generatePopover(html) {
                $fkEl.popover({
                    title: this.heading,
                    template: html,
                    content: this.popoverTemplate,
                    html: true,
                    placement: this.placement,
                    trigger:'manual'
                });
                if (this.scroll) {
                    _scrollToElement.call(this,this.selector);
                }
            }

            function _highlightElement() {
                var currentPos = $fkEl.css('position');
                if (currentPos === 'static') {
                    $fkEl.addClass(this.staticClass);
                } else {
                    $fkEl.addClass(this.nonStaticClass);
                }

            }

            function _scrollToElement() {

                $('html, body').animate({
                    scrollTop: $fkEl.offset().top
                }, 1000);
            }

            function _unhighlightElement() {
                $fkEl.removeClass(this.staticClass);
                $fkEl.removeClass(this.nonStaticClass);


            }

            function cleanUp() {
                _unhighlightElement.call(this);
                $fkEl.off("click",stopEvent);
                $($fkEl).popover('destroy');


            }

            return {
                generate: generate,
                cleanUp: cleanUp

            }


        })();
        return Element;
    }]);
    drctv.factory('joyrideTitle', ['$timeout', '$compile', '$sce', function ($timeout, $compile, $sce) {

        function Title(config, currentStep, scope, loadTemplateFn, hasReachedEndFn, goToNextFn, goToPrevFn, skipDemoFn, curtainClass, addClassToCurtain, shouldDisablePrevious) {

            this.currentStep = currentStep;
            this.heading = config.heading;
            this.content = $sce.trustAsHtml(config.text);
            this.titleMainDiv = '<div id="ng-joyride-title" class="ng-joyride-title"></div>';
            this.titleTemplateIdSelector = '#ng-joyride-title';
            this.loadTemplateFn = loadTemplateFn;
            this.titleTemplate = config.titleTemplate || defaultTitleTemplate;
            this.hasReachedEndFn = hasReachedEndFn;
            this.goToNextFn = goToNextFn;
            this.skipDemoFn = skipDemoFn;
            this.goToPrevFn = goToPrevFn;
            this.scope = scope;
            this.type = "title"
            this.curtainClass = curtainClass;
            this.addClassToCurtain = addClassToCurtain;
            this.shouldDisablePrevious = shouldDisablePrevious;
        }

        Title.prototype = (function () {
            var $fkEl;

            function generateTitle() {
                $('body').append(this.titleMainDiv);
                $fkEl = $(this.titleTemplateIdSelector);
                this.addClassToCurtain(this.curtainClass);
                var promise = this.loadTemplateFn(this.titleTemplate);
                promise.then(angular.bind(this,_compilePopover));


            }

            function _compilePopover(html) {
                var self = this;
                this.scope.heading = this.heading;
                this.scope.content = this.content;
                $fkEl.html($compile(html)(this.scope));
                if (this.hasReachedEndFn()) {
                    $('.nextBtn').text("Finish");
                } else {
                    $('.nextBtn').html("Next&nbsp;<i class='glyphicon glyphicon-chevron-right'>");
                }
                $fkEl.slideDown(100, function () {
                    $('.nextBtn').one("click",self.goToNextFn);
                    $('.skipBtn').one("click",self.skipDemoFn);
                    $('.prevBtn').one("click",self.goToPrevFn);

                    if(self.shouldDisablePrevious){
                        $('.prevBtn').prop('disabled', true);
                    }


                });
            }

            function cleanUp() {
                $fkEl.slideUp(100, function () {
                    $fkEl.remove();
                });
            }

            return {
                generate: generateTitle,
                cleanUp: cleanUp
            }

        })();

        return Title;


    }]);
    drctv.factory('joyrideFn', ['$timeout', '$compile', '$sce', function ($timeout, $compile, $sce) {

        function Fn(config, currentStep, parent) {
            this.currentStep = currentStep;
            if(angular.isString(config.fn)){
                this.func = parent[config.fn];
            } else {
                this.func = config.fn;
            }

            this.type = "function"


        }

        Fn.prototype = (function () {
            function generateFn() {
                this.func(true);
            }

            function cleanUp() {

            }

            function rollback(){
                this.func(false);
            }
            return {
                generate: generateFn,
                cleanUp: cleanUp,
                rollback: rollback
            }

        })();

        return Fn;


    }]);
    drctv.factory('joyrideLocationChange', ['$timeout', '$compile', '$sce', '$location', function ($timeout, $compile, $sce,$location) {

        function LocationChange(config, currentStep) {
            this.path = config.path;
            this.currentStep = currentStep;
            this.prevPath = "";
            this.type = "location_change"
            ;

        }

        LocationChange.prototype = (function () {
            function generateFn() {
                var self = this;
                this.prevPath = $location.path();
                $timeout(function () {
                    $location.path(self.path);
                },0);
            }

            function cleanUp() {

            }

            function goToPreviousPath(){
                var self = this;
                $timeout(function () {
                    $location.path(self.prevPath);
                });
            }

            return {
                generate: generateFn,
                cleanUp: cleanUp,
                rollback:goToPreviousPath
            }

        })();

        return LocationChange;


    }]);

    drctv.directive('ngJoyRide', ['$http', '$timeout', '$location', '$window', '$templateCache', '$q' , '$compile', '$sce', 'joyrideFn', 'joyrideTitle', 'joyrideElement', 'joyrideLocationChange', function ($http, $timeout, $location, $window, $templateCache, $q, $compile, $sce, joyrideFn, joyrideTitle, joyrideElement, joyrideLocationChange) {
        return {
            restrict: "A",
            scope: {
                'ngJoyRide': '=',
                'config': '=',
                'onFinish': '&',
                'onSkip': '&'

            },
            link: function (scope, element, attrs) {
                var steps = [];
                var currentStepCount = 0;
                var options = {
                    config : scope.config,
                    templateUri: attrs.templateUri
                };


                var $fkEl;
                function hasReachedEnd() {
                    return currentStepCount === (steps.length - 1);
                }
                function loadTemplate(template) {
                    if (!template) {
                        return '';
                    }
                    return $q.when($templateCache.get(template)) || $http.get(template, { cache: true });
                }
                function goToNext() {
                    if (!hasReachedEnd()) {
                        currentStepCount++;
                        cleanUpPreviousStep();
                        generateStep();
                    } else {
                        endJoyride();
                        scope.onFinish();
                    }
                }
                function endJoyride() {
                    steps[currentStepCount].cleanUp();
                    dropCurtain(false);
                    $timeout(function () {
                        scope.ngJoyRide = false;
                    });
                }
                function goToPrev() {
                    steps[currentStepCount].cleanUp();
                    var previousStep = steps[currentStepCount - 1];
                    if (previousStep.type === "location_change") {
                        scope.$evalAsync(function () {
                            previousStep.rollback();
                        });
                        currentStepCount = currentStepCount - 2;
                        $timeout(generateStep, 100);

                    } else if (previousStep.type === "function") {
                        previousStep.rollback();
                        currentStepCount = currentStepCount - 2;
                        $timeout(generateStep, 100);
                    } else {
                        currentStepCount--;
                        generateStep();
                    }

                }

                function skipDemo() {

                    endJoyride();
                    scope.onSkip();
                }

                function dropCurtain(shouldDrop) {
                    var curtain;
                    $fkEl = $('#ng-curtain');
                    if (shouldDrop) {
                        if ($fkEl.size() === 0) {
                            $('body').append('<div id="ng-curtain"></div>');
                            $fkEl = $('#ng-curtain');
                            $fkEl.slideDown(1000);
                            $fkEl.animate({opacity: 0.5}, 400, '');
                        } else {

                            $fkEl.animate({opacity: 0.5}, 400, '');
                        }
                    } else {
                        $fkEl.slideUp(100, function () {
                            $fkEl.remove();
                        });

                    }


                }

                scope.$watch('ngJoyRide', function (newval, oldval) {
                    if(newval){
                        destroyJoyride();
                        initializeJoyride();
                        currentStepCount = 0;
                        dropCurtain(true);
                        cleanUpPreviousStep();
                        generateStep();
                    }
                });
                function destroyJoyride(){
                    steps.forEach(function(elem){
                        elem.cleanUp();
                    });
                    dropCurtain(false);
                }
                function cleanUpPreviousStep() {
                    if(currentStepCount!==0){
                        steps[currentStepCount-1].cleanUp();
                    }

                }

                function generateStep() {
                    var currentStep = steps[currentStepCount];
                    currentStep.generate();
                    var interval = 500;
                    if (currentStep.type === "location_change") {

                        $timeout(function () {
                            goToNext();
                        }, interval);

                    } else if (currentStep.type === "function") {
                        $timeout(function () {
                            goToNext();
                        }, interval*2);

                    }
                }
                function changeCurtainClass(className){
                    $fkEl.removeClass();
                    if(className){
                        $fkEl.addClass(className);
                    }

                }
                function initializeJoyride() {
                    var count = -1,isFirst = true,disablePrevious;
                    steps = options.config.map(function (step) {
                        count++;
                        switch (step.type) {
                            case "location_change":
                                return new joyrideLocationChange(step, count);

                            case "element":
                                disablePrevious = isFirst
                                isFirst = isFirst ? false:false;

                                return new joyrideElement(step, count, options.templateUri, loadTemplate, hasReachedEnd, goToNext, goToPrev, skipDemo, count === (options.config.length-1),step.curtainClass,changeCurtainClass, disablePrevious);

                            case "title":
                                disablePrevious = isFirst;
                                isFirst = isFirst ? false:false;
                                return new joyrideTitle(step, count, scope, loadTemplate, hasReachedEnd, goToNext, goToPrev, skipDemo, step.curtainClass,changeCurtainClass,disablePrevious);

                            case "function":
                                return new joyrideFn(step, count, scope.$parent);

                        }

                    });
                }
            }
        };


    }]);


})(angular);
