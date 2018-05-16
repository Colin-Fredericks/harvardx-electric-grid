$(document).ready(function(){
	
	self = this;
	this.energyOptimizationMatrix = new EnergyOptimizationMatrix();
	// display settings
	this.defaultPrecision = 3; // number of decimal places to display
	this.utilizationPrecision = 4; // number of decimal places to display
	this.capacityPrecision = 4; // number of decimal places to display
	this.percentCostsPrecision = 0;
	this.scenarios = {
		defaultScenario: {
			gasCapitalCost: 1100,
			coalCapitalCost: 3000,
			solarCapitalCost: 1500,
			batteryCapitalCost: 500,
			gasFuelCost: 8.5,
			coalFuelCost: 3,
			solarCapacityFactor: 'defaultFactor'
		},
		winter: {
			gasCapitalCost: 1100,
			coalCapitalCost: 3000,
			solarCapitalCost: 1500,
			batteryCapitalCost: 500,
			gasFuelCost: 8.5,
			coalFuelCost: 3,
			solarCapacityFactor: 'lowFactor'
		},
		summer: {
			gasCapitalCost: 1100,
			coalCapitalCost: 3000,
			solarCapitalCost: 1500,
			batteryCapitalCost: 500,
			gasFuelCost: 8.5,
			coalFuelCost: 3,
			solarCapacityFactor: 'highFactor'
		},
		US2015Average: {
			gasCapitalCost: 1100,
			coalCapitalCost: 3000,
			solarCapitalCost: 1500,
			batteryCapitalCost: 500,
			gasFuelCost: 3,
			coalFuelCost: 2,
			solarCapacityFactor: 'highFactor'
		},
		US2010Average: {
			gasCapitalCost: 1100,
			coalCapitalCost: 3000,
			solarCapitalCost: 3000,
			batteryCapitalCost: 1000,
			gasFuelCost: 7,
			coalFuelCost: 2,
			solarCapacityFactor: 'defaultFactor'
		}
		/*
		// no longer used...
		,
		US2015Winter: {
			gasCapitalCost: 1100,
			coalCapitalCost: 3000,
			solarCapitalCost: 1500,
			batteryCapitalCost: 500,
			gasFuelCost: 3,
			coalFuelCost: 2,
			solarCapacityFactor: 'defaultFactor'
		},
		unsubsidizedSolar: {
			gasCapitalCost: 1100,
			coalCapitalCost: 3000,
			solarCapitalCost: 2500,
			batteryCapitalCost: 500,
			gasFuelCost: 8.5,
			coalFuelCost: 3,
			solarCapacityFactor: 'defaultFactor'
		}*/
	};

	this.loadProfiles = {
		defaultLoad: [ 1.28, 1.23,	1.21,	1.21,	1.26,	1.4,	1.64,	1.75,	1.75,	1.75,	1.77,	1.77,	1.77,	1.78,	1.79,	1.8,	1.86,	2,	1.97,	1.9,	1.81,	1.68,	1.52,	1.39 ],
		summer: [ 1.36220000,	1.33301000,	1.32328000,	1.31355000,	1.31355000,	1.34274000,	1.39139000,	1.48869000,	1.58599000,	1.67356000,	1.74167000,	1.79032000,	1.84870000,	1.89735000,	1.92654000,	1.93627000,	1.95573000,	1.93627000,	1.87789000,	1.80978000,	1.79032000,	1.70275000,	1.54707000,	1.40112000 ],
		peakLoadShifting: [ 1.52, 1.5, 1.5, 1.53, 1.57, 1.59, 1.61, 1.64, 1.66, 1.67, 1.69, 1.69, 1.69, 1.7, 1.71, 1.72, 1.72, 1.72, 1.71, 1.7, 1.67, 1.64, 1.59, 1.55 ],
		// old - peakLoadShifting: [ 1.36000000,	1.35000000,	1.35000000,	1.36000000,	1.38000000,	1.40000000,	1.64000000,	1.75000000,	1.75000000,	1.75000000,	1.77000000,	1.77000000,	1.77000000,	1.78000000,	1.79000000,	1.80000000,	1.80000000,	1.80000000,	1.80000000,	1.79000000,	1.75000000,	1.68000000,	1.52000000,	1.38000000 ],
		// northernLatitudeWinter: [ 1.40, 1.37, 1.36, 1.35, 1.40352, 1.47576, 1.66152, 1.77504, 1.79568, 1.77504, 1.73376, 1.69248, 1.66152, 1.6512, 1.6512, 1.68216, 1.76472, 1.89888, 1.89888, 1.84728, 1.78536, 1.68216, 1.55, 1.42 ],
		// californiaDuckCurve: [ 1.50795540,	1.47564207,	1.46487096, 1.45409985,	1.45409985,	1.48641318,	1.54026873,	1.64797983,	1.72692000,	1.71585000,	1.68264000,	1.61622000,	1.56087000,	1.53873000,	1.53873000,	1.57194000,	1.63836000,	1.74906000,	1.87083000,	1.92618000,1.97046000,	1.88494425,	1.71260649,	1.55103984 ]
	};
	this.solarCapacityFactors = {
		highFactor: [ 0.00000000000, 0.00000000000,	0.00000000000,	0.00000000000,	0.00000000000,	0.00000000000,	0.06534210606,	0.294997259172, 0.532314678588, 0.682580237724, 0.783253904664, 0.820713874596, 0.829014662784, 0.83391, 0.824970689004, 0.755158927908, 0.659593437888, 0.507412312176, 0.26860500744, 0.05831836164, 0, 0, 0, 0 ],
		// old highFactor: [ 0.00000000000,	0.00000000000,	0.00000000000,	0.00000000000,	0.00000000000,	0.00000000000,	0.07425239325,	0.33522415815,	0.60490304385,	0.77565936105,	0.89006125530,	0.93262940295,	0.94206211680,	0.94762500000,	0.93746669205,	0.85813514535,	0.74953799760,	0.57660490020,	0.30523296300,	0.06627086550,	0.00000000000,	0.00000000000,	0.00000000000,	0.00000000000 ],
		defaultFactor: [ 0.00000000000,	0.00000000000,	0.00000000000,	0.00000000000,	0.00000000000,	0.00000000000,	0.04880000000,	0.21960000000,	0.40260000000,	0.52460000000,	0.59780000000,	0.62220000000,	0.63440000000,	0.63440000000,	0.63440000000,	0.57340000000,	0.50020000000,	0.39040000000,	0.20740000000,	0.04880000000,	0.00000000000,	0.00000000000,	0.00000000000,	0.00000000000 ],
		lowFactor: [ 0.00000000000,	0.00000000000,	0.00000000000,	0.00000000000,	0.00000000000,	0.00000000000,	0.03904000000,	0.17568000000,	0.32208000000,	0.41968000000,	0.47824000000,	0.49776000000,	0.50752000000,	0.50752000000,	0.50752000000,	0.45872000000,	0.40016000000,	0.31232000000,	0.16592000000,	0.03904000000,	0.00000000000,	0.00000000000,	0.00000000000,	0.00000000000 ]
	};

	// default values
	this.calculationValues = {
		CCF: 0.11,
		gasCCF: 0.11,
		coalCCF: 0.11,
		solarCCF: 0.11,
		batteryCCF: 0.11,
		loadProfile: this.loadProfiles.defaultLoad,
		solarCapacityFactor: this.solarCapacityFactors.defaultFactor,
		carbonPrice: 0,
		gasCapitalCost: 1100, // ($/kW)
		gasFuelCost: 8.3, // ($/GJ)
		gasVOM: 0, //.009,
		gasEfficiency: 0.44,
		coalCapitalCost: 3000, // ($/kW)
		coalFuelCost: 1.7, // ($/GJ)
		coalVOM: 0, //0.004,
		coalEfficiency: 0.36,
		solarFuelCost: 0, // not adjustable in UI, not displayed
		solarCapitalCost: 1000, // ($/kW)
		solarVOM: 0, //0.001,
		solarEfficiency: 1.00, // not adjustable in UI, not displayed
		batteryFuelCost: 0, // not adjustabel in UI, not displayed
		batteryCapitalCost: 500, // ($/kW)
		batteryVOM: 0, //0.001,
		batteryEfficiency: 1.00, //0.97,

		// calculated values...
		gasUtilization: 0,
		gasCapacity: 0,
		gasTotalProduction: 0,
		coalUtilization: 0,
		coalCapacity: 0,
		coalTotalProduction: 0,
		solarUtilization: 0,
		solarCapacity: 0,
		gasTotalProduction: 0,
		batteryUtilization: 0,
		batteryCapacity: 0,
		totalCost:0,
		averageCost:0,
		totalLoad:0,
		carbonIntensity:0,
		averageCostPercentFixed:0,
		averageCostPercentVariable:0
	}

	// For calculating intensity graph
	this.addPointInterval = null;
	this.isCalculatingIntensity = false;
	this.costIntensityData = [];


	// EVENTS

	// Scenario Pulldown
	$("#scenarioBtn").on("click", function(e){
		e.preventDefault();
	});

	$("#scenarioDefault").on("click", function(e){
		console.log('scenarioDefault');
		$("#scenarioBtnText").text("Default");
		setScenario(self.scenarios.defaultScenario);
		e.preventDefault();
	});

	$("#scenarioWinter").on("click", function(e){
		console.log('scenarioWinter');
		$("#scenarioBtnText").text("Winter");
		setScenario(self.scenarios.winter);
		e.preventDefault();
	});

	$("#scenarioSummer").on("click", function(e){
		console.log('scenarioSummer');
		$("#scenarioBtnText").text("Summer");
		setScenario(self.scenarios.summer);
		e.preventDefault();
	});

	$("#scenarioUnsubsidizedSolar").on("click", function(e){
		console.log('scenarioUnsubsidizedSolar');
		$("#scenarioBtnText").text("Unsubsidized Solar");
		setScenario(self.scenarios.unsubsidizedSolar);
		e.preventDefault();
	});

	$("#scenarioUS2015Average").on("click", function(e){
		console.log('scenarioUS2015Average');
		$("#scenarioBtnText").text("US 2015 Average");
		setScenario(self.scenarios.US2015Average);
		e.preventDefault();
	});

	$("#scenarioUS2015Winter").on("click", function(e){
		console.log('scenarioUS2015Winter');
		$("#scenarioBtnText").text("US 2015 Winter");
		setScenario(self.scenarios.US2015Winter);
		e.preventDefault();
	});

	$("#scenarioUS2010Average").on("click", function(e){
		console.log('scenarioUS2010Average');
		$("#scenarioBtnText").text("US 2010 Average");
		setScenario(self.scenarios.US2010Average);
		e.preventDefault();
	});


	// LoadProfile Pulldown
	$("#loadProfileBtn").on("click", function(e){
		e.preventDefault();
	});

	$("#defaultLoad").on("click", function(e){
		console.log('defaultLoad');
		$("#loadProfileBtnText").text("Default");
		setLoadProfile(self.loadProfiles.defaultLoad);
		e.preventDefault();
	});

	$("#northernLatitudeWinter").on("click", function(e){
		console.log('northernLatitudeWinter');
		$("#loadProfileBtnText").text("Northen Latitude Winter");
		setLoadProfile(self.loadProfiles.northernLatitudeWinter);
		e.preventDefault();
	});

	$("#summer").on("click", function(e){
		console.log('summer');
		$("#loadProfileBtnText").text("Summer");
		setLoadProfile(self.loadProfiles.summer);
		e.preventDefault();
	});

	$("#peakLoadShifting").on("click", function(e){
		console.log('peakLoadShifting');
		$("#loadProfileBtnText").text("Peak Load Shifting");
		setLoadProfile(self.loadProfiles.peakLoadShifting);
		e.preventDefault();
	});

	$("#californiaDuckCurve").on("click", function(e){
		console.log('californiaDuckCurve');
		$("#loadProfileBtnText").text("California Duck Curve");
		setLoadProfile(self.loadProfiles.californiaDuckCurve);
		e.preventDefault();
	});

	// Calculate Button
	$( "#calculateBtn" ).on('click', function(){
		// SWITCH WHICH GRAPH IS VISIBLE
		$("#flot-graph").show();
		$("#flot-intensity-graph").hide();
		calculateOptimizedSystem();
	});

	// Cost vs Intensity Button
	$( "#intensityBtn" ).on('click', function(){
		// SWITCH WHICH GRAPH IS VISIBLE
		$("#flot-graph").hide();
		$("#flot-intensity-graph").show();
		calculateIntensity();
	} );


	// On Blur from Input Fields
	$('.text-input-in-table').change(function(event) {  /// focus   blur
		 $("#scenarioBtnText").text("Custom");
	});

	function init(){
		setScenario(self.scenarios.defaultScenario);		
		populateInputValues();
		calculateOptimizedSystem();
		$("#flot-intensity-graph").hide();
	};

	function setScenario(scenario){
		// update scenario values
		self.calculationValues.gasCapitalCost = scenario.gasCapitalCost; // ($/kW)
		self.calculationValues.gasFuelCost = scenario.gasFuelCost; // ($/GJ)
		self.calculationValues.coalCapitalCost = scenario.coalCapitalCost; // ($/kW)
		self.calculationValues.coalFuelCost = scenario.coalFuelCost; // ($/GJ)
		self.calculationValues.solarFuelCost = 0; // not adjustable in UI; not displayed
		self.calculationValues.solarCapitalCost = scenario.solarCapitalCost; // ($/kW)
		self.calculationValues.batteryFuelCost = 0; // not adjustabel in UI; not displayed
		self.calculationValues.batteryCapitalCost = scenario.batteryCapitalCost; // ($/kW)
		self.calculationValues.solarCapacityFactor = self.solarCapacityFactors[scenario.solarCapacityFactor];
		self.calculationValues.CCF = 0.11;
		self.calculationValues.gasCCF = 0.11;
		self.calculationValues.coalCCF = 0.11;
		self.calculationValues.solarCCF = 0.11;
		self.calculationValues.batteryCCF = 0.11;

		// set other default values
		self.calculationValues.carbonPrice = 0;
		self.calculationValues.gasEfficiency = 0.44;
		self.calculationValues.coalEfficiency = 0.36;

		populateInputValues();
		// calculateOptimizedSystem();
	};

	function setLoadProfile(loadProfile){
		self.calculationValues.loadProfile = loadProfile;
		// calculateOptimizedSystem();
	};

	function populateInputValues(){
		// Populate Input Values in table
		$( "#gasCapitalCost" ).val(self.calculationValues['gasCapitalCost']);

		$( "#gasFuelCost" ).val(self.calculationValues['gasFuelCost']);
		$( "#gasVOM" ).val(self.calculationValues['gasVOM']);
		$( "#gasEfficiency" ).val(self.calculationValues['gasEfficiency']);

		$( "#coalCapitalCost" ).val(self.calculationValues['coalCapitalCost']);
		$( "#coalFuelCost" ).val(self.calculationValues['coalFuelCost']);
		$( "#coalVOM" ).val(self.calculationValues['coalVOM']);
		$( "#coalEfficiency" ).val(self.calculationValues['coalEfficiency']);

		$( "#solarCapitalCost" ).val(self.calculationValues['solarCapitalCost']);
		$( "#solarFuelCost").val(' - ');
		$( "#solarVOM" ).val(self.calculationValues['solarVOM']);
		$( "#solarEfficiency").val(' - ');

		$( "#batteryCapitalCost" ).val(self.calculationValues['batteryCapitalCost']);
		$( "#batteryFuelCost").val(' - ');
		$( "#batteryVOM" ).val(self.calculationValues['batteryVOM']);
		$( "#batteryEfficiency").val(' - ');
		$( "#batteryUtilization" ).val('-');

		$( "#carbonPrice").val(self.calculationValues['carbonPrice']);
		$( "#ccf").val(self.calculationValues['CCF']);
	};

	function calculateOptimizedSystem(){
		// If already calculating the intensity, then stop the calculation first
		if( self.isCalculatingIntensity ) clearInterval(self.addPointInterval);
		self.isCalculatingIntensity = false;

		// CHECK ALL INPUTS ARE NUMBERS (prevent letters and symbols from breaking calculations)
		if( !inputValuesAreGood() ) {
			alert('One or more of the entered values are not a number. The calculation cannot be performed.');
			return;
		}

		// GET VALUES FROM USER
		getInputValues();

		// DO CALCULATIONS and DISPLAY THEM
		// OPTIMIZATION
		calculateOptimization();

        // console.log('linear algebra solution = ' + self.linearAlgebraSolver.solution);
        // POST OPTIMIZATION CALCULATIONS - (should move into separate function because used by both graphs)
		$( "#gasCapacity").val( (self.calculationValues['gasCapacity'] = self.linearAlgebraSolver.solution[120]).toFixed(self.capacityPrecision));
		$( "#coalCapacity").val((self.calculationValues['coalCapacity'] = self.linearAlgebraSolver.solution[121]).toFixed(self.capacityPrecision));
		$( "#solarCapacity").val((self.calculationValues['solarCapacity'] = self.linearAlgebraSolver.solution[122]).toFixed(self.capacityPrecision));
		$( "#batteryCapacity").val((self.calculationValues['batteryCapacity'] = self.linearAlgebraSolver.solution[123]).toFixed(self.capacityPrecision));

		var totalLoad = self.calculationValues['totalLoad'] = sumArray(self.calculationValues['loadProfile']);
		var totalCost = self.calculationValues['totalCost']	= numeric.dot(self.energyOptimizationMatrix.objectiveFunction, self.linearAlgebraSolver.solution);
		console.log('total cost = '+ totalCost);
		self.calculationValues['averageCost'] = totalCost / totalLoad;

		var gasHourly = self.linearAlgebraSolver.solution.slice(0, 24);
		var coalHourly = self.linearAlgebraSolver.solution.slice(24, 48);
		var solarHourly = self.linearAlgebraSolver.solution.slice(48, 72);
		var batteryHourly = self.linearAlgebraSolver.solution.slice(72, 96);
		var gasTotal = self.calculationValues['gasTotalProduction'] = sumArray(gasHourly);
		var coalTotal = self.calculationValues['coalTotalProduction'] = sumArray(coalHourly);
		var solarTotal = self.calculationValues['solarTotalProduction'] = sumArray(solarHourly);
		var batteryTotal = sumArray(batteryHourly);
		console.log('gasHourly = '+ gasHourly);
		console.log('coalHourly = '+coalHourly);
		console.log('solarHourly = '+self.linearAlgebraSolver.solution.slice(48, 72));
		console.log('batteryHourly = '+self.linearAlgebraSolver.solution.slice(72, 96));
		var gridTotal = gasTotal + coalTotal + solarTotal + batteryTotal;
		var gasCarbonIntensity = 50 / self.calculationValues['gasEfficiency'] / 277;
		var coalCarbonIntensity = 90 / self.calculationValues['coalEfficiency'] / 277;
		console.log('gasTotal = '+gasTotal);
		console.log('coalTotal = '+coalTotal);
		console.log('solarTotal = '+solarTotal);
		console.log('batteryTotal = '+batteryTotal);
		console.log('gridTotal = '+gridTotal);
		console.log('gasCarbonIntensity = '+gasCarbonIntensity);
		console.log('coalCarbonIntensity = '+coalCarbonIntensity);

		self.calculationValues['carbonIntensity'] = ( gasTotal * gasCarbonIntensity + coalTotal * coalCarbonIntensity ) / gridTotal;

		self.calculationValues['averageCostPercentFixed'] = sumArray( [ 
																	self.calculationValues['gasCapacity'] * self.calculationValues['gasCapitalCost'] * self.calculationValues['gasCCF'] , 
																	self.calculationValues['coalCapacity'] * self.calculationValues['coalCapitalCost'] * self.calculationValues['coalCCF'], 
																	self.calculationValues['solarCapacity'] * self.calculationValues['solarCapitalCost'] * self.calculationValues['solarCCF'], 
																	self.calculationValues['batteryCapacity'] * self.calculationValues['batteryCapitalCost'] * self.calculationValues['batteryCCF']
																] )  /  365 / self.calculationValues['totalCost'] * 100;

		console.log('fixed costs = '+ sumArray( [ 
																	self.calculationValues['gasCapacity'] * self.calculationValues['gasCapitalCost'] * self.calculationValues['gasCCF'] , 
																	self.calculationValues['coalCapacity'] * self.calculationValues['coalCapitalCost'] * self.calculationValues['coalCCF'], 
																	self.calculationValues['solarCapacity'] * self.calculationValues['solarCapitalCost'] * self.calculationValues['solarCCF'], 
																	self.calculationValues['batteryCapacity'] * self.calculationValues['batteryCapitalCost'] * self.calculationValues['batteryCCF']
																] ) / 365 );
		console.log('total cost = '+ self.calculationValues['totalCost']);

		self.calculationValues['averageCostPercentVariable'] = sumArray( [ 
																	self.calculationValues['gasFuelCost'] * gasTotal / self.calculationValues['gasEfficiency'],
																	self.calculationValues['coalFuelCost'] * coalTotal / self.calculationValues['coalEfficiency'],
																	self.calculationValues['solarFuelCost'] * solarTotal / self.calculationValues['solarEfficiency'],
																	self.calculationValues['batteryFuelCost'] * batteryTotal / self.calculationValues['batteryEfficiency']
																]) / 277.778 / self.calculationValues['totalCost'] * 100;
		console.log('variableCost = '+ sumArray( [ 
																	self.calculationValues['gasFuelCost'] * gasTotal / self.calculationValues['gasEfficiency'],
																	self.calculationValues['coalFuelCost'] * coalTotal / self.calculationValues['coalEfficiency'],
																	self.calculationValues['solarFuelCost'] * solarTotal / self.calculationValues['solarEfficiency'],
																	self.calculationValues['batteryFuelCost'] * batteryTotal / self.calculationValues['batteryEfficiency']
																]) / 277.778 );

		$( "#averageCost").val((self.calculationValues['averageCost']).toFixed(self.defaultPrecision));
		$( "#carbonIntensity").val((self.calculationValues['carbonIntensity']).toFixed(self.defaultPrecision));
		$( "#gasUtilization").val( (self.calculationValues['gasUtilization'] = gasTotal / 24 / Math.max(0.0001, self.calculationValues['gasCapacity'])).toFixed(self.utilizationPrecision) );
		$( "#coalUtilization").val( (self.calculationValues['coalUtilization'] = coalTotal / 24 / Math.max(0.0001, self.calculationValues['coalCapacity'])).toFixed(self.utilizationPrecision) );
		$( "#solarUtilization").val( (self.calculationValues['solarUtilization'] = solarTotal / 24 / Math.max(0.0001, self.calculationValues['solarCapacity'])).toFixed(self.utilizationPrecision) );
		var batteryFullness = sumArray(self.linearAlgebraSolver.solution.slice(96, 120)); // this totals the hourly fullness of the battery (Wh) not the charge/discharge (change in Wh)
		$( "#batteryUtilization").val( '-' );
		$( "#averageCostPercentFixed").val((self.calculationValues['averageCostPercentFixed']).toFixed(self.percentCostsPrecision) + '%');
		$( "#averageCostPercentVariable").val((self.calculationValues['averageCostPercentVariable']).toFixed(self.percentCostsPrecision) + '%');
		

		// GRAPH
		// create data series
		var gasPlotData = formatArrayAsSeriesOf_x_y_Coordinates( gasHourly );
		var coalPlotData = formatArrayAsSeriesOf_x_y_Coordinates( coalHourly );
		var solarPlotData = formatArrayAsSeriesOf_x_y_Coordinates( self.linearAlgebraSolver.solution.slice(48, 72) );
		// for battery create two series (because of how we graph negative values, and how flot handles stacked data series), one series for positive values (stacked) and one for negative values (not stacked)
		var batteryHourly = self.linearAlgebraSolver.solution.slice(72, 96); // this is the hourly charging/discharging, not fullness
		// functiont to grab values that are negative or positive
		function positiveValues(array){
			var newArray = [];
			for(var i=0; i<array.length; i++){ newArray.push( Math.max( array[i], 0 ) ); }
			return newArray;
		}
		function negativeValues(array){
			var newArray = [];
			for(var i=0; i<array.length; i++){ newArray.push( Math.min( array[i], 0 ) ); }
			return newArray;
		}

		var batteryHourlyPositive = positiveValues( batteryHourly );
		var batteryTotalPositive = sumArray( batteryHourlyPositive );

		var batteryPositivePlotData = formatArrayAsSeriesOf_x_y_Coordinates( positiveValues( batteryHourly ) );
		var batteryNegativePlotData = formatArrayAsSeriesOf_x_y_Coordinates( negativeValues( batteryHourly ) );
		var loadPlotData = formatArrayAsSeriesOf_x_y_Coordinates( self.calculationValues['loadProfile'] );

		$.plot("#flot-graph", [ 
				{
					data:gasPlotData,
					label: "Gas"
				}, 
				{
					data:coalPlotData,
					label: "Coal"
				}, 
				{
					data:solarPlotData,
					label: "Solar"
				},
				{
					data: batteryPositivePlotData,
					label: "Battery"
				},
				{
					data: batteryNegativePlotData,
					label: "Battery",
					stack: false,
					hideInLegend: true // custom value to make Battery only appear once in Legend
				},
				{
					data: loadPlotData,
					lines: { 
						show: true, 
						fill: false,
						lineWidth: 5
					 },
					bars: { show: false },
					stack: false,
					label: "Load",
					hoverable: false, // disable tooltip and interactivity for load series
					clickable: false // disable tooltip and interactivity for load series
				}
				// base line - has an issue with domain
				// ,
				// {
				// 	data: [[1,0],[24,0]],
				// 	lines: {
				// 		show: true,
				// 		lineWidth: 2,
				// 		color: 000,
				// 		shadow: false
				// 	},
				// 	stack: false,
				// }
			], 
			{
				series: {
					stack: true,
					// lines: {
					// 	show: true,
					// 	fill: true
					// },
					bars: {
						show: true,
						barWidth: 0.4,
						lineWidth: 0,
						fill: 1,
						align:'center'
					},
					legend: {
						show: true
					}
				},
				xaxis: {
					ticks: 24,
					tickDecimals: 0
				},
				grid: {
					backgroundColor: { colors: [ "#fff", "#eee" ] },
					borderWidth: {
						top: 1,
						right: 1,
						bottom: 2,
						left: 2
					}
					,
					markings: [
				      { color: '#424242', lineWidth: 2, yaxis: { from: 0, to: 0 } },
				    ],
				    hoverable: true, //IMPORTANT! this is needed for tooltip to work
				    clickable: true
				},
				colors: [ "#FC6B74", "#79B1E7", "#80C756", "#E75DF6", "#E75DF6", "brown" ],
				legend: {
					 noColumns: 5,
					 labelFormatter: function(label, series) {
					 		if(series.hideInLegend) return null;
							else return label;
						}
				},
				axislLabels: {
					show: true
				},
				xaxes: [{
					axisLabel: 'Hour',
				}],
				yaxes: [{
					axisLabel: 'Generation or Load That Hour (GW)'
				}],
                tooltip: {
                    show: true,
                    content: "%yGW %s"
                }
			});
		
		// Graph Footnote
		var v_offset = 257;
		console.log('v_offset ' +v_offset);
		$("#flot-graph").append("<div style='position:absolute;right:12px;top:" + v_offset + "px;color:#C95EF0;font-size:smaller'>Negative values indicate battery charging</div>");
	

		// ARIA Results

		// Summary Values
		$("#aria-daily-gas-generation").text('Gas generation is ' + gasTotal.toFixed(1) + ' Giga Watt Hours.');
		$("#aria-daily-coal-generation").text('Coal generation is ' + coalTotal.toFixed(1) + ' Giga Watt Hours.');
		$("#aria-daily-solar-generation").text('Solar generation is ' + solarTotal.toFixed(1) + ' Giga Watt Hours.');
		$("#aria-daily-battery-generation").text('Battery generation is ' + batteryTotalPositive.toFixed(1) + ' Giga Watt Hours.');
		
		// Hourly Table
		// init table
		var tbody = $('#optimization-results-table tbody');
		tbody.empty();
		var tr = $('<tr>');
		// var tr = $('<tr class="sr">');
		$('<td>').html('Hour').appendTo(tr);  
		$('<td>').html('Gas Generation').appendTo(tr);
		$('<td>').html('Coal Generation').appendTo(tr);
		$('<td>').html('Solar Generation').appendTo(tr);
		$('<td>').html('Battery Generation').appendTo(tr);
		tbody.append(tr);
		// add table h
		for(var h = 0; h<24; h++){
			tr = $('<tr>');
			$('<td>').html( (h+1) ).appendTo(tr);
			$('<td>').html( gasHourly[h].toFixed(1) + ' Giga Watts' ).appendTo(tr);
			$('<td>').html( coalHourly[h].toFixed(1) + ' Giga Watts' ).appendTo(tr);
			$('<td>').html( solarHourly[h].toFixed(1) + ' Giga Watts' ).appendTo(tr);
			$('<td>').html( batteryHourly[h].toFixed(1) + ' Giga Watts' ).appendTo(tr);
			tbody.append(tr);
		}
	};	
	
	function calculateIntensity(){
		// If already calculating the intensity, then stop the calculation first
		if( self.isCalculatingIntensity ) clearInterval(self.addPointInterval);
		self.isCalculatingIntensity = true;

		// CHECK ALL INPUTS ARE NUMBERS (prevent letters and symbols from breaking calculations)
		if( !inputValuesAreGood() ) {
			alert('One or more of the entered values are not a number. The calculation cannot be performed.');
			return;
		}

		// GET VALUES FROM USER
		getInputValues();

		// SETUP GRAPH w/o data
		// create data series
		var costIntensityGraphData = [];
		var intensityPlot = $.plot("#flot-intensity-graph", [{
				data: costIntensityGraphData,
				// lines: { show: true },
				points: { show: true }
			}],
			{
				xaxes: [{
					axisLabel: 'Carbon Intensity (tCO<sub>2</sub>/kWh)',
					min:0, max: 1, tickSize: .1
				}],
				yaxes: [{
					axisLabel: 'Electricity Cost ($/kWh)',
					axisLabelPadding: 13
				}],
				grid: {
					backgroundColor: { colors: [ "#fff", "#eee" ] },
					borderWidth: {
						top: 1,
						right: 1,
						bottom: 2,
						left: 2
					},
				    hoverable: true, //IMPORTANT! this is needed for tooltip to work
				    clickable: true
				},
	            tooltip: {
	                show: true,
	                content: function(label, xval, yval, flotItem){
	                		var i = flotItem.dataIndex;
	                		return "Gas Capacity = " + self.costIntensityData[i].gasCapacity.toFixed(self.capacityPrecision) + " GW " + '<br>' + 
		                		"Coal Capacity = " + self.costIntensityData[i].coalCapacity.toFixed(self.capacityPrecision) + " GW " +  '<br>' + 
		                		"Solar Capacity = " + self.costIntensityData[i].solarCapacity.toFixed(self.capacityPrecision) + " GW " + '<br>' + 
		                		"Battery Capacity = " + self.costIntensityData[i].batteryCapacity.toFixed(self.capacityPrecision) + " GWh " + '<br>' + 
		                		"Carbon Price = " + self.costIntensityData[i].carbonPrice + " $/tCO<sub>2</sub>";
						}
	            }
	        }
		);

		// Graph Title
		var v_offset = -20
		$("#flot-intensity-graph").append("<div style='position:absolute; text-align: center; width: 100%; top:" + v_offset + "px;font-size:18px;'>Electricity Cost vs Carbon Intensity</div>");

		// DO STANDARD CALCULATIONS TO FILL IN TABLE (also makes other graph which doesn't display - could use a refactoring)
		calculateOptimizedSystem();

		// DO CALCULATIONS - looping through carbon tax values and running optiization for each point
		var i = 0;
		var originalCarbonTax = self.calculationValues['carbonPrice'];
		var simulatedCarbonTax = 0;
		var carbonTaxStep = 10; // ($/tCO2)
		self.costIntensityData = [];
		var carbonIntensity = 0;

		function addPoint(){
			self.calculationValues.carbonPrice = simulatedCarbonTax;
			calculateOptimization();
			var gasTotal = sumArray( self.linearAlgebraSolver.solution.slice(0, 24) );
			var coalTotal = sumArray( self.linearAlgebraSolver.solution.slice(24, 48) );
			var solarTotal = sumArray(self.linearAlgebraSolver.solution.slice(48, 72));
			var batteryTotal = sumArray(self.linearAlgebraSolver.solution.slice(72, 96));
	   		var gridTotal = gasTotal + coalTotal + solarTotal + batteryTotal;
	   		var gasCarbonIntensity = 50 / self.calculationValues['gasEfficiency'] / 277;
			var coalCarbonIntensity = 90 / self.calculationValues['coalEfficiency'] / 277;
			carbonIntensity = ( gasTotal * gasCarbonIntensity + coalTotal * coalCarbonIntensity ) / gridTotal;
			var totalLoad = sumArray(self.calculationValues['loadProfile']);
			var totalCost = numeric.dot(self.energyOptimizationMatrix.objectiveFunction, self.linearAlgebraSolver.solution);
			var averageCost = totalCost / totalLoad;
			
			self.costIntensityData.push( {
				gasCapacity: self.linearAlgebraSolver.solution[120],
				coalCapacity: self.linearAlgebraSolver.solution[121],
				solarCapacity: self.linearAlgebraSolver.solution[122],
				batteryCapacity: self.linearAlgebraSolver.solution[123],
				carbonPrice: simulatedCarbonTax,
				electricityCost: averageCost,
				carbonIntensity: carbonIntensity
			});

			console.log('i = ' + i + '  carbonTax = ' + simulatedCarbonTax + '  carbonIntensity = ' + carbonIntensity + '  electricityCost = ' + averageCost + '  |  Capacity  gas: ' + self.costIntensityData[i].gasCapacity + ' coal: ' + self.costIntensityData[i].coalCapacity + ' solar: ' + self.costIntensityData[i].solarCapacity + ' battery: ' + self.costIntensityData[i].batteryCapacity );
		    simulatedCarbonTax += carbonTaxStep;
		    i++;

		    // Update Carbon Price
		    $( "#carbonPrice").val( simulatedCarbonTax );
		    // Add point to Graph
		    var allData = intensityPlot.getData();
		    allData[0].data.push( [ carbonIntensity, averageCost ] );
		    intensityPlot.setData(allData);
		    // intensityPlot.setupGrid();
		    intensityPlot.draw();

		    if ( carbonIntensity < .001 || i > 300 ) graphComplete();
		};

		function graphComplete(){
			clearInterval(self.addPointInterval);
	    	// return to the original value set by the user
			self.calculationValues.carbonPrice = originalCarbonTax;
			$( "#carbonPrice").val( originalCarbonTax );
			ariaResults();
		};

		self.addPointInterval = setInterval(addPoint, 10);
		self.isCalculatingIntensity = false;

		// ARIA Results
		function ariaResults(){
			// Summary Values
			$("#aria-intensity-lowest-price").text('Lowest electricity price is ' + self.costIntensityData[0].electricityCost.toFixed(3) + '$ per kilo watt hour.');
			$("#aria-intensity-zero-carbon").text('Zero carbon intensity costs ' + self.costIntensityData[self.costIntensityData.length - 1].electricityCost.toFixed(3) + '$ per kilo watt hour.');
			
			// Data Point Table
			// init table
			var tbody = $('#intensity-results-table tbody');
			tbody.empty();
			var tr = $('<tr>');
			$('<td>').html('Data Point Number').appendTo(tr);  
			$('<td>').html('Carbon Intensity').appendTo(tr);  
			$('<td>').html('Electricity Cost').appendTo(tr);
			$('<td>').html('Carbon Price').appendTo(tr);
			$('<td>').html('Gas Capacity').appendTo(tr);
			$('<td>').html('Coal Capacity').appendTo(tr);
			$('<td>').html('Solar Capacity').appendTo(tr);
			$('<td>').html('Battery Capacity').appendTo(tr);
			tbody.append(tr);
			// add table data points
			for(var p = 0; p<self.costIntensityData.length; p++){
				tr = $('<tr>');
				$('<td>').html( (p+1) ).appendTo(tr);
				$('<td>').html( self.costIntensityData[p].carbonIntensity.toFixed(2) + ' t, C O 2 per kilo Watt hour' ).appendTo(tr);
				$('<td>').html( self.costIntensityData[p].electricityCost.toFixed(2) + ' $ per kilo watt hour' ).appendTo(tr);
				$('<td>').html( self.costIntensityData[p].carbonPrice.toFixed(1) + ' $ per t, C O 2' ).appendTo(tr);
				$('<td>').html( self.costIntensityData[p].gasCapacity.toFixed(1) + ' Giga Watts' ).appendTo(tr);
				$('<td>').html( self.costIntensityData[p].coalCapacity.toFixed(1) + ' Giga Watts' ).appendTo(tr);
				$('<td>').html( self.costIntensityData[p].solarCapacity.toFixed(1) + ' Giga Watts' ).appendTo(tr);
				$('<td>').html( self.costIntensityData[p].batteryCapacity.toFixed(1) + ' Giga Watts' ).appendTo(tr);
				tbody.append(tr);
			}
		}
	};	


	// Calculations & Tasks
	function getInputValues(){
		self.calculationValues['gasCapitalCost'] = $( "#gasCapitalCost" ).val();
		self.calculationValues['gasFuelCost'] = $( "#gasFuelCost" ).val();
		self.calculationValues['gasEfficiency'] = $( "#gasEfficiency" ).val();
		self.calculationValues['coalCapitalCost'] = $( "#coalCapitalCost" ).val();
		self.calculationValues['coalFuelCost'] = $( "#coalFuelCost" ).val();
		self.calculationValues['coalEfficiency'] = $( "#coalEfficiency" ).val();
		self.calculationValues['solarCapitalCost'] = $( "#solarCapitalCost" ).val();
		self.calculationValues['batteryCapitalCost'] = $( "#batteryCapitalCost" ).val();
		self.calculationValues['carbonPrice'] = $( "#carbonPrice").val();
		self.calculationValues['CCF'] = $( "#ccf").val();
		self.calculationValues['gasCCF'] = self.calculationValues['CCF'];
		self.calculationValues['coalCCF'] = self.calculationValues['CCF'];
		self.calculationValues['solarCCF'] = self.calculationValues['CCF'];
		self.calculationValues['batteryCCF'] = self.calculationValues['CCF'];
	};

	function calculateOptimization(){
		self.energyOptimizationMatrix.init(
			{
		        gasVariableCost: variableCost( self.calculationValues['gasFuelCost']/277.7777, self.calculationValues['gasVOM'], self.calculationValues['gasEfficiency'], 50 / self.calculationValues['gasEfficiency'] / 277.7777 ),
		        coalVariableCost: variableCost( self.calculationValues['coalFuelCost']/277.7777, self.calculationValues['coalVOM'], self.calculationValues['coalEfficiency'], 90 / self.calculationValues['coalEfficiency'] / 277.7777 ),
		        solarVariableCost: variableCost( self.calculationValues['solarFuelCost'], self.calculationValues['solarVOM'], self.calculationValues['solarEfficiency'], 0 ),
		        batteryVariableCost: variableCost( self.calculationValues['batteryFuelCost'], self.calculationValues['batteryVOM'], self.calculationValues['batteryEfficiency'], 0 ),
		        gasCapitalCost: self.calculationValues['gasCapitalCost'],
		        coalCapitalCost: self.calculationValues['coalCapitalCost'],
		        solarCapitalCost: self.calculationValues['solarCapitalCost'],
		        batteryCapitalCost: self.calculationValues['batteryCapitalCost'],
		        gasccf: self.calculationValues['gasCCF'],
		        coalccf: self.calculationValues['coalCCF'],
		        solarccf: self.calculationValues['solarCCF'],
		        batteryccf: self.calculationValues['batteryCCF'],
		        loadProfile: self.calculationValues['loadProfile'],
		        solarCapacityFactor: self.calculationValues['solarCapacityFactor']
		    }
	    );

	    self.linearAlgebraSolver = numeric.solveLP(
	    	self.energyOptimizationMatrix.objectiveFunction, /* minimize  */
            self.energyOptimizationMatrix.A,				 /* matrix A of inequality constraint */
            self.energyOptimizationMatrix.b,                 /* RHS b of inequality constraint    */
            self.energyOptimizationMatrix.A_eq,              /* matrix Aeq of equality constraint */
            self.energyOptimizationMatrix.b_eq               /* vector beq of equality constraint */
        );
	}

	function variableCost(fuelCost, VOM, thermalEfficiency, carbonIntensity ){
		var carbonTax = self.calculationValues['carbonPrice'];
		var variableCost = VOM + fuelCost / thermalEfficiency + carbonIntensity * carbonTax / 1000;
		// console.log('variable cost: '+variableCost);
		return variableCost;
	};

	function sumArray(array) {
		return array.reduce(function(a, b){return a+b;});
	};

	function formatArrayAsSeriesOf_x_y_Coordinates(array){
		var series = [];
		for(var i = 0; i<array.length; i++){
			series.push([ i+1 , array[i] ]);
		}
		return series;
	}

	function inputValuesAreGood(){
		inputValues = [
			$( "#gasCapitalCost" ).val(),
			$( "#gasFuelCost" ).val(),
			$( "#gasEfficiency" ).val(),
			$( "#gasUtilization" ).val(),
			$( "#coalCapitalCost" ).val(),
			$( "#coalFuelCost" ).val(),
			$( "#coalEfficiency" ).val(),
			$( "#coalUtilization" ).val(),
			$( "#solarCapitalCost" ).val(),
			$( "#solarUtilization" ).val(),
			$( "#batteryCapitalCost" ).val(),
			$( "#carbonPrice").val(),
			$( "#ccf").val()
		]
		for(var i=0; i<inputValues.length; i++){
			if(!isFinite(inputValues[i])) return false;
		}
		return true;
	}


	
	init();	
});