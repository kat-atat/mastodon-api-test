export default `
* {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: pixerated;
}

.timeline {
  background-color: rgb(199, 101, 63);
  color: rgb(223, 218, 217);
}

.status {
  background: rgb(75, 75, 75);
  color: rgb(223, 218, 217);
  border-style: outset;
  border-color: rgba(75, 75, 75, 0.50);
}
.account__acct {
  font-family: var(--account__acct-font, monospace);
}

.status__content {
  font-family: var(--status__content-font, sans-serif);
}

.status__replies-count::before {
  content: var(--replies-count, "↩️");
}

.status__reblogs-count::before {
  content: var(--reblogs-count-symbol, "🔁");
}

.status__favourites-count::before {
  content: var(--favourites-count-symbol, "⭐️");
}

.status--sensitive::before {
  content: var(--sensitive-text, "閲覧注意 ") attr(data-spoiler-text);
}

.status--sensitive::before {
  background: rgb(50, 50, 50);
  color: rgb(223, 218, 217);
}

.account {
  background: rgb(75, 75, 75);
  color: rgb(223, 218, 217);
}
`;
