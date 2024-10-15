// script.js
document.addEventListener("DOMContentLoaded", () => {
    // Création du bouton
    const addBookButton = document.createElement("button");
    
    // Ajout du texte et des attributs au bouton
    addBookButton.textContent = "Ajouter un livre";
    addBookButton.id = "addBookButton";
    
    // Sélection de l'élément parent où insérer le bouton (ici le div avec l'id myBooks)
    const myBooksDiv = document.getElementById("myBooks");
    
    // Ajout du bouton à la page, juste avant la balise <hr>
    myBooksDiv.insertBefore(addBookButton, myBooksDiv.querySelector("hr"));
    
     // Ajout d'un événement de clic pour le bouton
     addBookButton.addEventListener("click", () => {
      // Vérifier si le formulaire existe déjà
      if (!document.getElementById("bookForm")) {
          // Création du formulaire
          const form = document.createElement("form");
          form.id = "bookForm";
          form.style.marginTop = "20px";

          // Création du champ "Titre du livre"
          const titleLabel = document.createElement("label");
          titleLabel.textContent = "Titre du livre : ";
          titleLabel.style.display = "block"; // Pour que le label soit sur une ligne séparée
          const titleInput = document.createElement("input");
          titleInput.type = "text";
          titleInput.id = "title";
          titleInput.name = "title";

          // Création du champ "Auteur"
          const authorLabel = document.createElement("label");
          authorLabel.textContent = "Auteur : ";
          authorLabel.style.display = "block"; // Pour que le label soit sur une ligne séparée
          const authorInput = document.createElement("input");
          authorInput.type = "text";
          authorInput.id = "author";
          authorInput.name = "author";

          // Création du bouton "Rechercher"
          const searchButton = document.createElement("button");
          searchButton.textContent = "Rechercher";
          searchButton.id = "searchButton";
          searchButton.type = "submit"; // Type submit pour que le formulaire puisse être soumis
          searchButton.classList.add("form-button");

          // Création du bouton "Annuler"
          const cancelButton = document.createElement("button");
          cancelButton.textContent = "Annuler";
          cancelButton.id = "cancelButton";
          cancelButton.type = "button"; // Type button pour qu'il ne soumette pas le formulaire
          cancelButton.classList.add("form-button");

          // Ajout des champs au formulaire
          form.appendChild(titleLabel);
          form.appendChild(titleInput);
          form.appendChild(authorLabel);
          form.appendChild(authorInput);
          form.appendChild(searchButton);
          form.appendChild(cancelButton);

          // Ajout du formulaire à la page, après le bouton
          myBooksDiv.insertBefore(form, addBookButton.nextSibling);

          //Masquer le bouton "Ajouter un Livre"
          addBookButton.style.display = "none";

          // Ajout d'un événement de clic pour le bouton "Annuler"
          cancelButton.addEventListener("click", () => {
            form.remove(); // Supprimer le formulaire
            removeSearchResults(); // Supprimer les résultats de recherche
            addBookButton.style.display = "block"; // Afficher à nouveau le bouton
        });

        // Écouteur d'événement pour la soumission du formulaire
        form.addEventListener("submit", (event) => {
          event.preventDefault(); // Empêche la soumission par défaut
          const title = titleInput.value.trim();
          const author = authorInput.value.trim();
          if (title === "" && author === "") {
            alert("Veuillez remplir au moins l'un des champs : Titre du livre ou Auteur.");
            return; // Ne pas continuer si les champs sont vides 
        }
          searchBooks(title, author);
      });
      }
  });
});

// Fonction pour rechercher des livres via l'API Google Books
function searchBooks(title, author) {
  const query = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`;
  
  fetch(query)
      .then(response => {
          if (!response.ok) {
              throw new Error('Erreur lors de la recherche des livres');
          }
          return response.json();
      })
      .then(data => {
        removeSearchResults();
          displayResults(data.items);
      })
      .catch(error => {
          console.error(error);
          alert('Une erreur est survenue lors de la recherche des livres.');
      });
}

// Fonction pour afficher les résultats de la recherche
function displayResults(books) {
    // Création de l'élément de titre des résultats
    const resultTitle = document.createElement("h2");
    resultTitle.textContent = "Résultats de recherche";
    resultTitle.style.textAlign = "center";
    resultTitle.style.marginTop = "20px";
    resultTitle.className = "result-title";

    // Crée ou remplace la section des résultats
    let resultsDiv = document.getElementById("results");
    if (resultsDiv) {
        resultsDiv.remove();
    }

    resultsDiv = document.createElement("div");
    resultsDiv.id = "results";
    resultsDiv.style.marginTop = "10px";
    resultsDiv.style.display = "flex";
    resultsDiv.style.flexWrap = "wrap";
    resultsDiv.style.gap = "20px";
    resultsDiv.style.justifyContent = "flex-start";

    if (books && books.length > 0) {
        books.forEach(book => {
            const bookInfo = document.createElement("div");
            bookInfo.style.border = "1px solid #ccc";
            bookInfo.style.padding = "10px";
            bookInfo.style.width = "calc(50% - 20px)";
            bookInfo.style.boxSizing = "border-box";
            bookInfo.style.position = "relative";

            // Récupération des données
            const bookId = book.id;
            const title = book.volumeInfo.title || "Titre manquant";
            const authors = book.volumeInfo.authors || ["Auteur inconnu"];
            const author = authors[0];
            const description = book.volumeInfo.description || "Information manquante";
            const descriptionShort = description.length > 200 ? description.substring(0, 200) + "..." : description;
            const imageUrl = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "images/unavailable.png";

            // Création des éléments pour chaque livre
            const titleElement = document.createElement("h3");
            titleElement.textContent = title;

            const idElement = document.createElement("p");
            idElement.textContent = `Identifiant : ${bookId}`;
            idElement.style.fontStyle = "italic";

            const authorElement = document.createElement("p");
            authorElement.textContent = `Auteur : ${author}`;

            const descriptionElement = document.createElement("p");
            descriptionElement.textContent = `Description : ${descriptionShort}`;

            const imageElement = document.createElement("img");
            imageElement.src = imageUrl;
            imageElement.alt = "Image du livre";
            imageElement.style.width = "140px";
            imageElement.style.marginRight = "10px";

            const bookmarkIcon = document.createElement("img");
            bookmarkIcon.src = "C:/Users/sylva/Downloads/Projet 6/bookmark_icon.svg";
            bookmarkIcon.alt = "Ajouter à la poch'liste";
            bookmarkIcon.style.width = "20px";
            bookmarkIcon.style.cursor = "pointer";
            bookmarkIcon.style.position = "absolute";
            bookmarkIcon.style.top = "10px";
            bookmarkIcon.style.right = "10px";

            bookmarkIcon.addEventListener("click", () => {
                togglePochList(bookInfo, title, author, imageUrl,description,bookId, bookmarkIcon);
            });

            // Assemblage des éléments
            bookInfo.appendChild(imageElement);
            bookInfo.appendChild(titleElement);
            bookInfo.appendChild(idElement);
            bookInfo.appendChild(authorElement);
            bookInfo.appendChild(descriptionElement);
            bookInfo.appendChild(bookmarkIcon);

            resultsDiv.appendChild(bookInfo);
        });
    } else {
        // Aucun livre trouvé
        resultsDiv.textContent = "Aucun livre n’a été trouvé.";
        resultsDiv.style.textAlign = "center"; // Centrer le texte pour un meilleur affichage
    }

    // Sélection de l'élément "Ma poch'liste" pour insérer les résultats au-dessus
    const pochListTitle = document.querySelector("#content h2");
    pochListTitle.parentNode.insertBefore(resultTitle, pochListTitle);
    pochListTitle.parentNode.insertBefore(resultsDiv, resultTitle.nextSibling);
    
}

// Fonction pour supprimer les résultats de recherche
function removeSearchResults() {
    // Supprimer le titre des résultats de recherche s'il existe
    const resultTitle = document.querySelector(".result-title");
    if (resultTitle) {
        resultTitle.remove();
    }

    // Supprimer la div des résultats de recherche s'il existe
    const resultsDiv = document.getElementById("results");
    if (resultsDiv) {
        resultsDiv.remove();
    }
}

// Fonction pour ajouter/retirer un livre à la poch'liste
function togglePochList(bookInfo, title, author, imageUrl,description,bookId, bookmarkIcon) {
    const isBookmarked = bookmarkIcon.src.includes("bookmark-solid.svg");
    const pochListSection = document.getElementById("pochList") || createPochListSection();
    const bookIdentifiant = bookId; // Assurez-vous que l'identifiant est bien stocké dans le dataset
    const storedBooks = JSON.parse(sessionStorage.getItem("pochListBooks")) || [];
    if (!isBookmarked) {
        if (storedBooks.some(book => book.id === bookIdentifiant)) {
            alert("Vous ne pouvez ajouter deux fois le même livre."); // *** Message d'alerte ***
            return; // *** Sortir de la fonction si le livre est déjà ajouté ***
        }
        // Modifier l'icône pour "bookmark-solid.svg"
        bookmarkIcon.src = "C:/Users/sylva/Downloads/Projet 6/bookmark-solid.svg";

        // Ajouter le livre à la poch'liste
        const pochListDiv = document.createElement("div");
        pochListDiv.className = "poch-list-item";
        pochListDiv.dataset.title = title; // Stocker le titre pour identifier le livre
        pochListDiv.style.display = "flex";
        pochListDiv.style.alignItems = "center";

         // Limiter la description à 100 caractères
        const shortDescription = description.length > 100 ? description.substring(0, 100) + "..." : description;

        pochListDiv.innerHTML = `
            <img src="${imageUrl}" alt="Image du livre" style="width: 50px; margin-right: 10px;">
             <div>
                <h3>${title}</h3>
                <p>Auteur : ${author}</p>
                <p>Description : ${shortDescription}</p>
               <p>Identifiant : ${bookId}</p>
            </div>
            <img src="C:/Users/sylva/Downloads/Projet 6/trash-solid.svg" alt="Retirer" class="remove-icon" style="width: 15px; cursor: pointer; margin-left: 10px;">
        `;

        // Création du bouton "Retirer"
    
        const removeIcon = pochListDiv.querySelector(".remove-icon");
        removeIcon.addEventListener("click", () => {
            pochListDiv.remove(); // *** Supprimer le livre de la poch'liste ***
            bookmarkIcon.src = "C:/Users/sylva/Downloads/Projet 6/bookmark_icon.svg"; // *** Remettre l'icône originale ***
            const updatedBooks = storedBooks.filter(book => book.id !== bookId);
            sessionStorage.setItem("pochListBooks", JSON.stringify(updatedBooks));
        });

        pochListSection.appendChild(pochListDiv);
        storedBooks.push({ id: bookId, title, author, description }); // Ajouter le livre à la liste stockée
        sessionStorage.setItem("pochListBooks", JSON.stringify(storedBooks));
    } else {
        // Revenir à l'icône "bookmark_icon.svg"
        bookmarkIcon.src = "C:/Users/sylva/Downloads/Projet 6/bookmark_icon.svg";

        // Retirer le livre de la poch'liste
        const pochListDiv = Array.from(pochListSection.children).find(div => div.dataset.title === title);
        if (pochListDiv) {
            pochListDiv.remove();
        }
    }
}

// Fonction pour créer la section de la poch'liste si elle n'existe pas
function createPochListSection() {
    const pochListSection = document.createElement("div");
    pochListSection.id = "pochList";
    document.getElementById("myBooks").appendChild(pochListSection);
    return pochListSection;
}