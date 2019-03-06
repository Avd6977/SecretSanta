using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Microsoft.AspNetCore.Mvc;
using SecretSanta.Entities;
using SecretSanta.Services;

namespace SecretSanta.Controllers
{
    [Route("api/secretsanta")]
    public class SecretSantaController : Controller
    {
        private readonly IDictionary<Person, Person> banned;
        private readonly SecretSantaService service = new SecretSantaService();
        private List<Person> participants;

        public SecretSantaController()
        {
            participants = new List<Person>();
            banned = new Dictionary<Person, Person>();
        }

        [HttpGet("results")]
        public IActionResult GetResults() => Ok(service.Generate(participants, banned));

        [HttpPost("import")]
        public IActionResult ImportParticipants(IEnumerable<Person> imported, bool replace)
        {
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

            return Ok(participants);
        }

        [HttpPut("add")]
        public IActionResult AddParticipant(Person person)
        {
            if (participants.Any(p =>
                string.Equals(person.FirstName, p.FirstName, StringComparison.InvariantCultureIgnoreCase)
                && string.Equals(person.LastName, p.LastName, StringComparison.InvariantCultureIgnoreCase)))
            {
                return BadRequest(new {error = "Person has already been added."});
            }

            participants.Add(person);
            return Ok(participants);
        }

        [HttpDelete("remove")]
        public IActionResult RemoveUser(Person removed)
        {
            participants.Remove(removed);
            return NoContent();
        }
    }
}
