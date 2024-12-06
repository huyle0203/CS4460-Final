'use client'

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const TreeMapChart = () => {
  const chartRef = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      const treeMapWidth = 600
      const height = 600
      const legendWidth = 200
      const legendItemHeight = 20
      const legendSpacing = 5

      const svg = d3.select(chartRef.current)
        .append('svg')
        .attr('width', treeMapWidth + legendWidth)
        .attr('height', height)

      d3.csv("/languages_on_web.csv").then(data => {
        data.forEach(d => {
          d.percentage = +d[Object.keys(d)[1]]
          d.language = d[Object.keys(d)[0]]
        })

        const treeData = {
          name: "Languages",
          children: data.map(d => ({ name: d.language, value: d.percentage }))
        }

        const root = d3.hierarchy(treeData).sum(d => d.value)

        d3.treemap()
          .size([treeMapWidth, height - 50])
          .padding(1)(root)

        svg.append("text")
          .attr("class", "title")
          .attr("x", (treeMapWidth + legendWidth) / 2)
          .attr("y", 30)
          .attr("text-anchor", "middle")
          .style("font-size", "20px")
          .style("fill", "white")
          .text("Most Common Languages Spoken on the Web")

        const nodes = svg.selectAll("g")
          .data(root.leaves())
          .enter()
          .append("g")
          .attr("transform", d => `translate(${d.x0},${d.y0 + 50})`)

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

        nodes.append("rect")
          .attr("width", d => d.x1 - d.x0)
          .attr("height", d => d.y1 - d.y0)
          .attr("fill", (d, i) => colorScale(i))

        nodes.append("text")
          .attr("class", "node")
          .attr("x", d => (d.x1 - d.x0) / 2)
          .attr("y", d => (d.y1 - d.y0) / 2)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "central")
          .text(d => d.data.name)
          .style("font-size", "10px")
          .style("fill", "white")
          .call(wrapText, d => d.x1 - d.x0)

        const legend = svg.append("g")
          .attr("transform", `translate(${treeMapWidth + 20}, 50)`)

        const legendItems = legend.selectAll(".legend-item")
          .data(data)
          .enter()
          .append("g")
          .attr("class", "legend-item")
          .attr("transform", (d, i) => `translate(0, ${i * (legendItemHeight + legendSpacing)})`)

        legendItems.append("rect")
          .attr("width", legendItemHeight)
          .attr("height", legendItemHeight)
          .attr("fill", (d, i) => colorScale(i))

        legendItems.append("text")
          .attr("x", legendItemHeight + 5)
          .attr("y", legendItemHeight / 2)
          .attr("dy", "0.35em")
          .text(d => `${d.language}: ${d.percentage}%`)
          .attr("class", "legend")
          .style("font-size", "12px")
          .style("fill", "white")

        function wrapText(text, width) {
          text.each(function() {
            const text = d3.select(this),
                  words = text.text().split(/\s+/).reverse(),
                  lineHeight = 1.1,
                  y = text.attr("y"),
                  x = text.attr("x"),
                  dy = 0

            let word,
                line = [],
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em")

            while (word = words.pop()) {
              line.push(word)
              tspan.text(line.join(" "))
              if (tspan.node().getComputedTextLength() > width) {
                line.pop()
                tspan.text(line.join(" "))
                line = [word]
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++dy * lineHeight + "em").text(word)
              }
            }
          })
        }
      }).catch(error => {
        console.error("Error loading the CSV file:", error)
      })
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-8 max-w-6xl mx-auto p-8">
      <div ref={chartRef} className="w-full h-[600px]" />
      <div className="bg-black bg-opacity-60 p-6 rounded-lg max-w-2xl">
        <p className="text-white text-xl text-center">
          "The internet was once dominated by English due to historical and technological factors. This has shifted as other languages have gained prominence."
        </p>
        <p className="text-white text-sm mt-4 text-center italic">
          Figure 1: Share of Most Common Languages Spoken on the Web
        </p>
      </div>
    </div>
  )
}

export default TreeMapChart

