package cloudformation

import com.typesafe.scalalogging.LazyLogging
import languageServer.{LanguageServerMain, LanguageBuilder}
import scala.reflect.io.File

class CloudFormationLanguageBuilder(json: Boolean = true) extends LanguageBuilder with LazyLogging {
  override def build(arguments: Seq[String]) = {
    val resourceSpecificationOption = if (arguments.isEmpty) {
      logger.debug("CloudFormation language requires passing a path to a resource specification as an argument")
      None
    } else {
      val path = arguments.head
      val inputStream = File(path).inputStream()
      Some(inputStream)
    }
    val cloudFormation = new CloudFormationLanguage(resourceSpecificationOption)
    if (json) cloudFormation.jsonLanguage else cloudFormation.yamlLanguage
  }

  override def key = if (json) "cloudFormation" else "yamlCloudFormation"
}

object Program extends LanguageServerMain(Seq(
  new CloudFormationLanguageBuilder(json = true),
  new CloudFormationLanguageBuilder(json = false)))
