import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function BudgetChart({ budget, actual }) {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    const width = 400, height = 300, margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const data = [
      { label: 'Budget', value: budget },
      { label: 'Actual', value: actual }
    ];

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)]).nice()
      .range([height - margin.bottom, margin.top]);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
        .attr('x', d => x(d.label))
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => y(0) - y(d.value))
        .attr('fill', (d,i) => i === 0 ? '#1f77b4' : '#ff7f0e');
  }, [budget, actual]);

  return <svg ref={ref} width={400} height={300} />;
}
