document.addEventListener('DOMContentLoaded', function () {
  // 1. Inisialisasi Elemen DOM
  const identitySection = document.getElementById('identitySection');
  const identityForm = document.getElementById('identityForm');
  const quizForm = document.getElementById('quizForm');
  const resultBox = document.getElementById('result');
  const quizHeader = document.getElementById('quizHeader');
  const timerDisplay = document.getElementById('timerDisplay');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');

  let candidateData = {};
  let timerInterval = null;
  const TOTAL_QUESTIONS = 90;
  const TOTAL_TIME_SECONDS = 30 * 60; // 30 Menit
  let timeRemaining = TOTAL_TIME_SECONDS;

  // STEP 1: Submit Form Data Diri
  if (identityForm) {
    identityForm.addEventListener('submit', function (event) {
      event.preventDefault();

      candidateData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        gender: document.getElementById('gender').value,
        position: document.getElementById('position').value.trim()
      };

      // Sembunyikan Panduan Pengerjaan, Section Data Diri, & Hero Header
      const instructionsCard = document.getElementById('instructionsCard');
      if (instructionsCard) instructionsCard.classList.add('hidden');

      if (identitySection) identitySection.classList.add('hidden');
      const heroSection = document.getElementById('heroSection');
      if (heroSection) heroSection.classList.add('hidden');

      // Tampilkan Header Timer/Progress & Form Soal Psikotes
      if (quizHeader) quizHeader.classList.remove('hidden');
      if (quizForm) quizForm.classList.remove('hidden');

      window.scrollTo({ top: 0, behavior: 'smooth' });

      startTimer();
      initProgressTracker();
    });
  }

  // TIMER & PROGRESS
  function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(function () {
      timeRemaining--;
      updateTimerDisplay();

      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        alert("Waktu pengerjaan (30 menit) telah habis. Jawaban Anda akan otomatis dikirim.");
        processQuizSubmission(true);
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    if (!timerDisplay) return;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    if (timeRemaining <= 300 && quizHeader) {
      quizHeader.classList.add('warning');
    }
  }

  function initProgressTracker() {
    if (!quizForm) return;
    quizForm.addEventListener('change', function () {
      const answeredQuestions = quizForm.querySelectorAll('.question-card input[type="radio"]:checked').length;
      const percentage = Math.round((answeredQuestions / TOTAL_QUESTIONS) * 100);

      if (progressBar) progressBar.style.width = `${percentage}%`;
      if (progressText) progressText.textContent = `${answeredQuestions} / ${TOTAL_QUESTIONS} Soal (${percentage}%)`;
    });
  }

  // STEP 2: Submit Form Soal
  if (quizForm) {
    quizForm.addEventListener('submit', function (event) {
      event.preventDefault();
      clearInterval(timerInterval);
      processQuizSubmission(false);
    });
  }

  // STEP 3: Kalkulasi Skor & Render Hasil
  function processQuizSubmission(isTimeOut) {
    const papiScores = {
      G: 0, L: 0, I: 0, T: 0, V: 0, S: 0, R: 0, D: 0, C: 0, E: 0,
      N: 0, A: 0, P: 0, X: 0, B: 0, O: 0, Z: 0, K: 0, F: 0, W: 0
    };

    const questions = quizForm.querySelectorAll('.question-card');
    let answeredCount = 0;

    if (isTimeOut) {
      const radioInputs = quizForm.querySelectorAll('input[type="radio"]');
      radioInputs.forEach(input => input.removeAttribute('required'));
    }

    questions.forEach((question, index) => {
      const selected = question.querySelector('input:checked');
      if (selected) {
        answeredCount++;
        const val = Number(selected.value);
        const qNum = index + 1;

        if (val >= 4) {
          if (qNum % 10 === 1) papiScores.G++;
          else if (qNum % 10 === 2) papiScores.L++;
          else if (qNum % 10 === 3) papiScores.I++;
          else if (qNum % 10 === 4) papiScores.T++;
          else if (qNum % 10 === 5) papiScores.V++;
          else if (qNum % 10 === 6) papiScores.S++;
          else if (qNum % 10 === 7) papiScores.R++;
          else if (qNum % 10 === 8) papiScores.D++;
          else if (qNum % 10 === 9) papiScores.C++;
          else papiScores.E++;
        } else if (val <= 2) {
          if (qNum % 10 === 1) papiScores.N++;
          else if (qNum % 10 === 2) papiScores.A++;
          else if (qNum % 10 === 3) papiScores.P++;
          else if (qNum % 10 === 4) papiScores.X++;
          else if (qNum % 10 === 5) papiScores.B++;
          else if (qNum % 10 === 6) papiScores.O++;
          else if (qNum % 10 === 7) papiScores.Z++;
          else if (qNum % 10 === 8) papiScores.K++;
          else if (qNum % 10 === 9) papiScores.F++;
          else papiScores.W++;
        }
      }
    });

    const totalRole = papiScores.G + papiScores.L + papiScores.I + papiScores.T + papiScores.V +
                      papiScores.S + papiScores.R + papiScores.D + papiScores.C + papiScores.E;

    const totalNeed = papiScores.N + papiScores.A + papiScores.P + papiScores.X + papiScores.B +
                      papiScores.O + papiScores.Z + papiScores.K + papiScores.F + papiScores.W;

    const grandTotal = totalRole + totalNeed;

    // Sembunyikan Form Soal & Header Timer
    if (quizHeader) quizHeader.classList.add('hidden');
    if (quizForm) quizForm.classList.add('hidden');

    // Paksa elemen result tampil
    if (resultBox) {
      resultBox.classList.remove('hidden');
      resultBox.setAttribute('style', 'display: block !important;');

      resultBox.innerHTML = `
        <!-- BANNER UCAPAN TERIMA KASIH -->
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:24px; margin-bottom:24px;">
          <h2 style="margin:0 0 8px; color:#166534; font-size:1.4rem;">🎉 Tes Asesmen Selesai!</h2>
          <p style="margin:0 0 16px; color:#15803d; font-size:1rem;">Terima kasih telah menyelesaikan Asesmen Kepribadian PAPI Kostick.</p>
          <div style="background:#ffffff; border:1px solid #dcfce7; border-radius:8px; padding:16px; color:#166534;">
            <p style="margin:0 0 8px; font-weight:bold; color:#14532d;">Informasi Penting untuk Peserta:</p>
            <ul style="margin:0; padding-left:20px; display:flex; flex-direction:column; gap:6px;">
              <li>Jawaban dan hasil tes Anda telah berhasil terekam dalam sistem rekrutmen kami.</li>
              <li>Tim HRD / Talent Acquisition akan meninjau profil kepribadian ini bersama dengan berkas pendaftaran Anda.</li>
              <li>Pengumuman tahap seleksi selanjutnya akan disampaikan via <strong>Email</strong> atau <strong>WhatsApp</strong> resmi kami.</li>
            </ul>
          </div>
        </div>

        ${isTimeOut ? '<div style="color:#b91c1c; font-weight:600; background:#fee2e2; border:1px solid #fca5a5; padding:12px 16px; border-radius:8px; margin-bottom:20px;">⚠️ Waktu pengerjaan (30 menit) telah habis. Hasil di bawah dihitung berdasarkan jawaban yang berhasil tersubmit.</div>' : ''}

        <!-- DATA PESERTA -->
        <div style="background:#fff; border:1px solid #e2e8f0; padding:20px; border-radius:12px; margin-bottom:20px;">
          <h3 style="margin-top:0; color:#0f172a; font-size:1.1rem; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">Data Peserta</h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:8px 16px; margin-top:12px;">
            <p style="margin:0;"><strong>Nama Lengkap:</strong> ${candidateData.
