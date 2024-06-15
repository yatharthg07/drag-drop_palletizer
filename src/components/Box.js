import React from 'react';
import { useDrag } from 'react-dnd';

const Box = ({ id, x, y, moveBox, removeBox, boxWidth, boxHeight }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'box',
    item: { id, x, y },
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (item && delta) {
        const newX = Math.round(x + delta.x);
        const newY = Math.round(y + delta.y);
        moveBox(item.id, newX, newY);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }), [id, x, y, moveBox]);

  return (
    <div ref={drag} onClick={() => removeBox(id)} style={{ position: 'absolute', left: x, top: y, width: `${boxWidth}px`, height: `${boxHeight}px`, backgroundColor: 'blue', cursor: 'move', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Box {id}
    </div>
  );
};

export default Box;
