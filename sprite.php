<!--
	2017-06-21
	TODO:
	- Fazer navegacao por hashtag, pelo menos para as telas (possibilitando o back/forward)
	- Fazer no javascript os estados, mudanças de estados (ao simular clique em objetos especificos) e a verificação de estados sem interação com a interface, mas ja usando os codigos do Bruno
		Essa abordagem vai ajudar a fazer algo acessivel para cegos
-->
<!DOCTYPE html>
<html lang="en">
  <head>
  </head>
<!-- NAVBAR
================================================== -->
  <body>
		<main></main>

    <!-- Marketing messaging and featurettes
    ================================================== -->
    <!-- Wrap the rest of the page in another container to center all the content. -->

    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
		<script src="react.min.js"></script>
		<script src="react-dom.min.js"></script>
		<script src="browser.min.js"></script>
		<script src="cead.js"></script>
		<script src="js/jquery-3.2.1.js"></script>
		<script>
			$.ajax({
				url:"scene.json"
			}).done(function (data) {
				sprites = data;
			});
		</script>
		<script type="text/babel" src="app.js"></script>
  </body>
</html>
