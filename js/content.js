let coordinates = {
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
        updatePixelDisplay(coordinates.start.client, coordinates.start.client);
    },
    overlayMouseMove(event) {
        if (!isMouseDown) {
            renderReticle({
                x: event.clientX,
                y: event.clientY,
            });

            return;
        }

        coordinates.end.page.x = event.pageX;
        coordinates.end.page.y = event.pageY;
        coordinates.end.client.x = event.clientX;
        coordinates.end.client.y = event.clientY;

        renderSelectionBoxUI(coordinates.start.client, coordinates.end.client);
        updatePixelDisplay(coordinates.start.client, coordinates.end.client);
    },
    overlayMouseUp(event) {
        if (!isMouseDown) {
            return;
        }

        isMouseDown = false;

        coordinates.end.page.x = event.pageX;
        coordinates.end.page.y = event.pageY;
        coordinates.end.client.x = event.clientX;
        coordinates.end.client.y = event.clientY;

        renderSelectionBoxUI(coordinates.start.client, coordinates.end.client);
        updatePixelDisplay(coordinates.start.client, coordinates.end.client);
    },
    topMenuMouseEnter(event) {
        hideReticle();
    },
    stopPropagation(event) {
        event.stopPropagation();
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

                $('.pp-top-menu').on('mousedown', eventHandlers.stopPropagation);
                $('.pp-top-menu').on('mouseup', eventHandlers.stopPropagation);
                $('.pp-top-menu').on('mousemove', eventHandlers.stopPropagation);
                $('.pp-top-menu').on('mouseenter', eventHandlers.topMenuMouseEnter);
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
                <button class="pp-top-menu__clear-btn">Clear</button>
            </div>
            <div class="pp-top-menu__pixel-display-container">
                <div>
                    Width:
                    <input class="pp-top-menu__pixel-display pp-top-menu__width-pixel-display" type="text" value="0" />
                    px
                </div>
                <span>x</span>
                <div>
                    Height:
                    <input class="pp-top-menu__pixel-display pp-top-menu__height-pixel-display" type="text" value="0" />
                    px
                </div>
            </div>
        </div>
        <div class="pp-reticle-verticle" />
        <div class="pp-reticle-horizontal" />
    `;

    overlay.html(topMenuHtmlString);
    $('.pp-top-menu__clear-btn').on('click', reset);

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

function updatePixelDisplay(coor1, coor2) {
    const widthDisplayEl = $('.pp-top-menu__width-pixel-display');
    const heightDisplayEl = $('.pp-top-menu__height-pixel-display');
    const boxWidth = Math.abs(coor1.x - coor2.x);
    const boxHeight = Math.abs(coor1.y - coor2.y);

    widthDisplayEl.val(boxWidth);
    heightDisplayEl.val(boxHeight);
}

function renderReticle(coor) {
    const verticalLine = $('.pp-reticle-verticle');
    const horizontalLine = $('.pp-reticle-horizontal');

    verticalLine.show();
    horizontalLine.show();
    verticalLine.css('left', coor.x + 'px');
    horizontalLine.css('top', coor.y + 'px');
}

function hideReticle() {
    $('.pp-reticle-verticle').hide();
    $('.pp-reticle-horizontal').hide();
}

function reset() {
    isMouseDown = false;
    coordinates = {
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

    renderSelectionBoxUI(coordinates.start.client, coordinates.end.client);
    updatePixelDisplay(coordinates.start.client, coordinates.end.client);
}
