var vid = document.getElementById("myVideo");
vid.volume = 0.2;

const cont2 = document.querySelector('#invisible');

const cont = () => {
    cont2.classList.add('#continue')

}
document.addEventListener('GamepadButton');