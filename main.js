const waitlistForm = document.querySelector("[data-waitlist-form]");
const whatsappLink = document.querySelector("[data-whatsapp-link]");
const GROUP_PREVIEW_HASH = "#grupo";
const GROUP_PAGE_URL = "grupo.html";
const PHONE_FIELD_SELECTOR = "[data-phone-field]";
const PHONE_COUNTRY_SELECTOR = "[data-whatsapp-country]";
const PHONE_LOCAL_SELECTOR = "[data-whatsapp-local]";
const PHONE_FULL_SELECTOR = "[data-whatsapp-full]";

const phoneFields = document.querySelectorAll(PHONE_FIELD_SELECTOR);

const digitsOnly = (value) => value.replace(/\D/g, "");

const formatBrazilPhone = (digits) => {
  const limitedDigits = digits.slice(0, 11);
  const areaCode = limitedDigits.slice(0, 2);
  const localNumber = limitedDigits.slice(2);
  const firstPartSize = localNumber.length > 8 ? 5 : 4;
  const firstPart = localNumber.slice(0, firstPartSize);
  const secondPart = localNumber.slice(firstPartSize, firstPartSize + 4);

  if (limitedDigits.length <= 2) {
    return limitedDigits;
  }

  if (!secondPart) {
    return `(${areaCode}) ${firstPart}`;
  }

  return `(${areaCode}) ${firstPart}-${secondPart}`;
};

const formatUnitedStatesPhone = (digits) => {
  const limitedDigits = digits.slice(0, 10);
  const areaCode = limitedDigits.slice(0, 3);
  const firstPart = limitedDigits.slice(3, 6);
  const secondPart = limitedDigits.slice(6, 10);

  if (limitedDigits.length <= 3) {
    return limitedDigits;
  }

  if (limitedDigits.length <= 6) {
    return `(${areaCode}) ${firstPart}`;
  }

  return `(${areaCode}) ${firstPart}-${secondPart}`;
};

const formatGenericPhone = (digits) => digits.slice(0, 14).replace(/(\d{3})(?=\d)/g, "$1 ").trim();

const formatLocalNumber = (countryCode, digits) => {
  if (countryCode === "+55") {
    return formatBrazilPhone(digits);
  }

  if (countryCode === "+1") {
    return formatUnitedStatesPhone(digits);
  }

  return formatGenericPhone(digits);
};

const syncPhoneField = (phoneField) => {
  const countrySelect = phoneField.querySelector(PHONE_COUNTRY_SELECTOR);
  const localInput = phoneField.querySelector(PHONE_LOCAL_SELECTOR);
  const fullInput = phoneField.querySelector(PHONE_FULL_SELECTOR);

  if (!countrySelect || !localInput || !fullInput) {
    return;
  }

  const countryCode = countrySelect.value;
  const selectedCountry = countrySelect.selectedOptions?.[0];
  const localDigits = digitsOnly(localInput.value);

  fullInput.value = localDigits ? `${countryCode}${localDigits}` : "";

  if (selectedCountry?.dataset.placeholder) {
    localInput.placeholder = selectedCountry.dataset.placeholder;
  }
};

const formatPhoneField = (phoneField) => {
  const countrySelect = phoneField.querySelector(PHONE_COUNTRY_SELECTOR);
  const localInput = phoneField.querySelector(PHONE_LOCAL_SELECTOR);

  if (!countrySelect || !localInput) {
    return;
  }

  localInput.value = formatLocalNumber(countrySelect.value, digitsOnly(localInput.value));
  syncPhoneField(phoneField);
};

const syncPhoneFields = () => {
  phoneFields.forEach(syncPhoneField);
};

const redirectGroupPreviewFromUrl = () => {
  if (window.location.hash === GROUP_PREVIEW_HASH) {
    window.location.replace(GROUP_PAGE_URL);
  }
};

waitlistForm?.addEventListener("submit", (event) => {
  syncPhoneFields();

  if (!waitlistForm.checkValidity()) {
    return;
  }

  event.preventDefault();
  waitlistForm.reset();
  syncPhoneFields();

  window.location.assign(GROUP_PAGE_URL);
});

phoneFields.forEach((phoneField) => {
  const countrySelect = phoneField.querySelector(PHONE_COUNTRY_SELECTOR);
  const localInput = phoneField.querySelector(PHONE_LOCAL_SELECTOR);

  countrySelect?.addEventListener("change", () => {
    formatPhoneField(phoneField);
  });

  localInput?.addEventListener("input", () => {
    formatPhoneField(phoneField);
  });

  syncPhoneField(phoneField);
});

whatsappLink?.addEventListener("click", (event) => {
  if (whatsappLink.getAttribute("href") === "#") {
    event.preventDefault();
  }
});

redirectGroupPreviewFromUrl();
window.addEventListener("hashchange", redirectGroupPreviewFromUrl);
