package org.mauritania.main4ino.security

import java.io.File

import cats.effect.IO
import com.typesafe.config.ConfigException
import org.scalatest._

class ConfigSpec extends FlatSpec with Matchers {

  val User1 = Fixtures.User1

  "The security config" should "load correctly a configuration file" in {
    val c = Config.load[IO](new File("src/test/resources/configs/2/security-users-single.conf")).unsafeRunSync()
    c.users shouldBe List(User1)
  }

  it should "throw an exception if the config is invalid" in {
    a [IllegalArgumentException] should be thrownBy {
      Config.load[IO](new File("src/test/resources/configs/2/security-users-invalid.conf")).unsafeRunSync()
    }
  }

  it should "throw an exception if the config is malformed" in {
    a [ConfigException.Parse] should be thrownBy {
      Config.load[IO](new File("src/test/resources/configs/2/security-users-broken.conf")).unsafeRunSync()
    }
  }

}
