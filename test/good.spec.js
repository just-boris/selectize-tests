describe('good tests', function () {
    function createElement(html, options) {
        var wrapper = $('<div></div>');
        $(html || "<select></select>").appendTo(wrapper).selectize(options || {});
        return wrapper;
    }

    function createAccessor(selector) {
        return function () {
            return this.element.find(selector);
        }
    }

    function SelectizeElement(element) {
        this.element = element;
    }

    SelectizeElement.prototype.destroy = function () {
        this.element.remove();
    };
    SelectizeElement.prototype.select = createAccessor('select');
    SelectizeElement.prototype.control = createAccessor('.selectize-input');
    SelectizeElement.prototype.input = createAccessor('.selectize-input input[type=text]');
    SelectizeElement.prototype.dropdown = createAccessor('.selectize-dropdown');
    SelectizeElement.prototype.options = createAccessor('.selectize-dropdown [data-selectable]');

    beforeEach(function () {
        jasmine.clock().install();
        jasmine.Ajax.install();
    });
    afterEach(function () {
        jasmine.clock().uninstall();
        jasmine.Ajax.uninstall();
    });

    describe('initialize and select', function () {
        beforeEach(function () {

            var $element = createElement('<select>' +
            '<option value="1">Foo</option>' +
            '<option value="2">Bar</option>' +
            '</select>');
            this.element = new SelectizeElement($element);
        });

        afterEach(function () {
            this.element.destroy();
        });

        it("should initialize element", function () {
            expect(this.element.select()).toHaveClass('selectized');
            expect(this.element.control()).toExist();
        });

        it("should open dropdown on click", function () {
            this.element.control().trigger('click');
            jasmine.clock().tick(1);

            expect(this.element.dropdown()).not.toHaveCss({display: 'none'});
            expect(this.element.options()).toHaveLength(2);
        });

        it("should select value from dropdown", function () {
            this.element.control().trigger('click');
            jasmine.clock().tick(1);

            this.element.options().filter(':contains("Bar")').trigger('click');
            jasmine.clock().tick(1);

            expect(this.element.control()).toHaveText('Bar');
            expect(this.element.select()).toHaveValue("2");
        });
    });

    describe("typeahead", function () {
        beforeEach(function () {
            this.loadSpy = jasmine.createSpy('load').and.callFake(function (query, callback) {
                $.ajax({
                    url: 'https://api.github.com/search/repositories?per_page=10&q=' + encodeURIComponent(query),
                    type: 'GET',
                    error: function () {
                        callback();
                    },
                    success: function (res) {
                        callback(res.items);
                    }
                });
            });

            var $element = createElement('<select></select>', {
                valueField: 'url',
                searchField: 'name',
                render: {
                    option: function (item, escape) {
                        return '<div>' + escape(item.owner.login) + '/' + escape(item.name) + '</div>';
                    }
                },
                load: this.loadSpy
            });
            this.element = new SelectizeElement($element);
        });

        afterEach(function () {
            this.element.destroy();
        });


        it("should send request after delay", function () {
            this.element.input().val('test').trigger('keyup');
            jasmine.clock().tick(1);

            expect(this.loadSpy).not.toHaveBeenCalled();
            jasmine.clock().tick(400);
            expect(this.loadSpy).toHaveBeenCalled();
        });

        fit("should fill items on response", function () {
            this.element.control().trigger('click');
            this.element.input().val('test').trigger('keyup');
            jasmine.clock().tick(400);

            expect(jasmine.Ajax.requests.mostRecent().url).toBe('https://api.github.com/search/repositories?per_page=10&q=test');
            jasmine.Ajax.requests.mostRecent().respondWith({
                "status": 200,
                "contentType": 'application/json',
                "responseText": JSON.stringify({items: [
                    {"name":"test","owner":{"login":"boostorg"},"url":"https://github.com/boostorg/test"},
                    {"name":"test","owner":{"login":"kepbautista"},"url":"https://github.com/kepbautista/test"},
                    {"name":"test","owner":{"login":"benxiaohai"},"url":"https://github.com/benxiaohai/test"},
                    {"name":"test","owner":{"login":"d1php"},"url":"https://github.com/d1php/test"},
                    {"name":"test","owner":{"login":"kewangniu"},"url":"https://github.com/kewangniu/test"},
                    {"name":"test","owner":{"login":"duojs"},"url":"https://github.com/duojs/test"},
                    {"name":"test","owner":{"login":"mbbderobles"},"url":"https://github.com/mbbderobles/test"},
                    {"name":"Test","owner":{"login":"tejaswipoluri"},"url":"https://github.com/tejaswipoluri/Test"},
                    {"name":"test","owner":{"login":"mitra"},"url":"https://github.com/mitra/test"},
                    {"name":"test","owner":{"login":"leschler"},"url":"https://github.com/leschler/test"}
                ]})
            });
            expect(this.element.options()).toHaveLength(10);
        });

    });
});
