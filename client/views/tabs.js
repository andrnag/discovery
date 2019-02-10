/* eslint-env browser */

export default function(discovery) {
    discovery.view.define('tabs', function(el, config, data, context) {
        function renderContent(value) {
            if (currentValue === value) {
                return;
            }

            currentValue = value;

            if (Array.isArray(tabs)) {
                tabsEl.innerHTML = '';
                tabs.forEach(tab =>
                    discovery.view.render(tabsEl, {
                        view: 'tab',
                        active: tab.value === currentValue,
                        content: tab.content,
                        onClick: renderContent
                    }, tab, context)
                );
            }

            contentEl.innerHTML = '';
            discovery.view.render(contentEl, content, data, { ...context, [name]: value });
        }

        const tabsEl = el.appendChild(document.createElement('div'));
        const contentEl = el.appendChild(document.createElement('div'));
        const { content } = config;
        let { name, tabs } = config;
        let currentValue = NaN;
        let initValue =
            'value' in config
                ? config.value
                : name in context
                    ? context[name]
                    : undefined;

        tabsEl.className = 'view-tabs-buttons';
        contentEl.className = 'view-tabs-content';

        if (typeof name !== 'string') {
            name = 'filter';
        }

        if (Array.isArray(tabs)) {
            tabs = tabs.map(tab => {
                const type = typeof tab;

                if (type === 'string' || type === 'number' || type === 'boolean') {
                    tab = { value: tab };
                }

                if (initValue === undefined || tab.active) {
                    initValue = tab.value;
                }

                return tab;
            });
        } else {
            tabs = [];
        }

        renderContent(initValue);
    });
}
