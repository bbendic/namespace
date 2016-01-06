describe("namespace core", function () {
    beforeEach(function() {namespace ('lib');});
    afterEach(function() {namespace (null);});
      
    it("first call to namespace() method must contain name of the library", function () {
        namespace (null);
        expect(function(){
            namespace();
        })
        .toThrow();
    })
       
    it("should have root namespace", function () {
        expect(lib).not.toBe(null);
    });
    
    it("should be able to create namespace object from the string path", function () {
        expect(namespace('lib.test.one')).toBe(lib.test.one);
        expect(namespace('test.one.two')).toBe(lib.test.one.two);
    });

    it("should be able to get existing namespace object from the existing string path", function () {
        expect(namespace('lib.test.one')).toBe(lib.test.one);
        expect(namespace('test.one')).toBe(lib.test.one);
    });
    
    it("should be able to identify object inside namespace hierarchy", function () {
        var test = namespace('lib.test')
        expect(namespace(lib.test)).toBe(lib.test);
        expect(test).toBe(lib.test);
    });
    
    it("should throw error if object is not part of the namespace", function () {
        var objectNotPartOfNamespace = {}
        namespace('lib.test')
        expect(function(){namespace(objectNotPartOfNamespace)})
        .toThrowError(lib.error.Error, 'Invalid namespace object');
    });
});
