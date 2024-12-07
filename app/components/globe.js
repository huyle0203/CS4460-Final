'use client';

import * as d3 from "d3";
import "./style2.css";

// Rebuild the tooltip logic slightly for clarity
function createTooltip() {
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("color", "black")
        .style("font-size", "12px");

    return {
        show: (event, html) => {
            tooltip.html(html)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px")
                .style("visibility", "visible");
        },
        hide: () => {
            tooltip.style("visibility", "hidden");
        }
    };
}

const appUsageData = [
    {Country: 'United States', App: 'Duolingo, Rosetta Stone, Babbel'},
    {Country: 'India', App: 'Duolingo'},
    {Country: 'Vietnam', App: 'Duolingo'},
    {Country: 'Brazil', App: 'Duolingo'},
    {Country: 'United Kingdom', App: 'Duolingo, Rosetta Stone'},
    {Country: 'Germany', App: 'Duolingo, Babbel'},
    {Country: 'France', App: 'Duolingo, Babbel'},
    {Country: 'Canada', App: 'Rosetta Stone'},
];

/**
 * Creates an interactive 3D globe with a choropleth map, tooltips, and dragging functionality.
 *
 * @param {HTMLElement} container - The container element where the globe will be rendered.
 * @param {string} geoDataUrl - URL or path to the GeoJSON file (FeatureCollection).
 * @param {string} dataUrl - URL or path to the CSV data file mapping languages per country.
 */
export function createInteractiveGlobe(container, geoDataUrl, dataUrl) {
    // Run only in browser
    if (typeof window === 'undefined') return;

    const width = 600;
    const height = 600;

    // Clear previous content
    d3.select(container).selectAll("*").remove();

    // App-specific marker colors
    const appColors = {
        'Duolingo': 'green',
        'Rosetta Stone': 'yellow',
        'Babbel': 'orange',
    };

    // Create SVG
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("cursor", "grab"); // Visual hint that it can be dragged

    // Add the title here
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "#333")
        .text("# of Languages Widely Spoken Per Country and Top Countries for Language Learning App Web Traffic");


    // Projection and path
    const projection = d3.geoOrthographic()
        .scale(250) // Reduce scale from 300 to 250
        .translate([width / 2, height / 2])
        .rotate([0, 0])
        .clipAngle(90);

    const path = d3.geoPath().projection(projection);

    Promise.all([d3.json(geoDataUrl), d3.csv(dataUrl)])
        .then(([geoData, langData]) => {
            if (!geoData || geoData.type !== "FeatureCollection" || !Array.isArray(geoData.features)) {
                console.error("Invalid GeoJSON data:", geoData);
                return;
            }

            if (!Array.isArray(langData)) {
                console.error("Invalid CSV data:", langData);
                return;
            }

            const countries = geoData.features;

            // Create a map from country name to number of languages
            const languageMap = new Map();
            langData.forEach(d => {
                if (d.Country && !isNaN(+d.NumberOfLanguages)) {
                    languageMap.set(d.Country, +d.NumberOfLanguages);
                }
            });

            // We use a fixed domain max for color scale (e.g., top ~10 languages)
            const maxLanguages = 10;
            const colorScale = d3.scaleSequential(d3.interpolateBlues)
                .domain([1, maxLanguages]);

            // Tooltip
            const tooltip = createTooltip();

            // Draw sphere (background)
            svg.append("path")
                .datum({type: "Sphere"})
                .attr("class", "sphere")
                .attr("d", path)
                .attr("fill", "#e6f2ff");

            // Draw graticule for reference
            const graticule = d3.geoGraticule();
            svg.append("path")
                .datum(graticule())
                .attr("fill", "none")
                .attr("stroke", "#aaa")
                .attr("stroke-opacity", 0.5)
                .attr("d", path);

            // Draw countries
            const countryPaths = svg.selectAll(".country")
                .data(countries)
                .enter()
                .append("path")
                .attr("class", "country")
                .attr("d", path)
                .attr("fill", d => {
                    const name = d.properties.name;
                    const languages = languageMap.get(name);
                    return (languages && languages >= 1) ? colorScale(Math.min(languages, maxLanguages)) : "#ccc";
                })
                .on("mouseover", function (event, d) {
                    d3.select(this)
                        .attr("stroke", "yellow")
                        .attr("stroke-width", 2);
                    const name = d.properties.name;
                    const languages = languageMap.get(name) || "Unknown";
                    tooltip.show(event, `<strong>${name}</strong>: ${languages} languages`);
                })
                .on("mouseout", function () {
                    d3.select(this)
                        .attr("stroke", null)
                        .attr("stroke-width", null);
                    tooltip.hide();
                });

            // Add markers for top users of language learning apps
            const markerGroup = svg.append("g").attr("class", "markers");

            countries.forEach(countryFeature => {
                const name = countryFeature.properties.name;

                // Check if the country has any app usage data
                const countryApps = appUsageData.find(d => d.Country === name);

                if (countryApps) {
                    // Get the centroid of the country
                    const [lon, lat] = d3.geoCentroid(countryFeature);

                    if (lon !== undefined && lat !== undefined) {
                        const coords = projection([lon, lat]);

                        // Ensure the projection is valid
                        if (coords) {
                            // Count the number of apps based on commas in the `App` field
                            const appCount = countryApps.App.split(',').length;

                            // Determine the marker color based on the number of apps
                            const markerColor =
                                appCount === 1 ? "#FFA07A" : // Light Orange for 1 item
                                    appCount === 2 ? "#FF8C00" : // Orange for 2 items
                                        "#FF4500";  // Dark Orange for 3+ items

                            // Append a single circle for the country
                            markerGroup.append("circle")
                                .datum({
                                    Country: name,
                                    Apps: countryApps.App,
                                    Lon: lon,
                                    Lat: lat, // Save original lon/lat for updates
                                    AppCount: appCount
                                })
                                .attr("cx", coords[0])
                                .attr("cy", coords[1])
                                .attr("r", 6)
                                .attr("fill", markerColor)
                                .attr("stroke", "white")
                                .attr("stroke-width", 1)
                                .on("mouseover", (event, d) => {
                                    tooltip.show(event, `<strong>${d.Country}</strong><br>Top Usage for Apps: ${d.Apps}`);
                                })
                                .on("mouseout", () => tooltip.hide());
                        }
                    }
                }
            });



            // Drag to rotate the globe
            let rotate0, x0, y0;
            svg.call(d3.drag()
                .on("start", (event) => {
                    svg.style("cursor", "grabbing");
                    rotate0 = projection.rotate();
                    x0 = event.x;
                    y0 = event.y;
                })
                .on("drag", (event) => {
                    const dx = event.x - x0;
                    const dy = event.y - y0;
                    const k = 50 / projection.scale();
                    projection.rotate([
                        rotate0[0] + dx * k,
                        rotate0[1] - dy * k
                    ]);

                    // Update all paths after rotation
                    svg.selectAll(".country").attr("d", path);
                    svg.select(".sphere").attr("d", path);
                    svg.selectAll("path:not(.country):not(.sphere)").attr("d", path);

                    // Update markers' positions dynamically during rotation
                    markerGroup.selectAll("circle").each(function(d) {
                        const coords = projection([d.Lon, d.Lat]); // Use saved lon/lat for each app marker
                        if (coords) {
                            d3.select(this)
                                .attr("cx", coords[0])
                                .attr("cy", coords[1]);
                        }
                    });
                })
                .on("end", () => {
                    svg.style("cursor", "grab");
                })
            );
        })
        .catch(error => console.error("Error loading data:", error));
}
