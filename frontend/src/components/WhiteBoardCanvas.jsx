import { useRef, useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';

// Function to draw different elements on canvas based on type
function drawElement(ctx, el) {
  ctx.save(); // Save current canvas state

  // Set drawing styles
  ctx.strokeStyle = el.color || '#fff';
  ctx.fillStyle = el.fillColor || 'transparent';
  ctx.lineWidth = el.strokeWidth || 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Freehand drawing (pen tool)
  if (el.type === 'pen' && el.points?.length > 1) {
    ctx.beginPath();
    ctx.moveTo(el.points[0].x, el.points[0].y);

    // Smooth curve drawing using quadratic curves
    for (let i = 1; i < el.points.length - 1; i++) {
      const mx = (el.points[i].x + el.points[i + 1].x) / 2;
      const my = (el.points[i].y + el.points[i + 1].y) / 2;
      ctx.quadraticCurveTo(el.points[i].x, el.points[i].y, mx, my);
    }

    ctx.lineTo(
      el.points[el.points.length - 1].x,
      el.points[el.points.length - 1].y
    );
    ctx.stroke();
  }

  // Rectangle drawing
  else if (el.type === 'rect') {
    const w = el.x2 - el.x1,
          h = el.y2 - el.y1;

    // Fill rectangle if color provided
    if (el.fillColor && el.fillColor !== 'transparent') {
      ctx.fillStyle = el.fillColor;
      ctx.fillRect(el.x1, el.y1, w, h);
    }

    ctx.strokeRect(el.x1, el.y1, w, h);
  }

  // Circle / ellipse drawing
  else if (el.type === 'circle') {
    const cx = (el.x1 + el.x2) / 2,
          cy = (el.y1 + el.y2) / 2;
    const rx = Math.abs(el.x2 - el.x1) / 2,
          ry = Math.abs(el.y2 - el.y1) / 2;

    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);

    if (el.fillColor && el.fillColor !== 'transparent') ctx.fill();
    ctx.stroke();
  }

  // Straight line
  else if (el.type === 'line') {
    ctx.beginPath();
    ctx.moveTo(el.x1, el.y1);
    ctx.lineTo(el.x2, el.y2);
    ctx.stroke();
  }

  // Arrow drawing
  else if (el.type === 'arrow') {
    const dx = el.x2 - el.x1,
          dy = el.y2 - el.y1;

    const angle = Math.atan2(dy, dx);
    const headLen = 16;

    // Draw main line
    ctx.beginPath();
    ctx.moveTo(el.x1, el.y1);
    ctx.lineTo(el.x2, el.y2);
    ctx.stroke();

    // Draw arrow head
    ctx.beginPath();
    ctx.moveTo(el.x2, el.y2);
    ctx.lineTo(
      el.x2 - headLen * Math.cos(angle - Math.PI / 6),
      el.y2 - headLen * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(el.x2, el.y2);
    ctx.lineTo(
      el.x2 - headLen * Math.cos(angle + Math.PI / 6),
      el.y2 - headLen * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  }

  // Text rendering
  else if (el.type === 'text') {
    ctx.font = `${el.fontSize || 18}px Inter, sans-serif`;
    ctx.fillStyle = el.color || '#fff';

    const lines = (el.text || '').split('\n');

    // Render multi-line text
    lines.forEach((line, i) =>
      ctx.fillText(line, el.x, el.y + i * (el.fontSize || 18) * 1.3)
    );
  }

  // Sticky note rendering
  else if (el.type === 'sticky') {
    ctx.fillStyle = el.bgColor || '#fbbf24';

    // Add shadow for sticky
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 8;

    ctx.fillRect(el.x, el.y, el.width || 160, el.height || 120);

    ctx.shadowBlur = 0;

    ctx.fillStyle = '#1a1a1a';
    ctx.font = `13px Inter, sans-serif`;

    // Word wrapping logic
    const words = (el.text || '').split(' ');
    let line = '',
        lines2 = [],
        maxW = (el.width || 160) - 16;

    words.forEach(w => {
      const test = line + w + ' ';
      if (ctx.measureText(test).width > maxW && line) {
        lines2.push(line.trim());
        line = w + ' ';
      } else line = test;
    });

    if (line) lines2.push(line.trim());

    // Draw wrapped text
    lines2.forEach((l, i) =>
      ctx.fillText(l, el.x + 8, el.y + 20 + i * 16)
    );
  }

  ctx.restore(); // Restore canvas state
}