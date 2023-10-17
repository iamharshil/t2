const { Command } = require("commander");
const program = new Command();

program
	.name("string-util")
	.description("A CLI to some JavaScript string utilities")
	.version("1.0.0");

program
	.command("split")
	.description("Split a string into an array of substrings")
	.argument("<string>", "The string to split")
	.option("--first", "display just first substring")
	.option("-s, --separator <char>", "separator character", ",")
	.action((str, options) => {
		const limit = options.first ? 1 : undefined;
		console.log(str.split(options.separator, limit));
	})
    ;

program.parse();

