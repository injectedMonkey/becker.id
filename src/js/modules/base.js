(function(window, document, Fullpage, undef) {
    document.body.className = document.body.className.replace(/no-js/, 'js');

    document.querySelector('.Header').querySelectorAll('a').forEach(function(link) {
        link.setAttribute('href', link.attributes.href.value.replace(/Section/, ''));
    });

    const page = new Fullpage('#Page', {
        anchors: ['Welcome', 'About', 'Skills', 'Experience', 'Contact'],
        navigationTooltips: ['Willkommen', 'Über mich', 'Skills', 'Erfahrung', 'Kontakt'],
        scrollBar: true,
        navigation: true,
        navigationPosition: 'right',
        verticalCentered: false,
        licenseKey: '8rshb7zs-e7rs7dfg-e8aef8se-e8r8sfg8'
    });

    document.querySelector(".Header--NavigationList").onclick = function () {
        document.getElementById('Header--MenuInput').checked = false;
    }
})(this, this.document, this.fullpage);
