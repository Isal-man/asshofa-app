const clearLocalStorageService = () => {
    window.addEventListener("beforeunload", () => {
        localStorage.clear();
    });
};

export default clearLocalStorageService;