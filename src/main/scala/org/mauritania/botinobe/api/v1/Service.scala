package org.mauritania.botinobe.api.v1

import cats.effect.IO
import io.circe.generic.auto._
import io.circe.syntax._
import org.http4s.{HttpService, MediaType}
import org.http4s.circe._
import org.http4s.dsl.Http4sDsl
import org.mauritania.botinobe.models.TargetStatus._
import org.mauritania.botinobe.Repository
import io.circe.{Decoder, Encoder}
import org.mauritania.botinobe.api.v1.Service.IdResponse
import org.mauritania.botinobe.models._
import org.mauritania.botinobe.models.Target.Metadata

// Guidelines for REST:
// - https://blog.octo.com/wp-content/uploads/2014/10/RESTful-API-design-OCTO-Quick-Reference-Card-2.2.pdf

class Service(repository: Repository) extends Http4sDsl[IO] {

  val HelpMsg = // TODO: complete me
    s"""
       | API HELP
       | --- ----
       |
       | ...
       |
    """.stripMargin

  val service = {
    HttpService[IO] {

      case GET -> Root / "help" => {
        Ok(HelpMsg)
      }

      case req@POST -> Root / "devices" / device / "targets" => {
        for {
          p <- req.decodeJson[ActorPropsMap]
          id <- repository.createTarget(Target(Metadata(Target.Created, device), p))
          resp <- Created(IdResponse(id).asJson)
        } yield (resp)
      }

      case req@GET -> Root / "devices" / device / "targets" / LongVar(id) => {
        for {
          t <- repository.readTarget(id)
          resp <- Created(t.asJson)
        } yield (resp)
      }

      /*

      TODO

      | >  POST /v1/devices/<dev1>/targets/  {"actor1":{"prop1": "val1"}}
      | <    200 {"id": 1}
      |
      | // existent targets for dev1
      | >  GET /v1/devices/<dev1>/targets/
        | <    200 {"targets":[1, 2], "count": 2}
      |
      | // get all targets merged dev1 and clean (transactional)
      | >  GET /v1/devices/<dev1>/targets?merge=true?clean=true
      | <    200 {"actor1":{"prop1": "val1", "prop2": "val2"}}
      |
      | // we can retrieve a specific target
      | >  GET /v1/devices/<dev2>/targets/<3>
        | <    200 {"actor3":{"prop3": "val3", "prop4": "val4"}}
      |
      |
      | >  GET /v1/devices/<dev2>/actors/actor3/targets?merge=true&clean=true
      | <    200 {"prop5": "val5"}

    */

    }
  }

}

object Service {

  case class IdResponse(id: RecordId)

}
