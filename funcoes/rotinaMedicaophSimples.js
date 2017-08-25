/*
As variáveis componentes e concentracao são arrays.
Exemplos:
componentes = ["Ácido Forte", "Acetato"]
concentracao = [0.01, 0.02] 
*/

function medirph(componentes, concentracao) {
	for (var i = 0; i < componentes.length; i++) {
		if (componentes[i] == "Ácido Forte" && concentracao[i] == 0.1) {
			concentracao[i] = 0.09999;
		}
	}
	var nAD = componentes.length;
	var tipo = componentes;
	var q0 = [];
	var carga = [];
	var numpKa = [];
	var conc = concentracao;
	var dado = [];
	for (var i = 0; i < 20; i++) {
		dado[i] = [];
		for (var j = 0 ; j < 20 ; j++){ 
			dado[i][j] = 0;
		}
	}
	for (var i = 0; i < nAD; i++) {
		dado[0][i] = dados(tipo[i]).vetorpKa[0];
		q0[i] = dados(tipo[i]).cargaMax;
		carga[i] = dados(tipo[i]).carga;
		numpKa[i] = dados(tipo[i]).npK;
		for (var j = 1; j < numpKa[i]; j++) {
			dado[j][i] = dados(tipo[i]).vetorpKa[j];
		}
	}

	var pHcalculado = pHsol2(nAD, 14, q0, carga, numpKa, conc, dado);
	return pHcalculado;
}