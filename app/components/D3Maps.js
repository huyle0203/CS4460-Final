import * as d3 from 'd3';
import './d3-tip.js';
import './style.css';

export function createSideBySideMaps(container, geoDataUrl) {
    // Load the data and initialize the visualization
    Promise.all([
        d3.csv('state_languages.csv', dataPreprocessor),
        d3.json(geoDataUrl)
    ]).then(function([data, worldData]) {
        // Data loading successful
        createVisualization(data, worldData);
    }).catch(function(error){
        console.error('Error loading data:', error);
    });

    // Preprocess the cereal data
    function dataPreprocessor(row) {
        var state = row['State'];
        var population = +row['Population'];
        var totalSpeakers = +row['Total Speakers'];
        var percentage = +row['Percentage'];

        if (isNaN(population) || isNaN(totalSpeakers) || isNaN(percentage)) {
            console.warn('Invalid numeric data for state:', state);
        }

        return {
            state: state,
            population: population,
            totalSpeakers: totalSpeakers,
            percentage: percentage
        };
    }

    function createVisualization(cereals, worldData) {
        console.log('Total cereals loaded:', cereals.length);

        d3.select(container)
            .style("display", "flex")    // Make container a flex container
            .style("gap", "10px");

        // Set up dimensions and margins
        var scatterWidth = 500;
        var scatterHeight = 500;
        var mapWidth = 700 * 2.5;
        var mapHeight = 500 * 2.5;

        // Set up scales and axes for the scatter plot
        var xAttribute = 'totalSpeakers';
        var yAttribute = 'population';

        var xScale = d3.scalePow().exponent(0.5).range([50, scatterWidth - 50]);
        var yScale = d3.scalePow().exponent(0.5).range([scatterHeight - 50, 50]);


        var xAxis = d3.axisBottom(xScale).ticks(4);
        var yAxis = d3.axisLeft(yScale).ticks(5);

        // Set up color scale based on percentage
        var colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain(d3.extent(cereals, d => d.percentage));

        // Create SVGs inside the container
        var scatterSvg = d3.select(container)
            .append('svg')
            .attr('id', 'scatter')
            .attr('width', 1100)
            .attr('height', 500);

        var mapSvg = d3.select(container)
            .append('svg')
            .attr('id', 'map')
            .attr('width', 1100)
            .attr('height', 500);

        // Create tooltips
        var scatterTip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-12, 0])
            .html(function(event, d) {
                return `<h5>${d.state}</h5>
                <table>
                    <tbody>
                        <tr><td>Total Foreign Language Speakers:</td><td>${d.totalSpeakers}</td></tr>
                        <tr><td>Population:</td><td>${d.population}</td></tr>
                        <tr><td>Percentage of Students in English as Second Language Program:</td><td>${d.percentage}%</td></tr>
                    </tbody>
                </table>`;
            });

        scatterSvg.call(scatterTip);

        var mapTip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-12, 0])
            .html(function(event, d) {
                var stateData = cereals.find(c => c.state === d.properties.name);
                return stateData
                    ? `<h5>${stateData.state}</h5>
                    <table>
                        <tbody>
                            <tr><td>Total Foreign Language Speakers:</td><td>${stateData.totalSpeakers}</td></tr>
                            <tr><td>Population:</td><td>${stateData.population}</td></tr>
                            <tr><td>Percentage of Students in English as Second Language Program:</td><td>${stateData.percentage}%</td></tr>
                        </tbody>
                    </table>`
                    : `<h5>${d.properties.name}</h5><p>No data available</p>`;
            });

        mapSvg.call(mapTip);

        // Map projection and path
        var projection = d3.geoNaturalEarth1()
            .scale(mapWidth / 1.3 / Math.PI)
            .translate([mapWidth / 2, mapHeight / 2]);

        var path = d3.geoPath().projection(projection);

        // Initialize the scatter plot
        function updateScatterPlot() {
            var validCereals = cereals.filter(d => !isNaN(d[xAttribute]) && !isNaN(d[yAttribute]));
            console.log('Cereals with valid x and y attributes:', validCereals.length);

            xScale.domain(d3.extent(validCereals, d => d[xAttribute])).nice();
            yScale.domain(d3.extent(validCereals, d => d[yAttribute])).nice();

            scatterSvg.selectAll('*').remove();

            // Brush for scatter
            var scatterBrush = d3.brush()
                .extent([[50, 50], [scatterWidth - 50, scatterHeight - 50]])
                .on('brush end', brushedScatter);

            scatterSvg.append('g')
                .attr('class', 'brush')
                .call(scatterBrush);

            // X-axis
            scatterSvg.append('g')
                .attr('class', 'x axis')
                .attr('transform', `translate(0, ${scatterHeight - 50})`)
                .attr('color', 'black')
                .call(xAxis);

            // X-axis label
            scatterSvg.append('text')
                .attr('class', 'axis-label')
                .attr('x', scatterWidth / 2)
                .attr('y', scatterHeight - 10)
                .attr('text-anchor', 'middle')
                .text("Total Foreign Language Speakers (Power Law Dist)");

            // Y-axis
            scatterSvg.append('g')
                .attr('class', 'y axis')
                .attr('transform', `translate(60, 0)`)
                .attr('color', 'black')
                .call(yAxis);

            // Y-axis label
            scatterSvg.append('text')
                .attr('class', 'axis-label')
                .attr('transform', 'rotate(-90)')
                .attr('x', -scatterHeight + 110)
                .attr('y', 15)
                .attr('text-anchor', 'middle')
                .text("Population (Power Law Dist)");

            // Circles
            scatterSvg.selectAll('.circle')
                .data(validCereals)
                .enter()
                .append('circle')
                .attr('class', 'circle')
                .attr('cx', d => xScale(d[xAttribute]))
                .attr('cy', d => yScale(d[yAttribute]))
                .attr('r', 5)
                .style('fill', d => colorScale(d.percentage))
                .on('mouseover', scatterTip.show)
                .on('mouseout', scatterTip.hide);

            // Clear brush on click outside selection
            scatterSvg.on('click', function(event) {
                if (event.target.tagName !== 'rect') {
                    scatterSvg.select('.brush').call(scatterBrush.move, null);
                }
            });
        }

        // Initialize the map
        function drawMap() {
            mapSvg.selectAll('*').remove();

            // Brush for map
            var mapBrush = d3.brush()
                .extent([[0, 0], [mapWidth, mapHeight]])
                .on('brush end', brushedMap);

            mapSvg.append('g')
                .attr('class', 'brush')
                .call(mapBrush);

            var cerealStates = new Set(cereals.map(d => d.state));

            // Draw the map
            mapSvg.selectAll('path')
                .data(worldData.features)
                .enter()
                .append('path')
                .attr('d', path)
                .attr('class', 'state')
                .style('fill', function(d) {
                    var stateName = d.properties.name;
                    var stateData = cereals.find(c => c.state === stateName);
                    return stateData ? colorScale(stateData.percentage) : '#fff';
                })
                .style('stroke', '#777')
                .on('mouseover', function(event, d) {
                    if (cerealStates.has(d.properties.name)) {
                        mapTip.show(event, d);
                    }
                })
                .on('mouseout', mapTip.hide);

            // Clear brush on click outside selection
            mapSvg.on('click', function(event) {
                if (event.target.tagName !== 'rect') {
                    mapSvg.select('.brush').call(mapBrush.move, null);
                }
            });
        }

        // Brushing functions
        function brushedScatter(event) {
            if (event.selection === null) {
                scatterSvg.selectAll('.circle')
                    .style('fill', d => colorScale(d.percentage)) // Reapply original color
                    .style('fill-opacity', 1); // Reset opacity
                mapSvg.selectAll('.state')
                    .style('fill', d => {
                        var stateData = cereals.find(c => c.state === d.properties.name);
                        return stateData ? colorScale(stateData.percentage) : '#fff'; // Reapply choropleth
                    })
                    .style('fill-opacity', 1); // Reset opacity
                return;
            }

            var [[x0, y0], [x1, y1]] = event.selection;
            var brushedData = cereals.filter(d => {
                var x = xScale(d[xAttribute]);
                var y = yScale(d[yAttribute]);
                return x0 <= x && x <= x1 && y0 <= y && y <= y1;
            });

            var selectedStates = new Set(brushedData.map(d => d.state));

            scatterSvg.selectAll('.circle')
                .style('fill', d => {
                    var x = xScale(d[xAttribute]);
                    var y = yScale(d[yAttribute]);
                    return x0 <= x && x <= x1 && y0 <= y && y <= y1 ? colorScale(d.percentage) : '#ccc'; // Preserve color or dim
                })
                .style('fill-opacity', d => {
                    var x = xScale(d[xAttribute]);
                    var y = yScale(d[yAttribute]);
                    return x0 <= x && x <= x1 && y0 <= y && y <= y1 ? 1 : 0.2; // Adjust opacity
                });

            mapSvg.selectAll('.state')
                .style('fill', d => {
                    var stateData = cereals.find(c => c.state === d.properties.name);
                    return selectedStates.has(d.properties.name)
                        ? colorScale(stateData.percentage) // Preserve choropleth for selected
                        : '#ccc'; // Dim unselected
                })
                .style('fill-opacity', d => selectedStates.has(d.properties.name) ? 1 : 0.2); // Adjust opacity
        }


        function brushedMap(event) {
            if (event.selection === null) {
                scatterSvg.selectAll('.circle')
                    .style('fill', d => colorScale(d.percentage)) // Reapply original color
                    .style('fill-opacity', 1); // Reset opacity
                mapSvg.selectAll('.state')
                    .style('fill', d => {
                        var stateData = cereals.find(c => c.state === d.properties.name);
                        return stateData ? colorScale(stateData.percentage) : '#fff'; // Reapply choropleth
                    })
                    .style('fill-opacity', 1); // Reset opacity
                return;
            }

            var [[x0, y0], [x1, y1]] = event.selection;
            var selectedStates = new Set();

            mapSvg.selectAll('.state')
                .style('fill', function(d) {
                    var centroid = path.centroid(d);
                    var x = centroid[0];
                    var y = centroid[1];
                    var isSelected = x0 <= x && x <= x1 && y0 <= y && y <= y1;

                    var stateData = cereals.find(c => c.state === d.properties.name);

                    if (isSelected && stateData) {
                        selectedStates.add(d.properties.name);
                        return colorScale(stateData.percentage); // Preserve choropleth for selected
                    }
                    return '#ccc'; // Dim unselected
                })
                .style('fill-opacity', function(d) {
                    var centroid = path.centroid(d);
                    var x = centroid[0];
                    var y = centroid[1];
                    return selectedStates.has(d.properties.name) ? 1 : 0.2; // Adjust opacity
                });

            scatterSvg.selectAll('.circle')
                .style('fill', d => selectedStates.has(d.state) ? colorScale(d.percentage) : '#ccc') // Preserve color or dim
                .style('fill-opacity', d => selectedStates.has(d.state) ? 1 : 0.2); // Adjust opacity
        }


        // Axis selectors

        // Initialize visualization
        // createAxisSelectors();
        updateScatterPlot();
        drawMap();
    }
}
