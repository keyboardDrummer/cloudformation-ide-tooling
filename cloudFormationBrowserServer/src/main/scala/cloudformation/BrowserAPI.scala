package cloudformation

import core.language.Language
import jsonRpc._
import languageServer.MiksiloLanguageServer
import lsp.LSPServer

import scala.scalajs.js.Dynamic.{global => g}
import scala.scalajs.js.annotation.{JSExport, JSExportTopLevel}

object BrowserLogger extends Logger {
  override def debug(message: String): Unit = {} //write(s"[DEBUG] $message\n")

  override def info(message: String): Unit = g.console.info(message)

  override def error(message: String): Unit = g.console.error(message)
}

@JSExportTopLevel("BrowserAPI")
object BrowserAPI {

  LazyLogging.logger = BrowserLogger

  @JSExport
  def jsonServer(reader: JSMessageReader, writer: JSMessageWriter, resourceSpecification: String): Unit = {
    val language = new CloudFormationLanguage(Option(resourceSpecification))
    startServer(reader, writer, language.jsonLanguage)
  }

  @JSExport
  def yamlServer(reader: JSMessageReader, writer: JSMessageWriter, resourceSpecification: String): Unit = {
    val language = new CloudFormationLanguage(Option(resourceSpecification))
    startServer(reader, writer, language.yamlLanguage)
  }

  private def startServer(reader: JSMessageReader, writer: JSMessageWriter, language: Language): Unit = {
    val connection = new JsonRpcConnection(
      new FromJSMessageReader(reader), new FromJSMessageWriter(writer))
    val languageServer = new MiksiloLanguageServer(language)
    new LSPServer(languageServer, connection)
    connection.listen()
  }
}