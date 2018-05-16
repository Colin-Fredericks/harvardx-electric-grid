// BusStopGrapher class - constructor
var EnergyOptimizationMatrix = function() {
    
    // assign default properties
    this.config = {
        gasVariableCost: 0,
        coalVariableCost: 0,
        solarVariableCost: 0,
        batteryVariableCost: 0,
        gasCapitalCost: 0,
        coalCapitalCost: 0,
        solarCapitalCost: 0,
        batteryCapitalCost: 0,
        gasccf: 0,
        coalccf: 0,
        solarccf: 0,
        batteryccf: 0,
        loadProfile: 0,
        solarCapacityFactor: 0
    };
    
    // define variables

    this.objectiveFunction = [];
    this.A = [];
    this.b = [];
    this.A_eq = [];
    this.b_eq = [];
    this.twentyFour_zeros_array = [];

    for(var i=0; i<24; i++){
    	this.twentyFour_zeros_array.push(0);
    }

};




// methods for this class
EnergyOptimizationMatrix.prototype = {

    init: function (options) {

	   	// Get values for equations
    	for(var prop in options) {
    	    if(options.hasOwnProperty(prop)){
    	        this.config[prop] = options[prop];
    	    }
    	}
    	
    	// 		The Matrix used will have rows representing the values for g (gas), c (coal), s (solar), b (battery), b_charge (battery charge), gas/coal/solar/battery capacity, for each hour of the day (x24)
    	// 		[ g_1, g_2, ... g_24, c_1, c_2, ... c_24, s_1, s_2, ... s_24, b_1, b_2, ... b_24, b_charge1, b_charge2, ... b_charge24, g_capacity, c_capacity, s_capacity, b_capacity ]


    	// NEW MATRIX
    	this.A = [];
    	this.b = [];

    	// CREATE OBJECTIVE FUNCTION
    	this.objectiveFunction = [];
    	var gasVariableValues = [];
    	var coalVariableValues = [];
    	var solarVariableValues = [];
    	var batteryVariableValues = [];
    	for(var i=0; i<24; i++){
    		//  g_1 ... g_24
    		gasVariableValues.push(this.config['gasVariableCost']);
    		//  c_1 ... c_24
    		coalVariableValues.push(this.config['coalVariableCost']);
    		//  s_1 ... s_24
    		solarVariableValues.push(this.config['solarVariableCost']);
    		//  b_1 ... b_24
    		batteryVariableValues.push(this.config['batteryVariableCost']);
    	}
    	this.objectiveFunction = this.objectiveFunction.concat( gasVariableValues, coalVariableValues, solarVariableValues, batteryVariableValues );

    	// add b_charge1 ... b_charge24 (these values are 0 for the Objective Function)
    	for(i=0; i<24; i++){
    		this.objectiveFunction.push(0);
    	}
    	// add the capacities of the generation plants
    	var gascoef = this.config['gasccf']/365;
        var coalcoef =  this.config['coalccf']/365;
        var solarcoef =  this.config['solarccf']/365;
        var batterycoef =  this.config['batteryccf']/365;
    	this.objectiveFunction = this.objectiveFunction.concat( gascoef*this.config['gasCapitalCost'], coalcoef*this.config['coalCapitalCost'], solarcoef*this.config['solarCapitalCost'], batterycoef*this.config['batteryCapitalCost'] );
    	// console.log(this.objectiveFunction);


		var zeros = this.twentyFour_zeros_array;
    	// INEQUALITIES FOR DAILY LOADS
    	for(i=0; i<24; i++){
    		var identity_matrix = [];
    		var b_charge_pattern = [];
    		for(j=0; j<24; j++){
    			if(j==i) identity_matrix.push(-1);
    			else identity_matrix.push(0);
    			b_charge_pattern.push(0);
    		}
    		this.A.push( identity_matrix.concat( identity_matrix, identity_matrix, identity_matrix, b_charge_pattern, 0, 0, 0, 0 ) );
    		this.b = this.b.concat( -1*this.config['loadProfile'][i] );
    	}

    	// INEQUALITIES FOR GAS, COAL, AND BATTERY CAPACITIES
    	// gas
    	for(i=0; i<24; i++){
    		var identity_matrix = [];
    		for(j=0; j<24; j++){
    			if(j==i) identity_matrix.push(1);
    			else identity_matrix.push(0);
    		}
    		this.A.push( identity_matrix.concat( zeros, zeros, zeros, zeros, -1, 0, 0, 0 ) );
    		this.b = this.b.concat( 0 );
    	}
    	// coal
    	for(i=0; i<24; i++){
    		var identity_matrix = [];
    		for(j=0; j<24; j++){
    			if(j==i) identity_matrix.push(1);
    			else identity_matrix.push(0);
    		}
    		this.A.push( zeros.concat( identity_matrix, zeros, zeros, zeros, 0, -1, 0, 0 ) );
    		this.b = this.b.concat( 0 );
    	}
		// batteries
    	for(i=0; i<24; i++){
    		var identity_matrix = [];
    		for(j=0; j<24; j++){
    			if(j==i) identity_matrix.push(1);
    			else identity_matrix.push(0);
    		}
    		this.A.push( zeros.concat( zeros, zeros, zeros, identity_matrix, 0, 0, 0, -1 ) );
    		this.b = this.b.concat( 0 );
    	}
    	// facilities must have non-negative production capacities
    	this.A.push( zeros.concat( zeros, zeros, zeros, zeros, -1, 0, 0, 0 ) );
    	this.A.push( zeros.concat( zeros, zeros, zeros, zeros, 0, -1, 0, 0 ) );
    	this.A.push( zeros.concat( zeros, zeros, zeros, zeros, 0, 0, -1, 0 ) );
    	this.A.push( zeros.concat( zeros, zeros, zeros, zeros, 0, 0, 0, -1 ) );
    	for(i=0; i<4; i++){ this.b = this.b.concat( 0 ); }

    	// batteries must store non-negative amounts of energy
     	for(i=0; i<24; i++){
    		var identity_matrix = [];
    		for(j=0; j<24; j++){
    			if(j==i) identity_matrix.push(-1);
    			else identity_matrix.push(0);
    		}
    		this.A.push( zeros.concat( zeros, zeros, zeros, identity_matrix, 0, 0, 0, 0 ) );
    		this.b = this.b.concat( 0 );
    	}   	
    	// gas and coal must have non-negative hourly production
     	for(i=0; i<48; i++){
    		var identity_matrix = [];
    		for(j=0; j<48; j++){
    			if(j==i) identity_matrix.push(-1);
    			else identity_matrix.push(0);
    		}
    		this.A.push( identity_matrix.concat( zeros, zeros, zeros , 0, 0, 0, 0 ) );
    		this.b = this.b.concat( 0 );
    	} 


    	// console.log(this.A);
    	// console.log(this.b);

    	// EQUALITIES FOR SOLAR CAPACITY AND BATTERY DAILY CHARGE/DISCHARGE
		this.A_eq = [];
		this.b_eq = [];
		// solar
    	for(i=0; i<24; i++){
    		var identity_matrix = [];
    		for(j=0; j<24; j++){
    			if(j==i) identity_matrix.push(1);
    			else identity_matrix.push(0);
    		}
    		var s_capacity = -1 * this.config['solarCapacityFactor'][i];
    		this.A_eq.push( zeros.concat( zeros, identity_matrix, zeros, zeros, 0, 0, s_capacity, 0 ) );
    		this.b_eq = this.b_eq.concat( 0 );
    	}
    	//battery
    	for(i=0; i<24; i++){
    		var identity_matrix = [];
    		var b_charge_matrix = [];
    		for(j=0; j<24; j++){
    			// b_charge_matrix
    			if(j==i) b_charge_matrix.push(-1);
    			else if(j==i+1) b_charge_matrix.push(1);
    			else if(j==0 && i==23) b_charge_matrix.push(1);
    			else b_charge_matrix.push(0);

    			// identity matrix
    			if(j==i) identity_matrix.push(1);
    			else identity_matrix.push(0);
    		}
    		this.A_eq.push( zeros.concat( zeros, zeros, identity_matrix, b_charge_matrix, 0, 0, 0, 0 ) );
    		this.b_eq = this.b_eq.concat( 0 );
    	}
    	// console.log(this.A_eq);
    	// console.log(this.b_eq);

  	},
  	
  	A: function () {
  		return this.A;
  	},

  	A_eq: function () {
  		return this.A_eq;
  	},

  	b: function () {
  		return this.b;
  	},

  	b_eq: function () {
  		return this.b_eq;
  	},

  	objectiveFunction: function () {
  		return this.objectiveFunction;
  	},

    gasCapacity: function () {
        return this.objectiveFunction[120];
    },

    coalCapacity: function () {
        return this.objectiveFunction[121];
    },

    solarCapacity: function () {
        return this.objectiveFunction[122];
    },

    batteryCapacity: function () {
        return this.objectiveFunction[123];
    }
};