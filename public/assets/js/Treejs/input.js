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
export default TreeselectInput;
