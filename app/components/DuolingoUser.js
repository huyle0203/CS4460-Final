'use client'

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const DuolingoUser = () => {
  const chartRef = useRef(null)

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
    ]

    const margin = { top: 40, right: 30, bottom: 60, left: 60 }
    const width = chartRef.current.clientWidth - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    d3.select(chartRef.current).selectAll("*").remove()

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // creating scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.year))
      .range([0, width])
      .padding(0.2)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.users)])
      .nice()
      .range([height, 0])

    // creating axes
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    // appending axes
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("dx", "-0.8em")
      .attr("dy", "0.15em")
      .style("font-size", "12px")

    svg.append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "12px")

    // generating the line
    const line = d3.line()
      .x(d => xScale(d.year) + xScale.bandwidth() / 2)
      .y(d => yScale(d.users))
      .curve(d3.curveMonotoneX)

    // appending the line
    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line)

    // dots for the map
    svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.year) + xScale.bandwidth() / 2)
      .attr("cy", d => yScale(d.users))
      .attr("r", 4)
      .attr("fill", "steelblue")

    // adding axes labels
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .style("text-anchor", "middle")
      .attr("class", "axis-label")
      .text("Users (Millions)")

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .style("text-anchor", "middle")
      .attr("class", "axis-label")
      .text("Year (Quarterly)")

    // creating title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .style("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text("Growth in Duolingo Users Over Time (2020-2024)")

    // tooltip
    const tooltip = d3.select(chartRef.current)
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("padding", "10px")
      .style("border-radius", "5px")

    // hover effects
    svg.selectAll(".dot")
      .on("mouseover", (event, d) => {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9)
        tooltip.html(`Year: ${d.year}<br/>Users: ${d.users} million`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px")
      })
      .on("mouseout", () => {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0)
      })

  }, [])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div ref={chartRef} className="w-full max-w-4xl h-[500px]"></div>
      <div className="bg-black bg-opacity-60 p-6 rounded-lg max-w-2xl">
        <p className="text-white text-xl text-center">
          The growing trend in the number of monthly users on Duolingo since 2020
          suggests that there is a growing interest among users in language acquisition 
          since the pandemic.
        </p>
        <p className="text-white text-sm mt-4 text-center italic">
          Figure 8: Active Monthly Duolingo Users Worldwide
        </p>
      </div>
    </div>
  )
}

export default DuolingoUser

