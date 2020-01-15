package cloudformation

import core.language.Language
import jsonRpc._
import languageServer.MiksiloLanguageServer
import lsp.LSPServer

import scala.concurrent.ExecutionContext
import scala.scalajs.js.Dynamic.{global => g}
import scala.scalajs.js.annotation.{JSExport, JSExportTopLevel}

@JSExportTopLevel("BrowserAPI")
object BrowserAPI {
  private val cloudFormation = new CloudFormationLanguage(None)
  val json = cloudFormation.jsonLanguage
  val yaml = cloudFormation.yamlLanguage

  LazyLogging.logger = new LambdaLogger(s => g.console.error(s))

  @JSExport
  def jsonServer(reader: JSMessageReader, writer: JSMessageWriter): Unit = {
    val language = json
    startServer(reader, writer, language)
  }

  @JSExport
  def yamlServer(reader: JSMessageReader, writer: JSMessageWriter): Unit = {
    startServer(reader, writer, yaml)
  }

  private def startServer(reader: JSMessageReader, writer: JSMessageWriter, language: Language): Unit = {
    val connection = new JsonRpcConnection(
      new FromJSMessageReader(reader), new FromJSMessageWriter(writer))
    val languageServer = new MiksiloLanguageServer(language)
    new LSPServer(languageServer, connection
      //      , new ExecutionContext {
      //      override def execute(runnable: Runnable): Unit = g.setTimeout(() => runnable.run(), 1)
      //
      //      override def reportFailure(cause: Throwable): Unit = ???
      //    }
    )
    connection.listen()
  }
}
