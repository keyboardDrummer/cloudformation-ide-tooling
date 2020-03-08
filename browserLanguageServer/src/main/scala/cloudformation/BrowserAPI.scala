package cloudformation

import core.LazyLogging
import core.language.Language
import jsonRpc._
import languageServer.MiksiloLanguageServer

import scala.scalajs.js.annotation.{JSExport, JSExportTopLevel}

@JSExportTopLevel("BrowserAPI")
object BrowserAPI {

  LazyLogging.logger = ConsoleLogger

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