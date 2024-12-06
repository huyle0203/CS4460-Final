// Dimensions of the tree map and legend
const treeMapWidth = 600; // Width for the tree map
const height = 600;       // Total height for the visualization
const legendWidth = 200;  // Width reserved for the legend
const legendItemHeight = 20;
const legendSpacing = 5;

// Load the CSV
d3.csv("languages_on_web.csv").then(data => {
    // Convert percentage column to numeric
    data.forEach(d => {
        d.percentage = +d[data.columns[1]]; // Convert second column to numeric
        d.language = d[data.columns[0]];   // Use the first column as language
    });

    // Convert flat data into hierarchical structure
    const treeData = {
        name: "Languages",
        children: data.map(d => ({ name: d.language, value: d.percentage }))
    };

    // Create root hierarchy
    const root = d3.hierarchy(treeData).sum(d => d.value);

    // Layout the tree map
    d3.treemap()
        .size([treeMapWidth, height - 50]) // Reserve height for the title
        .padding(1)(root);

    // Append SVG container
    const svg = d3.select("body")
        .append("svg")
        .attr("width", treeMapWidth + legendWidth) // Total width includes legend
        .attr("height", height);

    // Add title
    svg.append("text")
        .attr("class", "title")
        .attr("x", (treeMapWidth + legendWidth) / 2)
        .attr("y", 30)
        .text("Most Common Languages Spoken on the Web");

    // Add groups for each leaf
    const nodes = svg.selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("transform", d => `translate(${d.x0},${d.y0 + 50})`);

    // Add rectangles
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    nodes.append("rect")
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", (d, i) => colorScale(i));

    // Add text labels
    nodes.append("text")
        .attr("class", "node")
        .attr("x", d => (d.x1 - d.x0) / 2)
        .attr("y", d => (d.y1 - d.y0) / 2)
        .text(d => d.data.name)
        .style("font-size", "10px")
        .call(wrapText, d => d.x1 - d.x0);

    // Add legend on the right side
    const legend = svg.append("g")
        .attr("transform", `translate(${treeMapWidth + 20}, 50)`);

    const legendItems = legend.selectAll(".legend-item")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * (legendItemHeight + legendSpacing)})`);

    // Legend color boxes
    legendItems.append("rect")
        .attr("width", legendItemHeight)
        .attr("height", legendItemHeight)
        .attr("fill", (d, i) => colorScale(i));

    // Legend text
    legendItems.append("text")
        .attr("x", legendItemHeight + 5)
        .attr("y", legendItemHeight / 2)
        .attr("dy", "0.35em")
        .text(d => `${d.language}: ${d.percentage}%`)
        .attr("class", "legend");

    // Helper function for wrapping text within rectangles
    function wrapText(text, width) {
        text.each(function() {
            const text = d3.select(this),
                  words = text.text().split(/\s+/).reverse(),
                  lineHeight = 1.1, // ems
                  y = text.attr("y"),
                  x = text.attr("x"),
                  dy = 0;

            let word,
                line = [],
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++dy * lineHeight + "em").text(word);
                }
            }
        });
    }
    }).catch(error => {
    console.error("Error loading the CSV file:", error);
});