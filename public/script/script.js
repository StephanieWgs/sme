// Membuat koneksi ke WebSocket Server
const socket = new WebSocket(`ws://localhost:5000/`);

// Saat pesan baru diterima
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  showToast(data.message);
};

// Fungsi untuk tampilkan notifikasi toast
function showToast(message) {
  const toastContainer = document.getElementById("toastContainer");

  const toast = document.createElement("div");
  toast.className = "toast align-items-center text-white bg-success border-0 mb-2";
  toast.role = "alert";
  toast.ariaLive = "assertive";
  toast.ariaAtomic = "true";
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  toastContainer.appendChild(toast);

  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();

  // Hapus elemen setelah toast selesai
  toast.addEventListener('hidden.bs.toast', () => {
    toast.remove();
  });
}