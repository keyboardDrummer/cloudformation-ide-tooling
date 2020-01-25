import sbt.Keys.{homepage, scmInfo}

import scala.sys.process._
import sbtcrossproject.CrossPlugin.autoImport.{crossProject, CrossType}

lazy val cloudformation = project
  .in(file("."))
  .aggregate(
    editorParser.jvm,
    LSPProtocol.jvm,
    LSPProtocol.js,
    miksiloLanguageServer.jvm,
    modularLanguages.jvm,
    languageServer.jvm
  )

lazy val commonSettings = Seq(

  version := "1.0",
  resolvers += "dhpcs at bintray" at "https://dl.bintray.com/dhpcs/maven",
  logLevel := Level.Info,
  logBuffered in Test := false,
  scalaVersion := "2.13.1",
  scalacOptions += "-deprecation",
  scalacOptions += "-feature",
  scalacOptions += "-language:implicitConversions",
  scalacOptions += "-language:postfixOps",

  libraryDependencies += "org.scalatest" %%% "scalatest" % "3.1.0" % "test"
)

lazy val assemblySettings = Seq(

  assemblyJarName in assembly := name.value + ".jar",
  test in assembly := {},
  assemblyMergeStrategy in assembly := {
    case PathList("META-INF", xs @ _*) => MergeStrategy.discard
    case _                             => MergeStrategy.first
  }
)

lazy val editorParser = crossProject(JVMPlatform, JSPlatform).
  crossType(CrossType.Full).
  in(file("Miksilo/editorParser")).
  settings(commonSettings: _*).
  jvmSettings(

    // Only used for SourceUtils, should get rid of it.
    // https://mvnrepository.com/artifact/org.scala-lang/scala-reflect
    libraryDependencies += "org.scala-lang" % "scala-reflect" % "2.13.1"
  )

lazy val LSPProtocol = crossProject(JVMPlatform, JSPlatform).
  crossType(CrossType.Full).
  in(file("Miksilo/LSPProtocol")).
  settings(commonSettings: _*).
  settings(
    libraryDependencies += "com.typesafe.play" %%% "play-json" % "2.8.1",
  ).
  jsSettings(scalacOptions += "-P:scalajs:sjsDefinedByDefault").
  dependsOn(editorParser)

lazy val miksiloLanguageServer = crossProject(JVMPlatform, JSPlatform).
  crossType(CrossType.Pure).
  in(file("Miksilo/languageServer")).
  settings(commonSettings: _*).
  settings(
    assemblySettings,

    organization := "com.github.keyboardDrummer",
    homepage := Some(url("http://keyboarddrummer.github.io/Miksilo/")),
    scmInfo := Some(ScmInfo(url("https://github.com/keyboardDrummer/Miksilo"),
      "git@github.com:keyboardDrummer/Miksilo.git")),
    developers := List(Developer("keyboardDrummer",
      "Remy Willems",
      "rgv.willems@gmail.com",
      url("https://github.com/keyboardDrummer"))),
    licenses += ("MIT", url("https://github.com/keyboardDrummer/Miksilo/blob/master/LICENSE")),
    publishMavenStyle := true,

    publishTo := Some(
      if (isSnapshot.value)
        Opts.resolver.sonatypeSnapshots
      else
        Opts.resolver.sonatypeStaging
    ),

  ).dependsOn(editorParser % "compile->compile;test->test", LSPProtocol)

lazy val modularLanguages = crossProject(JVMPlatform, JSPlatform).
  crossType(CrossType.Full).
  in(file("Miksilo/modularLanguages")).
  settings(commonSettings: _*).
  settings(
    name := "modularLanguages",
    assemblySettings,
    mainClass in Compile := Some("deltas.Program"),

    // byteCode parser
    libraryDependencies += "org.scala-lang.modules" %% "scala-parser-combinators" % "1.1.2",

  ).dependsOn(miksiloLanguageServer,
  editorParser % "compile->compile;test->test" /* for bigrammar testing utils*/ )


def languageServerCommonTask(assemblyFile: String) = {
  val copyJar = Process(Seq("cp", assemblyFile, "./vscode-extension/out/CloudFormationLanguageServer.js"))
  val copySpec = Process(Seq("cp", "./CloudFormationResourceSpecification.json", "./vscode-extension/out/"))
  val yarn = Process(Seq("yarn", "compile"), file("./vscode-extension"))
  copyJar.#&&(copySpec).#&&(yarn)
}

lazy val languageServer = crossProject(JVMPlatform, JSPlatform).
  crossType(CrossType.Full).
  in(file("languageServer")).
  settings(commonSettings: _*).
  jsSettings(
    fastvscode := {
      val assemblyFile: String = (fastOptJS in Compile).value.data.getAbsolutePath
      val extensionDirectory: File = file("./vscode-extension").getAbsoluteFile
      val vscode = Process(Seq("code", s"--extensionDevelopmentPath=$extensionDirectory"), None)

      languageServerCommonTask(assemblyFile).#&&(vscode).run
    },

    vscodeprepublish := {
      val assemblyFile: String = (fullOptJS in Compile).value.data.getAbsolutePath
      languageServerCommonTask(assemblyFile).run
    },

    fullvscode := {
      val assemblyFile: String = (fullOptJS in Compile).value.data.getAbsolutePath
      val extensionDirectory: File = file("./vscode-extension").getAbsoluteFile
      val vscode = Process(Seq("code", s"--extensionDevelopmentPath=$extensionDirectory"), None)
      languageServerCommonTask(assemblyFile).#&&(vscode).run
    }).
  settings(
    name := "languageServer",

    mainClass in Compile := Some("cloudformation.Program"),
    scalaJSUseMainModuleInitializer := true,
    scalaJSModuleKind := ModuleKind.CommonJSModule,
    // https://mvnrepository.com/artifact/com.typesafe.play/play-json
    libraryDependencies += "com.lihaoyi" %%% "upickle" % "0.8.0",
  ).dependsOn(LSPProtocol, modularLanguages % "compile->compile;test->test", miksiloLanguageServer)

lazy val fastvscode = taskKey[Unit]("Run VS Code Fast")
lazy val vscodeprepublish = taskKey[Unit]("Build VS Code")
lazy val fullvscode = taskKey[Unit]("Run VS Code Optimized")

def browserLanguageServerCommonTask(assemblyFile: String) = {
  val copy = Process(Seq("cp", assemblyFile, "./browserClientExample/localDependency/server.js"))
  val yarn = Process(Seq("yarn", "dev"), file("./browserClientExample"))
  copy.#&&(yarn)
}
lazy val browserLanguageServer = project.
  in(file("browserLanguageServer")).
  enablePlugins(ScalaJSPlugin).
  settings(commonSettings: _*).
  settings(
    fastbrowser := {
      val assemblyFile: String = (fastOptJS in Compile).value.data.getAbsolutePath
      browserLanguageServerCommonTask(assemblyFile).run
    },

    fullbrowser := {
      val assemblyFile: String = (fullOptJS in Compile).value.data.getAbsolutePath
      browserLanguageServerCommonTask(assemblyFile).run
    }).
  settings(
    name := "browserLanguageServer",

    scalaJSUseMainModuleInitializer := false,
    scalaJSModuleKind := ModuleKind.CommonJSModule,
    // https://mvnrepository.com/artifact/com.typesafe.play/play-json
    libraryDependencies += "com.lihaoyi" %%% "upickle" % "0.8.0",
  ).dependsOn(languageServer.js)

lazy val fastbrowser = taskKey[Unit]("Run Browser Example Fast")
lazy val fullbrowser = taskKey[Unit]("Run Browser Example Optimized")
