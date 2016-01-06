describe("mixin module", function () {
    beforeEach(function() {namespace ('lib');});
    afterEach(function() {namespace (null);});
    
    
    it("should mixin function into the class", function () {
        function Clazz() {}
        function fnMixin() {}
        lib.class (Clazz, 'lib.test')
        .mixin(fnMixin);
        
        expect (Clazz.prototype.fnMixin).toEqual(fnMixin);
    });
    
    it("should mixin functions into the class", function () {
        function Clazz() {}
        var fns = {
            fnMixin1: function fnMixin1() {},
            fnMixin2: function fnMixin2() {}
        }
        lib.class (Clazz, 'lib.test')
        .mixin(fns);
        
        expect (Clazz.prototype.fnMixin1).toEqual(fns.fnMixin1);
        expect (Clazz.prototype.fnMixin2).toEqual(fns.fnMixin2);
    });
    
    it("should be able to chain mixin and inherit", function () {
        function Clazz() {}
        function Clazz2() {}
        function fnMixin() {}
        lib.class (Clazz, 'lib.test')
        lib.class (Clazz2, 'lib.test')
        .inherits (lib.test.Clazz)
        .mixin(fnMixin);
        
        expect (Clazz2.prototype.fnMixin).toEqual(fnMixin);
    });
    
    it("should not accept unnamed functions for mixin", function () {
        function Clazz() {}
        function Clazz2() {}
        
        var fns = {
            fnMixin1: function () {},
        }
        
        expect(function(){
            lib.class (Clazz, 'lib.test').mixin(function(){});
        })
        .toThrowError(lib.error.Error, 'Can not mixin with anonymus function');
        
        expect(function(){
            lib.class (Clazz2, 'lib.test').mixin(fns);
        })
        .toThrowError(lib.error.Error, 'Can not mixin with anonymus function');
    }); 
    
    it("should only use functions for mixin", function () {
        function Clazz() {}
        function Clazz2() {}
        
        var fns = {
            fnMixin1: 'not a function'
        }
        
        expect(function(){
            lib.class (Clazz, 'lib.test').mixin('Not a function');
        })
        .toThrowError(lib.error.Error, 'Must mixin with the function');
        
        expect(function(){
            lib.class (Clazz2, 'lib.test').mixin(fns);
        })
        .toThrowError(lib.error.Error, 'Must mixin with the function');
        
    }); 
});