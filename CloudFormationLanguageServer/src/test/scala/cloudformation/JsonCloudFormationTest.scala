package deltas.cloudformation

import core.SourceUtils
import core.bigrammar.TestLanguageGrammarUtils
import core.parsers.editorParsers.{Position, SourceRange, UntilBestAndXStepsStopFunction}
import languageServer.{LanguageServerTest, MiksiloLanguageServer}
import lsp._
import lsp.HumanPosition
import org.scalatest.FunSuite
import util.TestLanguageBuilder

object CloudFormationTest {
  val file = SourceUtils.getResourceFile("CloudFormationResourceSpecification.json")
  val language = new CloudFormationLanguage(Some(file))
}

class JsonCloudFormationTest extends FunSuite with LanguageServerTest {

  val jsonLanguage = TestLanguageBuilder.buildWithParser(CloudFormationTest.language.jsonDeltas,
    UntilBestAndXStepsStopFunction(1))
  val jsonServer = new MiksiloLanguageServer(jsonLanguage)

  test("No diagnostics") {
    val program = SourceUtils.getResourceFileContents("AutoScalingMultiAZWithNotifications.json")
    val result = getDiagnostics(jsonServer, program)
    assert(result.size == 1)
  }

  test("Diagnostics edited") {
    val program = SourceUtils.getResourceFileContents("AutoScalingMultiAZWithNotifications_edited.json")
    val result = getDiagnostics(jsonServer, program)
    assert(result.size == 2)
  }

  /*
  We need a high errorMultiplier (3 works) so using "VpcId" is not picked as a value for "BrokenParameter",
  because that leads to many errors down the line
   */
  test("missing : <value> ,") {
    val input = """{
                  |    "BrokenParameter"
                  |    "VpcId" : {
                  |      "Type" : "AWS::EC2::VPC::Id",
                  |    }
                  |}""".stripMargin
    val diagnostics = getDiagnostics(jsonServer, input)
    assert(diagnostics.size == 1)
    val diagnostic = diagnostics.head
    assertResult(Position(1, 21))(diagnostic.range.start)
  }

  test("missing \": <value>,") {
    val input = """{
                  |    "InstanceType" : "Foo",
                  |    "
                  |    "VpcId" : {
                  |      "Type" : "AWS::EC2::VPC::Id",
                  |    }
                  |}""".stripMargin
    val diagnostics = getDiagnostics(jsonServer, input)
    assert(diagnostics.size == 1)
  }

  test("Goto definition resource reference") {
    val program = SourceUtils.getResourceFileContents("AutoScalingMultiAZWithNotifications.json")
    val result: Seq[FileRange] = gotoDefinition(jsonServer, program, new HumanPosition(365, 37))
    assertResult(Seq(FileRange(itemUri, SourceRange(new HumanPosition(336,6), new HumanPosition(336,28)))))(result)
  }

  test("Goto definition") {
    val program = SourceUtils.getResourceFileContents("AutoScalingMultiAZWithNotifications.json")
    val result: Seq[FileRange] = gotoDefinition(jsonServer, program, new HumanPosition(437, 36))
    assertResult(Seq(FileRange(itemUri, SourceRange(new HumanPosition(42,6), new HumanPosition(42,17)))))(result)
  }

  test("Goto definition overloaded parameter") {
    val program = SourceUtils.getResourceFileContents("AutoScalingMultiAZWithNotifications.json")
    val result = gotoDefinition(jsonServer, program, new HumanPosition(445, 32))
    assertResult(Seq(FileRange(itemUri, SourceRange(new HumanPosition(8,6), new HumanPosition(8,11)))))(result)
  }

  test("Goto definition overloaded parameter second") {
    val program = SourceUtils.getResourceFileContents("AutoScalingMultiAZWithNotifications.json")
    val result = gotoDefinition(jsonServer, program, new HumanPosition(425, 32))
    assertResult(Seq(FileRange(itemUri, SourceRange(new HumanPosition(8,6), new HumanPosition(8,11)))))(result)
  }

  test("Code completion parameter") {
    val program = SourceUtils.getResourceFileContents("AutoScalingMultiAZWithNotifications.json")
    val result = complete(jsonServer, program, new HumanPosition(437, 38))
    val item = createCompletionItem("SSHLocation")
    assertResult(CompletionList(isIncomplete = false, Seq(item)))(result)
  }

  test("Code completion property") {
    val program = SourceUtils.getResourceFileContents("AutoScalingMultiAZWithNotifications.json")
    val result = complete(jsonServer, program, new HumanPosition(214, 14))
    val item = createCompletionItem("Subscription")
    assertResult(CompletionList(isIncomplete = false, Seq(item))) (result)
  }

  test("Code completion overloaded parameter") {
    val program = SourceUtils.getResourceFileContents("AutoScalingMultiAZWithNotifications.json")
    val result = complete(jsonServer, program, new HumanPosition(425, 32))
    val item = createCompletionItem("VpcId")
    assertResult(CompletionList(isIncomplete = false, Seq(item)))(result)
  }

  test("Parse example") {
    val utils = new TestLanguageGrammarUtils(CloudFormationTest.language.jsonDeltas)
    val source = SourceUtils.getResourceFileContents("AutoScalingMultiAZWithNotifications.json")
    utils.parse(source)
  }

  test("Code completion for property when most of the line is missing") {
    val program =
      """{
        |  "Resources" : {
        |    "NotificationTopic": {
        |      "Type": "AWS::SNS::Topic",
        |      "Properties": {
        |        "Subsc"
      """.stripMargin
    val server = new MiksiloLanguageServer(jsonLanguage)
    val document = openDocument(server, program)
    val start = new HumanPosition(6, 14)
    val result = server.complete(DocumentPosition(document, start))

    val item = createCompletionItem("Subscription")
    assertResult(CompletionList(isIncomplete = false, Seq(item))) (result)
  }

  test("Missing in the middle") {
    val program =
      """{
        |  "Parameters" : {
        |    "KeyName": "The EC2 Key Pair to allow SSH access to the instances",
        |    "MemberWithOnlyKey":
        |  },
        |  "Resources" : {
        |    "LaunchConfig": {
        |      "Type": "AWS::AutoScaling::LaunchConfiguration",
        |      "Properties": {
        |        "KeyName": { "Ref": "KeyName" }
        |      }
        |    }
        |  }
        |}
        """.stripMargin
    val server = new MiksiloLanguageServer(jsonLanguage)
    val document = openDocument(server, program)
    val start = new HumanPosition(10, 30)
    val result = server.gotoDefinition(DocumentPosition(document, start))

    assertResult(Seq(FileRange(itemUri, SourceRange(new HumanPosition(3,6), new HumanPosition(3,13)))))(result)
  }

  test("file only has a string literal") {
    val program = "\"Foo\""
    val result = getDiagnostics(jsonServer, program)
    assert(result.isEmpty)
  }

  test("file has literal resources") {
    val program = """{"Resources" : "Bar"}"""
    val result = getDiagnostics(jsonServer, program)
    assert(result.isEmpty)
  }

  test("file has literal parameters") {
    val program = """{"Parameters" : "Bar"}"""
    val result = getDiagnostics(jsonServer, program)
    assert(result.isEmpty)
  }

  test("file only has a single member object") {
    val program = """{"Foo" : "Bar"}"""
    val result = getDiagnostics(jsonServer, program)
    assert(result.isEmpty)
  }
}
