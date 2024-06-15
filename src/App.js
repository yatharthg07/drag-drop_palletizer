import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BoxGrid from './components/BoxGrid';
import './App.css';

function App() {
  const [boxes, setBoxes] = useState([]);
  const [gridWidth, setGridWidth] = useState(5); // Default 5 meters
  const [gridHeight, setGridHeight] = useState(5); // Default 5 meters
  const [boxWidth, setBoxWidth] = useState(1); // Default 1 meter
  const [boxHeight, setBoxHeight] = useState(1); // Default 1 meter

  const scaleFactor = 100; // 1 meter = 100 pixels

  const addBox = () => {
    const newBox = { id: boxes.length, x: 10, y: 10 }; // Starting position
    setBoxes([...boxes, newBox]);
  };

  const moveBox = (id, x, y) => {
    const maxX = gridWidth * scaleFactor - boxWidth * scaleFactor;
    const maxY = gridHeight * scaleFactor - boxHeight * scaleFactor;
    const newX = Math.max(0, Math.min(maxX, x));
    const newY = Math.max(0, Math.min(maxY, y));
    const newBoxes = boxes.map(box => {
      if (box.id === id) {
        return { ...box, x: newX, y: newY };
      }
      return box;
    });
    setBoxes(newBoxes);
  };

  const removeBox = id => {
    setBoxes(boxes.filter(box => box.id !== id));
  };

  const submitBoxes = () => {
    console.log("Coordinates of Boxes in meters:");
    boxes.forEach(box => {
      console.log(`Box ${box.id}: (${(box.x / scaleFactor).toFixed(2)}, ${(box.y / scaleFactor).toFixed(2)}) meters`);
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <div className="settings">
          <label>
            Grid Width (m):
            <input type="number" value={gridWidth} onChange={(e) => setGridWidth(Number(e.target.value))} />
          </label>
          <label>
            Grid Height (m):
            <input type="number" value={gridHeight} onChange={(e) => setGridHeight(Number(e.target.value))} />
          </label>
          <label>
            Box Width (m):
            <input type="number" value={boxWidth} onChange={(e) => setBoxWidth(Number(e.target.value))} />
          </label>
          <label>
            Box Height (m):
            <input type="number" value={boxHeight} onChange={(e) => setBoxHeight(Number(e.target.value))} />
          </label>
          <button onClick={addBox}>Add Box</button>
          <button onClick={submitBoxes}>Submit</button>
        </div>
        <BoxGrid boxes={boxes} boxWidth={boxWidth * scaleFactor} boxHeight={boxHeight * scaleFactor} gridWidth={gridWidth * scaleFactor} gridHeight={gridHeight * scaleFactor} moveBox={moveBox} removeBox={removeBox} />
      </div>
    </DndProvider>
  );
}

export default App;
