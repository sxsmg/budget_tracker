import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function SummaryChart({ data }) {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear any existing SVG
    d3.select(ref.current).selectAll('*').remove();

    // Dimensions
    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };

    // Parse date and values
    const parseDate = d3.timeParse('%Y-%m-%d');
    const dataset = data.map(d => ({
      date: parseDate(d.date),
      income: +d.income,
      expense: +d.expense,
    }));

    // Scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(dataset, d => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(dataset, d => Math.max(d.income, d.expense)),
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Line generators
    const lineIncome = d3
      .line()
      .x(d => x(d.date))
      .y(d => y(d.income));

    const lineExpense = d3
      .line()
      .x(d => x(d.date))
      .y(d => y(d.expense));

    const svg = d3
      .select(ref.current)
      .attr('viewBox', `0 0 ${width} ${height}`);

    // X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d3.timeFormat('%b %d')));

    // Y axis
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Draw lines
    svg
      .append('path')
      .datum(dataset)
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke', 'steelblue')
      .attr('d', lineIncome);

    svg
      .append('path')
      .datum(dataset)
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke', 'tomato')
      .attr('d', lineExpense);

    // Legend
    svg
      .append('text')
      .attr('x', width - margin.right - 60)
      .attr('y', margin.top + 10)
      .text('Income')
      .style('fill', 'steelblue');

    svg
      .append('text')
      .attr('x', width - margin.right - 60)
      .attr('y', margin.top + 30)
      .text('Expenses')
      .style('fill', 'tomato');
  }, [data]);

  return (
    <svg
      ref={ref}
      style={{ width: '100%', height: 'auto', maxWidth: 600 }}
    />
  );
}
