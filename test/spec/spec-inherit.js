describe("inherit module", function () {
    beforeEach(function() {namespace ('lib');});
    afterEach(function() {namespace (null);});
    
    it("inherits() is used for the class inheritance", function () {
        function ClazzParent(){
            this.parentProp = 'parentProp'
        };
        lib.class(ClazzParent, 'lib.test');
        ClazzParent.prototype.parentMethod = function parentMethod() {}
        
        function ClazzChild(){};
        lib.class(ClazzChild, 'lib.test')
        .inherits(lib.test.ClazzParent)
        
        expect(ClazzChild.prototype.parentMethod).toEqual(ClazzParent.prototype.parentMethod);
        
        var child = new lib.test.ClazzChild();
        expect(child instanceof lib.test.ClazzParent).toEqual(true);
        expect(child.parentProp).toEqual('parentProp');
    });

    describe("inherits() will throw exception if", function () {
        beforeEach(function() {namespace ('lib');});
        afterEach(function() {namespace (null);});
        
        it("the existing class in the hierarchy is not used as the parent class", function () {
            function ClazzParent(){};
            function ClazzChild(){};
            
            expect (function() {
                lib.class(ClazzChild, 'lib.test')
                .inherits(ClazzParent)
            })
            .toThrowError(lib.error.Error, 'Can not find canonical name for ClazzParent');
            
        });
        
        it("the function is not used as the parent class", function () {
            function ClazzChild(){};
            
            expect (function() {
                lib.class(ClazzChild, 'lib.test')
                .inherits('test')
            })
            .toThrowError(lib.error.Error, 'lib.test is not a constructor');
        });
        
    });
});