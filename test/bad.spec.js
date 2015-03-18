describe('bad tests', function () {


    function createElement(html, options) {
        return $(html || "<select></select>").appendTo('body').selectize(options || {})
    }

    describe('initialize and select', function () {
        beforeEach(function () {
            this.select = createElement('<select>' +
            '<option value="1">Foo</option>' +
            '<option value="2">Bar</option>' +
            '</select>');
            this.element = $('.selectize-control')
        });

        afterEach(function () {
            this.select.remove();
            this.element.remove();
        });

        it("should initialize element", function () {
            expect(this.select.hasClass('selectized')).toBeTruthy();
            expect(this.element.length).toBe(1);
        });

        it("should open dropdown on click", function (done) {
            var spec = this;
            this.element.find('.selectize-input').trigger('click');
            window.setTimeout(function () {
                expect(spec.element.find('.selectize-dropdown').css('display')).not.toBe('none');
                expect(spec.element.find('.selectize-dropdown [data-selectable]').length).toBe(2);
                done();
            }, 1);
        });

        it("should select value from dropdown", function (done) {
            var spec = this;
            this.element.find('.selectize-input').trigger('click');

            window.setTimeout(function () {
                spec.element.find('.selectize-dropdown .option:contains("Bar")').trigger('click');
                window.setTimeout(function () {
                    expect(spec.element.find('.selectize-input').text()).toBe('Bar');
                    expect(spec.select.val()).toBe("2");
                    done();
                }, 1);
            }, 1);
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
            this.select = createElement('<select></select>', {
                valueField: 'url',
                searchField: 'name',
                render: {
                    option: function (item, escape) {
                        return '<div>' + escape(item.owner.login) + '/' + escape(item.name) + '</div>';
                    }
                },
                load: this.loadSpy
            });
            this.element = $('.selectize-control')
        });

        afterEach(function () {
            this.select.remove();
            this.element.remove();
        });



        it("should send request after delay", function (done) {
            var spec = this;
            this.element.find('.selectize-input input[type=text]').val('test').trigger('keyup');
            window.setTimeout(function () {
                expect(spec.loadSpy).not.toHaveBeenCalled();
                window.setTimeout(function() {
                    expect(spec.loadSpy).toHaveBeenCalled();
                    done();
                }, 400);
            }, 1)
        });

        it("should fill items on response", function (done) {
            var spec = this;
            this.element.find('.selectize-input').trigger('click');
            this.element.find('.selectize-input input[type=text]').val('test').trigger('keyup');
            window.setTimeout(function () {
                expect(spec.element.find('.selectize-dropdown [data-selectable]').length).toBe(10);
                done();
            }, 1000)
        });

    });
});
