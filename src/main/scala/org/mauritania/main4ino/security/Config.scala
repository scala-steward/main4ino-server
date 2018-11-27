package org.mauritania.main4ino.security

import cats.effect.IO
import org.mauritania.main4ino.config.Loadable
import org.reactormonk.{CryptoBits, PrivateKey}
import java.time.Clock

import org.mauritania.main4ino.security.Authentication.{EncryptionConfig, UserHashedPass, UserId}

import scala.io.Codec


case class Config(
  users: List[User],
  privateKey: String,
  salt: String
) {

  import Config._

  val usersBy = UsersBy(users)
  val privateKeyBits = CryptoBits(PrivateKey(Codec.toUTF8(privateKey)))
  val nonceStartupTime = Clock.systemUTC()
  val encryptionConfig = EncryptionConfig(privateKeyBits, salt)
}

object Config extends Loadable[Config] {

  def load(configFile: String): IO[Config] = load(configFile, identity)

  case class UsersBy(
    byId: Map[UserId, User],
    byIdPass: Map[(UserId, UserHashedPass), User]
  )

  object UsersBy {
    def apply(u: List[User]): UsersBy = {
      UsersBy(
        byId = u.groupBy(_.name).map { case (t, us) => (t, us.last) },
        byIdPass = u.groupBy(i => (i.name, i.hashedPass)).map { case (t, us) => (t, us.last) }
      )
    }
  }

}

