import * as d3 from 'd3';

export function createTooltip() {
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("padding", "8px")
        .style("border-radius", "4px");

    return {
        show: (event, html) => {
            tooltip.html(html)
                .style("top", `${event.pageY + 10}px`)
                .style("left", `${event.pageX + 10}px`)
                .style("visibility", "visible");
        },
        hide: () => tooltip.style("visibility", "hidden")
    };
}
