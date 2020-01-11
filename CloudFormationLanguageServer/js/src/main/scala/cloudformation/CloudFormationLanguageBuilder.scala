package cloudformation

import core.language.Language
import jsonRpc.LazyLogging
import languageServer.LanguageBuilder

class CloudFormationLanguageBuilder(json: Boolean = true) extends LanguageBuilder with LazyLogging {

  override def build(arguments: collection.Seq[String]): Language = {
    val resourceSpecificationOption = if (arguments.isEmpty) {
      logger.debug("CloudFormation language requires passing a path to a resource specification as an argument")
      None
    } else {
      val path = arguments.head
      val input = Fs.readFileSync(path, "utf8")
      Some(input)
    }
    val cloudFormation = new CloudFormationLanguage(resourceSpecificationOption)
    if (json) cloudFormation.jsonLanguage else cloudFormation.yamlLanguage
  }

  override def key = if (json) "cloudFormation" else "yamlCloudFormation"
}
