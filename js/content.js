const coordinates = {
    start: {
        page: {
            x: 0,
            y: 0,
        },
        client: {
            x: 0,
            y: 0,
        },
    },
    end: {
        page: {
            x: 0,
            y: 0,
        },
        client: {
            x: 0,
            y: 0,
        },
    },
};
let isMouseDown = false;

const eventHandlers = {
    overlayMouseDown(event) {
        isMouseDown = true;

        coordinates.start.page.x = event.pageX;
        coordinates.start.page.y = event.pageY;
        coordinates.start.client.x = event.clientX;
        coordinates.start.client.y = event.clientY;

        renderSelectionBoxUI(coordinates.start.client, coordinates.start.client);
    },
    overlayMouseMove(event) {
        if (!isMouseDown) {
            return;
        }

        coordinates.end.page.x = event.pageX;
        coordinates.end.page.y = event.pageY;
        coordinates.end.client.x = event.clientX;
        coordinates.end.client.y = event.clientY;

        renderSelectionBoxUI(coordinates.start.client, coordinates.end.client);
    },
    overlayMouseUp(event) {
        isMouseDown = false;

        coordinates.end.page.x = event.pageX;
        coordinates.end.page.y = event.pageY;
        coordinates.end.client.x = event.clientX;
        coordinates.end.client.y = event.clientY;

        renderSelectionBoxUI(coordinates.start.client, coordinates.end.client);
    },
};

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
                const newOverlay = createExtensionOverlay();

                newOverlay.on('mousedown', eventHandlers.overlayMouseDown);
                newOverlay.on('mouseup', eventHandlers.overlayMouseUp);
                newOverlay.on('mousemove', eventHandlers.overlayMouseMove);
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

    return overlay;
}

function renderSelectionBoxUI(coor1, coor2) {
    const overlay = $('#pixel-perfect-overlay');
    const boxWidth = Math.abs(coor1.x - coor2.x);
    const boxHeight = Math.abs(coor1.y - coor2.y);
    let boxLeft = coor1.x;
    let boxTop = coor1.y;

    // user drags towards the left
    if (coor1.x > coor2.x) {
        boxLeft = coor2.x;
    }

    // user drags upwards
    if (coor1.y > coor2.y) {
        boxTop = coor2.y;
    }

    $('.pp-selection-box').remove();
    overlay.append(`
        <div
            class="pp-selection-box"
            style="width: ${boxWidth}px; height: ${boxHeight}px; top: ${boxTop}px; left: ${boxLeft}px;"
        />`
    );
}
