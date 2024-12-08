'use client'

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const EnglishInternetDecline = () => {
    const chartRef = useRef(null)

    useEffect(() => {
        const data = [
            { year: 1996, internetUsers: 80, webPages: 70 },
            { year: 1997, internetUsers: 75, webPages: 68 },
            { year: 1998, internetUsers: 70, webPages: 65 },
            { year: 1999, internetUsers: 60, webPages: 60 },
            { year: 2000, internetUsers: 55, webPages: 55 },
            { year: 2001, internetUsers: 45, webPages: 50 },
            { year: 2002, internetUsers: 40, webPages: 50 },
            { year: 2003, internetUsers: 35, webPages: 45 },
            { year: 2004, internetUsers: 30, webPages: 45 },
            { year: 2005, internetUsers: 25, webPages: 45 },
            { year: 2007, internetUsers: 20, webPages: 45 }
        ]

        const margin = { top: 50, right: 30, bottom: 60, left: 60 }
        const width = chartRef.current.clientWidth - margin.left - margin.right
        const height = 400 - margin.top - margin.bottom

        d3.select(chartRef.current).selectAll('*').remove()

        const svg = d3.select(chartRef.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)

        // creating scales
        const xScale = d3.scaleLinear()
            .domain([1996, 2007])
            .range([0, width])

        const yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0])

        // creating axes
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d')).ticks(data.length)
        const yAxis = d3.axisLeft(yScale)

        // appending axes
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis)
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end')

        svg.append('g').call(yAxis)

        // generating lines
        const line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.internetUsers))

        const line2 = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.webPages))

        // appending lines
        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2)
            .attr('d', line)

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'orange')
            .attr('stroke-width', 2)
            .attr('d', line2)

        // adding dots
        svg.selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.year))
            .attr('cy', d => yScale(d.internetUsers))
            .attr('r', 4)
            .attr('fill', 'steelblue')

        svg.selectAll('.dot2')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.year))
            .attr('cy', d => yScale(d.webPages))
            .attr('r', 4)
            .attr('fill', 'orange')

        // adding axes labels
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -margin.left + 20)
            .style('text-anchor', 'middle')
            .attr('class', 'axis-label')
            .text('Percentage (%)')

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height + margin.bottom - 20)
            .style('text-anchor', 'middle')
            .attr('class', 'axis-label')
            .text('Year')

        // creating title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -margin.top / 2)
            .style('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .text('Percentage of Internet Users and Web Pages in English Over Time (1996–2007)')

        // creating legend
        svg.append('rect').attr('x', width - 120).attr('y', -10).attr('width', 10).attr('height', 10).style('fill', 'steelblue')
        svg.append('text').attr('x', width - 100).attr('y', 0).text('% Internet Users').style('font-size', '12px').attr('alignment-baseline', 'middle')
        svg.append('rect').attr('x', width - 120).attr('y', 10).attr('width', 10).attr('height', 10).style('fill', 'orange')
        svg.append('text').attr('x', width - 100).attr('y', 20).text('% Web Pages').style('font-size', '12px').attr('alignment-baseline', 'middle')
    }, [])

    return (
        <div className="flex flex-col items-center justify-center gap-8 max-w-6xl mx-auto p-8">
            <div className="w-full max-w-4xl h-[400px]" ref={chartRef}>
                {/* The chart will render here */}
            </div>
            <div className="bg-black bg-opacity-60 p-6 rounded-lg max-w-2xl">
                <p className="text-white text-xl text-center">
                    "The dominance of English on the internet has been gradually declining as more content becomes available in other languages."
                </p>
                <p className="text-white text-sm mt-4 text-center italic">
                    Figure 13: Percentage of Internet Users and Web Pages in English Over Time (1996–2007).
                </p>
            </div>
        </div>
    )
}

export default EnglishInternetDecline
