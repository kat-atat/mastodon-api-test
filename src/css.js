export default `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: pixerated;
}

.timeline {
  display: grid;
  grid-auto-flow: row;
  gap: 1em 0;
  max-width: 48em;
  padding: 1em;
}

.timeline .status {
  display: grid;
  grid-template:
  "a b b"
  "c c c";
  padding: 1em;
}

.timeline .status>.status__account {
  grid-area: 1 / 1 / 3 / 4;
}

.timeline .status>.status__content {
  grid-area: b;
}

.timeline .status>.status__replies-count {
  grid-area: c;
}

.timeline .status>.status__reblogs-count {
  grid-area: c;
}

.timeline .status>.status__favourites-count {
  grid-area: c;
}

.timeline .status>.status__created-at {
  grid-area: c;
}

.timeline .status .account {
  display: grid;
  grid-template:
  "a b b"
  "c c c";
}

.timeline .status .account img {
  width: 100%;
  vertical-align: middle;
  image-rendering: pixerated;
}

.timeline .status .account>.account__avatar {
  grid-area: a;
  width: 8em;
}


.timeline {
  background-color: rgb(199, 101, 63);
  color: rgb(223, 218, 217);
}

.timeline .status {
  background: rgb(75, 75, 75);
  color: rgb(223, 218, 217);
  border-style: ridge;
  border-width: 4px;
}
`