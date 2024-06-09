const socket = io();
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const userName = document.getElementById('userName').value.trim();
  const email = document.getElementById('email').value.trim();
  const age = document.getElementById('age').value.trim();
  const gender = document.getElementById('gender').value.trim();
  const cpf = document.getElementById('cpf').value.trim();

  if (!userName || !email || !age || !gender || !cpf) {
    alert('Por favor, preencha todos os campos');
    return;
  }

  try {
    const response = await fetch('/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName, age, gender, cpf }),
    });

    if (response.status === 201) {
      window.location.href = `messenger.html?userName=${userName}`;
    } else {
      const errorMessage = await response.text();
      alert(`Erro: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Erro ao criar o usuário:', error);
    alert('Erro ao criar o usuário. Por favor, tente novamente.');
  }
  
});
