import React from 'react';
import Box from './Box';

const BoxGrid = ({ boxes, moveBox, removeBox, boxWidth, boxHeight, gridWidth, gridHeight }) => {
  return (
    <div className="grid" style={{ width: `${gridWidth}px`, height: `${gridHeight}px` }}>
      {boxes.map(box => (
        <Box key={box.id} id={box.id} x={box.x} y={box.y} boxWidth={boxWidth} boxHeight={boxHeight} moveBox={moveBox} removeBox={removeBox} />
      ))}
    </div>
  );
};

export default BoxGrid;
