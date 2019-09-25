'use strict';

import { workspace, ExtensionContext, window, Disposable } from 'vscode';
import { Executable, LanguageClient, LanguageClientOptions, ServerOptions, ExecutableOptions } from 'vscode-languageclient';
import * as path from 'path'

interface LanguageConfiguration {
	vscodeName: string,
	miksiloName?: string,
}
const languages: Array<LanguageConfiguration> = [
    {
         vscodeName: "cloudFormation",
         miksiloName: "cloudFormation"
    },
    {
         vscodeName: "yamlCloudFormation",
         miksiloName: "yamlCloudFormation"
    }
]
export function activate(context: ExtensionContext) {	
	workspace.onDidChangeConfiguration(() => activateJar(context));
	activateJar(context);
}

let previousJar: string | null | undefined = undefined;
function activateJar(context: ExtensionContext) {
	const javaHome = workspace.getConfiguration('java').get<string>('home');
	const javaExecutable: string = javaHome ? path.resolve(javaHome, "/bin/java") : "java";

	const jar: string = workspace.getConfiguration('miksilo').get("jar") || process.env.MIKSILO || "./MiksiloPlayground.jar";
	if (jar === previousJar)
		return;
	previousJar = jar;
	if (!jar) {
		window.showErrorMessage("Could not locate a .jar for Miksilo. Please configure \"miksilo.jar\" in settings.");
		return;
	} 

	for(const previousClient of context.subscriptions) {
		previousClient.dispose()
	}
	context.subscriptions.length = 0;

	for(const language of languages) {
		const disposable = activateLanguage(jar, javaExecutable, language);
		context.subscriptions.push(disposable);
	}
}

function activateLanguage(jar: string, javaHome: string, language: LanguageConfiguration): Disposable {

	let serverOptions: ServerOptions = prepareExecutable(jar, language,javaHome)
	
	let clientOptions: LanguageClientOptions = {
		documentSelector: [{scheme: 'file', language: language.vscodeName}],
		synchronize: {
			configurationSection: 'miksilo',
		}
	}
	
	const languageClient = new LanguageClient(
		'miksilo' + language.vscodeName, 
		language.vscodeName + " Miksilo", 
		serverOptions, clientOptions);
		
	return languageClient.start();
}

function prepareExecutable(jar: string, language: LanguageConfiguration, 
	javaExecutable: string): Executable {

	const executable: Executable = Object.create(null);
	const options: ExecutableOptions = Object.create(null);
	options.env = process.env;
	options.stdio = 'pipe';
	executable.options = options;
	executable.command = javaExecutable;

	language.miksiloName = language.miksiloName || language.vscodeName;
	executable.args = ["-jar", jar, language.miksiloName]
	//"-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=localhost:1044",
	//"-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=6007",
	return executable;
}
