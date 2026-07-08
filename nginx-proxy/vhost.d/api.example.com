# Rename this file to your real domain, e.g. vhost.d/api.yourdomain.com
# nginx-proxy auto-includes files here for matching VIRTUAL_HOST containers.
#
# Proxy headers (X-Forwarded-*) are set by nginx-proxy by default.
# Add only what your app needs beyond the defaults.

# File uploads / avatars (adjust to your max upload size)
client_max_body_size 25m;

# Longer timeouts for slow API calls
proxy_connect_timeout 60s;
proxy_send_timeout 60s;
proxy_read_timeout 60s;

# WebSockets (uncomment if you add WS later)
# proxy_set_header Upgrade $http_upgrade;
# proxy_set_header Connection "upgrade";
