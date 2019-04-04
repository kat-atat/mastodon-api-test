export default `
.spoiler {
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spoiler__content {
}

.spoiler--open {
  display: inline;
}

.spoiler--open>.spoiler__content {
  display: var(--spoiler--open__content-display, none);
}

.spoiler--close {
}


.spoiler--close>.spoiler__content {
  padding: 1em;
}


.spoiler {
  background: var(--spoiler-background);
  color: var(--spoiler-color);
}

.spoiler--close>.spoiler__content:empty::before {
  content: var(--spoiler__content-empty__before-content, "閲覧注意");
}
`;