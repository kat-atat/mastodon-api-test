export default `
* {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: pixerated;
}

.client {
  background-color: rgb(199, 101, 63);
  color: rgb(223, 218, 217);
}

.status {
  background: rgb(75, 75, 75);
  color: rgb(223, 218, 217);
  border-style: outset;
  border-color: rgba(100, 100, 100, 0.25);
}

:not(.status--show-sensitive)>.status__spoiler-text {
  background: rgb(50, 50, 50);
  color: rgb(223, 218, 217);
}

.status__show-sensitive-toggle {
  background: rgb(75, 75, 75);
  color: rgb(223, 218, 217);
  border-style: outset;
}

.status--show-sensitive>.status__show-sensitive-toggle {
  border-style: inset;
}

.account {
}

.account__avatar {
  background: rgb(75, 75, 75);
  color: rgb(223, 218, 217);
  border-style: inset;
  border-color: rgba(100, 100, 100, 0.25);
}




.status__replies-count::before {
  content: var(--status__replies-count-content, "↩️") attr(data-replies-count);
}

.status__reblogs-count::before {
  content: var(--status__reblogs-count-content, "🔁") attr(data-reblogs-count);
}

.status__favourites-count::before {
  content: var(--status__favourites-count-content, "⭐️") attr(data-favourites-count);
}

.status--sensitive>.status__show-sensitive-toggle::before {
  content: var(--status__show-sensitive-toggle-content, "👁");
}

.status--sensitive>.status__spoiler-text:empty::before {
  content: var(--status__spoiler-text-content, "閲覧注意");
}

.status__created-at::before {
  content: attr(data-relative-time);
}
.status--show-absolute-time.status__created-at::before {
  content: attr(data-absolute-time);
}
`;
