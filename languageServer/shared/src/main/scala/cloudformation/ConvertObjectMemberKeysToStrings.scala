package cloudformation

import miksilo.languageServer.core.language.Compilation
import miksilo.modularLanguages.core.deltas.DeltaWithPhase
import miksilo.modularLanguages.core.deltas.path.{FieldPath, NodeChildPath, NodePath}
import miksilo.modularLanguages.core.node.Node
import miksilo.modularLanguages.deltas.expression.StringLiteralDelta
import miksilo.modularLanguages.deltas.json.{JsonObjectLiteralDelta, JsonStringLiteralDelta}
import miksilo.modularLanguages.deltas.json.JsonObjectLiteralDelta.MemberKey
import miksilo.modularLanguages.deltas.yaml.YamlCoreDelta

object ConvertObjectMemberKeysToStrings extends DeltaWithPhase {
  override def transformProgram(program: Node, compilation: Compilation): Unit = {

    compilation.program.asInstanceOf[NodePath].visitShape(JsonObjectLiteralDelta.MemberShape, path => {
      path(MemberKey) match {
        case key: NodeChildPath =>
          key.current.shape match {
            case StringLiteralDelta.Shape => key.replaceWith(key.current(JsonStringLiteralDelta.Value))
            case YamlCoreDelta.TaggedNode => key.replaceWith(key.current(YamlCoreDelta.TagNode).asInstanceOf[Node](JsonStringLiteralDelta.Value))
            case _ =>
              throw new Exception("Only string literals allowed")
          }
        case fieldPath: FieldPath if fieldPath.current.isInstanceOf[String] =>
      }
    })

  }

  override def description = "Remove tags in object members keys, and unbox string literal object member keys"

  override def dependencies = Set(JsonObjectLiteralDelta, YamlCoreDelta, JsonStringLiteralDelta)
}
