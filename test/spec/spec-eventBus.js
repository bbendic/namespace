describe("EventBus module", function () {
    beforeEach(function() {namespace ('lib');});
    afterEach(function() {namespace (null);});
    
    it("should handle subscription to the published topic", function () { 
        lib.EventBus.subscribe('topic', function(data, topic){
            expect (data).toEqual('data');
            expect (topic).toEqual('topic');
        });
        lib.EventBus.publish('topic', 'data');
    });
    
    it("should throw exception if invalid subscription handler is provided", function () { 
        
        
        expect (function() {
            lib.EventBus.subscribe('topic', {})
        })
        .toThrowError(lib.error.Error, 'Bad subsciption listener');
    });
});
