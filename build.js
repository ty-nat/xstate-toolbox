const ts = require('typescript');
const esbuild = require('esbuild');
const rimraf = require('rimraf');

const configFile = ts.readConfigFile('./tsconfig.json', ts.sys.readFile);
const outDir = configFile.config.compilerOptions.outDir

rimraf.sync(outDir);

esbuild.buildSync({
	entryPoints: [
		'./src/index.ts',
	],
	bundle: true,
	outdir: './dist',
	define: {
		'process.env.NODE_ENV': '"production"'
	},
	external: ["xstate"],
	platform: 'neutral',
	target: 'es6',
	minify: true,
});


