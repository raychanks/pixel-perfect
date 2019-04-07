chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === 'clicked_browser_action') {
            const overlay = $('#pixel-perfect-overlay');
            const displayProp = overlay.css('display');

            if (displayProp === 'block') {
                overlay.hide();
            } else if (displayProp === 'none') {
                overlay.show();
            } else {
                createExtensionOverlay();
            }
        }
    }
);

function createExtensionOverlay() {
    $('body').append('<div id="pixel-perfect-overlay"></div>');

    const overlay = $('#pixel-perfect-overlay');
    const topMenuHtmlString = `
        <div class="pp-top-menu">
            <div class="pp-top-menu__control-button-container">
                <button>Top</button>
                <button>Bottom</button>
                <button>Left</button>
                <button>Right</button>
            </div>
            <div class="pp-top-menu__pixel-display-container">
                <input type="text" value="0px" />
                <span>x</span>
                <input type="text" value="0px" />
            </div>
        </div>
    `;

    overlay.html(topMenuHtmlString);
}
