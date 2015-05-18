react-up
====

Whip up a react component for quick standalone display.

Install and run
----

`npm install -g react-up`

then run:

```
reactup path/to/component.js
```

### Options

- `--port`: sets the http port (default: 8000)
- `--css`: path to a css file which will be used on the page. The file is also hot-loaded if any changes are made to it.

Eg.

```
reactup --port=5432 --css=theme.css path/to/component.js
```

Live reloading
----

Any changes made to the source component (or other modules `require`'d by the component) are live-reloaded in the page.

![example of live-reloading props, css and components](https://github.com/joshwnj/react-up/blob/master/example/reactup-1-1.gif)

Setting props
----

You can pipe in props from stdin like this:

```
cat props.json | reactup path/to/component.js
```

And if you have something that produces a stream of `ndjson` you will get realtime updates whenever the props change. Eg:

```
npm i -g watch-json

watch-json props.json | reactup path/to/component.js
```

`jsx` and `es6`
----

Before sending to the browser we transform the component file with [`browserify`](https://npmjs.com/package/browserify) and [`babelify`](https://npmjs.com/package/babelify) so all of your jsx and es6 should work without a hitch (but please [let me know](https://github.com/joshwnj/react-up/issues/new) if it doesn't!).


License
----

MIT
