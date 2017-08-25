// Funcoes especificas deste jogo
function colocarNaBancada(target) {
	if (estaLivre(target)) {
		moverPara(target,livre('lugar-bancada'));
	} else {
		//console.log('Olas')
	}
}

function colocarNoArmario() {}
function colocarNaPrateleira() {}
function limparVidraria() {}

function misturarReagentes(target) {
	// Quando a acao envolve mais de um elemento
	// o outro elemento eh chamado de "other"
	var other = target.other();

	//	
	$('.game-debug')
		.text('Misturando '+target.conceito()+' e '+other.conceito()+'...')
		.fadeIn(500);

	//
	setTimeout(function () {
		$('.game-debug').fadeOut(500);
	},2000);
}

// 2017-07-14
// Move a vidraria para um lugar qualquer na bancada
function moverVidraria(target) {
	var other = target.other();
	moverPara(target, other);
}

// TODO:
// 2017-07-14
// Elaborar uma solucao para quando o pai precisar
// ser definido por ID e nao por um seletor, pois
// o seletor pode ser impreciso em casos onde o usuario
// disse explicitamente o destino do objeto (exemplo: clicando
// em um alvo)
function estaNaBancada(source) { 
	return (source.pai() == 'bancada'); // FIXIT: Esta solucao é fragil
}

function acaoVidraria(target) {
	if (target.conceito() == "frasco") {
		var comp = target.data("nome").length;
		var subs = "";
		for (var i = 0; i < comp; i++) {
			subs += target.data("nome")[i];
			subs += " ";
		}
		$(".game-debug").text(subs).fadeIn(500);
		setTimeout(function() {
			$(".game-debug").fadeOut(500);
		}, 2000);
	}
	if (target.conceito() == "bequer") {
		var comp = target.data("rotina").componentes().length;
		var subs = "";
		if (comp == 0) {
			subs = "Béquer vazio"
		} else {
			for (var i = 0; i < comp; i++) {
				subs += target.data("rotina")._componentes[i];
				subs += "/";
			}
		}
		$(".game-debug").text(subs).fadeIn(500);
		setTimeout(function() {
			$(".game-debug").fadeOut(500);
		}, 2000);
	}
}

// Ações implementadas para roubar
function colocarVidrariaNaBancada (target) {
		moverPara(target, livre("lugar-bancada"));
		var r = target.data("rotina");
		if (r.noEquipamento) {
			r._noEquipamento = false;
		}
}

function colocarFrascoNaBancada (target) {
	if (estaLivre(target)) {
		moverPara(target, livre("lugar-bancada"));
	}
}

function ambientar(target) {
	var bequer = target.other();
	bequer.data("rotina")._ambiente = target.data("nome");
	bequer.data("rotina")._ambientou = true;
	$('.game-debug')
		.text('Ambientando '+target.data("nome")+' no '+bequer.conceito()+'...')
		.fadeIn(500);
	setTimeout(function () {
		$('.game-debug').fadeOut(500);
	},2000);
}

function transferir(target) {
	var r = target.other().data("rotina");
	var other = target.other();
	if (!r._primeiro) {
		$(".game-debug").text("Já existe uma substância " + other.conceito() + ", escolha outro ou selecione misturar.").fadeIn(500);
		setTimeout(function() {
			$(".game-debug").fadeOut(500);
		}, 2000);
	} else if ((!r.ambientou() && r._naoPrecisaAmbientar) || (r.ambientou() && r._ambiente == target.data("nome"))) {
		r._primeiro = false;
		r._transferiu = true;
		r.defineSistemas(r.componentes(), target.data("nome"), r.volume(), target.data("volume"), r.concentracoes(), target.data("concentracoes"));
		$(".game-debug").text("Transferindo " + target.data("nome") +" para o " + other.conceito() + "...").fadeIn(500);
		setTimeout(function() {
			$(".game-debug").fadeOut(500);
		}, 2000);
	} else {
		$(".game-debug").text("O " + other.conceito() + " não possui o mesmo ambiente do frasco selecionado.").fadeIn(500);
		setTimeout(function() {
			$(".game-debug").fadeOut(500);
		}, 2000);
	}
}

function limpar (target) {
	var r = target.data("rotina");
	if (r.noEquipamento()) {
		moverPara(target, livre("lugar-bancada"));
	}
	r.resetar();
	$('.game-debug')
	.text('Limpando ' + target.conceito() + '...')
	.fadeIn(500);
	setTimeout(function () {
		$('.game-debug').fadeOut(500);
	}, 200);
}

function misturar(target) {
	var r = target.other().data("rotina");
	var other = target.other();
	if (r._primeiro) {
		$(".game-debug").text("Não existe uma substância no " + other.conceito() + ", escolha outro ou selecione transferir.").fadeIn(500);
		setTimeout(function() {
			$(".game-debug").fadeOut(500);
		}, 2000);
	} else if ((!r.ambientou() && r._naoPrecisaAmbientar) || r.ambientou()) {
		r.defineSistemas(r.componentes(), target.data("nome"), r.volume(), target.data("volume"), r.concentracoes(), target.data("concentracoes"));
		$(".game-debug").text("Transferindo " + target.data("nome") +" para o " + other.conceito() + "...").fadeIn(500);
		setTimeout(function() {
			$(".game-debug").fadeOut(500);
		}, 2000);
	} else {
		$(".game-debug").text("O " + other.conceito() + " não foi ambientado.").fadeIn(500);
		setTimeout(function() {
			$(".game-debug").fadeOut(500);
		}, 2000);
	}
}

function moverParaEquipamento(target) {
	var r = target.data("rotina");
	var other = target.other();
	moverPara(target, other);
	bringToFront(target);
	r.calculapH();

	var pH = Math.round(r.ph() * 100)/100;
	var pH = r.ph()
	r._noEquipamento = true;
	r._medicoes = r._medicoes + 1;
	console.log(r._medicoes);
	$('.game-debug').text('Valor de pH medido: ' + pH).fadeIn(500);
	$('label[for="label_phmentro"]').text(pH);
}

function lavar(target) {
	var phmetro = target.other();
	phmetro.data("limpo", true);
	$('.game-debug').text('Limpando o eletrono, favor animar legal').fadeIn(500);
	setTimeout(function() {
		$('.game-debug').fadeOut(500);
	}, 2000);
}

function calibrar() {
	// Aqui vem a animação da calibração
	buscar("phmetro")[0].data("calibrado", true);
}

// Regras para execução da prática
function regraAmbiente (target) {
	var bequers = buscar("bequer");
	for (var i = 0; i < bequers.length; i++) {
		var r = bequers[i].data("rotina");
		if (!r.ambientou() && !r.transferiu() && !r.noEquipamento() && estaNaBancada(bequers[i]) && estaNaBancada(target)) {
			return true;
		}
	}
	return false;
}
function regraTransferencia(target) {
	var bequers = buscar("bequer");
	for (var i = 0; i < bequers.length; i++) {
		var r = bequers[i].data("rotina");
		if (estaNaBancada(target) && r._primeiro && !r.noEquipamento() && (r.ambientou() || (!r.ambientou() && r._naoPrecisaAmbientar))) {
			return true;
		}
	}
	return false;
}
function regraMistura(target) {
	var bequers = buscar("bequer");
	for (var i = 0; i < bequers.length; i++) {
		var r = bequers[i].data("rotina");
		if (estaNaBancada(target) && !r._primeiro && !r.noEquipamento() && (r.ambientou() || (!r.ambientou() && r._naoPrecisaAmbientar))) {
			return true;
		}
	}
	return false;
}
function regraPreparado (target) {
	var r = target.data("rotina");
	if (r.transferiu() && !r.noEquipamento() && buscar("phmetro")[0].data("calibrado") && buscar("phmetro")[0].data("limpo") && buscar("phmetro")[0].data("seco")) {
		return true;
	} else {
		return false;
	}
}
function regraLimpar (target) {
	var r = target.data("rotina");
	if (r.transferiu() || r.ambientou()) {
		return true;
	} else {
		return false;
	}
}
function regraLavar() {
	if (buscar("phmetro")[0].data("calibrado") && !buscar("phmetro")[0].data("limpo")) {
		return true;
	} else {
		return false;
	}
}

// Menus
menu("frasco", [
	{ "text" : "Colocar na bancada", "action" : "colocarFrascoNaBancada(this)", "rule":"!estaNaBancada(this)" },
	{ "text" : "Mover", "action" : "moverVidraria(this)", "other":"lugar-bancada", "rule":"estaNaBancada(this)" },
	{ "text" : "Ambientar", "action" : "ambientar(this)", "other" : "bequer", "rule" : "regraAmbiente(this)" },
	{ "text" : "Transferir", "action" : "transferir(this)", "other" : "bequer", "rule" : "regraTransferencia(this)" },
	{ "text" : "Misturar", "action" : "misturar(this)", "other" : "bequer", "rule" : "regraMistura(this)" }
]);
menu("vidraria", [
	{ "text" : "Colocar na bancada", "action" : "colocarVidrariaNaBancada(this)", "rule":"!estaNaBancada(this)" },
	{ "text" : "Mover", "action" : "moverVidraria(this)", "other" : "lugar-bancada", "rule":"estaNaBancada(this)" },
	{ "text" : "Limpar", "action" : "limpar(this)", "rule" : "regraLimpar(this)" },
	{ "text" : "Levar para equipamento", "action" : "moverParaEquipamento(this)", "other":"bequer-repouso", "rule":"regraPreparado(this)" }
]);
menu("pisseta", [
	{ "text" : "Lavar", "action" : "lavar(this)", "other" : "phmetro", "rule" : "regraLavar()" }
]);
menu("phmetro", [
	{ "text" : "Calibrar", "action" : "calibrar()", "rule" : "!buscar('phmetro')[0].data('calibrado')" }
]);
