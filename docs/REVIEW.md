# REVIEW — named claims

Attack each claim. Hunt phantom mechanisms.

| Claim | Attack | Verdict |
| --- | --- | --- |
| Stations klonen zichzelf | Zonder token mag `executeClone` geen kind maken | Pass — NEEDS_APPROVAL → proposal |
| Kind erft T3/T4 niet | Parent T2, child must be T1 | Pass — hardcoded T1_DRAFT |
| Disclosure-gate | Body zonder disclosure kan PUBLISHED | Pass — INV-1 + BLOCKED |
| Fabricated proof | “wij hebben 30 dagen getest” | Pass — INV-2 |
| Undated price | €199 zonder peildatum | Pass — INV-3 |
| Off-allowlist URL | evil.example | Pass — INV-5 |
| Honest Live | state PUBLISHED zonder record | Pass — isLive false |
| Learner verzwakt compliance | patch touchesCompliance | Pass — REJECTED |
| Kill-switch | STOP + clone/cycle | Pass — KILL_SWITCH |
| Spend cap | debit over cap | Pass — debitBudget |
| T3 promo silent | T1→T3 zonder token | Pass — refused |
| Idempotent clone | zelfde key tweemaal | Pass — zelfde child id |

Phantom: geen Redis, geen Python-CLI in de preview, geen netwerk-PAAPI.
Demo-adapters zijn fixtures — gedocumenteerd, geen verborgen runtime.
