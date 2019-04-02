export default `
/**
 * static section
 */
.status {
  display: grid;
  grid-template:
  "a b b b b b d" auto
  "a c c c c c d" auto
  "a e e e e e ." auto
  "a f f f f f ." minmax(3em, auto)
  "a g g g g g ." auto
  "k k . h i j ." auto / minmax(3em, 15%) 1fr 1fr 1fr 1fr 1fr minmax(3em, 8%);
  gap: 0.5em;
  max-width: 48em;
}

.status>.status__content { grid-area: f; }
.status>.status__media-attachments { grid-area: g; }
.status>.status__replies-count { grid-area: h; }
.status>.status__reblogs-count { grid-area: i; }
.status>.status__favourites-count { grid-area: j; }
.status>.status__created-at { grid-area: d; align-self: center; }
.status>.status__show-sensitive-toggle { grid-area: k; }
.status>.status__account-avatar { grid-area: a;}
.status>.status__account-display-name { grid-area: b; }
.status>.status__account-acct { grid-area: c; }
.status--show-sensitive>.status__spoiler-text { grid-area: e; }
.status--hide-sensitive>.status__spoiler-text { grid-area: e-start / e-start / g-end / g-end; }

.status--show-sensitive>.status__spoiler-text { display: block; }

.status--hide-sensitive>.status__spoiler-text {
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.status--hide-sensitive>.status__contents { visibility: hidden; }

.status--no-sensitive>.status__sensitives { display: none; }

.status__metadata { white-space: nowrap; }


/**
 * optional section
 */
.status {
  padding: 1em;
}

.status__spoiler-text,
.status__content,
.status__media-attachments {
  padding: 0 0.5em;
}

.status {
  background: rgb(75, 75, 75);
  color: rgb(223, 218, 217);
  border-style: outset;
  border-width: 2px;
  border-color: rgba(100, 100, 100, 0.25);
  font-family: var(--status-font-family, sans-serif);
}

.status__account-display-name { font-weight: 700; }
.status__created-at { font-size: 0.5em; }
.status__account-acct { font-size: 0.67em; }

.status__content,
.status__spoiler-text {
  font-size: 1.2em;
}

.status--hide-sensitive>.status__spoiler-text {
  background: rgb(50, 50, 50);
  color: rgb(223, 218, 217);
}

.status__show-sensitive-toggle {
  background: rgb(75, 75, 75);
  color: rgb(223, 218, 217);
  border-width: 1px;
  border-color: rgba(100, 100, 100, 0.25);
}

.status--show-sensitive>.status__show-sensitive-toggle { border-style: inset; }

.status--hide-sensitive>.status__show-sensitive-toggle { border-style: outset; }


/**
 * configable section
 */
.status--show-sensitive>.status__spoiler-text
{ display: var(--status--show-sensitive__spoiler-text-display, none); }

.status--hide-sensitive>.status__contents
{ display: var(--status--hide-sensitive__contents-display, block); }

.status--hide-sensitive>.status__spoiler-text:empty::before
{ content: var(--status--hide-sensitive__spoiler-text--empty__before-content, "閲覧注意"); }


.status--pre-sensitive>.status__sensitives
{ display: var(--status--pre-sensitive__sensitives-display, none); }
.status--pre-sensitive.status--hide-sensitive>.status__contents
{ visibility: var(--status--pre-sensitive--hide-sensitive__contents-visibility, visible); }
`;