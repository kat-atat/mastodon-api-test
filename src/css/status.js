export default `
.status {
  display: grid;
  grid-template:
  "a a a b c . . . d" auto
  "a a a f f f f f ." auto
  "a a a g g g g g ." auto
  "a a a k h i j . ." auto / 5% 5% 5% 1fr 1fr 1fr 1fr 1fr 8%;
  align-items: start;
  gap: 0.5em;
  padding: 1em;
  border-width: 4px;
}

.status>.status__content { grid-area: f; }
.status>.status__media-attachments { grid-area: g; }
.status>.status__replies-count { grid-area: h; }
.status>.status__reblogs-count { grid-area: i; }
.status>.status__favourites-count { grid-area: j; }
.status>.status__created-at { grid-area: d; }
.status>.status__show-sensitive-toggle { grid-area: k; }
.status>.status__spoiler-text {
  grid-area: 2 / 4 / -2 / -2;
  align-self: stretch;
  z-index: 10;
}

.status>.status__account { grid-area: 1 / 1 / -1 / -1; }
.status .account {
  display: grid;
  grid-template: inherit;
}
.status .account>.account__avatar { grid-area: a; }
.status .account>.account__username { grid-area: b; }
.status .account>.account__display-name { grid-area: b; }
.status .account>.account__acct { grid-area: c; }


:not(.status--sensitive)>.status__show-sensitive-toggle,
:not(.status--sensitive)>.status__spoiler-text,
.status--show-sensitive>.status__spoiler-text { display: none; }

.status__spoiler-text {
  display: flex;
  justify-content: center;
  align-items: center;
}

.status__created-at {
  font-size: 8px;
}
`;