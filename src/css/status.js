export default `
.status {
  display: grid;
  grid-template:
  "a b b"
  "c c c";
  padding: 1em;
  border-width: 4px;
}

.status>.status__account {
  grid-area: 1 / 1 / 3 / 4;
}

.status>.status__content {
  grid-area: b;
}

.status>.status__replies-count {
  grid-area: c;
}

.status>.status__reblogs-count {
  grid-area: c;
}

.status>.status__favourites-count {
  grid-area: c;
}

.status>.status__created-at {
  grid-area: c;
}
`;