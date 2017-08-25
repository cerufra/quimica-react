/*
Esta função é uma auxiliar para outras. Ela recebe parâmetros gerais de um sistema e faz o cálculo para uma determinada substância neste sistema.
As variáveis q0 e numpKa são arrays passados por outra função.
A variável somapKa é uma matriz de somatórios passada por outra função.
A variável pH é um número real.
A variável j é um inteiro e representa a posição da substância de interesse nos arrays que descrevem o sistema.
*/

function cargaefetiva(pH, q0, somapKa, numpKa, j) {
	
	var termo0 = 1
	var alfai = 0;
	for (var i = 1; i <= numpKa[j - 1]; i++) {
		termo0 = termo0 + Math.pow(10, i * pH - somapKa[i - 1][j - 1]);
	}
	var alfa0 = 1 / termo0;
	var qef1 = alfa0 * q0[j - 1];
	for (var i = 1; i <= numpKa[j - 1]; i++) {
		alfai = Math.pow(10, i * pH - somapKa[i - 1][j - 1]) / termo0;
		qef1 = alfai * (q0[j - 1] - 1) + qef1;
	}
	
	return qef1;
}
