var svg = {
    arrowUp: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 25 25" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>',
    arrowDown: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 25 25" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    arrowRight: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 25 25" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
    attention: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 25 25" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    clear: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 25 25" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    cross: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 25 25" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 25 25" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    partialCheck: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 25 25" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
}
class TreeselectInput {
    #htmlTagsSecton = null;
    #htmlEditControl = null;
    #htmlOperators = null;

    #htmlArrow = null;
    #openEvent = new CustomEvent("open");
    #closeEvent = new CustomEvent("close");
    constructor({value: e, showTags: t, clearable: s, isAlwaysOpened: a, searchable: i, placeholder: n, disabled: r}) {
        this.value = e,
            this.showTags = t ?? !0,
            this.searchable = i ?? !0,
            this.placeholder = n ?? "Search...",
            this.clearable = s ?? !0,
            this.isAlwaysOpened = a ?? !1,
            this.disabled = r ?? !1,
            this.isOpened = !1,
            this.searchText = "",
            this.srcElement = this.#createTreeselectInput(),
            this.#updateDOM()
    }
    focus() {
        this.#htmlEditControl.focus()
    }
    blur() {
        this.isOpened && this.#updateOpenClose()
    }
    updateValue(e) {
        this.value = e,
            this.#updateTags(),
            this.#updateEditControl()
    }
    removeItem(t) {
        this.value = this.value.filter(e=>e.id !== t),
            this.#emitInput(),
            this.#updateTags(),
            this.#updateEditControl()
    }
    clear() {
        this.value = [],
            this.searchText = "",
            this.#emitSearch(""),
            this.#emitInput(),
            this.#updateTags(),
            this.#updateEditControl()
    }
    openClose() {
        this.#updateOpenClose()
    }
    #updateDOM() {
        this.#updateTags(),
            this.#updateEditControl(),
            this.#updateOperators()
    }
    #updateTags() {
        this.#htmlTagsSecton.innerHTML = "",
            this.showTags ? this.#htmlTagsSecton.append(...this.#createTags()) : this.#htmlTagsSecton.appendChild(this.#createCountElement())
    }
    #updateOperators() {
        const e = [];
        this.#htmlOperators.innerHTML = "",
        this.clearable && e.push(this.#createClearButton()),
        this.isAlwaysOpened || e.push(this.#createInputArrow(this.isOpened)),
        e.length && this.#htmlOperators.append(...e)
    }
    #updateArrowDirection() {
        var e;
        this.isAlwaysOpened || (e = this.isOpened ? svg.arrowUp : svg.arrowDown,
            this.#htmlArrow.innerHTML = e)
    }
    #updateEditControl() {
        this.value?.length ? this.#htmlEditControl.removeAttribute("placeholder") : this.#htmlEditControl.setAttribute("placeholder", this.placeholder),
            this.searchable ? this.srcElement.classList.remove("treeselect-input--unsearchable") : this.srcElement.classList.add("treeselect-input--unsearchable"),
            this.#htmlEditControl.value = this.searchText
    }
    #updateOpenClose() {
        this.isOpened = !this.isOpened,
            this.#updateArrowDirection(),
            this.isOpened ? this.#emitOpen() : this.#emitClose()
    }
    #createTreeselectInput() {
        const e = document.createElement("div");
        return e.classList.add("treeselect-input"),
            e.setAttribute("tabindex", "-1"),
            this.#htmlTagsSecton = this.#createTagsSection(),
            this.#htmlEditControl = this.#createControl(),
            this.#htmlOperators = this.#createOperators(),
            e.addEventListener("mousedown", e=>{
                    e.preventDefault(),
                    this.isOpened || this.#updateOpenClose(),
                        this.focus()
                }
            ),
            e.append(this.#htmlTagsSecton, this.#htmlEditControl, this.#htmlOperators),
            e
    }
    #createTagsSection() {
        const e = document.createElement("div");
        return e.classList.add("treeselect-input__tags"),
            e
    }
    #createTags() {
        return this.value.map(t=>{
                const e = document.createElement("div");
                e.classList.add("treeselect-input__tags-element"),
                    e.setAttribute("tabindex", "-1"),
                    e.setAttribute("tag-id", t.id),
                    e.setAttribute("title", t.name);
                var s = this.#createTagName(t.name)
                    , a = this.#createTagCross();
                return e.addEventListener("mousedown", e=>{
                        e.preventDefault(),
                            e.stopPropagation(),
                            this.focus(),
                            this.removeItem(t.id)
                    }
                ),
                    e.append(s, a),
                    e
            }
        )
    }
    #createTagName(e) {
        const t = document.createElement("span");
        return t.classList.add("treeselect-input__tags-name"),
            t.innerHTML = e,
            t
    }
    #createTagCross() {
        const e = document.createElement("span");
        return e.classList.add("treeselect-input__tags-cross"),
            e.innerHTML = svg.cross,
            e
    }
    #createCountElement() {
        const e = document.createElement("span");
        return e.classList.add("treeselect-input__tags-count"),
            this.value.length ? e.innerHTML = 1 === this.value.length ? this.value[0].name : this.value.length + " elements selected" : e.innerHTML = "",
            e
    }
    #createControl() {
        const a = document.createElement("input");
        return a.classList.add("treeselect-input__edit"),
        this.disabled && a.setAttribute("tabindex", "-1"),
            a.addEventListener("keydown", e=>{
                    "Backspace" !== e.key || this.searchText.length || !this.value.length || this.showTags || this.clear(),
                    "Backspace" === e.key && !this.searchText.length && this.value.length && this.removeItem(this.value[this.value.length - 1].id),
                    "Space" !== e.code || this.searchText && this.searchable || this.#updateOpenClose()
                }
            ),
            a.addEventListener("input", e=>{
                    e.stopPropagation();
                    var t = this.searchText
                        , s = a.value.trim();
                    0 === t.length && 0 === s.length ? a.value = "" : (this.searchable ? (this.#emitSearch(e.target.value),
                    this.isOpened || this.#updateOpenClose()) : a.value = "",
                        this.searchText = a.value)
                }
            ),
            a
    }
    #createOperators() {
        const e = document.createElement("div");
        return e.classList.add("treeselect-input__operators"),
            e
    }
    #createClearButton() {
        const e = document.createElement("span");
        return e.classList.add("treeselect-input__clear"),
            e.setAttribute("tabindex", "-1"),
            e.innerHTML = svg.clear,
            e.addEventListener("mousedown", e=>{
                    e.preventDefault(),
                        e.stopPropagation(),
                        this.#htmlEditControl.focus(),
                    (this.searchText.length || this.value.length) && this.clear()
                }
            ),
            e
    }
    #createInputArrow(e) {
        return this.#htmlArrow = document.createElement("span"),
            this.#htmlArrow.classList.add("treeselect-input__arrow"),
            this.#htmlArrow.innerHTML = e ? svg.arrowUp : svg.arrowDown,
            this.#htmlArrow.addEventListener("mousedown", e=>{
                    e.stopPropagation(),
                        e.preventDefault(),
                        this.focus(),
                        this.#updateOpenClose()
                }
            ),
            this.#htmlArrow
    }
    #emitInput() {
        this.srcElement.dispatchEvent(new CustomEvent("input",{
            detail: this.value
        }))
    }
    #emitSearch(e) {
        this.srcElement.dispatchEvent(new CustomEvent("search",{
            detail: e
        }))
    }
    #emitOpen() {
        this.srcElement.dispatchEvent(this.#openEvent)
    }
    #emitClose() {
        this.srcElement.dispatchEvent(this.#closeEvent)
    }
}

const getFlatOptons = (e,i,l=0,c=0)=>e.reduce((e,t)=>{
            var s = !!t.children?.length;
            return e.push({
                id: t.value,
                name: t.name,
                childOf: l,
                isGroup: s,
                checked: !1,
                level: c,
                isClosed: i <= c && s,
                hidden: i < c
            }),
            s && (s = getFlatOptons(t.children, i, t.value, c + 1),
                e.push(...s)),
                e
        }
        , [])
    , checkAllChildrenInputs = ({id: t, checked: s},i)=>{
        i.forEach(e=>{
                e.childOf === t && (e.checked = s,
                e.isGroup && checkAllChildrenInputs(e, i))
            }
        )
    }
    , checkAllParentInputs = (t,e)=>{
        const s = e.find(e=>e.id === t)
            , i = e.filter(e=>e.childOf === s.id);
        var l = i.every(e=>e.checked)
            , c = i.some(e=>e.isPartialChecked || e.checked) && !l
            , r = !l && !c;
        l && (s.checked = !0,
            s.isPartialChecked = !1),
        c && (s.checked = !1,
            s.isPartialChecked = !0),
        r && (s.checked = !1,
            s.isPartialChecked = !1),
        s.childOf && checkAllParentInputs(s.childOf, e)
    }
    , checkInput = ({id: e, isGroup: t, childOf: s, checked: i},l)=>{
        t && checkAllChildrenInputs({
            id: e,
            checked: i
        }, l),
        s && checkAllParentInputs(s, l)
    }
    , updateValue = (t,s,e)=>{
        s.forEach(e=>e.checked = !1);
        const i = s.filter(e=>t.includes(e.id));
        i.forEach(e=>{
                e.checked = !0,
                    e.isPartialChecked = !1,
                    checkInput(e, s)
            }
        ),
            updateDOM(s, e)
    }
    , hideShowChildren = (t,{id: s, isClosed: i})=>{
        const e = t.filter(e=>e.childOf === s);
        e.forEach(e=>{
                e.hidden = i,
                e.isGroup && !e.isClosed && hideShowChildren(t, {
                    id: e.id,
                    isClosed: i
                })
            }
        )
    }
    , updateDOM = (l,c)=>{
        l.forEach(e=>{
                const t = c.querySelector(`[input-id="${e.id}"]`)
                    , s = getListItemByCheckbox(t);
                if (t.checked = e.checked,
                    e.checked ? s.classList.add("treeselect-list__item--checked") : s.classList.remove("treeselect-list__item--checked"),
                    e.isPartialChecked ? s.classList.add("treeselect-list__item--partial-checked") : s.classList.remove("treeselect-list__item--partial-checked"),
                    e.isGroup) {
                    const i = s.querySelector(".treeselect-list__item-icon");
                    e.isClosed ? (s.classList.add("treeselect-list__item--closed"),
                        i.innerHTML = svg.arrowRight) : (s.classList.remove("treeselect-list__item--closed"),
                        i.innerHTML = svg.arrowDown)
                }
                e.hidden ? s.classList.add("treeselect-list__item--hidden") : s.classList.remove("treeselect-list__item--hidden"),
                    updateLeftPaddingItems(e, s, l),
                    updateCheckboxClasses(e, t)
            }
        );
        var e = l.some(e=>!e.hidden);
        const t = c.querySelector(".treeselect-list__empty");
        e ? t.classList.add("treeselect-list__empty--hidden") : t.classList.remove("treeselect-list__empty--hidden")
    }
    , updateLeftPaddingItems = (t,e,s)=>{
        0 === t.level ? (s = s.some(e=>e.isGroup && e.level === t.level),
            s = !t.isGroup && s ? "20px" : "5px",
            e.style.paddingLeft = t.isGroup ? "0" : s) : e.style.paddingLeft = t.isGroup ? 20 * t.level + "px" : 20 * t.level + 20 + "px",
            e.setAttribute("level", t.level),
            e.setAttribute("group", t.isGroup)
    }
    , updateCheckboxClasses = (e,t)=>{
        const s = t.parentNode
            , i = s.querySelector(".treeselect-list__item-checkbox-icon");
        e.checked ? i.innerHTML = svg.check : e.isPartialChecked ? i.innerHTML = svg.partialCheck : i.innerHTML = ""
    }
    , getAllFlattedChildren = (s,i)=>i.reduce((e,t)=>(t.childOf === s && (e.push(t),
    t.isGroup && e.push(...getAllFlattedChildren(t.id, i))),
        e), [])
    , getAllFlattendParents = (s,i)=>i.reduce((e,t)=>(t.id === s && (e.push(t),
    t.childOf && e.push(...getAllFlattendParents(t.childOf, i))),
        e), [])
    , getGroupedValues = e=>{
        const {onlyGroupsIds: t, allItems: s} = e.reduce((e,t)=>(t.checked && (t.isGroup && e.onlyGroupsIds.push(t.id),
            e.allItems.push(t)),
            e), {
            onlyGroupsIds: [],
            allItems: []
        });
        return s.filter(e=>!t.includes(e.childOf))
    }
    , getCheckedValues = e=>e.filter(e=>e.checked && !e.isGroup)
    , getListItemByCheckbox = e=>{
        return e.parentNode.parentNode
    }
;
class TreeselectList {
    #lastFocusedItem = null;
    #isMouseActionsAvailable = !0;
    constructor({options: e, value: t, openLevel: s, listSlotHtmlComponent: i, emptyText: l}) {
        this.options = e,
            this.value = t,
            this.searchText = "",
            this.openLevel = s ?? 0,
            this.listSlotHtmlComponent = i,
            this.emptyText = l ?? "No results found...",
            this.flattedOptions = getFlatOptons(this.options, this.openLevel),
            this.flattedOptionsBeforeSearch = this.flattedOptions,
            this.selectedNodes = {
                ids: [],
                groupedIds: []
            },
            this.srcElement = this.#createList(),
            this.updateValue(this.value)
    }
    updateValue(e) {
        updateValue(e, this.flattedOptions, this.srcElement),
            this.#updateSelectedNodes()
    }
    updateSearchValue(i) {
        var e = "" === this.searchText && "" !== i;
        if (this.searchText = i,
        e && (this.flattedOptionsBeforeSearch = JSON.parse(JSON.stringify(this.flattedOptions))),
        "" === this.searchText)
            return this.flattedOptions = this.flattedOptionsBeforeSearch.map(t=>{
                    const e = this.flattedOptions.find(e=>e.id === t.id);
                    return e.isClosed = t.isClosed,
                        e.hidden = t.hidden,
                        e
                }
            ),
                this.flattedOptionsBeforeSearch = [],
                updateDOM(this.flattedOptions, this.srcElement),
                void this.focusFirstListElement();
        const s = this.flattedOptions.reduce((e,t)=>{
                var s;
                return t.name.toLowerCase().includes(i.toLowerCase()) && (e.push(t),
                t.isGroup && (s = getAllFlattedChildren(t.id, this.flattedOptions),
                    e.push(...s)),
                t.childOf && (s = getAllFlattendParents(t.childOf, this.flattedOptions),
                    e.push(...s))),
                    e
            }
            , []);
        this.flattedOptions.forEach(t=>{
                s.some(e=>e.id === t.id) ? (t.isGroup && (t.isClosed = !1,
                    hideShowChildren(this.flattedOptions, t)),
                    t.hidden = !1) : t.hidden = !0
            }
        ),
            updateDOM(this.flattedOptions, this.srcElement),
            this.focusFirstListElement()
    }
    callKeyAction(e) {
        this.#isMouseActionsAvailable = !1;
        const t = this.srcElement.querySelector(".treeselect-list__item--focused");
        if ("Enter" === e && t && t.dispatchEvent(new Event("mousedown")),
        "ArrowLeft" === e || "ArrowRight" === e) {
            if (!t)
                return;
            const c = t.querySelector(".treeselect-list__item-checkbox")
                , r = c.getAttribute("input-id");
            var s = this.flattedOptions.find(e=>e.id === r);
            const o = t.querySelector(".treeselect-list__item-icon");
            "ArrowLeft" !== e || s.isClosed || o.dispatchEvent(new Event("mousedown")),
            "ArrowRight" === e && s.isClosed && o.dispatchEvent(new Event("mousedown"))
        }
        if ("ArrowDown" === e || "ArrowUp" === e) {
            const d = Array.from(this.srcElement.querySelectorAll(".treeselect-list__item-checkbox")).filter(e=>"none" !== window.getComputedStyle(getListItemByCheckbox(e)).display);
            if (d.length)
                if (t) {
                    s = d.findIndex(e=>getListItemByCheckbox(e).classList.contains("treeselect-list__item--focused"));
                    const n = getListItemByCheckbox(d[s]);
                    n.classList.remove("treeselect-list__item--focused");
                    var s = "ArrowDown" === e ? s + 1 : s - 1
                        , i = "ArrowDown" === e ? 0 : d.length - 1
                        , i = d[s] ?? d[i]
                        , s = !d[s];
                    const a = getListItemByCheckbox(i);
                    a.classList.add("treeselect-list__item--focused");
                    var i = this.srcElement.getBoundingClientRect()
                        , l = a.getBoundingClientRect();
                    s && "ArrowDown" === e ? this.srcElement.scroll(0, 0) : s && "ArrowUp" === e ? this.srcElement.scroll(0, this.srcElement.scrollHeight) : i.y + i.height < l.y + l.height ? this.srcElement.scroll(0, this.srcElement.scrollTop + l.height) : i.y > l.y && this.srcElement.scroll(0, this.srcElement.scrollTop - l.height)
                } else {
                    const h = getListItemByCheckbox(d[0]);
                    h.classList.add("treeselect-list__item--focused")
                }
        }
    }
    focusFirstListElement() {
        var e = "treeselect-list__item--focused";
        const t = this.srcElement.querySelector("." + e);
        var s = Array.from(this.srcElement.querySelectorAll(".treeselect-list__item-checkbox")).filter(e=>"none" !== window.getComputedStyle(getListItemByCheckbox(e)).display);
        if (s.length) {
            t && t.classList.remove(e);
            const i = getListItemByCheckbox(s[0]);
            i.classList.add(e)
        }
    }
    #createList() {
        const e = []
            , t = document.createElement("div");
        t.classList.add("treeselect-list");
        var s = this.#getListHTML(this.options);
        if (e.push(...s),
            this.listSlotHtmlComponent) {
            const i = document.createElement("div");
            i.classList.add("treeselect-list__slot"),
                i.appendChild(this.listSlotHtmlComponent),
                e.push(i)
        }
        s = this.#createEmptyList();
        return e.push(s),
            t.addEventListener("mouseout", e=>{
                    e.stopPropagation(),
                    this.#lastFocusedItem && this.#isMouseActionsAvailable && this.#lastFocusedItem.classList.add("treeselect-list__item--focused")
                }
            ),
            t.addEventListener("mousemove", ()=>{
                    this.#isMouseActionsAvailable = !0
                }
            ),
            t.append(...e),
            t
    }
    #getListHTML(e) {
        return e.reduce((e,t)=>{
                if (t.children?.length) {
                    const i = this.#createGroupContainer(t);
                    var s = this.#getListHTML(t.children);
                    return i.append(...s),
                        e.push(i),
                        e
                }
                s = this.#createGroupItem(t, !1);
                return e.push(s),
                    e
            }
            , [])
    }
    #createGroupContainer(e) {
        const t = document.createElement("div");
        t.setAttribute("group-container-id", e.value),
            t.classList.add("treeselect-list__group-container");
        e = this.#createGroupItem(e, !0);
        return t.appendChild(e),
            t
    }
    #createGroupItem(s, e) {
        const t = document.createElement("div");
        t.setAttribute("tabindex", "-1"),
            t.setAttribute("title", s.name),
            t.classList.add("treeselect-list__item"),
        e && (e = this.#createArrow(),
            t.appendChild(e)),
            t.addEventListener("mouseover", ()=>{
                    this.#isMouseActionsAvailable && this.#groupMouseAction(!0, t)
                }
                , !0),
            t.addEventListener("mouseout", ()=>{
                    this.#isMouseActionsAvailable && (this.#groupMouseAction(!1, t),
                        this.#lastFocusedItem = t)
                }
                , !0),
            t.addEventListener("mousedown", e=>{
                    e.stopPropagation();
                    const t = e.target.querySelector(".treeselect-list__item-checkbox");
                    t.checked = !t.checked,
                        this.#checkboxClickEvent(t, s)
                }
            );
        var e = this.#createCheckbox(s)
            , i = this.#createCheckboxLabel(s);
        return t.append(e, i),
            t
    }
    #createArrow() {
        const e = document.createElement("span");
        return e.setAttribute("tabindex", "-1"),
            e.classList.add("treeselect-list__item-icon"),
            e.innerHTML = svg.arrowDown,
            e.addEventListener("mousedown", e=>{
                    e.stopPropagation(),
                        this.#arrowClickEvent(e)
                }
            ),
            e
    }
    #createCheckbox(e) {
        const t = document.createElement("div")
            , s = (t.classList.add("treeselect-list__item-checkbox-container"),
            document.createElement("span"))
            , i = (s.classList.add("treeselect-list__item-checkbox-icon"),
            s.innerHTML = "",
            document.createElement("input"));
        return i.setAttribute("tabindex", "-1"),
            i.setAttribute("type", "checkbox"),
            i.setAttribute("input-id", e.value),
            i.classList.add("treeselect-list__item-checkbox"),
            t.append(s, i),
            t
    }
    #createCheckboxLabel(e) {
        const t = document.createElement("label");
        return t.innerHTML = e.name,
            t.classList.add("treeselect-list__item-label"),
            t
    }
    #createEmptyList() {
        const e = document.createElement("div")
            , t = (e.classList.add("treeselect-list__empty"),
            e.setAttribute("title", this.emptyText),
            document.createElement("span"))
            , s = (t.classList.add("treeselect-list__empty-icon"),
            t.innerHTML = svg.attention,
            document.createElement("span"));
        return s.classList.add("treeselect-list__empty-text"),
            s.innerHTML = this.emptyText,
            e.append(t, s),
            e
    }
    #checkboxClickEvent(e, t) {
        const s = this.flattedOptions.find(e=>e.id === t.value);
        s.checked = e.checked,
            s.isPartialChecked = !1,
            checkInput(s, this.flattedOptions),
            updateDOM(this.flattedOptions, this.srcElement),
            this.#emitInput()
    }
    #arrowClickEvent(e) {
        const t = e.target.parentNode.querySelector("[input-id]")
            , s = t.getAttribute("input-id")
            , i = this.flattedOptions.find(e=>e.id === s);
        i.isClosed = !i.isClosed,
            hideShowChildren(this.flattedOptions, i),
            updateDOM(this.flattedOptions, this.srcElement),
            this.#emitArrrowClick()
    }
    #groupMouseAction(e, t) {
        const s = "treeselect-list__item--focused";
        if (e) {
            const i = Array.from(this.srcElement.querySelectorAll("." + s));
            i.length && i.forEach(e=>e.classList.remove(s)),
                t.classList.add(s)
        } else
            t.classList.remove(s)
    }
    #updateSelectedNodes() {
        this.selectedNodes = {
            ids: getCheckedValues(this.flattedOptions),
            groupedIds: getGroupedValues(this.flattedOptions)
        }
    }
    #emitArrrowClick() {
        this.srcElement.dispatchEvent(new CustomEvent("arrow-click"))
    }
    #emitInput() {
        this.#updateSelectedNodes(),
            this.srcElement.dispatchEvent(new CustomEvent("input",{
                detail: this.selectedNodes
            }))
    }
}
class Treeselect {
  #htmlContainer = null;
  #treeselectList = null;
  #treeselectInput = null;
  #transform = {
    top: null,
    bottom: null
  };
  #treeselectInitPosition = null;
  #containerResizer = null;
  #containerWidth = 0;
  #scrollEvent = null;
  #focusEvent = null;
  #blurEvent = null;
  constructor({parentHtmlContainer: e, value: t, options: s, openLevel: i, appendToBody: n, alwaysOpen: l, showTags: r, clearable: o, searchable: c, placeholder: a, grouped: d, listSlotHtmlComponent: h, disabled: u, emptyText: p}) {
    this.parentHtmlContainer = e,
        this.value = t ?? [],
        this.options = s ?? [],
        this.openLevel = i ?? 0,
        this.appendToBody = n ?? !0,
        this.alwaysOpen = l && !u,
        this.showTags = r ?? !0,
        this.clearable = o ?? !0,
        this.searchable = c ?? !0,
        this.placeholder = a ?? "Search...",
        this.grouped = d ?? !0,
        this.listSlotHtmlComponent = h ?? null,
        this.disabled = u ?? !1,
        this.emptyText = p ?? "No results found...",
        this.srcElement = null,
        this.mount()
  }
  mount() {
    this.srcElement && (this.#closeList(),
        this.srcElement.innerHTML = "",
        this.srcElement = null,
        this.#removeOutsideListeners()),
        this.srcElement = this.#createTreeselect(),
        this.#scrollEvent = this.scrollWindowHandler.bind(this),
        this.#focusEvent = this.focusWindowHandler.bind(this),
        this.#blurEvent = this.blurWindowHandler.bind(this),
    this.alwaysOpen && this.#treeselectInput.openClose(),
    this.disabled && this.srcElement.classList.add("treeselect--disabled")
  }
  updateValue(e) {
    const t = this.#treeselectList;
    t.updateValue(e);
    var {groupedIds: e, ids: s} = t.selectedNodes
        , e = this.grouped ? e : s;
    this.#treeselectInput.updateValue(e)
  }
  destroy() {
    this.srcElement && (this.#closeList(),
        this.srcElement.innerHTML = "",
        this.srcElement = null,
        this.#removeOutsideListeners())
  }
  #createTreeselect() {
    const t = this.parentHtmlContainer
        , s = (t.classList.add("treeselect"),
        new TreeselectList({
          options: this.options,
          value: this.value,
          openLevel: this.openLevel,
          listSlotHtmlComponent: this.listSlotHtmlComponent,
          emptyText: this.emptyText
        }));
    var {groupedIds: e, ids: i} = s.selectedNodes;
    const n = new TreeselectInput({
      value: this.grouped ? e : i,
      showTags: this.showTags,
      clearable: this.clearable,
      isAlwaysOpened: this.alwaysOpen,
      searchable: this.searchable,
      placeholder: this.placeholder,
      disabled: this.disabled
    });
    return this.appendToBody && (this.#containerResizer = new ResizeObserver(()=>{
          var e = this.srcElement.getBoundingClientRect()["width"];
          this.#containerWidth = e,
              this.updateListPosition(t, s.srcElement, !0)
        }
    )),
        n.srcElement.addEventListener("input", e=>{
              e = e.detail.map(({id: e})=>e);
              this.value = e,
                  s.updateValue(e),
                  this.#emitInput()
            }
        ),
        n.srcElement.addEventListener("open", ()=>this.#openList()),
        n.srcElement.addEventListener("keydown", e=>s.callKeyAction(e.key)),
        n.srcElement.addEventListener("search", e=>{
              s.updateSearchValue(e.detail),
                  this.updateListPosition(t, s.srcElement, !0)
            }
        ),
        n.srcElement.addEventListener("focus", ()=>{
              this.#updateFocusClasses(!0),
                  document.addEventListener("mousedown", this.#focusEvent, !0),
                  document.addEventListener("focus", this.#focusEvent, !0),
                  window.addEventListener("blur", this.#blurEvent)
            }
            , !0),
    this.alwaysOpen || n.srcElement.addEventListener("close", ()=>{
          this.#closeList()
        }
    ),
        s.srcElement.addEventListener("mouseup", ()=>{
              n.focus()
            }
            , !0),
        s.srcElement.addEventListener("input", e=>{
              const {groupedIds: t, ids: s} = e.detail;
              e = this.grouped ? t : s;
              n.updateValue(e),
                  this.value = s.map(({id: e})=>e),
                  n.focus(),
                  this.#emitInput()
            }
        ),
        s.srcElement.addEventListener("arrow-click", ()=>{
              n.focus(),
                  this.updateListPosition(t, s.srcElement, !0)
            }
        ),
        this.#htmlContainer = t,
        this.#treeselectList = s,
        this.#treeselectInput = n,
        t.append(n.srcElement),
        t
  }
  #openList() {
    window.addEventListener("scroll", this.#scrollEvent, !0),
        this.appendToBody ? (document.body.appendChild(this.#treeselectList.srcElement),
            this.#containerResizer.observe(this.#htmlContainer)) : this.#htmlContainer.appendChild(this.#treeselectList.srcElement),
        this.updateListPosition(this.#htmlContainer, this.#treeselectList.srcElement, !1),
        this.#updateOpenCloseClasses(!0),
        this.#treeselectList.focusFirstListElement()
  }
  #closeList() {
    window.removeEventListener("scroll", this.#scrollEvent, !0),
    (this.appendToBody ? document.body : this.#htmlContainer).contains(this.#treeselectList.srcElement) && (this.appendToBody ? (document.body.removeChild(this.#treeselectList.srcElement),
        this.#containerResizer?.disconnect()) : this.#htmlContainer.removeChild(this.#treeselectList.srcElement),
        this.#updateOpenCloseClasses(!1))
  }
  #updateDirectionClasses(e, t) {
    var s = t ? "treeselect-list--top-to-body" : "treeselect-list--top"
        , t = t ? "treeselect-list--bottom-to-body" : "treeselect-list--bottom";
    e ? (this.#treeselectList.srcElement.classList.add(s),
        this.#treeselectList.srcElement.classList.remove(t),
        this.#treeselectInput.srcElement.classList.add("treeselect-input--top"),
        this.#treeselectInput.srcElement.classList.remove("treeselect-input--bottom")) : (this.#treeselectList.srcElement.classList.remove(s),
        this.#treeselectList.srcElement.classList.add(t),
        this.#treeselectInput.srcElement.classList.remove("treeselect-input--top"),
        this.#treeselectInput.srcElement.classList.add("treeselect-input--bottom"))
  }
  #updateFocusClasses(e) {
    e ? (this.#treeselectInput.srcElement.classList.add("treeselect-input--focused"),
        this.#treeselectList.srcElement.classList.add("treeselect-list--focused")) : (this.#treeselectInput.srcElement.classList.remove("treeselect-input--focused"),
        this.#treeselectList.srcElement.classList.remove("treeselect-list--focused"))
  }
  #updateOpenCloseClasses(e) {
    e ? this.#treeselectInput.srcElement.classList.add("treeselect-input--opened") : this.#treeselectInput.srcElement.classList.remove("treeselect-input--opened")
  }
  #removeOutsideListeners() {
    window.removeEventListener("scroll", this.#scrollEvent, !0),
        document.removeEventListener("click", this.#focusEvent, !0),
        document.removeEventListener("focus", this.#focusEvent, !0),
        window.removeEventListener("blur", this.#blurEvent)
  }
  scrollWindowHandler() {
    this.updateListPosition(this.#htmlContainer, this.#treeselectList.srcElement, !0)
  }
  focusWindowHandler(e) {
    this.#htmlContainer.contains(e.target) || this.#treeselectList.srcElement.contains(e.target) || (this.#treeselectInput.blur(),
        this.#removeOutsideListeners(),
        this.#updateFocusClasses(!1))
  }
  blurWindowHandler() {
    this.#treeselectInput.blur(),
        this.#removeOutsideListeners(),
        this.#updateFocusClasses(!1)
  }
  updateListPosition(e, t, s) {
    var i = e.getBoundingClientRect().y
        , n = window.innerHeight - e.getBoundingClientRect().y
        , l = t.clientHeight
        , n = n < i && window.innerHeight - i < l + 45
        , i = n ? "top" : "buttom"
        , r = t.getAttribute("direction");
    if (this.#htmlContainer.setAttribute("direction", i),
        !this.appendToBody)
      return r === i ? void 0 : void this.#updateDirectionClasses(n, !1);
    if (!this.#treeselectInitPosition || s) {
      t.style.transform = null;
      const {x: d, y: o} = t.getBoundingClientRect()
          , {x: c, y: a} = e.getBoundingClientRect();
      this.#treeselectInitPosition = {
        containerX: c,
        containerY: a,
        listX: d,
        listY: o
      }
    }
    const {listY: o, containerX: c, containerY: a} = this.#treeselectInitPosition;
    i = e.clientHeight;
    r && !s || (this.#transform.top = `translateY(${a - o - l}px)`,
        this.#transform.bottom = `translateY(${a + i - o}px)`),
        t.style.transform = n ? this.#transform.top : this.#transform.bottom,
        this.#updateDirectionClasses(n, !0),
        t.style.width = this.#containerWidth + "px",
        t.style.left = c + "px"
  }
  #emitInput() {
    this.srcElement.dispatchEvent(new CustomEvent("input",{
      detail: this.value
    }))
  }
}
export default Treeselect;