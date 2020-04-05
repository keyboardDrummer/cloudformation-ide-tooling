import sbt.Keys.{homepage, scmInfo}

import scala.sys.process._
import sbtcrossproject.CrossPlugin.autoImport.{CrossType, crossProject}

import scala.reflect.io.File

lazy val cloudformation = project
  .in(file("."))
  .aggregate(
    languageServer.jvm,
    languageServer.js,
    browserLanguageServer
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

def languageServerCommonTask(assemblyFile: String) = {
  val extension = assemblyFile.split("\\.").last
  val removePrevious = Process(Seq("rm", "-f", "./vscode-extension/out/CloudFormationLanguageServer.jar"))
  val copyJar = Process(Seq("cp", assemblyFile, s"./vscode-extension/out/CloudFormationLanguageServer.${extension}"))
  val copySpec = Process(Seq("cp", "./CloudFormationResourceSpecification.json", "./vscode-extension/out/"))
  val yarn = Process(Seq("yarn", "compile"), file("./vscode-extension"))
  removePrevious.#&&(copyJar).#&&(copySpec).#&&(yarn)
}

def vscodeCommonTask(assemblyFile: String) = {
  val extensionDirectory = file("./vscode-extension").getAbsolutePath
  val vscode = Process(Seq("code", s"--extensionDevelopmentPath=$extensionDirectory"), None)
  languageServerCommonTask(assemblyFile).#&&(vscode)
}

lazy val languageServer = crossProject(JVMPlatform, JSPlatform).
  crossType(CrossType.Full).
  in(file("languageServer")).
  settings(commonSettings: _*).
  jvmSettings(assemblySettings: _*).
  jvmSettings(
    fastvscode := {
      vscodeCommonTask(assembly.value.getAbsolutePath).run
    },

    vscodeprepublish := {
      val assemblyFile: String = assembly.value.getAbsolutePath
      val copyJar = Process(Seq("cp", assemblyFile, s"./vscode-extension/out/CloudFormationLanguageServer.jar"))
      copyJar.run
    },

    fullvscode := {
      vscodeCommonTask(assembly.value.getAbsolutePath).run
    }
  ).
  jsSettings(
    scalaJSUseMainModuleInitializer := true,
    scalaJSModuleKind := ModuleKind.CommonJSModule,

    fastvscode := {
      val assemblyFile: String = (fastOptJS in Compile).value.data.getAbsolutePath
      vscodeCommonTask(assemblyFile).run
    },

    vscodeprepublish := {
      val assemblyFile: String = (fullOptJS in Compile).value.data.getAbsolutePath
      val copyJar = Process(Seq("cp", assemblyFile, s"./vscode-extension/out/CloudFormationLanguageServer.js"))
      val copySpec = Process(Seq("cp", "./CloudFormationResourceSpecification.json", "./vscode-extension/out/"))
      copyJar.#&&(copySpec).run
    },

    fullvscode := {
      val assemblyFile: String = (fullOptJS in Compile).value.data.getAbsolutePath
      vscodeCommonTask(assemblyFile).run
    }).
  settings(
    name := "languageServer",

    mainClass in Compile := Some("cloudformation.Program"),
    // https://mvnrepository.com/artifact/com.typesafe.play/play-json
    libraryDependencies += "com.lihaoyi" %%% "upickle" % "0.8.0",

    // https://mvnrepository.com/artifact/com.github.keyboardDrummer/modularlanguages
    libraryDependencies += "com.github.keyboardDrummer" %%% "modularlanguages" % "0.1.7"
  )

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
