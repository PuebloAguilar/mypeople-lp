import { existsSync, readFileSync, statSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const waitlistPages = ["index.html"];
const script = readFileSync(new URL("../main.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
const heroVideoPath = new URL("../assets/seedmypeople.mp4", import.meta.url);
const heroPosterPath = new URL("../assets/seedmypeople-poster.jpg", import.meta.url);

function cssRule(selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return styles.match(new RegExp(`${escapedSelector}\\s*{(?<body>[^}]*)}`))?.groups.body ?? "";
}

function cssRuleInMedia(mediaQuery, selector) {
  const escapedMedia = mediaQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return styles.match(new RegExp(`${escapedMedia}\\s*{[\\s\\S]*?${escapedSelector}\\s*{(?<body>[^}]*)}`))?.groups.body ?? "";
}

for (const page of waitlistPages) {
  test(`${page} sends valid waitlist submissions to the group page`, () => {
    const html = readFileSync(new URL(`../${page}`, import.meta.url), "utf8");

    assert.match(html, /data-waitlist-form/);
    assert.match(html, /styles\.css\?v=waitlist-terminal-/);
    assert.match(html, /waitlist-section--light/);
    assert.match(html, /waitlist-terminal-form/);
    assert.match(html, /waitlist-terminal-form--light/);
    assert.match(html, /waitlist-terminal-bar/);
    assert.match(html, /waitlist-form-grid/);
    assert.match(html, /data-phone-field/);
    assert.match(html, /data-whatsapp-country/);
    assert.match(html, /name="whatsapp_local"/);
    assert.match(html, /data-whatsapp-local/);
    assert.match(html, /name="whatsapp"/);
    assert.match(html, /data-whatsapp-full/);
    assert.match(html, /🇧🇷 \+55/);
    assert.match(html, /\(00\) 90000-0000/);
    assert.doesNotMatch(html, /data-whatsapp-prefix|Brasil \+55|waitlist-terminal-command|mypeople\.join --flow waitlist/);
    assert.doesNotMatch(html, /<input type="tel" name="whatsapp" autocomplete="tel" placeholder="\+55 11 99999-9999" required \/>/);
    assert.doesNotMatch(html, /waitlist-terminal-status/);
    assert.match(
      html,
      /<button class="button button--terminal-submit" type="submit">\s*Entrar na waitlist\s*<\/button>/,
    );
    assert.doesNotMatch(html, /Próximo passo|Entrar na waitlist e seguir para o WhatsApp|Próxima tela|Cadastrar e continuar/);
    assert.doesNotMatch(html, /name="sessions"/);
    assert.match(html, /main\.js\?v=group-page/);
    assert.doesNotMatch(html, /data-thank-you-modal|thank-you-card|modal-flow/);
    assert.doesNotMatch(html, /x\.com\/danedelattre|github\.com\/delattre1|twitch\.tv\/danedelattre|linkedin\.com\/in\/danedelattre/);
  });
}

test("main.js redirects direct and form entry to the group page", () => {
  assert.match(script, /GROUP_PAGE_URL = "grupo\.html"/);
  assert.match(script, /PHONE_FIELD_SELECTOR = "\[data-phone-field\]"/);
  assert.match(script, /syncPhoneField/);
  assert.match(script, /syncPhoneFields/);
  assert.match(script, /window\.location\.assign\(GROUP_PAGE_URL\)/);
  assert.match(script, /window\.location\.replace\(GROUP_PAGE_URL\)/);
  assert.match(script, /window\.location\.hash === GROUP_PREVIEW_HASH/);
});

test("index.html uses the local VSL video in the hero", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /styles\.css\?v=waitlist-terminal-20260703-9/);
  assert.match(html, /<video class="hero-video-player" controls playsinline preload="metadata" poster="assets\/seedmypeople-poster\.jpg">/);
  assert.match(html, /<source src="assets\/seedmypeople\.mp4" type="video\/mp4">/);
  assert.doesNotMatch(html, /Embed VTurb|Inserir player/);
  assert.match(styles, /\.hero-video-frame iframe,\s*\.hero-video-frame video\s*{/);
  assert.ok(existsSync(heroVideoPath));
  assert.ok(existsSync(heroPosterPath));
  assert.ok(statSync(heroVideoPath).size > 1_000_000);
});

test("legacy vsl-top route redirects to the canonical landing page", () => {
  const html = readFileSync(new URL("../vsl-top.html", import.meta.url), "utf8");

  assert.match(html, /<meta http-equiv="refresh" content="0; url=index\.html">/);
  assert.match(html, /window\.location\.replace\("index\.html"\)/);
  assert.doesNotMatch(html, /Embed VTurb|Inserir player|data-waitlist-form/);
});

test("waitlist form uses a calm light background and single-column fields", () => {
  assert.match(styles, /\.waitlist-section\s*{[\s\S]*var\(--oat\)/);
  assert.match(styles, /\.waitlist-form-grid\s*{[\s\S]*grid-template-columns:\s*1fr;/);
  assert.doesNotMatch(styles, /\.waitlist-form-grid\s*{[^}]*repeat\(2,/);
});

test("waitlist terminal submit CTA is centered", () => {
  const submitRule = cssRule(".button--terminal-submit");

  assert.match(submitRule, /justify-content:\s*center;/);
  assert.match(submitRule, /text-align:\s*center;/);
});

test("mobile waitlist copy is centered before the form", () => {
  const copyRule = cssRuleInMedia("@media (max-width: 620px)", ".waitlist-copy");

  assert.match(copyRule, /justify-self:\s*center;/);
  assert.match(copyRule, /text-align:\s*center;/);
  assert.match(
    styles,
    /@media \(max-width: 620px\)[\s\S]*\.waitlist-copy p\s*{[\s\S]*margin-right:\s*auto;[\s\S]*margin-left:\s*auto;/,
  );
});

test("LP pages include an invisible Plow PBC signature at the end", () => {
  for (const page of waitlistPages) {
    const html = readFileSync(new URL(`../${page}`, import.meta.url), "utf8");

    assert.match(html, /<p class="page-signature" aria-hidden="true">plow pbc - 2026 &lt;<\/p>\s*<\/body>/);
  }

  const signatureRule = cssRule(".page-signature");
  assert.match(signatureRule, /position:\s*absolute;/);
  assert.match(signatureRule, /width:\s*1px;/);
  assert.match(signatureRule, /height:\s*1px;/);
  assert.match(signatureRule, /opacity:\s*0;/);
});

test("phone field has country picker layout", () => {
  const phoneInputRule = cssRule(".phone-input");
  const phoneCountryRule = cssRule(".phone-country-select");
  const phoneLocalRule = cssRule(".phone-local-input");

  assert.match(phoneInputRule, /grid-template-columns:\s*84px minmax\(0, 1fr\);/);
  assert.match(phoneInputRule, /background:\s*var\(--chalk\);/);
  assert.match(phoneCountryRule, /font-family:\s*var\(--mono\);/);
  assert.match(phoneLocalRule, /border:\s*0;/);
});

test("how it works heading is centered on the page", () => {
  const headingRule = cssRule(".flow-section--tour .flow-heading");
  const eyebrowRule = cssRule(".flow-section--tour .flow-heading p");

  assert.match(headingRule, /max-width:\s*840px;/);
  assert.match(headingRule, /text-align:\s*center;/);
  assert.match(eyebrowRule, /margin-right:\s*auto;/);
  assert.match(eyebrowRule, /margin-left:\s*auto;/);
});

test("group terminal centers the copy and WhatsApp action", () => {
  assert.match(styles, /\.plow-terminal-body\s*{[\s\S]*justify-items:\s*center;[\s\S]*text-align:\s*center;/);
  assert.match(styles, /\.plow-terminal-copy\s*{[\s\S]*margin:\s*0 auto;/);
  assert.match(styles, /\.plow-terminal-actions\s*{[\s\S]*grid-template-columns:\s*1fr;[\s\S]*gap:\s*22px;[\s\S]*justify-items:\s*center;/);
  assert.match(styles, /\.plow-terminal-whatsapp\s*{[\s\S]*width:\s*min\(100%, 420px\);[\s\S]*justify-content:\s*center;/);
  assert.match(styles, /\.plow-terminal-links a\s*{[\s\S]*display:\s*inline-flex;[\s\S]*align-items:\s*center;[\s\S]*gap:\s*8px;/);
  assert.match(styles, /\.social-link-icon\s*{[\s\S]*width:\s*24px;[\s\S]*height:\s*24px;/);
});

test("grupo.html is a Plow branded post-waitlist page", () => {
  const html = readFileSync(new URL("../grupo.html", import.meta.url), "utf8");

  assert.match(html, /body class="page-group"/);
  assert.match(html, /styles\.css\?v=terminal-/);
  assert.match(html, /whatsapp-conversion-page/);
  assert.match(html, /plow-terminal-stage/);
  assert.match(html, /plow-terminal-window/);
  assert.match(html, /plow-terminal-bar/);
  assert.doesNotMatch(html, /plow-terminal-line|plow-terminal-command/);
  assert.doesNotMatch(html, /plow-terminal-status/);
  assert.doesNotMatch(html, /<strong>ok<\/strong>|<span>grupo<\/span>|<strong>pendente<\/strong>|<span>canal<\/span>/);
  assert.doesNotMatch(html, /waitlist\.confirm --channel whatsapp|inscrição recebida|ação necessária/);
  assert.match(html, /plow-terminal-actions/);
  assert.match(html, /plow-terminal-links/);
  assert.match(html, /plow \/ terminal/);
  assert.match(html, /Entre no grupo para confirmar sua inscrição/);
  assert.match(html, /Entrar no grupo no WhatsApp/);
  assert.match(html, /Outros links úteis:/);
  assert.doesNotMatch(html, /O link real será adicionado aqui assim que o grupo estiver pronto/);
  assert.equal(html.match(/data-whatsapp-link/g)?.length, 1);
  assert.equal(html.match(/class="social-link-icon"/g)?.length, 3);
  assert.match(html, /aria-label="Instagram"/);
  assert.match(html, /aria-label="YouTube"/);
  assert.match(html, /aria-label="Plow\.co"/);
  assert.match(html, /https:\/\/www\.instagram\.com\/danedelattre\//);
  assert.match(html, /https:\/\/www\.youtube\.com\/@danedelattre/);
  assert.match(html, /https:\/\/plow\.co/);
  assert.doesNotMatch(html, /x\.com\/danedelattre|github\.com\/delattre1|twitch\.tv\/danedelattre|linkedin\.com\/in\/danedelattre/);
});
