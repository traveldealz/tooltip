import { place } from 'placement.js';

const template = document.createElement("template");
template.innerHTML = /*html*/`
  <style>
    :host {
      z-index: 20;
      background-color: black;
      color: #fff;
      font-size: .8rem;
      padding: 5px 20px;
      border-radius: 6px;
      margin: .5rem;
      word-break: break-word;
    }
    p {
      max-width: 320px;
    }
  </style>
  <p><slot></slot></p>`;

export default class Tooltip extends HTMLElement {
  constructor() {
    super();
    this._show = this._show.bind(this);
    this._hide = this._hide.bind(this);
    this._toggle = this._toggle.bind(this);
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'tooltip');
    }
      

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', -1);
    }

    this.$placement = this.hasAttribute('placement') ? this.getAttribute('placement') : 'right';

    this.$onClick = ! this.hasAttribute('on-click') ? true : 'true' === this.getAttribute('on-click') ? true : false;

    this._hide();

    this.$target = document.querySelector('[aria-describedby=' + this.id + ']');
    if (!this.$target) {
      return;
    }

    this.$target.addEventListener('focus', this._show);
    this.$target.addEventListener('blur', this._hide);
    this.$target.addEventListener('mouseenter', this._show);
    this.$target.addEventListener('mouseleave', this._hide);
    if(this.$onClick) {
      this.$target.addEventListener('click', this._toggle);
    }
      
  }

  disconnectedCallback() {
    if (!this.$target) {
      return;
    }

    this.$target.removeEventListener('focus', this._show);
    this.$target.removeEventListener('blur', this._hide);
    this.$target.removeEventListener('mouseenter', this._show);
    this.$target.removeEventListener('mouseleave', this._hide);
    if(this.$onClick) {
      this.$target.removeEventListener('click', this._toggle);
    }
    this.$target = null;
  }

  _show() {
    this.hidden = false;
    place(this.$target, this, { placement: this.$placement } );
  }

  _hide() {
    this.hidden = true;
  }

  _toggle() {
    if( this.hidden ) {
      this._show();
    } else {
      this._hide();
    }
  }

}
