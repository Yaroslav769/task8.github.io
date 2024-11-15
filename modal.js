const formSubmitUrl = "https://formcarry.com/s/s5AE4tEX-Xr";

function openModalHistory() {
    window.history.pushState({ modalIsActive: true }, "", "#popup");
}

function closeModalHistory() {
    window.history.back();
}

function handleModalToggle() {
    let modalInstance = bootstrap.Modal.getInstance(
        document.getElementById("modalWindow")
    );

    if (window.location.hash.match(/^#popup$/)) {
        modalInstance.show();
    } else {
        modalInstance.hide();
    }
}

function processFormSubmission(event) {
    event.preventDefault();
    if (!document.querySelector("form").reportValidity()) {
        return;
    }

    let xhrRequest = new XMLHttpRequest();
    xhrRequest.open("POST", formSubmitUrl);
    xhrRequest.setRequestHeader("Content-Type", "application/json");
    xhrRequest.setRequestHeader("Accept", "application/json");

    let formData = {};
    let inputElements = document.querySelectorAll(".form-control:not(.form-label)");
    inputElements.forEach(function (input) {
        formData[input.name] = input.value;
    });

    xhrRequest.send(JSON.stringify(formData));
    xhrRequest.onreadystatechange = function () {
        if (this.readyState === 4) {
            let responseMessage = document.querySelector(".feedbackMessage");
            if (this.status === 200) {
                responseMessage.innerHTML = "Form submitted successfully!";
                inputElements.forEach(function (input) {
                    input.value = "";
                });
                window.localStorage.clear();
            } else {
                responseMessage.innerHTML = "An error occurred. Please try again.";
            }
            closeModalHistory();
        }
    };
}

function storeInputData(event) {
    window.localStorage.setItem(event.target.name, event.target.value);
}

window.addEventListener("DOMContentLoaded", function () {
    new bootstrap.Modal(document.getElementById("modalWindow"));
    handleModalToggle();

    document.getElementById("openModalButton")
        .addEventListener("click", openModalHistory);
    document.getElementById("closeModalButton")
        .addEventListener("click", closeModalHistory);

    window.addEventListener("popstate", handleModalToggle);
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && window.location.hash.match(/^#popup$/)) {
            closeModalHistory();
        }
    });

    document.querySelector("form").addEventListener("change", storeInputData);

    Object.keys(window.localStorage).forEach(function (key) {
        let inputElement = document.querySelector(`[name=${key}]`);
        if (inputElement) {
            inputElement.value = window.localStorage.getItem(key);
        }
    });

    document.querySelector("form").addEventListener("submit", processFormSubmission);
});
