# Ditto

A simple delay plugin.

## Set up

Install dependencies:

```sh
npm install
```

Copy Elementary binaries:

```sh
npx elem-copy-binaries
```

During development, the dev server needs a valid certificate to serve over HTTPS. Add a `elem.key.pem` private key and `elem.key` certificate to the root of the project. We recommend [mkcert](https://github.com/FiloSottile/mkcert) as a reasonably quick way to set things up. See the [Elementary docs](https://www.elementary.audio/docs/packages/plugin-renderer#dev-ssl-certificate) for more information.

## Develop

```bash
npm run dev
```

## Build

Build the project:

```bash
npm run build
```

## Keyboard Shortcuts

- `esc` - Navigate to home screen
- `n` - Create new preset
- `e` - Edit selected preset
- `c` - Navigate to connection screen
- `l` - View presets list
- `left/up` - Previous preset
- `right/down` - Next preset
- `shift` - View keyboard shortcuts menu
