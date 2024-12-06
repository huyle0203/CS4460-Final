'use client'

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DuolingoUser = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const data = [
        { year: "'20_Q1", users: 38.3 },
        { year: "'20_Q2", users: 39 },
        { year: "'20_Q3", users: 37 },
        { year: "'20_Q4", users: 37 },
        { year: "'21_Q1", users: 39.9 },
        { year: "'21_Q2", users: 37.9 },
        { year: "'21_Q3", users: 41.9 },
        { year: "'21_Q4", users: 42.4 },
        { year: "'22_Q1", users: 49.2 },
        { year: "'22_Q2", users: 49.9 },
        { year: "'22_Q3", users: 56.5 },
        { year: "'22_Q4", users: 60.7 },
        { year: "'23_Q1", users: 72.6 },
        { year: "'23_Q2", users: 74.1 },
        { year: "'23_Q3", users: 83.1 },
        { year: "'23_Q4", users: 88.4 },
        { year: "'24_Q1", users: 97.6 },
        { year: "'24_Q2", users: 103.6 },
        { year: "'24_Q3", users: 113.1 }
    ];


    const margin = { top: 20, right: 40, bottom: 70, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the data into numeric values
    data.forEach(d => {
        d.users = +d.users;
    });

    // Set up scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.year))
        .range([0, width])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.users)])
        .nice()
        .range([height, 0]);

    // Create x-axis
    const xAxis = d3.axisBottom(xScale)
        .ticks(d3.timeMonth.every(1));

    // Create y-axis
    const yAxis = d3.axisLeft(yScale)
        .ticks(10);

    // Append the axes
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "middle")
        .attr("dx", 26)
        .attr("dy", 0)
        .style("font-size", "12px");

    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis)
        .selectAll("text")
        .style("font-size", "12px");

    // Line generator
    const line = d3.line()
        .x(d => xScale(d.year) + xScale.bandwidth() / 2)
        .y(d => yScale(d.users));

    // Append the line
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line);

    // Add labels for the axes
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .style("text-anchor", "middle")
        .attr("class", "axis-label")
        .text("Users (Millions)");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .style("text-anchor", "middle")
        .attr("class", "axis-label")
        .text("Year (Quarterly)");
        svg.append("text")
        .attr("x", width / 2) 
        .attr("y", -margin.top / 3)  
        .style("text-anchor", "middle")
        .style("font-size", "16px")  
        .style("font-weight", "bold")  
        .text("Growth in Duolingo Users Over Time (2020-2024)"); 



  }, []);

  return <div ref={chartRef} className="w-full h-full"></div>;
};

export default DuolingoUser;