// ══════════════════════════════════════════════════════════════
// SEGURANÇA
// ══════════════════════════════════════════════════════════════
const Seguranca = {
  codificar: (texto) => btoa(unescape(encodeURIComponent(texto))),
  decodificar: (texto) => decodeURIComponent(escape(atob(texto))),
  sanitizar: (texto) => texto.replace(/[<>'"]/g, '').trim(),
  gerarToken: () => {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2,'0')).join('');
  },
  validarCampo: (valor, tipo) => {
    if (!valor || valor.trim() === '') return false;
    if (tipo === 'tel') return /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(valor.replace(/\s/g,''));
    if (tipo === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    return valor.trim().length >= 2;
  }
};

const sessionToken = Seguranca.gerarToken();
console.log(`🔒 Sessão segura iniciada: ${sessionToken.substring(0,8)}...`);

// ══════════════════════════════════════════════════════════════
// ESTOQUE
// ══════════════════════════════════════════════════════════════
const estoqueInicial = {
  cimento: 50, areia: 30, brita: 25, cal: 40,
  argamassa: 35, tijolo: 20, bloco: 200,
  pa: 15, enxada: 12, martelo: 18, furadeira: 8,
  cano: 45, "caixa-dagua": 10, torneira: 30,
  fio: 20, tomada: 60, lampada: 80, disjuntor: 40,
  piso: 40, porcelanato: 25, porta: 12, janela: 10,
  tinta_branca: 30, tinta_cores: 25, massa_corrida: 35,
  selador: 20, verniz: 18, lixa: 100,
  rejunte: 50, impermeabilizante: 22, telha: 60,
  ferro: 30, arame: 40, escada: 8, promocao: 15,
};

let estoque = { ...estoqueInicial };

// ══════════════════════════════════════════════════════════════
// PRODUTOS COM IMAGENS
// ══════════════════════════════════════════════════════════════
const produtos = {
  cimento: {
    imagem: "cimento.png",
    emoji: "🏗", nome: "Cimento Portland CP-II 50kg",
    unidade: "saco", preco: 40, precoMin: 35, precoMax: 45,
    cat: "basico", estrelas: 5, desconto: 0,
    desc: "Cimento Portland CP-II de alta resistência. Saco 50kg. Ideal para fundações, estruturas e argamassas.",
    marca: "Cauê", codigo: "CIM001"
  },
  areia: {
    imagem: "areia.png",
    emoji: "🪨", nome: "Areia Média Lavada (m³)",
    unidade: "m³", preco: 120, precoMin: 90, precoMax: 150,
    cat: "basico", estrelas: 4, desconto: 10,
    desc: "Areia média lavada de qualidade. Ideal para reboco, argamassa e concreto.",
    marca: "Local", codigo: "ARE001"
  },
  brita: {
    imagem: "brita.png",
    emoji: "⛏️", nome: "Brita n°1 (m³)",
    unidade: "m³", preco: 150, precoMin: 120, precoMax: 180,
    cat: "basico", estrelas: 4, desconto: 0,
    desc: "Brita número 1 para fundações e concreto. Entregamos em caminhão.",
    marca: "Local", codigo: "BRI001"
  },
  cal: {
    emoji: "🧱", nome: "Cal Hidratada CH-III 20kg",
    unidade: "saco", preco: 20, precoMin: 15, precoMax: 25,
    cat: "basico", estrelas: 4, desconto: 0,
    desc: "Cal hidratada para argamassas, reboco e pintura. Saco 20kg.",
    marca: "Votorantim", codigo: "CAL001"
  },
  argamassa: {
    emoji: "🪣", nome: "Argamassa Colante AC-II 20kg",
    unidade: "saco", preco: 28, precoMin: 20, precoMax: 35,
    cat: "basico", estrelas: 5, desconto: 15,
    desc: "Argamassa AC-II para assentamento de pisos e revestimentos internos e externos.",
    marca: "Quartzolit", codigo: "ARG001"
  },
  tijolo: {
    imagem: "tijolo.png",
    emoji: "🧱", nome: "Tijolo Cerâmico 6 Furos (milheiro)",
    unidade: "milheiro", preco: 750, precoMin: 600, precoMax: 900,
    cat: "basico", estrelas: 5, desconto: 0,
    desc: "Tijolo cerâmico 6 furos 9x14x19cm. Alta resistência e acabamento uniforme.",
    marca: "Cerâmica Local", codigo: "TIJ001"
  },
  bloco: {
    imagem: "bloco.png",
    emoji: "⬛", nome: "Bloco de Concreto 14x19x39",
    unidade: "unidade", preco: 4.5, precoMin: 3, precoMax: 6,
    cat: "basico", estrelas: 4, desconto: 0,
    desc: "Bloco estrutural de concreto. Resistência mínima de 6 MPa. Para paredes e muros.",
    marca: "Concretex", codigo: "BLO001"
  },
  telha: {
    imagem: "telha.png",
    emoji: "🏠", nome: "Telha Fibrocimento 2,44m",
    unidade: "unidade", preco: 35, precoMin: 28, precoMax: 45,
    cat: "basico", estrelas: 4, desconto: 8,
    desc: "Telha ondulada de fibrocimento 2,44m x 1,10m. Espessura 5mm. Alta durabilidade.",
    marca: "Brasilit", codigo: "TEL001"
  },
  ferro: {
    emoji: "⚙️", nome: "Vergalhão CA-60 ø 8mm Barra 12m",
    unidade: "barra", preco: 65, precoMin: 55, precoMax: 75,
    cat: "basico", estrelas: 5, desconto: 8,
    desc: "Vergalhão de aço CA-60 diâmetro 8mm, barra de 12 metros. Alta resistência estrutural.",
    marca: "Gerdau", codigo: "FER001"
  },
  impermeabilizante: {
    imagem: "tinta.png",
    emoji: "💧", nome: "Impermeabilizante Vedacit 18L",
    unidade: "lata", preco: 95, precoMin: 80, precoMax: 110,
    cat: "basico", estrelas: 5, desconto: 12,
    desc: "Impermeabilizante acrílico elastomérico para lajes, telhados e piscinas. 18 litros.",
    marca: "Vedacit", codigo: "IMP001"
  },
  pa: {
    imagem: "pa.png",
    emoji: "⛏️", nome: "Pá de Bico com Cabo Reforçado",
    unidade: "unidade", preco: 60, precoMin: 40, precoMax: 80,
    cat: "ferramenta", estrelas: 4, desconto: 0,
    desc: "Pá de bico em aço carbono com cabo de madeira eucalipto. Resistente para uso pesado.",
    marca: "Tramontina", codigo: "PAA001"
  },
  enxada: {
    emoji: "🔨", nome: "Enxada Serviço Pesado 1.300g",
    unidade: "unidade", preco: 52, precoMin: 35, precoMax: 70,
    cat: "ferramenta", estrelas: 4, desconto: 0,
    desc: "Enxada para terraplanagem e jardim. Cabo de madeira eucalipto 1,40m.",
    marca: "Tramontina", codigo: "ENX001"
  },
  martelo: {
    emoji: "🔨", nome: "Martelo Borracha + Aço 27mm",
    unidade: "unidade", preco: 42, precoMin: 25, precoMax: 60,
    cat: "ferramenta", estrelas: 5, desconto: 0,
    desc: "Martelo de borracha e aço temperado 27mm. Cabo antivibração.",
    marca: "Stanley", codigo: "MAR001"
  },
  furadeira: {
    emoji: "🔧", nome: "Furadeira de Impacto 750W 3/8\"",
    unidade: "unidade", preco: 275, precoMin: 150, precoMax: 400,
    cat: "ferramenta", estrelas: 5, desconto: 20,
    desc: "Furadeira de impacto 750W, mandril 3/8\", 2.800 RPM. Velocidade variável e reversível.",
    marca: "Bosch", codigo: "FUR001"
  },
  escada: {
    imagem: "escada.png",
    emoji: "🪜", nome: "Escada Alumínio 8 Degraus 2,40m",
    unidade: "unidade", preco: 185, precoMin: 150, precoMax: 220,
    cat: "ferramenta", estrelas: 4, desconto: 10,
    desc: "Escada de alumínio extensível 8 degraus, 2,40m. Degraus antiderrapantes. 120kg.",
    marca: "Botafogo", codigo: "ESC001"
  },
  lixa: {
    emoji: "📄", nome: "Lixa Massa/Madeira Grão 80 (pct c/10)",
    unidade: "pct", preco: 8, precoMin: 6, precoMax: 12,
    cat: "ferramenta", estrelas: 4, desconto: 0,
    desc: "Lixa para massa corrida e madeira grão 80. Pacote com 10 folhas.",
    marca: "Norton", codigo: "LIX001"
  },
  cano: {
    emoji: "🚿", nome: "Tubo PVC Esgoto 100mm x 6m",
    unidade: "barra", preco: 80, precoMin: 40, precoMax: 120,
    cat: "hidraulica", estrelas: 4, desconto: 0,
    desc: "Tubo PVC rígido para esgoto DN100 x 6 metros. NBR 5688.",
    marca: "Amanco", codigo: "CAN001"
  },
  "caixa-dagua": {
    emoji: "🪣", nome: "Caixa d'Água Polietileno 500L",
    unidade: "unidade", preco: 350, precoMin: 250, precoMax: 450,
    cat: "hidraulica", estrelas: 5, desconto: 0,
    desc: "Caixa d'água 500 litros em polietileno de alta densidade. Tampa rosca. Anti-UV.",
    marca: "Tigre", codigo: "CAI001"
  },
  torneira: {
    emoji: "🚰", nome: "Torneira Parede Cozinha Cromada",
    unidade: "unidade", preco: 75, precoMin: 30, precoMax: 120,
    cat: "hidraulica", estrelas: 4, desconto: 15,
    desc: "Torneira de parede para cozinha acabamento cromado brilhante.",
    marca: "Docol", codigo: "TOR001"
  },
  fio: {
    emoji: "⚡", nome: "Fio Flexível 2,5mm² Rolo 100m",
    unidade: "rolo", preco: 275, precoMin: 150, precoMax: 400,
    cat: "eletrica", estrelas: 5, desconto: 0,
    desc: "Fio elétrico flexível 2,5mm² 100 metros. NBR NM 247-3.",
    marca: "Cobrecom", codigo: "FIO001"
  },
  tomada: {
    emoji: "🔌", nome: "Tomada Universal 2P+T 10A Branca",
    unidade: "unidade", preco: 17, precoMin: 10, precoMax: 25,
    cat: "eletrica", estrelas: 4, desconto: 0,
    desc: "Tomada universal 2P+T 10A padrão NBR 14136. Módulo 4x2.",
    marca: "Tramontina", codigo: "TOM001"
  },
  lampada: {
    emoji: "💡", nome: "Lâmpada LED Bulbo 12W 6500K",
    unidade: "unidade", preco: 19, precoMin: 8, precoMax: 30,
    cat: "eletrica", estrelas: 5, desconto: 20,
    desc: "Lâmpada LED bulbo 12W 6500K luz branca. Vida útil 25.000h.",
    marca: "Philips", codigo: "LAM001"
  },
  disjuntor: {
    emoji: "⚡", nome: "Disjuntor Monopolar 20A Curva C",
    unidade: "unidade", preco: 28, precoMin: 22, precoMax: 35,
    cat: "eletrica", estrelas: 4, desconto: 0,
    desc: "Disjuntor monopolar 20A curva C. Proteção contra sobrecarga.",
    marca: "Schneider", codigo: "DIS001"
  },
  piso: {
    emoji: "🟫", nome: "Piso Cerâmico 45x45 Bege Acetinado",
    unidade: "m²", preco: 42, precoMin: 25, precoMax: 60,
    cat: "acabamento", estrelas: 4, desconto: 0,
    desc: "Piso cerâmico 45x45cm acabamento acetinado bege. PEI 4.",
    marca: "Portobello", codigo: "PIS001"
  },
  porcelanato: {
    emoji: "⬜", nome: "Porcelanato Polido 60x60 Branco",
    unidade: "m²", preco: 105, precoMin: 60, precoMax: 150,
    cat: "acabamento", estrelas: 5, desconto: 10,
    desc: "Porcelanato polido 60x60cm cor branca. Alta resistência ao tráfego.",
    marca: "Eliane", codigo: "POR001"
  },
  porta: {
    emoji: "🚪", nome: "Porta Madeira Maciça 80x210 Completa",
    unidade: "unidade", preco: 375, precoMin: 150, precoMax: 600,
    cat: "acabamento", estrelas: 5, desconto: 0,
    desc: "Porta de madeira maciça 80x210cm com marco, dobradiças e fechadura.",
    marca: "Madeirite", codigo: "PRT001"
  },
  janela: {
    emoji: "🪟", nome: "Janela Alumínio 2F 120x100 Vidro",
    unidade: "unidade", preco: 280, precoMin: 220, precoMax: 350,
    cat: "acabamento", estrelas: 4, desconto: 8,
    desc: "Janela alumínio 2 folhas deslizantes 120x100cm com vidro temperado 4mm.",
    marca: "Comfortline", codigo: "JAN001"
  },
  rejunte: {
    emoji: "🪣", nome: "Rejunte Flexível Cinza 1kg",
    unidade: "unidade", preco: 14, precoMin: 10, precoMax: 18,
    cat: "acabamento", estrelas: 4, desconto: 0,
    desc: "Rejunte flexível para pisos e revestimentos. Diversas cores.",
    marca: "Quartzolit", codigo: "REJ001"
  },
  tinta_branca: {
    imagem: "tinta.png",
    emoji: "🎨", nome: "Tinta Látex Premium Branco Neve 18L",
    unidade: "lata", preco: 180, precoMin: 150, precoMax: 210,
    cat: "tinta", estrelas: 5, desconto: 15,
    desc: "Tinta látex PVA premium cor branco neve. Rendimento 300m²/demão. 18 litros.",
    marca: "Suvinil", codigo: "TIN001"
  },
  tinta_cores: {
    imagem: "tinta.png",
    emoji: "🖌️", nome: "Tinta Acrílica Cores Diversas 18L",
    unidade: "lata", preco: 195, precoMin: 165, precoMax: 225,
    cat: "tinta", estrelas: 5, desconto: 10,
    desc: "Tinta acrílica lavável em diversas cores. Resistente ao mofo. 18L.",
    marca: "Coral", codigo: "TIN002"
  },
  massa_corrida: {
    emoji: "🪣", nome: "Massa Corrida PVA 25kg",
    unidade: "balde", preco: 85, precoMin: 70, precoMax: 100,
    cat: "tinta", estrelas: 4, desconto: 0,
    desc: "Massa corrida PVA para paredes internas. Acabamento liso e uniforme.",
    marca: "Suvinil", codigo: "MAS001"
  },
  selador: {
    emoji: "🪣", nome: "Selador Acrílico Incolor 18L",
    unidade: "lata", preco: 120, precoMin: 100, precoMax: 140,
    cat: "tinta", estrelas: 4, desconto: 0,
    desc: "Selador acrílico incolor para preparação de paredes antes da pintura.",
    marca: "Coral", codigo: "SEL001"
  },
  verniz: {
    emoji: "✨", nome: "Verniz Maritimo Brilhante 3,6L",
    unidade: "lata", preco: 75, precoMin: 60, precoMax: 90,
    cat: "tinta", estrelas: 4, desconto: 5,
    desc: "Verniz marítimo brilhante para madeiras internas e externas. Proteção UV.",
    marca: "Novachrome", codigo: "VER001"
  },
  promocao: {
    imagem: "cimento.png",
    emoji: "🔥", nome: "Kit Básico de Obra Completo",
    unidade: "kit", preco: 299, precoMin: 299, precoMax: 399,
    cat: "promocao", estrelas: 5, desconto: 25,
    desc: "Kit completo: 2 sacos de cimento + 1 cal + 1 argamassa + pá + enxada + 10 luvas.",
    marca: "Luizão", codigo: "KIT001"
  },
};

// ══════════════════════════════════════════════════════════════
// ESTADO
// ══════════════════════════════════════════════════════════════
let carrinho = [];
let produtoAtual = null;
let qtdAtual = 1;
let metodoPagamento = null;
let precisaTroco = null;
let valorTroco = "";
let catAtual = "todos";

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════
function getEstoqueClass(id) {
  const qtd = estoque[id];
  const max = estoqueInicial[id];
  if (qtd === 0) return "zero";
  if (qtd / max <= 0.25) return "baixo";
  return "ok";
}

function renderEstrelas(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function calcPrecoOriginal(p) {
  if (p.desconto > 0) return (p.preco / (1 - p.desconto / 100)).toFixed(2);
  return null;
}

function formatPreco(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ══════════════════════════════════════════════════════════════
// RENDERIZAR PRODUTOS
// ══════════════════════════════════════════════════════════════
function renderizarProdutos(lista) {
  const grid = document.getElementById("produtos-grid");
  if (!grid) return;

  const fonte = lista || Object.entries(produtos);
  const isIndex = window.location.pathname.includes("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("/");
  const exibir = isIndex ? fonte.slice(0, 8) : fonte;

  grid.innerHTML = exibir.map(([id, p]) => {
    const semEstoque = estoque[id] === 0;
    const cls = getEstoqueClass(id);
    const precoOriginal = calcPrecoOriginal(p);
    const tagClass = cls === "zero" ? "tag-zero" : cls === "baixo" ? "tag-baixo" : "tag-ok";
    const tagText = cls === "zero" ? "❌ Sem estoque"
      : cls === "baixo" ? `⚠ Restam ${estoque[id]}`
      : `✅ ${estoque[id]} em estoque`;
    const mostrar = catAtual === "todos" || p.cat === catAtual;

    // Imagem real ou emoji
    const imgHTML = p.imagem
      ? `<img src="images/${p.imagem}" alt="${p.nome}"
           style="max-height:110px;max-width:150px;object-fit:contain;
           filter:drop-shadow(0 4px 8px rgba(0,0,0,0.12))"
           onerror="this.style.display='none';this.nextElementSibling.style.display='block'">`
      : "";
    const emojiHTML = `<span class="produto-emoji-card" ${p.imagem ? 'style="display:none"' : ""}>${p.emoji}</span>`;

    return `
      <div class="produto-card ${semEstoque ? "sem-estoque" : ""} ${!mostrar ? "hidden" : ""}"
           data-cat="${p.cat}" data-preco="${p.preco}" data-desconto="${p.desconto}">
        ${p.desconto > 0 ? `<div class="produto-badge-off">${p.desconto}% OFF</div>` : ""}
        <div class="produto-img-area">
          ${imgHTML}${emojiHTML}
        </div>
        <div class="produto-body">
          <h3>${p.nome}</h3>
          <div class="estrelas">${renderEstrelas(p.estrelas)}</div>
          <div style="font-size:11px;color:#aaa;text-align:center;margin-bottom:6px">
            ${p.marca} · Cód: ${p.codigo}
          </div>
          <div class="preco-area">
            ${precoOriginal ? `<span class="preco-riscado">De: R$ ${precoOriginal}</span>` : ""}
            <span class="preco-atual">${formatPreco(p.preco)}</span>
            <span class="preco-parcela">por ${p.unidade}</span>
          </div>
          <div class="estoque-tag">
            <span class="${tagClass}">${tagText}</span>
          </div>
        </div>
        <div class="produto-footer">
          <button class="btn-ver" ${semEstoque ? "disabled" : ""}
            onclick="${semEstoque ? "" : `abrirProduto('${id}')`}">
            ${semEstoque ? "SEM ESTOQUE" : `<i class="fas fa-eye"></i> Ver Produto`}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// ══════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  renderizarProdutos();
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("cat");
  if (cat) { catAtual = cat; filtrarCat(cat, null); }
});

// ══════════════════════════════════════════════════════════════
// BUSCA
// ══════════════════════════════════════════════════════════════
function buscarProduto(termo) {
  termo = Seguranca.sanitizar(termo.toLowerCase());
  document.querySelectorAll(".produto-card").forEach(card => {
    const nome = card.querySelector("h3")?.textContent.toLowerCase() || "";
    card.classList.toggle("hidden", termo !== "" && !nome.includes(termo));
  });
  if (termo !== "") {
    const sec = document.getElementById("produtos");
    if (sec) sec.scrollIntoView({ behavior: "smooth" });
  }
}

// ══════════════════════════════════════════════════════════════
// FILTRO
// ══════════════════════════════════════════════════════════════
function filtrarCat(cat, el) {
  catAtual = cat;
  document.querySelectorAll(".nav-cat").forEach(b => b.classList.remove("active"));
  if (el) el.classList.add("active");
  document.querySelectorAll(".produto-card").forEach(card => {
    const mostrar = cat === "todos" || card.dataset.cat === cat;
    card.classList.toggle("hidden", !mostrar);
  });
  const sec = document.getElementById("produtos");
  if (sec) sec.scrollIntoView({ behavior: "smooth" });
}

// ══════════════════════════════════════════════════════════════
// ORDENAR
// ══════════════════════════════════════════════════════════════
function ordenarProdutos(tipo) {
  let entries = Object.entries(produtos);
  if (tipo === "menor") entries.sort((a, b) => a[1].preco - b[1].preco);
  else if (tipo === "maior") entries.sort((a, b) => b[1].preco - a[1].preco);
  else if (tipo === "desc") entries.sort((a, b) => b[1].desconto - a[1].desconto);
  renderizarProdutos(entries);
}

// ══════════════════════════════════════════════════════════════
// MODAL PRODUTO
// ══════════════════════════════════════════════════════════════
function abrirProduto(id) {
  if (!estoque[id] || estoque[id] === 0) return;
  produtoAtual = id;
  qtdAtual = 1;
  const p = produtos[id];
  const estoqueDisp = estoque[id];
  const estoqueMax = estoqueInicial[id];
  const pct = Math.round((estoqueDisp / estoqueMax) * 100);
  const cls = getEstoqueClass(id);
  const barraClass = cls === "baixo" ? "barra-baixo" : cls === "zero" ? "barra-zero" : "barra-ok";
  const corDisp = cls === "zero" ? "#dc2626" : cls === "baixo" ? "#f59e0b" : "#16a34a";
  const precoOriginal = calcPrecoOriginal(p);

  const imgModal = p.imagem
    ? `<img src="images/${p.imagem}" alt="${p.nome}"
         style="height:120px;object-fit:contain;margin-bottom:10px;
         filter:drop-shadow(0 4px 12px rgba(0,0,0,0.15))"
         onerror="this.style.display='none'">`
    : `<div style="font-size:72px;margin-bottom:12px">${p.emoji}</div>`;

  document.getElementById("produto-conteudo").innerHTML = `
    <div style="text-align:center">
      ${imgModal}
      <div style="font-size:11px;color:#aaa;margin-bottom:6px">${p.marca} · Ref: ${p.codigo}</div>
    </div>
    <div class="prod-modal-titulo">${p.nome}</div>
    <div class="estrelas" style="font-size:16px;margin-bottom:10px">${renderEstrelas(p.estrelas)}</div>
    <div class="prod-modal-desc">${p.desc}</div>
    ${precoOriginal ? `<div style="color:#999;text-decoration:line-through;font-size:14px;margin-bottom:4px">De: R$ ${precoOriginal}</div>` : ""}
    <div class="prod-modal-preco">${formatPreco(p.preco)} <small>/ ${p.unidade}</small></div>
    ${p.desconto > 0 ? `
    <div style="display:inline-block;background:#dcfce7;color:#16a34a;padding:5px 14px;border-radius:20px;font-size:12px;font-weight:bold;margin-bottom:16px">
      ✅ ${p.desconto}% de desconto • Economize ${formatPreco(parseFloat(precoOriginal) - p.preco)}
    </div>` : ""}

    <div class="estoque-modal-box">
      <div class="estoque-modal-titulo">📦 Disponibilidade em Estoque</div>
      <div class="estoque-barra-container">
        <div class="estoque-barra ${barraClass}" style="width:${pct}%"></div>
      </div>
      <div class="estoque-numeros">
        <span class="estoque-disponivel" style="color:${corDisp}">${estoqueDisp} ${p.unidade}(s) disponíveis</span>
        <span class="estoque-total">Total: ${estoqueMax}</span>
      </div>
    </div>

    <div style="text-align:center;margin-bottom:12px">
      <label style="font-size:13px;color:#666;font-weight:bold">Quantidade</label>
    </div>
    <div class="qtd-control">
      <button onclick="mudarQtd(-1)" id="btn-menos">−</button>
      <span id="qtd-valor">1</span>
      <button onclick="mudarQtd(1)" id="btn-mais">+</button>
    </div>

    <div style="text-align:center;margin-bottom:18px;padding:12px;background:#f8f9fa;border-radius:10px">
      <div style="font-size:13px;color:#666">Subtotal</div>
      <div style="font-size:24px;font-weight:900;color:#0d2b4e">
        <span id="subtotal-valor">${formatPreco(p.preco)}</span>
      </div>
    </div>

    <button class="btn-add-carrinho" onclick="adicionarAoCarrinho()">
      <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
    </button>
    <div style="text-align:center;margin-top:12px;font-size:12px;color:#aaa">
      <i class="fas fa-lock" style="color:#16a34a"></i> Compra 100% segura
      &nbsp;•&nbsp; <i class="fas fa-truck" style="color:#ff8c00"></i> Entrega rápida
    </div>
  `;

  atualizarBotoes();
  document.getElementById("modal-produto").style.display = "flex";
}

function mudarQtd(delta) {
  const max = estoque[produtoAtual];
  qtdAtual = Math.min(max, Math.max(1, qtdAtual + delta));
  document.getElementById("qtd-valor").textContent = qtdAtual;
  document.getElementById("subtotal-valor").textContent =
    formatPreco(produtos[produtoAtual].preco * qtdAtual);
  atualizarBotoes();
}

function atualizarBotoes() {
  document.getElementById("btn-menos").disabled = qtdAtual <= 1;
  document.getElementById("btn-mais").disabled = qtdAtual >= estoque[produtoAtual];
}

function fecharProduto() {
  document.getElementById("modal-produto").style.display = "none";
}

// ══════════════════════════════════════════════════════════════
// CARRINHO
// ══════════════════════════════════════════════════════════════
function adicionarAoCarrinho() {
  const p = produtos[produtoAtual];
  const existente = carrinho.find(i => i.id === produtoAtual);
  const qtdNoCarrinho = existente ? existente.qtd : 0;

  if (qtdNoCarrinho + qtdAtual > estoque[produtoAtual]) {
    mostrarToast(`⚠️ Estoque insuficiente! Disponível: ${estoque[produtoAtual]}`, "erro");
    return;
  }

  if (existente) existente.qtd += qtdAtual;
  else carrinho.push({
    id: produtoAtual, nome: p.nome, emoji: p.emoji,
    preco: p.preco, unidade: p.unidade, qtd: qtdAtual,
    codigo: p.codigo, imagem: p.imagem || null
  });

  atualizarBadge();
  fecharProduto();
  mostrarToast(`✅ ${p.nome} adicionado ao carrinho!`);
}

function atualizarBadge() {
  const total = carrinho.reduce((s, i) => s + i.qtd, 0);
  const badge = document.getElementById("badge-carrinho");
  if (!badge) return;
  badge.textContent = total;
  badge.style.display = total > 0 ? "flex" : "none";
}

function abrirCarrinho() {
  const itens = document.getElementById("carrinho-itens");
  const totalBox = document.getElementById("carrinho-total");
  if (!itens) return;

  if (carrinho.length === 0) {
    itens.innerHTML = `
      <div class="carrinho-vazio">
        <i class="fas fa-shopping-cart"></i>
        <p>Seu carrinho está vazio!</p>
        <small>Adicione produtos para continuar</small>
      </div>`;
    totalBox.innerHTML = "";
  } else {
    const total = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
    itens.innerHTML = carrinho.map((item, idx) => `
      <div class="carrinho-item">
        <div style="font-size:26px;margin-right:12px">
          ${item.imagem
            ? `<img src="images/${item.imagem}" style="height:40px;object-fit:contain" onerror="this.style.display='none'">`
            : item.emoji}
        </div>
        <div style="flex:1">
          <div class="carrinho-item-nome">${item.nome}</div>
          <div class="carrinho-item-qtd">${item.qtd} ${item.unidade}(s) × ${formatPreco(item.preco)}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="carrinho-item-preco">${formatPreco(item.preco * item.qtd)}</div>
          <button class="carrinho-item-rm" onclick="removerItem(${idx})">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `).join("");

    totalBox.innerHTML = `
      <div style="padding:12px 0;border-top:2px solid #f0f0f0;margin-top:8px">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;color:#888">
          <span>Subtotal (${carrinho.reduce((s,i)=>s+i.qtd,0)} itens)</span>
          <span>${formatPreco(total)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;color:#888">
          <span>Frete</span>
          <span style="color:#16a34a">A calcular</span>
        </div>
      </div>
      <div class="carrinho-total-box">
        <span>Total do pedido:</span>
        <strong>${formatPreco(total)}</strong>
      </div>
      <button class="btn-finalizar" onclick="abrirPagamento()">
        <i class="fas fa-lock"></i> Finalizar Pedido com Segurança
      </button>
      <div style="text-align:center;margin-top:10px;font-size:11px;color:#aaa">
        <i class="fas fa-shield-alt" style="color:#16a34a"></i> Dados protegidos com criptografia SSL 256-bit
      </div>
    `;
  }
  document.getElementById("modal-carrinho").style.display = "flex";
}

function removerItem(idx) {
  const nome = carrinho[idx].nome;
  carrinho.splice(idx, 1);
  atualizarBadge();
  abrirCarrinho();
  mostrarToast(`🗑 ${nome} removido.`, "aviso");
}

function fecharCarrinho() {
  document.getElementById("modal-carrinho").style.display = "none";
}

// ══════════════════════════════════════════════════════════════
// PAGAMENTO
// ══════════════════════════════════════════════════════════════
function abrirPagamento() {
  fecharCarrinho();
  metodoPagamento = null; precisaTroco = null; valorTroco = "";
  const total = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
  const pedidoId = `LUZ${Date.now().toString().slice(-8)}`;

  document.getElementById("pagamento-conteudo").innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
      <i class="fas fa-lock" style="color:#16a34a;font-size:20px"></i>
      <div class="pag-titulo">Finalizar Pedido</div>
    </div>
    <div class="pag-sub">Pedido #${pedidoId} · Ambiente 100% seguro</div>

    <div class="pag-resumo">
      <div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">
        Resumo do Pedido
      </div>
      ${carrinho.map(i => `
        <div class="pag-resumo-linha">
          <span>${i.emoji} ${i.nome} ×${i.qtd}</span>
          <span>${formatPreco(i.preco * i.qtd)}</span>
        </div>
      `).join("")}
      <div class="pag-resumo-linha">
        <span><strong>Total</strong></span>
        <span><strong>${formatPreco(total)}</strong></span>
      </div>
    </div>

    <div class="pag-step">
      <h4><i class="fas fa-credit-card"></i> &nbsp;Forma de Pagamento</h4>
      <div class="metodos-grid">
        <button class="metodo-btn" id="btn-pix" onclick="selecionarMetodo('pix')">
          <span>💠</span><span>Pix</span>
        </button>
        <button class="metodo-btn" id="btn-cartao" onclick="selecionarMetodo('cartao')">
          <span>💳</span><span>Cartão</span>
        </button>
        <button class="metodo-btn" id="btn-dinheiro" onclick="selecionarMetodo('dinheiro')">
          <span>💵</span><span>Dinheiro</span>
        </button>
      </div>
      <div id="pix-info" style="display:none">
        <div class="pix-info-box">
          <p><strong>Chave Pix:</strong></p>
          <strong style="font-size:18px">(38) 99832-4849</strong>
          <p style="margin-top:8px;font-size:12px;color:#666">
            📱 Envie o comprovante via WhatsApp após o pagamento.
          </p>
        </div>
      </div>
      <div id="troco-section" style="display:none">
        <div class="troco-box">
          <p>💵 Precisa de troco?</p>
          <div class="troco-btns">
            <button class="troco-btn" id="troco-sim" onclick="setTroco(true)">✅ Sim</button>
            <button class="troco-btn" id="troco-nao" onclick="setTroco(false)">❌ Não</button>
          </div>
          <div id="troco-valor-box" style="display:none;margin-top:12px">
            <input type="number" class="troco-input" id="troco-input"
              placeholder="Troco para quanto? Ex: 100"
              oninput="valorTroco=this.value"/>
          </div>
        </div>
      </div>
    </div>

    <div class="pag-step">
      <h4><i class="fas fa-map-marker-alt"></i> &nbsp;Endereço de Entrega</h4>
      <div class="endereco-form">
        <input type="text" class="end-input" id="end-nome" placeholder="Nome completo *"/>
        <input type="text" class="end-input" id="end-rua" placeholder="Rua / Avenida *"/>
        <div class="end-row">
          <input type="text" class="end-input" id="end-num" placeholder="Número *"/>
          <input type="text" class="end-input" id="end-bairro" placeholder="Bairro *"/>
        </div>
        <input type="text" class="end-input" id="end-cidade" placeholder="Cidade *"/>
        <input type="text" class="end-input" id="end-ref" placeholder="Ponto de referência (opcional)"/>
        <input type="tel" class="end-input" id="end-tel" placeholder="Telefone *"/>
      </div>
    </div>

    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:12px;margin-bottom:16px;font-size:12px;color:#166534">
      <i class="fas fa-shield-alt"></i> Seus dados são protegidos com criptografia SSL 256-bit.
    </div>

    <button class="btn-confirmar" onclick="confirmarPedido()">
      <i class="fas fa-lock"></i> Confirmar Pedido com Segurança
    </button>
  `;

  document.getElementById("modal-pagamento").style.display = "flex";
}

function selecionarMetodo(metodo) {
  metodoPagamento = metodo;
  document.querySelectorAll(".metodo-btn").forEach(b => b.classList.remove("selected"));
  document.getElementById(`btn-${metodo}`).classList.add("selected");
  document.getElementById("troco-section").style.display = metodo === "dinheiro" ? "block" : "none";
  document.getElementById("pix-info").style.display = metodo === "pix" ? "block" : "none";
  if (metodo !== "dinheiro") { precisaTroco = null; valorTroco = ""; }
}

function setTroco(sim) {
  precisaTroco = sim;
  document.getElementById("troco-sim").classList.toggle("selected", sim);
  document.getElementById("troco-nao").classList.toggle("selected", !sim);
  document.getElementById("troco-valor-box").style.display = sim ? "block" : "none";
}

function confirmarPedido() {
  if (!metodoPagamento) { mostrarToast("⚠️ Escolha a forma de pagamento!", "erro"); return; }
  if (metodoPagamento === "dinheiro" && precisaTroco === null) { mostrarToast("⚠️ Informe se precisa de troco!", "erro"); return; }
  if (metodoPagamento === "dinheiro" && precisaTroco && !valorTroco) { mostrarToast("⚠️ Informe o valor para o troco!", "erro"); return; }

  const campos = [
    { id: "end-nome",   tipo: "texto", label: "nome completo" },
    { id: "end-rua",    tipo: "texto", label: "rua" },
    { id: "end-num",    tipo: "texto", label: "número" },
    { id: "end-bairro", tipo: "texto", label: "bairro" },
    { id: "end-cidade", tipo: "texto", label: "cidade" },
    { id: "end-tel",    tipo: "tel",   label: "telefone" },
  ];

  for (const campo of campos) {
    const val = document.getElementById(campo.id)?.value.trim() || "";
    if (!Seguranca.validarCampo(val, campo.tipo)) {
      mostrarToast(`⚠️ Preencha corretamente: ${campo.label}`, "erro");
      return;
    }
  }

  const dadosPedido = {
    nome: Seguranca.sanitizar(document.getElementById("end-nome").value),
    pagamento: metodoPagamento,
    token: sessionToken,
  };

  const dadosCodificados = Seguranca.codificar(JSON.stringify(dadosPedido));
  console.log(`🔒 Pedido processado: ${dadosCodificados.substring(0,20)}...`);

  carrinho.forEach(item => {
    estoque[item.id] = Math.max(0, estoque[item.id] - item.qtd);
  });

  fecharPagamento();
  carrinho = [];
  atualizarBadge();
  renderizarProdutos();
  mostrarToast("🎉 Pedido confirmado com sucesso!", "sucesso");
  setTimeout(() => dispararNotifEntrega(dadosPedido.nome), 4000);
}

function fecharPagamento() {
  document.getElementById("modal-pagamento").style.display = "none";
}

// ══════════════════════════════════════════════════════════════
// NOTIF ENTREGA
// ══════════════════════════════════════════════════════════════
function dispararNotifEntrega(nome) {
  const notif = document.getElementById("notif-entrega");
  if (!notif) return;
  notif.querySelector(".notif-texto p").textContent =
    `Olá ${nome.split(" ")[0]}! Seu pedido saiu para entrega. Aguarde! 🏠`;
  notif.style.display = "flex";
  setTimeout(() => { notif.style.display = "none"; }, 14000);
}

function fecharNotif() {
  const n = document.getElementById("notif-entrega");
  if (n) n.style.display = "none";
}

// ══════════════════════════════════════════════════════════════
// SUPORTE / FAQ
// ══════════════════════════════════════════════════════════════
function abrirSuporte() {
  const m = document.getElementById("modal-suporte");
  if (m) m.style.display = "flex";
}
function fecharSuporte() {
  const m = document.getElementById("modal-suporte");
  if (m) m.style.display = "none";
}
function toggleFaq(el) { el.classList.toggle("open"); }

// ══════════════════════════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════════════════════════
function mostrarToast(msg, tipo = "normal") {
  const cores = { erro:"#dc2626", sucesso:"#16a34a", aviso:"#f59e0b", normal:"#ff8c00" };
  const icones = { erro:"fas fa-times-circle", sucesso:"fas fa-check-circle", aviso:"fas fa-exclamation-circle", normal:"fas fa-info-circle" };
  const t = document.createElement("div");
  t.style.cssText = `
    position:fixed; bottom:32px; left:50%; transform:translateX(-50%);
    background:${cores[tipo]||cores.normal}; color:white;
    padding:14px 24px; border-radius:50px; font-size:14px; font-weight:bold;
    z-index:9999; box-shadow:0 8px 24px rgba(0,0,0,0.2);
    display:flex; align-items:center; gap:10px;
    white-space:nowrap; max-width:90vw;
  `;
  t.innerHTML = `<i class="${icones[tipo]||icones.normal}"></i> ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity="0"; t.style.transition="opacity 0.3s"; setTimeout(()=>t.remove(),300); }, 3500);
}