import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function BudgetChart({ budget, actual }) {
  const ref = useRef();

  useEffect(() => {
    d3.select(ref.current).selectAll('*').remove();

    const width = 300;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const data = [
      { label: 'Budget', value: budget },
      { label: 'Actual', value: actual },
    ];

    const x = d3
      .scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const svg = d3
      .select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Bars
    svg
      .selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => y(0) - y(d.value))
      .attr('fill', d => (d.label === 'Budget' ? 'teal' : 'orange'));

    // X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    // Y axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5));
  }, [budget, actual]);

  return (
    <svg
      ref={ref}
      style={{ width: '100%', height: 'auto', maxWidth: 300 }}
    />
  );
}
