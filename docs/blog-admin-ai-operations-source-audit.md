# Blog Admin AI Operations Source Audit

> Source of truth: `rushairer/gouno-blog` current `main` at `e413766d040400830ae73882bb42794b71d4df37`.
>
> Purpose: derive the Showcase AI Operations product model from the real Blog Admin data model, API surface, security boundary and interaction semantics before changing canonical Showcase composition.

## 1. Product boundary

`/admin/ai-ops` is an operational workspace, not the configuration surface for Providers, Skills, Agents, knowledge indexes or Connectors. Stable capability configuration stays in `/admin/ai-settings`.

The real page already exposes four durable operational modes:

- Overview
- Inbox
- Automation
- Run Center

The redesign keeps this IA and changes the product grammar inside each mode.

## 2. Real data loaded by AI Operations

The current Blog Admin page loads these objects together:

- Agents
- Agent Runs
- Agent Approvals
- Tool catalog
- Workflows
- Workflow Runs
- Workflow Metrics
- Operational Suggestions
- Content Candidate Sets
- Media Candidates
- Editorial Tasks

Inbox additionally loads pending Workflow Interaction Tasks.

This means AI Operations is not a single Workflow screen. It is the operational shell around discovery, human decision, automation execution and evidence inspection.

## 3. Real workflow capability

### Workflow definition

A Workflow contains:

- identity and description
- enabled state
- cron expression, timezone and next run
- current version / version id
- input schema
- ordered steps
- scope policy (`strict` / `unscoped`)
- discovery tools
- resource-query preview / last result
- empty-query policy

Supported step types are:

- `resource_query`
- `model`
- `for_each`
- `approval_gate`
- `human_interaction`
- `output`

### Workflow operations

The real API supports:

- create / update / delete
- enable / disable
- versions / rollback
- preflight
- formal run
- dry-run
- AI-assisted Workflow drafting
- AI-assisted Agent/Skill drafting

Run and dry-run create persisted queued Runs; actual execution is asynchronous in the background Worker. The UI must therefore model `run requested -> queued/running -> terminal/waiting state`, not pretend the click itself synchronously completes the work.

## 4. Real Run evidence model

Workflow Run has:

- workflow + workflow version
- formal vs dry-run mode
- queued/running/waiting/approval/succeeded/failed/cancelled states
- input / output
- error code / error message
- input/output token counts
- trigger source / schedule key
- start / finish timestamps

A Run can be inspected through separately persisted evidence:

- Step Runs
- Resource snapshots
- Human Interaction Tasks
- Media Candidates
- Events

Run actions include:

- cancel active/waiting Run
- delete terminal Run record
- retry failed step / failed iterations
- resolve or cancel a human interaction

Therefore the canonical Run detail must be an Evidence Inspector, with execution chronology first and raw logs secondary.

## 5. Real resource and safety semantics

A Workflow Resource records:

- resource type / key / label
- source: manual / query / discovery
- access level: target / read-only
- version token
- snapshot

The distinction between target and read-only is product-significant. The UI must not flatten all resources into generic chips.

AI Operations is protected by:

- Blog `ManageAI` permission
- AAL2
- recent MFA on unsafe methods
- sensitive-change auditing

Showcase does not implement authentication, but destructive and state-changing operations should retain clear hierarchy and confirmation semantics so the composition remains compatible with Step-Up/AAL2 in the real product.

## 6. Human decision model

The real system contains several human-decision object classes.

### Workflow Interaction Task

Types:

- approval
- choice
- input
- preview_confirm

Data includes:

- source Workflow Run / Agent Run
- step id
- schema / payload / options
- pending/resolved/cancelled/expired state
- resume token
- response
- expiration / resolution timestamps

Resolving an interaction resumes the source Run.

### Agent Approval

Approval contains:

- source Agent Run / Tool Call
- action type
- target type / id
- proposed payload
- before snapshot
- pending/approved/rejected/expired/executed/failed state
- review note / expiration

Approving certain image-related proposals routes the operator back to the owning Workflow Run where generation, selection, preview and application continue.

### Operational Suggestion

Suggestion contains:

- source type/key/run
- title + description
- priority
- evidence
- time window
- status

Actions:

- ignore/defer with reason
- convert into Editorial Task

### Content Candidate Set

Contains:

- target post
- source Run / Approval
- field type: title / summary / cover alt
- current value
- candidate values + rationales
- pending/selected/expired state

Choosing a candidate creates a later explicit change approval. It does not immediately mutate content.

### Media Candidate

Contains:

- target post
- headline / brief / alt
- generation lifecycle
- safety + copyright state
- Workflow Run ownership
- cover/inline placement + anchor
- generated media asset
- selection/application state
- generation error / attempts / timing / regeneration instruction

The real Run Center also supports:

- generate
- select
- article preview
- apply
- regenerate
- reject
- cancel generation
- batch select / preview / apply / reject

Preview returns `version_matches` and `anchor_matches`; application is gated by those checks.

### Editorial Task

Editorial Task is follow-up work created from suggestions or approved operations. Marking it done/cancelled changes task status only; it is not itself a content write.

## 7. Agent Run model

Agent Run contains:

- Agent identity
- trigger type
- status
- output summary
- provider + model
- input/output tokens
- error code/message
- citations
- parent Workflow Run when applicable

Tool Calls contain:

- tool name
- risk level: read / propose / write
- arguments
- result
- requested/executed/rejected/failed state
- error message

Current Blog Admin has typed renderers for meaningful Tool outputs such as content audit, internal-link suggestions, related content and stale/orphan content. Showcase should therefore avoid reducing Agent Run detail to a generic JSON/log card.

## 8. Product design decisions derived from the source

### Overview

Question: **What needs operational attention now?**

Use:

- a compact health strip derived from Runs + pending human decisions
- attention feed for failed/waiting Runs and high-priority suggestions
- automation health / next runs

Avoid generic marketing lead cards and statistic-card walls.

### Inbox

Question: **What requires my decision now?**

Unify Workflow Interactions, Approvals, Suggestions, Candidate Sets, legacy Media review tasks and Editorial follow-up into one Decision Queue grammar.

A row must answer:

1. What is it?
2. What is the primary state?
3. Where did it come from?
4. What object will be affected?
5. Why is a human needed?

The right Workbench then answers:

1. Why this needs me
2. What AI proposes / what choice is required
3. What happens next
4. What will not happen
5. What evidence or failure exists
6. The explicit action

### Automation

Question: **Which durable Workflow should I inspect, change or execute?**

Treat Workflow as a versioned automation asset. Separate:

- identity / status
- operating summary
- ordered definition
- input contract
- execution boundary
- manual execution controls
- recent Runs
- version history

Running is a queued asynchronous command. Preflight and result feedback should make this visible.

### Run Center

Question: **What exactly happened in this execution?**

Use a stable master/detail layout:

- Run list with one primary status + reason summary
- Run header / outcome
- summary strip
- failure/waiting evidence
- execution timeline
- resources / human interactions / outputs / media / tool calls
- persisted events and raw data as secondary evidence

### AI Settings

No redesign implementation in this pass unless a cross-route consistency issue blocks AI Operations. Settings remains a separate product surface.

## 9. Canonical row anatomy

Every primary queue/list row uses the same information order:

1. **Title + primary status**
2. **Source / parent / target / time**
3. **Outcome, waiting reason, failure reason or decision reason**
4. **At most two secondary signals** such as Dry-run, version, duration, steps or priority

Status is never allowed to float to a different vertical position because a row happens to have more text.

## 10. Showcase implementation scope

Implement only in `rushairer/gouno-ui`:

- source-grounded Fixtures
- Overview
- Inbox Decision Workbench
- Automation Workflow list/detail/execution
- Run Center Workflow/Agent evidence inspector
- loading/error/empty/failed/waiting states
- responsive behavior
- contract + Playwright visual evidence

Do **not** reverse migrate into `gouno-blog` during this pass. Stop after Showcase is published and let the product owner test it before consumer migration begins.
