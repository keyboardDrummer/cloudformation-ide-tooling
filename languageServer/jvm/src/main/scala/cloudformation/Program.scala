package cloudformation

import miksilo.languageServer.JVMLanguageServer

object Program extends JVMLanguageServer(Seq(

  new CloudFormationLanguageBuilder(json = true),
  new CloudFormationLanguageBuilder(json = false))) {

}
