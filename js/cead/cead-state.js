var Estado = function (id, regra, transicao) {
	this._id = id;
	this._regra = regra;
	this._regra_js = eval('(function () { return ('+regra+'); })')
	this._transicao = transicao;
}

Estado._estado = [];
Estado._id = 'inicio';

// Da o indice do estado a partir de seu id
function estado_index() {
	var args = arguments;
	for (var i = 0 ; i < Estado._estado.length ; i++) {
		if (Estado._estado[i]._id == args[0])	{
			return i;
			break;
		}
	}
	return -1;
}

function estado() {
	var args = arguments;
	// Cria um novo estado
	if (args.length == 0) {
		return Estado._id;
	}

	if (args.length == 3) {
		var id = args[0];
		var regra = args[1];
		var transicao = args[2];
		var e = new Estado(id, regra, transicao);
		Estado._estado.push( e );
	}
	// Tenta ir para um estado qualquer
	if (args.length == 1) {
		// Lista os indices dos estados validos a partir do atual
		var validos = [Estado._id];
		validos = validos.concat(Estado._estado[ estado_index(Estado._id) ]._transicao);

		//
		if (validos.indexOf(args[0]) != -1) {
			console.log('Assumindo novo estado', args[0]);
			Estado._id = args[0];
		} else {
			console.log('Impossivel assumir estado', args[0]);
		}
	}
}
