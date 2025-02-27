const clearLocalStorageService = () => {
    window.addEventListener("beforeunload", () => {
        sessionStorage.setItem("lastClosed", Date.now()); // Simpan timestamp saat tab ditutup
    });

    window.addEventListener("load", () => {
        const lastClosed = sessionStorage.getItem("lastClosed");
        const now = Date.now();

        if (lastClosed && now - lastClosed > 1000) {
            // Jika jeda lebih dari 1 detik, berarti ini fresh start, bukan reload
            localStorage.clear();
        }
    });
};

export default clearLocalStorageService;
