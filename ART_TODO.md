# KAGUYA REWORK - ART TODO (current state)
Sidescroller, Mount Fuji backdrop, story across Level 1 + Level 2 →
transition into Level 3 (chasing NegaKasey).

---

## ALREADY HAVE
- NegaKasey (main villain)
- Player character
- Demon (common enemy)
- Volcano (common enemy)
- Mount Fuji background
- Kaguya (NPC princess)

Everything below is what's still missing.

---

## 1. THE FIVE PRINCE BOSSES
Each needs a full new sprite sheet, 64x64 frames, 24 total, same layout
convention as your other bosses:
    0-5     idle
    6-8     jump
    9-11    fall
    12-17   run
    18-20   attack wind-up
    21-23   attack release/recover

- **Prince Ishitsukuri** — public/sprites/ishitsukurisprite.png
    18-20   wind-up: raises the fake stone bowl overhead two-handed,
            unsteady stance (he's a poser, not a fighter — should read
            as showy rather than skilled)
    21-23   release: brings the bowl down in an overhead smash, then
            stumbles slightly on the follow-through/recovery

- **Prince Kuramochi** — public/sprites/kuramochisprite.png
    18-20   wind-up: plants feet, holds the jeweled branch out
            horizontally like a spear, branch trembling
    21-23   release: lunging thrust forward with the branch, jewels
            scattering off it slightly on impact (cosmetic — cheap
            fakes, they chip)

- **Minister Abe** — public/sprites/abesprite.png
    18-20   wind-up: robe flares as he spins it like a cape/whip,
            fire licking along the hem (panicked energy, not controlled)
    21-23   release: robe-whip crack forward, followed by a stagger/
            beat-out-the-flames recovery — he's always half-fighting
            his own costume

- **Minister Ōtomo** — public/sprites/otomosprite.png
    18-20   wind-up: low charging crouch, one arm raised presenting the
            dragon's jewel like a trophy (arrogant, confident telegraph —
            biggest wind-up of the five, matches his boastful dialogue)
    21-23   release: full-body dash/ground-slam using the jewel as an
            improvised weapon (this is the one keeping the old
            charge-dash + slam moveset)

- **Lord Isonokami** — public/sprites/isonokamisprite.png
    18-20   wind-up: reaching/climbing motion, shell held up defensively
            more than offensively (he's the least confident fighter —
            wind-up should read hesitant)
    21-23   release: an awkward overhead swipe with the shell, followed
            by an exaggerated stumble/limp recovery (callback to him
            getting hurt in the myth — recovery frame can double as his
            flinch/hit-reaction if you want to save a frame)



## 2. THE FIVE RELIC ITEMS
Each is a small static icon/prop — no animation needed unless you want a
subtle idle shimmer. These are what the player actually finds and hands
off during the trials, and what the princes falsely claim as their own.
    - Buddha's stone bowl (Ishitsukuri's trial)
    - Jeweled branch of Mount Hōrai (Kuramochi's trial)
    - Robe of the fire rat (Abe's trial) — consider a "smolder" variant
      for the moment it's tested near flame in the reveal scene
    - Dragon's jewel (Ōtomo's trial)
    - Swallow's cowrie shell (Isonokami's trial)
Suggested file: public/sprites/relic_items.png as one small sheet
(5 icons, consistent size, e.g. 32x32 each).

## 3. MOONLIGHT TRANSPORT EFFECT
Used at the end of Level 2 when Kaguya moves the player to Level 3.
Needs:
    - a particle/glow sheet (soft light motes, moon-pale color palette)
    - a "fold away" or "dissolve" transition treatment for the courtyard
      background (could be a simple radial wipe/fade if a full custom
      animation is too costly)
    - optional: a brief beam-of-moonlight overlay effect for when Kaguya
      raises her hand
File suggestion: public/effects/moonlight_transport.png (sprite sheet)
or handled as a shader/tween if no dedicated art wants to be made for it
— flagging both options since this could go either way depending on
budget.

## 4. NEGAKASEY THEFT MOMENT (cosmetic, optional)
A quick "shadow snatch" effect for when NegaKasey yanks the items from
Kaguya's hands — could reuse an existing dash/blur effect if you have
one, otherwise a simple dark particle burst would sell the moment
without needing new dedicated art.

## Finished. PRINCESS KAGUYA - new character (non-enemy) 
File:        public/sprites/princesssprite.png
Frame size:  128x128
Frames:
   - 0-4     idle (standing, ambient sway)
   - 10-18   walking (courtyard reveal scene)
   - 20-28   talking/nodding (calling out the princes' lie)
   - 30-39   moonlight cast (raising a hand to open the transport effect)
   - 5-9, 19,29 all empty frames
Also useful: one still portrait/bust image if dialog boxes use portraits.
---

## SUGGESTED ORDER
1. Princess Kaguya (needed for both levels' framing scenes, most reused)
2. The five relic items (small, quick wins, needed throughout both levels)
3. The five prince bosses (biggest lift — can be done in any order,
   Ōtomo probably first since he opens the gauntlet)
4. Moonlight transport effect
5. NegaKasey theft moment (lowest priority, easiest to fake with an
   existing effect in the meantime)
