# SANTA GONE WRONG → KAGUYA REWORK - ART NEEDED
Sidescroller, Mount Fuji backdrop. Player completes 5 trials for 5 princes
to win the Princess's hand; final act reveals the princes cheated, and
the boss gauntlet is fighting all 5.

Existing assets get reassigned as noted below — nothing here breaks what
already runs, just relabels/re-skins.

---

## NOTE
Volcano and Yeti stay as-is — they're common enemies throughout the level,
not tied to a specific prince. All 5 princes get their own new boss sprite.

**KrampusBoss → Minister Ōtomo's trial (Dragon's Jewel)**
Charge-dash + ground-slam moveset already fits a "chasing the dragon"
boss. Reskin pass only — this one's covered.

---

## 1. PRINCE ISHITSUKURI - new boss (Buddha's Stone Bowl)
File:        public/sprites/ishitsukurisprite.png (new)
Frame size:  64x64
Frames (24, same layout convention as Krampus/Yeti):
    0-5     idle
    6-8     jump
    9-11    fall
    12-17   run
    18-20   attack wind-up (presenting the fake bowl, then swings it)
    21-23   attack release/recover

## 2. PRINCE KURAMOCHI - new boss (Jeweled Branch of Mount Hōrai)
File:        public/sprites/kuramochisprite.png (new)
Frame size:  64x64
Frames (24):
    0-5     idle
    6-8     jump
    9-11    fall
    12-17   run
    18-20   attack wind-up (brandishing the fake jeweled branch)
    21-23   attack release/recover

## 3. MINISTER ABE - new boss (Robe of the Fire Rat)
File:        public/sprites/abesprite.png (new)
Frame size:  64x64
Frames (24):
    0-5     idle
    6-8     jump
    9-11    fall
    12-17   run
    18-20   attack wind-up (robe catching fire, panicking swing)
    21-23   attack release/recover

## 4. LORD ISONOKAMI - new boss (Swallow's Cowrie Shell)
File:        public/sprites/isonokamisprite.png (new)
Frame size:  64x64
Frames (24):
    0-5     idle
    6-8     jump
    9-11    fall
    12-17   run
    18-20   climb/reach attack (swiping up, evokes the swallow's-nest fall)
    21-23   recover/stagger (thematically he gets hurt in the myth - could
             double as a "flinch" animation used after a hit)

## 5. FINAL BOSS PHASE - "The Five Princes" gauntlet screen
Not a new sprite sheet, just needs: a shared arena background layer and
possibly small palette-swapped "defeated" poses for each of the 5 once
they're knocked out sequentially, so they can visibly stack up/sit out
on screen as the fight progresses.

---

## 6. PRINCESS KAGUYA - new character (non-enemy)
File:        public/sprites/princesssprite.png (new)
Frame size:  64x64 (match existing convention)
Frames needed (lighter set than bosses, she's not a fighter):
    0-3     idle (standing, ambient sway)
    4-7     talk/dialog (used in cutscene or task-giving screens)
    8-11    reveal/reaction (the moment she exposes the princes' trickery)
    12-15   celebration/victory (end of Level 2)
Also needed: one still portrait/bust image for dialog boxes if the game
uses portrait UI (check existing dialog system before building this).

---

## 7. BACKGROUND - Mount Fuji backdrop
File:        public/backgrounds/fujibackdrop.png (new)
Suggest a parallax set (far/mid/near layers) rather than one flat image:
    - far:  Fuji silhouette + sky
    - mid:  tree line / cloud layer
    - near: foreground foliage or rock consistent with existing tile set

---

## SUGGESTED ORDER
1. Krampus reskin (Ōtomo) - covered already, quick win
2. Ishitsukuri (early trial, sets tone)
3. Kuramochi
4. Abe
5. Isonokami (final trial before the reveal)
6. Princess Kaguya (needed for both levels' framing scenes)
7. Fuji parallax background
8. Final boss gauntlet arena/defeated-pose polish
