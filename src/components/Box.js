import React from 'react';
import { useDrag } from 'react-dnd';

const Box = ({ id, x, y, boxWidth, boxHeight, moveBox, rotateBox, removeBox }) => {
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
    <div ref={drag} style={{
      left: x, top: y,
      width: `${boxWidth}px`, height: `${boxHeight}px`,
      position: 'absolute',
      backgroundColor: '#C2A661',
      border: '2px solid #916A2D',
      boxShadow: '3px 3px 5px rgba(0,0,0,0.3)',
      color: 'black',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.9rem',
      cursor: 'move'
    }} className="box">
      Box {id}
      <button onClick={() => rotateBox(id)}>&#x21bb;</button>
      <button onClick={() => removeBox(id)} className="remove-btn">X</button>
    </div>
  );
};

export default Box;
