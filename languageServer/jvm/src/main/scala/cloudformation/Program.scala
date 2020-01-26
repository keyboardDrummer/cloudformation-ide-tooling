package cloudformation

import jsonRpc.{JVMMessageReader, JVMMessageWriter, JsonRpcConnection, LambdaLogger, LazyLogging}
import languageServer.LanguageServerMain

object Program extends LanguageServerMain(Seq(

  new CloudFormationLanguageBuilder(json = true),
  new CloudFormationLanguageBuilder(json = false)),
  new JsonRpcConnection(
    new JVMMessageReader(System.in),
    new JVMMessageWriter(System.out))) {

  override def main(args: Array[String]): Unit = {
    LazyLogging.logger = new LambdaLogger(s => System.err.println(s))
    super.main(args)
  }
}
