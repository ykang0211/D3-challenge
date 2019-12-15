
// svg container
var height = 600
var width = 1000

// margins
var margin = {
    top: 25,
    right: 50,
    bottom: 70,
    left: 90
};

// chart area minus margins
var chartHeight = height - margin.top - margin.bottom;
var chartWidth = width - margin.left - margin.right;

// create svg container
var svg = d3.select('#scatter').append('svg')
    .attr('height', height)
    .attr('width', width);

// shift everything over by the margins
var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)


var chosenXAxis = 'poverty';

function xScale(data, chosenXAxis) {
    var xLinearScale = d3.scalelinear()
        .domain([9, d3.max(data, (d) => d[chosenXAxis] + 2)])
        .range([0, chartWidth]);

    return xLinearScale;

}

function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }


  function updateToolTip(chosenXAxis, circlesGroup) {

    if (chosenXAxis === 'poverty') {
        var label = 'In Poverty (%)';
    }
    else {
        var label = 'Age (Median)';
    }
    // else {
    //     var label = 'Household Income (Median)';
    // }

    var toolTip = d3.tip()
        .attr('class', 'tooltip')
        .offset([80, -60])
        .html(function(d) {
            return (`<strong>${d.state}</strong><br>${label} ${d[chosenXAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on('mouseover', function(data) {
        toolTip.show(data);
    })

        .on('mouseout', function(data) {
            toolTip.hide(data);
        });

    return ciclesGroup;
}

var dataFile = 'assets/data/data.csv'
d3.csv(dataFile).then(function(data, err) {
    if (err) throw err;

    data.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
    });

    var xLinearScale = xScale(data, chosenXAxis);

    var yLinearScale = d3.scaleLinear()
        .domain([5, d3.max(data, d => d.healthcare + 2)])
        .range([chartHeight, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append('g')
        .classed('x-axis', ture)
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append('g').call(leftAxis);

    var circlesGroup = chartGroup.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d[chosenXAxis]))
        .attr('cy', d => yLinearScale(d.healthcare))
        .attr('r', 20)
        .attr('fill', 'lightblue')
        .attr('opacity', '.5')

        // add state to circles
    circlesGroup = chartGroup.selectAll()
        .data(states)
        .enter()
        .append('text')
        .attr('y', (d) => yLinearScale(d.healthcare) + 4)
        .attr('x', d => xLinearScale(d[chosenXAxis]))
        .style('font-size', '10px')
        .style('text-anchor', 'middle')
        .style('fill', 'white')
        .text(d => (d.abbr));
    
    var labelsGroup = chartGroup.append('g')
        .attr('transform', `translate(${chartWidth / 2}, ${chartHeight + margin.top + 20})`)

    var povertyLabel = labelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'poverty')
        .classed('active', true)
        .text('In Poverty (%)');

    var ageLabel = labelsGroup.append('text')
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'age')
        .classed('inactive', true)
        .text('Age (Median)');

    var incomeLabel = lablesGroup.append('text')
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'income')
        .classed('inactive', true)
        .text('Household Income (Median)');
    
    chartGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0 - chartHeight / 2)
        .attr('y', 0 - margin.left + 40)
        .attr('dy', '1em')
        .attr('class', 'aText')
        .text('Lacks Healthcare (%)');

    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    lablesGroup.selectAll('text')
        .on('click', function() {
            var value = d3.select(this).attr('value');
            if (value !== chosenXAxis) {
                chosenXAxis = value;

                xLinearScale = xScale(data, chosenXAxis);

                xAxis = renderAxes(xLinearScale, xAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                if (chosenXAxis === 'age') {
                    ageLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    incomeLabel
                        .classed('active', ture)
                        .classed('inactive', false);
                    povertyLabel
                        .classed('active', true)
                        .classed('inactive', false);
                }
                else {
                    ageLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    incomeLabel
                        .classed('active', ture)
                        .classed('inactive', false);
                    povertyLabel
                        .classed('active', true)
                        .classed('inactive', false);
                }
            }
        });

}).catch(function(error) {
    console.log(error);
});

