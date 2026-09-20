---
name: motion-core-curator
description: Maintains the FinanzNeo Motion Core across reels by detecting duplicated local primitives, promoting genuinely reusable objects, keeping mechanic semantics clean and preventing src/motion from becoming either fragmented or bloated.
---

# FinanzNeo Motion Core Curator

## Goal

Keep `src/motion` small, semantic and reusable as more Reels are produced.

This skill does **not** design the current scene. It reviews repeated implementation patterns across the repository and decides what belongs in the canonical Motion Core.

## Authority

Read in this order:

1. `CLAUDE.md`
2. `src/motion/README.md`
3. `src/motion/index.ts`
4. `src/motion/mechanics.ts`
5. `src/motion/physical.tsx` / `objects.tsx`
6. `.agents/plugins/finanzneo-motion/rules/mechanic-selection.md`
7. actual local scene primitives/usages being reviewed

Historical reels must not be rewritten merely to make the Core look cleaner.

## Primitive promotion rule

A local scene object is not automatically Core-worthy.

Use this decision:

```text
one-off scene need
→ keep local

same semantic object genuinely reused across at least two different scenes/reels
→ Core candidate

candidate has stable meaning + reusable props + same material language
→ promote to src/motion
```

Do not promote a component merely because its JSX is long.

## Promotion checklist

Before moving a local object into `src/motion`, verify:

- the object has one clear semantic identity;
- at least two real usages need substantially the same object;
- props describe semantic state rather than one reel's wording;
- material roles use Motion Core semantics;
- timing is controlled by the parent scene, not hidden inside the primitive;
- there is no existing Core primitive with the same role;
- naming is unambiguous in finance context;
- the primitive does not encode one specific mechanic choreography.

## Naming rules

Prefer names that cannot be confused by an agent.

Good:

- `PhysicalBanknote`
- `PhysicalInvoice`
- `PhysicalAccount`
- `PhysicalReserveTank`

Avoid overloaded English finance words when they can mean different physical things. `PhysicalBill` remains compatibility-only because "bill" can mean banknote or invoice.

## Mechanic curation

`src/motion/mechanics.ts` is the canonical machine-readable registry for V1 mechanic families.

Before adding a new family:

1. confirm the new scene expresses a genuinely new cause/effect;
2. verify an existing family cannot represent it semantically;
3. define a stable `fn-*` id;
4. describe intent, motion pattern and result type;
5. keep implementation layout out of the mechanic definition;
6. update reference/documentation only when the new family has proven useful.

Do not create a mechanic family merely because a scene uses a new object.

## Duplication audit

When curating, search for:

- local components with near-identical semantic names;
- copied `PhysicalObject` styling;
- repeated material gradients/shadows;
- repeated camera helper math;
- duplicate account/bill/invoice/container implementations;
- scene-local timing helpers that should use `FN_MOTION`;
- old imports from `src/brand/components/PremiumPhysical.tsx` in new Motion-Core work.

## Core size discipline

The Core should not become a catalogue of every prop seen in every Reel.

Reject promotion when:

- the object only makes sense for one story;
- most props are labels copied from one reel;
- the object contains scene choreography;
- the difference from an existing primitive is only color or size;
- adding it would create two nearly identical primitives.

## Deprecation and compatibility

Never break historical sealed Reels just to clean names.

When a name is ambiguous or superseded:

1. add the clearer canonical name;
2. keep the old export as compatibility alias where feasible;
3. document the preferred new name;
4. make new-agent rules prefer the canonical name;
5. remove legacy only in a separately approved migration.

## Output of a curation pass

Return a short table:

```text
CANDIDATE | ACTION | REASON
```

Actions:

- KEEP_LOCAL
- PROMOTE
- MERGE_WITH_EXISTING
- DEPRECATE_ALIAS
- NO_CHANGE

Only implement promotions that have concrete evidence from repository usage.
