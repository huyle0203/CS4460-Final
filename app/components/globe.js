'use client';

import * as d3 from "d3";
import "./style2.css";

// rebuild the tooltip logic bc not work
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


export function createInteractiveGlobe(container, geoDataUrl, dataUrl) {
    // CSR
    if (typeof window === 'undefined') return;

    const width = 600;
    const height = 600;

    d3.select(container).selectAll("*").remove();

    const appColors = {
        'Duolingo': 'green',
        'Rosetta Stone': 'yellow',
        'Babbel': 'orange',
    };

    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("cursor", "grab");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "#333")
        .text("# of Languages Widely Spoken Per Country and Top Countries for Language Learning App Web Traffic");


    // projection from default d3
    const projection = d3.geoOrthographic()
        .scale(250) // og 350
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

            const languageMap = new Map();
            langData.forEach(d => {
                if (d.Country && !isNaN(+d.NumberOfLanguages)) {
                    languageMap.set(d.Country, +d.NumberOfLanguages);
                }
            });

            const maxLanguages = 10;
            const colorScale = d3.scaleSequential(d3.interpolateBlues)
                .domain([1, maxLanguages]);

            const tooltip = createTooltip();

            svg.append("path")
                .datum({type: "Sphere"})
                .attr("class", "sphere")
                .attr("d", path)
                .attr("fill", "#e6f2ff");

            // draw graticule for reference
            const graticule = d3.geoGraticule();
            svg.append("path")
                .datum(graticule())
                .attr("fill", "none")
                .attr("stroke", "#aaa")
                .attr("stroke-opacity", 0.5)
                .attr("d", path);

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
                    tooltip.show(event, `<strong>${name}</strong>: ${languages} languages widely spoken in region`);
                })
                .on("mouseout", function () {
                    d3.select(this)
                        .attr("stroke", null)
                        .attr("stroke-width", null);
                    tooltip.hide();
                });

            const markerGroup = svg.append("g").attr("class", "markers");

            countries.forEach(countryFeature => {
                const name = countryFeature.properties.name;

                const countryApps = appUsageData.find(d => d.Country === name);

                if (countryApps) {
                    const [lon, lat] = d3.geoCentroid(countryFeature);

                    if (lon !== undefined && lat !== undefined) {
                        const coords = projection([lon, lat]);

                        if (coords) {
                            const appCount = countryApps.App.split(',').length;

                            const markerColor =
                                appCount === 1 ? "#FFA07A" : // light Orange for 1 item
                                    appCount === 2 ? "#FF8C00" : // orange for 2 items
                                        "#FF4500";  // dark Orange for 3+ items

                            markerGroup.append("circle")
                                .datum({
                                    Country: name,
                                    Apps: countryApps.App,
                                    Lon: lon,
                                    Lat: lat, //save original lon/lat for updates
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

            // add the horizontal legend
            const legendGroup = svg.append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${width - (0.99 * width)}, ${height - 40})`);

// legend items data
            const legendData = [
                { color: "#FF4500", label: "Country is top user of: 3 apps" }, // dark Orange
                { color: "#FF8C00", label: "Country is top user of: 2 apps" },      // orange
                { color: "#FFA07A", label: "Country is top user of: 1 app" }  // light Orange
            ];

            legendData.forEach((item, index) => {
                const legendItem = legendGroup.append("g")
                    .attr("class", "legend-item")
                    .attr("transform", `translate(${index * 210}, 30)`);

                legendItem.append("circle")
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .attr("r", 6)
                    .attr("fill", item.color);

                legendItem.append("text")
                    .attr("x", 12)
                    .attr("y", 4)
                    .style("font-size", "12px")
                    .style("fill", "#333")
                    .text(item.label);
            });



            // rotate globe
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

                    svg.selectAll(".country").attr("d", path);
                    svg.select(".sphere").attr("d", path);
                    svg.selectAll("path:not(.country):not(.sphere)").attr("d", path);

                    markerGroup.selectAll("circle").each(function(d) {
                        const coords = projection([d.Lon, d.Lat]);
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
