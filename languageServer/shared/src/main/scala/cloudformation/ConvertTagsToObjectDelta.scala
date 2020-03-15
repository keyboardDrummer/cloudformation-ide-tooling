package cloudformation

import miksilo.editorParser.parsers.core.OffsetPointer
import miksilo.editorParser.parsers.editorParsers.OffsetPointerRange
import miksilo.languageServer.core.language.Compilation
import miksilo.modularLanguages.core.deltas.DeltaWithPhase
import miksilo.modularLanguages.core.deltas.path.{ChildPath, PathRoot}
import miksilo.modularLanguages.core.node.{FieldData, Node}
import miksilo.modularLanguages.deltas.yaml.YamlCoreDelta

object ConvertTagsToObjectDelta extends DeltaWithPhase {
  import miksilo.modularLanguages.deltas.json.JsonObjectLiteralDelta._

  override def transformProgram(program: Node, compilation: Compilation): Unit = {
    PathRoot(program).visitShape(YamlCoreDelta.TaggedNode, path => {
      val tagName: String = path.current(YamlCoreDelta.TagName).asInstanceOf[String]
      val tagValue: FieldData = path.getFieldData(YamlCoreDelta.TagNode)
      val newNode = Shape.create(Members -> Seq(
        MemberShape.createWithData(
          MemberKey -> ((if (tagName == "Ref" ) "" else "Fn::") + tagName),
          MemberValue -> tagValue)
      ))
      range(path.current).foreach(r => newNode.sources.put(Members, r)) // TODO it would be nice if we could leave this out, if members would inherit the source position from their children.
      path.asInstanceOf[ChildPath].replaceWith(newNode)
    })
  }

  implicit val ordering: Ordering[OffsetPointer] =
    (x: OffsetPointer, y: OffsetPointer) => x.offset.compare(y.offset)

  // TODO remove this when Node contains better sources
  def range(node: Node): Option[OffsetPointerRange] =
    if (node.sources.values.isEmpty) None
    else Some(OffsetPointerRange(
      node.sources.values.map(p => p.from).min,
      node.sources.values.map(p => p.until).max))

  override def description = "Rewrite YAML tags into JSON objects"

  override def dependencies = Set(YamlCoreDelta)
}
