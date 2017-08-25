function mc (sd) {
	var mc;
	var i = 0;
	while (i == 0) {
		var random1 = 2 * Math.random() - 1;
		var random2 = 2 * Math.random() - 1;
		var Sum = random2 * random2 + random1 * random1;
		if (Sum <= 1) {
			var M2 = (-2 * Math.log(Sum) / Sum);
			var M = Math.sqrt(M2);
			mc = random1 * M * sd;
			break;
		}
	}
	return mc;
}