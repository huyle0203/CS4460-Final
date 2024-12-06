'use client'

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LanguageChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const width = 1000, height = 600, margin = { top: 20, right: 30, bottom: 40, left: 50 };

    // Create SVG
    const svg = d3.select(chartRef.current).append("svg")
      .attr("width", width)
      .attr("height", height);

    // Define dimensions for the bar graph
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chart = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define scales
    const xScale = d3.scaleBand().range([0, chartWidth]).padding(0.1);
    const yScale = d3.scaleLinear().range([chartHeight, 0]);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Add axes
    const xAxis = chart.append("g")
      .attr("transform", `translate(0,${chartHeight})`);
    const yAxis = chart.append("g");

    // Add a dropdown for year filtering
    const dropdown = d3.select(chartRef.current).append("select")
      .attr("id", "yearFilter")
      .style("margin", "10px");

    // Load the data
    d3.csv("/DuolingoLanguageReport.csv").then(languageData => {
      // Extract unique years excluding non-country columns
      const years = Object.keys(languageData[0]).filter(key => key !== "country" && !key.startsWith("pop2_2020"));

      // Populate the dropdown menu
      dropdown.selectAll("option")
        .data(years)
        .enter().append("option")
        .attr("value", d => d)
        .text(d => d);

      // Update chart based on the selected year
      const updateChart = (selectedYear) => {
        const filteredData = languageData.map(d => ({
          Country: d.Country,
          Language: d[selectedYear]
        })).filter(d => d.Language !== undefined && !d.Language.startsWith("pop2_") && !d.Language.startsWith("pop1_"));

        // Aggregate data by language
        const languageCounts = d3.rollups(filteredData,
          v => v.length,
          d => d.Language);

        const barData = languageCounts.map(([Language, Count]) => ({ Language, Count }));

        // Update scales
        xScale.domain(barData.map(d => d.Language));
        yScale.domain([0, d3.max(barData, d => d.Count)]);

        // Bind data to bars
        const bars = chart.selectAll("rect")
          .data(barData, d => d.Language);

        // Enter new bars
        bars.enter().append("rect")
          .attr("x", d => xScale(d.Language))
          .attr("y", d => yScale(d.Count))
          .attr("width", xScale.bandwidth())
          .attr("height", d => chartHeight - yScale(d.Count))
          .attr("fill", d => colorScale(d.Language))
        .merge(bars) // Update existing bars
          .transition().duration(500)
          .attr("x", d => xScale(d.Language))
          .attr("y", d => yScale(d.Count))
          .attr("width", xScale.bandwidth())  // Ensure width stays consistent
          .attr("height", d => chartHeight - yScale(d.Count));

        // Remove old bars
        bars.exit().remove();

        // Update axes
        xAxis.transition().duration(500).call(d3.axisBottom(xScale));
        yAxis.transition().duration(500).call(d3.axisLeft(yScale));
      };

      // Set initial chart to the first year
      updateChart(years[0]);

      // Update chart on year change
      dropdown.on("change", function () {
        updateChart(this.value);
      });

    }).catch(error => console.error("Error loading data:", error));

    // Cleanup function
    return () => {
      d3.select(chartRef.current).selectAll("*").remove();
    };
  }, []);

  return <div ref={chartRef} className="w-full h-full"></div>;
};

export default LanguageChart;

