// *** bringToFront
// Faz com que o sprite seja o ULTIMO
// a ser renderizado em seu nivel na arvore
function bringToFront(filtro) {
	var target = primeiro(filtro);
	var result = [];
	var index = -1;
	var count = 0;
	for (var i = 0 ; i < game.sprite().length ; i++) {
		if (game.sprite(i)._id != target._id) {	
			game.sprite(i)._state.depth = count;
			count++;
		} else {
			index = i;
		}
	}
	game.sprite(index)._state.depth = count;
}

// *** sendToBack
// Faz com que o sprite seja o PRIMEIRO
// a ser renderizado em seu nivel na arvore
function sendToBack(filtro) {
	var target = primeiro(filtro);
	var result = [];
	var index = -1;
	var count = 1;
	for (var i = 0 ; i < game.sprite().length ; i++) {
		if (game.sprite(i)._id != target._id) {	
			game.sprite(i)._state.depth = count;
			count++;
		} else {
			index = i;
		}
	}
	game.sprite(index)._state.depth = 0;
}

// *** id
// Pega o ID do primeiro elemento que satisfaz a query
function id(filtro) {
	var args = arguments;
	var a = (args.length > 1)?primeiro(filtro,args[1]):primeiro(filtro);
	return a._id;
}

// *** primeiro
// Retorna o primeiro objeto que satisfaz uma query
function primeiro(filtro) {
	var args = arguments;
	var target = (args.length > 1)?buscar(filtro,args[1]):buscar(filtro);
	if (target.length > 0)
		return target[0];
	else
		return -1;
}

// *** Selecao
// Getter: Lista os objetos que estao selecionados no momento
// Setter: Seleciona um objeto passado para a funcao
function selecao() {
	var args = arguments;

	// Getter
	// Retorna os selecionados
	if (args.length == 0) {
		var obj = game.sprite();
		var result = [];
		for (var i = 0 ; i < obj.length ; i++) {
			if (obj[i].selected())
				result.push(obj[i]);
		}
		return result;
	}
	else {
		var target = get(args[0]);
		target.selected(true);
		destaque(target);
	}
}

function naoSelecao(filtro) {
	var a = buscar(filtro);
	// Remove o destaque
	// 2017-07-18
	naoDestaque(selecao());
	// Remove a selecao
	for (var i = 0 ; i < a.length ; i++){
		a[i]._state.selected = false;
	}
}

// Lista os objetos que possuem destaque
function destaque() {
	var args = arguments;
	var result = [];

	// Getter: all
	if (args.length == 0) {
		for (var i = 0 ; i < game.sprite().length ; i++) {
			if (game.sprite(i).hilight())
				result.push(game.sprite(i));
		}
		return result;
	}
	// Setter: destacar os que se enquadram no seletor
	if (args.length >= 1) {
		var filtro = args[0];
		var a = buscar(filtro);
		var hm = (args.length < 2)?"target":args[1];
		for (var i = 0 ; i < a.length ; i++){
			a[i]._state.destaque = hm;
		}
	}
}

function naoDestaque(filtro) {
	var args = arguments;
	var a = buscar(filtro);
	for (var i = 0 ; i < a.length ; i++){
		a[i]._state.destaque = false;
	}
}

// get
// Retorna um objeto da tela
// Essa funcao pode retornar objetos a partir de:
// - string - Efetua busca de acordo com uma string de consulta
// - number - Retorna o objeto que possui o ID fornecido
// - Array - Retorna o primeiro objeto do array
// - Default - Retorna o proprio objeto recebido pela funcao
function get(target) {
	var args = arguments;

	if (typeof(target) == 'string')
		return primeiro(target);
	if (typeof(target) == 'number')
		return game.sprite(target);
	if (target.constructor.name == 'Array')
		return target[0];
	else
		return target;
}

// Move o primeiro objeto encontrado que satisfaz a condicao passada como filtro
// Exemplos:
// - moverPara(0,10) // mover do objeto de id 0 para o de id 10
// - moverPara('bequer','lugar') // mover o primeiro bequer encontrado para a primeira lugar
// - moverPara('bequer',10,20) // Mover o primeiro bequer encontrado para X 10  Y 20
function moverPara() {
	var args = arguments;
	var a,b;

	// Destaca na tela os pontos que podem ser destino
	// para o movimento da selecao
	if (args.length == 1) {
		a = (typeof(args[0]) == "string")?buscar(args[0])[0]:args[0][0];
		a._state.destaque = 1;
	}

	// Mover para um lugar
	if (args.length == 2) {
		a = get(args[0]); 
		b = get(args[1]);
		if (!a || !b) return;
		a._state.transform.x = b._state.transform.x;
		a._state.transform.y = b._state.transform.y;
		// 2017-07-13
		// Ao ser deslocado para a mesma posicao de um objeto alvo,
		// o sprite vira irmao do objeto alvo
		a._state.pai = b._state.pai;
	}
	// Mover para uma posicao X e Y
	if (args.length == 3) {
		var a = buscar(args[0])[0];

		if (!a)
			return;

		a._state.transform.x = args[1];
		a._state.transform.y = args[2];
	}
}


function existe(filtro) {
	var a = buscar(filtro);
	return (a.length > 0);
}

function esconder(filtro) {
	var a = buscar(filtro);
	for (var i = 0 ; i < a.length ; i++) {
		a[i]._state.visivel = false;
	}
}

function exibir(filtro) { 
	var a = buscar(filtro);
	for (var i = 0 ; i < a.length ; i++) {
		a[i]._state.visivel = true;
	}
}

function visivel(filtro) {
	var a = buscar(filtro);
//	console.log(a)
	for (var i = 0 ; i < a.length ; i++) {
		if (a[i]._state.visivel !== false) return true;
	}	
	return false;
}

// *** estaLivre
// Retorna se o objeto nao colide com ninguem
function estaLivre(target) {
	var result = true;
	for (var i = 0 ; i < game.sprite().length ; i++) {
		if (game.sprite(i).colide(target) && game.sprite(i)._id != target._id) {
			result = false;
			break;
		}
	}
	return result;
}

// buscar()
// pedro.sacramento
//
// Efetua a busca de um conjunto de um ou mais
// elementos.
// Esta funcao eh o cerne deste framework
// e seu objetivo eh permitir consultas
// com boa flexibilidade, tornando desnecessario
// o uso de IDs na hora de criar conteudos
// interativos. A manipulacao de sprites por meio
// de consultas funciona de maneira analoga aos
// seletores css, e promove o desenvolvimento da
// aplicacao de maneira desacoplada a engine.
//
// As buscas sao orientadas pelo que eh definido
// num arquivo de taxonomia, como no exemplo abaixo:
/*
Exemplo: de taxonomia
=====================
	coisa
	.cadeira
	.animal
	..gato
	..cachorro

Exemplos de consulta
====================
	buscar('gato') // retorna gatos
	buscar('cachorro') // retorna cachorros
	buscar('animal') // retorna gatos e cachorros
	buscar('coisa') // retorna gatos, cachorros e cadeiras
*/
function buscar(a) {
	var args = arguments;
	var obj = game.sprite();

	if (args.length > 1) obj = args[1];

	var results = [];
	// Busca por ID
	if (a == null)
		results = [];
	else
	if (typeof(a) == 'string') {
		var vals = descendencia(a);
		for (var i = 0 ; i < obj.length ; i++) {
			if (vals.indexOf(obj[i].conceito()) != -1)
				results.push(obj[i]);
		}
	}
	// Busca por indice no array "obj"
	else
	if (typeof(a) == 'number')
		results = [obj[a]];
	else
	// 2017-07-14
	if (a.constructor.name == 'Array')
		results = a;
	// TODO: verificar se isso nao da problema...
	else
	if (typeof(a) == 'object')
		results = [a];

	return results;
}

function esquerda(filtro) {
	var result = [];
	var desc;
	var a = buscar(filtro);
	for (var i = 0 ; i < game.sprite().length ; i++) {
		desc = descendencia( game.sprite(i).conceito() );
	}
}

// Retorna um array ordenando os objetos da direita para a esquerda
function direita(a) {
	if (typeof(a) == 'string') {
		var filtro = descendencia(a);
		var result = [];
		for (var i = 0 ; i < game.sprite().length ; i++) {
			if (filtro.indexOf(game.sprite(i).conceito()) != -1)
				result.push(game.sprite(i));
		}
	} else
	if (typeof(a) == 'object') {
		result = a;		
	}

	result.sort(function (a,b) {
		return b._state.transform.x - a._state.transform.x;
	});

	return result;
}

function colisoes(a) {
	var filtro = descendencia(a);

	var result = [];
	var colisao = [];

	var l;

	// A principio ninguem colidiu com ninguem
	for (var i = 0 ; i < game.sprite().length ; i++)
		colisao[i] = false;

	// TODO: Fazer isso de maneira mais eficiente
	// Verifica se o objeto colide com algum outro
	for (var i = 0 ; i < game.sprite().length ; i++) {
		for (var j = 0 ; j < game.sprite().length ; j++) {
			if (i == j) continue;
			l = game.sprite(i).colide(game.sprite(j));
			if (!colisao[i] && l && i != j) {
				colisao[i] = l;
				colisao[j] = l;
			}
		}
	}
	return colisao;
}

// *** livre
// Retorna uma lista com objetos que nao
// colidem com ninguem
function livre(a) {
	var filtro = descendencia(a);
	var result = [];
	var colisao = colisoes(a);

	// Seleciona os objetos *livres* compativeis com o filtro
	for (var i = 0 ; i < game.sprite().length ; i++) {
		// Seleciona dentre todos os objetos aqueles que sao:
		if (
			// Livres
			!colisao[i]
			&&
			// Compativeis com o filtro passado para a funcao
			filtro.indexOf(game.sprite(i).conceito()) != -1
		)
			result.push(game.sprite(i));
	}

	return result;
}

function ocupado(a) {
	var filtro = descendencia(a);
	var result = [];
	var colisao = colisoes(a);

	// Seleciona os objetos *ocupados* compativeis com o filtro
	for (var i = 0 ; i < game.sprite().length ; i++) {
		// Seleciona dentre todos os objetos aqueles que sao:
		if (
			// ocupados
			colisao[i]
			&&
			// Compativeis com o filtro passado para a funcao
			filtro.indexOf(game.sprite(i).conceito()) != -1
		)
			result.push(game.sprite(i));
	}

	return result;
}
