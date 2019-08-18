window.addEventListener("load", () => {
    // More info about config & dependencies:
    // - https://github.com/hakimel/reveal.js#configuration
    // - https://github.com/hakimel/reveal.js#dependencies
    Reveal.initialize({
        dependencies: [
        { src: "plugin/markdown/marked.js" },
        { src: "plugin/markdown/markdown.js" },
        { src: "plugin/notes/notes.js", async: true },
        { src: "plugin/highlight/highlight.js", async: true }
        ]
    });
    let revealController = new RevealJSController(
        "",
        Reveal
    );
});
