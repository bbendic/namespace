describe("error module", function () {

    beforeEach(function() {namespace ('lib');});
    afterEach(function() {namespace (null);});
    
    it("should have 'error' namespace", function () {
        expect(lib.error).not.toBe(null);
    });

    it("should be able to throw custom error with the message", function () {
        expect(function() {lib.error.throw('message')})
        .toThrowError(lib.error.Error, 'message');
    });

    it("should be able to throw custom error with inner error object", function () {
        expect(function() {lib.error.throw(new TypeError('message2'))})
        .toThrowError(lib.error.Error, 'message2')
    });
});