const passcodeInputs = document.querySelectorAll('.passcode-input');
const passcode = ['', '', '', ''];
let currentIndex = 0;
const previousValues = {};

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  const firstInput = modal.querySelector('input:not([type="hidden"])');
  if (firstInput) firstInput.focus();
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
  document.body.style.overflow = 'auto';
}

function passcodeEvent(n) {
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

function checkInputLimit (e, input) {
  if (!previousValues[input]) previousValues[input] = e.value;
  e.nextElementSibling.style.color = '#E3EEF7';
  if (input === 'textarea' && e.value.length > 200) {
    e.value = previousValues[input];
    e.nextElementSibling.style.color = '#bf0d0d';
  } else if (input === 'title' && e.value.length > 25) {
    e.value = previousValues[input];
    e.nextElementSibling.style.color = '#bf0d0d';
  } else if (input === 'password' && e.value.length < 6) {
    e.nextElementSibling.style.color = '#bf0d0d';
  }
  previousValues[input] = e.value;
}

window.onclick = (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
};

// textarea style logic
document.getElementById('message').addEventListener('input', (e) => {
  e.target.style.height = 'auto';
  e.target.style.height = `${e.target.scrollHeight - 12}px`;
});
