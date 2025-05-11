import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function SummaryChart({ data }) {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    const width = 800, height = 300, margin = { top: 20, right: 30, bottom: 30, left: 50 };

    const x = d3.scalePoint()
      .domain(data.map(d => d.month))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.income, d.expense))]).nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => x(d.month))
      .y(d => y(d.income));

    const line2 = d3.line()
      .x(d => x(d.month))
      .y(d => y(d.expense));

    // axes
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // income line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#2ca02c')
      .attr('stroke-width', 2)
      .attr('d', line);

    // expense line
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#d62728')
      .attr('stroke-width', 2)
      .attr('d', line2);

    // legend
    svg.append('text').attr('x', width - margin.right - 80).attr('y', margin.top + 10).text('Income');
    svg.append('text').attr('x', width - margin.right - 80).attr('y', margin.top + 25).text('Expense');
  }, [data]);

  return <svg ref={ref} width={800} height={300} />;
}
