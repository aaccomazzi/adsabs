// Generated by CoffeeScript 1.6.1
(function() {
  var $, Postable, PostableList, PostableListView, PostableView, h, make_postable_link, parse_fqin, parse_userinfo, prefix, root, w,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    _this = this;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  $ = jQuery;

  console.log("In userprofile");

  h = teacup;

  w = widgets;

  prefix = GlobalVariables.ADS_PREFIX + "/adsgut";

  parse_fqin = function(fqin) {
    var vals;
    vals = fqin.split(':');
    return vals[-1 + vals.length];
  };

  parse_userinfo = function(data) {
    var e, p, pinfqin, postablesin, postablesinvitedto, postablesowned, powfqin, priv, publ, userdict, _i, _len, _ref, _ref1;
    publ = "adsgut/group:public";
    priv = data.user.nick + "/group:default";
    postablesin = [];
    postablesowned = data.user.postablesowned;
    powfqin = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = postablesowned.length; _i < _len; _i++) {
        p = postablesowned[_i];
        _results.push(p.fqpn);
      }
      return _results;
    })();
    pinfqin = (function() {
      var _i, _len, _ref, _results;
      _ref = data.user.postablesin;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        _results.push(p.fqpn);
      }
      return _results;
    })();
    console.log("JJJ", powfqin, pinfqin);
    pinfqin = _.difference(pinfqin, powfqin);
    console.log("POSARASTAIN", pinfqin);
    _ref = data.user.postablesin;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      if (_ref1 = p.fqpn, __indexOf.call(pinfqin, _ref1) >= 0) {
        postablesin.push(p);
      }
    }
    postablesinvitedto = data.user.postablesinvitedto;
    console.log("POSARASTAIN", postablesin);
    userdict = {
      groupsin: (function() {
        var _j, _len1, _ref2, _results;
        _results = [];
        for (_j = 0, _len1 = postablesin.length; _j < _len1; _j++) {
          e = postablesin[_j];
          if (e.ptype === 'group' && ((_ref2 = e.fqpn) !== publ && _ref2 !== priv)) {
            _results.push(e.fqpn);
          }
        }
        return _results;
      })(),
      groupsowned: (function() {
        var _j, _len1, _ref2, _results;
        _results = [];
        for (_j = 0, _len1 = postablesowned.length; _j < _len1; _j++) {
          e = postablesowned[_j];
          if (e.ptype === 'group' && ((_ref2 = e.fqpn) !== publ && _ref2 !== priv)) {
            _results.push(e.fqpn);
          }
        }
        return _results;
      })(),
      groupsinvitedto: (function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = postablesinvitedto.length; _j < _len1; _j++) {
          e = postablesinvitedto[_j];
          if (e.ptype === 'group') {
            _results.push(e.fqpn);
          }
        }
        return _results;
      })(),
      userinfo: {
        nick: data.user.nick,
        email: data.user.adsid,
        whenjoined: data.user.basic.whencreated,
        name: data.user.basic.name
      }
    };
    userdict.librariesin = _.union((function() {
      var _j, _len1, _results;
      _results = [];
      for (_j = 0, _len1 = postablesin.length; _j < _len1; _j++) {
        e = postablesin[_j];
        if (e.ptype === 'library') {
          _results.push(e.fqpn);
        }
      }
      return _results;
    })(), userdict.groupsin);
    userdict.librariesowned = _.union((function() {
      var _j, _len1, _results;
      _results = [];
      for (_j = 0, _len1 = postablesowned.length; _j < _len1; _j++) {
        e = postablesowned[_j];
        if (e.ptype === 'library') {
          _results.push(e.fqpn);
        }
      }
      return _results;
    })(), userdict.groupsowned);
    userdict.librariesinvitedto = _.union((function() {
      var _j, _len1, _results;
      _results = [];
      for (_j = 0, _len1 = postablesinvitedto.length; _j < _len1; _j++) {
        e = postablesinvitedto[_j];
        if (e.ptype === 'library') {
          _results.push(e.fqpn);
        }
      }
      return _results;
    })(), userdict.groupsinvitedto);
    console.log("LIBGRPSSIN", userdict.librariesin);
    return userdict;
  };

  make_postable_link = h.renderable(function(fqpn, libmode, ownermode) {
    if (libmode == null) {
      libmode = false;
    }
    if (ownermode == null) {
      ownermode = false;
    }
    if (libmode === "lib") {
      h.a({
        href: prefix + ("/postable/" + fqpn + "/filter/html")
      }, function() {
        return h.text(parse_fqin(fqpn));
      });
      h.raw("&nbsp;(");
      h.a({
        href: prefix + ("/postable/" + fqpn + "/profile/html")
      }, function() {
        if (ownermode) {
          return h.text("admin");
        } else {
          return h.text("info");
        }
      });
      return h.raw(")");
    } else if (libmode === "group") {
      h.a({
        href: prefix + ("/postable/" + fqpn + "/profile/html")
      }, function() {
        return h.text(parse_fqin(fqpn));
      });
      h.raw("&nbsp;(");
      h.a({
        href: prefix + ("/postable/" + fqpn + "/filter/html")
      }, function() {
        return h.text("library");
      });
      return h.raw(")");
    } else {
      return h.a({
        href: prefix + ("/postable/" + fqpn + "/profile/html")
      }, function() {
        return h.text(parse_fqin(fqpn));
      });
    }
  });

  Postable = (function(_super) {

    __extends(Postable, _super);

    function Postable() {
      return Postable.__super__.constructor.apply(this, arguments);
    }

    return Postable;

  })(Backbone.Model);

  PostableView = (function(_super) {

    __extends(PostableView, _super);

    function PostableView() {
      var _this = this;
      this.clickedYes = function() {
        return PostableView.prototype.clickedYes.apply(_this, arguments);
      };
      this.render = function() {
        return PostableView.prototype.render.apply(_this, arguments);
      };
      return PostableView.__super__.constructor.apply(this, arguments);
    }

    PostableView.prototype.tagName = "tr";

    PostableView.prototype.events = {
      "click .yesbtn": "clickedYes"
    };

    PostableView.prototype.initialize = function(options) {
      this.libmode = options.libmode;
      return this.ownermode = options.ownermode;
    };

    PostableView.prototype.render = function() {
      var content, libmode, ownermode;
      if (this.model.get('invite')) {
        this.$el.html(w.table_from_dict_partial(make_postable_link(this.model.get('fqpn'), libmode = false), w.single_button('Yes')));
      } else {
        content = w.one_col_table_partial(make_postable_link(this.model.get('fqpn'), libmode = this.libmode, ownermode = this.ownermode));
        console.log("CONTENT", content);
        this.$el.html(content);
      }
      return this;
    };

    PostableView.prototype.clickedYes = function() {
      var cback, eback, loc, useremail;
      loc = window.location;
      cback = function(data) {
        console.log("return data", data, loc);
        return window.location = location;
      };
      eback = function(xhr, etext) {
        console.log("ERROR", etext, loc);
        return alert('Did not succeed');
      };
      console.log("GGG", this.model, this.$el);
      useremail = this.model.get('email');
      return syncs.accept_invitation(useremail, this.model.get('fqpn'), cback, eback);
    };

    return PostableView;

  })(Backbone.View);

  PostableList = (function(_super) {

    __extends(PostableList, _super);

    function PostableList() {
      return PostableList.__super__.constructor.apply(this, arguments);
    }

    PostableList.prototype.model = Postable;

    PostableList.prototype.initialize = function(models, options) {
      this.listtype = options.listtype;
      this.invite = options.invite;
      this.nick = options.nick;
      return this.email = options.email;
    };

    return PostableList;

  })(Backbone.Collection);

  PostableListView = (function(_super) {

    __extends(PostableListView, _super);

    function PostableListView() {
      var _this = this;
      this.render = function() {
        return PostableListView.prototype.render.apply(_this, arguments);
      };
      return PostableListView.__super__.constructor.apply(this, arguments);
    }

    PostableListView.prototype.tmap = {
      "in": "In",
      ow: "Owned",
      iv: "Invited"
    };

    PostableListView.prototype.initialize = function(options) {
      this.$el = options.$e_el;
      this.libmode = options.libmode;
      return this.ownermode = options.ownermode;
    };

    PostableListView.prototype.render = function() {
      var $widget, m, rendered, v, views;
      views = (function() {
        var _i, _len, _ref, _results;
        _ref = this.collection.models;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          m = _ref[_i];
          _results.push(new PostableView({
            model: m,
            libmode: this.libmode,
            ownermode: this.ownermode
          }));
        }
        return _results;
      }).call(this);
      rendered = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = views.length; _i < _len; _i++) {
          v = views[_i];
          _results.push(v.render().el);
        }
        return _results;
      })();
      console.log("RENDER1", rendered);
      console.log("RENDER2");
      if (this.collection.invite) {
        $widget = w.$table_from_dict("Invitations", "Accept?", rendered);
      } else {
        $widget = w.$one_col_table(this.tmap[this.collection.listtype], rendered);
      }
      this.$el.append($widget);
      return this;
    };

    return PostableListView;

  })(Backbone.View);

  root.userprofile = {
    parse_userinfo: parse_userinfo,
    Postable: Postable,
    PostableList: PostableList,
    PostableListView: PostableListView
  };

}).call(this);
