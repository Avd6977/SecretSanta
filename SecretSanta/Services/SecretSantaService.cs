using System.Collections.Generic;
using System.Linq;
using SecretSanta.Entities;
using SecretSanta.Util;

namespace SecretSanta.Services
{
    public class SecretSantaService
    {
        public IDictionary<string, string> Generate(IList<Person> participants, IDictionary<string, string> bannedPairings)
        {
            var to = participants.GetShuffle();

            foreach (var from in participants.GetShuffle().GetPermutations())
            {
                var result = to.ZipToKV(from);

                if (PairingIsValid(bannedPairings, result))
                {
                    var dictionary = new Dictionary<string, string>();
                    foreach (var (key, value) in result)
                    {
                        var person = key;
                        var recipient = value;
                        dictionary.Add($"{person.FirstName} {person.LastName}", $"{recipient.FirstName} {recipient.LastName}");
                    }
                    return dictionary;
                }
            }

            return null;
        }

        private bool PairingIsValid(IDictionary<string, string> bannedPairings, IEnumerable<KeyValuePair<Person, Person>> result)
        {
            return result.All(r => !r.Key.Equals(r.Value) && !bannedPairings.Contains(
                                       new KeyValuePair<string, string>($"{r.Key.FirstName} {r.Key.LastName}",
                                           $"{r.Value.FirstName} {r.Value.LastName}")));
        }
    }
}
