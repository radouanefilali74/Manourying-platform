# The one edit to a shared file

`/etc/nginx/nginx.conf` is shared with `law.manouri.ovh`. This phase added exactly one line to
it, beside the existing zones:

```nginx
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;   # Manourying admin login
limit_conn_zone $binary_remote_addr zone=connlimit:10m;
```

It is additive and cannot affect the other vhost: a zone does nothing at all until a `limit_req`
references it, and only `api.manourying.manouri.ovh`'s `location = /admin/auth/login` does.

`nginx -t` was run before and after, and both neighbours were checked after the reload — that is
the standing rule on this box, because a bad config takes `law.manouri.ovh` down too.

The upstream block for the API deliberately lives in
[api.manourying.manouri.ovh](api.manourying.manouri.ovh) rather than here, unlike legal-tech's
`legaltech_api`/`legaltech_web`: removing that vhost should leave `nginx -t` clean without needing
a second edit to a shared file.
