var camelCase = function (myString) {
	return myString.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

function construir() {
	$('svg').find('*[id^="cead-"]').each(function () {
		var id = $(this).attr('id');
//			if (id.indexOf('cead-') != -1)

		var attr = id.split('-');
		var cat = attr[1];
		//
		attr.shift();
		attr.shift();
		//
		var label = attr.join('-');

		// FIXIT:
		var transform = $(this)
			.attr('transform')
			.split('translate')[1]
			.split('(')[1]
			.split(')')[0]
			.split(',');

		var i = CeadSprite._sprite.length;

		CeadSprite._sprite[i] = new CeadSprite({
			id: id,
			dom: this,
			label: label,
			state: {
				id:id, // Seletor do objeto no DOM
				categoria:cat,
				x:parseFloat(transform[0]),
				y:parseFloat(transform[1]),
				destacado:false
			}
		});

		CeadSprite._sprite[i].dom().attr('data-id',id);

		CeadSprite._sprite[i].destacado( CeadSprite._sprite[i].state().destacado );
	
		// Seleciona algum objeto
		CeadSprite._sprite[i].dom().click(function () {
			//
			var id = $(this).attr('data-id');
			//
			var bool,_source = '',_target = '';

			// Muda o objeto origem
			if (CeadSprite._state.acao == '') {
				if (CeadSprite._state.selecao[0] != id) {
					CeadSprite._state.selecao[0] = id; // ORIGEM
				} else {
					CeadSprite._state.selecao = []; // ORIGEM
				}
			}
			else
			//  Efetua a interacao entre 2 objetos, se houver 2 selecionados
			if (CeadSprite._state.acao != '' && CeadSprite._state.selecao.length >= 1)
			{
				CeadSprite._state.selecao[1] = id; // DESTINO

				// Efetua a acao partindo do primeiro objeto clicado (source)
				var obj = objeto( CeadSprite._state.selecao[0] );

				//
				obj.acao();
			
				// Limpa a selecao, liberando para a proxima acao
				CeadSprite._state.selecao = [];
				CeadSprite._state.acao = '';
			}

			// DEBUG : Verifica a origem e o destino
			_source = (CeadSprite._state.selecao.length >= 1)?CeadSprite._state.selecao[0]:'';
			_target = (CeadSprite._state.selecao.length == 2)?CeadSprite._state.selecao[1]:'';

			//
			CeadSprite.acao();
		})
	});

	// Acoes do Menu
	$('.menu').on('click', 'button', function () {
		// Escolhe a acao
		var id = $(this).attr('data-id');
		//
		CeadSprite._state.acao = id;
		//
		CeadSprite.acao();
	});
}

var tax = [];

var _ = function () { }

var CeadSprite = function (data) {
	this._id = data.id;
	this._dom = $(data.dom);
	this._state = data.state;
}

function objeto(id) {
	for (var i = 0 ; i < CeadSprite._sprite.length ; i++) {
		if (CeadSprite._sprite[i]._id == id) return CeadSprite._sprite[i];
	}
}

// Atualiza o menu de acordo com o objeto atual
function updateMenu() {
	var obj;

	// O objeto atual eh o ultimo que foi selecionado
	// se nao houver nada selecionado, o atual sera o palco
	if (CeadSprite._state.selecao.length == 0)  {
	 // TODO: Fazer um seletor mais generico
		obj = objeto('cead-_palco');
	} else {
		//
		obj = objeto(CeadSprite._state.selecao[CeadSprite._state.selecao.length-1]);
	}
	//
	obj.updateMenu();
}

// Retorna se a ação é válida para o estado atual ou para algum dos estados de transição
CeadSprite.prototype.acao = function () {
	var args = arguments;
	var source = this;
	var target;
	var acao = 'acao'+ucCamel(CeadSprite._state.acao);
	// Executa a acao
	return this[acao]();
}

CeadSprite.acao = function () {

	// TODO : Verifica as transicoes validas e
  // destaca na tela os objetos que, sendo clicados
	// conduzirao o usuario a alguma delas
	// os demais objetos nao serao destacados

	// Executa todos os testes
/*
	var bool, t;
	if (CeadSprite._state.selecao.length > 0) {
		var obj = objeto( CeadSprite._state.selecao[0] );
		// TODO: Salvar o estado de toda a aplicacao aqui(?)
		var _state;
		for (var i = 0 ; i < CeadSprite._sprite.length ; i++) {
			// TODO: Read state
			_state = CeadSprite._sprite[i].state();
			console.log(_state)
			// TODO: Analisar aqui se a acao eh possivel nas condicoes atuais
			CeadSprite._sprite[i].acao( obj ); // REMOVER ISSO

			// Verifica se a transicao eh valida a partir do estado atual
			t = transicoes(CeadSprite._state.id);
			//
			bool = (t.length > 0);
			//
			CeadSprite._sprite[i].destacado(bool);
			// TODO: RESTAURAR O ESTADO ATUAL
			CeadSprite._sprite[i].state(_state);
		}
	}
*/

	// Atualiza o menu
	updateMenu();

	// Atualiza os objetos destacados na tela
	// Destaca os objetos que devem ser destacados no momento
	for (var i = 0 ; i < CeadSprite._sprite.length ; i++) {
		bool = (CeadSprite._state.selecao.indexOf(CeadSprite._sprite[i]._id) != -1);
		CeadSprite._sprite[i].destacado(bool);
	}
	return;
/*
			// Aqui estamos pressupondo relacao binaria
			// (cada objeto pode interagir com exatamente
			// um outro objeto), mas isso pode ser mudado
			// posteriormente. A estrutura de dados eh array
			// ja para facilitar esse tipo de mudanca no futuro
			// Objeto destino
*/
//				console.log('Acao',CeadSprite._state)
/*
			// Destaca o objeto atual, se existir
			if (CeadSprite._state.selecao.length) {
				console.log( CeadSprite._state.selecao.length );
			}
				// Objeto origem
				_objeto = CeadSprite._state.selecao[0];

				// Realiza a acao referente ao objeto atual
				if (_objeto != '') {
					var o = objeto(_objeto);
					o.acao( a );
				}
*/


	//
//	acao();

	//

/*
	var tipo = (typeof(a) == "string")?"acao":"objeto";

	//
	var _acao = CeadSprite._state.acao;

	// *** SELECAO *** //
	switch (tipo) {
		// Seleciona um objeto
		case "objeto":
			CeadSprite._state.selecao.push(a._id);
		break;
		
		// Seleciona uma acao
		case "acao":
			// TODO:
			// Resolver acoes que nao exigem 2 objetos.
			// Solucao: talvez ter um acao do palco, que
			// resolve acoes que nao precisam de 2 objetos
			// e acoes que estao atreladas ao tempo
			CeadSprite._state.acao = a;
		break;
	}
*/
}

function taxonomia(t) { tax = arguments; }

// Verifica se o objeto atual esta em contato com o objeto passado por parametro
CeadSprite.prototype.contato = function (b) {
	return (this._state.x == b._state.x && this._state.y == b._state.y);
}

CeadSprite.prototype.destacado = function (bool) { 
	// Objetos com id "cead-_" sao objetos nao interativos,
  // e por isso nao podem ser destacados
	if (this._id.indexOf('cead-_') != -1) return;

	//
	if (bool)
		this._dom.attr("style","filter:url(#disponivel)");
	else
		this._dom.attr("style","");

	this._state.destacado = bool;
}

CeadSprite.prototype.transform = function () {
	var args = arguments;
	if (args.length) {
		var data = args[0];
		this.transformTranslate(data);
	} else
		return this._transform;
}

CeadSprite.prototype.transformTranslate = function () {
	var args = arguments;
	var data = args[0];
	// Setter
	if (args.length) {
		// Atualiza o estado
		this._state.x = data.x;
		this._state.y = data.y;

		// Atualiza no DOM
		var t = 'translate('+data.x+','+data.y+')';
		this._dom.attr('transform', t);	
	} else {
		return { x:this._state.x, y:this._state.y  };
	}
}

// 
CeadSprite.prototype.aproximar = function (obj) { this.transformTranslate(obj.transformTranslate()); }

// *** Menu
// Atualiza o menu de acordo com o item selecionado
// Tenta atualizar o menu de acordo com o conceito
// mais especifico capaz de descrever o item.
// Exemplo: se é um erlenmeyer, busca algo como "updateMenuErlenmeyer"
// Se nao houver uma instrucao de menu especifica para o erlenmeyer
// o algoritmo ira subir a arvore em busca da primeira instrucao 
// de menu possivel para o erlenmeyer.
// Exemplo: tenta menu de erlenmeyer. Se nao houver, tenta menu devidraria,
// se nao houver, usa o menu generico, de coisa.
CeadSprite.prototype.updateMenu = function () {
	var cat = this._state.categoria;

	var cats = ascendencia(this._state.categoria);
	var fn;

	for (var i = cats.length - 1; i >= 0 ; i--) {
		fn = 'updateMenu' + ucCamel(cats[i]);
		if (typeof(this[fn]) == 'function') {
			this[fn]();
			break;
		}
	}
}

CeadSprite.prototype.dom = function () {
	return this._dom;
}

CeadSprite.prototype.state = function () {
	var args = arguments;
	// Getter
	if (args.length == 0) {
		var result = JSON.stringify(this._state);
		return result;
	}
	// Setter
	else {
		var state = JSON.parse(args[0]);	
		console.log(state)
		// TODO: Mudar a estrutura do estado para permitir
		// "this.transform(state.transform)"
		this.transform({x:state.x,y:state.y});
	}

	return this._state;
}

// Verifica se o objeto se enquadra no conceito fornecido
// Ex.: Erlenmeyer é uma vidraria? (elenmeyer.filtro('vidraria')) => true (SIM!)
CeadSprite.prototype.compativel = function (conceito) {
	var tags = descendencia(conceito);	
	for (var i = 0 ; i < tags.length ; i++) {
		if (tags[i] == this._state.categoria) return true;
	}
	return false;
}

function svg(nome) {
	for (var i = 0 ; i < CeadSprite._sprite.length ; i++) {
		if (CeadSprite._sprite[i]._id.indexOf(nome) != -1) return CeadSprite._sprite[i];
	}
}

var replaceAll = function(data, search, replacement) {
	var target = data;
	return target.split(search).join(replacement);
  //return target.replace(new RegExp('['+search+']', 'g'), replacement);
};
var countChar = function (data, search) {
	var target = data;
	var regexp = new RegExp('['+search+']', 'g');
	return (target.match(regexp) || []).length
}

function ascendencia(filtro) {
	var result = [];
	var level = -1;
	var l,label;
	var breadcrumb = [];
	
	for (var i = 0 ; i < tax.length ; i++) {
		label = replaceAll(tax[i],'.','');		
		l = countChar(tax[i],'.');
		breadcrumb[l] = label;
		if (label == filtro) break;
	}

	return breadcrumb;
}

function descendencia(filtro) {
	var result = [];
	var level = -1;
	var l,label;
	
	for (var i = 0 ; i < tax.length ; i++) {
		if (replaceAll(tax[i], '.','') == filtro || level >= 0) {
			l = countChar(tax[i],'.');
			if (l <= level) break;
			label = replaceAll(tax[i],'.','');
			if (level == -1) level = l;
			result.push(label)
		}
	}

	return result;
}

function aproximar(a,b) { svg(a).aproximar(svg(b)); }

// Destaca os objetos cujo conceito
// é compativel com o filtro
function destacar(filtro) {
	var bool;
	//
	for (var i = 0 ; i < CeadSprite._sprite.length ; i++) {
		bool = (CeadSprite._sprite[i].compativel(filtro));
		console.log(bool)
		CeadSprite._sprite[i].destacado(bool);
	}
}

//
function ucfirst(str) {
	var string = str.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}

$(function () {
	// Realiza a analise automatizada do SVG
	construir();
	//
	init();

	$('.container').show();	
});

// FIXIT
CeadSprite._state = { id: '', selecao:[], acao:'', contador:0 };

CeadSprite._states = {};
CeadSprite._sprite = [];
CeadSprite._button = [];

function ocupado() {
	var args = arguments;
	var me = svg(args[0]);

	var result = false;
	if (!me) return false;

	// Verifica se um objeto colide com outro
	if (args.length == 1) {
		for (var i = 0 ; i < CeadSprite._sprite.length ; i++) {
			// Evita teste de contato do objeto com ele mesmo
			if (me._id == CeadSprite._sprite[i]._id) continue;
			var c = me.contato(CeadSprite._sprite[i]);		
			// 
			if (c)
				return true;
		}
		return false;
	}
	// Verifica se o objeto colide com outro,
	// sendo o outro de um conceito especifico
	else
	if (args.length == 2){
		var target = svg(args[1]);
		return me.contato(target);
	}
}

// Verifica se a condicao atual eh uma condicao de transicao valida
// ou seja, se:
// - o jogo eh valido de acordo com o estado atual
// - o jogo eh valido de acordo com algum estado de transicao
function transicoes(e) {
	// Pega o id do estado atual
	var est = [CeadSprite._states[e].id];
	// Pega o id dos estados de transicao validos
	var trn = CeadSprite._states[e].transicao;
	//
	var lst = est.concat(trn);
	//
	var result = [];
	//
	for (var i = 0 ; i < lst.length ; i++) {
		if ( CeadSprite._states[lst[i]].regra_compilada() ) {
			result.push(lst[i]);
		}
	}
	return result;
}

function estado() {
	var args = arguments;
	var e = args[0];

	if (args.length == 1) {
		if ( CeadSprite._states[e].regra_compilada() ) {
			CeadSprite._state.id = args[0];
			console.log('Estado','Sucesso! Assumido o estado "'+args[0]+'".')
		} else {
			console.log('Estado','Erro! A situação atual não é válida para o estado "'+args[0]+'".')
		}
	} else {
		var id = args[0];
		var s = '';
		var regra = args[1];
		var regra_js = '(function () { return ('+args[1]+'); })';
		CeadSprite._states[id] = {
			id: id,
			regra: args[1],
			regra_compilada: eval(regra_js),
			transicao: args[2]
		};
	}
}

// Cadastro de botoes
function botao() { var args = arguments; CeadSprite._button[args[0]] = args[1]; }

function ucCamel(str) {
	return ucfirst(camelCase(str));
}

function menu(m,data) {
	CeadSprite.prototype['updateMenu'+ucCamel(m)] = function () {
		$('.menu .item').remove();
		$('.menu .label').text(this._id)
		for (var i = 0 ; i < data.length ; i++){
			$('.menu').append('<button class="item" class="acao" data-id="'+data[i]+'">'+CeadSprite._button[data[i]]+'</button>');
		}
	};
}


// *** ACOES
function acao(id, f) { CeadSprite.prototype['acao'+ucCamel(id)] = f; }
//
acao('mover', function () {
	// Verifica se existem 2 objetos selecionados (source e target)
	// pois isso eh condicao necessaria para esta acao
	if (CeadSprite._state.selecao.length == 2) {
		target = objeto(CeadSprite._state.selecao[1]);
		this.aproximar( target );
		return true;
	} else
		return false;
});
