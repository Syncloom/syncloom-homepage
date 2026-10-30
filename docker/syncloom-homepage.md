# Syncloom website

The static website of [Syncloom](https://github.com/Syncloom), built with Hugo and served by nginx on port `80` with a strict content security policy. No cookies, no third-party requests.

```bash
docker run -p 8080:80 <namespace>/syncloom-homepage
```

- Tags: `X.Y.Z` for each release, `latest` for the newest stable one, `beta-latest` for pre-releases
- Architectures: `linux/amd64`, `linux/arm64`

Source: <https://github.com/Syncloom/syncloom-homepage> · License: Apache-2.0
