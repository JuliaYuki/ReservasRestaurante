
# 🍽️ Sistema de Reservas - Restaurante Sabor da Terra

Este é um sistema web de reservas para restaurantes, que permite que os clientes verifiquem a disponibilidade de mesas e realizem reservas online. O projeto utiliza HTML, CSS e JavaScript no frontend e Flask (Python) no backend.

## 🧩 Tecnologias utilizadas

- Frontend:
  - HTML5
  - CSS3
  - JavaScript

- Backend:
  - Python
  - Flask
  - Flask-CORS

## 📁 Estrutura do Projeto

```
.
├── app.py              # Backend com API Flask
├── index.html          # Página principal com formulário de reserva
├── style.css           # Estilos da aplicação
├── script.js           # Lógica do frontend (formulário e verificação de disponibilidade)
├── reservas.json       # Banco de dados simples com as reservas
└── img/                # Imagens do site (coloque aqui suas imagens)
```

## ⚙️ Como rodar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/sabor-da-terra.git
cd sabor-da-terra
```

### 2. Configure o ambiente Python

Recomenda-se usar um ambiente virtual:

```bash
python -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows
```

### 3. Instale as dependências

```bash
pip install flask flask-cors
```

### 4. Inicie o servidor Flask

```bash
python app.py
```

O servidor estará disponível em:  
`http://127.0.0.1:5000`

### 5. Execute o frontend

`http://localhost:5000/api`

---

## 🧪 Testando

1. Acesse `index.html`
2. Vá até a seção de reservas
3. Preencha o formulário e clique em "Confirmar Reserva"
4. Veja a resposta de sucesso ou erro conforme a disponibilidade

---

## 📦 Funcionalidades

- Verificação de disponibilidade de mesas
- Envio,armazenamento e cancelamento de reservas
- Mensagens de sucesso ou erro
- Interface moderna e responsiva

---

## 🔒 Observações

- As reservas são salvas no arquivo `reservas.json` localmente.
- O número de mesas disponíveis é limitado a 20.
- A lógica de disponibilidade calcula 1 mesa para cada 4 pessoas (arredondando para cima).

---

## 👩‍💻 Desenvolvido por

Julia  
🚀 Projeto educacional para fins de aprendizagem e portfólio.
