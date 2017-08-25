/*
Esta rotina é utilizada tanto na mistura de substâncias no béquer como no caso de titulação.
Para efeito de nomenclatura, uma substância B é misturada em uma substância A.
As variáveis componentesA e componentesB são arrays de strings que passam os nomes dos componetes de A e B, respectivamente.
As variáveis concComponentesA e concComponentesB são arrays de números reais que passam as concentrações dos componentes de A e B, respectivamente.
As variáveis volumeA e volumeB são números reais que passam o volume de A e B, respectivamente.
*/

var rotinaDeMistura = function() {
	this._pH = 7;
	this._volume = 0;
	this._componentes = [];
	this._concentracoes = [];
	this._numSistemas = 0;
	this._ambientou = false;
	this._transferiu = false;
	this._noEquipamento = false;
	this._medicoes = 0;
	this._primeiro = true;
	this._naoPrecisaAmbientar = false;
}

rotinaDeMistura.prototype.ph = function () {return this._pH;}

rotinaDeMistura.prototype.volume = function() {return this._volume;}

rotinaDeMistura.prototype.componentes = function() {return this._componentes;}

rotinaDeMistura.prototype.concentracoes = function() {return this._concentracoes;}

rotinaDeMistura.prototype.numSistemas = function() {return this._numSistemas;}

rotinaDeMistura.prototype.ambientou = function() {return this._ambientou;}

rotinaDeMistura.prototype.transferiu = function() {return this._transferiu;}

rotinaDeMistura.prototype.noEquipamento = function() {return this._noEquipamento;}

rotinaDeMistura.prototype.defineSistemas = function(componentesA, componentesB, volumeA, volumeB, concComponentesA, concComponentesB) {
	var novosComponentes = [];
	var componenteNovo;
	var idxNC = 0;

	// Bloco para realizar a definição das substâncias que estão presentes no sistema após a mistura.
	for (var i = 0; i < componentesB.length; i++) {
		componenteNovo = true;
		for (var j = 0; j < componentesA.length; j++) {
			if (comparaNomes(componentesB[i], componentesA[j])) {
				componenteNovo = false;
			}
		}
		if (componenteNovo) {
			novosComponentes[idxNC] = componentesB[i];
			idxNC++;
		}
	}
	if (novosComponentes.length == undefined) {
		this._componentes = componentesA;
	} else {
		this._componentes = componentesA.concat(novosComponentes);
	}

	// Bloco responsável por avaliar as concentrações das substâncias no sistema após mistura.
	this._volume = volumeA + volumeB;
	var idx = 0;
	var igual;
	for (var i = 0; i < componentesA.length; i++) {
		igual = false;
		for (var j = 0; j < componentesB.length; j++) {
			if (comparaNomes(componentesA[i], componentesB[j])) {
				igual = true;
				this._concentracoes[idx] = (concComponentesA[i] * volumeA + concComponentesB[j] * volumeB) / this._volume;
				idx++;
			}	
		}
		if (igual == false) {
			this._concentracoes[i] = concComponentesA[i] * volumeA / this._volume;
			idx++;	
		}
	}
	for (var i = 0; i < componentesB.length; i++) {
		igual = false
		for (var j = 0; j < componentesA.length; j++) {
			if (comparaNomes(componentesB[i], componentesA[j])) {
				igual = true;
			}
		}
		if (igual == false) {
			this._concentracoes[idx] = concComponentesB[i] * volumeB / this._volume;
			idx++;
		}
	}
}

rotinaDeMistura.prototype.calculapH = function() {
	var nAD = this._componentes.length;
	var tipo = this._componentes;
	var q0 = [];
	var carga = [];
	var numpKa = [];
	var conc = this._concentracoes;
	var dado = [];
	for (var i = 0; i < 20; i++) {
		dado[i] = [];
		for (var j = 0 ; j < 20 ; j++){ 
			dado[i][j] = 0;
		}
	}

	// Prepara a matriz com os valores de pKa em colunas
	// dado = [[valores de pKa1 de todos os componentes], [valores de pKa2 de todos os componentes], ...]
	for (var i = 0; i < nAD; i++) {
		dado[0][i] = dados(tipo[i]).vetorpKa[0];
		q0[i] = dados(tipo[i]).cargaMax;
		carga[i] = dados(tipo[i]).carga;
		numpKa[i] = dados(tipo[i]).npK;
		for (var j = 1; j < numpKa[i]; j++) {
			dado[j][i] = dados(tipo[i]).vetorpKa[j];
		}
	}
	var sd = buscar("phmetro")[0].data("sd")
	var pHcalculado = pHsol2(nAD, 14, q0, carga, numpKa, conc, dado) + mc(sd);
	this._pH = pHcalculado;
}

rotinaDeMistura.prototype.resetar = function() {
	this._pH = 7;
	this._volume = 0;
	this._componentes = [];
	this._concentracoes = [];
	this._numSistemas = 0;
	this._ambientou = false;
	this._transferiu = false;
	this._noEquipamento = false;
	this._primeiro = true;
}

// Esta função ajuda a decidir se os componestes misturados são iguais ou não.
function comparaNomes (nome1, nome2) {
	if (nome1 == nome2) {
		return true;
	} else {
		return false;
	}
}