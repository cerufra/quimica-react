var canvasWidth = 960;
var canvasHeight = 540;

function canvasSize(w,h) {
	canvasWidth = w;
	canvasHeight = h;
}

var sprites = [];

function add() {
	var args = arguments;
	for (var i = 0 ; i < args.length ; i++) {
		sprites.push(args[i]);
	}
}

function sprite(a,b) {
	var index = game.sprite().length;
	var s = new CeadObjeto();

	s._id = index;
	s._state.conceito = a;
	s._state.visibilidade = b.visibilidade;
	s._state.pai = (b.pai == null)?-1:b.pai;
	s._state.data = (b.data == null)?{}:b.data;
	s._state.depth = index;

	// TESTE
	s._state.acao = b.acao;
	s._state.transform.x = b.transform.x;
	s._state.transform.y = b.transform.y;
	s._state.transform.cx = b.transform.cx;
	s._state.transform.cy = b.transform.cy;
	s._state.transform.width = b.transform.width;
	s._state.transform.height = b.transform.height;
	s._state.transform.rotate = b.transform.rotate;

	//
	game.sprite()[index] = s;
	return game.sprite()[index];
}
