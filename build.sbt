import java.nio.file.{Files, Paths, StandardCopyOption}

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

  libraryDependencies += "org.scalatest" %%% "scalatest" % "3.1.1" % "test"
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
  val extensionPath = Paths.get(".", "vscode-extension")
  val outPath = extensionPath.resolve("out")
  outPath.toFile.mkdir()
  outPath.resolve("CloudFormationLanguageServer.jar").toFile.delete()
  val extension = assemblyFile.split("\\.").last
  Files.copy(Paths.get(assemblyFile),
    outPath.resolve(s"CloudFormationLanguageServer.$extension"), StandardCopyOption.REPLACE_EXISTING)
  val cfnSpecification = Paths.get(".", "CloudFormationResourceSpecification.json")
  Files.copy(cfnSpecification,
    outPath.resolve("CloudFormationResourceSpecification.json"), StandardCopyOption.REPLACE_EXISTING)
  val yarn = Process(enableForWindows(Seq("yarn", "compile")), file("./vscode-extension"))
  yarn
}

def enableForWindows(parts: Seq[String]): Seq[String] = {
  val os = sys.props("os.name").toLowerCase
  os match {
    case x if x contains "windows" => Seq("cmd", "/C") ++ parts
    case _ => parts
  }
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
      val extensionPath = Paths.get(".", "vscode-extension")
      val outPath = extensionPath.resolve("out")
      Files.copy(Paths.get(assemblyFile),
        outPath.resolve("CloudFormationLanguageServer.jar"), StandardCopyOption.REPLACE_EXISTING)
    },

    fullvscode := {
      vscodeCommonTask(assembly.value.getAbsolutePath).run
    }
  ).
  jsSettings(
    scalaJSUseMainModuleInitializer := true,
    scalaJSLinkerConfig ~= { _.withModuleKind(ModuleKind.ESModule) },

    fastvscode := {
      val assemblyFile: String = (fastOptJS in Compile).value.data.getAbsolutePath
      vscodeCommonTask(assemblyFile).run
    },

    vscodeprepublish := {
      val extensionPath = Paths.get(".", "vscode-extension")
      val outPath = extensionPath.resolve("out")
      val assemblyFile: String = (fullOptJS in Compile).value.data.getAbsolutePath
      Files.copy(Paths.get(assemblyFile),
        outPath.resolve("CloudFormationLanguageServer.js"), StandardCopyOption.REPLACE_EXISTING)
      val resourceSpecificationFile = Paths.get(".", "CloudFormationResourceSpecification.json")
      Files.copy(resourceSpecificationFile,
        outPath.resolve(resourceSpecificationFile.getFileName), StandardCopyOption.REPLACE_EXISTING)
    },

    fullvscode := {
      val assemblyFile: String = (fullOptJS in Compile).value.data.getAbsolutePath
      vscodeCommonTask(assemblyFile).run
    }).
  settings(
    name := "languageServer",

    mainClass in Compile := Some("cloudformation.Program"),
    // https://mvnrepository.com/artifact/com.typesafe.play/play-json
    libraryDependencies += "com.lihaoyi" %%% "upickle" % "1.1.0",

    // https://mvnrepository.com/artifact/com.github.keyboardDrummer/modularlanguages
    libraryDependencies += "com.github.keyboardDrummer" %%% "modularlanguages" % "0.1.8"
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
    scalaJSLinkerConfig ~= { _.withModuleKind(ModuleKind.ESModule) },

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
    // https://mvnrepository.com/artifact/com.typesafe.play/play-json
    libraryDependencies += "com.lihaoyi" %%% "upickle" % "1.1.0",
  ).dependsOn(languageServer.js)

lazy val fastbrowser = taskKey[Unit]("Run Browser Example Fast")
lazy val fullbrowser = taskKey[Unit]("Run Browser Example Optimized")
