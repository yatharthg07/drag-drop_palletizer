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
    const newBox = { id: boxes.length, x: 10, y: 10, width: Number(boxWidth), height: Number(boxHeight),rotate:false };
    setBoxes([...boxes, newBox]);
  };

  const boxesOverlap = (box1, box2) => {
    return (
      box1.x < box2.x + box2.width &&
      box1.x + box1.width > box2.x &&
      box1.y < box2.y + box2.height &&
      box1.y + box1.height > box2.y
    );
  };
  const moveBox = (id, x, y) => {
    const movingBox = boxes.find(box => box.id === id);
    const scaledWidth = movingBox.width * scaleFactorWidth;
    const scaledHeight = movingBox.height * scaleFactorHeight;
    let newX = Math.max(0, Math.min(Number(gridWidth) * scaleFactorWidth - scaledWidth, x));
    let newY = Math.max(0, Math.min(Number(gridHeight) * scaleFactorHeight - scaledHeight, y));
  
    const alignmentThreshold = 15; // pixels within which boxes will snap to each other
    let snapX = newX;
    let snapY = newY;
  
    // Iterate through all boxes to find the closest edge within the threshold and check for overlap
    boxes.forEach(otherBox => {
      if (otherBox.id !== id) {
        const otherX = otherBox.x;
        const otherY = otherBox.y;
        const otherWidth = otherBox.width * scaleFactorWidth;
        const otherHeight = otherBox.height * scaleFactorHeight;
  
        // Magnetic alignment calculations
        if (Math.abs(newX + scaledWidth - otherX) < alignmentThreshold) {
          snapX = otherX - scaledWidth;
        } else if (Math.abs(newX - (otherX + otherWidth)) < alignmentThreshold) {
          snapX = otherX + otherWidth;
        }
  
        if (Math.abs(newY + scaledHeight - otherY) < alignmentThreshold) {
          snapY = otherY - scaledHeight;
        } else if (Math.abs(newY - (otherY + otherHeight)) < alignmentThreshold) {
          snapY = otherY + otherHeight;
        }
      }
    });
  
    // Use the snapped coordinates if they do not cause an overlap
    const testPosition = { ...movingBox, x: snapX, y: snapY, width: scaledWidth, height: scaledHeight };
    const overlapExists = boxes.some(otherBox =>
      otherBox.id !== id && boxesOverlap(testPosition, {
        ...otherBox,
        x: otherBox.x,
        y: otherBox.y,
        width: otherBox.width * scaleFactorWidth,
        height: otherBox.height * scaleFactorHeight
      })
    );
  
    // Update the box position only if there is no overlap
    if (!overlapExists) {
      setBoxes(boxes.map(box => {
        if (box.id === id) {
          return { ...box, x: snapX, y: snapY };
        }
        return box;
      }));
    } else {
      console.error("Overlap detected, move not allowed. Trying to move Box", id, "to", newX, newY);
    }
  };
  
  
  
  

  const rotateBox = (id) => {
    setBoxes(boxes.map(box => {
      if (box.id === id) {
        return { ...box, width: box.height, height: box.width,rotate:!box.rotate };
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
    console.log(boxes);
    console.log(scaleFactorHeight);
    console.log(scaleFactorWidth);
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
