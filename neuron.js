/**
 *  This is an implementation of a spiking neuron model described in:
 *      Izhikevich, Eugene M. "Simple model of spiking neurons." Neural Networks, IEEE Transactions on 14.6 (2003): 1569-1572.
 * 
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.Neuron = factory();
  }
}(this, function () {

    var optionMaker = function(a,b,c,d){
    
        return {
            "recovery" : a,
            "sensitivity" : b,
            "resetMembrane" : c,
            "resetRecovery": d,
            "fit": { "v2": 0.04, "v": 5, "b": 140 }
        };
    
    };

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    var Neuron = function(options, name){
        if(options == undefined){
          options = { "fit": {} };
        } 
        
        if(options.fit == undefined) options.fit = {};
        
        if( typeof(options) == "string" )
        {
            this.name = name || options;
            options = this[options];
        }else{
            this.name = name;
        }
        
        this.recovery = options.recovery || 0.2;
        this.sensitivity = options.sensitivity || 0.2;
        this.resetMembrane = options.resetMembrane || -60;
        this.resetRecovery = options.resetRecovery || 2;
        this.fitV2 = options.fit.v2 || 0.04;
        this.fitV = options.fit.v || 5;
        this.fitB = options.fit.b || 140;
        this.threshold = options.threshold || 30;
        
        this.v = options.resetMembrane;
        this.u = this.v * this.sensitivity;
        
        this.tick = function(input) {
            if(this.v >= this.threshold){
                this.v = this.resetMembrane;
                this.u += this.resetRecovery;
            }
            
            /**
             * Splitting this update into two cycles is REQUIRED
             * for numerical stability
             */
            this.v += 0.5 * ( this.fitV2  * this.v * this.v +
                            this.v * this.fitV +
                            this.fitB - this.u + input);
            
            this.v += 0.5 * ( this.fitV2  * this.v * this.v +
                            this.v * this.fitV +
                            this.fitB - this.u + input);
            
            this.u += this.recovery * ( this.sensitivity * this.v - this.u );
            
            return this.v < this.threshold ? this.v : this.threshold;
        };
    };
    
    Neuron.FS = optionMaker(0.1, 0.2, -65, 2);
    Neuron.RZ = optionMaker(0.1, 0.26, -65, 2);
    
    Neuron.LTS = optionMaker(0.02, 0.25, -65, 2);
    Neuron.TC = optionMaker(0.02, 0.25, -65, 0.05);
    
    Neuron.RS = optionMaker(0.02, 0.25, -65, 8);
    Neuron.IB = optionMaker(0.02, 0.2, -55, 4);
    Neuron.CH = optionMaker(0.02, 0.2, -50, 2);
    
    return Neuron;
}));