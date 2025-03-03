import {getWorkspaceName} from "../util/noRelyPCFunction";
import {updateHotkeyTip} from "../protyle/util/compatibility";
import {processSync} from "../dialog/processSystem";
import {goBack, goForward} from "../util/backForward";
import {syncGuide} from "../sync/syncGuide";
import {workspaceMenu} from "../menus/workspace";
import {editor} from "../config/editor";
import {MenuItem} from "../menus/Menu";
import {setMode} from "../util/assets";
import {openSetting} from "../config";
import {openSearch} from "../search/spread";

export const updateEditModeElement = () => {
    const target = document.querySelector("#barReadonly");
    if (window.siyuan.config.editor.readOnly) {
        target.classList.add("toolbar__item--active");
        target.setAttribute("aria-label", `${window.siyuan.languages.use} ${window.siyuan.languages.editMode} ${updateHotkeyTip(window.siyuan.config.keymap.general.editMode.custom)}`);
        target.querySelector("use").setAttribute("xlink:href", "#iconPreview");
    } else {
        target.classList.remove("toolbar__item--active");
        target.setAttribute("aria-label", `${window.siyuan.languages.use} ${window.siyuan.languages.editReadonly} ${updateHotkeyTip(window.siyuan.config.keymap.general.editMode.custom)}`);
        target.querySelector("use").setAttribute("xlink:href", "#iconEdit");
    }
};

export const initBar = () => {
    const toolbarElement = document.getElementById("toolbar");
    toolbarElement.innerHTML = `
<div id="barWorkspace" class="toolbar__item">
    <span class="toolbar__text">${getWorkspaceName()}</span>
    <svg class="toolbar__svg"><use xlink:href="#iconDown"></use></svg>
</div>
<div id="barSync" class="toolbar__item b3-tooltips b3-tooltips__se${window.siyuan.config.readonly ? " fn__none" : ""}" aria-label="${window.siyuan.config.sync.stat || (window.siyuan.languages.syncNow + " " + updateHotkeyTip(window.siyuan.config.keymap.general.syncNow.custom))}">
    <svg><use xlink:href="#iconCloudSucc"></use></svg>
</div>
<button id="barBack" data-menu="true" class="toolbar__item toolbar__item--disabled b3-tooltips b3-tooltips__se" aria-label="${window.siyuan.languages.goBack} ${updateHotkeyTip(window.siyuan.config.keymap.general.goBack.custom)}">
    <svg><use xlink:href="#iconBack"></use></svg>
</button>
<button id="barForward" data-menu="true" class="toolbar__item toolbar__item--disabled b3-tooltips b3-tooltips__se" aria-label="${window.siyuan.languages.goForward} ${updateHotkeyTip(window.siyuan.config.keymap.general.goForward.custom)}">
    <svg><use xlink:href="#iconForward"></use></svg>
</button>
<div class="fn__flex-1 fn__ellipsis" id="drag"><span class="fn__none">开发版，使用前请进行备份 Development version, please backup before use</span></div>
<div id="toolbarVIP" class="fn__flex${window.siyuan.config.readonly ? " fn__none" : ""}"></div>
<div id="barSearch" class="toolbar__item b3-tooltips b3-tooltips__sw" aria-label="${window.siyuan.languages.globalSearch} ${updateHotkeyTip(window.siyuan.config.keymap.general.globalSearch.custom)}">
    <svg><use xlink:href="#iconSearch"></use></svg>
</div>
<div id="barReadonly" class="toolbar__item b3-tooltips b3-tooltips__sw${window.siyuan.config.readonly ? " fn__none" : ""}${window.siyuan.config.editor.readOnly ? " toolbar__item--active" : ""}" aria-label="${window.siyuan.languages.use} ${window.siyuan.config.editor.readOnly ? window.siyuan.languages.editMode : window.siyuan.languages.editReadonly} ${updateHotkeyTip(window.siyuan.config.keymap.general.editMode.custom)}">
    <svg><use xlink:href="#icon${window.siyuan.config.editor.readOnly ? "Preview" : "Edit"}"></use></svg>
</div>
<div id="barMode" class="toolbar__item b3-tooltips b3-tooltips__sw${window.siyuan.config.readonly ? " fn__none" : ""}" aria-label="${window.siyuan.languages.appearanceMode}">
    <svg><use xlink:href="#icon${window.siyuan.config.appearance.modeOS ? "Mode" : (window.siyuan.config.appearance.mode === 0 ? "Light" : "Dark")}"></use></svg>
</div>
<div class="fn__flex" id="windowControls"></div>`;
    processSync();
    toolbarElement.addEventListener("click", (event: MouseEvent) => {
        let target = event.target as HTMLElement;
        while (!target.classList.contains("toolbar")) {
            if (target.id === "barBack") {
                goBack();
                event.stopPropagation();
                break;
            } else if (target.id === "barForward") {
                goForward();
                event.stopPropagation();
                break;
            } else if (target.id === "barSync") {
                syncGuide(target);
                event.stopPropagation();
                break;
            } else if (target.id === "barWorkspace") {
                workspaceMenu(target.getBoundingClientRect());
                event.stopPropagation();
                break;
            } else if (target.id === "barReadonly") {
                editor.setReadonly();
                event.stopPropagation();
                break;
            } else if (target.id === "barMode") {
                if (!window.siyuan.menus.menu.element.classList.contains("fn__none") &&
                    window.siyuan.menus.menu.element.getAttribute("data-name") === "barmode") {
                    window.siyuan.menus.menu.remove();
                    return;
                }
                window.siyuan.menus.menu.remove();
                window.siyuan.menus.menu.element.setAttribute("data-name", "barmode");
                window.siyuan.menus.menu.append(new MenuItem({
                    label: window.siyuan.languages.themeLight,
                    icon: "iconLight",
                    current: window.siyuan.config.appearance.mode === 0 && !window.siyuan.config.appearance.modeOS,
                    click: () => {
                        setMode(0);
                    }
                }).element);
                window.siyuan.menus.menu.append(new MenuItem({
                    label: window.siyuan.languages.themeDark,
                    current: window.siyuan.config.appearance.mode === 1 && !window.siyuan.config.appearance.modeOS,
                    icon: "iconDark",
                    click: () => {
                        setMode(1);
                    }
                }).element);
                window.siyuan.menus.menu.append(new MenuItem({
                    label: window.siyuan.languages.themeOS,
                    current: window.siyuan.config.appearance.modeOS,
                    icon: "iconMode",
                    click: () => {
                        setMode(2);
                    }
                }).element);
                const rect = target.getBoundingClientRect();
                window.siyuan.menus.menu.popup({x: rect.right, y: rect.bottom}, true);
                event.stopPropagation();
                break;
            } else if (target.id === "toolbarVIP") {
                if (!window.siyuan.config.readonly) {
                    const dialogSetting = openSetting();
                    dialogSetting.element.querySelector('.b3-tab-bar [data-name="account"]').dispatchEvent(new CustomEvent("click"));
                }
                event.stopPropagation();
                break;
            } else if (target.id === "barSearch") {
                openSearch(window.siyuan.config.keymap.general.globalSearch.custom);
                event.stopPropagation();
                break;
            }
            target = target.parentElement;
        }
    });
};
