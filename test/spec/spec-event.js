describe("event module", function () {
    beforeEach(function() {namespace ('lib');});
    afterEach(function() {namespace (null);});
    
    
    it("should mixin Event handling mechanism into the class", function () {
        function Clazz1() {}
        lib.class (Clazz1, 'lib.test')
        .mixin(lib.event.EventSupport);
        
        expect (Clazz1.prototype.on).toEqual(lib.event.EventSupport.on);
        expect (Clazz1.prototype.off).toEqual(lib.event.EventSupport.off);
        expect (Clazz1.prototype.dispatchEvent).toEqual(lib.event.EventSupport.dispatchEvent);
    });
    
    it("should be able to dispatch and handle dispatched events", function () {
        function Clazz1() {}
        lib.class (Clazz1, 'lib.test')
        .mixin(lib.event.EventSupport);
        
        Clazz1.prototype.emmitEvent = function emmitEvent(data) {
            this.dispatchEvent('testEvent', data);
        }
        

        function Clazz2(c1) {
            var self = this;
            this.c1 = c1;
            this.eventCatched = false;
            
            c1.on('testEvent', function (event){
                self.eventCatched = true;
                self.catchedEvent = event;
            });
        }
        lib.class (Clazz2, 'lib.test')
        
        
        
        var c1 = new lib.test.Clazz1();
        var c2 = new lib.test.Clazz2(c1);
        
        c1.emmitEvent();
        
        expect (c2.eventCatched).toEqual(true);
        expect (c2.catchedEvent instanceof lib.event.Event).toEqual(true);
        expect (c2.catchedEvent.name).toEqual('testEvent');
        expect (c2.catchedEvent.target).toEqual(c1);
        
        
        function Clazz3() {}
        lib.class (Clazz3, 'lib.test')
        .mixin(lib.event.EventSupport);
        
        Clazz2.prototype.emmitEvent = function emmitEvent(data) {
            this.dispatchEvent('testEvent', data);
        }
        
         new lib.test.Clazz3().dispatchEvent();
    });
});