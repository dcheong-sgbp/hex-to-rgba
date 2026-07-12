/**
 * <hex-rgba> — convert a hex colour to RGB / RGBA, with a live swatch. Zero dependencies.
 * Built & maintained by SGBP — Singapore Build Partners (https://sgbp.tech). MIT.
 */
class HexRgba extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }); this.alpha = 100; }
  connectedCallback() { this.render(); }
  _parse(v) {
    let h = v.trim().replace(/^#/, "");
    if (/^[0-9a-fA-F]{3}$/.test(h)) h = h.split("").map((c) => c + c).join("");
    if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), hex: "#" + h.toLowerCase() };
  }
  _convert() {
    const $ = (s) => this.shadowRoot.querySelector(s);
    const c = this._parse($("#in").value); const out = $("#out");
    if (!c) { out.style.display = "none"; $("#sw").style.background = "transparent"; return; }
    const a = (this.alpha / 100);
    out.style.display = "block";
    $("#rgb").textContent = `rgb(${c.r}, ${c.g}, ${c.b})`;
    $("#rgba").textContent = `rgba(${c.r}, ${c.g}, ${c.b}, ${a.toFixed(2)})`;
    $("#sw").style.background = `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;
  }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        *,*::before,*::after{box-sizing:border-box}
        :host{display:block;width:100%;max-width:480px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
        .card{border:1px solid #e2e2e2;border-radius:12px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.06);padding:16px}
        label{display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:600;color:#555;margin-bottom:6px}
        .mini{font:inherit;font-size:11px;font-weight:700;color:#EB0028;background:none;border:0;cursor:pointer}
        .top{display:flex;gap:12px;align-items:flex-end}
        .grow{flex:1;min-width:0}
        input[type=text]{width:100%;padding:10px 12px;border:1px solid #ccc;border-radius:8px;font-family:ui-monospace,Menlo,monospace;font-size:16px}
        .sw{width:54px;height:46px;border-radius:8px;border:1px solid #ddd;background-image:linear-gradient(45deg,#eee 25%,transparent 25%),linear-gradient(-45deg,#eee 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#eee 75%),linear-gradient(-45deg,transparent 75%,#eee 75%);background-size:12px 12px;background-position:0 0,0 6px,6px -6px,-6px 0;flex:0 0 auto;position:relative;overflow:hidden}
        .sw span{position:absolute;inset:0}
        .ctrl{display:flex;align-items:center;gap:10px;margin:14px 0 4px}
        .ctrl label{margin:0;font-size:12px;font-weight:600;color:#555;width:64px}
        input[type=range]{flex:1;accent-color:#EB0028}
        .ctrl output{font-size:12px;font-family:ui-monospace,monospace;width:34px;text-align:right}
        .out{display:none;margin-top:6px}
        .line{display:flex;align-items:center;gap:8px;margin:8px 0}
        .val{flex:1;min-width:0;background:#1a1a1a;color:#f4f4f4;border-radius:8px;padding:9px 12px;font-family:ui-monospace,monospace;font-size:13px;overflow-x:auto;white-space:nowrap}
        .c{font:inherit;font-size:11px;font-weight:700;color:#fff;background:#EB0028;border:0;border-radius:7px;padding:8px 11px;cursor:pointer;flex:0 0 auto}
      </style>
      <div class="card">
        <label>Hex colour <button class="mini" id="clear">Clear</button></label>
        <div class="top">
          <div class="grow"><input id="in" type="text" placeholder="#EB0028 or #fff" spellcheck="false"></div>
          <div class="sw" id="swwrap"><span id="sw"></span></div>
        </div>
        <div class="ctrl"><label>Alpha</label><input type="range" id="alpha" min="0" max="100" value="${this.alpha}"><output id="oa">${this.alpha}%</output></div>
        <div class="out" id="out">
          <div class="line"><span class="val" id="rgb"></span><button class="c" data-t="rgb">Copy</button></div>
          <div class="line"><span class="val" id="rgba"></span><button class="c" data-t="rgba">Copy</button></div>
        </div>
      </div>`;
    const $ = (s) => this.shadowRoot.querySelector(s);
    $("#in").addEventListener("input", () => this._convert());
    $("#alpha").addEventListener("input", (e) => { this.alpha = +e.target.value; $("#oa").textContent = e.target.value + "%"; this._convert(); });
    $("#clear").addEventListener("click", () => { $("#in").value = ""; this._convert(); $("#in").focus(); });
    this.shadowRoot.querySelectorAll(".c").forEach((btn) => btn.addEventListener("click", () => {
      const txt = $("#" + btn.dataset.t).textContent; navigator.clipboard && navigator.clipboard.writeText(txt);
      const o = btn.textContent; btn.textContent = "Copied"; setTimeout(() => btn.textContent = o, 900);
    }));
  }
}
if (!customElements.get("hex-rgba")) customElements.define("hex-rgba", HexRgba);
