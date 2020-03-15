package cloudformation

import miksilo.editorParser.parsers.editorParsers.UntilTimeStopFunction
import miksilo.languageServer.core.language.Language
import miksilo.languageServer.languages.{JsonLanguage, YamlLanguage}
import miksilo.modularLanguages.core.SolveConstraintsDelta
import miksilo.modularLanguages.core.deltas.{Delta, LanguageFromDeltas, ParseUsingTextualGrammar}
import miksilo.modularLanguages.deltas.json.ModularJsonLanguage
import miksilo.modularLanguages.deltas.yaml.ModularYamlLanguage

class CloudFormationLanguage(resourceSpecificationOption: Option[String]) {
  val cloudFormationTemplate = new CloudFormationTemplate(resourceSpecificationOption)
  val jsonDeltas: Seq[Delta] = Seq(cloudFormationTemplate) ++
    ModularJsonLanguage.deltas ++ Seq(SolveConstraintsDelta)
  val jsonLanguage: Language = LanguageFromDeltas(Seq(ParseUsingTextualGrammar(UntilTimeStopFunction(200))) ++ jsonDeltas)

  val yamlDeltas: Seq[Delta] = Seq(ModularYamlLanguage.parserDelta) ++
    Seq(ConvertObjectMemberKeysToStrings, ConvertTagsToObjectDelta, cloudFormationTemplate) ++
    ModularYamlLanguage.deltasWithoutParser ++ Seq(SolveConstraintsDelta)

  val yamlLanguage: Language = LanguageFromDeltas(yamlDeltas)
}


