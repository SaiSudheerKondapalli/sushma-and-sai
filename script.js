const RSVP_ENDPOINT = "https://sushma-and-sai.saisudheerkondapally.chatgpt.site/api/rsvp";
const weddingTime = new Date("2026-11-04T17:00:00-06:00").getTime();

function updateCountdown() {
  const remaining = Math.max(0, weddingTime - Date.now());
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining / 3600000) % 24);
  const minutes = Math.floor((remaining / 60000) % 60);
  document.getElementById("count-days").textContent = String(days).padStart(2, "0");
  document.getElementById("count-hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("count-minutes").textContent = String(minutes).padStart(2, "0");
}

updateCountdown();
window.setInterval(updateCountdown, 60000);

const form = document.getElementById("rsvp-form");
const successCard = document.getElementById("success-card");
const submitButton = document.getElementById("submit-button");
const errorMessage = document.getElementById("form-error");
const attendeeNames = document.getElementById("attendeeNames");
const eventCheckboxes = [...document.querySelectorAll('input[name="attendingEvents"]')];

function updateAttendeeRequirement() {
  attendeeNames.required = eventCheckboxes.some((checkbox) => checkbox.checked);
}

eventCheckboxes.forEach((checkbox) => checkbox.addEventListener("change", updateAttendeeRequirement));

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.hidden = true;
  submitButton.disabled = true;
  submitButton.textContent = "Saving your RSVP…";

  const data = new FormData(form);
  const payload = {
    guestName: data.get("guestName"),
    attendeeNames: data.get("attendeeNames"),
    contact: data.get("contact"),
    attendingEvents: data.getAll("attendingEvents"),
    adults: Number(data.get("adults") || 0),
    children: Number(data.get("children") || 0),
    dietaryRestrictions: data.get("dietaryRestrictions"),
    message: data.get("message"),
  };

  try {
    const response = await fetch(RSVP_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "We could not save your RSVP.");
    form.hidden = true;
    successCard.hidden = false;
    document.getElementById("rsvp").scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    errorMessage.textContent = error instanceof Error ? error.message : "Please try again.";
    errorMessage.hidden = false;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send RSVP ♥";
  }
});

document.getElementById("another-response").addEventListener("click", () => {
  successCard.hidden = true;
  form.hidden = false;
  form.reset();
  eventCheckboxes.forEach((checkbox) => { checkbox.checked = true; });
  updateAttendeeRequirement();
});
