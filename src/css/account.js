export default `
.account>.account__username,
.account>.account__display-name,
.account>.account__acct {
  white-space: nowrap;
}

.account__avatar {
  border-width: 1px;
}

.account {
}

.account__avatar {
  background: rgb(75, 75, 75);
  color: rgb(223, 218, 217);
  border-style: inset;
  border-color: rgba(100, 100, 100, 0.25);
}

.account>.account__display-name:not(:empty)~.account__username {
  display: none;
}
`;