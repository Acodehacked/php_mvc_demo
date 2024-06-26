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
export default TreeselectList;
