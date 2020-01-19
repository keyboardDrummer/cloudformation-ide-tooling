package cloudformation

import core.deltas.DeltaWithPhase
import core.deltas.path.{FieldPath, NodeChildPath, NodePath, PathRoot}
import core.language.Compilation
import core.language.node.Node
import deltas.expression.StringLiteralDelta
import deltas.json.JsonObjectLiteralDelta.MemberKey
import deltas.json.{JsonObjectLiteralDelta, JsonStringLiteralDelta}
import deltas.yaml.YamlCoreDelta

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
