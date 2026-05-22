// ============================================
// FAMILY MESSAGE GENERATOR - BAGIAN 3 (JS)
// ============================================

// Array of heart emojis for floating animation
const hearts = ['❤️', '💖', '💕', '💗', '💓', '💞', '💘', '💝', '💟'];

// ============================================
// FLOATING HEARTS BACKGROUND ANIMATION
// ============================================

function createHeart() {
  const el = document.createElement('div');
  el.className = 'heart-float';
  el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  
  // Random positioning
  el.style.left = Math.random() * 100 + '%';
  
  // Random animation duration (4-8 seconds)
  el.style.animationDuration = (Math.random() * 4 + 4) + 's';
  
  // Random font size (15-30px)
  el.style.fontSize = (Math.random() * 15 + 15) + 'px';
  
  // Add slight delay for randomness
  el.style.animationDelay = (Math.random() * 2) + 's';
  
  document.getElementById('heartsContainer').appendChild(el);
  
  // Remove after animation completes
  setTimeout(() => el.remove(), 8000);
}

// Generate floating hearts every 400ms
setInterval(createHeart, 400);

// Generate initial batch of hearts
for(let i = 0; i < 8; i++) {
  setTimeout(createHeart, i * 500);
}

// ============================================
// AI MESSAGE GENERATION (OPENAI API)
// ============================================

async function generateMsg(familyMember, btnElement) {
  // Get API Key from input
  const apiKey = document.getElementById('apiKey').value.trim();
  
  // Get message box element
  const msgBox = document.getElementById('messageBox');
  
  // Validate API Key
  if (!apiKey) {
    msgBox.innerHTML = '⚠️ <strong>Mohon masukkan API Key dulu ya!</strong><br><br>' +
                      'API Key diperlukan untuk生成 pesan otomatis dari AI.<br>' +
                      'Dapatkan API Key gratis di: <a href="https://platform.openai.com" target="_blank">platform.openai.com</a>';
    msgBox.className = 'message-box error';
    return;
  }
  
  // Show loading state
  msgBox.className = 'message-box loading';
  msgBox.innerHTML = '⏳ AI sedang membuat pesan menyentuh untuk <strong>' + familyMember + '</strong>...<br><br>✨ Mohon tunggu sebentar ya!';
  
  try {
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: 'Buat pesan menyentuh hati yang sangat emosional untuk ' + familyMember + ' dalam bahasa Indonesia yang sangat informal, hangat dan penuh cinta. ' +
                   'Pakai banyak emoji yang sesuai. ' +
                   'Buat sekitar 4-5 paragraf yang bisa membuat ' + familyMember + ' menangis bahagia dan merasa sangat disayang. ' +
                   'Contoh: ungkapkan rasa syukur, minta maaf jika pernah menyakiti, dan katakan betapa pentingnya dia dalam hidupmu.'
        }],
        max_tokens: 600,
        temperature: 0.9,
        top_p: 0.9
      })
    });
    
    // Parse response
    const data = await response.json();
    
    // Check for errors
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    // Display success message
    msgBox.className = 'message-box success';
    msgBox.innerHTML = data.choices[0].message.content;
    
  } catch (err) {
    // Display error message
    msgBox.className = 'message-box error';
    msgBox.innerHTML = '❌ <strong>Terjadi Error!</strong><br><br>' +
                      'Pesan error: ' + err.message + '<br><br>' +
                      '💡 Tips: Pastikan API Key benar dan masih berlaku!';
  }
}

// ============================================
// AUTO-SAVE API KEY TO LOCALSTORAGE
// ============================================

// Save API key when input changes
document.getElementById('apiKey').addEventListener('change', function() {
  localStorage.setItem('family_msg_api_key', this.value);
});

// Load saved API key on page load
window.addEventListener('load', function() {
  const savedKey = localStorage.getItem('family_msg_api_key');
  if (savedKey) {
    document.getElementById('apiKey').value = savedKey;
  }
});

// ============================================
// ADDITIONAL EFFECTS
// ============================================

// Add click sound effect (optional)
// document.querySelectorAll('.fam-btn').forEach(btn => {
//   btn.addEventListener('click', function() {
//     // Play click sound if needed
//   });
// });

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Press 1-8 to click family buttons
  if (e.key >= '1' && e.key <= '8') {
    const buttons = document.querySelectorAll('.fam-btn');
    const index = parseInt(e.key) - 1;
    if (buttons[index]) {
      buttons[index].click();
    }
  }
});

console.log('❤️ Family Message Generator Loaded!');
console.log('💡 Tekan angka 1-8 untuk quick generate pesan!');
