<?php
	// data.php
	// Este arquivo constroi o JSON
	// contendo todos os dados necessarios
	// para um jogo rodar
	// pedro.sacramento
	// 2017-07-13
	/*
	TODO: 2017-07-13
	- Permitir que sejam importados arquivos SVG
	- Fazer a leitura das dimensoes das figuras com o PHP
	*/
	// Carrega os dados de um jogo reunidos em um diretorio
	function load($id) {
		$result = (object) array();

		//
		$path = sprintf("data/%s",$id);

		// TAXONOMIA
		$tax = file("$path/taxonomy");
		$result->taxonomia = array();
		foreach ($tax as $line) {
			$result->taxonomia[] = trim($line);
		}

		// SPRITES
		$data = file("$path/sprites.json");
		$str = implode("",$data);
		$json_sprites = json_decode($str);
		$result->sprites = $json_sprites;
		$result->path = $path;

		// Atualiza as dimensoes dos sprites
		foreach ($result->sprites as $id => $sprite) {
			$size = getimagesize(sprintf("img/%s.png",$sprite->conceito));
			$result->sprites[$id]->transform->width = $size[0];
			$result->sprites[$id]->transform->height = $size[1];
		}

		//
		return $result;
	}

	// Saida	
	header("Content-Type: application/json");
	$json = load($_REQUEST['id']);
	echo json_encode($json, JSON_PRETTY_PRINT);
?>
