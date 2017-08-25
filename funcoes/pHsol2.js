/*
As variáveis q0, carga, numpKa e conc são arrays de números reais.
A variável dados é uma matriz de números reais.
As variáves nAD e pKw são números inteiros.
*/

function pHsol2(nAD, pKw, q0, carga, numpKa, conc, dados) {
	var somapKa = [];
	for (var i = 0; i < 20; i++) {
		somapKa[i] = [];
		for (var j = 0; j < 20; j++) {
			somapKa[i][j] = 0
		}
	}

	for (var i = 1; i <= nAD; i++) {
		somapKa[1 - 1][i - 1] = dados[1 - 1][i - 1];
		for (var j = 2; j <= numpKa[i - 1]; j++) {
			somapKa[j - 1][i - 1] = dados[j - 1][i - 1] + somapKa[j - 2][i - 1];
		}
	}

	var dif = 1;
	var pH = -2;
	var acresc = 1;
	var q = 0;

	while (Math.abs(dif) > 0.00000001) {
		dif = wat(pH, pKw);
		for (var i = 1; i <= nAD; i++) {
			q = cargaefetiva(pH, q0, somapKa, numpKa, i);
			dif = (q - carga[i - 1]) * conc[i - 1] + dif;
		}
		if (dif > 0) {
			pH = pH + acresc;
		} else if (dif < 0) {
			acresc = acresc / 2;
			pH = pH - acresc;
		} else {
			return pH;
		}
	}

	return pH;
}