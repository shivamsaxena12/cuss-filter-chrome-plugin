var inj;
(function() {
  if (!inj) inj = true;
  else return;
  class CussFilter {
    constructor() {
      this.unwanted_words = {};
      this.hiliteTag = 'swiggy-highlight';
      this.skipTags = new RegExp('^(?:' + this.hiliteTag + '|SCRIPT|FORM|SPAN)$');
      this.targetNode = document.body;
      this.target_pos;
      this.matchRegExp = '';
      this.inputKey = '';
      this.highlights = [];
      this.highlightTexts = [];
      this.highlightedId = [];
      this.ranges = [];
      this.alerts = [];
      this.isCardFocus = false;
      this.ishighlightFocus = false;
      this.isReplacing = false;
      this.card_elem = document.getElementById('filterCard');
      this.highlightsBlock;
      this.focusBadWord = '';
      // characters to strip from start and end of the input string
      this.endRegExp = new RegExp('^[^\\w]+|[^\\w]+$', 'g');

      // characters used to break up the input string into words
      this.breakRegExp = new RegExp("[^\\w'-]+", 'g');
    }

    getBadWords() {

      this.unwanted_words = {
        fuck: 'falooda',
        fck: 'falooda',
        fucking: 'fruiting',
        fcking: 'fruiting',
        fucker: 'fruiter',
        'ass hole': 'aloo jhol',
        asshole: 'aloo jhol',
        shitty: 'tikki',
        madarchod: 'matar pulao',
        'madar chod': 'matar pulao',
        mc: 'matar pulao',
        behenchod: 'bhendi fry',
        'behen chod': 'bhendi fry',
        bc: 'bhendi fry',
        betichod: 'bhetki maach',
        'beti chod': 'bhetki maach',
        betichodd: 'bhetki maach',
        'beti chodd': 'bhetki maach',
        chooth: 'chutney',
        chut: 'chutney',
        chuth: 'chutney',
        chootiya: 'chutney',
        chutiya: 'chutney',
        chuthia: 'chutney',
        chootia: 'chutney',
        chuthiya: 'chutney',
        bhosdk: 'chole bhature',
        bhosdike: 'chole bhature',
        motherfucker: 'matar paneer',
        'mother fucker': 'matar paneer',
        'mother fckr': 'matar paneer',
        'mthr fukker': 'matar paneer',
        lund: 'ladoo',
        landu: 'ladoo',
        lundoo: 'ladoo',
        laude: 'tofu',
        lavde: 'tofu',
        gaand: 'gajar',
        gaandu: 'gajar ke halwa',
        gandu: 'gajar ke halwa',
        bastard: 'barfi',
        bastrd: 'barfi',
        bastrad: 'barfi',
        dick: 'soup',
        prick: 'soup',
        cunt: 'custard',
        bugger: 'burger',
        balls: 'bondas',
        bollocks: 'bondas',
        whore: "s'more",
        harami: 'imarti',
        saala: 'samosa',
        sala: 'samosa',
        saale: 'samose',
        saali: 'sevai',
        'son of a bitch': 'soan halwa',
        sob: 'soan halwa',
        dickhead: 'dum aloo',
        'dick head': 'dum aloo',
        crap: 'khurmani',
        'ma ki aankh': 'mawa khulfi',
        'maa ki aankh': 'mawa khulfi',
        'ma ki': 'mawa khulfi',
        'maa ki': 'mawa khulfi',
        'behen ke takke': 'bhendi masala',
        'bahen ke takke': 'bhendi masala',
        rand: 'rabdi',
        randi: 'rabdi',
        rundi: 'rabdi',
        saali: 'spaghetti',
        randhwa: 'ragda pattice',
        randwa: 'ragda pattice',
        chhinal: 'chivda',
        ghanta: 'ghewar',
        bitch: 'sandwhich',
        ass: 'aamras',
        idiot: 'idli',
        stupid: 'shukto',
        fool: 'puttu',
        dumbfuck: 'dumpling',
        'dumb fuck': 'dumpling',
        dumbass: 'dumpling',
        'dumb ass': 'dumpling',
        retard: 'revadi',
        bloody: 'biryani',
        wtf: 'what the falooda'
      };

      this.setRegex();
    }

    setTargetRole(key) {
      if (key) {
        this.inputKey = key;
        return true;
      } else return false;
    }

    setTargetNode(new_target) {
      if (new_target) this.targetNode = new_target;
      else return;
    }

    //updating regex
    setRegex() {
      // input = input.replace(this.endRegExp, '');
      // input = input.replace(this.breakRegExp, '|');
      // input = input.replace(/^\||\|$/g, '');

      var singular_arr = Object.keys(this.unwanted_words);
      var input_str = singular_arr.join('|');
      for (let i = 0; i < singular_arr.length; i++) {
        input_str = pluralize(singular_arr[i]) + '|' + input_str;
      }

      if (input_str) {
        var new_reg_exp = '(' + input_str + ')';

        new_reg_exp = '\\b' + new_reg_exp;
        new_reg_exp = new_reg_exp + '\\b';
        this.matchRegExp = new RegExp(new_reg_exp, 'ig');
      } else return false;
    }

    createHighlightsContainer() {
      var container = document.createElement('swiggy-container');
      var focus_node = this.targetNode;
      this.highlightsBlock = document.createElement('div');

      //hsBlock.id = 'hsBlock';
      this.highlightsBlock.classList = 'hs-block';
      container.classList = 'swiggy-hs-container';
      container.appendChild(this.highlightsBlock);

      focus_node.parentNode.insertBefore(container, focus_node.nextSibling);
    }

    createHighlights() {
      this.isCardFocus = this.ishighlightFocus = false;
      this.hideReplacementCard();

      this.highlights.map(hs => {
        var hs_elem = document.createElement(this.hiliteTag);
        hs_elem.classList.add('swiggy-highlights');
        hs_elem.style.top = hs.top + 'px';
        hs_elem.style.left = hs.left + 'px';
        hs_elem.style.width = hs.width + 'px';
        hs_elem.style.height = hs.height + 'px';
        this.highlightsBlock.appendChild(hs_elem);
      });
    }

    showReplacementCard(pos) {
      var bad_word = this.focusBadWord;
      var good_word = '';
      this.card_elem.style.top = pos.top + 2 + 'px';
      this.card_elem.style.left = pos.left - 90 + 'px';

      //=================== THIS CAN BE OPTIMIZED -- USE THE HIGHLIGHTS POSITIONS INSTEAD CARD'S POSITION =======================
      var card_bounding = this.card_elem.getBoundingClientRect();

      if (card_bounding.right >= (window.innerWidth || document.documentElement.clientWidth)) {
        this.card_elem.style.left = `${pos.left - card_bounding.width}px`;
      }

      if (card_bounding.bottom >= (window.innerHeight || document.documentElement.clientHeight)) {
        this.card_elem.style.top = `${pos.top - card_bounding.height - 20}px`;
      }

      if (pluralize.isPlural(bad_word) && this.unwanted_words[pluralize.singular(bad_word)])
        good_word = pluralize(this.unwanted_words[pluralize.singular(bad_word)]);
      else good_word = this.unwanted_words[bad_word];

      document.getElementById('swiggyBadWord').textContent = bad_word;
      document.getElementById('goodWord').textContent = good_word;

      setTimeout(() => {
        if (this.ishighlightFocus) {
          this.card_elem.style.opacity = 1;
          this.card_elem.style.visibility = 'visible';
        }
      }, 300);
    }

    hideReplacementCard() {
      setTimeout(() => {
        if (!this.isCardFocus && !this.ishighlightFocus) {
          this.card_elem.style.opacity = 0;
          this.card_elem.style.visibility = 'hidden';
        }
      }, 500);
    }

    replaceWord() {
      //Reset all the highlights
      this.isReplacing = true;
      this.apply();
    }

    updateHighlights(node) {
      if (node === undefined || !node) throw 'target node is undefined';
      var alerts = this.alerts;
      if (alerts && alerts.length < 1) return;

      alerts.forEach(a => {
        const r = document.createRange();
        r.setStart(node, a.startOffset);
        r.setEnd(node, a.endOffset);

        this.ranges.push(r);
        this.highlightTexts.push(node.textContent.substring(a.startOffset, a.endOffset));
      });
    }

    calculateHighlights() {
      var target_pos = this.target_pos;
      var ranges = this.ranges;

      Object.keys(ranges).map((k, i) => {
        const rect = ranges[k].getClientRects()[0];
        if (rect) {
          this.highlights.push({
            top: rect.top - parseFloat(target_pos.top) - 1,
            left: rect.left - parseFloat(target_pos.left),
            height: rect.height,
            width: rect.width
          });
        }
      });

      this.createHighlights();
    }

    checkText(node) {
      var newString = '';
      var currentText = node.textContent;

      if (
        this.isReplacing &&
        this.focusBadWord &&
        currentText.toLowerCase().indexOf(this.focusBadWord) !== -1
      ) {
        //REPLACE CUSS WORD
        let good_word = '';
        let bad_word = this.focusBadWord;
        let regex = new RegExp('\\b(' + bad_word + ')\\b', 'gi');
        let range, selection, backspaceEvt, textEvt;
        let other_matches = [];

        if (pluralize.isPlural(bad_word) && this.unwanted_words[pluralize.singular(bad_word)])
          good_word = pluralize(this.unwanted_words[pluralize.singular(bad_word)]);
        else good_word = this.unwanted_words[bad_word];

        //FIND ALL THE OCURRENCES OF CUSS WORDS THAT CONTAINS bad_word AND STORING THERE OFFSETS IN other_matches
        for (var key in this.unwanted_words) {
          if (key == bad_word) continue;
          if (regex.test(key)) {
            let reg2 = new RegExp('\\b(' + key + ')\\b', 'ig');
            var current = reg2.exec(currentText);
            while (current != null) {
              other_matches.push([current.index, current.index + key.length - 1]);
              current = reg2.exec(currentText);
            }
          }
        }

        //REPLACING ONLY THE bad_word IF IT'S NOT PART OF other_matches
        newString = currentText.replace(regex, (...args) => {
          let len = other_matches.length;
          if (!len) return good_word;
          let is_other_word = false;
          let i = args[args.length - 2];

          for (var j = 0; j < len; j++) {
            if (i >= other_matches[j][0] && i <= other_matches[j][1]) {
              is_other_word = true;
            }
          }

          if (is_other_word) return args[0];
          else return good_word;
        });

        this.targetNode.focus();

        //SELECT ALL THE TEXT OF THE NODE
        if (document.body.createTextRange) {
          range = document.body.createTextRange();
          range.moveToElementText(node.parentNode);
          range.select();
        } else if (window.getSelection) {
          selection = window.getSelection();
          range = document.createRange();
          range.selectNodeContents(node.parentNode);
          selection.removeAllRanges();
          selection.addRange(range);
        }

        // backspaceEvt = document.createEvent('Events');
        // backspaceEvt.initEvent('keydown', true, true);
        // backspaceEvt.view = window;
        // backspaceEvt.keyCode = 8;
        // backspaceEvt.charCode = 'Backspace';
        // node.dispatchEvent(backspaceEvt);

        //REMOVE ALL THE TEXT OF THE NODE
        backspaceEvt = new Event('keydown', {
          bubbles: true,
          cancelable: true,
          keyCode: 8,
          charCode: 'Backspace'
        });
        node.dispatchEvent(backspaceEvt);

        //OLD WAY
        // textEvt = document.createEvent('TextEvent');
        // textEvt.initTextEvent('textInput', true, true, window, newString);
        // node.dispatchEvent(textEvt);

        //ADD THE NEW TEXT
        textEvt = new Event('input', {
          bubbles: true,
          cancelable: true
        });
        node.textContent = newString;
        node.dispatchEvent(textEvt);

        //SET CURSOR AT THE END OF CURRENT NODE
        range.setStart(node, newString.length);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      currentText = node.textContent;
      if (newString) currentText = newString;
      if (!this.matchRegExp) return [];

      //CHECK SUPPORT FOR MULTI WORDS CUSS WORDS
      this.alerts = [];
      let id = 0;
      var match = this.matchRegExp.exec(currentText);

      while (match != null) {
        this.alerts.push({
          id: (id++).toString(),
          startOffset: match.index,
          endOffset: match.index + match[0].length
        });

        match = this.matchRegExp.exec(currentText);
      }

      this.updateHighlights(node);
    }

    traverseCheck(node) {
      if (node.hasChildNodes()) {
        for (var i = 0; i < node.childNodes.length; i++) {
          let child_node = node.childNodes[i];
          if (child_node.nodeType === 1 && child_node.classList.contains('gmail_quote')) continue;

          this.traverseCheck(child_node);
        }
      } else if (node.nodeType == 3) {
        this.checkText(node);
      } else if (node.tagName === 'INPUT') {
        return;
        console.log('THIS IS AN INPUT');
      }
    }

    // remove highlighted tags
    remove() {
      var arr = document.getElementsByTagName(this.hiliteTag);
      var len = arr.length;
      var count, el;

      for (count = 0; count < len; count++) {
        el = arr[0];
        el.remove();
      }
    }

    apply() {
      this.remove();
      this.highlights = [];
      this.highlightTexts = [];
      this.ranges = [];
      var input = this.targetNode[this.inputKey];

      if (
        input === undefined ||
        !(input = input.replace(/(^\s+|\s+$)/g, '') || Object.keys(this.unwanted_words).length < 1)
      ) {
        return;
      }

      this.traverseCheck(this.targetNode);
      this.calculateHighlights();
      if (this.isReplacing) {
        this.isReplacing = false;
        recalculateHsContainer();
        this.apply();
      }

      // .then(res => {
      //   //console.log('HIGHLIGHTS : ', this.highlights);
      // })
      // .catch(err => {
      //   console.log('Error in text : ', err);
      // });
    }
  }

  createCardPopup();
  var cuss_filter = new CussFilter();
  cuss_filter.getBadWords();

  //var all_iframes = document.getElementsByTagName('iframe');

  document.addEventListener('keyup', keyUpHandler, true);
  document.addEventListener('scroll', recalculateHsContainer, true);
  window.addEventListener('resize', recalculateHsContainer, true);

  function createCardPopup() {
    var card_elem = document.createElement('filter-card');
    var right_block = document.createElement('DIV');
    var left_block = document.createElement('DIV');
    var brand_logo = document.createElement('img');
    var desc_text = document.createElement('p');
    var good_word = document.createElement('DIV');
    var bad_word = document.createElement('DIV');
    var replace_btn = document.createElement('DIV');

    card_elem.id = 'filterCard';
    card_elem.classList = 'swiggy-card';
    card_elem.addEventListener('mouseenter', e => {
      cuss_filter.isCardFocus = true;
      //console.log(' card mouse enter', e);
    });

    card_elem.addEventListener('mouseleave', () => {
      cuss_filter.isCardFocus = false;
      //console.log(' card mouse leave');
      cuss_filter.hideReplacementCard();
    });

    //CARD BLOCKS
    brand_logo.src = chrome.runtime.getURL('./assets/images/swiggy-card-logo.png');
    if (brand_logo.style) {
      brand_logo.style.width = '100%';
    }

    right_block.appendChild(brand_logo);
    right_block.classList = 'swiggy-card-right';
    
    left_block.appendChild(bad_word);
    left_block.appendChild(replace_btn);
    left_block.classList = 'swiggy-card-left';

    //CARD DESCRIPTION
    desc_text.textContent = "Let's play nice? Replace word with";
    desc_text.classList = 'description';
    bad_word.id = 'swiggyBadWord';
    bad_word.classList = 'cuss-word';

    //CARD REPLACE BUTTON
    replace_btn.classList = 'replace-btn';
    replace_btn.addEventListener('click', () => {
      if (cuss_filter.focusBadWord) {
        cuss_filter.replaceWord();
      }
    });
    good_word.id = 'goodWord';
    good_word.classList = 'good-word';
    replace_btn.appendChild(desc_text);
    replace_btn.appendChild(good_word);

    card_elem.appendChild(left_block);
    //card_elem.appendChild(bad_word);
    //card_elem.appendChild(replace_btn);
    card_elem.appendChild(right_block);
    document.body.appendChild(card_elem);
  }

  function keyUpHandler(e) {
    var focus_node = e.target;

    e.stopPropagation();
    if (focus_node.tagName === 'TEXTAREA' || focus_node.tagName === 'INPUT') {
      return;
      cuss_filter.setTargetRole('value');
    } else if (focus_node.tagName === 'DIV' && focus_node.getAttribute('contenteditable')) {
      cuss_filter.setTargetRole('textContent');
    } else {
      return;
    }

    //NEW KEY-UP CONTAINER IN FOCUS
    if (cuss_filter.targetNode !== focus_node) {
      cuss_filter.setTargetNode(focus_node);
      //focus_node.id = 'swiggy-id';
      cuss_filter.createHighlightsContainer();
      focus_node.addEventListener('mousemove', targetMousemove, true);
      focus_node.addEventListener('scroll', targetScroll, true);
      //addPolling();
    }

    recalculateHsContainer();
    cuss_filter.apply();
  }

  // function addPolling() {
  //   var isPolling = true;
  //   var poll = setInterval(() => {
  //     isPolling = recalculateHsContainer();
  //     console.log(isPolling);
  //     if (!isPolling) {
  //       clearInterval(poll);
  //       cuss_filter.remove();
  //       //cuss_filter.targetNode.removeEventListener(targetMousemove);
  //       cuss_filter.setTargetNode(document.body);
  //     }
  //   }, 70);
  // }

  function targetScroll(e) {
    var current_scrollTop = e.target.scrollTop;
    var current_scrollLeft = e.target.scrollLeft;
    var ranges = cuss_filter.ranges;
    //cuss_filter.apply(cuss_filter.targetNode[cuss_filter.inputKey]);
    cuss_filter.remove();
    cuss_filter.highlights = [];
    cuss_filter.calculateHighlights();
  }

  function recalculateHsContainer() {
    var focus_node = cuss_filter.targetNode;
    var parent_node = focus_node.parentNode;
    var hs_block = cuss_filter.highlightsBlock;

    if (!focus_node || !hs_block) {
      return false;
    }

    var target_pos = focus_node.getBoundingClientRect();
    cuss_filter.target_pos = target_pos;

    // hs_block.style.left = target_pos.left + document.documentElement.scrollLeft + 'px';
    // hs_block.style.top = target_pos.top + document.documentElement.scrollTop + 'px';
    // hs_block.style.left = focus_node.offsetLeft+ parseFloat(p_left) + 'px';
    // hs_block.style.top = focus_node.offsetTop + parseFloat(p_top) + 'px';

    if (
      parent_node.getAttribute('data-control-name') === 'share.add_commentary' &&
      parent_node.style.position !== 'relative'
    ) {
      //EDGE CASE - Linkedin home post block
      parent_node.style.position = 'relative';
      let p_top = window.getComputedStyle(parent_node).paddingTop;
      let p_left = window.getComputedStyle(parent_node).paddingLeft;
      hs_block.style.left = parseFloat(p_left) + 'px';
      hs_block.style.top = parseFloat(p_top) + 'px';
    } else {
      hs_block.style.left = focus_node.offsetLeft + 'px';
      hs_block.style.top = focus_node.offsetTop + 'px';
    }

    hs_block.style.width = target_pos.width + 'px';
    //EDGE CASE - needed extra height in whatsapp div
    if (window.location.host.includes('web.whatsapp.com')) hs_block.style.height = target_pos.height + 6 + 'px';
    else hs_block.style.height = target_pos.height + 1 + 'px';

    return true;
  }

  function targetMousemove(e) {
    if (cuss_filter.highlights.length < 1) return;
    var target_top = cuss_filter.target_pos.top;
    var target_left = cuss_filter.target_pos.left;
    var posX = e.clientX - target_left;
    var posY = e.clientY - target_top;
    var card_pos;
    var hs = [...cuss_filter.highlights];
    var hs_texts = [...cuss_filter.highlightTexts];

    for (let i = 0; i < hs.length; i++) {
      if (
        posX > hs[i].left &&
        posX < hs[i].left + hs[i].width &&
        posY > hs[i].top &&
        posY < hs[i].top + hs[i].height
      ) {
        card_pos = {
          top: hs[i].top + hs[i].height + target_top,
          left: hs[i].left + target_left
        };

        cuss_filter.focusBadWord = hs_texts[i].toLocaleLowerCase();
        cuss_filter.ishighlightFocus = true;
        cuss_filter.showReplacementCard(card_pos);
        break;
      } else {
        cuss_filter.ishighlightFocus = false;
        cuss_filter.hideReplacementCard();
      }
    }
  }
})();
