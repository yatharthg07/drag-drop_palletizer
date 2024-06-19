import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BoxGrid from './components/BoxGrid';
import './App.css';

function App() {
  const [boxes, setBoxes] = useState([]);
  const [gridWidth, setGridWidth] = useState("5"); // Store as string to manage empty input
  const [gridHeight, setGridHeight] = useState("5"); // Store as string to manage empty input
  const [boxWidth, setBoxWidth] = useState("1"); // Store as string to manage empty input
  const [boxHeight, setBoxHeight] = useState("1"); // Store as string to manage empty input

  const scaleFactor = 100; // 1 meter = 100 pixels

  const addBox = () => {
    const newBox = { id: boxes.length, x: 10, y: 10 }; // Starting position
    setBoxes([...boxes, newBox]);
  };

  const moveBox = (id, x, y) => {
    const maxX = Number(gridWidth) * scaleFactor - Number(boxWidth) * scaleFactor;
    const maxY = Number(gridHeight) * scaleFactor - Number(boxHeight) * scaleFactor;
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
    console.log("Coordinates of Box Centers in meters:");
    boxes.forEach(box => {
      console.log(`Box ${box.id}: (${((box.x + Number(boxWidth) * scaleFactor / 2) / scaleFactor).toFixed(2)}, ${((box.y + Number(boxHeight) * scaleFactor / 2) / scaleFactor).toFixed(2)}) meters`);
    });
  };

  const handleDimensionChange = (setter) => (e) => {
    const value = e.target.value.replace(/^0+/, '') || ''; // Allows empty string
    setter(value);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <div className="settings">
          <label>
            Grid Width (m):
            <input type="number" value={gridWidth} onChange={handleDimensionChange(setGridWidth)} />
          </label>
          <label>
            Grid Height (m):
            <input type="number" value={gridHeight} onChange={handleDimensionChange(setGridHeight)} />
          </label>
          <label>
            Box Width (m):
            <input type="number" value={boxWidth} onChange={handleDimensionChange(setBoxWidth)} />
          </label>
          <label>
            Box Height (m):
            <input type="number" value={boxHeight} onChange={handleDimensionChange(setBoxHeight)} />
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
