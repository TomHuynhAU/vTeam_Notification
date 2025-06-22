let notificationDuration = 5000; // 5 giây mặc định

function showNotification(type, title, message, buttons = []) {
  const notif = document.createElement("div");
  notif.className = `notification ${type}`;

  const buttonGroup = document.createElement("div");
  buttonGroup.className = "button-group";

  buttons.forEach((btn) => {
    const b = document.createElement("button");
    b.className = "notif-btn";
    b.textContent = btn.label;

    // ✅ Nếu có màu, gán trực tiếp
    if (btn.color) {
      b.style.backgroundColor = btn.color;
      b.style.color = "#fff"; // trắng cho text
      b.style.border = "none";
    }

    b.onclick = () => SelectedPrimaryButton(btn.id, btn.data, notif);
    buttonGroup.appendChild(b);
  });

  notif.innerHTML = `
  <div class="icon">${getIcon(type)}</div>
  <div class="text">
    <strong>${title}</strong>
    <span>${message}</span>
  </div>
  <div class="progress-bar" style="animation-duration: ${
    (window.currentNotificationDuration || 5000) / 1000
  }s;"></div>
  <button class="close-btn">×</button>
`;

  notif.querySelector(".close-btn").addEventListener("click", () => {
    notif.remove();

    // ✅ Tắt chuột/focus khi đóng bằng nút ×
    fetch("https://tom_notif/focus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ state: false }),
    });
  });

  notif.querySelector(".text").appendChild(buttonGroup);

  document.getElementById("notifications").appendChild(notif);

  setTimeout(() => {
    notif.remove();

    // ✅ Gửi yêu cầu tắt NUI focus (ẩn chuột)
    fetch("https://tom_notif/focus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ state: false }),
    });
  }, window.currentNotificationDuration || 5000);
}

function getIcon(type) {
  if (type === "information")
    return `<img src="icons/info.svg" class="svg-info" />`;
  if (type === "success")
    return `<img src="icons/check.svg" class="svg-success" />`;
  if (type === "error")
    return `<img src="icons/warning.svg" class="svg-error" />`;
  if (type === "lspd")
    return `<img src="icons/lspd.png" class="custom-icon" />`;
  if (type === "lsfd")
    return `<img src="icons/lsfd.png" class="custom-icon" />`;
  if (type === "gtas")
    return `<img src="icons/gtas.png" class="custom-icon" />`;
}

function testNotif(type) {
  if (type === "information") {
    showNotification(type, "Thông Tin", "T0m đẹp trai nhất hệ mặt trời.");
  } else if (type === "success") {
    showNotification(type, "Thành Công", "Bạn đã bị lừa thành công.");
  } else if (type === "error") {
    showNotification(type, "Cảnh Báo", "Ban chết con mẹ mày giờ chứ nhìn.");
  }
}

function setNotificationPosition(position) {
  const container = document.getElementById("notifications");
  const positions = [
    "top-left",
    "top-center",
    "top-right",
    "bottom-right",
    "bottom-center",
  ];

  positions.forEach((pos) => container.classList.remove(pos)); // Xóa tất cả
  container.classList.add(position); // Gán vị trí được chọn
}

function updateNotificationDuration() {
  const seconds = parseInt(document.getElementById("duration").value, 10);
  notificationDuration = isNaN(seconds) ? 5000 : seconds * 1000;
}

// Giữ Alt → hiện chuột toàn bộ notification
document.addEventListener("keydown", (e) => {
  if (e.altKey) {
    document.querySelectorAll(".notification").forEach((n) => {
      n.classList.add("alt-hover");
    });
  }
});

document.addEventListener("keyup", (e) => {
  if (!e.altKey) {
    document.querySelectorAll(".notification").forEach((n) => {
      n.classList.remove("alt-hover");
    });
  }
});

function testNotif(type) {
  if (type === "success") {
    showNotification(
      "information",
      "Thử Lòng Member",
      "Bạn muốn địt mẹ lũ Nova không ?",
      [
        {
          label: "Chan đê",
          id: "confirm",
          data: "proceed",
          color: "#27ae60", // xanh lá
        },
        {
          label: "Chơi",
          id: "cancel",
          data: "cancel",
          color: "#e74c3c", // đỏ
        },
      ]
    );
  } else {
    showNotification(
      type,
      "Information",
      "This is a basic message without buttons."
    );
  }
}

function SelectedPrimaryButton(buttonid, data, notif) {
  if (data.startsWith("https://")) {
    window.open(data, "_blank");
  } else {
    fetch("https://tom_notif/interaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buttonid, data }),
    });
  }

  if (notif) {
    notif.remove();

    // ✅ Tắt chuột luôn
    fetch("https://tom_notif/focus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: false }),
    });
  }
}

window.addEventListener("message", function (event) {
  const data = event.data;
  if (data.action === "showNotification") {
    const audio = new Audio("sound.mp3");
    audio.volume = 1.0; // Tăng âm lượng nếu muốn
    audio.play();

    window.currentNotificationDuration = (data.duration || 5) * 1000;
    showNotification(data.type, data.title, data.message, data.buttons);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "F4") {
    document.querySelectorAll(".notification").forEach((n) => n.remove());

    // Tắt luôn chuột/focus
    fetch("https://tom_notif/focus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: false }),
    });
  }
});

function updateThemeMode() {
  const theme = document.getElementById("theme").value;
  document.body.dataset.theme = theme;
}
