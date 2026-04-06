export function customAlert(message) {
  return new Promise((resolve) => {
    showModal("alert", message, "", resolve);
  });
}

export function customConfirm(message) {
  return new Promise((resolve) => {
    showModal("confirm", message, "", resolve);
  });
}

export function customPrompt(message, defaultValue = "") {
  return new Promise((resolve) => {
    showModal("prompt", message, defaultValue, resolve);
  });
}

const style = document.createElement("style");
style.textContent = `
  .custom-modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
    z-index: 10000; font-family: 'Poppins', sans-serif;
  }
  .custom-modal-box {
    background: linear-gradient(to bottom, #ffffff, #fff0f5);
    padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    text-align: center; max-width: 400px; width: 80%;
  }
  .custom-modal-msg {
    color: #E381B5; font-size: 18px; margin-bottom: 20px;
    white-space: pre-wrap;
  }
  .custom-modal-btn {
    background: #E381B5; color: white; border: none; padding: 10px 20px;
    border-radius: 12px; cursor: pointer; font-size: 14px; margin: 0 5px;
  }
  .custom-modal-btn.cancel {
    background: #ccc; color: #333;
  }
  .custom-modal-input {
    width: 90%; padding: 10px; margin-bottom: 20px; border-radius: 10px;
    border: 1px solid #E381B5; outline: none; font-family: 'Poppins', sans-serif;
  }
`;
document.head.appendChild(style);

function showModal(type, message, defaultValue, resolve) {
  const overlay = document.createElement("div");
  overlay.className = "custom-modal-overlay";

  const box = document.createElement("div");
  box.className = "custom-modal-box";

  const msg = document.createElement("div");
  msg.className = "custom-modal-msg";
  msg.innerText = message;
  box.appendChild(msg);

  let input;
  if (type === "prompt") {
    input = document.createElement("input");
    input.type = "text";
    input.value = defaultValue;
    input.className = "custom-modal-input";
    box.appendChild(input);
  }

  const btnContainer = document.createElement("div");

  if (type === "confirm" || type === "prompt") {
    const btnCancel = document.createElement("button");
    btnCancel.className = "custom-modal-btn cancel";
    btnCancel.innerText = "Cancel";
    btnCancel.onclick = () => { 
        document.body.removeChild(overlay); 
        resolve(type === "prompt" ? null : false); 
    };
    btnContainer.appendChild(btnCancel);
  }

  const btnOk = document.createElement("button");
  btnOk.className = "custom-modal-btn";
  btnOk.innerText = "OK";
  btnOk.onclick = () => { 
      document.body.removeChild(overlay); 
      resolve(type === "prompt" ? input.value : true); 
  };
  btnContainer.appendChild(btnOk);

  box.appendChild(btnContainer);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  if (type === "prompt" && input) {
    input.focus();
  }
}

// Ensure global access for scattered inline event handlers
window.customAlert = customAlert;
window.customConfirm = customConfirm;
window.customPrompt = customPrompt;
