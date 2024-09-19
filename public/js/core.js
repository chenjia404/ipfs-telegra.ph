var T = {"apiUrl":"https:\/\/edit.telegra.ph","datetime":0,"pageId":0};

let ua = navigator.userAgent.toLowerCase();
let browser = {
  opera: (/opera/i.test(ua) || /opr/i.test(ua)),
  msie: (/msie/i.test(ua) && !/opera/i.test(ua) || /trident\//i.test(ua)) || /edge/i.test(ua),
  msie_edge: (/edge/i.test(ua) && !/opera/i.test(ua)),
  mozilla: /firefox/i.test(ua),
  chrome: /chrome/i.test(ua) && !/edge/i.test(ua),
  safari: (!(/chrome/i.test(ua)) && /webkit|safari|khtml/i.test(ua)),
  iphone: /iphone/i.test(ua),
  ipod: /ipod/i.test(ua),
  ipad: /ipad/i.test(ua),
  android: /android/i.test(ua),
  mobile: /iphone|ipod|ipad|opera mini|opera mobi|iemobile|android/i.test(ua),
  safari_mobile: /iphone|ipod|ipad/i.test(ua),
  opera_mobile: /opera mini|opera mobi/i.test(ua),
  opera_mini: /opera mini/i.test(ua),
  mac: /mac/i.test(ua),
};

let Inline     = Quill.import('blots/inline');
let Block      = Quill.import('blots/block');
let BlockEmbed = Quill.import('blots/block/embed');
let Embed      = Quill.import('blots/embed');
let TextBlot   = Quill.import('blots/text');
let CodeBlock  = Quill.import('formats/code-block');
let ListItem   = Quill.import('formats/list/item');

let Parchment  = Quill.import('parchment');
let Delta      = Quill.import('delta');
let Keyboard   = Quill.import('modules/keyboard');

var gateways = ['https://ipfs.blockframe.io','https://ipfs.crossbell.io','https://4everland.io','https://polygon.stampsdaq.com','https://ipfs.supremelegend.io','https://ipfs.decentralized-content.com','https://gateway.pinata.cloud','https://eth.sucks','https://hardbin.com','https://gw.ipfs-lens.dev','https://gateway.v2ex.pro','https://gateway.tar.tn'];
function seeding(res){
    for(var i0 = 0; i0 < gateways.length; i0++)
    {
        let img = new Image;
        img.src =  gateways[i0]+ '/ipfs/'+res.Hash  + "?filename=" + encodeURI(res.Name);
    }
}

class LinkBlot extends Inline {
  static create(value) {
    let domNode = super.create(value);
    value = this.sanitize(value);
    domNode.setAttribute('href', value);
    var ch = value.substr(0, 1);
    if (ch != '/' && ch != '#' && value.substr(0, 7) != 'mailto:') {
      domNode.setAttribute('target', '_blank');
    }
    return domNode;
  }
  static formats(domNode) {
    return domNode.getAttribute('href');
  }

  static sanitize(url) {
    return sanitize(url, ['http', 'https', 'mailto']) ? relativeUrl(url) : 'about:blank';
  }

  constructor(domNode, value) {
    super(domNode);
    $(domNode).on('mouseover', () => {
      showLinkTooltip(this, value);
    });
    $(domNode).on('mouseout', function() {
      hideLinkTooltip();
    });
  }

  detach() {
    $(this.domNode).off('mouseover mouseout');
    super.detach();
    hideLinkTooltip();
  }

  format(name, value) {
    if (name !== this.statics.blotName || !value) {
      return super.format(name, value);
    }
    value = this.constructor.sanitize(value);
    this.domNode.setAttribute('href', value);
    this.domNode.setAttribute('data-title', value);
  }
}
LinkBlot.blotName = 'link';
LinkBlot.tagName = 'a';
Quill.register(LinkBlot);

class BreakBlot extends Embed { }
BreakBlot.blotName = 'textBreak';
BreakBlot.tagName = 'br';
BreakBlot.className = 'inline';
Quill.register(BreakBlot);

class SingleLineBlot extends Block {
  replace(target) {
    target.children.forEach((blot) => {
      if (blot instanceof BreakBlot) {
        blot.replaceWith(Parchment.create('text', ' '));
      }
    })
    super.replace(target);
  }
  insertAt(index, text, value) {
    if (typeof value !== 'undefined' && text == 'textBreak') {
      super.insertAt(index, '\n');
    } else {
      super.insertAt(index, text, value);
    }
  }
}

class FieldBlot extends SingleLineBlot { }

class TitleBlot extends FieldBlot {
  static create(value) {
    let domNode = super.create(value);
    domNode.setAttribute('data-placeholder', 'Title');
    domNode.setAttribute('data-label', 'Title');
    return domNode;
  }
  formatAt(index, length, name, value) {
    if (name === this.constructor.blotName) {
      super.formatAt(index, length, name, value);
    }
  }
}
TitleBlot.blotName = 'blockTitle';
TitleBlot.tagName = 'h1';
Quill.register(TitleBlot);

class AuthorBlot extends FieldBlot {
  static create(value) {
    let domNode = super.create(value);
    domNode.setAttribute('data-placeholder', 'Your name');
    domNode.setAttribute('data-label', 'Author');
    return domNode;
  }
  formatAt(index, length, name, value) {
    if (name === this.constructor.blotName) {
      super.formatAt(index, length, name, value);
    } else if (name === 'link') {
      super.formatAt(0, this.length(), name, value);
    }
  }
}
AuthorBlot.blotName = 'blockAuthor';
AuthorBlot.tagName = 'address';
Quill.register(AuthorBlot);

class HeaderBlot extends SingleLineBlot {
  optimize() {
    super.optimize();
    let anchor = $(this.domNode).text();
    anchor = anchor.replace(/[\s_]+/g, '-');
    anchor = anchor.replace(/(^-+|-+$)/g, '');
    this.domNode.setAttribute('id', anchor);
  }
  formatAt(index, length, name, value) {
    if ((name !== 'bold' && name !== 'italic' && name !== 'code') || !value) {
      super.formatAt(index, length, name, value);
    }
  }
}
HeaderBlot.blotName = 'blockHeader';
HeaderBlot.tagName = 'h3';
Quill.register(HeaderBlot);

class SubheaderBlot extends HeaderBlot { }
SubheaderBlot.blotName = 'blockSubheader';
SubheaderBlot.tagName = 'h4';
Quill.register(SubheaderBlot);

class BlockquoteBlot extends Block { }
BlockquoteBlot.blotName = 'blockBlockquote';
BlockquoteBlot.tagName = 'blockquote';
Quill.register(BlockquoteBlot);

class PullquoteBlot extends Block { }
PullquoteBlot.blotName = 'blockPullquote';
PullquoteBlot.tagName = 'aside';
Quill.register(PullquoteBlot);

class CodeBlot extends CodeBlock {
  replace(target) {
    target.children.forEach((blot) => {
      if (blot instanceof BreakBlot) {
        blot.replaceWith(Parchment.create('text', '\n'));
      }
    });
    super.replace(target);
  }
}
CodeBlot.blotName = 'code-block';
Quill.register(CodeBlot);

class DividerBlot extends BlockEmbed { }
DividerBlot.blotName = 'blockDivider';
DividerBlot.tagName = 'hr';
Quill.register(DividerBlot);

class FigureBlot extends BlockEmbed {
  static create(value) {
    let domNode = super.create(value);
    domNode.setAttribute('contenteditable', 'false');
    return domNode;
  }

  constructor(domNode, value) {
    super(domNode);
    this.domWrapper = document.createElement('div');
    this.domCursor  = document.createElement('span');
    this.domCaption = document.createElement('figcaption');

    this.domWrapper.classList.add('figure_wrapper');

    this.domCursor.classList.add('cursor_wrapper');
    this.domCursor.setAttribute('contenteditable', 'true');

    this.domCaption.classList.add('editable_text');
    if (value.caption) {
      this.domCaption.innerText = value.caption;
    }

    this.domNode.appendChild(this.domWrapper);
    this.domNode.appendChild(this.domCursor);
    this.domNode.appendChild(this.domCaption);
    setTimeout(() => {
      updateEditableText(this.domNode);
    }, 1);

    let upload_data = false;
    if (value.image) {
      this.appendImgNode(value.image);
      upload_data = this.uploadData(value.image);
    } else if (value.video) {
      this.appendVideoNode(value.video);
      upload_data = this.uploadData(value.video);
    } else if (value.embed) {
      this.appendIframeNode(value.embed);
    }
    if (upload_data) {
      this.domProgress = document.createElement('div');
      this.domProgressBar = document.createElement('div');

      this.domProgress.classList.add('file_progress');
      this.domProgressBar.classList.add('file_progress_bar');
      this.domWrapper.classList.add('loading');

      this.domProgress.appendChild(this.domProgressBar);
      this.domWrapper.appendChild(this.domProgress);

      this.uploadFile(upload_data);
    }

    $(this.domWrapper).click(() => {
      if (!this.domNode.classList.contains('focus')) {
        let index = this.offset(quill.scroll);
        quill.focus();
        quill.setSelection(index, 0, Quill.sources.USER);
      }
    });
    $(this.domCursor).keydown((e) => {
      let key = e.which || e.keyCode;
      if (key == Keyboard.keys.BACKSPACE) {
        let offset = this.offset(quill.scroll);
        quill.deleteText(offset, this.length(), Quill.sources.USER);
        quill.setSelection(offset - 1, 0, Quill.sources.USER);
        e.preventDefault();
      } else if (key == Keyboard.keys.ENTER) {
        let index = this.offset(quill.scroll) + this.length();
        quill.focus();
        quill.insertText(index, '\n', Quill.sources.USER);
        quill.setSelection(index, 0, Quill.sources.USER);
        e.preventDefault();
      }
    });
    $(this.domCursor).on('paste', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
    $(this.domCaption).keydown((e) => {
      let key = e.which || e.keyCode;
      let $target = $(e.target);
      if (key == Keyboard.keys.ENTER) {
        if (e.shiftKey) { return; }
        let pos = $target.selection('getPos');
        let value = $target.val();
        if (pos.start != pos.end) {
          value = value.substr(0, pos.start) + value.substr(pos.end);
          $target.val(value).selection('setPos', {start: value.length, end: value.length});
        } else if (pos.end == value.length) {
          let index = this.offset(quill.scroll) + this.length();
          quill.focus();
          quill.insertText(index, '\n', Quill.sources.USER);
          quill.setSelection(index, 0, Quill.sources.USER);
        }
        e.preventDefault();
      } else if (key == Keyboard.keys.DOWN || key == Keyboard.keys.TAB || key == Keyboard.keys.RIGHT) {
        let pos = $target.selection('getPos');
        let value = $target.val();
        if (pos.start == pos.end && pos.end == value.length) {
          let index = this.offset(quill.scroll) + this.length();
          quill.focus();
          quill.setSelection(index, 0, Quill.sources.USER);
          e.preventDefault();
        }
      } else if (key == Keyboard.keys.LEFT || key == Keyboard.keys.UP) {
        let pos = $target.selection('getPos');
        if (pos.start == pos.end && pos.start === 0) {
          let index = this.offset(quill.scroll) - 1;
          quill.focus();
          quill.setSelection(index, 0, Quill.sources.USER);
          e.preventDefault();
        }
      }
    });
    $(this.domCaption).on('paste', (e) => {
      e.stopPropagation();
    });
    $(this.domCaption).on('keyup drop change input textInput paste cut', (e) => {
      $(this.domCaption).toggleClass('empty', !e.target.value);
      autosize.update(e.target);
      draftSave();
    });
    $(this.domCaption).click((e) => {
      e.target.focus();
    });
  }

  appendImgNode(src) {
    let image = document.createElement('img');
    image.loading="lazy"
    image.setAttribute('src', this.sanitize(src));
    this.domWrapper.appendChild(image);
    return image;
  }

  appendVideoNode(src) {
    let video = document.createElement('video');
    video.setAttribute('src',      this.sanitize(src));
    video.setAttribute('preload',  'auto');
    video.setAttribute('controls', 'controls');
    video.addEventListener('loadeddata', function() {
      if (!this.mozHasAudio &&
          !(this.webkitAudioDecodedByteCount) &&
          !(this.audioTracks && this.audioTracks.length)) {
        this.setAttribute('autoplay', 'autoplay');
        this.setAttribute('loop',     'loop');
        this.setAttribute('muted',    'muted');
        this.removeAttribute('controls');
        this.play();
      }
    });
    this.domWrapper.appendChild(video);
    return video;
  }

  appendIframeNode(src) {
    let iframe_wrap   = document.createElement('div');
    let iframe_helper = document.createElement('div');
    let iframe        = document.createElement('iframe');
    iframe_wrap.classList.add('iframe_wrap');
    iframe_wrap.appendChild(iframe_helper);
    iframe_helper.classList.add('iframe_helper');
    iframe_helper.style.paddingTop = '56.25%';
    iframe_helper.appendChild(iframe);
    iframe.setAttribute('src',               this.sanitize(src));
    iframe.setAttribute('width',             '640');
    iframe.setAttribute('height',            '360');
    iframe.setAttribute('frameborder',       '0');
    iframe.setAttribute('allowtransparency', 'true');
    iframe.setAttribute('allowfullscreen',   'true');
    iframe.setAttribute('scrolling',         'no');
    this.domWrapper.appendChild(iframe_wrap);
    return iframe_wrap;
  }

  uploadFile(file_data) {
    uploadFile(file_data, (loaded, total) => {
      let persent = 0;
      if (total && loaded) {
        persent = (loaded * 100 / total);
        persent = Math.min(100, persent);
      }
      this.domProgressBar.style.width = persent + '%';
    }, (data) => {
      if (data) {
        let src = this.sanitize(data.src);
        if (file_data.type.substr(0, 6) == 'video/') {
          let video = this.domWrapper.querySelector('video');
          video.setAttribute('src', src);
        } else {
          let image = this.domWrapper.querySelector('img');
          image.setAttribute('src', src);
        }
        this.domWrapper.classList.remove('loading');
        draftSave();
      }
    }, (error) => {
      quill.deleteText(this.offset(quill.scroll), this.length(), Quill.sources.SILENT);
      return showError(error);
    });
  }

  uploadData(url) {
    let match = null;
    if (match = url.match(/^data:(image\/gif|image\/jpe?g|image\/png|video\/mp4);base64,(.*)$/)) {
      return {type: match[1], base64_data: match[2]};
    }
    return false;
  }

  sanitize(url) {
    return sanitize(url, ['http', 'https', 'data']) ? url : '//:0';
  }

  static value(domNode) {
    let value = {
      caption: ''
    };
    let image = domNode.querySelector('img');
    if (image) {
      value.image = image.src;
    }
    let video = domNode.querySelector('video');
    if (video) {
      value.video = video.src;
    }
    let iframe = domNode.querySelector('iframe');
    if (iframe) {
      value.embed = iframe.src;
    }
    let figcaption = domNode.querySelector('figcaption');
    if (figcaption) {
      let caption_field = figcaption.querySelector('.editable_input');
      if (caption_field) {
        value.caption = caption_field.value;
      } else {
        value.caption = figcaption.innerText;
      }
    }
    return value;
  }

  focus() {
    this.domNode.classList.add('focus');
  }

  blur() {
    this.domNode.classList.remove('focus');
  }

  _index(node, offset) {
    if (node === this.domCaption) {
      return 0;
    }
    let index = 0;
    if (node.nodeType == node.TEXT_NODE) {
      index += offset >= 0 ? offset : node.data.length;
    }
    if (node.previousSibling) {
      return index + this._index(node.previousSibling, -1);
    }
    if (node.parentNode) {
      return index + this._index(node.parentNode, -1);
    }
    return 0;
  }

  _position(ancestor, index) {
    if (ancestor.nodeType == ancestor.TEXT_NODE) {
      if (index <= ancestor.data.length) {
        return [ancestor, index];
      } else {
        index -= ancestor.data.length;
        return [null, index];
      }
    } else {
      let child = ancestor.firstChild;
      while (child) {
        let node = null;
        [node, index] = this._position(child, index);
        if (node) {
          return [node, index];
        } else {
          child = child.nextSibling;
        }
      }
      return [ancestor, index];
    }
  }

  update(mutations) {
    this.domCursor.innerHTML = '';
  }
  index(node, offset) {
    return 0;
  }
  position(index, inclusive) {
    return [this.domCursor, 0];
  }
}
FigureBlot.blotName = 'blockFigure';
FigureBlot.tagName = 'figure';
Quill.register(FigureBlot);

class MyQuill extends Quill {
  formatLine(...args) {
    super.formatLine(...args);
    this.updateSelection();
  }
  formatText(...args) {
    super.formatText(...args);
    this.updateSelection();
  }
  updateSelection(source) {
    if (this.hasFocus()) {
      source = source || this.constructor.sources.SILENT;
      let range = this.getSelection(true);
      this.setSelection(++range.index, range.length, source);
      this.setSelection(--range.index, range.length, source);
    }
  }
}

function sanitize(url, protocols) {
  let anchor = document.createElement('a');
  anchor.href = url;
  let protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
  return protocols.indexOf(protocol) > -1;
}

function relativeUrl(url) {
  let base_loc = location;
  let loc = document.createElement('a');
  loc.href = url;
  if (base_loc.origin != loc.origin) {
    return loc.href;
  }
  if (base_loc.pathname != loc.pathname ||
      base_loc.search != loc.search) {
    return loc.pathname + loc.search + loc.hash;
  }
  if (base_loc.href == loc.href) {
    return loc.hash || loc.pathname + loc.search + loc.hash;
  }
  return loc.hash;
}

function getFigureValueByUrl(url) {
  let match;

  var youtube_video = false
  if ((match = url.match(/^(https?):\/\/(www\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/i))) {
    var hash = url.split('v=')[1]
    if (hash.indexOf('&')>-1) {
      hash = hash.split('&')[0]
    }

    youtube_video = encodeURIComponent(hash)
  }

  if ((match = url.match(/^(https?):\/\/(www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/i))) {
    var hash = url.split('youtu.be/')[1]
    if (hash.indexOf('?')>-1) {
      hash = hash.split('?')[0]
    }    
    youtube_video = encodeURIComponent(hash)
  }

  if (youtube_video) {
    return {embed: 'https://www.youtube.com/embed/' + youtube_video};
  }

  if (match = url.match(/^(https?):\/\/(www\.)?vimeo\.com\/(\d+)/i)) {
    var id = url.split('vimeo.com/')[1].split('/')[0].split('?')[0].split('&')[0]
    return {embed: 'https://player.vimeo.com/video/' + encodeURIComponent(id)};
  }
  // if (match = url.match(/^(https?):\/\/(www\.|mobile\.)?twitter\.com\/(.+)\/status\/(\d+)/i)) {
  //   return {embed: '/embed/twitter?url=' + encodeURIComponent(url)};
  // }
  if (match = url.match(/^data:(image\/gif|image\/jpe?g|image\/png|image\/webp|image\/jfif|video\/mp4);base64,(.*)$/)) {
    if (match[1].substr(0, 6) == 'video/') {
      return {video: url};
    }
    return {image: url};
  }
  if (match = url.match(/^(https?):\/\/\S+/i)) {
    let anchor = document.createElement('a');
    anchor.href = url;
    if (anchor.pathname.match(/\.(jpe?g|png|webp|jfif|gif|mp4)$/i)) {
      if (match[1] == 'mp4' || match[1] == 'webm') {
        return {video: url};
      }
      return {image: url};
    }
  }
  return false;
}

function _resizeIframe(iframeWindow, width, height) {
  $('iframe').map(function() {
    let thisWindow = null;
    try {
      thisWindow = this.contentWindow;
    } catch (e) {}
    if (thisWindow && thisWindow == iframeWindow) {
      let ratio = height / width;
      this.setAttribute('width',  '640');
      this.setAttribute('height', Math.round(640 * ratio) + '');
      if (this.parentNode && this.parentNode.classList.contains('iframe_helper')) {
        this.parentNode.style.paddingTop = (ratio * 100) + '%';
      }
      if (window.quill) {
        quill.updateSelection(Quill.sources.USER);
      }
    }
  });
}

function initQuill() {
  let draft = draftGet();

  if (draft) {
    $('#_tl_editor').html(draft);
  }

  function getSimpleMatcher(tag, attributes) {
    return [tag, function(node, delta) {
      return delta.compose(new Delta().retain(delta.length(), attributes));
    }];
  }

  function lineSuffix(index) {
    let [block, offset] = quill.scroll.line(index);
    return quill.getText(index, block.length() - offset);
  }

  function isLineEnd(index) {
    let suffix = lineSuffix(index);
    return !suffix || suffix == '\n';
  }

  function breakHandler(shiftKey, range, context) {
    let blot, index = range.index;
    if (range.length > 0) {
      quill.scroll.deleteAt(index, range.length);
    }
    let isEnd = isLineEnd(index), tailBreak = false;
    [blot] = quill.scroll.descendant(BreakBlot, index);
    if (blot) {
      if (!blot.prev || blot.prev instanceof BreakBlot) {
        quill.scroll.deleteAt(--index, 1);
        tailBreak = true;
      }
    } else {
      [blot] = quill.scroll.descendant(BreakBlot, index - 1);
      if (blot) {
        quill.scroll.deleteAt(--index, 1);
        tailBreak = true;
      }
    }
    [blot] = quill.scroll.descendant(SingleLineBlot, index);
    if (blot || tailBreak || !shiftKey) {
      this.quill.insertText(index, '\n', Quill.sources.USER);
      this.quill.setSelection(++index, Quill.sources.USER);
      if (context.format.blockHeader ||
          context.format.blockSubheader ||
          context.format.blockBlockquote ||
          context.format.blockPullquote) {
        if (isEnd) {
          this.quill.formatLine(index, 1, {
            blockHeader: false,
            blockSubheader: false,
            blockBlockquote: false,
            blockPullquote: false
          }, Quill.sources.USER);
        }
      }
    } else {
      this.quill.insertEmbed(index, 'textBreak', true, Quill.sources.USER);
      [blot] = quill.scroll.descendant(BreakBlot, index);
      if (blot && !blot.next &&
          !(blot.prev && blot.prev instanceof BreakBlot)) {
        this.quill.insertEmbed(++index, 'textBreak', true, Quill.sources.SILENT);
        this.quill.setSelection(index, 0, Quill.sources.SILENT);
      }
    }
    this.quill.selection.scrollIntoView();
    return false;
  }
  function detectLinkHandler(range) {
    let [line_blot, offset] = quill.scroll.line(range.index);
    if (line_blot) {
      let text = line_blot.domNode.innerText;
      let prefix = text.substr(0, offset);
      let match;
      if (match = prefix.match(/(^|\s)(https?:\/\/\S+|www\.\S+)$/)) {
        let url = match[2];
        let url_length = url.length;
        if (url.substr(0, 4) == 'www.') {
          url = 'http://' + url;
        }
        let links = quill.scroll.descendants(LinkBlot, range.index - url_length, url_length);
        if (!links.length) {
          quill.formatText(range.index - url_length, url_length, 'link', url, Quill.sources.USER);
        }
      }
    }
    return true;
  }

  var quill = new MyQuill('#_tl_editor', {
    readOnly: true,
    fileSizeLimit: 5 * 1024 * 1024,
    fileSizeLimitCallback: function() {
      showError('File too big (up to 5 MB allowed)');
    },
    updatePhoto: updatePhoto,
    formats: [
      'bold', 'italic', 'underline', 'strike', 'code', 'link',
      'textBreak',
      'blockTitle', 'blockAuthor',
      'blockHeader', 'blockSubheader',
      'blockBlockquote', 'blockPullquote',
      'blockDivider',
      'blockFigure',
      'code-block',
      'list',
    ],
    modules: {
      clipboard: {
        matchers: [
          getSimpleMatcher('h2', { blockHeader: true }),
          getSimpleMatcher('h5', { blockSubheader: true }),
          getSimpleMatcher('h6', { blockSubheader: true }),
          ['img', function(node, delta) {
            if (node.src && sanitize(node.src, ['http', 'https', 'data'])) {
              return new Delta().insert({blockFigure: {image: node.src, caption: node.alt || ''}});
            }
            return new Delta();
          }],
          ['video', function(node, delta) {
            if (node.src && sanitize(node.src, ['http', 'https', 'data'])) {
              return new Delta().insert({blockFigure: {video: node.src}});
            }
            return new Delta();
          }],
          ['br', function(node, delta) {
            if (node.classList.contains('inline')) {
              return new Delta().insert({textBreak: true});
            }
            return delta;
          }]
        ]
      },
      keyboard: {
        bindings: {
          'indent': {
            handler: function() { return true; }
          },
          'outdent': {
            handler: function() { return true; }
          },
          'tab': {
            key: Keyboard.keys.TAB,
            handler: function() {
              return true;
            }
          },
          'required enter': {
            key: Keyboard.keys.ENTER,
            collapsed: true,
            shiftKey: null,
            format: ['blockTitle', 'blockAuthor'],
            suffix: /^$/,
            handler: function(range, context) {
              let [block] = this.quill.scroll.descendant(FieldBlot, range.index);
              if (block && block.next && !$(block.next.domNode).text()) {
                this.quill.setSelection(block.next.offset(this.quill.scroll), 0, Quill.sources.USER);
                return false;
              }
              this.quill.insertText(range.index, '\n', Quill.sources.USER);
              return false;
            }
          },
          'required tab prev': {
            key: Keyboard.keys.TAB,
            shiftKey: true,
            handler: function(range, context) {
              let block = null;
              if (range.length > 0) {
                let blocks = quill.scroll.descendants(Block, range.index, range.length);
                if (blocks.length != 1) {
                  return true;
                }
                block = blocks[0];
              } else {
                [block] = quill.scroll.descendant(Block, range.index);
              }
              if (block != null &&
                  block.prev != null &&
                  (block.prev instanceof FieldBlot)) {
                let offset = block.prev.offset(quill.scroll);
                let length = block.prev.length();
                quill.setSelection(offset, length > 1 ? length : 0, Quill.sources.USER);
                return false;
              }
              return true;
            }
          },
          'required tab next': {
            key: Keyboard.keys.TAB,
            shiftKey: false,
            handler: function(range, context) {
              let block = null;
              if (range.length > 0) {
                let blocks = quill.scroll.descendants(Block, range.index, range.length);
                if (blocks.length != 1) {
                  return true;
                }
                block = blocks[0];
              } else {
                [block] = quill.scroll.descendant(Block, range.index);
              }
              if (block != null &&
                  (block instanceof FieldBlot) &&
                  block.next != null) {
                let offset = block.next.offset(quill.scroll);
                if (block.next instanceof FieldBlot) {
                  let length = block.next.length();
                  quill.setSelection(offset, length > 1 ? length : 0, Quill.sources.USER);
                } else {
                  quill.setSelection(offset, 0, Quill.sources.USER);
                }
                return false;
              }
              return true;
            }
          },
          'no tab': {
            key: Keyboard.keys.TAB,
            shiftKey: null,
            handler: function(range, context) {
              return false;
            }
          },
          'detect embed': {
            key: Keyboard.keys.ENTER,
            collapsed: true,
            handler: function(range, context) {
              let [line_blot, offset] = quill.scroll.line(range.index);
              if (line_blot) {
                let text = line_blot.domNode.innerText;
                let prefix = text.substr(0, offset);
                let match;
                if (match = prefix.match(/(^|\s)(https?:\/\/\S+)$/)) {
                  let url = match[2];
                  let links = quill.scroll.descendants(LinkBlot, range.index - url.length, url.length);
                  if (!links.length) {
                    quill.formatText(range.index - url.length, url.length, 'link', url, Quill.sources.USER);
                  }
                  if (!prefix.substr(0, offset - url.length).trim().length &&
                      line_blot.domNode.tagName == 'P') {
                    let figure_value = getFigureValueByUrl(url);
                    if (figure_value) {
                      let offset = line_blot.offset(quill.scroll);
                      quill.updateContents(new Delta()
                        .retain(offset)
                        .delete(prefix.length)
                        .insert({blockFigure: figure_value})
                      , Quill.sources.USER);
                      hideBlocksTooltip();
                      return false;
                    }
                  }
                }
              }
              return true;
            }
          },
          'divider autofill': {
            key: Keyboard.keys.ENTER,
            collapsed: true,
            prefix: /^([-*])\1\1$/,
            handler: function(range, context) {
              let [line_blot, index] = quill.scroll.line(range.index);
              if (line_blot &&
                  line_blot.domNode.tagName == 'P') {
                let offset = line_blot.offset(quill.scroll);
                let delta = new Delta()
                  .retain(offset)
                  .delete(line_blot.length())
                  .insert({blockDivider: true});
                if (!line_blot.next) {
                  delta.insert('\n');
                }
                quill.updateContents(delta, Quill.sources.USER);
                return false;
              }
              return true;
            }
          },
          'break': {
            key: Keyboard.keys.ENTER,
            shiftKey: true,
            handler: breakHandler.bind(quill, true)
          },
          'enter': {
            key: Keyboard.keys.ENTER,
            handler: breakHandler.bind(quill, false)
          },
          'detect link': {
            key: ' ',
            collapsed: true,
            handler: detectLinkHandler
          },
          'cancel placeholder': {
            key: Keyboard.keys.ESCAPE,
            handler: function(range, context) {
              checkOncePlaceholder();
              this.quill.updateSelection(Quill.sources.USER);
              return true;
            }
          },
          'list autofill': {
            key: ' ',
            collapsed: true,
            format: { list: false },
            prefix: /^(1\.|-|\*)$/,
            handler: function(range, context) {
              let length = context.prefix.length;
              this.quill.scroll.deleteAt(range.index - length, length);
              this.quill.formatLine(range.index - length, 1, 'list', length === 1 ? 'bullet' : 'ordered', Quill.sources.USER);
              this.quill.setSelection(range.index - length, Quill.sources.SILENT);
            }
          },
          'pre wrap': {
            key: 192, // `
            collapsed: true,
            format: { 'code-block': false },
            prefix: /^``$/,
            offset: 2,
            handler: function(range, context) {
              let length = context.prefix.length;
              let index = range.index - length;
              this.quill.scroll.deleteAt(index, length);
              this.quill.formatLine(index, 1, 'code-block', true, Quill.sources.USER);
              this.quill.setSelection(index, Quill.sources.SILENT);
            }
          },
          'code': {
            key: 192, // `
            handler: function(range, context) {
              if (!context.collapsed) {
                let lines = quill.scroll.descendants(Block, range.index, range.length);
                if (lines.length > 1 ||
                    lines.length == 1 && lines[0] instanceof CodeBlock) {
                  this.quill.format('code-block', !context.format['code-block'], Quill.sources.USER);
                  return false;
                }
                let breaks = quill.scroll.descendants(BreakBlot, range.index, range.length);
                if (breaks.length) {
                  this.quill.format('code-block', !context.format['code-block'], Quill.sources.USER);
                  return false;
                }
              }
              if (context.collapsed &&
                  !context.format['code'] &&
                  !/\s$/.test(context.prefix)) {
                return true;
              }
              this.quill.format('code', !context.format['code'], Quill.sources.USER);
            }
          },
          'figure delete': {
            key: Keyboard.keys.BACKSPACE,
            collapsed: true,
            offset: 0,
            handler: function(range, context) {
              let [line_blot, index] = quill.scroll.line(range.index);
              if (line_blot &&
                  line_blot.prev &&
                  line_blot.prev instanceof FigureBlot) {
                if (context.empty) {
                  quill.deleteText(range.index, 1, Quill.sources.USER);
                }
                quill.setSelection(line_blot.prev.offset(quill.scroll));
                return false;
              }
              return true;
            }
          },
          'field backspace': {
            key: Keyboard.keys.BACKSPACE,
            collapsed: true,
            offset: 0,
            handler: function(range, context) {
              let [line_blot, index] = quill.scroll.line(range.index);
              if (line_blot &&
                  line_blot.prev &&
                  line_blot.prev instanceof FieldBlot &&
                  $(line_blot.domNode).text().length > 0) {
                return false;
              }
              return true;
            }
          },
        }
      }
    }
  });

  quill.addContainer($tl_link_tooltip.get(0));
  quill.addContainer($tl_tooltip.get(0));
  quill.addContainer($tl_blocks.get(0));

  quill.on(Quill.events.EDITOR_CHANGE, function(eventType, range) {
    if (eventType !== Quill.events.SELECTION_CHANGE) return;
    if (!quill.isEnabled()) return;
    if (range == null) return;
    checkFigureBlots(range);
    let [block, offset] = quill.scroll.descendant(Block, range.index);
    if (range.length === 0) {
      hideFormatTooltip();
      if (block != null &&
          !(block instanceof FieldBlot) &&
          !(block instanceof BlockquoteBlot) &&
          !(block instanceof PullquoteBlot) &&
          !(block instanceof CodeBlock) &&
          !(block instanceof ListItem) &&
          !$(block.domNode).text().length) {
        showBlocksTooltip(range);
      } else {
        hideBlocksTooltip();
      }
    } else {
      if (block != null &&
          !(block instanceof TitleBlot)) {
        showFormatTooltip(range);
        toolbarUpdate(range);
      } else {
        hideFormatTooltip();
      }
      hideBlocksTooltip();
    }
    // toolbarUpdate(range);
    let formats = quill.getFormat(range);
    $tl_article.toggleClass('title_focused', !!(formats['blockTitle'] || formats['blockAuthor']));
    checkOncePlaceholder();
  });

  quill.on(Quill.events.TEXT_CHANGE, function() {
    let range = quill.getSelection();
    // toolbarUpdate(range);
    checkRequiredBlots(quill);
    checkBlotPlaceholder(quill);
    checkOncePlaceholder();
    draftSave();
  });

  quill.on(Quill.events.TEXT_PASTE, function() {
    let range = quill.getSelection();
    if (range) {
      detectLinkHandler(range);
    }
  });

  quill.on(Quill.events.SCROLL_OPTIMIZE, function(mutations) {
    mutations.forEach((mutation) => {
      if (mutation.type == 'childList' &&
          !mutation.addedNodes.length &&
          mutation.removedNodes.length) {
        let prev = mutation.previousSibling;
        let next = mutation.nextSibling;
        if (!next && prev &&
            prev.tagName == 'BR' &&
            prev.className == 'inline') {
          let br = document.createElement('br');
          br.className = 'inline';
          mutation.target.appendChild(br);
        } else
        if (next && prev &&
            !(prev.tagName == 'BR' && prev.className == 'inline') &&
            (next.tagName == 'BR' && next.className == 'inline') &&
            !next.nextSibling) {
          if (next.parentNode) {
            next.parentNode.removeChild(next);
          }
        }
      }
    });
  });

  quill.scroll.domNode.setAttribute('dir', 'auto');

  $(document).on('click touchstart', function(e) {
    let el = e.target;
    while (el) {
      if (el === quill.container) {
        return;
      }
      el = el.parentNode;
    }
    hideFormatTooltip();
    hideBlocksTooltip();
  });

  checkRequiredBlots(quill);
  checkBlotPlaceholder(quill);

  return quill;
}

function checkOncePlaceholder() {
  $('.placeholder_once')
    .removeAttr('data-placeholder')
    .removeClass('placeholder_once empty');
}

function checkBlotPlaceholder(quill) {
  let lines = quill.scroll.descendants(Block, 0, quill.scroll.length());
  lines.forEach((line) => {
    if (line.domNode.hasAttribute('data-placeholder')) {
      let value = $(line.domNode).text();
      $(line.domNode).toggleClass('empty', !value);
      // if (!value) {
      //   quill.setSelection(quill.getSelection());
      // }
    }
  })
}

function checkRequiredBlots(quill) {
  let [first, second] = quill.scroll.lines();
  if (first instanceof BlockEmbed) {
    quill.updateContents(new Delta()
      .insert('\n', {blockTitle: true})
      .insert('\n', {blockAuthor: true})
    , Quill.sources.SILENT);
  } else {
    if (!(first instanceof TitleBlot)) {
      quill.formatLine(0, 1, {blockTitle: true}, Quill.sources.SILENT);
    }
    if (!second) {
      let offset = quill.scroll.length();
      quill.updateContents(new Delta()
        .retain(offset)
        .insert('\n', {blockAuthor: true})
      , Quill.sources.SILENT);
    } else if (second instanceof BlockEmbed) {
      let offset = second.offset(quill.scroll);
      quill.updateContents(new Delta()
        .retain(offset)
        .insert('\n', {blockAuthor: true})
      , Quill.sources.SILENT);
    } else if (!(second instanceof AuthorBlot)) {
      let offset = second.offset(quill.scroll);
      quill.formatLine(offset, 1, {blockAuthor: true}, Quill.sources.SILENT);
    }
  }
  let [, , third] = quill.scroll.lines();
  if (!third) {
    let offset = quill.scroll.length();
    quill.insertText(offset, '\n', Quill.sources.SILENT);
  } else {
    let offset = third.offset(quill.scroll);
    let length = quill.scroll.length() - offset;
    let blots = quill.scroll.descendants(FieldBlot, offset, length);
    blots.forEach((blot) => {
      let index = blot.offset(quill.scroll);
      let length = blot.length();
      let format = blot.constructor.blotName;
      quill.formatText(index, length, format, false, Quill.sources.SILENT);
    });
  }
  let lines = quill.scroll.lines();
  lines.forEach((line, i) => {
    if (line.domNode.tagName == 'P') {
      if (lines.length == 3 && i == 2) {
        line.domNode.setAttribute('data-placeholder', 'Your story...');
      } else {
        line.domNode.removeAttribute('data-placeholder');
      }
    }
  });
}

function checkFigureBlots(range) {
  let [embed, ] = quill.scroll.descendant(FigureBlot, range.index);
  let embeds = quill.scroll.descendants(FigureBlot, 0, quill.scroll.length());
  embeds.forEach((blot) => {
    if (embed !== blot) {
      blot.blur();
    }
  });
  if (embed) {
    embed.focus();
    hideFormatTooltip();
    hideBlocksTooltip();
  }
}
function updatePhoto(file, callback) {
  if (file.type == 'image/jpg' || file.type == 'image/jpeg' || file.type == 'image/webp'|| file.type == 'image/gif' || file.type == 'video/mp4'|| file.type == 'video/webm') {
    const formData = new FormData();
			formData.append('file', file);
			let api = '//'+window.api_host+'/api/v0/add';
			$.ajax({
				url: api,
				type: 'POST',
				data: formData,
				processData: false,
				contentType: false,
				success: function(res) {
					if (res.Hash) {
						setTimeout(seeding(res),1)
						setTimeout(callback(res),3000)
            // return callback(res)
					} else {
						console.error('上传失败');
					}
				},
				error: function() {
					console.error('请求失败');
				}
			});

  }
}
function uploadDataToBlob(file_data) {
  var binary = atob(file_data.base64_data);
  var array = [];
  for(var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type: file_data.type});
}

function uploadFile(file_data, onProgress, onSuccess, onError) {
  onSuccess({'src':'data:'+file_data.type+';base64,'+file_data.base64_data})
}

function wrapDomElement(node) {
  if (!node.tagName) {
    return node.data;
  }
  let obj = {
    tag: node.tagName.toLowerCase(),
  };
  if (node.attributes.length) {
    obj.attrs = {};
    for (var i = 0; i < node.attributes.length; i++) {
      let attr = node.attributes[i];
      obj.attrs[attr.name] = attr.value;
    }
  }
  if (node.childNodes.length) {
    obj.children = [];
    for (var i = 0; i < node.childNodes.length; i++) {
      obj.children.push(wrapDomElement(node.childNodes[i]));
    }
  }
  return obj;
}

function getPageContent(for_draft) {
  let $domNode = $(quill.scroll.domNode);
  $('textarea,input', $domNode).map(function() {
    this.setAttribute('data-value', this.value);
  });
  let $node = $domNode.clone();
  $('textarea,input', $domNode).map(function() {
    this.removeAttribute('data-value');
  });
  $('textarea,input', $node).map(function() {
    this.value = this.getAttribute('data-value');
    this.removeAttribute('data-value');
  });
  updateEditableText($node, false);
  $('[contenteditable]', $node).removeAttr('contenteditable');
  $('[data-placeholder]', $node).removeAttr('data-placeholder');
  $('[data-label]', $node).removeAttr('data-label');
  $('[data-title]', $node).removeAttr('data-title');
  $('.editable_text', $node).removeClass('editable_text');
  $('.focus', $node).removeClass('focus');
  $('.empty', $node).removeClass('empty');
  $('[class=""]', $node).removeAttr('class');
  $('.file_progress', $node).remove();
  $('.cursor_wrapper', $node).remove();
  if (!for_draft) {
    $('h1,address', $node).remove();
    $('br.inline', $node).replaceWith('\n');
    return {
      data: JSON.stringify(wrapDomElement($node.get(0)).children),
      length: $node.html().length
    };
  } else {
    $('h1:not(:has(br)),address:not(:has(br))', $node).append('<br>');
  }
  return $node.html();
}

function showError(error) {
  $error_msg.text(error);
  clearTimeout($error_msg.to);
  $error_msg.addClass('shown');
  $error_msg.to = setTimeout(() => {
    $error_msg.removeClass('shown');
  }, 3000);
}

function savePage() {
  if ($tl_article.hasClass('tl_article_saving')) {
    return false;
  }

  let title      = $('h1', $tl_content).text();
  let author     = $('address', $tl_content).text();
  let author_url = $('address a', $tl_content).attr('href') || '';

  if (title.length < 2) {
    clearTimeout($tl_article.to);
    $tl_article.addClass('title_required');
    $tl_article.to = setTimeout(() => {
      $tl_article.removeClass('title_required');
    }, 3000);
    quill.focus();
    let [title] = quill.scroll.descendants(TitleBlot, 0, quill.scroll.length());
    quill.setSelection(title.offset(), title.length() - 1);
    quill.selection.scrollIntoView();
    return showError('Title is too small');
  }


  $('body').addClass('publishing')
  $tl_article.addClass('tl_article_saving');
  updateEditable(false);

  var content      = getPageContent(true)
  var $c           = $(content); $c.find('h1').remove(); $c.find('address').remove();
  var content_text = $c.text()
  var desc         = content_text.substr(0,140);

  var page_html    = renderPostPage(title, desc, author, content)
  
  // Create html page in IPFS
  save2IPFS(page_html, function(err, datahash){
    $tl_article.removeClass('tl_article_saving');
    $('body').removeClass('publishing')
   
    if (err) {
        updateEditable(true);
        var str = ''
        if (typeof navigator!=='undefined' && navigator.onLine===false) {
          str = 'maybe it because you OFFLINE?'
        }
        return showError('SOME PROBLEM... \n'+err+'\n'+str);
    }

    if (!err && datahash) {
      draftClear();
      $tl_article.addClass('tl_article_editable');
      window.open(window.ipfs_gateway + '/'+datahash+'/', "_blank");

    }

  })


  
  return

  // Save JSON to IPFS
  ipfs.addJSON({
      title:        title,
      desc:         desc,
      author:       author,
      author_url:   author_url,
      content_text: content_text,
      body:         getPageContent(true)
  }, function(err, datahash){
      if (!err && datahash) {
        draftClear();
        location.hash = '#p_' + datahash;
        $tl_article.addClass('tl_article_editable');
      }
  })



  $.ajax(T.apiUrl + '/save', {
    contentType: 'multipart/form-data; boundary=' + boundary,
    data: body,
    type: 'POST',
    dataType: 'json',
    xhrFields: {
      withCredentials: true,
    },
    success: function(data) {
      $tl_article.removeClass('tl_article_saving');
      if (data.error) {
        updateEditable(true);
        return showError(data.error);
      }
      draftClear();
      if (!T.pageId && data.path) {
        location.href = '/' + data.path;
      }
    },
    error: function(xhr) {
      $tl_article.removeClass('tl_article_saving');
      updateEditable(true);
      return showError('Network error');
    }
  });
}

function startTelegraph() {
    $tl_article.addClass('tl_article_edit');

    if (!draftGet()) {
      var author_name = ''
      var format = {};
      
      let [author] = quill.scroll.descendants(AuthorBlot);
      if (author) {
        quill.updateContents(new Delta()
          .retain(author.offset())
          .delete(author.length())
          .insert(author_name, format)
        , Quill.sources.USER);
      }
    }
  pageContent = getPageContent(true);
  updateEditable(isEdit());
}

function migratePages(migrate_hash) {
  $.ajax(T.apiUrl + '/migrate', {
    data: {
      migrate_hash: migrate_hash
    },
    type: 'POST',
    dataType: 'json',
    xhrFields: {
      withCredentials: true,
    },
    success: function(data) {
      if (data.migrated_count > 0) {
        showAlert('Added <b>' + data.migrated_count + '</b> Telegraph page' + (data.migrated_count > 1 ? 's' : '') + ' to your account.<br><br>To see a list of your pages, talk to the <a href="https://t.me/telegraph" target="_blank">@Telegraph</a> bot on Telegram.');
      } else {
        hideAlert();
      }
    }
  });
}

function toolbarUpdate(range) {
  let formats = range == null ? {} : quill.getFormat(range);

  let in_author = !!formats['blockAuthor'];
  let in_header = !!(formats['blockHeader'] || formats['blockSubheader']);
  let in_code   = !!formats['code-block'];

  $bold_button.toggleClass('active', !!formats['bold']);
  $bold_button.toggleClass('disabled', in_author || in_header || in_code);
  $italic_button.toggleClass('active', !!formats['italic']);
  $italic_button.toggleClass('disabled', in_author || in_header || in_code);
  $header_button.toggleClass('active', !!formats['blockHeader']);
  $header_button.toggleClass('disabled', in_author);
  $subheader_button.toggleClass('active', !!formats['blockSubheader']);
  $subheader_button.toggleClass('disabled', in_author);
  $quote_button.toggleClass('active', !!(formats['blockBlockquote'] || formats['blockPullquote']));
  $quote_button.toggleClass('pullquote', !!formats['blockPullquote']);
  $quote_button.toggleClass('disabled', in_author);

  if (range != null) {
    let links = quill.scroll.descendants(LinkBlot, range.index, range.length);
    $link_button.toggleClass('active', !!links.length);
  } else {
    $link_button.toggleClass('active', false);
  }
  $link_button.toggleClass('disabled', in_code);
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return !!localStorage.getItem(key);
  } catch (e) {
    return false;
  }
}

function storageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return false;
  }
}

function storageDelete(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}

function draftClear() {
  storageDelete('draft');
}

function draftSave() {
  if (!pageContent) {
    return false;
  }
  if (!T.pageId) {
    var page_content = getPageContent(true);
    if (pageContent != page_content) {
      pageContent = page_content;
      return storageSet('draft', page_content);
    }
  }
  return false;
}

function draftGet() {
  if (!T.pageId) {
    return storageGet('draft');
  }
  return false;
}

function isEdit() {
  // return false
  if (window.cur_post_author) {
    // return (Wallet.getAddresses().indexOf(window.cur_post_author) > -1)
  }
  return true
}

function updateEditableText(context, is_edit) {
  if (typeof is_edit === 'undefined') {
    is_edit = isEdit();
  }
  if (is_edit) {
    $('.editable_text:not(:has(.editable_input))', context)
      .map(function() {
        let value = this.innerText;
        let input = document.createElement('textarea');
        input.classList.add('editable_input');
        input.setAttribute('tabindex', '-1');
        input.setAttribute('rows', '1');
        input.setAttribute('placeholder', 'Caption (optional)');
        input.value = value;
        if (!value) {
          this.classList.add('empty');
        }
        $(this).empty().append(input);
        autosize(input);
        return input;
      });
  } else {
    $('.editable_text > .editable_input', context)
      .map(function() {
        let value = this.value;
        let el = this.parentNode;
        $(el).empty().text(value);
        return el;
      });
  }
}

function updateEditable(is_editable) {
  $tl_article.toggleClass('tl_article_edit', is_editable);
  updateEditableText();
  if (window.quill) {
    quill.enable(is_editable);
    if (is_editable) {
      quill.focus();
    }
  }
  if (!is_editable) {
    var title      = $('h1', $tl_content).text();
    var author     = $('address', $tl_content).text();
    var author_url = $('address a', $tl_content).attr('href');
    $('h1', $tl_header).text(title);
    $('address a', $tl_header).text(author);
    if (author_url) {
      $('address a', $tl_header).attr('href', author_url);
    } else {
      $('address a', $tl_header).removeAttr('href');
    }
    hideLinkTooltip();
    hideFormatTooltip();
    hideBlocksTooltip();
  }
}



let $tl_page          = $('.tl_page');
let $tl_article       = $('.tl_article');
let $tl_header        = $('.tl_article_header');
let $tl_content       = $('.tl_article_content');

let $tl_tooltip       = $('#_tl_tooltip');
let $tl_blocks        = $('#_tl_blocks');
let $tl_link_tooltip  = $('#_tl_link_tooltip');

let $bold_button      = $('#_bold_button');
let $italic_button    = $('#_italic_button');
let $link_button      = $('#_link_button');
let $header_button    = $('#_header_button');
let $subheader_button = $('#_subheader_button');
let $quote_button     = $('#_quote_button');

let $image_button     = $('#_image_button');
let $embed_button     = $('#_embed_button');

let $edit_button      = $('#_edit_button');
let $publish_button   = $('#_publish_button');

let $account          = $('.account');
let $error_msg        = $('#_error_msg');

let formatTTOptions = {
  padding: 10,
  position: browser.mobile ? 'bottom' : 'top',
  minDelta: 5,
};
let linkTTOptions = {
  padding: 7,
  position: 'bottom',
  depend: $tl_tooltip,
  dependPadding: 10
};

$tl_tooltip.mouseover(function(e) {
  let button = e.target;
  if (e.target.tagName == 'BUTTON' &&
      !e.target.classList.contains('disabled')) {
    $tl_tooltip.attr('data-hover', button.id).addClass('hover');
    setTimeout(() => { $tl_tooltip.addClass('hover_anim'); }, 1);
    clearTimeout($tl_tooltip.to);
  }
});

$tl_tooltip.mouseout(function(e) {
  let button = e.target;
  if (button.tagName == 'BUTTON') {
    $tl_tooltip.removeClass('hover');
    $tl_tooltip.to = setTimeout(() => { $tl_tooltip.removeClass('hover_anim'); }, 70);
  }
});

$bold_button.click(function(e) {
  let input = e.target;
  let active = input.classList.contains('active');
  e.preventDefault();
  let range = quill.getSelection(true);
  quill.format('bold', !active);
  quill.updateSelection(Quill.sources.API);
  // toolbarUpdate(range);
});

$italic_button.click(function(e) {
  let input = e.target;
  let active = input.classList.contains('active');
  e.preventDefault();
  let range = quill.getSelection(true);
  quill.format('italic', !active);
  quill.updateSelection(Quill.sources.API);
  // toolbarUpdate(range);
});

$link_button.click(function(e) {
  let input = e.target;
  let active = input.classList.contains('active');
  e.preventDefault();
  var range = quill.getSelection(true);
  if (active) {
    let links = quill.scroll.descendants(LinkBlot, range.index, range.length);
    links.forEach((link) => {
      let index = link.offset(quill.scroll);
      let length = link.length();
      quill.formatText(index, length, 'link', false);
    });
    toolbarUpdate(range);
  } else {
    toolbarPrompt($tl_tooltip, 'Paste or type a link...', function(value) {
      value = value.trim();
      if (value.substr(0, 1) != '#' &&
          value.substr(0, 1) != '/' &&
          value.substr(0, 7) != 'http://' &&
          value.substr(0, 8) != 'https://' &&
          value.substr(0, 7) != 'mailto:') {
        if (value.indexOf('@') > 0) {
          value = 'mailto:' + value;
        } else {
          value = 'http://' + value;
        }
      }
      quill.focus();
      quill.format('link', value);
      toolbarUpdate(range);
    });
  }
});

$header_button.click(function(e) {
  let input = e.target;
  let active = input.classList.contains('active');
  e.preventDefault();
  let range = quill.getSelection(true);
  quill.format('blockHeader', !active);
  let blots = quill.scroll.descendants(HeaderBlot, range.index, range.length);
  blots.forEach((blot) => {
    let index = blot.offset(quill.scroll);
    let length = blot.length();
    quill.formatText(index, length, {
      'bold': false,
      'italic': false,
      'code': false
    }, Quill.sources.SILENT);
  });
  quill.updateSelection(Quill.sources.API);
  // toolbarUpdate(range);
});

$subheader_button.click(function(e) {
  let input = e.target;
  let active = input.classList.contains('active');
  e.preventDefault();
  let range = quill.getSelection(true);
  quill.format('blockSubheader', !active);
  let blots = quill.scroll.descendants(SubheaderBlot, range.index, range.length);
  blots.forEach((blot) => {
    let index = blot.offset(quill.scroll);
    let length = blot.length();
    quill.formatText(index, length, {
      'bold': false,
      'italic': false,
      'code': false
    }, Quill.sources.SILENT);
  });
  quill.updateSelection(Quill.sources.API);
  // toolbarUpdate(range);
});

$quote_button.click(function(e) {
  let input = e.target;
  let active = input.classList.contains('active');
  let pullquote = input.classList.contains('pullquote');
  e.preventDefault();
  let range = quill.getSelection(true);
  if (active) {
    quill.format('blockPullquote', !pullquote);
  } else {
    quill.format('blockBlockquote', true);
  }
  quill.updateSelection(Quill.sources.API);
  // toolbarUpdate(range);
});

$image_button.click(function() {
  let fileInput = quill.container.querySelector('input.ql-image[type=file][data-status=ready]');
  if (fileInput == null) {
    fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('accept', 'image/gif, image/jpeg,image/webp, image/jfif,image/jpg, image/png, video/mp4, video/webm');
    fileInput.classList.add('ql-image');
    fileInput.addEventListener('change', () => {
      if (fileInput.files != null && fileInput.files[0] != null) {
        var file = fileInput.files[0];
        updatePhoto(file, (res) => {
          console.log(res)
          let figure_value = {image: "/ipfs/" +res.Hash + "?filename=" + encodeURI(res.Name)};
          if(res.Name.indexOf(".mp4") > 0  || res.Name.indexOf(".webm") > 0 ){
            figure_value = {video: "/ipfs/" +res.Hash + "?filename=" + encodeURI(res.Name)};
          }
            if (figure_value) {
              let range = quill.getSelection(true);
              quill.updateContents(new Delta()
                .retain(range.index)
                .delete(range.length)
                .insert({blockFigure: figure_value})
              , Quill.sources.USER);
            } else {
              showError('Invalid file format');
            }
            fileInput.value = '';
            fileInput.setAttribute('data-status', 'ready');
        });
      }
    });
    quill.container.appendChild(fileInput);
  }
  fileInput.setAttribute('data-status', 'busy');
  fileInput.click();
});

$embed_button.click(function(e) {
  // toolbarPrompt($tl_blocks, 'Paste a YouTube, Vimeo or Twitter link, and press Enter', function(value) {
  //   let figure_value = getFigureValueByUrl(value);
  //   let insert = figure_value ? {blockFigure: figure_value} : value + '\n';
  //   let range = quill.getSelection(true);
  //   quill.updateContents(new Delta()
  //     .retain(range.index)
  //     .delete(range.length)
  //     .insert(insert)
  //   , Quill.sources.USER);
  //   quill.focus();
  //   blocksUpdatePosition(quill.getSelection());
  // });
  let range = quill.getSelection(true);
  let [line, ] = quill.scroll.line(range.index);
  if (line) {
    let value = $(line.domNode).text();
    if (!value) {
      line.domNode.setAttribute('data-placeholder', 'Paste a YouTube, Vimeo or file link, and press Enter');
      $(line.domNode).addClass('placeholder_once empty');
      hideBlocksTooltip();
    }
  }
});

$publish_button.click(function () {
  const formData = new FormData();
  formData.append('file', "test");
  let api = '//' + window.api_host + '/api/v0/add';
  $.ajax({
    url: api,
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function (res) {
      if (res.Hash == 'QmRf22bZar3WKmojipms22PkXH1MZGmvsqzQtuSvQE3uhm') {
        savePage();
      } else {
        console.error('上传失败');
      }
    },
    error: function () {
      console.error('请求失败');
    }
  });

});

$edit_button.click(function() {
  updateEditable(true);
});

$(window).on('scroll resize', function() {
  tooltipUpdatePosition($tl_tooltip, null, formatTTOptions);
  tooltipUpdatePosition($tl_link_tooltip, null, linkTTOptions);
});


function showLinkTooltip(link, value) {
  if (!isEdit()) return;
  let range = {
    index: link.offset(quill.scroll),
    length: link.length()
  };
  $tl_link_tooltip.text(value);
  tooltipUpdatePosition($tl_link_tooltip, range, linkTTOptions);
  if (!$tl_link_tooltip.hasClass('move_anim')) {
    setTimeout(() => {
      $tl_link_tooltip.addClass('move_anim');
    }, 1);
  }
  if (!$tl_link_tooltip.hasClass('shown')) {
    setTimeout(() => { $tl_link_tooltip.addClass('shown'); }, 10);
  }
}

function hideLinkTooltip() {
  $tl_link_tooltip.removeClass('move_anim shown');
}

function showFormatTooltip(range) {
  if (!isEdit()) return;
  $tl_tooltip.removeClass('tooltip_prompt');
  tooltipUpdatePosition($tl_tooltip, range, formatTTOptions);
  if (!$tl_tooltip.hasClass('move_anim')) {
    setTimeout(() => {
      $tl_tooltip.addClass('move_anim');
    }, 10);
  }
  if (!$tl_tooltip.hasClass('shown')) {
    setTimeout(() => {
      $tl_tooltip.addClass('shown');
      tooltipUpdatePosition($tl_link_tooltip, null, linkTTOptions);
    }, 10);
  } else {
    tooltipUpdatePosition($tl_link_tooltip, null, linkTTOptions);
  }
}

function hideFormatTooltip() {
  $tl_tooltip.removeClass('move_anim shown');
  tooltipUpdatePosition($tl_link_tooltip, null, linkTTOptions);
}

function showBlocksTooltip(range) {
  if (!isEdit()) return;
  $tl_blocks.addClass('shown');
  blocksUpdatePosition(range);
}

function hideBlocksTooltip() {
  $tl_blocks.removeClass('shown');
}

function hideAlert() {
  $('.tl_alert').remove();
}
function showAlert(html, options) {
  options = options || {};
  options.close_btn  = options.close_btn || 'OK';
  options.submit_btn = options.submit_btn || false;
  options.close      = options.close || hideAlert;
  options.submit     = options.submit || options.close;
  hideAlert();
  var $alert = $('<div class="tl_alert"><main class="tl_alert_message"><section></section><aside class="tl_message_buttons"></aside></main></div>');
  $('section', $alert).html(html);
  var $aside = $('aside', $alert);
  if (options.close_btn) {
    var $close_btn = $('<button class="button"></button>');
    $close_btn.html(options.close_btn).click(options.close).appendTo($aside);
  }
  if (options.submit_btn) {
    var $submit_btn = $('<button class="button"></button>');
    $submit_btn.html(options.submit_btn).click(function() {
      $alert.addClass('tl_alert_loading');
      options.submit();
    }).appendTo($aside);
  }
  $alert.appendTo('body');
}

function isOverElement(bounds1, $elem2, padding) {
  if (!$elem2 || !$elem2.hasClass('shown')) {
    return false;
  }
  bounds1.bottom = bounds1.top + bounds1.height;
  bounds1.right = bounds1.left + bounds1.width;
  let pos2 = $elem2;//.position();
  let bounds2 = {
    top:    pos2._top,
    bottom: pos2._top + $elem2.outerHeight(),
    left:   pos2._left,
    right:  pos2._left + $elem2.outerWidth(),
  };
  if ((bounds1.left - bounds2.right >= padding ||
       bounds2.left - bounds1.right >= padding) ||
      (bounds1.top - bounds2.bottom >= padding ||
       bounds2.top - bounds1.bottom >= padding)) {
    return false;
  }
  return bounds2;
}

function tooltipUpdatePosition($tooltip, range, options) {
  options = options || {padding: 10, position: 'top'};
  range = range || $tooltip._range || null;
  if (range == null) return;
  let rangeBounds = quill.getBounds(range);
  let quillOffset = $(quill.container).offset();
  let tt = {
    width: $tooltip.outerWidth(),
    height: $tooltip.outerHeight(),
  }
  let win = {
    width: $(window).outerWidth(),
    height: $(window).outerHeight(),
    scrolltop: document.body.scrollTop
  }
  let min = {
    left: 9,
    top: win.scrolltop + 9,
  };
  let max = {
    left: win.width - tt.width - 9,
    top: win.scrolltop + win.height - tt.height - 9,
  };
  tt.left = rangeBounds.left + rangeBounds.width / 2 - tt.width / 2;
  let pleft = quillOffset.left + tt.left;
  if (pleft < min.left) {
    tt.left = min.left - quillOffset.left;
  } else if (pleft > max.left) {
    tt.left = max.left - quillOffset.left;
  }
  let top, bottom_class;
  if (options.position == 'top') {
    tt.top = rangeBounds.top - tt.height - options.padding;
    let ptop = quillOffset.top + tt.top;
    bottom_class = false;
    if (ptop < min.top) {
      tt.top = rangeBounds.bottom + options.padding;
      bottom_class = true;
    }
  }
  else if (options.position == 'bottom') {
    let dependOfBounds = false;
    tt.top = rangeBounds.bottom + options.padding;
    if (dependOfBounds = isOverElement(tt, options.depend, options.dependPadding)) {
      tt.top = dependOfBounds.bottom + options.dependPadding;
    }
    let ptop = quillOffset.top + tt.top;
    bottom_class = true;
    if (ptop > max.top) {
      tt.top = rangeBounds.top - tt.height - options.padding;
      if (dependOfBounds = isOverElement(tt, options.depend, options.dependPadding)) {
        tt.top = dependOfBounds.top - tt.height - options.dependPadding;
      }
      bottom_class = false;
    }
  }
  tt.left = Math.round(tt.left);
  tt.top = Math.round(tt.top);
  $tooltip._range = range;
  if (options.minDelta &&
      Math.abs(tt.left - $tooltip._left) < options.minDelta &&
      Math.abs(tt.top - $tooltip._top) < options.minDelta) {
    return;
  }
  $tooltip._left = tt.left;
  $tooltip._top = tt.top;
  $tooltip.css({left: tt.left, top: tt.top}).toggleClass('bottom', bottom_class);
}

function blocksUpdatePosition(range) {
  if (typeof range === 'undefined') {
    range = quill.getSelection();
  }
  if (range == null || !window.quill) return;
  let lineBounds = quill.getBounds(range);
  $tl_blocks.css({
    top: lineBounds.top + lineBounds.height / 2
  });
}

function htsc(str) {
  return str.replace(/&/g,'&amp;')
            .replace(/</g,'&lt;')
            .replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;')
            .replace(/\'/g,'&#39;')
            .replace(/%/g,'&#37;');
}

new Image().src = window.devicePixelRatio >= 2 ? './images/icons_2x.png?1' : './images/icons.png?1';

function toolbarPrompt($el, text, onEnter) {
  let $input = $('.prompt_input', $el);
  let $close = $('.close', $el);
  $input.val('').attr('placeholder', text);
  $input.on('keydown', function(e) {
    let key = e.which || e.keyCode;
    if (key == 27) {
      toolbarPromptHide($el);
    } else if (key == 13) {
      let value = $input.val();
      if (value) {
        onEnter && onEnter(value);
        e.preventDefault();
      }
      toolbarPromptHide($el);
    }
  });
  $input.on('blur', function() {
    toolbarPromptHide($el);
  });
  $close.on('click', function() {
    toolbarPromptHide($el);
  });
  $el.show().addClass('tooltip_prompt');
  $input.focus();
}
function toolbarPromptHide($el) {
  let $input = $('.prompt_input', $el);
  let $close = $('.close', $el);
  $input.off('keydown');
  $input.off('blur');
  $close.off('click');
  $el.show().removeClass('tooltip_prompt');
  quill.focus();
}