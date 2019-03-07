using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SecretSanta.Entities;
using SecretSanta.Services;

namespace SecretSanta.Controllers
{
    [Route("api/secretsanta")]
    public class SecretSantaController : Controller
    {
        private readonly SecretSantaService service = new SecretSantaService();

        [HttpGet("results")]
        public IActionResult GetResults()
        {
            // Retry for odd pairings
            var results = service.Generate(GetParticipantsFromSession(), GetBannedFromSession()) ??
                          service.Generate(GetParticipantsFromSession(), GetBannedFromSession());
            return Json(results);
        }

        [HttpGet("participants")]
        public IActionResult GetParticipants() => Ok(GetParticipantsFromSession());

        [HttpGet("banned")]
        public IActionResult GetBanned() => Json(GetBannedFromSession());

        [HttpPost("import")]
        public IActionResult ImportParticipants([FromBody] IEnumerable<Person> imported, bool replace = true)
        {
            var participants = GetParticipantsFromSession();
            if (replace)
            {
                participants = imported.ToList();
            }
            else
            {
                var filtered = imported.Where(x => !participants.Any(p =>
                    string.Equals(x.FirstName, p.FirstName, StringComparison.InvariantCultureIgnoreCase)
                    && string.Equals(x.LastName, p.LastName, StringComparison.InvariantCultureIgnoreCase)));

                participants.AddRange(filtered);
            }

            HttpContext.Session.SetString("participants", JsonConvert.SerializeObject(participants));
            return Ok(participants);
        }

        [HttpPost("banned")]
        public IActionResult SetBannedPairs([FromBody] IDictionary<string, string> banned)
        {
            HttpContext.Session.SetString("banned", JsonConvert.SerializeObject(banned));
            return Ok(banned);
        }

        [HttpPut("add")]
        public IActionResult AddParticipant([FromBody] Person person)
        {
            if (string.IsNullOrWhiteSpace(person.FirstName) || string.IsNullOrWhiteSpace(person.LastName))
            {
                return BadRequest(new { error = "First and Last Name are both required." });
            }

            var participants = GetParticipantsFromSession();
            if (participants.Any(p =>
                string.Equals(person.FirstName, p.FirstName, StringComparison.InvariantCultureIgnoreCase)
                && string.Equals(person.LastName, p.LastName, StringComparison.InvariantCultureIgnoreCase)))
            {
                return BadRequest(new {error = "Person has already been added."});
            }

            participants.Add(person);
            HttpContext.Session.SetString("participants", JsonConvert.SerializeObject(participants));
            return Ok(participants);
        }

        [HttpDelete("remove/{id}")]
        public IActionResult RemoveUser(int id)
        {
            var participants = GetParticipantsFromSession();
            participants.RemoveAt(id);
            HttpContext.Session.SetString("participants", JsonConvert.SerializeObject(participants));
            return NoContent();
        }

        private List<Person> GetParticipantsFromSession()
        {
            var particpantsJson = HttpContext.Session.GetString("participants");
            return !string.IsNullOrWhiteSpace(particpantsJson)
                ? JsonConvert.DeserializeObject<List<Person>>(particpantsJson)
                : new List<Person>();
        }

        private IDictionary<string, string> GetBannedFromSession()
        {
            var bannedJson = HttpContext.Session.GetString("banned");

            return !string.IsNullOrWhiteSpace(bannedJson)
                ? JsonConvert.DeserializeObject<IDictionary<string, string>>(bannedJson)
                : new Dictionary<string, string>();
        }
    }
}
