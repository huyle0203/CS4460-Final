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
      const margin = { top: 40, right: 20, bottom: 10, left: 10 }
      const legendItemHeight = 20
      const legendSpacing = 5

      const svg = d3.select(chartRef.current)
          .append('svg')
          .attr('width', treeMapWidth + legendWidth)
          .attr('height', height + margin.top)

      const data = {
        name: 'Languages',
        children: [
          { name: 'English', value: 49.4 },
          { name: 'Spanish', value: 6.0 },
          { name: 'German', value: 5.5 },
          { name: 'Japanese', value: 5.0 },
          { name: 'French', value: 4.4 },
          { name: 'Russian', value: 4.0 },
          { name: 'Portuguese', value: 3.8 },
          { name: 'Italian', value: 2.7 },
          { name: 'Dutch, Flemish', value: 2.1 },
          { name: 'Polish', value: 1.8 },
          { name: 'Turkish', value: 1.8 },
          { name: 'Persian', value: 1.3 },
          { name: 'Chinese', value: 1.2 },
          { name: 'Vietnamese', value: 1.1 },
          { name: 'Indonesian', value: 1.1 },
          { name: 'Czech', value: 1.0 },
          { name: 'Korean', value: 0.8 },
          { name: 'Ukrainian', value: 0.6 },
          { name: 'Hungarian', value: 0.6 },
          { name: 'Arabic', value: 0.5 },
          { name: 'Romanian', value: 0.5 },
          { name: 'Swedish', value: 0.5 },
          { name: 'Greek', value: 0.5 },
          { name: 'Hebrew', value: 0.4 },
          { name: 'Danish', value: 0.4 },
          { name: 'Finnish', value: 0.4 },
          { name: 'Slovak', value: 0.4 },
          { name: 'Thai', value: 0.3 },
          { name: 'Bulgarian', value: 0.3 },
          { name: 'Serbian', value: 0.2 },
          { name: 'Croatian', value: 0.2 },
          { name: 'Lithuanian', value: 0.2 },
          { name: 'Norwegian Bokmål', value: 0.2 },
          { name: 'Slovenian', value: 0.1 },
          { name: 'Catalan, Valencian', value: 0.1 },
          { name: 'Estonian', value: 0.1 },
          { name: 'Norwegian', value: 0.1 },
          { name: 'Latvian', value: 0.1 }
        ]
      }

      const root = d3.hierarchy(data).sum(d => d.value)

      d3.treemap()
          .size([treeMapWidth, height - margin.top])
          .padding(1)(root)

      svg.append('text')
          .attr('class', 'title')
          .attr('x', (treeMapWidth + legendWidth) / 2)
          .attr('y', margin.top / 2)
          .attr('text-anchor', 'middle')
          .style('font-size', '20px')
          .style('fill', 'black')
          .text('Share of Most Common Languages Spoken on the Web')

      const colorScale = d3.scaleOrdinal(d3.schemeTableau10)

      const tooltip = d3.select(chartRef.current)
          .append('div')
          .style('position', 'absolute')
          .style('background', 'white')
          .style('border', '1px solid #ccc')
          .style('border-radius', '4px')
          .style('padding', '8px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('display', 'none')

      const nodes = svg.selectAll('g')
          .data(root.leaves())
          .enter()
          .append('g')
          .attr('transform', d => `translate(${d.x0},${d.y0 + margin.top})`)

      nodes.append('rect')
          .attr('width', d => d.x1 - d.x0)
          .attr('height', d => d.y1 - d.y0)
          .attr('fill', (d, i) => colorScale(i))
          .style('stroke', 'white')
          .style('stroke-width', '1px')
          /*
          .on('mouseover', (event, d) => {
            tooltip.style('display', 'block')
                .html(`<strong>${d.data.name}</strong><br>Share: ${d.data.value}%`)
          })
          .on('mousemove', event => {
            const [x, y] = d3.pointer(event, chartRef.current)
            tooltip.style('top', `${y + 10}px`)
                .style('left', `${x + 10}px`)
          })
          .on('mouseout', () => {
            tooltip.style('display', 'none')
          })

           */

      nodes.append('text')
          .attr('x', d => (d.x1 - d.x0) / 2)
          .attr('y', d => (d.y1 - d.y0) / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .text(d => d.data.name)
          .style('font-size', '10px')
          .style('fill', 'white')

      const legend = svg.append('g')
          .attr('transform', `translate(${treeMapWidth + 20}, ${margin.top})`)

      const legendItems = legend.selectAll('.legend-item')
          .data(data.children)
          .enter()
          .append('g')
          .attr('class', 'legend-item')
          .attr('transform', (d, i) => `translate(0, ${i * (legendItemHeight + legendSpacing)})`)

      legendItems.append('rect')
          .attr('width', legendItemHeight)
          .attr('height', legendItemHeight)
          .attr('fill', (d, i) => colorScale(i))

      legendItems.append('text')
          .attr('x', legendItemHeight + 5)
          .attr('y', legendItemHeight / 2)
          .attr('dy', '0.35em')
          .text(d => `${d.name}: ${d.value}%`)
          .style('font-size', '12px')
          .style('fill', 'black')

    }
  }, [])

  return (
      <div className="flex flex-col items-center justify-center gap-8 max-w-6xl mx-auto p-8">
        {/* render here */}
        <div ref={chartRef} className="relative w-full h-[600px]" />
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
