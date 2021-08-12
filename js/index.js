function replace_links() {
    let links = document.getElementsByTagName('a');
    for (let link of links) {
        if (!link.href.includes('file://')) {
            continue;
        }
        link.href = link.href.replaceAll(
            /\/.+\//g,
            (match) => 'html' + match.slice(2, -1) + '.html'
        );
    }
}
