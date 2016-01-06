describe("class module", function () {
    beforeEach(function() {namespace ('lib');});
    afterEach(function() {namespace (null);});

    it("should have 'class' namespace", function () {
        namespace ('lib')
        expect(lib.class).not.toBe(null);
    });
    
    
    describe("class() should put the class constructor in", function () {
        beforeEach(function() {namespace ('lib');});
        afterEach(function() {namespace (null);});
        
        it("the newly created namespace defined as the path", function () {
            function Clazz() {}
            lib.class (Clazz, 'lib.test');
            expect(typeof lib.test.Clazz).toEqual('function');
        });

        it("the existing namespace object", function () {
            function Clazz() {}
            function Clazz2() {}

            var ns = namespace ('test')
            namespace ('test2')

            lib.class (Clazz, ns)
            lib.class (Clazz2, lib.test2)

            expect(typeof lib.test.Clazz).toEqual('function');
            expect(typeof lib.test2.Clazz2).toEqual('function');

        });

        it("the existing namespace defined by the part of the namespace path", function () {
            function Clazz() {}
            namespace ('test.definition')
            lib.class (Clazz, 'test.definition')
            expect(typeof lib.test.definition.Clazz).toEqual('function');
        });
    });
    
    describe("class() will throw exception if", function () {
        beforeEach(function() {namespace ('lib');});
        afterEach(function() {namespace (null);});

        it("the namespace in which to put the class is not specified", function () {
            function Clazz() {} 
            expect (function() {lib.class (Clazz)})
            .toThrowError(lib.error.Error, 'Must specify namespace in which to put the class');
        });

        it("the namespace in which to put the class is not found in the namespace herarchy", function () {
            function Clazz() {} 
            var invalidNamespace = {path:{}}
            expect (function() {lib.class (Clazz, invalidNamespace.path)})
            .toThrowError(lib.error.Error, 'Invalid namespace object');
        });

        it("the constructor is not a function", function () {
            var Clazz = {} 
            expect (function() {lib.class (Clazz, 'lib.test')})
            .toThrowError(lib.error.Error, 'Class constructor must be a function');
        });

        it("the constructor is anonymous function", function () {
            var Clazz = function() {} 
            expect (function() {lib.class (Clazz, 'lib.test')})
            .toThrowError(lib.error.Error, 'Can not use anonymus function for constructor');
            expect (function() {lib.class (function(){}, 'lib.test')})
            .toThrowError(lib.error.Error, 'Can not use anonymus function for constructor');
        });

        it("the class is already defined in the namespace", function () {
            function Clazz() {} 
            lib.class (Clazz, 'lib.test')
            expect (function() {lib.class (lib.test.Clazz, 'lib.test')})
            .toThrowError(lib.error.Error, 'Class is already defined lib.test.Clazz');
        }); 

    });    

});