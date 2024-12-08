'use client'

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LanguageChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const width = 1000, height = 600, margin = { top: 20, right: 30, bottom: 40, left: 50 };

    //create SVG
    const svg = d3.select(chartRef.current).append("svg")
      .attr("width", width)
      .attr("height", height);

    //define dimensions for the bar graph
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chart = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    //define scales
    const xScale = d3.scaleBand().range([0, chartWidth]).padding(0.1);
    const yScale = d3.scaleLinear().range([chartHeight, 0]);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    //add axes
    const xAxis = chart.append("g")
      .attr("transform", `translate(0,${chartHeight})`);
    const yAxis = chart.append("g");

    //increase text size for axes
    xAxis.selectAll("text")
      .style("font-size", "14px");
    yAxis.selectAll("text")
      .style("font-size", "14px");

    //add a dropdown for year filtering with updated styles
    const dropdown = d3.select(chartRef.current).append("select")
      .attr("id", "yearFilter")
      .style("margin", "10px")
      .style("color", "black")
      .style("font-size", "16px")
      .style("padding", "5px");

    //load the data
    d3.csv("/DuolingoLanguageReport.csv").then(languageData => {
      //extract unique years excluding non-country columns
      const years = Object.keys(languageData[0]).filter(key => key !== "country" && !key.startsWith("pop2_2020"));

      //populate the dropdown menu
      dropdown.selectAll("option")
        .data(years)
        .enter().append("option")
        .attr("value", d => d)
        .text(d => d);

      //update chart based on the selected year
      const updateChart = (selectedYear) => {
        const filteredData = languageData.map(d => ({
          Country: d.Country,
          Language: d[selectedYear]
        })).filter(d => d.Language !== undefined && !d.Language.startsWith("pop2_") && !d.Language.startsWith("pop1_"));

        //aggregate data by language
        const languageCounts = d3.rollups(filteredData,
          v => v.length,
          d => d.Language);

        const barData = languageCounts.map(([Language, Count]) => ({ Language, Count }));

        //update scales
        xScale.domain(barData.map(d => d.Language));
        yScale.domain([0, d3.max(barData, d => d.Count)]);

        //bind data to bars
        const bars = chart.selectAll("rect")
          .data(barData, d => d.Language);

        //enter new bars
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

        // Increase text size for axes after update
        xAxis.selectAll("text")
          .style("font-size", "14px");
        yAxis.selectAll("text")
          .style("font-size", "14px");
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

  return (
    <div className="flex flex-col items-center justify-center gap-8 max-w-6xl mx-auto p-8">
      <div ref={chartRef} className="w-full h-[600px]"></div>
      <div className="bg-black bg-opacity-60 p-6 rounded-lg max-w-2xl">
        <p className="text-white text-xl text-center">
          Language learning platforms like Duolingo have seen significant growth, with users showing increased interest in non-English languages.
        </p>
        <p className="text-white text-sm mt-4 text-center italic">
          Figure 2: Most Popular Languages Studied on Duolingo from 2020-2024.
        </p>
      </div>
    </div>
  );
};

export default LanguageChart;

