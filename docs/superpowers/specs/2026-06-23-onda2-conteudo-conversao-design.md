# Onda 2 — Conteúdo & Conversão (Design)

**Projeto:** Selaria & Casa de Couro Santos — landing page
**Data:** 2026-06-23
**Escopo:** Reestruturar `index.html` em funil de conversão (Abordagem A) e reescrever toda a copy. Conversão 100% via WhatsApp.

## Restrições do cliente (confirmadas)

1. **Não citar número de anos** de tradição em nenhum lugar.
2. **Sem depoimentos/avaliações/Instagram reais ainda** → seções de prova social entram com placeholders claramente marcados, prontos para preencher.
3. **Faixas de preço visíveis** no formato `a partir de R$ ___` → valores são placeholders marcados com `<!-- AJUSTAR PREÇO -->` para o cliente preencher.
4. Stack permanece HTML/CSS/JS vanilla, sem build. Estilos novos vão para `css/style.css` (não inline).

## Princípios de copy

- Tom: artesanal, pessoal, direto — "fala com quem faz". Português correto e caloroso, sem jargão de marketing.
- CTAs: verbo + baixa fricção ("Manda um oi no WhatsApp", "Pedir meu orçamento", "Tirar uma dúvida"). Nunca "Enviar".
- Diferenciais concretos e sensoriais, não afirmações vagas.
- Sem inventar fatos (anos, número de clientes, prêmios).

---

## Nova ordem da página (12 seções)

### 1. Hero (reescrever copy)
- Eyebrow: `Artesanato em couro · São José dos Campos`
- H1: **"Couro de verdade, feito à mão para durar a vida toda."**
- Sub: "Selas, arreios, cintos, bolsas e consertos em couro legítimo. Você fala direto com a Márcia — sem pressa, sem atendente, sem script."
- CTAs: primário "Falar no WhatsApp" / secundário "Ver o catálogo".
- Trust inline (mantém): ✓ Couro legítimo · ✓ Feito à mão · ✓ Loja física · ✓ Consertos e sob medida.

### 2. Barra de confiança (refinar)
Faixa fina logo abaixo do hero reforçando 3–4 selos: Couro legítimo · Feito à mão · Atendimento pessoal · Loja física no Alto da Ponte. (Pode reaproveitar `.hero__trust` ou virar faixa própria `.trust-bar`.)

### 3. Categorias / Catálogo (subir para logo após confiança)
Mantém os 6 cards atuais (já corrigidos para `.webp` na Onda 0). Sem mudança estrutural; só passa a aparecer mais cedo na página. Título: "O que a gente faz".

### 4. Faixas de preço 🆕 (`#precos`)
Bloco com faixas por categoria para tirar fricção. Estrutura: grid de itens `categoria — a partir de R$ ___`.
Conteúdo (preços = placeholder `<!-- AJUSTAR PREÇO -->`):
- Cintos — a partir de R$ ___
- Bolsas & acessórios — a partir de R$ ___
- Selas — a partir de R$ ___
- Arreios — a partir de R$ ___
- Consertos — orçamento na hora
- Sob medida — orçamento personalizado
Nota de rodapé do bloco: "Valores variam conforme o couro, o tamanho e os detalhes. Manda uma mensagem que a Márcia te passa o valor certinho."
CTA: "Pedir meu orçamento".

### 5. Diferenciais (reescrever os 4 cards)
- **Atendimento da Márcia** — "Você fala direto com quem faz a peça. Sem atendente, sem script, sem robô. A Márcia te ajuda a escolher o que serve pra você."
- **Feito à mão, peça por peça** — "Nada de linha de produção. Cada peça é cortada, costurada e acabada à mão — por isso nenhuma sai igual à outra."
- **Couro que envelhece bonito** — "Couro legítimo selecionado, que você toca, sente o cheiro e leva pra casa. Não é pra usar e jogar fora — é pra durar anos e ficar com a sua marca."
- **Loja física pra ver e tocar** — "No Alto da Ponte, em São José dos Campos. Venha conhecer, experimentar e conversar — de segunda a sexta, das 7h às 18h."

### 6. História da Márcia 🆕 (`#sobre`, substitui os cards frios de endereço)
Seção narrativa com texto humano (sem anos). Direção:
> "A Selaria & Casa de Couro Santos é um lugar onde o couro ainda é trabalhado como antigamente — com tempo, capricho e conversa. Aqui quem te atende é a Márcia, a mesma pessoa que corta, costura e dá o acabamento em cada peça. É esse cuidado de quem faz com as próprias mãos que você sente quando pega uma peça nossa — e que a gente não abre mão."
Layout: texto + imagem (placeholder com `📷` pronto para foto real da Márcia/loja). Marcar `<!-- TROCAR POR FOTO REAL DA MÁRCIA/OFICINA -->`.

### 7. Como funciona o pedido 🆕 (`#como-funciona`)
4 passos numerados, baixa fricção:
1. **Manda um oi** — Você chama a Márcia no WhatsApp.
2. **Conta o que precisa** — Modelo, tamanho, cor do couro, ou manda foto da peça pra consertar.
3. **Recebe o orçamento** — Sem compromisso. A Márcia te passa valor e prazo.
4. **Sua peça fica pronta** — Retira na loja ou combina o envio.
CTA ao final: "Começar agora no WhatsApp".

### 8. Depoimentos 🆕 (`#depoimentos`, placeholder)
Grid de 3 cards de depoimento com estrutura pronta (aspas, texto, nome, cidade). Conteúdo marcado `<!-- DEPOIMENTO PLACEHOLDER - substituir por depoimento real -->`. Texto de exemplo neutro e desligável. Acima do grid, um aviso em comentário HTML explicando como o cliente troca pelos reais. Quando houver Google Reviews/Instagram, vira âncora aqui.

### 9. FAQ 🆕 (`#faq`)
Acordeão (details/summary nativo, acessível, sem JS extra) com perguntas reais:
- Vocês fazem peças sob medida?
- Quanto tempo demora pra ficar pronto?
- Vocês enviam para outras cidades?
- Quais as formas de pagamento?
- Vocês consertam peças que não foram compradas aí?
- Como funciona a garantia?
Respostas curtas e honestas; onde o dado é desconhecido (ex.: pagamento, envio), usar resposta que direciona ao WhatsApp e marcar `<!-- CONFIRMAR COM A MÁRCIA -->`.
**SEO:** adicionar JSON-LD `FAQPage` correspondente (bom para Google e IAs). As respostas do JSON-LD devem espelhar o texto visível.

### 10. CTA final (reescrever)
Mantém layout atual. Copy: "Manda uma mensagem pra Márcia agora" / "Sem formulário, sem complicação. Só um WhatsApp — e quem responde é ela mesma." Botão "Falar no WhatsApp" + telefone alternativo.

### 11. Contato + Mapa (manter)
Endereço, horário, telefone, mapa embed. Único lugar com esses dados agora (remove a duplicação com a antiga seção "Sobre").

### 12. Footer (refinar leve)
Mantém. Garantir links âncora para as novas seções no nav, se fizer sentido.

---

## Navegação (header)
Atualizar o menu para refletir a nova estrutura. Proposta de itens: **Catálogo · Preços · Como funciona · Sobre · Contato**. (Catálogo continua apontando para `catalogo.html`; os demais são âncoras na home.) Ajustar nas duas páginas (`index.html` e `catalogo.html`).

## CSS
- Todos os estilos novos (faixas de preço, como-funciona, depoimentos, FAQ, história) vão em `css/style.css`, seguindo o padrão BEM e as variáveis existentes.
- Reaproveitar componentes existentes (`.section__header`, `.btn`, cards) ao máximo.
- Responsividade: cada seção nova precisa de regra mobile (≤768px) coerente com o resto.

## Dados estruturados adicionais
- `FAQPage` JSON-LD no `index.html` espelhando o FAQ visível.
- (Opcional, futuro) `AggregateRating` quando houver avaliações reais — **não** adicionar agora (sem dados = risco de penalização).

## Itens que NÃO entram nesta onda (evitar scope creep)
- Refino visual avançado, microinterações novas, galeria/portfólio → Onda 3.
- Estratégia de anúncios / landing de campanha → Onda 4.
- Extrair o CSS inline do `catalogo.html` para `style.css` → Onda 3 (a menos que seja trivial junto).

## Critérios de sucesso
- Página segue a nova ordem de 12 seções.
- Toda copy reescrita, sem erros de português e sem citar anos.
- Todas as seções novas com responsividade mobile.
- Placeholders de preço, depoimento e foto claramente marcados com comentários HTML.
- `FAQPage` JSON-LD válido e espelhando o conteúdo visível.
- Nenhuma regressão nas Ondas 0/1 (imagens webp, SEO, favicons continuam funcionando).
