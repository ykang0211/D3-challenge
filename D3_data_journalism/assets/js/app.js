
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


// load data.csv
var dataFile = 'assets/data/data.csv'
d3.csv(dataFile).then(dabbler)

// plot function
function dabbler(states) {

    // data loop
    states.map(function (data) {
        data.healthcare = +data.healthcare
        data.poverty = +data.poverty
    });

    // scaly y to chart height
    var yScale = d3.scaleLinear()
        .domain([5, d3.max(states, (d) => d.healthcare + 2)])
        .range([chartHeight, 0]);


    // scale x to chart height
    var xScale = d3.scaleLinear()
        .domain([9, d3.max(states, (d) => d.poverty + 2)])
        .range([0, chartWidth]);


    // create axes
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    // .ticks(10)


    // set x to the bottom of the chart
    chartGroup.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(xAxis);

    // set y to the y axis
    chartGroup.append('g').call(yAxis);


    // label yAxis
    chartGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0 - chartHeight / 2)
        .attr('y', 0 - margin.left + 40)
        .attr('dy', '1em')
        .attr('class', 'aText')
        .text('Lacks Healthcare (%)');

    // lable xAxis
    chartGroup.append('text')
        .attr('transform', `translate(${chartWidth / 2}, ${chartHeight + margin.top + 20})`)
        .attr('class', 'aText')
        .text('In Poverty (%)');


    // create circles
    var circlesGroup = chartGroup.selectAll('circle')
        .data(states)
        .enter()
        .append('circle')
        .attr('cy', d => yScale(d.healthcare))
        .attr('cx', d => xScale(d.poverty))
        .attr('r', '10')
        .attr('fill', 'lightblue');

    // add state to circles
    circlesGroup = chartGroup.selectAll()
        .data(states)
        .enter()
        .append('text')
        .attr('y', (d) => yScale(d.healthcare) + 4)
        .attr('x', d => xScale(d.poverty))
        .style('font-size', '10px')
        .style('text-anchor', 'middle')
        .style('fill', 'white')
        .text(d => (d.abbr));

    // initialize tooltip
    // var toolTip = d3.select('body').append('div')
    //     .attr('class', 'tooltip');

    // circlesGroup.on('mouseover', function (d) {
    //     toolTip.style('display', 'block');
    //     toolTip.html(`<strong>${d.state}</strong><br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`)
    //         .style('left', d3.event.pageX + 'px')
    //         .style('top', d3.event.pageY + 'px');
    // })

    //     .on('mouseout', function () {
    //         toolTip.style('display', 'none');
    //     });

    var toolTip = d3.tip()
      .attr('class','tooltip')
      .offset([80, -60])
      .html(function(d) {
        return (`<strong>${d.state}</strong><br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`)});

    // create the tooltip in chartGroup
    chartGroup.call(toolTip);

    // create 'mouseover' event listner to display tooltip
    circlesGroup.on('mouseover', function(d) {
      toolTip.show(d, this);
    })
    // create 'mouseout' event listner to hide tooltip
      .on('mouseout', function(d) {
        toolTip.hide(d);
      })
};

