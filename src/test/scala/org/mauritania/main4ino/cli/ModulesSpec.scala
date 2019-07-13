package org.mauritania.main4ino.cli

import java.nio.file.{Files, Paths}

import cats.effect.IO
import org.mauritania.main4ino.DecodersIO
import org.mauritania.main4ino.cli.Actions.{AddRawUser, AddRawUsers}
import org.mauritania.main4ino.cli.Modules.{ConfigsAppErr, FilesystemSync}
import org.scalatest.{Matchers, WordSpec}
import org.mauritania.main4ino.security.Fixtures._
import org.mauritania.main4ino.security.{Auther, User}

class ModulesSpec extends WordSpec with Matchers with DecodersIO {

  "A config handler" should {

    "add a user" in {
      val c = new ConfigsAppErr[IO]()
      val baseConfig = DefaultSecurityConfig
      val newUser = AddRawUsers(List(AddRawUser("pepe", "toto", "pepe@zzz.com", List("/"))))
      val newConf = c.performAction(baseConfig, newUser)

      val ExpectedNewUserEntry = User(
        name = "pepe",
        hashedpass = Auther.hashPassword("toto", Salt),
        email = "pepe@zzz.com",
        granted = List("/")
      )

      newConf shouldBe baseConfig.copy(users = ExpectedNewUserEntry :: baseConfig.users)

    }

  }

  "A filesystem handler" should {

    "read a file" in {
      val fs = new FilesystemSync[IO]()
      val p = Paths.get("src", "test", "resources", "atextfile.txt")
      val content = fs.readFile(p)
      content.unsafeRunSync() shouldBe "file content"
    }

    "write a file" in {
      val fs = new FilesystemSync[IO]()
      val output = Files.createTempFile("write", "tmp")
      val content = "0123"
      fs.writeFile(output, content)
      output.toFile.length() shouldBe content.length
      output.toFile.deleteOnExit()
    }

  }
}
