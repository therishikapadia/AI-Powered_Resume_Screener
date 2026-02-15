document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("resumeForm");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        showProgressBar();
        
        try {
            const response = await fetch("/resumes/screen", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            document.getElementById("result").textContent = result.screening_result;
            showModal(result.screening_result);
        } catch (error) {
            console.error("Error submitting the form:", error);
            document.getElementById("result").textContent = "An error occurred while screening the resume.";
            showModal("An error occurred while screening the resume.");
        }
    });
});

function showProgressBar() {
    document.querySelector('.progress-container').style.display = 'block';
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        document.getElementById('progress-bar').style.width = `${progress}%`;
        if (progress === 100) {
            clearInterval(interval);
        }
    }, 100);
}

function showModal(message) {
    document.getElementById("modal-message").textContent = message;
    document.getElementById("modal").style.display = "block";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
