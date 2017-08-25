function click(needle) {
	game.click(get(needle));
}

// *** menuClick
// Executa uma acao em nome de alguem
function menuClick(obj) {
	var id = obj.id;
	var cmd = obj.action;
	var target = get(id);

	// Se a acao envolve somente um objeto,
	// remove o destaque do objeto atual na tela
	if (!obj.target) {
		naoDestaque(destaque());
		//
		acao(target, cmd);
	}
	// Se a acao envolve mais de um objeto,
	// mantem o destaque e muda o estado do 
	// objeto para "selecionado"
	else {
		// Muda o estado do objeto para selecionado
		//target.selected(true);
		// Armazena os dados para que o objeto interaja com
		// o proximo objeto clicado
		target.data('action',{
			action: cmd,
			target: obj.target
		});
		// TODO:
		// 2017-07-14
		// verificar se isso esta OK
		// Destaca os objetos que podem ser clicados para a interacao
		//naoDestaque(destaque());
		destaque(obj.target, "other");
	}

	//
	escondeMenu();
}
// CeadGame
var CeadGame = function () { this._sprite = []; }
CeadGame.prototype.init = function (data) {
	// FIXIT: Nao usar metodo estatico aqui...
	CeadObjeto.init(data);
}

function escondeMenu() { $('.game-menu a').remove(); }

// TODO: (talvez...)
// 2017-07-13
// Deixar tudo no SVG sem boostrap?
function menu() {
	var args = arguments;
	if (args.length == 2) {
		var conceito = args[0];
		var m = args[1];
		// Setter
		CeadMenu._menu[conceito] = m;
	}
	// Getter
	// Exibe o menu de acordo com o objeto clicado
	if (args.length == 1) {
		var target = args[0];
		var action = menus(target);

		//
		escondeMenu();

		var p,d,rule;
		for (var i = 0 ; i < action.length ; i++) {
			rule = (action[i].rule)?action[i].rule:'true';
			rule = rule.split('this').join('get('+target.id()+')');

			d = "{"+
				// Id do objeto que chama a acao
				"id:"+target.id()+","+
				// Acao a ser executada em nome do objeto
				"action:'"+action[i].action+"',"+
				// Caso a acao seja combinada
				"target:"+((action[i].other)?"'"+action[i].other+"'":false)+
			"}";
			
			
			if (!eval(rule)) continue;			

			p = $('<a href="#" class="btn btn-default" onclick="menuClick('+d+')" role="button" />');
			p.text(action[i].text);
			$('.game-menu').append(p);
		}
	}	
}

// 2017-07-17
// Verifica se o objeto
// faz parte de um grupo
function isA(_a,_b) {
	var a = buscar(_a);
	var b = buscar(_b);

	var result = existe(AND(a,b));

	return result;
}

// 2017-07-14
CeadGame.prototype.click = function (target) {
	// TODO:
	// Fazer ele migrar para o proximo estado valido
	// talvez com uma abordagem gulosa
	if (!target._state)
		return;
	
	// *** Ação Pendente *** //
	// Objeto com acao pendente
	var source = get( selecao() );
	// acao pendente
	var action = (source)?source.data("action"):false;

	// Cancelar a acao
	// ===============
	// Se o usuario esta clicando em um
	// objeto que ja estava selecionado,
	// cancela a acao do objeto
	if (isA(source,target)) {
		// Desmarca a selecao atual
		naoSelecao(selecao());
		// Remove a acao agendada, se houver
		source.data("action",null);
		// Defaz o destaque na tela
		naoDestaque(destaque());
		// Esconde o menu
		escondeMenu();

		return;
	}

	// 
	if (!existe(selecao()) || !action) {
		// Desmarca o ultimo selecionado
		naoSelecao(selecao());

		// Se possui menu, seleciona o objeto
		if (existe(menus(target)))
			selecao(target); 

		// Executa a acao referente ao objeto
		// Note que somente objetos com menu podem ser selecionados
		// Os demais objetos tem sua ação executada sem
		// assumir o estado "selecionado"
		if (target.acao())
			acao(target);

		// Atualiza o menu de acordo com o objeto clicado
		menu(target);
	}
	// Ação "pendente" (source.data("action"))
	// =======================================
	// Esta solucao serve para amparar casos em que
	// uma ação ficou pendente por exigir que um segundo
	// objeto seja selecionado.
	// Exemplo: a acao de mistura entre duas substancias
	else {
		// Lista os objetos candidatos para completar a ação pendente
		var candidates = buscar( action.target );

		// Se o objeto atual pode ser alvo da ação agendada,
		// prossegue com a acao
		if (isA(target, candidates)) {
			// Fornece o segundo objeto necessario para a acao do source
			action.target = target.id();
			// Executa a acao do objeto source
			acao(source, action.action);
			// Desfaz a selecao do objeto atual
			naoSelecao(selecao());
			// Remove o destaque dos candidatos a completar a acao
			// se houver
			naoDestaque(destaque());
			// Remove a acao pendente
			source.data("action",null);
		} else {
			// 2017-07-18
			// Executa a acao referente ao objeto clicado no momento
			// ou seja, nao se trata da realizacao de uma acao pendente
			// pois apesar de haver acao pendente, ela nao
			// pode ser concluida com o objeto clicado no momento.
			// Exemplo: o usuario clicou em uma vidraria e escolheu a opcao
			// misturar. Se ele clicar em um objeto qualquer na tela
			// (exemplo: um papel) a acao do papel sera executada
			// (target.acao()), e nao uma acao de mistura entre solucao e papel,
			// pois soh eh possivel misturar uma solucao com outra solucao,
			// e um papel nao eh uma solucao.
			if (target.acao()) {
				acao(target);
				naoSelecao(selecao());
			}
		}
	}

	//
	return target;
}

// AND:
// Retorna a interseção de dois arrays
// TODO:
// 2017-07-14
// Fazer isso mais eficientemente
function AND(a,b) {
	var result = [];
	var ids = [];
	var res = {};

	// Verifica pairwise a intersecao entre os arrays (O(n²))
	for (var i = 0 ; i < a.length ; i++) {
		for (var j = 0 ; j < b.length ; j++) {
			if (a[i]._id == b[j]._id) res[a[i]._id] = a[i];
		}
	}

	//
	for (var i in res) result.push(res[i]);
	
	// Retorna a intersecao entre as 2 listas
	return result;
}

// AND:
// Retorna a união entre dois arrays
// TODO:
// 2017-07-17
// Fazer isso mais eficientemente
function OR(_a,_b) {
	var result = [];
	var ids = [];
	var res = {};
	var a = buscar(_a);
	var b = buscar(_b);

	// Verifica pairwise a intersecao entre os arrays (O(n²))
	for (var i = 0 ; i < a.length ; i++) {
		res[a[i]._id] = a[i];
	}
	for (var j = 0 ; j < b.length ; j++) {
		res[b[j]._id] = b[j];
	}

	//
	for (var i in res) result.push(res[i]);
	
	// Retorna a intersecao entre as 2 listas
	return result;	
}

// Faz a intersecao/soma com 2 sets (interessante para filtrar respostas)
// function E(a,b) { }; function OU(a,b) { }

// CeadMenu
var CeadMenu = function () { }
// Pega o menu cujo conceito seja
// o mais proximo possivel do objeto
// clicado
CeadMenu.get = function (conceito) {
	
}

CeadMenu._menu = {};

// Lista as acoes de um objeto
function menus(target) {
	var asc = ascendencia(target.conceito());
	var result = [];

	// TODO:
	// 2017-07-12
	// Colocar isso no CeadMenu.prototype.get()
	for (var i = asc.length-1 ; i >= 0 ; i--) {
		if (CeadMenu._menu[asc[i]]) {
			result = CeadMenu._menu[asc[i]];
			break;
		}
	}
	return result;
}

CeadGame.prototype.sprite = function () {
	var args = arguments;
//	return this._sprite; // TODO:
	if (args.length == 0)
		return CeadObjeto._sprite;
	else
		return CeadObjeto._sprite[args[0]];
}
CeadGame.prototype.save = function () {
	return JSON.stringify(this._sprite);
}
CeadGame.prototype.load = function () {
	this._sprite = JSON.parse(this._sprite);
}

var CeadObjeto = function () {
	this._id = 0;
	this._state = {
		conceito:'',
		transform: {
			x:0,
			y:0,
			cx:0,
			cy:0,
			rotate:0
		},
		child: [],
		asset:'',
		pai:-1,
		depth:-1
	}
}

CeadObjeto.prototype.pai = function () { return this._state.pai; }

// 2017-08-25
CeadObjeto.prototype.attr = function (name, val) {
	var args = arguments;
	var name = args[0];

	if (args.length > 1) {
		var val = args[1];
		this['_'+name] = val;
	}
	else {
		return this['_'+name]
	}
}

CeadObjeto.prototype.conceito = function () {
	var args = arguments;
	if (args.length == 0)
		return this._state.conceito;
	else {
		this._state.conceito = args[0];
		return this;
	}
}

// 2017-07-14
// Retorna o objeto que sera alvo da acao do objeto atual
// na proxima acao.
// Exemplo: se eu selecionar o objeto "sal", escolher a acao "misturar"
// e depois clicar em "sal", o objeto "agua" passa a ter como target
// o objeto "sal". Essa condicao permanecera ate o momento em que a
// interacao entre os dois for finalizada
CeadObjeto.prototype.other = function () {
	return get(this.data("action").target);
}

CeadObjeto.prototype.data = function () {
	var args = arguments;
	// Getter (all)
	if (args.length == 0) {
		return this._state.data;
	}
	// Getter (single)
	if (args.length == 1) {
		return this._state.data[args[0]];
	}
	// Setter
	if (args.length == 2) {
		this._state.data[args[0]] = args[1];
		return this;
	}
}

// TODO:
// Tirar todos os metodos estaticos para facilitar
// a manipulacao de "universos paralelos" (ex.: tempo t-1)
CeadObjeto.saveSnapshot = function () {
	var a = [];

	for (var i = 0 ; i < CeadObjeto._sprite.length ; i++)	{
		a.push(CeadObjeto._sprite[i]);
	}

	var snap = JSON.stringify(a);
//	CeadObjeto._snapshot[id] = snap;

	return snap;
}

CeadObjeto.loadSnapshot = function (snap) {
//	var a = JSON.parse( CeadObjeto._snapshot[id] );
	var a = JSON.parse( snap );
	var p,id;
	CeadObjeto._sprite = [];
	for (var i = 0 ; i < a.length ; i++)	{
		//
		p = a[i];
		id = p.id;

		CeadObjeto._sprite[id] = new CeadObjeto(); //CeadObjeto._sprite[i]._state;
		CeadObjeto._sprite[id]._id = id;
		delete p.id;
		CeadObjeto._sprite[id]._state = JSON.parse(JSON.stringify(p));
	}
}

CeadObjeto.prototype.id = function () {
	return this._id;
}

CeadObjeto.prototype.asset = function (a) {
	this._state.asset = a;
}

CeadObjeto.prototype.acao = function () {
	var args = arguments;
	if (args.length == 0)
		return this._state.acao;
	else {
		this._state.acao = args[0];
		return this;
	}
}

CeadObjeto.prototype.colide = function (a) {
	return (
		this._state.transform.x == a._state.transform.x
		&&
		this._state.transform.y == a._state.transform.y
	);
}

CeadObjeto.prototype.hilight = function () {
	var args = arguments;
	// Setter
	if (args.length == 1) {
		this._state.destaque = args[0];
	}
	// Getter
	else {
		return this._state.destaque;
	}
}

CeadObjeto.prototype.selected = function () {
	var args = arguments;
	// Setter
	if (args.length == 1) {
		this._state.selected = (args[0] == true);
	}	
	// Getter
	else {
		return (this._state.selected === true)?true:false;
	}
}


CeadObjeto._sprite = [];

// *** Regras para
function inicio() { return true; }

// Estado inicial
estado("inicio", "true", ["passo1"] );
Estado._id = 'inicio';

CeadAPI = function () {

}
CeadAPI._opcoes = [];

CeadAPI.executar = function () {
	return CeadAPI._opcoes.join('\n');
}

CeadObjeto.init = function (data) {
	$.getScript( data.path+'/script.js', function() {
	//
		taxonomia(data.taxonomia);
		sprites = data.sprites;

		// TODO:
		// Desfazer essa parte do codigo
		// Se for o caso, fazer ajustes no construtor de CeadObjeto
		// Cria os sprites
		for (var i = 0 ; i < sprites.length ; i++) {
			var tipo = sprites[i].conceito;
			var s = sprite(tipo, sprites[i]);
		}

		// Regras de visibilidade (verificadas apos cada acao)
		for (var i = 0 ; i < CeadObjeto._sprite.length ; i++) {
			s = CeadObjeto._sprite[i];
			if (s._state.visibilidade) {
				s._state._visibilidade_js = eval('(function () { return ('+s._state.visibilidade+'); })')
			}
		}
		atualizaVisibilidade();
		
		iniciaVidraria();
	});
}

// *** ACAO
// Esta funcao acontece sempre que uma acao eh executada
// de modo que com ela é possível, por exemplo,
// criar um histórico das ações do usuário, pois
// nenhuma alteracao no ambiente acontece sem que
// ela seja chamada
function acao() {
	var args = arguments;
	var obj = args[0];

	// A acao pode ser a acao default do objeto (obj._state.acao)
	// ou uma acao passada como string para esta funcao (args[1])
	var a = (args.length > 1)?args[1]:obj._state.acao;
	//
	var args = arguments;
	// Objeto responsavel pela chamada da acao, se houver
	var _current = this;
	if (args.length > 1) _current = args[1];
	// Salva todo o estado atual do jogo
	//var s = CeadObjeto.saveSnapshot();
	var e = Estado._id;

	// Verifica os estados de destino validos
	var validos = [Estado._id];

	// Os estados validos de transicao podem ser definidos como um array ou como
	// uma funcao capaz de retornar o array
	var t = (typeof(Estado._estado[ estado_index(Estado._id) ]._transicao) == 'string')?
		eval(Estado._estado[ estado_index(Estado._id) ]._transicao):
		Estado._estado[ estado_index(Estado._id) ]._transicao;
	//.filter(function (a) { return (a.indexOf('(') == -1); })

	validos = validos.concat(t);

	// Executa a acao
	// Esse hack permite que a acao do objeto passe o objeto como parametro
	// para a funcao de acao (só assim consegui contornar problemas de escopo com eval).
	// Ex.: acao: "mover(this, 10,10)"
	// Mas estou tentando fugir disso, pois torna a busca por objetos
	// pouco funcional. O ideal seria mover('bequer',10,10)
	// Ou seja, de qualquer lugar que o comando for executado, sempre tera
	// o mesmo resultado, pois o resultado não é funcao de quem chama.
	var fn = a.split('this').join('obj');
	eval(fn);

	// Verifica se algum dos estados possiveis foi atingido
	// apos a acao atual.
	var pode = false;
	var mudou = false;

	// Aqui o algoritmo tera de ser guloso.
	// O primeiro estado valido possivel ser assumido.
	// O programador devera ser cuidadoso para nao cair em situacoes
	// imprevisiveis aqui, mas eh um preco a pagar pela praticidade
	// de ter os estados gerenciados automaticamente pela aplicacao.
	// Se as regras forem bem feitas (regras de validade dos estados)
	// isso devera ser benefico
	for (var i = 0 ; i < validos.length ; i++) {
		pode = (validos[i].indexOf('(') == -1)?
			Estado._estado[ estado_index(validos[i]) ]._regra_js():
			eval(validos[i]);
		if (pode) {
			// Verifica se o estado candidato
			// eh diferente do atual
			mudou = (validos[i] != e);
			// Se o candidato for diferente do atual
			// efetua a mudanca
			if (mudou) estado(validos[i]);
			
			break;
		}
	}
	
	// Atualiza a visibilidade dos objetos na tela
	atualizaVisibilidade();

	// DEBUG
	// Aqui apenas é feito um alerta sobre a mudanca de estado
	if (mudou)
		console.log(e,' => ',Estado._id)
	else
		console.log('NÃO houve mudança de estado')
	//CeadObjeto.loadSnapshot(s);
}

function atualizaVisibilidade() {
	for (var i = 0 ; i < CeadObjeto._sprite.length ; i++)	{
		if (CeadObjeto._sprite[i]._state.visibilidade) {
			CeadObjeto._sprite[i]._state.visivel = CeadObjeto._sprite[i]._state._visibilidade_js();
		}
	}
}
// 0 - Inicia o jogo
// 1 - Lista praticas
// 2 - Escolhe Determinacao de Ph com Phmetro
//	passo1 - Ja comeca com o phmetro sobre a lugar
//				tudo livre: nada na lugar, nem no phmetro nem no inventario
//	passo2 - O bequer e a solucao estao no inventario (concentracao e nome ja vem no rotulo)
// 	passo3 - O bequer e a solucao estao na lugar
// 	passo4 - O bequer esta ambientado (ambientar é: fazer uma primeira transferencia da solucao e descartar)
// 	passo5 - O bequer esta com a solucao
//	passo6 - O bequer esta no phmetro
//	passo7 - O phmetro da a leitura (obs.: um botao "resetar" permite retorno ao estado 1)

// Estados
estado("splash", "true", ["passo1"]); // Aqui as transicoes validas sao dadas explicitamente
estado("passo1", "!visivel('splash')", ["passo2","passo3"] );
estado("passo2", "existe(ocupado('prateleira'))", ["passo3"] );
estado("passo3", "existe(ocupado('lugar'))", ["passo1"] );
