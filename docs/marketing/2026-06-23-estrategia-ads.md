# Estratégia de Anúncios — Selaria & Casa de Couro Santos

**Data:** 2026-06-23 · **Objetivo único:** gerar conversas no WhatsApp da Márcia.
**Mercado:** São José dos Campos/SP e região (raio ~30 km). Negócio local, artesanal, ticket médio-alto.

> Toda a verba deve empurrar para **uma única ação: chamar no WhatsApp**. Nada de "curtir página" ou "ver site" como objetivo.

---

## 1. Onde anunciar (e por quê)

| Canal | Papel | Prioridade |
|---|---|---|
| **Meta (Instagram + Facebook)** | Descoberta visual. Couro vende pelo olho. Segmentação por interesse + geografia. | 🥇 Principal |
| **Google (Pesquisa)** | Alta intenção: "conserto de sela", "cinto de couro sob medida são josé". Pega quem já quer comprar. | 🥈 Forte |
| **Google Perfil da Empresa (Maps)** | Grátis e essencial. Otimizar antes de gastar em ads. | 🥉 Base (gratuito) |

**Ordem de execução recomendada:**
1. Otimizar o **Perfil da Empresa no Google** (fotos, horário, produtos, posts) — grátis, alto retorno.
2. **Meta** com 1 campanha de mensagens (objetivo "Conversas").
3. **Google Pesquisa** com 1 campanha de poucas palavras de alta intenção.

---

## 2. Públicos (Meta)

- **Geo:** São José dos Campos + cidades vizinhas (Jacareí, Caçapava, Taubaté) — raio 25–30 km.
- **Idade:** 25–60.
- **Interesses por linha de produto:**
  - *Equestre* (selas/arreios): hipismo, cavalos, vaquejada, rodeio, cavalgada, agronegócio.
  - *Moda/presente* (cintos/bolsas/sob medida): artesanato, couro, moda masculina, presentes personalizados.
  - *Conserto*: público amplo local (sem interesse específico — a dor é universal).
- **Vantagem competitiva:** públicos pequenos. Não pulverizar verba — começar amplo localmente e deixar o algoritmo otimizar por "conversa iniciada".

---

## 3. Três ângulos de criativo (campanhas)

### Ângulo A — Conserto & Restauração  → `lp-campanha.html`
- **Dor:** "Sua sela/cinto/bolsa de couro estragou? Tem conserto."
- **Por que converte:** intenção alta, baixa fricção ("manda a foto"), pouca concorrência boa.
- **Copy de anúncio (primária):**
  > Aquela peça de couro que você ama tem conserto. 🧵
  > Costura solta, couro ressecado, fivela quebrada — a Márcia avalia pela foto.
  > Manda no WhatsApp e descubra se vale a pena. Em São José dos Campos.
- **Título:** "Conserto de couro feito à mão" · **CTA:** Enviar mensagem.

### Ângulo B — Sob medida / Presente
- **Desejo:** "Um presente de couro com o nome de quem você ama."
- **Copy:**
  > Cinto, carteira ou bolsa de couro legítimo — com o nome gravado. 🎁
  > Feito à mão, do seu jeito, por quem entende de couro de verdade.
  > Fale com a Márcia no WhatsApp e monte o seu.
- **Título:** "Peça de couro sob medida" · **CTA:** Enviar mensagem.

### Ângulo C — Equestre (selas & arreios)
- **Nicho:** vaqueiros, cavaleiros, haras.
- **Copy:**
  > Sela e arreio em couro legítimo, feitos à mão pra aguentar o trabalho no campo. 🐎
  > Conjunto completo ou sob medida. Atendimento direto com quem faz.
  > Chama no WhatsApp.
- **Título:** "Selaria artesanal · São José dos Campos" · **CTA:** Enviar mensagem.

**Formato dos criativos:** foto real do produto/oficina (quando houver) em 1:1 e 4:5. Vídeo curto de 10–15s mostrando a peça sendo trabalhada converte ainda mais. Enquanto não houver foto real, **não rodar Meta** com as imagens atuais (geradas por IA) — priorizar Google Pesquisa, que não depende de imagem.

---

## 4. Verba e estrutura (sugestão de início)

- **Teste inicial:** R$ 15–25/dia por campanha, 1 campanha por vez, 7–10 dias.
- **Meta:** objetivo "Conversas" (clique-para-WhatsApp), 1 conjunto de anúncios, 2–3 criativos.
- **Google:** orçamento baixo, 1 grupo, correspondência de frase, ~10 palavras-chave de alta intenção. Usar extensões de chamada e local.
- Pausar o que não gera conversa em 5–7 dias; escalar o que gera.

---

## 5. Mensuração (sem complicar)

- **KPI único:** nº de conversas iniciadas no WhatsApp / custo por conversa.
- **Rastreio da origem:** cada anúncio aponta para um **link de WhatsApp com texto pré-preenchido diferente**, pra Márcia saber de onde veio:
  - Conserto: `...text=Olá Márcia! Vim pelo anúncio de CONSERTO...`
  - Presente: `...text=Olá Márcia! Vim pelo anúncio de PRESENTE/SOB MEDIDA...`
  - Equestre: `...text=Olá Márcia! Vim pelo anúncio de SELA/ARREIO...`
  - Site: `...text=Olá Márcia! Vim pelo site...`
- **Google Pesquisa → landing:** usar `lp-campanha.html?utm_source=google&utm_campaign=conserto` (a LP já tem campo pra você ver os UTMs no GA quando instalar).
- **Instalar:** Google Analytics 4 + Meta Pixel quando começar a investir (deixar o `<head>` preparado — ver Onda 5/observações).

---

## 6. Página de destino por campanha

| Campanha | Destino | Motivo |
|---|---|---|
| Conserto (A) | `lp-campanha.html` | LP única, foco total no conserto, sem distração de menu |
| Presente / Sob medida (B) | `index.html#precos` ou nova LP futura | Mostra variedade + faixas de preço |
| Equestre (C) | `catalogo.html?c=selas` | Já cai direto na categoria certa |

A LP de campanha (`lp-campanha.html`) **não tem menu de navegação** de propósito: em tráfego pago, cada link extra é uma fuga. Um caminho só → WhatsApp.

---

## 7. Checklist antes de investir 1 real

- [ ] Perfil da Empresa no Google completo e com fotos reais
- [ ] Fotos/vídeos reais dos produtos e da oficina (decisivo para Meta)
- [ ] Domínio próprio publicado (trocar placeholders do site)
- [ ] GA4 + Meta Pixel instalados
- [ ] WhatsApp Business com mensagem de saudação e respostas rápidas
- [ ] Faixas de preço reais preenchidas no site
