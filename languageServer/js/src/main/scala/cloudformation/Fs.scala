package cloudformation

import scala.scalajs.js
import scala.scalajs.js.annotation.JSImport

@js.native
@JSImport("fs", JSImport.Namespace)
object Fs extends js.Object {
  def readFileSync(path: String, encoding: String): String = js.native
}
