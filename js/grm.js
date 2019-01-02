$(document).ready(function () {

    angular.module('RiskModelApp', []).controller('RiskModelController', function () {

        this.ImpactValues = [
            { "key": 0, "description": "none", "upper": 1, "lower": 1 },
            { "key": 1, "description": "£0 to £1m", "upper": 1000000, "lower": 1 },
            { "key": 2, "description": "£1m to £5m", "upper": 5000000, "lower": 1000000 },
            { "key": 3, "description": "£5m to £10m", "upper": 10000000, "lower": 5000000 },
            { "key": 4, "description": "£10m to £100m", "upper": 100000000, "lower": 10000000 },
            { "key": 5, "description": "over £100m", "upper": 500000000, "lower": 100000000 }
        ];
        this.ImpactMatrix = [
            { "key": "users", "confidentiality": -3, "integrity": -1, "availability": -1 },
            { "key": "data", "confidentiality": 0, "integrity": 0, "availability": -3 },
            { "key": "exposure", "confidentiality": -4, "integrity": -4, "availability": 0 }
        ];
        this.FrequencyMatrix = [
            { "key": "Transactional Web", "confidentiality": 0.25, "integrity": 0.10, "availability": 0.33 },
            { "key": "Static Web", "confidentiality": 0.01, "integrity": 0.05, "availability": 0.25 },
            { "key": "API", "confidentiality": 0.25, "integrity": 0.25, "availability": 0.33 },
            { "key": "Desktop", "confidentiality": 0.10, "integrity": 0.10, "availability": 0.01 },
            { "key": "Mobile", "confidentiality": 0.10, "integrity": 0.25, "availability": 0.01 },
            { "key": "Other", "confidentiality": 0.99, "integrity": 0.99, "availability": 0.99 }
        ];

        this.RiskMatrix = [
            { "key": "users", "confidentiality": { "frequency": 0, "impact": 0 }, "integrity": { "frequency": 0, "impact": 0 }, "availability": { "frequency": 0, "impact": 0 } },
            { "key": "data", "confidentiality": { "frequency": 0, "impact": 0 }, "integrity": { "frequency": 0, "impact": 0 }, "availability": { "frequency": 0, "impact": 0 } },
            { "key": "exposure", "confidentiality": { "frequency": 0, "impact": 0 }, "integrity": { "frequency": 0, "impact": 0 }, "availability": { "frequency": 0, "impact": 0 } }
        ];

        // OUTPUTS
        this.ExpectedLoss = 0;

        // INPUTS
        this.archetype = "null";
        this.users = false;
        this.data = false;
        this.service = false;
        this.impact = "0";
        this.points = 10000;

        function getImpactIndex(maxImpact, adjustment, applies) {
            var result = maxImpact + adjustment;
            if (result < 0) { result = 0 }
            if (!applies) { result = 0 }
            //console.log (maxImpact + ":" + adjustment + ":" + result);
            return result;
        }

        this.redraw = function () {
            // get the frequency data
            var freq = { "confidentiality": 0, "integrity": 0, "availability": 0 };
            this.FrequencyMatrix.forEach(element => {
                if (element.key == archetype.value) { freq = element; };
            });

            // get max impact
            var maxImpact = 0;
            this.ImpactValues.forEach(element => {
                if (element.description == impact.value) { maxImpact = element.key; };
            });

            this.RiskMatrix[0].confidentiality.frequency = freq.confidentiality;
            this.RiskMatrix[0].confidentiality.impact = this.ImpactValues[getImpactIndex(maxImpact, this.ImpactMatrix[0].confidentiality, chkusers.checked)].description;
            this.RiskMatrix[0].integrity.frequency = freq.integrity;
            this.RiskMatrix[0].integrity.impact = this.ImpactValues[getImpactIndex(maxImpact, this.ImpactMatrix[0].integrity, chkusers.checked)].description;
            this.RiskMatrix[0].availability.frequency = freq.availability;
            this.RiskMatrix[0].availability.impact = this.ImpactValues[getImpactIndex(maxImpact, this.ImpactMatrix[0].availability, chkusers.checked)].description;

            this.RiskMatrix[1].confidentiality.frequency = freq.confidentiality;
            this.RiskMatrix[1].confidentiality.impact = this.ImpactValues[getImpactIndex(maxImpact, this.ImpactMatrix[1].confidentiality, chkdata.checked)].description;
            this.RiskMatrix[1].integrity.frequency = freq.integrity;
            this.RiskMatrix[1].integrity.impact = this.ImpactValues[getImpactIndex(maxImpact, this.ImpactMatrix[1].integrity, chkdata.checked)].description;
            this.RiskMatrix[1].availability.frequency = freq.availability;
            this.RiskMatrix[1].availability.impact = this.ImpactValues[getImpactIndex(maxImpact, this.ImpactMatrix[1].availability, chkdata.checked)].description;

            this.RiskMatrix[2].confidentiality.frequency = freq.confidentiality;
            this.RiskMatrix[2].confidentiality.impact = this.ImpactValues[getImpactIndex(maxImpact, this.ImpactMatrix[2].confidentiality, chkservice.checked)].description;
            this.RiskMatrix[2].integrity.frequency = freq.integrity;
            this.RiskMatrix[2].integrity.impact = this.ImpactValues[getImpactIndex(maxImpact, this.ImpactMatrix[2].integrity, chkservice.checked)].description;
            this.RiskMatrix[2].availability.frequency = freq.availability;
            this.RiskMatrix[2].availability.impact = this.ImpactValues[getImpactIndex(maxImpact, this.ImpactMatrix[2].availability, chkservice.checked)].description;

            var sumEL = 0;
            if (chkusers.checked) {
                var Impact = {};
                var EL = 0;

                // confidentiality
                Impact = this.ImpactValues[getImpactIndex(maxImpact, this.ImpactMatrix[0].confidentiality, true)];
                if (Impact.key > 0) {
                    EL = calculateExpectedLoss(Impact.lower, Impact.upper, freq.confidentiality, this.points);
                }
                sumEL += EL;
                EL = 0;
                // integrity
                Impact = this.ImpactValues[getImpactIndex(maxImpact, this.ImpactMatrix[0].integrity, true)];
                if (Impact.key > 0) {
                    EL = calculateExpectedLoss(Impact.lower, Impact.upper, freq.integrity, this.points);
                }
                sumEL += EL;
                EL = 0;
                // availability
                Impact = this.ImpactValues[getImpactIndex(maxImpact, this.ImpactMatrix[0].availability, true)];
                if (Impact.key > 0) {
                    EL = calculateExpectedLoss(Impact.lower, Impact.upper, freq.availability, this.points);
                }
                sumEL += EL;
            }
            if (chkdata.checked) {
                var Impact = {};
                var EL = 0;

                // confidentiality
                Impact = this.ImpactValues[getImpactIndex(maxImpact, this.ImpactMatrix[1].confidentiality, true)];
                if (Impact.key > 0) {
                    EL = calculateExpectedLoss(Impact.lower, Impact.upper, freq.confidentiality, this.points);
                }
                sumEL += EL;
                EL = 0;
                // integrity
                Impact = this.ImpactValues[getImpactIndex(maxImpact, this.ImpactMatrix[1].integrity, true)];
                if (Impact.key > 0) {
                    EL = calculateExpectedLoss(Impact.lower, Impact.upper, freq.integrity, this.points);
                }
                sumEL += EL;
                EL = 0;
                // availability
                Impact = this.ImpactValues[getImpactIndex(maxImpact, this.ImpactMatrix[1].availability, true)];
                if (Impact.key > 0) {
                    EL = calculateExpectedLoss(Impact.lower, Impact.upper, freq.availability, this.points);
                }
                sumEL += EL;
            }
            if (chkservice.checked) {
                var Impact = {};
                var EL = 0;

                // confidentiality
                Impact = this.ImpactValues[getImpactIndex(maxImpact, this.ImpactMatrix[2].confidentiality, true)];
                if (Impact.key > 0) {
                    EL = calculateExpectedLoss(Impact.lower, Impact.upper, freq.confidentiality, this.points);
                }
                sumEL += EL;
                EL = 0;
                // integrity
                Impact = this.ImpactValues[getImpactIndex(maxImpact, this.ImpactMatrix[2].integrity, true)];
                if (Impact.key > 0) {
                    EL = calculateExpectedLoss(Impact.lower, Impact.upper, freq.integrity, this.points);
                }
                sumEL += EL;
                EL = 0;
                // availability
                Impact = this.ImpactValues[getImpactIndex(maxImpact, this.ImpactMatrix[2].availability, true)];
                if (Impact.key > 0) {
                    EL = calculateExpectedLoss(Impact.lower, Impact.upper, freq.availability, this.points);
                }
                sumEL += EL;
            }

            this.ExpectedLoss = sumEL;
        }
    });
});

function calculateExpectedLoss(lowerBound, upperBound, frequency, points) {
    var expectedLossValue = 0;

    // get a lognormal distribution
    var distribution = populateLogNormal(lowerBound, upperBound, points);

    // show the distribution - for debugging
    var trace = {
        x: distribution,
        type: 'histogram',
    };
    var data = [trace];
//    Plotly.newPlot('distribution-plot', data);

    // randomly select values from the distribution at the same frequency the
    // events are expected - could just invert the fraction but
    var runningTotal = 0;
    var hits = 0;
    for (var i = 0; i <= points; i++) {
        if (Math.random() < frequency) {
            runningTotal += distribution[i];
        }
    };

    // average the result to provide an Expected Loss figure
    expectedLossValue = runningTotal / points;
    //console.log("calculateExpectedLoss(" + lowerBound + ", " + upperBound + ", " + frequency + ", " + points + ") = " + expectedLossValue);

    return expectedLossValue;
}

function populateLogNormal(lowerBound, upperBound, points) {
    var distribution = [];
    var mu = (Math.log(upperBound) + Math.log(lowerBound)) / 2;
    var sigma = (Math.log(upperBound) - Math.log(lowerBound)) / 3.29;

    for (var i = 0; i <= points; i++) {
        var point = 0;
        // limit outliers - this is an arbitrary decision
        while ((point >= (3 * upperBound)) || (point <= 0)) {
            point = jStat.lognormal.sample(mu, sigma)
        }
        distribution[i] = point;
    }    return distribution;
}