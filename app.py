from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Arquivo para armazenar as reservas
RESERVAS_FILE = 'reservas.json'

# Inicializa o arquivo de reservas se não existir
if not os.path.exists(RESERVAS_FILE):
    with open(RESERVAS_FILE, 'w') as f:
        json.dump([], f)

def carregar_reservas():
    with open(RESERVAS_FILE, 'r') as f:
        return json.load(f)

def salvar_reservas(reservas):
    with open(RESERVAS_FILE, 'w') as f:
        json.dump(reservas, f, indent=2)
        
        
@app.route('/api')
def home_api():
    return render_template('index.html')     

@app.route('/api/reservas', methods=['GET'])
def listar_reservas():
    """Endpoint para listar todas as reservas"""
    reservas = carregar_reservas()
    return jsonify(reservas)

@app.route('/api/reservas', methods=['POST'])
def criar_reserva():
    """Endpoint para criar uma nova reserva"""
    dados = request.json
    
    # Validação básica
    campos_obrigatorios = ['nome', 'email', 'telefone', 'data', 'hora', 'pessoas']
    for campo in campos_obrigatorios:
        if campo not in dados:
            return jsonify({"erro": f"Campo '{campo}' é obrigatório"}), 400
    
    # Validação da data
    try:
        data_hora = datetime.strptime(f"{dados['data']} {dados['hora']}", "%Y-%m-%d %H:%M")
        if data_hora < datetime.now():
            return jsonify({"erro": "A data da reserva deve ser no futuro"}), 400
    except ValueError:
        return jsonify({"erro": "Formato de data ou hora inválido"}), 400
    
    # Criar a reserva
    reservas = carregar_reservas()
    nova_reserva = {
        "id": len(reservas) + 1,
        "nome": dados['nome'],
        "email": dados['email'],
        "telefone": dados['telefone'],
        "data": dados['data'],
        "hora": dados['hora'],
        "pessoas": dados['pessoas'],
        "mensagem": dados.get('mensagem', ''),
        "criado_em": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    reservas.append(nova_reserva)
    salvar_reservas(reservas)
    
    return jsonify({
        "mensagem": "Reserva realizada com sucesso!",
        "reserva": nova_reserva
    }), 201

@app.route('/api/reservas/<int:id>', methods=['DELETE'])
def cancelar_reserva(id):
    """Endpoint para cancelar uma reserva pelo ID"""
    reservas = carregar_reservas()
    reserva_index = next((i for i, r in enumerate(reservas) if r["id"] == id), None)
    
    if reserva_index is None:
        return jsonify({"erro": "Reserva não encontrada"}), 404
    
    reserva_removida = reservas.pop(reserva_index)
    salvar_reservas(reservas)
    
    return jsonify({
        "mensagem": "Reserva cancelada com sucesso!",
        "reserva": reserva_removida
    })

@app.route('/api/disponibilidade', methods=['GET'])
def verificar_disponibilidade():
    try:
        data = request.args.get('data')
        hora = request.args.get('hora')

        if not data or not hora:
            return jsonify({"erro": "Data e hora são necessárias"}), 400

        reservas = carregar_reservas()
        reservas_no_horario = [r for r in reservas if r["data"] == data and r["hora"] == hora]

        total_mesas = 20
        mesas_ocupadas = sum(int(r["pessoas"]) // 4 + (1 if int(r["pessoas"]) % 4 else 0) for r in reservas_no_horario)
        mesas_disponiveis = max(0, total_mesas - mesas_ocupadas)

        return jsonify({
            "data": data,
            "hora": hora,
            "mesas_disponiveis": mesas_disponiveis,
            "mesas_totais": total_mesas
        })
        
    except Exception as e:
        print(f"[ERRO NO BACKEND] {e}")
        return jsonify({"erro": "Erro interno no servidor"}), 500

if __name__ == '__main__':
    app.run(debug=True)