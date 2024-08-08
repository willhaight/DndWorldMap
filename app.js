// Import the functions you need from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAn4VF9q_ALn5nGHoL9BW3HRir1YeUrtco",
    authDomain: "dungeonapp-3f80a.firebaseapp.com",
    projectId: "dungeonapp-3f80a",
    storageBucket: "dungeonapp-3f80a.appspot.com",
    messagingSenderId: "532180053044",
    appId: "1:532180053044:web:8bf63c2be8f651010aee61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

console.log('Firestore initialized');

// Navbar handling
let navbar = document.getElementsByClassName('header')[0];

navbar.onclick = function () {
    // Toggle between 'expanded' and 'shrunk' classes
    if (navbar.classList.contains('expanded')) {
        navbar.classList.remove('expanded');
        navbar.classList.add('shrunk');
        navbar.children[1].style.display = 'none';
        navbar.children[2].style.display = 'none';
    } else {
        navbar.classList.remove('shrunk');
        navbar.classList.add('expanded');
        navbar.children[1].style.display = 'block';
        navbar.children[2].style.display = 'block';
    }
};

// Exiting modal
document.getElementById('exitButton').onclick = function () {
    document.getElementById('characterList').innerHTML = "";
    document.getElementById('abilityList').innerHTML = "";
    document.getElementById('expandedCard').innerHTML = "";
    document.getElementById('modal').style.display = 'none'; // Close the modal after selection
    let contentElements = document.getElementsByClassName('content');
    for (let i = 0; i < contentElements.length; i++) {
        contentElements[i].style.display = "flex"; // Show the main content again
    }
};

// Selecting stored image
let imageSelector = document.getElementById('imageSelector');
let characterList = document.getElementById('characterList');

imageSelector.onclick = async function () {
    characterList.innerHTML = ""; // Clear existing content
    let contentElements = document.getElementsByClassName('content');
    for (let i = 0; i < contentElements.length; i++) {
        contentElements[i].style.display = "none";
    }
    document.getElementById('modal').style.display = 'flex';

    const listRef = ref(storage, 'maps/');
    try {
        const res = await listAll(listRef);
        res.items.forEach((itemRef) => {
            let listItem = document.createElement('div');
            listItem.textContent = itemRef.name;
            listItem.classList.add('list-item'); // Add a class for styling if needed
            listItem.onclick = async () => {
                const url = await getDownloadURL(itemRef);
                selectImage(url);
            };
            characterList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error listing files:', error);
    }
};

function selectImage(url) {
    let selectedImageDiv = document.getElementById('selectedImage');
    selectedImageDiv.innerHTML = `<img src="${url}" alt="Selected Image" style="width: 100%; height: auto;" />`;
    document.getElementById('modal').style.display = 'none'; // Close the modal after selection
    let contentElements = document.getElementsByClassName('content');
    for (let i = 0; i < contentElements.length; i++) {
        contentElements[i].style.display = "flex"; // Show the main content again
    }
}

// Reference to an image file in Firebase Storage
const imageRef = ref(storage, 'headerLogo.png');

// Get the download URL for the image
getDownloadURL(imageRef).then((url) => {
    // Insert the image URL into the <div> element
    const imgContainer = document.getElementById('headerImage');
    imgContainer.style.backgroundImage = `url(${url})`;
    imgContainer.style.backgroundSize = 'cover';  // Cover the container
    imgContainer.style.backgroundPosition = 'center'; // Center the image
}).catch((error) => {
    console.error('Error getting image URL:', error);
});
