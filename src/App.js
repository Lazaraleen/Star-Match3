import { useEffect, useState, useCallback } from "react";
import blueStar from './images/starB.png';
import greenStar from './images/starG.png';
import orangeStar from './images/starO.png';
import purpleStar from './images/starP.png';
import redStar from './images/starR.png';
import yellowStar from './images/starY.png';
import blank from './images/blank.png';

// Le tableau de jeu aura 8 lignes et 8 colonnes
const width = 8;
const starColors = [
  blueStar,
  greenStar,
  orangeStar,
  purpleStar,
  redStar,
  yellowStar
]

const App = () => {
  const [currentColorArrangment, setCurrentColorArrangment] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  
  // Vérifier si il y a une série de 4 en colonne
  const checkForColumnOfFor = useCallback(() => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFor = [i, i + width, i + width * 2, i + width * 3]; 
      const decidedColor = currentColorArrangment[i];

      if (columnOfFor.every(square => currentColorArrangment[square] === decidedColor)) {
        columnOfFor.forEach(square => currentColorArrangment[square] = blank);
        return true;
      }
    }
  }, [currentColorArrangment]);

    // Vérifier si il y a une série de 4 en ligne
  const checkForRowOfFor = useCallback(() => {
    for (let i = 0; i < 64; i++) {
      const rowOfFor = [i, i + 1, i + 2, i + 3]; 
      const decidedColor = currentColorArrangment[i];
      const notvalid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 61, 62, 63]

      if (notvalid.includes(i)) continue;

      if (rowOfFor.every(square => currentColorArrangment[square] === decidedColor)) {
        rowOfFor.forEach(square => currentColorArrangment[square] = blank);
        return true;
      }
    }
  }, [currentColorArrangment]);

    // Vérifier si il y a une série de 3 en colonne
  const checkForColumnOfThree = useCallback(() => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2]; 
      const decidedColor = currentColorArrangment[i];

      if (columnOfThree.every(square => currentColorArrangment[square] === decidedColor)) {
        columnOfThree.forEach(square => currentColorArrangment[square] = blank);
        return true;
      }
    }
  }, [currentColorArrangment]);

    // Vérifier si il y a une série de 3 en ligne
  const checkForRowOfThree = useCallback(() => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2]; 
      const decidedColor = currentColorArrangment[i];
      const notvalid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63]

      if (notvalid.includes(i)) continue;

      if (rowOfThree.every(square => currentColorArrangment[square] === decidedColor)) {
        rowOfThree.forEach(square => currentColorArrangment[square] = blank);
        return true;
      }
    }
  }, [currentColorArrangment]);

  // Déplacer les cases pour remplir les cases vides
  const moveIntoSquareBelow = useCallback(() => {
    for (let i = 0; i <= 55 ; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && currentColorArrangment[i] === blank) {
        let randomNumber = Math.floor(Math.random() * starColors.length);
        currentColorArrangment[i] = starColors[randomNumber];
      }

      if ((currentColorArrangment[i + width]) === blank) {
        currentColorArrangment[i + width] = currentColorArrangment[i];
        currentColorArrangment[i] = blank;
      }
    }
  }, [currentColorArrangment]);

  // Attraper et déplacer les cases
  const dragStart = (e) => {
    setSquareBeingDragged(e.target);
  }

  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target);
  }

  const dragEnd = (e) => {
    const draggedId = parseInt(squareBeingDragged.getAttribute('data-id'));
    const replacedId = parseInt(squareBeingReplaced.getAttribute('data-id'));

    const newColorArrangement = [...currentColorArrangment];
    const draggedColor = newColorArrangement[draggedId];
    const replacedColor = newColorArrangement[replacedId];

    // limiter les mouvements aux cases adjacentes
    const validMoves = [
      draggedId -1,
      draggedId - width,
      draggedId +1,
      draggedId + width
    ];

    const validMove = validMoves.includes(replacedId);

    if(replacedId !== null && validMove) {
      newColorArrangement[replacedId] = draggedColor;
      newColorArrangement[draggedId] = replacedColor;
      setCurrentColorArrangment(newColorArrangement);
    } else {
      setCurrentColorArrangment([...currentColorArrangment]);
    }
  
    setSquareBeingDragged(null);
    setSquareBeingReplaced(null);

  }

  // Créer le tableau et le remplir de couleurs aléatoires
  const createBoard = () => {
    const randomColorArrangment = [];
    for (let i =0; i < width * width; i++) {
      const randomColor = starColors[Math.floor(Math.random() * starColors.length)];
      randomColorArrangment.push(randomColor);
    }
    setCurrentColorArrangment(randomColorArrangment);
  }

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval (() => {
      checkForColumnOfFor();
      checkForRowOfFor();
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentColorArrangment([...currentColorArrangment]);
    }, 100);
    return() => clearInterval(timer)
  }, [checkForColumnOfFor, checkForRowOfFor, checkForColumnOfThree, checkForRowOfThree, moveIntoSquareBelow, currentColorArrangment]);

  return (
    <div className="app">
      <div className="game">
        {currentColorArrangment.map((starColors, index: number) => (
          <img
            key={index}
            src={starColors}
            alt={starColors}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>

    </div>
  );
}

export default App;
