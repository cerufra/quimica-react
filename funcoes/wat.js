function wat(pH, pKw, Hfi) {
	
	if(IsMissing(Hfi)){
		 Hfi = 0
	}
	return Math.pow(10,(-pH + Hfi)) - Math.pow(10,pH-pKw + Hfi);

}