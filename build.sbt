import sbt.Keys.{homepage, scmInfo}

import scala.sys.process._

lazy val miksilo = project
  .in(file("."))
  .aggregate(
    editorParser,
    LSPProtocol,
    languageServer,
    modularLanguages,
    //cloudFormationLanguage,
    cloudFormationBrowserServer
  ).enablePlugins(ScalaJSPlugin)

lazy val commonSettings = Seq(

  version := "1.0",
  resolvers += "dhpcs at bintray" at "https://dl.bintray.com/dhpcs/maven",
  resolvers += Resolver.sonatypeRepo("releases"),
  logLevel := Level.Info,
  logBuffered in Test := false,
  scalaVersion := "2.12.4",
  scalacOptions += "-deprecation",
  scalacOptions += "-feature",
  scalacOptions += "-language:implicitConversions",
  scalacOptions += "-language:postfixOps",

  libraryDependencies += "org.scalatest" % "scalatest_2.12" % "3.0.4" % "test",

)

lazy val assemblySettings = Seq(

  assemblyJarName in assembly := name.value + ".jar",
  test in assembly := {},
  assemblyMergeStrategy in assembly := {
    case PathList("META-INF", xs @ _*) => MergeStrategy.discard
    case _                             => MergeStrategy.first
  }
)

lazy val editorParser = (project in file("Miksilo/editorParser")).
  settings(commonSettings: _*).
  settings(

    // https://mvnrepository.com/artifact/org.scala-lang/scala-reflect
    libraryDependencies += "org.scala-lang" % "scala-reflect" % "2.12.4",
  ).enablePlugins(ScalaJSPlugin)

lazy val LSPProtocol = (project in file("Miksilo/LSPProtocol")).
  settings(commonSettings: _*).
  settings(
    libraryDependencies += "com.typesafe.play" %%% "play-json" % "2.7.4",
    libraryDependencies += "io.github.shogowada" %%% "scala-json-rpc" % "0.9.3",
  ).dependsOn(editorParser).enablePlugins(ScalaJSPlugin)

lazy val languageServer = (project in file("Miksilo/languageServer")).
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

  ).dependsOn(editorParser % "compile->compile;test->test", LSPProtocol).enablePlugins(ScalaJSPlugin)

lazy val modularLanguages = (project in file("Miksilo/modularLanguages")).
  settings(commonSettings: _*).
  settings(
    name := "modularLanguages",
    assemblySettings,
    mainClass in Compile := Some("deltas.Program"),

    // byteCode parser
    libraryDependencies += "org.scala-lang.modules" % "scala-parser-combinators_2.12" % "1.0.6",

    //import com.google.common.primitives.{Ints, Longs}
    libraryDependencies += "com.google.guava" % "guava" % "18.0",

  ).dependsOn(languageServer % "compile->compile;test->test").enablePlugins(ScalaJSPlugin)

//lazy val cloudFormationLanguage = (project in file("CloudFormationLanguageServer")).
//  settings(commonSettings: _*).
//  enablePlugins(ScalaJSPlugin).
//  settings(
//    name := "CloudFormationLanguageServer",
//    scalaJSUseMainModuleInitializer := true,
//    scalaJSModuleKind := ModuleKind.CommonJSModule,
//    mainClass in Compile := Some("cloudformation.Program"),
//    vscode := {
//      val tsc = Process("tsc", file("./extension"))
//      val assemblyFile: String = "/Users/rwillems/Documents/GithubSources/vscode-cloudformation/CloudFormationLanguageServer/target/scala-2.12/cloudformationlanguageserver-opt.js" //fullOptJS.value.data.getAbsolutePath
//      val extensionDirectory: File = file("./extension").getAbsoluteFile
//      val vscode = Process(Seq("code", s"--extensionDevelopmentPath=$extensionDirectory"),
//        None,
//        "MIKSILO" -> assemblyFile)
//
//      tsc.#&&(vscode).run
//    },
//
//    fastvscode := {
//      val tsc = Process("tsc", file("./extension"))
//      val assemblyFile: String = "/Users/rwillems/Documents/GithubSources/vscode-cloudformation/CloudFormationLanguageServer/target/scala-2.12/cloudformationlanguageserver-fastopt.js" //fullOptJS.value.data.getAbsolutePath
//      val extensionDirectory: File = file("./extension").getAbsoluteFile
//      val vscode = Process(Seq("code", s"--extensionDevelopmentPath=$extensionDirectory"),
//        None,
//        "MIKSILO" -> assemblyFile)
//
//      tsc.#&&(vscode).run
//    },
//
//    // https://mvnrepository.com/artifact/com.typesafe.play/play-json
//    libraryDependencies += "com.lihaoyi" %%% "upickle" % "0.8.0",
//  ).dependsOn(modularLanguages, languageServer)


lazy val cloudFormationBrowserServer = (project in file("CloudFormationLanguageServer")).
  settings(commonSettings: _*).
  enablePlugins(ScalaJSPlugin).
  settings(
    name := "CloudFormationBrowserServer",
    // mainClass in Compile := Some("cloudformation.TestOutput"),
    scalaJSModuleKind := ModuleKind.CommonJSModule,
    // https://mvnrepository.com/artifact/com.typesafe.play/play-json
    libraryDependencies += "com.lihaoyi" %%% "upickle" % "0.8.0",
  ).dependsOn(modularLanguages, languageServer)

lazy val vscode = taskKey[Unit]("Run VS Code with Miksilo")
lazy val fastvscode = taskKey[Unit]("Run VS Code with Miksilo Fast")
