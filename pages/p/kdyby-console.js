// @flow

import WithPost from '../../components/WithPost';

export default WithPost({
  "attributes": {
    "timestamp": 1409409052000,
    "title": "Kdyby\\Console",
    "slug": "kdyby-console"
  },
  "body": "<p>Existují knihovny, bez kterých bych si vývoj webových aplikací již téměř nedokázal představit. Jedním z nich je <a href=\"https://github.com/kdyby/console\">Kdyby\\Console</a>. Již dříve jsem sice napsal článek o <a href=\"nette-2-1-dev-clirouter\">Nette CliRouteru</a>, ale postupem času a hlavně také díky Doctrine jsem velmi rychle a rád přešel na jiné a dokonalejší řešení. Vzhledem k tomu, že na jednom projektu používám tuto knihovnu velmi hodně a vlastně na ní celý projekt stojí, rád bych alespoň prostřednictvím tohoto článku autorovi poděkoval (<a href=\"https://github.com/fprochazka\">Filip Procházka</a>). Zároveň bych tímto počínáním rád postupně smazával věčný problém těchto knihoven, protože většinou z hlediska návštěvníka ani není jasné, na co ta knihovna je...</p>\n<h2 id=\"pro-uva-ovat-o-konzoli-\">Proč uvažovat o konzoli? <a href=\"#pro-uva-ovat-o-konzoli-\">#</a></h2><p>Pro mě je tato otázka celkem jednoduchá, protože mám projekty, které nejedou jen na sdíleném hostingu, ale jsou to samostatně stojící aplikace. Z toho plyne, že je často zapotřebí vykonávat pomocí CRONu velké množství úkolů. Toto je hlavní část, proč vůbec o konzolovém nástroji uvažuju. Použití je totiž velmi jednoduché a právě samotná Doctrine nabízí prostřednictvím Kdyby\\Console celou řadu klasických příkazů a je škoda je nevyužívat. Stačí spustit z příkazové řádky <code>php index.php</code> u aplikace a pokud jsou příkazy zaregistrovány v konfigu, vypíše se jejich seznam včetně nápověd:</p>\n<pre><code>C:\\xampp\\htdocs\\zeminem.cz\\www&gt;php index.php\nNette Framework version 2.2.3-RC2\n\nUsage:\n  [options] command [arguments]\n\nOptions:\n  --help           -h Display this help message.\n  --quiet          -q Do not output any message.\n  --verbose        -v|vv|vvv Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug\n  --version        -V Display this application version.\n  --ansi              Force ANSI output.\n  --no-ansi           Disable ANSI output.\n  --no-interaction -n Do not ask any interactive question.\n\nAvailable commands:\n  help                       Displays help for a command\n  list                       Lists commands\nblog\n  blog:install               Install database schema (set-up DB credentials in config.local.neon).\n  blog:update                Update database schema (set-up DB credentials in config.local.neon).\ndbal\n  dbal:import                Import SQL file(s) directly to Database.\norm\n  orm:clear-cache:metadata   Clear all metadata cache of the various cache drivers.\n  orm:clear-cache:query      Clear all query cache of the various cache drivers.\n  orm:clear-cache:result     Clear all result cache of the various cache drivers.\n  orm:convert-mapping        Convert mapping information between supported formats.\n  orm:convert:mapping        Convert mapping information between supported formats.\n  orm:generate-entities      Generate entity classes and method stubs from your mapping information.\n  orm:generate-proxies       Generates proxy classes for entity classes.\n  orm:generate:entities      Generate entity classes and method stubs from your mapping information.\n  orm:generate:proxies       Generates proxy classes for entity classes.\n  orm:info                   Show basic information about all mapped entities\n  orm:schema-tool:create     Processes the schema and either create it directly on EntityManager Storage Connection or generate the SQL output.\n  orm:schema-tool:drop       Drop the complete database schema of EntityManager Storage Connection or generate the corresponding SQL output.\n  orm:schema-tool:update     Executes (or dumps) the SQL needed to update the database schema to match the current mapping metadata.\n  orm:validate-schema        Validate the mapping files.\n</code></pre><p>Díky této možnosti je možné rychle validovat Doctrine entity, nebo generovat SQL schéma přímo do databáze. Použití je opět jednoduché, např.: <code>php index.php orm:info</code>.</p>\n<h2 id=\"tvorba-vlastn-ho-p-kazu\">Tvorba vlastního příkazu <a href=\"#tvorba-vlastn-ho-p-kazu\">#</a></h2><p>Prvně je třeba si uvědomit, že tato knihovna je vlastně to samé jako je v <a href=\"http://symfony.com/doc/current/components/console/introduction.html\">Symfony Console Component</a>, tzn. že potřebné informace se dají čerpat právě z této dokumentace a navíc existuje celá sada helperů, jako je například <a href=\"http://symfony.com/doc/current/components/console/helpers/progressbar.html\">Progress Bar</a>, nebo třeba šikovný <a href=\"http://symfony.com/doc/current/components/console/helpers/table.html\">Table</a>. Samotné napsání třídy (Commandu) je pak triviální záležitostí:</p>\n<pre><code class=\"lang-php\">&lt;?php\n\nnamespace App\\Console;\n\nuse Doctrine;\nuse Entity;\nuse Symfony\\Component\\Console\\Command\\Command;\nuse Symfony\\Component\\Console\\Input\\InputInterface;\nuse Symfony\\Component\\Console\\Output\\OutputInterface;\n\nclass BlogInstall extends Command {\n\n    /** @var \\Kdyby\\Doctrine\\EntityManager @inject */\n    public $em;\n\n    protected function configure() {\n        $this-&gt;setName(&#39;blog:install&#39;)-&gt;setDescription(&#39;Install database schema (set-up DB credentials in config.local.neon).&#39;);\n    }\n\n    protected function execute(InputInterface $input, OutputInterface $output) {\n        try {\n            // Zde vykonáme vše co je potřeba\n            // Zde vykonáme vše co je potřeba\n            // Zde vykonáme vše co je potřeba\n            //...\n            $output-&gt;writeLn(&#39;&lt;info&gt;[OK] - BLOG:INSTALL&lt;/info&gt;&#39;);\n            return 0; // zero return code means everything is ok\n        } catch (\\Exception $exc) {\n            $output-&gt;writeLn(&#39;&lt;error&gt;BLOG:INSTALL - &#39; . $exc-&gt;getMessage() . &#39;&lt;/error&gt;&#39;);\n            return 1; // non-zero return code means error\n        }\n    }\n\n}\n</code></pre>\n<p>Za povšimnutí stojí fakt, že tyto třídy jsou vedle presenterů dalším kandidátem na použití <code>@inject</code> anotace. V tomto příbadě bude tedy k dispozici příkaz <code>blog:install</code>, který je však nutné ještě zaregistrovat v konfiguračním souboru:</p>\n<pre><code class=\"lang-neon\">services:\n    -\n        class: App\\Console\\BlogInstall\n        tags: [kdyby.console.command]\n</code></pre>\n<p>Tento způsob registrace je jedna z věcí, která mě štve a rád bych, kdyby se toto Console naučila hackovat sama a já nemusel tagovat, že se jedná o command. Když je totiž těchto příkazů hodně, konfigurační soubor tímto způsobem poměrně rychle roste na své délce a stává se nepřehledným... (-:</p>\n<h2 id=\"a-co-je-na-tom-\">A co je na tom? <a href=\"#a-co-je-na-tom-\">#</a></h2><p>Vždyť toto umí Symfony. To Kdyby nic jiného neumí? No, tak krom toho, že vůbec řeší integraci do Nette, což je asi hlavní úkol, tak jsou logicky součásti integrace i další části jako jsou například vlastní helpery. Není totiž nic horšího, než když v takovém commandu potřebujete presenter. Ale ono je to vlastně jednoduché:</p>\n<pre><code class=\"lang-php\">$presenter = $this-&gt;getHelper(&#39;presenter&#39;)-&gt;getPresenter();\n</code></pre>\n<p>A stejný problém je pak s odkazy. Jak totiž v CLI pracovat s URL, když žádná není? I to Console řeší. Stačí v configu uvést:</p>\n<pre><code class=\"lang-neon\">console:\n    url: http://zlml.cz/\n</code></pre>\n<p>Pak je tvorba odkazů v CLI úplná pohodička:</p>\n<pre><code class=\"lang-php\">$link = $presenter-&gt;link(&#39;//:Front:Homepage:default&#39;);\n</code></pre>\n<p>Podívejte se na <a href=\"https://github.com/mrtnzlml/zlml.cz/tree/6d1ad3de5b1f98067a38d2085e4939cd17cf5db5/app/commands\">reálné ukázky</a> příkazů pro Kdyby\\Console. Za sebe mohu tento nástroj jedině doporučit. Pokud potřebujete se svojí aplikací pracovat z příkazové řádky. Toto je jiná správná cesta. Díky! (-:</p>\n"
});
