using System;
using System.Collections.Generic;
using System.Linq;
using SecretSanta.Util;

namespace SecretSanta.Services
{
    public class SecretSantaService
    {
        public IDictionary<T, T> Generate<T>(IList<T> participants, IDictionary<T, T> bannedPairings)
        {
            var to = participants.GetShuffle();

            foreach (var from in participants.GetShuffle().GetPermutations())
            {
                var result = to.ZipToKV(from);

                if (PairingIsValid(bannedPairings, result))
                    return result.ToDictionary();
            }

            throw new ApplicationException("No valid secret santa list can be generated");
        }

        private bool PairingIsValid<T>(IDictionary<T, T> bannedPairings, IEnumerable<KeyValuePair<T, T>> result)
        {
            return result.All(r => !r.Key.Equals(r.Value) && !bannedPairings.Contains(r));
        }
    }
}
