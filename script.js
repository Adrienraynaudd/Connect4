document.addEventListener("DOMContentLoaded", function() {
  const cells = document.querySelectorAll(".cell");
  let currentPlayer = "red";
  const rowCount = 6;
  const columnCount = 7;

  // Fonction de vérification de victoire
  function checkWin() {
    // Fonction d'assistance pour vérifier une séquence de cellules
    function checkSequence(sequence) {
      for (let i = 0; i < sequence.length; i++) {
        const [row, col] = sequence[i];
        const index = row * columnCount + col;
        if (!cells[index] || !cells[index].classList.contains(currentPlayer)) {
          return false;
        }
      }
      return true;
    }

    // Vérification des lignes
    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < columnCount - 3; col++) {
        const sequence = [
          [row, col],
          [row, col + 1],
          [row, col + 2],
          [row, col + 3]
        ];
        if (checkSequence(sequence)) {
          return true;
        }
      }
    }

    // Vérification des colonnes
    for (let col = 0; col < columnCount; col++) {
      for (let row = 0; row < rowCount - 3; row++) {
        const sequence = [
          [row, col],
          [row + 1, col],
          [row + 2, col],
          [row + 3, col]
        ];
        if (checkSequence(sequence)) {
          return true;
        }
      }
    }

    // Vérification des diagonales descendantes
    for (let row = 0; row < rowCount - 3; row++) {
      for (let col = 0; col < columnCount - 3; col++) {
        const sequence = [
          [row, col],
          [row + 1, col + 1],
          [row + 2, col + 2],
          [row + 3, col + 3]
        ];
        if (checkSequence(sequence)) {
          return true;
        }
      }
    }

    // Vérification des diagonales ascendantes
    for (let row = 3; row < rowCount; row++) {
      for (let col = 0; col < columnCount - 3; col++) {
        const sequence = [
          [row, col],
          [row - 1, col + 1],
          [row - 2, col + 2],
          [row - 3, col + 3]
        ];
        if (checkSequence(sequence)) {
          return true;
        }
      }
    }

    return false;
  }

  cells.forEach((cell, index) => {
    let isAnimating = false; // Variable de contrôle pour bloquer les clics supplémentaires pendant l'animation
  
    cell.addEventListener("click", function() {
      // Vérifier si l'animation est en cours ou si un clic supplémentaire est bloqué
      if (!isAnimating && !document.querySelector(".animated-piece")) {
        // Marquer l'animation en cours
        isAnimating = true;
  
        // Vérifier si la cellule est vide
        if (!cell.classList.contains("red") && !cell.classList.contains("yellow")) {
          // Trouver la dernière cellule vide dans la colonne
          let lastEmptyCell = null;
          for (let i = index; i < cells.length; i += columnCount) {
            if (!cells[i].classList.contains("red") && !cells[i].classList.contains("yellow")) {
              lastEmptyCell = cells[i];
            } else {
              break;
            }
          }
  
          if (lastEmptyCell) {
            // Ajouter la classe de couleur du joueur actuel à la cellule
            lastEmptyCell.classList.add(currentPlayer);
  
            // Créer une pièce animée
            const animatedPiece = document.createElement("div");
            animatedPiece.classList.add("animated-piece");
            animatedPiece.style.backgroundColor = currentPlayer;
  
            // Ajouter la pièce animée à la page
            document.body.appendChild(animatedPiece);
  
            // Obtenir la position initiale de la pièce
            const initialPosition = cell.getBoundingClientRect();
  
            // Obtenir la position finale de la pièce avec ajustement vers la droite
            const finalPosition = lastEmptyCell.getBoundingClientRect();
            const cellWidth = lastEmptyCell.offsetWidth;
            const adjustment = (cellWidth - animatedPiece.offsetWidth) / 2;
            const finalLeft = finalPosition.left + adjustment;
  
            // Positionner la pièce animée au-dessus de la cellule initiale
            animatedPiece.style.left = `${initialPosition.left}px`;
            animatedPiece.style.top = `${initialPosition.top}px`;
  
            // Animer la pièce jusqu'à la position finale
            const animation = animatedPiece.animate(
              [
                { left: `${initialPosition.left}px`, top: `${initialPosition.top}px` },
                { left: `${finalLeft}px`, top: `${finalPosition.top}px` }
              ],
              {
                duration: 500, // Durée de l'animation (ajustable selon vos préférences)
                easing: "ease-in-out" // Courbe d'animation (ajustable selon vos préférences)
              }
            );
  
            // Supprimer la pièce animée après l'animation
            animation.onfinish = function() {
              document.body.removeChild(animatedPiece);
              
              // Marquer l'animation terminée
              isAnimating = false;
  
              // Vérifier la victoire
              if (checkWin()) {
                // Redirection vers la page "winner.html" en cas de victoire
                window.location.href = "winner.html?winner=" + currentPlayer;
              } else {
                // Changer de joueur
                currentPlayer = (currentPlayer === "red") ? "yellow" : "red";
              }
            };
          }
        }
      }
    });
  
  });
});