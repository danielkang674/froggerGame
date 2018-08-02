document.getElementById('boyBtn').addEventListener('click', function(){
    player.sprite = 'images/char-boy.png';
    closeModal();
});

document.getElementById('catGirlBtn').addEventListener('click', function(){
    player.sprite = 'images/char-cat-girl.png';
    closeModal();
});

var modal = document.getElementById('simpleModal');

// function to open modal
function openModal(){
    modal.style.display = 'block';
}

// function to close modal
function closeModal(){
    modal.style.display = 'none';
}