<?php declare(strict_types = 1);

namespace App\Tags\DI;

class Extension extends \Mrtnzlml\CompilerExtension
{

	public function loadConfiguration()
	{
		$this->addConfig(__DIR__ . '/config.neon');
	}

}