export default `
.account>.account__username,
.account>.account__display-name,
.account>.account__acct {
  white-space: nowrap;
}

.account__avatar {
  border-width: 1px;
}

.account>.account__display-name:not(:empty)~.account__username {
  display: none;
}
`;