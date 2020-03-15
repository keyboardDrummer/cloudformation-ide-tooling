package cloudformation

import miksilo.languageServer.JSLanguageServer
import miksilo.languageServer.server.LanguageServerMain
import miksilo.lspprotocol.jsonRpc.{JSQueue, JsonRpcConnection, NodeMessageReader, NodeMessageWriter, WorkItem}

import scala.concurrent.ExecutionContext
import scala.scalajs.js
import scala.scalajs.js.Dynamic.{global => g}

object Program extends JSLanguageServer(Seq(
  new CloudFormationLanguageBuilder(json = true),
  new CloudFormationLanguageBuilder(json = false))) {
}


