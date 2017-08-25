/*
Conferir nomenclatura nos livros se já é adotado a nova regra de hidrogeno para espécies não totalmente protonadas.
Nenhum dado leva em consideração efeitos de precipitação e dimerização.
*/

var objetoDados = function (cargaMax, npK, carga, vetorpKa) {
	this.cargaMax = cargaMax;
	this.npK = npK;
	this.carga = carga;
	this.vetorpKa = vetorpKa;
}

function dados(nome) {
	switch (nome) {
		case "Ácido Forte": return new objetoDados(0, 1, 0, [-7]); break;
		case "Base Forte": return new objetoDados(0, 1, -1, [14]); break;
		case "Acetato": return new objetoDados(0, 1, -1, [4.76]); break;
		case "Ácido Acético": return new objetoDados(0, 1, 0, [4.76]); break;
		case "Prata I": return new objetoDados(1, 2, 1, [12, 12.01]); break;
		case "Prata III": return new objetoDados(3, 5, 3, [5.02, 5.355, 5.69, 8.34, 10.91]); break;
		case "Alanina 1-": return new objetoDados(1, 2, -1, [2.348, 9.867]); break;
		case "Alanina-H": return new objetoDados(1, 2, 0, [2.348, 9.867]); break;
		case "Alanina-H2": return new objetoDados(1, 2, 1, [2.348, 9.867]); break;
		case "Amônia": return new objetoDados(1, 1, 0, [9.24]); break;
		case "Amônio": return new objetoDados(1, 1, 1, [9.24]); break;
		case "Anilina": return new objetoDados(1, 1, 0, [4.66]); break;
		case "Anilínio": return new objetoDados(1, 1, 1, [4.66]); break;
		case "Bário 2+": return new objetoDados(2, 2, 2, [13.36, 24.36]); break;
		case "Benzoato": return new objetoDados(0, 1, -1, [4.202]); break;
		case "Ácido Benzóico": return new objetoDados(0, 1, 0, [4.202]); break;
		case "Bicarbonato": return new objetoDados(0, 2, -1, [6.37, 10.32]); break;
		case "Borato": return new objetoDados(0, 1, -1, [9.234]); break;
		case "Ácido Bórico": return new objetoDados(0, 1, 0, [9.234]); break;
		case "Cálcio 2+": return new objetoDados(2, 2, 2, [12.67, 14]); break;
		case "Cafeina": return new objetoDados(1, 1, 1, [0.5]); break;
		case "Carbonato": return new objetoDados(0, 2, -2, [6.37, 10.32]); break;
		case "Ácido Carbônico": return new objetoDados(0, 2, 0, [6.37, 10.32]); break;
		case "Cádmio II": return new objetoDados(2, 4, 2, [10.08, 10.27, 12.95, 14.05]); break;
		case "Citrato 3-": return new objetoDados(0, 3, -3, [3.128, 4.762, 6.396]); break;
		case "Citrato-H": return new objetoDados(0, 3, -2, [3.128, 4.762, 6.396]); break;
		case "Citrato-H2": return new objetoDados(0, 3, -1, [3.128, 4.762, 6.396]); break;
		case "Ácido Cítrico": return new objetoDados(0, 3, 0, [3.128, 4.762, 6.396]); break;
		case "Cromo III": return new objetoDados(3, 4, 3, [4, 5.62, 7.13, 11.02]); break;
		case "Cromato-H2": return new objetoDados(0, 2, 0, [-0.2, 6.5]); break;
		case "Cromato-H": return new objetoDados(0, 2, -1, [-0.2, 6.51]); break;
		case "Cromato 2-": return new objetoDados(0, 2, -2, [-0.2, 6.51]); break;
		case "Cobre II": return new objetoDados(2, 4, 2, [7, 7.32, 10.68, 12.5]); break;
		case "Dietilamina": return new objetoDados(1, 1, 0, [11.11]); break;
		case "Dietilamônio": return new objetoDados(1, 1, 1, [11.11]); break;
		case "Dimetilamina": return new objetoDados(1, 1, 0, [10.72]); break;
		case "Dimetilamônio": return new objetoDados(1, 1, 1, [10.72]); break;
		case "EDTA 4-": return new objetoDados(0, 4, -4, [2, 2.678, 6.161, 10.26]); break;
		case "EDTA 3-": return new objetoDados(0, 4, -3, [2, 2.678, 6.161, 10.26]); break;
		case "EDTA 2-": return new objetoDados(0, 4, -2, [2, 2.678, 6.161, 10.26]); break;
		case "EDTA 1-": return new objetoDados(0, 4, -1, [2, 2.678, 6.161, 10.26]); break;
		case "EDTA": return new objetoDados(0, 4, 0, [2, 2.678, 6.161, 10.26]); break;
		case "Etilamina": return new objetoDados(1, 1, 0, [10.75]); break;
		case "Etilamônio": return new objetoDados(1, 1, 1, [10.75]); break;
		case "Ferro III": return new objetoDados(3, 4, 3, [2.19, 3.48, 5.69, 9.6]); break;
		case "Fenol": return new objetoDados(0, 1, 0, [9.89]); break;
		case "Fenolato": return new objetoDados(0, 1, -1, [9.89]); break;
		case "Fluoreto": return new objetoDados(0, 1, -1, [3.18]); break;
		case "Ácido Fluorídrico": return new objetoDados(0, 1, 0, [3.18]); break;
		case "Formiato": return new objetoDados(0, 1, -1, [3.760]); break;
		case "Ácido Fórmico": return new objetoDados(0, 1, 0, [3.760]); break;
		case "Hidrogenofosfato": return new objetoDados(0, 3, -2, [1.959, 7.125, 12.23]); break;
		case "Fosfato": return new objetoDados(0, 3, -3, [1.959, 7.125, 12.23]); break;
		case "Diidrogenofosfato": return new objetoDados(0, 3, -1, [1.959, 7.125, 12.23]); break;
		case "Ácido Fosfórico": return new objetoDados(0, 3, 0, [1.959, 7.125, 12.23]); break;
		case "Ftalato 2-": return new objetoDados(0, 2, -2, [2.950, 5.408]); break;
		case "Ftalato 1-": return new objetoDados(0, 2, -1, [2.950, 5.408]); break;
		case "Ácido Ftálico": return new objetoDados(0, 2, 0, [2.950, 5.408]); break;
		case "Glicina": return new objetoDados(1, 2, -1, [2.350, 9.778]); break;
		case "Glicina-H": return new objetoDados(1, 2, 0, [2.350, 9.778]); break;
		case "Glicina-H2": return new objetoDados(1, 2, 1, [2.350, 9.778]); break;
		case "Glifosfato": return new objetoDados(1, 4, -3, [1, 2.6, 5.6, 10.6]); break;
		case "Glifosfato-H": return new objetoDados(1, 4, -2, [1, 2.6, 5.6, 10.6]); break;
		case "Glifosfato-H2": return new objetoDados(1, 4, -1, [1, 2.6, 5.6, 10.6]); break;
		case "Glifosfato-H3": return new objetoDados(1, 4, 0, [1, 2.6, 5.6, 10.6]); break;
		case "Glifosfato-H4": return new objetoDados(1, 4, 1, [1, 2.6, 5.6, 10.6]); break;
		case "Guanidina": return new objetoDados(1, 1, 0, [13.540]); break;
		case "Guanidina-H": return new objetoDados(1, 1, 1, [13.540]); break;
		case "Hidroxilamina": return new objetoDados(1, 1, 0, [6.04]); break;
		case "Hidroxilamônio": return new objetoDados(1, 1, 1, [6.04]); break;
		case "Histidina": return new objetoDados(2, 3, 0, [1.7, 6.02, 9.08]); break;
		case "Histidina-H": return new objetoDados(2, 3, 1, [1.7, 6.02, 9.08]); break;
		case "Histidina-H2": return new objetoDados(2, 3, 2, [1.7, 6.02, 9.08]); break;
		case "Hássio 1-": return new objetoDados(0, 2, -1, [7, 15]); break;
		case "Metilamina": return new objetoDados(1, 1, 0, [10.7]); break;
		case "Metilamônio": return new objetoDados(1, 1, 1, [10.7]); break;
		case "Magnésio 2+": return new objetoDados(2, 2, 2, [11.44, 16.86]); break;
		case "Níquel II": return new objetoDados(2, 3, 2, [9.03, 10.42, 15.28]); break;
		case "Nitrito": return new objetoDados(0, 1, -1, [3.292]); break;
		case "Ácido Nitroso": return new objetoDados(0, 1, 0, [3.292]); break;
		case "Hidrogenooxalato": return new objetoDados(0, 2, -1, [1.271, 4.266]); break;
		case "Oxalato": return new objetoDados(0, 2, -2, [1.271, 4.266]); break;
		case "Ácido Oxálico": return new objetoDados(0, 2, 0, [1.271, 4.266]); break;
		case "Chumbo 2+": return new objetoDados(2, 4, 2, [7.71, 9.41, 10.94, 11.64]); break;
		case "Piridina": return new objetoDados(1, 1, 0, [5.15]); break;
		case "Piridínio": return new objetoDados(1, 1, 1, [5.15]); break;
		case "Enxofre 2-": return new objetoDados(0, 2, -2, [7, 15]); break;
		case "Salicilato": return new objetoDados(0, 1, -1, [2.98]); break;
		case "Ácido Acetilsalicílico": return new objetoDados(0, 1, 0, [2.98]); break;
		case "Hidrogenosulfato": return new objetoDados(0, 2, -1, [-3, 1.92082]); break;
		case "Sulfato": return new objetoDados(0, 2, -2, [-3, 1.92082]); break;
		case "Ácido Sulfídrico": return new objetoDados(0, 2, 0, [7, 15]); break;
		case "Ácido Sulfúrico": return new objetoDados(0, 2, 0, [-3, 1.92082]); break;
		case "Tartarato": return new objetoDados(0, 2, -2, [3.03, 4.54]); break;
		case "Ácido Tartárico": return new objetoDados(0, 2, 0, [3.03, 4.54]); break;
		case "Hidrogenotartarato": return new objetoDados(0, 2, -1, [3.03, 4.54]); break;
		case "Trietilamina": return new objetoDados(1, 1, 0, [10.762]); break;
		case "Trietilamônio": return new objetoDados(1, 1, 1, [10.762]); break;
		case "Tris": return new objetoDados(1, 1, 0, [8.075]); break;
		case "Tris-H": return new objetoDados(1, 1, 1, [8.075]); break;
		case "Zinco II": return new objetoDados(2, 4, 2, [9.6, 7.1, 11.6, 10.48]); break;
	}
}