import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BoxGrid from './components/BoxGrid';
import './App.css';

function App() {
  const [boxes, setBoxes] = useState([]);
  const [gridWidth, setGridWidth] = useState("5");
  const [gridHeight, setGridHeight] = useState("5");
  const [boxWidth, setBoxWidth] = useState("1");
  const [boxLength, setBoxLength] = useState("1");
  const [boxHeight, setBoxHeight] = useState("1");
  const [numLayers, setNumLayers] = useState(1);
  const [scaleFactorWidth, setScaleFactorWidth] = useState(100);
  const [scaleFactorLength, setScaleFactorLength] = useState(100);
  const [displayWidth, setDisplayWidth] = useState(500);
  const [displayHeight, setDisplayHeight] = useState(500);

  useEffect(() => {
    const widthNum = Number(gridWidth);
    const heightNum = Number(gridHeight);
    let newDisplayWidth, newDisplayHeight;

    if (widthNum >= heightNum) {
      newDisplayWidth = 500;
      newDisplayHeight = Math.round((heightNum / widthNum) * 500);
    } else {
      newDisplayHeight = 500;
      newDisplayWidth = Math.round((widthNum / heightNum) * 500);
    }

    setDisplayWidth(newDisplayWidth);
    setDisplayHeight(newDisplayHeight);

    const widthScale = newDisplayWidth / (widthNum * 100);
    const heightScale = newDisplayHeight / (heightNum * 100);
    setScaleFactorWidth(widthScale * 100);
    setScaleFactorLength(heightScale * 100);
  }, [gridWidth, gridHeight]);


  useEffect(() => {
    // Update all boxes with the new dimensions
    const updatedBoxes = boxes.map(box => ({
      ...box,
      width: Number(boxWidth),
      height: Number(boxHeight),
      length: Number(boxLength),
    }));
    setBoxes(updatedBoxes);
  }, [boxWidth, boxHeight,boxLength]);

  const addBox = () => {
    const newBox = {
      id: boxes.length,
      x: 10,
      y: 10,
      width: Number(boxWidth),
      length: Number(boxLength),  // Changed to boxLength
      height: Number(boxHeight),
      layer: 1  // Default to layer 1
    };
    setBoxes([...boxes, newBox]);
  };

  
  const boxesOverlap = (box1, box2) => {
    return (
      box1.x < box2.x + box2.width &&
      box1.x + box1.width > box2.x &&
      box1.y < box2.y + box2.length &&
      box1.y + box1.length > box2.y
    );
  };
  const moveBox = (id, x, y) => {
    const movingBox = boxes.find(box => box.id === id);
    const scaledWidth = movingBox.width * scaleFactorWidth;
    const scaledLength = movingBox.length * scaleFactorLength;
    let newX = Math.max(0, Math.min(Number(gridWidth) * scaleFactorWidth - scaledWidth, x));
    let newY = Math.max(0, Math.min(Number(gridHeight) * scaleFactorLength - scaledLength, y));
  
    const alignmentThreshold = 15; // pixels within which boxes will snap to each other
    let snapX = newX;
    let snapY = newY;
  
    // Iterate through all boxes to find the closest edge within the threshold and check for overlap
    boxes.forEach(otherBox => {
      if (otherBox.id !== id) {
        const otherX = otherBox.x;
        const otherY = otherBox.y;
        const otherWidth = otherBox.width * scaleFactorWidth;
        const otherLength  = otherBox.length * scaleFactorLength;
  
        // Magnetic alignment calculations
        if (Math.abs(newX + scaledWidth - otherX) < alignmentThreshold) {
          snapX = otherX - scaledWidth;
        } else if (Math.abs(newX - (otherX + otherWidth)) < alignmentThreshold) {
          snapX = otherX + otherWidth;
        }
  
        if (Math.abs(newY + scaledLength - otherY) < alignmentThreshold) {
          snapY = otherY - scaledLength;
        } else if (Math.abs(newY - (otherY + otherLength)) < alignmentThreshold) {
          snapY = otherY + otherLength;
        }
      }
    });
  
    // Use the snapped coordinates if they do not cause an overlap
    const testPosition = { ...movingBox, x: snapX, y: snapY, width: scaledWidth, length: scaledLength };
    const overlapExists = boxes.some(otherBox =>
      otherBox.id !== id && boxesOverlap(testPosition, {
        ...otherBox,
        x: otherBox.x,
        y: otherBox.y,
        width: otherBox.width * scaleFactorWidth,
        length: otherBox.length * scaleFactorLength
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
        return { ...box, width: box.length, length: box.width,rotate:!box.rotate };
      }
      return box;
    }));
    console.log(boxes);
  };

  const removeBox = id => {
    setBoxes(boxes.filter(box => box.id !== id));
  };

  

  const submitBoxes = () => {
    console.log("Coordinates of Box Centers:");
    boxes.forEach(box => {
        for (let layer = 1; layer <= numLayers; layer++) {
            const z = box.height* (layer - 0.5);  // Calculate center Z for each layer
            console.log(`Box ${box.id} on Layer ${layer}: (${(box.x + box.width / 2).toFixed(2)}, ${(box.y + box.length / 2).toFixed(2)}, ${z.toFixed(2)}) meters`);
        }
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
          <label>
    Box length (m):
    <input type="number" value={boxLength} onChange={handleDimensionChange(setBoxLength)}/>
    </label>
  <label>
    Number of Layers:
    <input type="number" value={numLayers} onChange={e => setNumLayers(e.target.value)} />
  </label>
          <button onClick={addBox}>Add Box</button>
          <button onClick={submitBoxes}>Submit</button>
        </div>
        <BoxGrid
          boxes={boxes}
          scaleFactorLength={scaleFactorLength}
          scaleFactorWidth={scaleFactorWidth}
          gridWidth={displayWidth}
          gridHeight={displayHeight}
          moveBox={moveBox}
          rotateBox={rotateBox}
          removeBox={removeBox}
        />
      </div>
    </DndProvider>
  );
  
}

export default App;
