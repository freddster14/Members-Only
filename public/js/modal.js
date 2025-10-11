const passcodeInputs = document.querySelectorAll('.passcode-input');
let currentIndex = 0;
let passcode = ['', '', '', ''];

function openModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
  document.body.style.overflow = 'auto';
}

function passcodeEvent(n) {
  console.log(currentIndex, passcode);
  if (currentIndex < 4) {
    passcode[currentIndex] = n;
    passcodeInputs[currentIndex].value = n;
    currentIndex += 1;
  }
  if (currentIndex === 4) {
    document.getElementById('real-passcode').value = passcode.join('');
    document.getElementById('submit-passcode').click();
  }
}

window.onclick = (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
};
