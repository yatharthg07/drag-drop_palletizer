import React, { useState, useEffect } from 'react';
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
  const [scaleFactorWidth, setScaleFactorWidth] = useState(100); // Scale factor for width
  const [scaleFactorHeight, setScaleFactorHeight] = useState(100); // Scale factor for height

  useEffect(() => {
    const widthScale = 500 / (gridWidth * 100);
    const heightScale = 500 / (gridHeight * 100);
    setScaleFactorWidth(widthScale * 100);
    setScaleFactorHeight(heightScale * 100);
  }, [gridWidth, gridHeight]);

  useEffect(() => {
    // Update all boxes with the new dimensions
    const updatedBoxes = boxes.map(box => ({
      ...box,
      width: Number(boxWidth),
      height: Number(boxHeight)
    }));
    setBoxes(updatedBoxes);
  }, [boxWidth, boxHeight]);

  const addBox = () => {
    const newBox = { id: boxes.length, x: 10, y: 10, width: Number(boxWidth), height: Number(boxHeight) };
    setBoxes([...boxes, newBox]);
  };

  const moveBox = (id, x, y) => {
    const box = boxes.find(box => box.id === id);
    const maxX = Number(gridWidth) * scaleFactorWidth - box.width * scaleFactorWidth;
    const maxY = Number(gridHeight) * scaleFactorHeight - box.height * scaleFactorHeight;
    const newX = Math.max(0, Math.min(maxX, x));
    const newY = Math.max(0, Math.min(maxY, y));
    setBoxes(boxes.map(box => {
      if (box.id === id) {
        return { ...box, x: newX, y: newY };
      }
      return box;
    }));
  };

  const rotateBox = (id) => {
    setBoxes(boxes.map(box => {
      if (box.id === id) {
        return { ...box, width: box.height, height: box.width };
      }
      return box;
    }));
    console.log(boxes);
  };

  const removeBox = id => {
    setBoxes(boxes.filter(box => box.id !== id));
  };

  const submitBoxes = () => {
    console.log("Coordinates of Box Centers in meters:");
    boxes.forEach(box => {
      console.log(`Box ${box.id}: (${((box.x + box.width * scaleFactorWidth / 2) / scaleFactorWidth).toFixed(2)}, ${((box.y + box.height * scaleFactorHeight / 2) / scaleFactorHeight).toFixed(2)}) meters`);
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
        <BoxGrid
          boxes={boxes}
          scaleFactorHeight={scaleFactorHeight}
          scaleFactorWidth={scaleFactorWidth}
          gridWidth={500}
          gridHeight={500}
          moveBox={moveBox}
          rotateBox={rotateBox}
          removeBox={removeBox}
        />
      </div>
    </DndProvider>
  );
  
}

export default App;
