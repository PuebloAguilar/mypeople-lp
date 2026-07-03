# MyPeople LP

Landing page estática para a waitlist do MyPeople.

## Estrutura

- `index.html`: página principal da landing page.
- `grupo.html`: página pós-cadastro com CTA para o grupo do WhatsApp e links úteis.
- `main.js`: fluxo do formulário, máscara simples de WhatsApp e redirecionamento para `grupo.html`.
- `styles.css`: estilos globais da landing e da página pós-cadastro.
- `assets/seedmypeople.mp4`: vídeo da primeira dobra da landing page.
- `tests/lp-form-flow.test.mjs`: testes estáticos do fluxo, links e principais regras de layout.

## Como abrir localmente

```bash
python3 -m http.server 8080
```

Depois acesse:

- `http://localhost:8080/index.html`
- `http://localhost:8080/grupo.html`

## Observações

- O projeto não conecta banco de dados nem endpoint externo.
- O formulário valida os campos no navegador e redireciona para `grupo.html`.
- O link real do grupo de WhatsApp deve ser adicionado depois em `grupo.html`, no atributo `href` do botão com `data-whatsapp-link`.
