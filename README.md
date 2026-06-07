# Selaria & Casa de Couro Santos — Site Vitrine

Site de catálogo/vitrine para a Selaria & Casa de Couro Santos,  
localizada em São José dos Campos/SP.

---

## 📁 Estrutura de arquivos

```
selaria-santos/
├── index.html              → Página principal (única página)
├── css/
│   └── style.css           → Todo o estilo (variáveis, responsivo, animações)
├── js/
│   └── main.js             → Interatividade (hamburguer, scroll, placeholders)
└── assets/
    └── images/
        ├── sela.jpg         ← Foto de selas
        ├── arreio.jpg       ← Foto de arreios
        ├── cinto.jpg        ← Foto de cintos
        ├── bolsa.jpg        ← Foto de bolsas e acessórios
        ├── conserto.jpg     ← Foto de consertos
        └── personalizado.jpg ← Foto de peças sob medida
```

> **Enquanto as fotos não chegarem:** as imagens são geradas automaticamente  
> via Canvas com placeholder colorido e o nome do produto. Funcionamento garantido.

---

## 🖼️ Sobre as fotos

- **Resolução ideal:** 1200×900px (proporção 4:3)
- **Formato:** JPG (qualidade 80–90%)
- **Dica:** fotos com boa luz natural ficam excelentes para couro

---

## 📱 WhatsApp

Todos os botões já têm textos pré-preenchidos específicos por produto.  
O número configurado é: **+55 (12) 98852-0409**

Para alterar o número, faça `Ctrl+H` (Find & Replace) no VS Code:
- Buscar: `5512988520409`
- Substituir pelo novo número com DDI+DDD

---

## 🌐 Hospedagem no Netlify (recomendado, grátis)

1. Acesse [netlify.com](https://www.netlify.com/) e crie uma conta gratuita
2. Arraste a pasta `selaria-santos/` para a área de deploy na dashboard
3. Pronto — Netlify gera uma URL como `https://selaria-santos.netlify.app`
4. Você pode configurar um domínio próprio depois (ex: `selariasantos.com.br`)

### Alternativa: Vercel
1. Acesse [vercel.com](https://vercel.com/) e conecte com GitHub
2. Faça upload ou aponte o repositório
3. Deploy automático

---

## ✏️ Manutenção fácil

### Alterar texto de qualquer produto
Abra `index.html` e procure pelo nome do produto (ex: `Selas`).  
O card tem: título, descrição e link do WhatsApp com texto pré-preenchido.

### Mudar horário de funcionamento
Procure por `07h às 18h` no `index.html` (aparece em 2 lugares).

### Adicionar nova categoria de produto
Copie um bloco `<article class="produto-card">` e ajuste o conteúdo.

### Alterar cores
Todas as cores estão em variáveis CSS no início do `style.css` (linha ~8).

---

## 📊 Analytics (quando quiser)

O `main.js` já tem comentários prontos para Google Analytics 4 e Meta Pixel.  
Procure por `gtag` e `fbq` no arquivo para ver onde descomentar.

---

## ✅ Checklist antes de publicar

- [ ] Fotos adicionadas em `assets/images/`
- [ ] Google Maps com endereço correto (verificar o iframe no index.html)
- [ ] Teste no celular (Chrome DevTools → modo responsivo)
- [ ] Teste os links do WhatsApp
- [ ] Verificar horários de funcionamento

---

Feito com carinho para a Márcia e a Selaria Santos 🐂✦
