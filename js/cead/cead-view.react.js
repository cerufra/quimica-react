"use strict";

var GameSprite = React.createClass({
	render: function () {
		var props = this.props.data;

		var cx = -props._state.transform.cx * props._state.transform.width;
		var cy = -props._state.transform.cy * props._state.transform.height;

		//https://facebook.github.io/react/docs/handling-events.html
		var handleClick = function (e) {
			// Clica sobre o objeto
			game.click(get(props._id));
			// Evita que os pais tambem sejam clicados
			// https://stackoverflow.com/questions/1369035/how-do-i-prevent-a-parents-onclick-event-from-firing-when-a-child-anchor-is-cli
			e.stopPropagation();
		}

		var children = [];
		for (var i = 0 ; i < props._state.child.length ; i++) {
			children.push(<GameSprite data={props._state.child[i]} />);
		}

		var asset = 'img/'+props._state.conceito+'.png';

		// Classes
		// 2017-07-17
		var cls = "";
		cls += (props._state.acao)?"sprite-clickable ":"";
		if (props._state.destaque == "target")
			cls += "sprite-target ";
		if (props._state.destaque == "other")
			cls += "sprite-other ";
		if (props._state.visivel === false)
			cls += "sprite-hidden ";

		// TODO: Reduzir o numero de elementos do DOM aqui usando apenas um elemento
		// para o qual seja computada a matriz de transformacao de acordo com
		// a translacao e a rotacao fornecidas
		return (
				<g className={cls} transform={"translate("+props._state.transform.x+","+props._state.transform.y+")"} onClick={handleClick}>
					<g transform={"rotate("+props._state.transform.rotate+")"}>
						<image xlinkHref={asset} x={cx} y={cy} />
						<g>{children}</g>
					</g>
				</g>
		);
	}
});

var Jogo = React.createClass({
  render: function()
	{
		var sprites = [];

		for (var i = 0 ; i < this.props.sprites.length ; i++) {
			sprites.push(<GameSprite data={this.props.sprites[i]} />);
		}

    return (
      <svg
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink= "http://www.w3.org/1999/xlink"
				width={this.props.width}
				height={this.props.height}
				version="1.1"
			>
				<defs>
					<filter id="sprite-target" height="300%" width="300%" x="-75%" y="-75%">
						<feMorphology operator="dilate" radius="4" in="SourceAlpha" result="thicken" />
						<feGaussianBlur in="thicken" stdDeviation="10" result="blurred" />
						<feFlood floodColor="rgb(0,186,255)" result="glowColor" />
						<feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />
						<feMerge>
							<feMergeNode in="softGlow_colored"/>
							<feMergeNode in="SourceGraphic"/>
						</feMerge>
					</filter>
				</defs>
				<defs>
					<filter id="sprite-other" height="300%" width="300%" x="-75%" y="-75%">
						<feMorphology operator="dilate" radius="4" in="SourceAlpha" result="thicken" />
						<feGaussianBlur in="thicken" stdDeviation="10" result="blurred" />
						<feFlood floodColor="rgb(255,255,0)" result="glowColor" />
						<feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />
						<feMerge>
							<feMergeNode in="softGlow_colored"/>
							<feMergeNode in="SourceGraphic"/>
						</feMerge>
					</filter>
				</defs>
				<g>
				{sprites}
				</g>
			</svg>
    );
  },

});

var mainElement = document.querySelector("main");

// TODO:
// Usar algo padrao de animacao do React
// https://github.com/react-native-community/react-native-svg/issues/180

// *** spriteTree
// pedro.sacramento
// 2017-07-12
// Constroi uma arvore a partir da lista de sprites.
// Essa arvore sera utilizada para definir a hierarqui do DOM no SVG
// Ela é reconstruída a toda iteracao do render do ReactJS, o que é CPU intensive,
// mas da muita liberdade para o programador, que passa a poder mudar
// a posicao dos objetos na arvore de maneira livre sem quaquer esforço
// Obviamente, esse codigo ainda pode ser otimizado, o que é bem vindo =)
function spriteTree(s, parent) {
	var result = [];
	var c = 0;

	// Filtra apenas os filhos do item atual
	for (var i = 0 ; i < s.length ; i++) {
		if (s[i]._state.pai == parent) {
			result[c] = s[i];
			result[c]._state.child = spriteTree(s,result[c]._id);
			c++;
		}
	}

	return result;
}

var count = 0;
var arvore;

// pedro.sacramento
// 2017-07-12
// Essa funcao calcula os atributos dinamicos dos sprites
function computeAttr(spr) {
	// Cria um clone da tela, pois essa rotina é destructive
	var tela = JSON.parse(JSON.stringify(game.sprite()));

	// Ordena os sprites de acordo com a variavel "depth"
	tela.sort(function (a,b) { return (a._state.depth - b._state.depth); });

	// Calcula dinamicamente o pai de cada objeto
	var result = [];
	for (var i = 0 ; i < tela.length ; i++) {
		if (typeof(tela[i]._state.pai) == 'string') {
			tela[i]._state.pai = id(tela[i]._state.pai);
		}
	}

	return tela;
}

function render() {
	if (!game) return;
	// Cacula dinamicamente quem eh o pai
	// de cada um dos objetos na tela
	var tree = spriteTree(computeAttr(game.sprite()), -1);

	if (tree.length == 0) return;

	ReactDOM.render(React.createElement(Jogo, {
		sprites: tree,
		width:canvasWidth,
		height:canvasHeight
	}), mainElement);
}

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

// Animacao
(function animloop(){
  requestAnimFrame(animloop);
  render();
})();
