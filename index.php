<!--
	TODO:	2017-07-14
	- Criar uma mini query-language para facilitar a selecao de objetos (2017-07-14)
	- Fazer o objeto cancelar o clique quando um objeto clicado estiver com menu disponivel exibido para o usuario ignorar o convite a acao, clicando sobre ele novamente na tela, o que sugere que ele quer cancelar a acao (2017-07-14)
	- Fazer os menus terem um atributo "rule" ou algo assim para que sua visibilidade seja controlada por uma funcao. Por exemplo: a vidraria pode ter uma opção "mover para bancada" que so aparece quando ela esta no armario. Por isso o menu seria definido por algo como {"text": Mover para a bancada"; "rule":"telaAtual('bancada')" ...} (2017-07-14)
	- Fazer um menu na tela inicial para cegos. Talvez renderizar audios gravado com lianetts (2017-07-14)
	- Fazer o reactjs ser capaz de atualizar os sprites runtime com as dimensoes corretas ao ser mudado o atributo "conceito" dos sprites (2017-07-13)
	- Reunir todos os arquivos em um só. Ex.: cead-framework.js (2017-07-13)
	- Criar a tela de administracao do professor, pois o framework ja vai aguentar o "tranco" (2017-07-12)
	- Possibilitar a importacao de arquivos SVG, uso de vetores criados runtime e mascaras de SVG (para animacao de fluidos enchendo recipientes) (2017-07-12)
	- Remover da cead-view.react.js a chamada estatica para CeadObjeto.click() (2017-07-12)
  - Otimizacao: Ao inves de executar eval toda vez que as acoes forem chamadas, realizar a compilacao
	  dessas acoes uma unica vez e deixa-las atreladas aos objetos (2017-07-12)
  - Singleton: Tirar todos os metodos estaticos "CeadObjeto.saveSnapshot()" e comecar a trabalhar com instancias de CeadGame (2017-07-12)
	- Fazer o render ficar atrelado ao relogio da maquina (se der lag, ele executa mais iteracoes, sem exibir na tela) (2017-07-12)
	- Fazer navegacao por hashtag, pelo menos para as telas (possibilitando o back/forward) (2017-07-11)

	DONE:
	- Fazer a funcao "moverPara" ser capaz de deslocar qualquer objeto para qualquer lugar, independentemente da hierarquia (2017-07-13)
	- Criar uma funcao de busca que trata todos os casos tipicos (ex.: foi passado ID, ou objeto ou string) e fazer a vidraria sair do armario para a bancada (2017-07-13)
	- Colocar _depth dentro de _state (2017-07-13)
	- Fazer com que o ID do pai não seja definido numericamente, mas a partir de uma query (ex.: pai: buscar('bancada')) (2017-07-12)
	- Implementar os metodos bringtofront/sendtoback (2017-07-12)
	- Fazer o SVG possuir hierarquia (2017-07-12)
	- Fazer no javascript o controle automatico de estados (2017-06)

	EXCLUIDO:
	- Criar um formato de texto intermediario para criação dos sprites (mais simples que usar javascript, como em cead-script.js, para ser atualizado manualmente se for o caso)
	- Fazer uma funcao como "menu('vidraria',['misturar','limpar','...'])" (2017-07-13)
-->
<!DOCTYPE html>
<html lang="en">
<head>
<style>
body { 
	text-align: center;
	margin-top: 0px;
}

.game {
	margin: auto;
	width:960px;
	height:540px;
}
.botao {
	cursor: hand;
	cursor: pointer;
}
</style>
<!-- Bootstrap core CSS -->
<link href="css/cead-game.css" rel="stylesheet" />
<link href="css/bootstrap.min.css" rel="stylesheet" />
<script>
var game_id = 'ph-com-phmetro';
</script>
</head>
<body>
<!-- SVG -->

<div class="game game-canvas">
	<main style="height:411px"></main>
	<div class="canvas-footer" style="height:129px;background-color:#eee;overflow-y:scroll;overflow-x:hidden;display:none">
		<div class="row">
			<div class="col-xs-12">
				<a onclick="clickConfiguracoes()"><img class="botao" src="img/opcoes.png" /></a>
		    	<a onclick="clickEntrar()"><img class="botao" src="img/entrar.png" /></a>
				<a onclick="clickCreditos()"><img class="botao" src="img/credito.png" /></a>
			</div>
		</div>
	</div>
</div>
<div class="game game-credits"  style="display:none;background:url('img/credito_txt.png')">
<a onclick="clickVoltar()"><img class="botao" style="position: relative; right:280px; left: -320px; top: 450px;" src="img/voltar.png" /></a>
</div> 
</div>
<!-- tela-professor -->
<div class="game game-config" style="background:#eee;display:none">
	<div class="container">
	  <div class="row">
	    <h1 class="apresentacao">Aula prática: Medição de pH com pHmetro</h1>
	    <h2 class="apresentacao">Tela de controle do professor</h2>
	  </div>
	</div>
	<div class="container-fluid espaco">
	  <div class="row">
	    <div class="col-sm-6">
	      <p class="info">Escolha as soluções disponíveis para medição.</p>
	      <div class="checkbox opcoes">
	        <label>
	          <input type="checkbox" id="acFort01">
	          Ácido Forte 0,1 mol/L
	        </label>
	      </div>
	      <div class="checkbox opcoes">
	        <label>
	          <input type="checkbox" id="acetato01">
	          Acetato 0,1 mol/L
	        </label>
	      </div>
	      <div class="checkbox opcoes">
	        <label>
	          <input type="checkbox" id="baFort01">
	          Base Forte 0,1 mol/L
	        </label>
	      </div>
	      <div class="checkbox opcoes">
	        <label>
	          <input type="checkbox" id="amonia01">
	          Amônia 0,1 mol/L
	        </label>
	      </div>
	      <div class="checkbox opcoes">
	        <label>
	          <input type="checkbox" id="cafeina01">
	          Cafeína 0,1 mol/L
	        </label>
	      </div>
	      <div class="checkbox opcoes">
	        <label>
	          <input type="checkbox" id="fenol01">
	          Fenol 0,1 mol/L
	        </label>
	      </div>
	      <div class="checkbox opcoes">
	        <label>
	          <input type="checkbox" id="anilina01">
	          Anilina 0,1 mol/L
	        </label>
	      </div>
	      <div class="checkbox opcoes">
	        <label>
	          <input type="checkbox" id="calcio2+01">
	          Cálcio 2<sup>+</sup> 0,1 mol/L
	        </label>
	      </div>
	      <div class="checkbox opcoes">
	        <label>
	          <input type="checkbox" id="acAc01">
	          Ácido Acético 0,1 mol/L
	        </label>
	      </div>
	    </div>
	    <div class="col-sm-6">
	      <p class="info">Diga se o estudante deverá executar a calibração do equipamento.</p>
	      <div class="form-inline">
	        <div class="radio opcoes margemDireita">
	        <label>
	          <input type="radio" name="optionsRadios1" id="simCalibrar">
	          Sim
	        </label>
	      </div>
	      <div class="radio opcoes">
	        <label>
	          <input type="radio" name="optionsRadios1" id="naoCalibrar">
	          Não
	        </label>
	      </div>
	      </div>
	      <p class="info">Diga se o estudante precisará executar o ambiente em cada medição.</p>
	      <div class="form-inline">
	        <div class="radio opcoes margemDireita">
	        <label>
	          <input type="radio" name="optionsRadios2" id="simAmbientar">
	          Sim
	        </label>
	      </div>
	      <div class="radio opcoes">
	        <label>
	          <input type="radio" name="optionsRadios2" id="naoAmbientar">
	          Não
	        </label>
	      </div>
	      </div>
	      <p class="info">Informe o mínimo de medições que o estudante precisa realizar.</p>
	      <div class="form-group opcoes">
	        <input type="number" min="0" id="minimoMedicoes" class="input">
	      </div>
	    </div>
	  </div>
	</div>
	<div class="row apresentacao" >
	  <button class="btn btn-success" onclick="criaPratica()">Criar prática</button>
	</div>
</div>
<!-- /tela-professor -->

<!-- -->
<div class="game-menu"></div>
<div class="game-debug alert alert-info" style="display:none" role="alert"></div>
<!-- ReactJS <3 -->
<script src="js/react/react.min.js"></script>
<script src="js/react/react-dom.min.js"></script>
<script src="js/react/browser.min.js"></script>
<!-- Framework Cead -->
<script src="js/cead/cead-script.js"></script><!-- TODO: Remover -->
<script src="js/cead/cead-actions.js"></script>
<script src="js/cead/cead-taxonomy.js"></script>
<script src="js/cead/cead-state.js"></script>
<script src="js/cead/cead-objeto.js"></script><!-- TODO: Remover -->
<script type="text/babel" src="js/cead/cead-view.react.js"></script>
<script src="funcoes/cargaefetiva.js"></script>
<script src="funcoes/dados.js"></script>
<script src="funcoes/IsMissing.js"></script>
<script src="funcoes/mc.js"></script>
<script src="funcoes/pHsol2.js"></script>
<script src="funcoes/rotinaDeMistura.js"></script>
<script src="funcoes/rotinaMedicaophSimples.js"></script>
<script src="funcoes/wat.js"></script>
<!-- Bootstrap-->
<script src="js/jquery-3.2.1.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="data/ph-com-phmetro/script.js"></script>
<!-- -->
<script>
var game;
//
$('.game-canvas').hide();

function clickEntrar() {
	esconder('splash');bringToFront('bancada');
	$('.canvas-footer').find('*').remove();
}

function clickConfiguracoes() {
	$('.game-canvas').hide();
	$('.game-config').fadeIn(500);
}
function clickVoltar() {
	$('.game-credits').hide();
	$('.game-canvas').fadeIn(500);
}
function clickCreditos() {
	$('.game-canvas').hide();
	$('.game-credits').fadeIn(500);
}

function init() {
	$('.canvas-footer')
		.show()
		.css('background-color','transparent')

	// Carrega o arquivo JSON do jogo
	$.ajax({ url:"data.php?id="+game_id }).done(function (data) {
		game = new CeadGame();
		game.init(data);
		$('.game-canvas').fadeIn(1000);

	});
}

function iniciaVidraria() {
	var vidraria = buscar("vidraria");
	for (var i = 0; i < vidraria.length; i++) {
		vidraria[i].data("rotina", new rotinaDeMistura());
	}
}

function criaPratica() {
	var opc1 = document.getElementById("acFort01").checked;
	var opc3 = document.getElementById("acetato01").checked;
	var opc4 = document.getElementById("baFort01").checked;
	var opc6 = document.getElementById("amonia01").checked;
	var opc7 = document.getElementById("cafeina01").checked;
	var opc8 = document.getElementById("fenol01").checked;
	var opc9 = document.getElementById("anilina01").checked;
	var opc10 = document.getElementById("calcio2+01").checked;
	var opc11 = document.getElementById("acAc01").checked;

	var frascos = buscar("frasco");
	for (var i = 0; i < frascos.length; i++) {
		if (frascos[i].data("nome") == "Ácido Forte" && !opc1) frascos[i]._state.visivel = false;
		if (frascos[i].data("nome") == "Base Forte" && !opc4) frascos[i]._state.visivel = false;
		if (frascos[i].data("nome") == "Acetato" && !opc3) frascos[i]._state.visivel = false;
		if (frascos[i].data("nome") == "Amônia" && !opc6) frascos[i]._state.visivel = false;
		if (frascos[i].data("nome") == "Cafeína" && !opc7) frascos[i]._state.visivel = false;
		if (frascos[i].data("nome") == "Fenol" && !opc8) frascos[i]._state.visivel = false;
		if (frascos[i].data("nome") == "Anilina" && !opc9) frascos[i]._state.visivel = false;
		if (frascos[i].data("nome") == "Cálcio 2+" && !opc10) frascos[i]._state.visivel = false;
		if (frascos[i].data("nome") == "Ácido Acético" && !opc11) frascos[i]._state.visivel = false;
	}

	var vidrarias = buscar("bequer");
	for (var i = 0; i < vidrarias.length; i++) {
		if (document.getElementById("naoAmbientar").checked) vidrarias[i].data("rotina")._naoPrecisaAmbientar = true;
	}

	if (document.getElementById("naoCalibrar").checked) buscar("phmetro")[0].data("calibrado", true);

	clickEntrar();
	$('.game-canvas').show();
	$('.game-config').hide();
}

init();
</script>
</body>
</html>
