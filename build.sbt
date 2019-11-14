import sbt.Keys.{homepage, scmInfo}

import scala.sys.process._

lazy val miksilo = project
  .in(file("."))
  .aggregate(
    editorParser,
    LSPProtocol,
    languageServer,
    modularLanguages,
    cloudFormationLanguage
  )

lazy val commonSettings = Seq(

  version := "1.0",
  resolvers += "dhpcs at bintray" at "https://dl.bintray.com/dhpcs/maven",
  logLevel := Level.Info,
  logBuffered in Test := false,
  scalaVersion := "2.12.4",
  scalacOptions += "-deprecation",
  scalacOptions += "-feature",
  scalacOptions += "-language:implicitConversions",
  scalacOptions += "-language:postfixOps",

  libraryDependencies += "org.scalatest" % "scalatest_2.12" % "3.0.4" % "test",

  // https://mvnrepository.com/artifact/com.typesafe.scala-logging/scala-logging
  libraryDependencies += "com.typesafe.scala-logging" %% "scala-logging" % "3.7.2",
  libraryDependencies += "ch.qos.logback" % "logback-classic" % "1.1.7",
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
  settings(commonSettings: _*)

lazy val LSPProtocol = (project in file("Miksilo/LSPProtocol")).
  settings(commonSettings: _*).
  settings(
    libraryDependencies += "com.dhpcs" %% "scala-json-rpc" % "2.0.1"
  ).dependsOn(editorParser)

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

  ).dependsOn(editorParser, LSPProtocol)

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

  ).dependsOn(languageServer)

lazy val cloudFormationLanguage = (project in file("CloudFormationLanguageServer")).
  settings(commonSettings: _*).
  settings(
    name := "CloudFormationLanguageServer",
    assemblySettings,
    mainClass in Compile := Some("cloudformation.Program"),
    vscode := {
      val tsc = Process("tsc", file("./extension"))
      val assemblyFile: String = assembly.value.getAbsolutePath
      val extensionDirectory: File = file("./extension").getAbsoluteFile
      val vscode = Process(Seq("code", s"--extensionDevelopmentPath=$extensionDirectory"),
        None,
        "MIKSILO" -> assemblyFile)

      tsc.#&&(vscode).run
    },

    // https://mvnrepository.com/artifact/com.typesafe.play/play-json
    libraryDependencies += "com.typesafe.play" %% "play-json" % "2.6.9",
  ).dependsOn(modularLanguages, languageServer)

lazy val vscode = taskKey[Unit]("Run VS Code with Miksilo")
