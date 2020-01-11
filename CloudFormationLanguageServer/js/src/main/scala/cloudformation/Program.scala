package cloudformation

import jsonRpc.{JsonRpcConnection, LambdaLogger, LazyLogging, NodeMessageReader, NodeMessageWriter}
import languageServer.LanguageServerMain

import scala.scalajs.js
import scala.scalajs.js.Dynamic.{global => g}

object Program extends LanguageServerMain(Seq(

  new CloudFormationLanguageBuilder(json = true),
  new CloudFormationLanguageBuilder(json = false)),
    new JsonRpcConnection(
      new NodeMessageReader(g.process.stdin),
      new NodeMessageWriter(g.process.stdout))) {

  override def main(args: Array[String]): Unit = {
    LazyLogging.logger = new LambdaLogger(s => g.process.stderr.write(s))
    val nodeArgs = g.process.argv.asInstanceOf[js.Array[String]].drop(2).toArray
    super.main(nodeArgs)
  }
}

