'use strict';

import { commands, workspace, ExtensionContext, window, Disposable } from 'vscode';
import { Executable, LanguageClient, LanguageClientOptions, ServerOptions, ExecutableOptions } from 'vscode-languageclient';
import * as path from 'path'
import * as fs from 'fs'
import * as requirements from './requirements';
import TelemetryReporter from 'vscode-extension-telemetry';

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
let reporter: TelemetryReporter;

export function activate(context: ExtensionContext) {

	return requirements.resolveRequirements().catch(error => {
		// show error
		window.showErrorMessage(error.message, error.label).then((selection) => {
			if (error.label && error.label === selection && error.command) {
				commands.executeCommand(error.command, error.commandParam);
			}
		});
		// rethrow to disrupt the chain.
		throw error;
	}).then(requirements => {
		workspace.onDidChangeConfiguration(() => activateJar(requirements, context));
		activateJar(requirements, context);
	})
}

let previousJar: string | null | undefined = undefined;
function activateJar(requirements: requirements.RequirementsData, context: ExtensionContext) {
	const javaHome = requirements.java_home;
	const javaExecutable: string = path.join(javaHome, "/bin/java");

	const jar: string = process.env.MIKSILO ||
	    workspace.getConfiguration('miksilo').get("jar") || `${__dirname}/CloudFormationLanguageServer.jar`;
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
	
    const extensionPath = path.join(context.extensionPath, "package.json");
    const packageFile = JSON.parse(fs.readFileSync(extensionPath, 'utf8'));

	let version = "unknown"
	let extensionId = "unknown"
    if (packageFile) {
		version = packageFile.version;
		extensionId = packageFile.name
	}

	// create telemetry reporter on extension activation
	reporter = new TelemetryReporter(extensionId, version, "4f5e6451-3d46-49f6-a295-ade5e6d47d47");
	reporter.sendTelemetryEvent("activate")

	// ensure it gets property disposed
	context.subscriptions.push(reporter);

	for(const language of languages) {
		const disposable = activateLanguage(jar, javaExecutable, language);
		context.subscriptions.push(disposable);
	}
}

function activateLanguage(jar: string, javaExecutable: string, language: LanguageConfiguration): Disposable {

	let serverOptions: ServerOptions = prepareExecutable(jar, language,javaExecutable)
	
	let clientOptions: LanguageClientOptions = {
		documentSelector: [{scheme: 'file', language: language.vscodeName}],
		synchronize: {
			configurationSection: 'miksilo',
		}
	}
	
	const start = Date.now()
	const languageClient = new LanguageClient(
		'miksilo' + language.vscodeName, 
		language.vscodeName + " Miksilo", 
		serverOptions, clientOptions);

	const info = (message: String) => {
		languageClient.outputChannel.appendLine(`[INFO] ${message}`);
	}
	languageClient.onReady().then(_ => {
		const connectionTime = Date.now() - start;
		info(`Connection time was ${connectionTime}`);
		reporter.sendTelemetryEvent(language.vscodeName + "_ready", undefined, { connectionTime })
	})
	languageClient.onTelemetry((data: any) => {
		const {name, value} = data
		const measurements = {}
		measurements[name] = value
		info(`${name} was ${value}`);
		reporter.sendTelemetryEvent(language.vscodeName + "_lspServer", undefined, measurements)
	})

	info("Using Miksilo jar " + jar);
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
	executable.args = ["-jar", jar, language.miksiloName, __dirname + "/../CloudFormationResourceSpecification.json"]
	//"-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=localhost:1044",
	//"-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=6007",
	return executable;
}

export function deactivate() {
	if (reporter) {
		reporter.dispose();
	}
}