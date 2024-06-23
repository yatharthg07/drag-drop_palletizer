import React from 'react';
import Box from './Box';

const BoxGrid = ({ boxes, moveBox, rotateBox, removeBox, gridWidth, gridHeight, scaleFactorWidth, scaleFactorLength }) => {
  return (
    <div className="grid" style={{ width: `${gridWidth}px`, height: `${gridHeight}px` }}>
      {boxes.map(box => (
        <Box
          key={box.id}
          id={box.id}
          x={box.x}
          y={box.y}
          boxWidth={box.width * scaleFactorWidth}
          boxLength={box.length * scaleFactorLength}
          moveBox={moveBox}
          rotateBox={rotateBox}
          removeBox={removeBox}
        />
      ))}
    </div>
  );
};

export default BoxGrid;
