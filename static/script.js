// Dados de exemplo para o menu (em produção, isso viria do backend)
const menuData = {
  entradas: [
    {
      nome: "Bruschetta de Tomate e Manjericão",
      descricao: "Pão italiano tostado com tomate, manjericão e azeite.",
      preco: "R$ 25,00",
      imagem: "../static/img/bruschetta.jpg",
    },
    {
      nome: "Carpaccio de Carne",
      descricao:
        "Fatias finas de carne com molho de alcaparras e lascas de parmesão.",
      preco: "R$ 38,00",
      imagem: "../static/img/Carpaccio-de-Carne.jpg",
    },
    {
      nome: "Salada Verde",
      descricao: "Mix de folhas com molho de limão e azeite.",
      preco: "R$ 22,00",
      imagem: "../static/img/salada-verde.jpg",
    },
  ],
  principais: [
    {
      nome: "Filé Mignon ao Molho Madeira",
      descricao: "Filé mignon grelhado com molho madeira e batatas rústicas.",
      preco: "R$ 75,00",
      imagem: "../static/img/Filé-Mignon-ao-Molho-Madeira.jpg",
    },
    {
      nome: "Risoto de Cogumelos",
      descricao:
        "Arroz arbóreo cremoso com mix de cogumelos frescos e parmesão.",
      preco: "R$ 62,00",
      imagem: "../static/img/risoto-de-cogumelo.jpg",
    },
    {
      nome: "Peixe do Dia",
      descricao:
        "Peixe fresco grelhado com legumes da estação e purê de batata.",
      preco: "R$ 68,00",
      imagem: "../static/img/peixe-do-dia.jpg",
    },
  ],
  sobremesas: [
    {
      nome: "Pudim de Leite",
      descricao: "Pudim cremoso tradicional com calda de caramelo.",
      preco: "R$ 18,00",
      imagem: "../static/img/pudim-leite.jpg",
    },
    {
      nome: "Mousse de Chocolate",
      descricao:
        "Mousse aerada de chocolate meio amargo com raspas de chocolate.",
      preco: "R$ 22,00",
      imagem: "../static/img/mousse-chocolate.jpg",
    },
    {
      nome: "Tiramisù",
      descricao: "Sobremesa italiana tradicional com café, mascarpone e cacau.",
      preco: "R$ 25,00",
      imagem: "../static/img/tiramissu.jpg",
    },
  ],
  bebidas: [
    {
      nome: "Água Mineral",
      descricao: "Com ou sem gás (500ml).",
      preco: "R$ 6,00",
      imagem: "../static/img/agua-mineral.jpg",
    },
    {
      nome: "Refrigerante",
      descricao: "Diversos sabores (lata).",
      preco: "R$ 7,00",
      imagem: "../static/img/refrigerante.jpg",
    },
    {
      nome: "Suco Natural",
      descricao: "Diversos sabores (300ml).",
      preco: "R$ 12,00",
      imagem: "../static/img/suco-natural.jpg",
    },
    {
      nome: "Taça de Vinho",
      descricao: "Tinto ou branco (150ml).",
      preco: "R$ 22,00",
      imagem: "../static/img/vinho.jpg",
    },
  ],
};

// URL base para a API (ajuste conforme sua configuração)
const API_URL = "http://localhost:5000/api";

// Elementos DOM
const reservaForm = document.getElementById("reserva-form");
const mensagemSucesso = document.getElementById("mensagem-sucesso");
const mensagemErro = document.getElementById("mensagem-erro");
const erroTexto = document.getElementById("erro-texto");
const novaReservaBtn = document.getElementById("nova-reserva");
const tentarNovamenteBtn = document.getElementById("tentar-novamente");
const dataInput = document.getElementById("data");
const horaInput = document.getElementById("hora");
const dispResultado = document.getElementById("disponibilidade-resultado");
const dispData = document.getElementById("disp-data");
const dispHora = document.getElementById("disp-hora");
const dispMesas = document.getElementById("disp-mesas");
const menuCategoriasBtn = document.querySelectorAll(".menu-cat-btn");
const menuItemsContainer = document.querySelector(".menu-items");

// Inicializar a página
document.addEventListener("DOMContentLoaded", () => {
  // Definir data mínima como hoje
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  dataInput.min = `${ano}-${mes}-${dia}`;

  // Carregar a categoria de menu padrão
  carregarMenuCategoria("entradas");

  // Configurar eventos
  setupEventos();
});

// Configurar todos os eventos da página
function setupEventos() {
  // Formulário de reserva
  reservaForm.addEventListener("submit", fazerReserva);

  // Botões pós-reserva
  novaReservaBtn.addEventListener("click", resetarFormulario);
  tentarNovamenteBtn.addEventListener("click", resetarFormulario);

  // Verificação de disponibilidade
  dataInput.addEventListener("change", verificarDisponibilidade);
  horaInput.addEventListener("change", verificarDisponibilidade);

  // Categorias do menu
  menuCategoriasBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Remover ativo de todos
      menuCategoriasBtn.forEach((b) => b.classList.remove("ativo"));
      // Adicionar ativo ao clicado
      e.target.classList.add("ativo");
      // Carregar categoria
      carregarMenuCategoria(e.target.dataset.categoria);
    });
  });
}

// Carregar items do menu por categoria
function carregarMenuCategoria(categoria) {
  // Limpar conteúdo atual
  menuItemsContainer.innerHTML = "";

  // Verificar se a categoria existe
  if (!menuData[categoria]) return;

  // Adicionar cada item
  menuData[categoria].forEach((item) => {
    const itemHTML = `
    <div class="menu-item">
      <div class="menu-item-img">
        <img src="${item.imagem}" alt="${item.nome}">
      </div>
      <div class="menu-item-info">
        <h3>${item.nome}</h3>
        <p>${item.descricao}</p>
        <p class="preco">${item.preco}</p>
      </div>
    </div>
  `;
    menuItemsContainer.innerHTML += itemHTML;
  });
}

let reservaRecente = null; // variável temporária em memória

// Fazer uma reserva
async function fazerReserva(e) {
  e.preventDefault();

  // Coletar dados do formulário
  const formData = {
    nome: document.getElementById("nome").value,
    email: document.getElementById("email").value,
    telefone: document.getElementById("telefone").value,
    pessoas: document.getElementById("pessoas").value,
    data: document.getElementById("data").value,
    hora: document.getElementById("hora").value,
    mensagem: document.getElementById("mensagem").value,
  };

  try {
    // Enviar dados para o backend
    const response = await fetch(`${API_URL}/reservas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || "Erro ao processar a reserva");
    }

    // Salvar a reserva recém-criada na variável temporária
    reservaRecente = data.reserva;

    // Mostrar mensagem de sucesso
    reservaForm.classList.add("hidden");
    mensagemSucesso.classList.remove("hidden");

    // Exibir o botão para cancelar a reserva recém-criada
    exibirReservaRecente();
  } catch (error) {
    console.error("Erro:", error);
    erroTexto.textContent = error.message;
    mensagemErro.classList.remove("hidden");
    reservaForm.classList.add("hidden");
  }
}

// Exibir a reserva recém-criada com botão de cancelar
function exibirReservaRecente() {
  const container = document.createElement("div");
  container.classList.add("reserva-recente");

  container.innerHTML = `
    <h3>Reserva criada</h3>
    <p><strong>Nome:</strong> ${reservaRecente.nome}</p>
    <p><strong>Data:</strong> ${reservaRecente.data}</p>
    <p><strong>Hora:</strong> ${reservaRecente.hora}</p>
    <button class="btn btn-secondary" id="cancelar-reserva-btn">
      Cancelar Reserva
    </button>
  `;

  mensagemSucesso.appendChild(container);

  // Evento para cancelar
  document
    .getElementById("cancelar-reserva-btn")
    .addEventListener("click", async () => {
      if (!confirm("Deseja cancelar sua reserva?")) return;

      try {
        const response = await fetch(
          `${API_URL}/reservas/${reservaRecente.id}`,
          {
            method: "DELETE",
          }
        );
        const resultado = await response.json();

        if (!response.ok) {
          throw new Error(resultado.erro || "Erro ao cancelar a reserva");
        }

        alert("Reserva cancelada com sucesso!");
        container.remove(); // Remove a reserva recente da tela
      } catch (error) {
        console.error("Erro ao cancelar reserva:", error);
        alert(error.message);
      }
    });
}

// Verificar disponibilidade
async function verificarDisponibilidade() {
  const data = dataInput.value;
  const hora = horaInput.value;
  const btnConfirmar = document.querySelector(
    '#reserva-form button[type="submit"]'
  );

  // Verificar se ambos estão preenchidos
  if (!data || !hora) return;

  try {
    const response = await fetch(
      `${API_URL}/disponibilidade?data=${data}&hora=${hora}`
    );
    const dados = await response.json();

    if (!response.ok) {
      throw new Error(dados.erro || "Erro ao verificar disponibilidade");
    }

    // Exibir resultado
    dispData.textContent = formatarData(data);
    dispHora.textContent = hora;
    dispMesas.textContent = dados.mesas_disponiveis;
    dispResultado.classList.remove("hidden");

    // Habilitar/desabilitar o botão com base na disponibilidade
    if (dados.mesas_disponiveis === 0) {
      btnConfirmar.disabled = true;
      btnConfirmar.textContent = "Sem mesas disponíveis";
      btnConfirmar.style.backgroundColor = "gray";
      btnConfirmar.style.cursor = "not-allowed";
    } else {
      btnConfirmar.disabled = false;
      btnConfirmar.textContent = "Confirmar Reserva";
      btnConfirmar.style.backgroundColor = "";
      btnConfirmar.style.cursor = "";
    }
  } catch (error) {
    console.error("Erro ao verificar disponibilidade:", error);
    // Não exibimos erro visual, apenas ocultamos o resultado
    dispResultado.classList.add("hidden");

    // Em caso de erro, desabilita por precaução
    if (btnConfirmar) {
      btnConfirmar.disabled = true;
      btnConfirmar.textContent = "Erro ao verificar";
      btnConfirmar.style.backgroundColor = "gray";
    }
  }
}

// Resetar formulário após sucesso ou erro
function resetarFormulario() {
  mensagemSucesso.classList.add("hidden");
  mensagemErro.classList.add("hidden");
  reservaForm.classList.remove("hidden");
  reservaForm.reset();
  dispResultado.classList.add("hidden");
}

// Formatar data para exibição
function formatarData(dataStr) {
  const data = new Date(dataStr);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Navegação suave para as seções
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Ajuste para o header fixo
        behavior: "smooth",
      });
    }
  });
});

// Adicionar classe ativa ao menu quando o usuário rolar a página
window.addEventListener("scroll", function () {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav ul li a");

  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;

    if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});
