package cloudformation

import core.LazyLogging
import core.language.Language
import languageServer.LanguageBuilder

import scala.io.Codec
import scala.reflect.io.File

class CloudFormationLanguageBuilder(json: Boolean = true) extends LanguageBuilder with LazyLogging {

  override def build(arguments: collection.Seq[String]): Language = {
    val resourceSpecificationOption = if (arguments.isEmpty) {
      logger.debug("CloudFormation language requires passing a path to a resource specification as an argument")
      None
    } else {
      val path = arguments.head
      val input = File.apply(path).slurp(Codec.UTF8)
      Some(input)
    }
    val cloudFormation = new CloudFormationLanguage(resourceSpecificationOption)
    if (json) cloudFormation.jsonLanguage else cloudFormation.yamlLanguage
  }

  override def key = if (json) "cloudFormation" else "yamlCloudFormation"
}
