describe("util module", function () {
    beforeEach(function() {namespace ('lib');});
    afterEach(function() {namespace (null);});
    
    
    it("isNullOrUndefined()", function () {
        expect(lib.util.isNullOrUndefined()).toEqual(true);
        expect(lib.util.isNullOrUndefined(void 0)).toEqual(true);
        expect(lib.util.isNullOrUndefined(null)).toEqual(true);
        
        expect(lib.util.isNullOrUndefined(false)).toEqual(false);
        expect(lib.util.isNullOrUndefined(0)).toEqual(false);
        expect(lib.util.isNullOrUndefined('')).toEqual(false);
        expect(lib.util.isNullOrUndefined(NaN)).toEqual(false);
        expect(lib.util.isNullOrUndefined(Infinity)).toEqual(false);
    });
    
    it("isScalar()", function () {
        expect(lib.util.isScalar(42)).toEqual(true);
        expect(lib.util.isScalar(0)).toEqual(true);
        expect(lib.util.isScalar(NaN)).toEqual(true);
        expect(lib.util.isScalar(Infinity)).toEqual(true);
        expect(lib.util.isScalar('string')).toEqual(true);
        expect(lib.util.isScalar('')).toEqual(true);
        expect(lib.util.isScalar(true)).toEqual(true);
        expect(lib.util.isScalar(false)).toEqual(true);
        
        expect(lib.util.isScalar()).toEqual(false);
        expect(lib.util.isScalar(void 0)).toEqual(false);
        expect(lib.util.isScalar(null)).toEqual(false);
        expect(lib.util.isScalar([])).toEqual(false);
        expect(lib.util.isScalar({})).toEqual(false);
    }); 
    
    it("isWindow()", function () {
        expect(lib.util.isWindow(window)).toEqual(true);
        expect(lib.util.isWindow(window.window)).toEqual(true);
        expect(lib.util.isWindow(document)).toEqual(false);
    });
    
    it("isArray()", function () {
        expect(lib.util.isArray([])).toEqual(true);
        expect(lib.util.isArray(new Array())).toEqual(true);
        expect(lib.util.isArray(document.body.childNodes)).toEqual(true);
        expect(lib.util.isArray(document.getElementsByTagName("p"))).toEqual(true);

        function fn(){}
        expect(lib.util.isArray(fn)).toEqual(false);
        expect(lib.util.isArray({})).toEqual(false);
        expect(lib.util.isArray('String')).toEqual(false);
        expect(lib.util.isArray(42)).toEqual(false);
        expect(lib.util.isArray(true)).toEqual(false);
        expect(lib.util.isArray(null)).toEqual(false);
        expect(lib.util.isArray(void 0)).toEqual(false);
        expect(lib.util.isArray()).toEqual(false);
    });

    it("applyDefaults()", function () {
        
        var defaults = {value: 'defaultValue'};
        var options = {value: 'originalValue'};
        
        expect (lib.util.applyDefaults()).toEqual({});
        
        expect (lib.util.applyDefaults(defaults)).toEqual({value: 'defaultValue'});
        expect (defaults).toEqual({value: 'defaultValue'});
        
        expect (lib.util.applyDefaults(defaults, options)).toEqual({value: 'originalValue'});
        expect (defaults).toEqual({value: 'defaultValue'});
        expect (options).toEqual({value: 'originalValue'});
    });

    it("optionValue()", function () {
        var options = {parameter: 'value'};
        expect (lib.util.optionValue()).toEqual(void 0);
        expect (lib.util.optionValue(null)).toEqual(void 0);
        expect (lib.util.optionValue({})).toEqual(void 0);
        expect (lib.util.optionValue({}, null)).toEqual(void 0);
        expect (lib.util.optionValue({}, null, 'defaultValue')).toEqual('defaultValue');
        expect (lib.util.optionValue(null, null, 'defaultValue')).toEqual('defaultValue');
        expect (lib.util.optionValue(void 0, null, 'defaultValue')).toEqual('defaultValue');
        expect (lib.util.optionValue(void 0, void 0, 'defaultValue')).toEqual('defaultValue');
        expect (lib.util.optionValue({}, 'parameter')).toEqual(void 0);
        expect (lib.util.optionValue({}, 'parameter', 'defaultValue')).toEqual('defaultValue');
        expect (lib.util.optionValue(options)).toEqual(void 0);
        expect (lib.util.optionValue(options, 'missingParameter')).toEqual(void 0);
        expect (lib.util.optionValue(options, 'missingParameter', 'defaultValue')).toEqual('defaultValue');
        expect (lib.util.optionValue(options, 'parameter')).toEqual('value');
        expect (lib.util.optionValue(options, 'parameter', 'defaultValue')).toEqual('value');
        expect (lib.util.optionValue(options, 'missinParameter', null)).toEqual(null);
    });
    
});